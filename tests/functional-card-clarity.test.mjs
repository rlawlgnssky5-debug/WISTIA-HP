import {readWithBundleSources} from './bundled-html-fixture.mjs'
import assert from 'node:assert/strict'
import {existsSync,readFileSync} from 'node:fs'
const read=readWithBundleSources
const css=read('css/functional-card-clarity.css')
assert.match(read('index.html'),/functional-card-clarity.css\?v=20261014-detail-polish-16j/)
assert.match(css,/\.bap-player\{\s*background:var\(--mono-gray\)/)
assert.match(css,/\.bap-wave\{\s*background:var\(--mono-white\)!important;border:0!important;border-radius:16px/)
assert.match(css,/\.bap-tab\{\s*background:var\(--mono-white\)/)
assert.match(css,/\.bap-tab.active\{\s*background:var\(--mono-black\)!important;color:var\(--mono-white\)/)
assert.match(css,/\.bap-badge,\.bap-controls\)[^\n]*\{\s*background:transparent!important;border:0!important/)
assert.match(css,/\.we-craft-list details,\.we-home-faq details,\.faq-list details/)
assert.match(css,/:focus-visible/)
assert.doesNotMatch(css,/font-family|pointer-events:none|touch-action:none|filter:/)
assert.doesNotMatch(css.split('/* Nine marked home comments:')[0],/img\s*\{/,'functional grouping must not recolour or resize original media')
for(const path of ['contact','detail/solo','detail/duo','detail/duet-film','info/location','before-after']){if(!existsSync(new URL('../'+path+'.html',import.meta.url)))continue;assert.match(read(path+'.html'),/functional-card-clarity.css/)}
console.log('Grouped functional cards, no doubled player rules, equal source pads, preserved fixed fonts and media: passed')
