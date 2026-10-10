import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const index=read('index.html'),css=read('css/pink-black-theme.css')
assert.match(index,/<html data-build="20261010-detail-polish-12d" lang="ko" data-wistia-theme="monochrome" data-wistia-typography="pretendard-noir" data-wistia-palette="noir-minimal">/)
assert.match(index,/<meta name="theme-color" content="#F5F4F0">/)
const sheets=[...index.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m=>m[1])
assert.ok(sheets.includes('css/pink-black-theme.css?v=20261005-pink-black-preview-1'))
assert.deepEqual(sheets.slice(-15),[
 'css/dusty-wedding-theme.css?v=20261005-monochrome-maru-1',
 'css/inquiry-choice-editor.css?v=20261005-inquiry-choice-editor-1',
 'css/monochrome-maru-theme.css?v=20261010-detail-polish-12d',
 'css/functional-card-clarity.css?v=20261005-detail-comments14-1',
 'css/approved-home-thumbnails.css?v=20261006-approved-home-thumbnails-1',
 'css/noir-minimal.css?v=20261010-detail-polish-12d',
 'css/studio-graphics.css?v=20261006-studio-graphics-1',
 'css/luxury-finish.css?v=20261006-reviews-five-1',
 'css/detail-consistency.css?v=20261006-benefit-boxes-1',
 'css/svg-interface.css?v=20261007-svg-interface-1',
 'css/svg-player-controls.css?v=20261007-svg-interface-1',
 'css/booking-availability.css?v=20261010-detail-polish-12d',
 'css/detail-section-layout.css?v=20261010-detail-polish-12d',
 'css/heading-font.css?v=20261010-detail-polish-12d',
 'css/kakao-inquiry.css?v=20261010-detail-polish-12d'
])
for(const color of ['#FF4F9A','#171717','#F5F5F5'])assert.ok(css.includes(color))
assert.doesNotMatch(css,/[{;]\s*(?:width|height|min-width|min-height|max-width|max-height|padding|margin|font-size|font-family|position|display|transform|gap|grid-template-columns)\s*:/i,'palette must not change layout or typography')
assert.match(css,/mas-gallery-dots button\[aria-pressed="true"\]::after/)
assert.match(css,/bap-tab\.active\[data-mode="before"\]/)
assert.match(css,/--ba-wave-after:var\(--brand-pink\)/)
assert.match(read('js/before-after.js'),/progress\?waveColors\[mode\]:waveColors\.rest/)
for(const route of ['contact','detail/solo','detail/duo','detail/duet-film','info/location','events'])assert.match(read(route+'.html'),/pink-black-theme\.css/)
assert.match(read('contact.html'),/noindex, follow/)
assert.match(read('detail/solo-film.html'),/noindex, follow/)
const luminance=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722}
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
assert.ok(ratio('171717','FF4F9A')>=4.5)
assert.ok(ratio('171717','F5F5F5')>=7)
console.log('Palette isolation, three colours, unchanged layout, player states, static SEO and contrast: passed',ratio('171717','FF4F9A').toFixed(2),ratio('171717','F5F5F5').toFixed(2))
