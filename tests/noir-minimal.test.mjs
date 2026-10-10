import assert from 'node:assert/strict'
import {assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
import {assertInquiryWithoutName} from './inquiry-without-name-fixture.mjs'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const css=read('css/noir-minimal.css'),index=read('index.html')
assert.match(index,/data-wistia-palette="noir-minimal"/)
assert.match(index,/data-wistia-typography="pretendard-noir"/)
assert.match(index,/<meta name="theme-color" content="#F5F4F0">/)
assert.doesNotMatch(index,/href="css\/(?:pink-purple-lavender|olive-mustard-cream|studio-editorial).css|maru-buri.css/)
assert.ok(index.lastIndexOf('noir-minimal.css')>index.lastIndexOf('approved-home-thumbnails.css'))
for(const hex of ['#252421','#F5F4F0','#DDDCD8','#66645F'])assert.ok(css.includes(hex))
assert.doesNotMatch(css,/#FF82B2|#7657D5|#F7F1FF|#E7B928|#667044|#F2EBD9/)
assert.match(read('css/heading-font.css'),/--font-heading:"MaruBuri",serif/)
assert.match(css,/font-weight:500!important;letter-spacing:-\.035em!important/)
assert.match(css,/font-family:Georgia,"Times New Roman",serif!important;font-weight:400!important/)
assert.match(css,/border-radius:4px!important;padding:40px 26px 44px/)
assert.match(css,/border-width:2px!important;border-radius:0!important;box-shadow:none!important/)
assert.match(css,/details\{\s*background:transparent!important;border:0!important;border-top:1px solid var\(--palette-line\)!important;border-radius:0/)
assert.match(css,/\.contact-field:has\(\[aria-invalid="true"\]\)\{box-shadow:inset 4px 0 0 var\(--palette-charcoal\)!important/)
assert.match(css,/\.mas-variant.is-selected[\s\S]*box-shadow:inset 0 0 0 1px var\(--palette-charcoal\)!important/)
assert.doesNotMatch(css,/[{;]\s*(?:width|height|min-width|min-height|max-width|max-height|position|display|transform|gap|grid-template-columns|animation|transition|z-index|overflow|filter|object-fit|touch-action|pointer-events)\s*:/i,'do not rearrange/hide content, shrink touch targets, recolour photos or replace motion')
assert.doesNotMatch(css,/url\(|@import|floatingKakao|#FEE500/i)
assert.match(css,/#wistiaBeforeAfter \.bap-tab small\{opacity:1!important\}/)
const lum=h=>h.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05)
for(const pair of [['FFFFFF','252421'],['252421','DDDCD8'],['252421','F5F4F0'],['66645F','F5F4F0'],['252421','D5D3CD'],['252421','E9E8E4']])assert.ok(contrast(...pair)>=4.5,pair.join(' / '))
for(const pair of [['85827C','FFFFFF'],['8B8880','FFFFFF']])assert.ok(contrast(...pair)>=3,pair.join(' / '))
for(const route of ['detail/solo','detail/duo','detail/duet-film','event/solo','event/duo','event/duet-film','contact','info/about','info/faq','info/process','info/location','events','before-after','song','film','ar/self','ar/friend','find/role','find/service','find/people','section/homeServices','section/homeCases','section/homeLocation','section/homeProcess','privacy']){
 const page=read(route+'.html')
 assert.match(page,/data-wistia-palette="noir-minimal"/)
 assert.match(page,/data-wistia-typography="pretendard-noir"/)
 assert.match(page,/noir-minimal.css\?v=20261011-detail-polish-13/)
 assert.doesNotMatch(page,/href="[^"]*(?:pink-purple-lavender|olive-mustard-cream).css/)
}
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex')
assertPreservedAppLogic(read('js/app.js')) // Latest approved graphic renderers supersede the palette-only whole-file lock
assertInquiryWithoutName(read('js/contact-form.js')) // Name removal supersedes the earlier whole-file inquiry lock
assert.equal(hash(read('privacy.html').replace('<body class="privacy-page">','<body>').replace(/^  <a class="floating-kakao-pill".*\n/m,'').split('<body>')[1]),'b291ca15d72869d71b4fb5b2b5d8ce94c0812bf1bf0e3249cfb242d6beb02908')
console.log('Noir palette, restrained geometry, Korean sans/English serif, readable controls and unchanged content/media/behaviour passed')
