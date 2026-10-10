import assert from 'node:assert/strict'
import {assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
import {assertInquiryWithoutName} from './inquiry-without-name-fixture.mjs'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const css=read('css/olive-mustard-cream.css'),index=read('index.html')
assert.match(index,/data-wistia-palette="noir-minimal"/)
assert.match(index,/data-wistia-typography="pretendard-noir"/)
assert.match(index,/<meta name="theme-color" content="#F5F4F0">/)
assert.ok(index.lastIndexOf('noir-minimal.css')>index.lastIndexOf('approved-home-thumbnails.css'))
for(const hex of ['#E7B928','#667044','#F2EBD9','#4B5234'])assert.ok(css.includes(hex))
assert.doesNotMatch(css,/[{;]\s*(?:width|height|min-width|min-height|max-width|max-height|padding|margin|font-size|font-family|line-height|letter-spacing|position|display|transform|gap|grid-template-columns|animation|transition|z-index|overflow|filter|object-fit)\s*:/i,'new palette must not redesign layout, fonts, photos or motion')
assert.match(css,/#wistiaBeforeAfter \.bap-tab small\{opacity:1!important\}/,'small source labels keep readable colour contrast')
assert.equal((css.match(/opacity\s*:/g)||[]).length,1,'only the two source labels may lose the legacy text fade')
assert.doesNotMatch(css,/url\(|@import|floatingKakao|#fee500|#FEE500/,'original images, logos and Kakao identity are untouched')
assert.match(css,/\.we-hero\.we-hero-thumbnails\{background:var\(--palette-olive\)/)
assert.match(css,/\.we-section-tag[^\n]*|detail-point-label/)
assert.match(css,/--ba-wave-rest:var\(--palette-wave\)/)
assert.match(css,/\.mas-joined-clip\{background:linear-gradient\(90deg,var\(--palette-olive\) 50%,var\(--palette-soft\) 50%\)/)
const lum=h=>{const c=h.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05)
for(const pair of [['4B5234','F2EBD9'],['59613F','F2EBD9'],['FFFDF4','667044'],['30361F','E7B928'],['4B5234','EEDCA6'],['4B5234','E6E3CD']])assert.ok(contrast(...pair)>=4.5,pair.join(' / '))
assert.ok(contrast('87916B','FFFDF4')>=3,'rest waveform must be visible')
for(const route of ['detail/solo','detail/duo','detail/duet-film','contact','info/location','info/about','info/faq','info/process','events','before-after','find/role','find/service','find/people','privacy']){
 assert.match(read(route+'.html'),/data-wistia-palette="noir-minimal"/)
 assert.match(read(route+'.html'),/noir-minimal.css\?v=20261011-detail-polish-13/)
}
// Palette-only baseline at bb14a1f, normalized for Windows/Git line endings
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex')
assertPreservedAppLogic(read('js/app.js')) // Latest approved graphic renderers supersede the palette-only whole-file lock
assertInquiryWithoutName(read('js/contact-form.js')) // Name removal supersedes the earlier whole-file inquiry lock
assert.equal(hash(read('privacy.html').replace('<body class="privacy-page">','<body>').replace(/^  <a class="floating-kakao-pill".*\n/m,'').split('<body>')[1]),'b291ca15d72869d71b4fb5b2b5d8ce94c0812bf1bf0e3249cfb242d6beb02908','legal content is unchanged')
console.log('Archived olive palette, active successor, readable roles and unchanged geometry/media/app/legal content passed')
assert.doesNotMatch(index,/href="css\/olive-mustard-cream.css/,'the archived palette must not load alongside its successor')
