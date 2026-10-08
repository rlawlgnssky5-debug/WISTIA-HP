import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {runInNewContext} from 'node:vm'
import {assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
import {assertManualReviews} from './manual-reviews-fixture.mjs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const digest=path=>createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex')
const normalize=text=>text.replace(/\r\n/g,'\n')
const textDigest=text=>createHash('sha256').update(normalize(text)).digest('hex')
const app=read('js/app.js'),index=read('index.html'),css=read('css/detail-consistency.css')
const asset='assets/img/ar-detail/broadcast-typography-noir-v3.webp'
const oldAsset='assets/img/ar-detail/broadcast-typography-wistia-v2.png'
const alt='싱어게인2와 불후의 명곡 타이틀을 담은 위스티아 차콜 실버 3D 그래픽'
const oldAlt='싱어게인2와 불후의 명곡 타이틀을 담은 위스티아 실버 네이비 그래픽'
const experts=app.slice(app.indexOf('const EXPERT_CARDS='),app.indexOf('function wistiaBeforeAfterSection('))
const context={img:(src,description)=>'<img src="'+src+'" alt="'+description+'">'}
runInNewContext(experts,context)

// Latest visual request changes only the broadcast image and its accurate alternative text
for(const key of ['solo','duo','duet-film']){
 const html=context.arExpertStory(key)
 assert.ok(html.includes('src="'+asset+'"'),key+' displays the neutral broadcast asset')
 assert.ok(html.includes('alt="'+alt+'"'),key+' has the updated truthful description')
 assert.ok(!html.includes(oldAsset),key+' does not display the former navy artwork')
 assert.match(html,/〈싱어게인2〉·〈불후의 명곡〉 방송 음악 작업 참여/)
 assert.match(html,/<strong class="ar-expert-panel-keyword">사운드 완성<\/strong>/)
}
assert.equal(textDigest(experts.replaceAll(asset,oldAsset).replaceAll(alt,oldAlt).replaceAll('film-expert-v2','film-expert-v1').replaceAll('크몽 7년 디자이너','7년 경력 영상 편집 디자이너')),'801242480e68bf827391267f930a6c7e25b2f18267637aa40c2012e7ab69a181','expert headings, facts, layout and behaviour remain unchanged from deployed HEAD')
assert.equal(digest(oldAsset),'af7f610506d96dab20753b836fa6a01c97a10948ea16d3deb4464cca2883d929','original navy PNG is preserved byte-for-byte')
assert.ok(existsSync(new URL('../'+asset,import.meta.url)))
assert.notEqual(digest(asset),digest(oldAsset),'the new image is a separate edited asset')

// Colour is part of the new image, not a global CSS filter that changes genuine customer media
const expertCssStart=css.indexOf('/* Both expert panels')
const benefitCssStart=css.indexOf('/* Benefits are two different payment timings')
assert.ok(expertCssStart>=0&&benefitCssStart>expertCssStart,'expert CSS has an independent boundary before the newly approved benefits layout')
assert.equal(textDigest(css.slice(expertCssStart,benefitCssStart).trimEnd()),'0459e767289ba0fcc93bdcc299d0f4a182edcf96c0373daed17e200e17af39e3','broadcast/expert layout CSS remains unchanged from deployed HEAD')
assert.doesNotMatch(css,/grayscale\(|sepia\(|hue-rotate\(|saturate\(/)
assert.match(css,/\.ar-expert-readable \.ar-expert-panel-media img\{[^}]*object-fit:contain!important;filter:none!important/)
assert.match(index,/js\/app.js\?v=20261008-contact-calendar-5/)
assert.match(index,/css\/detail-consistency.css\?v=20261006-benefit-boxes-1/)

assertPreservedAppLogic(app)
assertManualReviews(app)
assert.equal(digest('assets/img/song-options/lyric-video-v2.webp'),'ca947d5ef39db38f9e296be8d378f222fad426c55406750693de237616c9414b','genuine lyric example is untouched')
const manifest=JSON.parse(read('assets/img/ar-detail/broadcast-typography-noir-v3.json'))
const provenance=JSON.stringify(manifest)
assert.match(provenance,/built-in imagegen/,'asset records the actual creation mode')
assert.ok(provenance.includes(asset),'asset provenance records the new image path')
assert.ok(provenance.includes(oldAsset),'asset provenance records the edited source path')
assert.ok(provenance.includes('prompt'),'asset provenance keeps its generation instructions')
console.log('Neutral broadcast on all three experts, archived PNG, unchanged expert CSS/business/reviews/lyric example and provenance passed')
