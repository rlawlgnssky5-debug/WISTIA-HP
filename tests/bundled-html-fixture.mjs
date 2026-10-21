import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { mobileCanvasCss } from '../scripts/mobile-canvas-css.mjs'

// Let legacy assertions inspect the original stylesheet order/cache queries.
// First prove those sources are actually served by the page's current bundle.
export function readWithBundleSources(file) {
  const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
  let html = read(file)
  if (!file.endsWith('.html')) return html
  const manifest = JSON.parse(read('css/bundles.json'))
  const page = manifest.pages[file]
  if (!page) return html
  const tag = `<link rel="stylesheet" href="${page.href}">`
  assert.ok(html.includes(tag), `${file}: manifest bundle is served`)
  const bundle = read(page.bundle)
  assert.equal(createHash('sha256').update(bundle).digest('hex').slice(0, 8), page.bundle.match(/bundle-(\w+)\.css/)[1])
  assert.deepEqual(page.sources, manifest.bundles[page.bundle].sources)
  const parts = page.sources.map(href => {
    const path = href.replace(/^\//, '').split('?')[0]
    let text = read(path).replace(/^\uFEFF/, '').replace(/^@charset "utf-8";\r?\n?/i, '')
    if (!text.endsWith('\n')) text += '\n'
    return `/* == ${path} == */\n${mobileCanvasCss(text, path)}`
  })
  assert.equal(bundle.replace(/^@charset "UTF-8";\n/, ''), parts.join(''), `${file}: exact source contents and order`)
  return html.replace(tag, page.sources.map(href => `<link rel="stylesheet" href="${href}">`).join('\n  '))
}
