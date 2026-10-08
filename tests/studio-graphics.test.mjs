import assert from 'node:assert/strict'
import {readFileSync,readdirSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {createHash} from 'node:crypto'
import {graphicsFixture,assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
import {assertInquiryWithoutName} from './inquiry-without-name-fixture.mjs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const source=read('js/app.js'),css=read('css/studio-graphics.css'),index=read('index.html')
const scope={escapeHtml:x=>x}
runInNewContext(graphicsFixture(source)+source.split('\n').find(l=>l.startsWith('function img(')),scope)
const legacy=['01','02','03','04','05','06'],names=['consultation','recording','directing','balance','vocal-editing','mixing']
for(let i=0;i<legacy.length;i++){
 const rendered=scope.img('assets/img/process-no-people/'+legacy[i]+'.svg','old',true)
 assert.match(rendered,new RegExp('assets/img/studio-3d/'+names[i]+'.webp'))
 assert.match(rendered,/인물 없는 3D 제작 안내 그래픽/)
 assert.match(rendered,/loading="eager"/)
}
assert.match(scope.img('assets/img/process-studio/07-delivery.svg','old'),/studio-3d\/delivery.webp/)
assert.match(scope.img('assets/img/ar-detail/broadcast-typography-wistia-v2.png','archived broadcast'),/ar-detail\/broadcast-typography-wistia-v2\.png/,'the archived approved artwork remains available without hidden remapping')
assert.doesNotMatch(scope.img('assets/img/ar-detail/broadcast-typography-wistia-v2.png','approved broadcast'),/studio-graphics\/broadcast.svg/,'do not silently replace the specifically approved broadcast artwork')
assert.match(scope.img('assets/img/home-approved/aSKrlQwmnHI.jpg','real photo'),/home-approved\/aSKrlQwmnHI.jpg/)
runInNewContext(source.slice(source.indexOf('const EXPERT_CARDS='),source.indexOf('function wistiaBeforeAfterSection(')),scope)
const experts=scope.arExpertStory('duet-film')
assert.match(experts,/src="assets\/img\/story-polish\/film-expert-v2\.webp"/,'video expertise has its new text-inclusive explanatory graphic')
assert.match(experts,/src="assets\/img\/ar-detail\/broadcast-typography-noir-v3\.webp"/,'sound expertise uses the latest charcoal-silver broadcast graphic')
assert.doesNotMatch(experts,/src="assets\/img\/ar-detail\/broadcast-typography-wistia-v2\.png"/,'the former navy artwork is archived rather than active')
assert.doesNotMatch(experts,/src="assets\/img\/song\/solo\.webp"/,'expert media must no longer mix a recording photo with the broadcast graphic')
const folder=scope.processFolderArt()
assert.match(folder,/studio-folder-art/);assert.match(folder,/studio-folder-3d/);assert.match(folder,/studio-3d\/folder.webp/)
assert.doesNotMatch(folder,/<i>|<b>|process-folder-sparks|linearGradient|filter/)
for(const icon of ['microphone','camera','tune','mix','master','edit','mv','chat','letter','cut','join','pin','check','send','gift','swap','play','pause','arrow','down','up','chevron']){
 const rendered=scope.studioIcon(icon);assert.match(rendered,/stroke-width="1.5"/);assert.match(rendered,/aria-hidden="true" focusable="false"/);assert.match(rendered,/<(?:path|circle|rect)/)
}
assert.notEqual(scope.studioKeyArtwork(false),scope.studioKeyArtwork(true))
assert.match(scope.studioWaveformGraphic(),/stroke-width="1.7"/)
const assets=readdirSync(new URL('../assets/img/studio-graphics/',import.meta.url)).filter(p=>p.endsWith('.svg'))
assert.equal(assets.length,14)
for(const file of assets){const svg=read('assets/img/studio-graphics/'+file);assert.match(svg,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);assert.doesNotMatch(svg,/<(?:script|image|foreignObject|filter)|onload=|https:|data:/);assert.match(svg,/#252421/);assert.ok(svg.length>1000,file)}
assert.equal((source.match(/\+processFolderArt\(\)\+/g)||[]).length,3)
assert.ok(source.includes('studio-3d/film-editing.webp'));assert.ok(source.includes('studio-3d/sound-review.webp'))
assert.ok(source.includes('story-polish/entrance-bride-v2.webp'));assert.ok(source.includes('story-polish/entrance-groom-v2.webp'));assert.doesNotMatch(source,/studio-graphics\/priority.svg/)
assert.doesNotMatch(source,/>🎁<|process-folder-sparks|wistia-disc-720.webp/)
assert.match(css,/\.studio-folder-art:before\{content:none!important/)
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
assert.match(css,/data-studio-motion="off"/)
assert.doesNotMatch(css,/\.studio-folder-art\{[^}]*display:none/)
assert.match(index,/app.js\?v=20261008-contact-calendar-9/)
assert.ok(index.lastIndexOf('studio-graphics.css')>index.lastIndexOf('noir-minimal.css'))
assertPreservedAppLogic(source)
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex')
assertInquiryWithoutName(read('js/contact-form.js')) // Name removal supersedes the earlier whole-file inquiry lock
// The SVG and accessible playback labels may change; decoding, waveform and audio timing may not
const beforeAfter=read('js/before-after.js')
for(const [start,end,digest] of [
 ['    function start(offset){','    function activate(next,autoPlay=false){','f4dc19e3ada603f939e215ac15fc03de245aecdde3397843ae242ff830000d5f'],
 ['    function makePeaks(buffer,count=120){',"    root.classList.add('is-loading')",'d0682b27127d7e7e8c7ec77ff3fbe063a39fc844e9a0f0e2eb87af94a74f5109']
]){
 const a=beforeAfter.indexOf(start),b=beforeAfter.indexOf(end,a+start.length)
 assert.ok(a>=0&&b>a,'audio core boundaries remain available')
 assert.equal(hash(beforeAfter.slice(a,b)),digest,'before/after audio timing and decoding remain unchanged')
}
console.log('Archived vector art, restored 3D broadcast, new text-inclusive video expertise and preserved business/playback logic passed')
