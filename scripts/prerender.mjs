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
function page(path, data) {
  const url = origin + path
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(data.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escapeHtml(data.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escapeHtml(data.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escapeHtml(data.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${url}$2`)
  const target = resolve(root, path.slice(1) + '.html')
  mkdirSync(dirname(target), {recursive:true})
  writeFileSync(target, html)
  console.log(path)
}

for (const product of products) {
  page(`/detail/${product}`, seo.detail[product] || seo.detail.wedding)
  page(`/event/${product}`, seo.event)
}
page('/info/location', seo.location)
