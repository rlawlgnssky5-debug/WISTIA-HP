import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { inspectCss, stylesheetTokens } from '../scripts/build-css-bundle.mjs'
const read = name => readFileSync(new URL('../'+name, import.meta.url), 'utf8')
const manifest = JSON.parse(read('css/bundles.json'))
test('all nine live entries load the exact ordered bundle and the same current script cache', () => {
 assert.equal(Object.keys(manifest.pages).length, 9)
 for (const [page, entry] of Object.entries(manifest.pages)) {
  const expected = entry.sources.map(href => {
   const file = href.replace(/^\//, '').split('?')[0]
   return '/* == '+file+' == */\n'+inspectCss(read(file), file).body
  }).join('')
  assert.equal(createHash('sha256').update(read(entry.bundle)).digest('hex'), createHash('sha256').update(expected).digest('hex'), page+' exact CSS bytes')
  assert.ok(entry.bundle.includes(createHash('sha256').update(expected).digest('hex').slice(0,8)))
  const html = read(page), styles = stylesheetTokens(html).filter(t => t.href)
  assert.equal(styles.filter(t => t.href.includes('bundle-')).length, 1)
  assert.ok(styles.find(t => t.href.includes(entry.bundle)))
  assert.ok(styles.at(-1).href.includes('canvas-780.css'), page+' final canvas override')
  for (const script of ['app','package-pricing','booking-wizard','booking-draft','booking-availability','seo-meta','contact-form','detail-pc-background']) assert.ok(html.includes('js/'+script+'.js?v='+manifest.cacheVersion), page+' '+script+' current cache')
  assert.match(html, /data-seo-fallback style="[^"]*clip-path:inset\(50%\)/, page+' SEO fallback hidden before JS')
 }
})
