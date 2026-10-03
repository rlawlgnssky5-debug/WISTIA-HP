import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve, dirname } from 'node:path'

const require = createRequire(import.meta.url)
const seo = require('../js/seo-meta.js')
const root = resolve(import.meta.dirname, '..')
const template = readFileSync(resolve(root, 'index.html'), 'utf8')
const origin = 'https://www.wistiastudio.com'
const products = ['solo', 'duo', 'solo-film', 'wedding', 'proposal', 'duet-film']

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
function page(path, data, options={}) {
  if (!data?.title || !data?.description) throw new Error(`missing SEO copy for ${path}`)
  const url = origin + path
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(data.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escapeHtml(data.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escapeHtml(data.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escapeHtml(data.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${url}$2`)
  if (options.robots) {
    html = html.replace('<meta name="theme-color" content="#ffffff">', `<meta name="theme-color" content="#ffffff">\n  <meta name="robots" content="${escapeHtml(options.robots)}">`)
  }
  const target = resolve(root, path.slice(1) + '.html')
  mkdirSync(dirname(target), {recursive:true})
  writeFileSync(target, html)
  console.log(path)
}

for (const product of products) {
  const retired = ['wedding', 'proposal', 'solo-film'].includes(product)
  page(`/detail/${product}`, retired ? seo.home : seo.detail[product], retired ? {robots:'noindex, follow'} : {})
  page(`/event/${product}`, retired ? seo.home : seo.event, retired ? {robots:'noindex, follow'} : {})
}
page('/info/location', seo.location)
// Home section links must also resolve on direct visits and refreshes.
for (const section of ['homeServices','homeCases','homeLocation','homeProcess']) {
  page(`/section/${section}`, seo.home, {robots:'noindex, follow'})
}
for (const [path, data] of Object.entries(seo.noindex)) page(path, data, {robots:'noindex, follow'})
