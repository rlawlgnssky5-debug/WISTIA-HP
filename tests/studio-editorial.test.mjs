import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const source=read('js/app.js'),index=read('index.html'),theme=read('css/monochrome-maru-theme.css')
assert.match(index,/data-wistia-typography="maru-pretendard-fixed"/)
assert.match(index,/maru-buri.css/)
assert.match(theme,/--font-heading:"MaruBuri",serif/)
assert.doesNotMatch(index,/studio-editorial.css/)
assert.doesNotMatch(source,/studio-home-hero|studio-hero-media|wistia-hero-main|finder-ai\//)
assert.doesNotMatch(source,/process-studio\/0[1-6]-[^"']+\.(?:webp|png)/)
assert.doesNotMatch(source,/song-options\/(?:bride|groom)-entrance-v1/)
assert.doesNotMatch(source,/film-types\/recording-making/)
assert.match(index,/js\/app.js\?v=20261006-approved-home-thumbnails-1/)
for(const n of ['01','02','03','04','05','06']){
 const svg=read('assets/img/process-no-people/'+n+'.svg')
 assert.match(svg,/인물 없는 도식/)
 assert.doesNotMatch(svg,/<image|<script|https:\/\//)
}
for(const route of ['detail/solo','detail/duo','detail/duet-film','contact','event/solo','event/duo','event/duet-film','info/location','info/about','info/faq','info/process','events','song','film','ar/self','ar/friend','find/role','find/service','find/people']){
 const page=read(route+'.html')
 assert.match(page,/maru-pretendard-fixed/)
 assert.doesNotMatch(page,/studio-editorial.css/)
}
assert.doesNotMatch(read('privacy.html'),/studio-editorial.css/)
assert.match(source,/story-process-folder home-process-folder" open/)
assert.match(source,/function mobileArProcess\(key="solo"\)\{\s*const steps=detailStudioSteps\(key\)/)
assert.match(source,/완성도는 높이고, 부담은 줄인 가격을 약속드립니다/)
console.log('Design rollback, original fonts, rejected portraits absent, people-free diagrams and complete folders passed')
