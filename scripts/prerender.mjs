import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve, dirname } from 'node:path'
import { expandBundledHtml, buildCssBundles } from './build-css-bundle.mjs'

const require = createRequire(import.meta.url)
const seo = require('../js/seo-meta.js')
const root = resolve(import.meta.dirname, '..')
const template = expandBundledHtml(readFileSync(resolve(root, 'index.html'), 'utf8'))
const origin = 'https://wistiastudio.com'
const detailProducts = ['solo']
const eventProducts = ['solo', 'duo']

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
function page(path, data, options={}) {
  if (!data?.title || !data?.description) throw new Error(`missing SEO copy for ${path}`)
  const url = origin + path
  let html = template
    .replace(/  <link rel="preload" as="image" href="\/assets\/img\/ar-detail\/[^"]+" fetchpriority="high">\r?\n/g, '')
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(data.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escapeHtml(data.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escapeHtml(data.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escapeHtml(data.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${url}$2`)
  if (options.robots) {
    html = html.replace(/(<meta name="theme-color" content="[^"]+">)/, `$1\n  <meta name="robots" content="${escapeHtml(options.robots)}">`)
  }
  if (path === '/detail/solo' && !html.includes('css/detail-solo-16j.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="css/detail-solo-16j.css?v=20261017-hotfix2">\n</head>')
  }
  const hero = /^\/(detail|event)\/(solo|duo)$/.test(path)
  if (hero) {
    const poster = /^\/(detail|event)\/duo$/.test(path) ? 'duet-live-proof-v2.jpg' : 'solo-live-proof.jpg'
    html = html.replace('</head>', `  <link rel="preload" as="image" href="/assets/img/ar-detail/${poster}" fetchpriority="high">\n</head>`)
  }
  const target = resolve(root, path.slice(1) + '.html')
  mkdirSync(dirname(target), {recursive:true})
  writeFileSync(target, html)
  console.log(path)
}

for (const product of detailProducts) {
  page(`/detail/${product}`, seo.detail[product])
}
for (const product of eventProducts) {
  page(`/event/${product}`, product === 'solo' ? {...seo.event, title:'얼마일까 | 위스티아 축가 사전녹음 가격'} : seo.event)
}
page('/info/location', seo.location)
page('/info/faq', {title:'자주 묻는 질문 | 위스티아',description:'곡 선택과 녹음 준비부터 AR 본식 사용, 완성 음원 전달과 수정, 스튜디오 방문까지 편하게 확인해 보세요'})
page('/events', {title:'후기 참여 이벤트 | 위스티아',description:'후기 페이백 이벤트 2가지, 각 30,000원 · 최대 60,000원 · 참여 조건 확인 후 카카오톡으로 환급을 안내해 드려요'})
for (const [path, data] of Object.entries(seo.noindex)) page(path, data, {robots:'noindex, follow'})
buildCssBundles()
