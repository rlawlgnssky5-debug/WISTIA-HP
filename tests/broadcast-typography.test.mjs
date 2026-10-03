import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const source=read('js/app.js'),css=read('css/mobile-ar-solo.css')
const scope={img:(src,alt)=>'<img src="'+src+'" alt="'+alt+'">'}
runInNewContext(source.slice(source.indexOf('const EXPERT_CARDS='),source.indexOf('function wistiaBeforeAfterSection(')),scope)
for(const key of ['solo','duo','duet-film']){
 const html=scope.arExpertStory(key)
 assert.match(html,/ar-expert-broadcast/)
 assert.match(html,/broadcast-typography-v1\.png/)
 assert.match(html,/싱어게인2/)
 assert.match(html,/불후의 명곡/)
 assert.doesNotMatch(html,/01 · 사운드 완성|02 · 사운드 완성|mixing-engineer/)
 if(key!=='duet-film')assert.doesNotMatch(html,/ar-expert-panel-index/)
 else assert.match(html,/01 · 영상 연출/,'unrelated video index stays intact')
}
const timeGuide=source.slice(source.indexOf('<section class="arc-section arc-time-guide"'),source.indexOf('<section class="arc-section arc-time-guide"')+800)
assert.match(timeGuide,/<p>1곡 기준 · 1시간<\/p>/)
assert.match(timeGuide,/<p>1곡 기준 · 2시간<\/p>/)
assert.doesNotMatch(timeGuide,/구간별 녹음과 1:1 디렉팅|두 분의 파트와 목소리를 함께/)
assert.match(source,/처음부터 끝까지 완벽하게 부를 필요 없이 구간별 녹음과 1:1 디렉팅/,'unselected genuine process information is preserved')
assert.match(css,/\.ar-expert-panel-media\.ar-expert-broadcast\{aspect-ratio:3\/2/)
assert.match(css,/\.ar-expert-broadcast img\{object-fit:contain!important/)
assert.ok(existsSync(new URL('../assets/img/ar-detail/broadcast-typography-v1.png',import.meta.url)))
console.log('Person-free broadcast typography, removed sound index, concise recording time facts and preserved unrelated copy passed')
