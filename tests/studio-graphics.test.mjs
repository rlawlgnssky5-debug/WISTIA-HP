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
assert.match(scope.img('assets/img/ar-detail/broadcast-typography-wistia-v2.png','old'),/studio-graphics\/broadcast.svg/)
assert.match(scope.img('assets/img/home-approved/aSKrlQwmnHI.jpg','real photo'),/home-approved\/aSKrlQwmnHI.jpg/)
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
assert.ok(source.includes('studio-graphics/film-editing.svg'));assert.ok(source.includes('studio-graphics/sound-review.svg'))
assert.ok(source.includes('studio-graphics/bride-entrance.svg'));assert.ok(source.includes('studio-graphics/groom-entrance.svg'));assert.doesNotMatch(source,/studio-graphics\/priority.svg/)
assert.doesNotMatch(source,/>🎁<|process-folder-sparks|wistia-disc-720.webp/)
assert.match(css,/\.studio-folder-art:before\{content:none!important/)
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
assert.match(css,/data-studio-motion="off"/)
assert.doesNotMatch(css,/\.studio-folder-art\{[^}]*display:none/)
assert.match(index,/app.js\?v=20261006-reviews-five-1/)
assert.ok(index.lastIndexOf('studio-graphics.css')>index.lastIndexOf('noir-minimal.css'))
assertPreservedAppLogic(source)
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex')
assertInquiryWithoutName(read('js/contact-form.js')) // Name removal supersedes the earlier whole-file inquiry lock
assert.equal(hash(read('js/before-after.js')),'9d426e6cf8106e4eef646412b310747e9fc2b492cb9fc8dc8691a60c5d32ab60')
console.log('Archived vector art, approved broadcast, new 3D mapping and preserved business/playback logic passed')
