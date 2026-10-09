import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const index=read('index.html'),css=read('css/dusty-wedding-theme.css')
assert.match(index,/<html data-build="20261010-detail-polish-11" lang="ko" data-wistia-theme="monochrome" data-wistia-typography="pretendard-noir" data-wistia-palette="noir-minimal">/)
assert.match(index,/<meta name="theme-color" content="#F5F4F0">/)
const sheets=[...index.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m=>m[1])
assert.deepEqual(sheets.slice(-13),[
 'css/dusty-wedding-theme.css?v=20261005-monochrome-maru-1',
 'css/inquiry-choice-editor.css?v=20261005-inquiry-choice-editor-1',
 'css/monochrome-maru-theme.css?v=20261005-monochrome-maru-1',
 'css/functional-card-clarity.css?v=20261005-detail-comments14-1',
 'css/approved-home-thumbnails.css?v=20261006-approved-home-thumbnails-1',
 'css/noir-minimal.css?v=20261006-noir-minimal-1',
 'css/studio-graphics.css?v=20261006-studio-graphics-1',
 'css/luxury-finish.css?v=20261006-reviews-five-1',
 'css/detail-consistency.css?v=20261006-benefit-boxes-1',
 'css/svg-interface.css?v=20261007-svg-interface-1',
 'css/svg-player-controls.css?v=20261007-svg-interface-1',
 'css/booking-availability.css?v=20261010-detail-polish-11',
 'css/detail-section-layout.css?v=20261010-detail-polish-11'
])
for(const hex of ['#EFA8B8','#EFE3D5','#7B625B','#FBF8F4','#3C302C'])assert.ok(css.includes(hex))
assert.match(css,/\.we-home \.we-service\{[^\n]*border-radius:28px;box-shadow:none!important/)
assert.match(css,/\.we-home \.we-hero\{[^\n]*background:var\(--dusty-pink\)/)
assert.match(css,/\.consultation-flow \.consultation-fields\{background:transparent!important/)
assert.match(css,/\.consultation-flow \.booking-calculator\{background:transparent!important/)
assert.match(css,/\.inquiry-actions :is\(\.contact-submit,\.inquiry-direct\)\{border-radius:20px!important/)
assert.match(css,/\.bap-tab\.active\[data-mode="before"\]\{background:var\(--warm-brown\)/)
assert.match(css,/\.bap-tab\.active\[data-mode="after"\]\{background:var\(--dusty-pink\)/)
assert.doesNotMatch(css,/touch-action:\s*none|display:\s*none|#FF4F9A|#171717|#F5F5F5/)
assert.equal((css.match(/pointer-events:none/g)||[]).length,1,'only the non-interactive video caption may ignore pointer events')
for(const route of ['contact','detail/solo','detail/duo','detail/duet-film','event/duet-film','info/location'])assert.match(read(route+'.html'),/dusty-wedding-theme\.css/)
const luminance=hex=>{const rgb=hex.match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722}
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
for(const pair of [['7B625B','FBF8F4'],['3C302C','EFA8B8'],['3C302C','EFE3D5']])assert.ok(ratio(...pair)>=4.5)
console.log('Dusty identity, warm neutral base, soft cards, preserved touch paths, distinct player states and readable CTA: passed')
