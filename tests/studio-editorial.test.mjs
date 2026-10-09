import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const source=read('js/app.js'),index=read('index.html'),theme=read('css/noir-minimal.css')
assert.match(index,/data-wistia-typography="pretendard-noir"/)
assert.doesNotMatch(index,/maru-buri.css/)
assert.match(theme,/--font-heading:"Pretendard Variable","Pretendard",sans-serif/)
assert.doesNotMatch(index,/studio-editorial.css/)
assert.doesNotMatch(source,/studio-home-hero|studio-hero-media|wistia-hero-main|finder-ai\//)
assert.doesNotMatch(source,/process-studio\/0[1-6]-[^"']+\.(?:webp|png)/)
assert.doesNotMatch(source,/song-options\/(?:bride|groom)-entrance-v1/)
assert.doesNotMatch(source,/film-types\/recording-making/)
assert.match(index,/js\/app.js\?v=20261009-detail-polish-9b/)
for(const n of ['01','02','03','04','05','06']){
 const svg=read('assets/img/process-no-people/'+n+'.svg')
 assert.match(svg,/인물 없는 도식/)
 assert.doesNotMatch(svg,/<image|<script|https:\/\//)
}
for(const route of ['detail/solo','detail/duo','detail/duet-film','contact','event/solo','event/duo','event/duet-film','info/location','info/about','info/faq','info/process','events','song','film','ar/self','ar/friend','find/role','find/service','find/people']){
 const page=read(route+'.html')
 assert.match(page,/pretendard-noir/)
 assert.doesNotMatch(page,/studio-editorial.css/)
}
assert.doesNotMatch(read('privacy.html'),/studio-editorial.css/)
assert.match(source,/story-process-folder home-process-folder" open/)
assert.match(source,/function mobileArProcess\(key="solo"\)\{\s*const steps=detailStudioSteps\(key\)/)
assert.match(source,/완성도는 높이고, 부담은 줄인 가격을 약속드립니다/)
console.log('Preserved rollback layout, active sans typography, rejected portraits absent and complete folders passed')
