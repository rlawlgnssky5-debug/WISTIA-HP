import assert from 'node:assert/strict'
import {assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
import {assertInquiryWithoutName} from './inquiry-without-name-fixture.mjs'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const css=read('css/pink-purple-lavender.css'),index=read('index.html')
assert.match(index,/data-wistia-palette="noir-minimal"/)
assert.match(index,/data-wistia-typography="pretendard-noir"/)
assert.match(index,/<meta name="theme-color" content="#F5F4F0">/)
assert.match(index,/pretendardvariable-dynamic-subset.min.css/)
assert.doesNotMatch(index,/maru-buri.css|href="css\/olive-mustard-cream.css|studio-editorial.css/)
assert.ok(index.lastIndexOf('noir-minimal.css')>index.lastIndexOf('approved-home-thumbnails.css'))
for(const hex of ['#FF82B2','#7657D5','#F7F1FF','#372455'])assert.ok(css.includes(hex))
assert.match(css,/--font-heading:"Pretendard Variable","Pretendard",sans-serif/)
assert.match(css,/--font-body:"Pretendard Variable","Pretendard",sans-serif/)
assert.match(css,/font-weight:750!important;letter-spacing:-\.045em!important/)
assert.doesNotMatch(css,/[{;]\s*(?:width|height|min-width|min-height|max-width|max-height|padding|margin|font-size|line-height|position|display|transform|gap|grid-template-columns|animation|transition|z-index|overflow|filter|object-fit)\s*:/i,'palette/type must not replace the approved layout, media or motion')
assert.doesNotMatch(css,/url\(|@import|floatingKakao|#FEE500/i)
assert.match(css,/\.we-hero\.we-hero-thumbnails\{background:var\(--palette-pink\)!important;color:var\(--palette-on-pink\)/)
assert.match(css,/--ba-wave-rest:var\(--palette-wave\)/)
assert.match(css,/#wistiaBeforeAfter \.bap-tab small\{opacity:1!important\}/)
const lum=h=>h.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05)
for(const pair of [['FFFFFF','7657D5'],['39245F','FF82B2'],['372455','F7F1FF'],['685681','F7F1FF'],['372455','FFD2E4'],['372455','ECE2FA']])assert.ok(contrast(...pair)>=4.5,pair.join(' / '))
assert.ok(contrast('9280B1','FFFFFF')>=3)
for(const route of ['detail/solo','detail/duo','detail/duet-film','event/solo','event/duo','event/duet-film','contact','info/about','info/faq','info/process','info/location','events','before-after','song','film','ar/self','ar/friend','find/role','find/service','find/people','section/homeServices','section/homeCases','section/homeLocation','section/homeProcess','privacy']){
 const page=read(route+'.html')
 assert.match(page,/data-wistia-palette="noir-minimal"/)
 assert.match(page,/data-wistia-typography="pretendard-noir"/)
 assert.match(page,/noir-minimal.css\?v=20261006-noir-minimal-1/)
 assert.doesNotMatch(page,/href="[^"]*olive-mustard-cream.css|maru-buri.css/)
}
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex')
assertPreservedAppLogic(read('js/app.js')) // Latest approved graphic renderers supersede the palette-only whole-file lock
assertInquiryWithoutName(read('js/contact-form.js')) // Name removal supersedes the earlier whole-file inquiry lock
assert.equal(hash(read('privacy.html').split('<body>')[1]),'b291ca15d72869d71b4fb5b2b5d8ce94c0812bf1bf0e3249cfb242d6beb02908')
console.log('Pink/purple/lavender, modern sans type, legible roles, all pages and unchanged app/media/inquiry/legal content passed')
assert.doesNotMatch(index,/href="css\/pink-purple-lavender.css/,'archived bright palette is not active')
