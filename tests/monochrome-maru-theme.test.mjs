import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const css=read('css/monochrome-maru-theme.css'),index=read('index.html'),base=read('css/dusty-wedding-theme.css')
assert.match(index,/data-wistia-theme="monochrome" data-wistia-typography="pretendard-noir"/)
assert.doesNotMatch(index,/hangeul_static\/css\/maru-buri.css/)
assert.match(index,/pretendardvariable-dynamic-subset.min.css/)
assert.doesNotMatch(index,/fonts.googleapis.com\/css2\?family=Noto/)
const sheets=[...index.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m=>m[1])
assert.deepEqual(sheets.slice(-15),[
 'css/monochrome-maru-theme.css?v=20261014-detail-polish-16j',
 'css/functional-card-clarity.css?v=20261014-detail-polish-16j',
 'css/approved-home-thumbnails.css?v=20261014-detail-polish-16j',
 'css/noir-minimal.css?v=20261014-detail-polish-16j',
 'css/studio-graphics.css?v=20261014-detail-polish-16j',
 'css/luxury-finish.css?v=20261014-detail-polish-16j',
 'css/detail-consistency.css?v=20261014-detail-polish-16j',
 'css/svg-interface.css?v=20261014-detail-polish-16j',
 'css/svg-player-controls.css?v=20261014-detail-polish-16j',
 'css/booking-availability.css?v=20261014-detail-polish-16j',
 'css/detail-section-layout.css?v=20261014-detail-polish-16j',
 'css/heading-font.css?v=20261014-detail-polish-16j',
 'css/kakao-inquiry.css?v=20261014-detail-polish-16j',
 'css/detail-point-16f.css?v=20261014-detail-polish-16j',
 'css/detail-point-16i.css?v=20261014-detail-polish-16j'
])
for(const color of ['#111111','#FFFFFF','#E8E8E8'])assert.ok(css.includes(color))
assert.doesNotMatch(css,/#EFA8B8|#EFE3D5|#7B625B|#FF4F9A|#171717|#F5F5F5/)
assert.match(read('css/heading-font.css'),/--font-heading:"MaruBuri",serif/)
assert.match(css,/--font-body:"Pretendard Variable","Pretendard",sans-serif/)
assert.match(css,/h1,h2,h3,h4,h5,h6/)
assert.match(css,/button,input,select,textarea/)
assert.doesNotMatch(css,/[{;]\s*(?:width|height|padding|margin|position|display|touch-action|pointer-events|transform|font-size|line-height|gap|grid-template-columns)\s*:/,'colour/font change must not redesign or hide the approved layout')
assert.match(base,/html:is\(\[data-wistia-theme="dusty-wedding"\],\[data-wistia-theme="monochrome"\]\)/)
assert.match(base,/\.mas-selection \.mas-variant\{padding:18px 16px!important;gap:12px/)
assert.match(css,/\.mas-gallery\[data-mobile-gallery\] \.mas-gallery-caption/)
assert.match(css,/\.info-faq-group h2[^\n]*background:var\(--mono-gray\)!important;color:var\(--mono-black\)!important/,'FAQ headings must not inherit black on their old dark background')
assert.match(css,/\.info-process \.booking-guide article/)
assert.doesNotMatch(css,/filter:|img\s*\{/,'actual media and brand mark must not be recoloured')
for(const route of ['contact','detail/solo','detail/duo','detail/duet-film','event/solo','event/duo','event/duet-film','info/location','info/about','info/faq','info/process','events']){
 const page=read(route+'.html')
 assert.match(page,/monochrome-maru-theme.css\?v=20261014-detail-polish-16j/)
 assert.match(page,/data-wistia-typography="pretendard-noir"/)
}
assert.match(read('js/contact-form.js'),/작성한 내용으로 카카오톡 문의하기/)
assert.match(read('js/contact-form.js'),/작성한 내용으로 카카오톡 문의하기'/)
const lum=h=>{const c=h.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
for(const light of ['FFFFFF','E8E8E8'])assert.ok((lum(light)+.05)/(lum('111111')+.05)>=7)
console.log('Legacy monochrome geometry, active sans successor, genuine media and preserved inquiry flow: passed')

assert.match(read('assets/img/studio-illustrations/recording-join.svg'),/fill="#38332d"/);assert.match(read('assets/img/studio-illustrations/recording-join.svg'),/fill="#f3efe7"/)
