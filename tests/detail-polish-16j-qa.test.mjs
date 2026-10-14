import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {graphicsFixture} from './studio-graphics-fixture.mjs'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const source=read('js/app.js')
const setup=read('tests/mobile-ar-solo.test.mjs').split('const desktop=')[0].replace(/^import .*\n/gm,'').replaceAll('import.meta.url',JSON.stringify(new URL('./mobile-ar-solo.test.mjs',import.meta.url).href))
const context={assert,readFileSync,URL,runInNewContext,graphicsFixture}
runInNewContext(setup+'\nglobalThis.fixture=scope',context)
const fixture=context.fixture
for(const key of ['solo','duo']){
 const html=fixture.arCommerceDetail(fixture.PRODUCTS[key],key)
 assert.match(html,/solo-selection-title"><svg[^>]*data-icon="people"/)
 assert.equal((html.match(/<details/g)||[]).length>=7,true)
 assert.match(html,/solo-faq-heading/)
 assert.doesNotMatch(html,/faq_B\.png/)
 assert.match(html,/data-solo-state>재생 대기/)
 assert.match(html,/data-solo-mix>AR 50%/)
 assert.match(html,/data-icon="stop"/)
 assert.match(html,new RegExp('solo-footer-inquiry" href="/event/'+key+'"'))
 assert.doesNotMatch(html,/축가 스토리 필름/)
 for(const [,url] of html.matchAll(/(?:src|srcset)="(assets\/[^"?]+)(?:\?[^\"]*)?"/g))assert.ok(existsSync(new URL('../'+url,import.meta.url)),url)
}
// Media lifecycle verifies visible state, ratio labels, elapsed time, seek and stop
function element(){const events={};const classes=new Set();return {events,style:{},textContent:'',value:'0',classList:{toggle(c,on){on?classes.add(c):classes.delete(c)},contains:c=>classes.has(c),remove:c=>classes.delete(c)},addEventListener(t,f){events[t]=f},removeEventListener(t){delete events[t]},setAttribute(){},removeAttribute(){},load(){},emit(t){events[t]?.()}}}
const audio=element();Object.assign(audio,{paused:true,currentTime:0,duration:110,play(){this.paused=false;this.emit('play');return Promise.resolve()},pause(){this.paused=true;this.emit('pause')}})
const ratios=[30,50,70,100].map(r=>Object.assign(element(),{dataset:{soloRatio:String(r)}}))
const nodes=Object.fromEntries(['.solo-p4-card','.solo-p4-seek','.solo-p4-stop','[data-solo-mix]','[data-solo-current]','[data-solo-duration]','[data-solo-live]','[data-solo-ar]','[data-solo-live-label]','[data-solo-ar-label]','.solo-p4-error','[data-solo-state]'].map(s=>[s,element()]))
nodes['[data-solo-audio]']=audio
const root={querySelector:s=>nodes[s],querySelectorAll:()=>ratios}
const playerContext={document:{querySelector:()=>root,activeElement:null},window:{},ratioSource:r=>'ratio-'+r+'.wav',soloPoint04Cleanup:null}
runInNewContext(source.slice(source.indexOf('function initSoloPoint04(){'),source.indexOf('function initSoloReviewLightbox(){')),playerContext)
playerContext.initSoloPoint04()
for(const [i,ratio] of [30,50,70,100].entries()){
 ratios[i].emit('click')
 assert.equal(audio.src,'ratio-'+ratio+'.wav')
 assert.equal(nodes['[data-solo-mix]'].textContent,'AR '+ratio+'%')
 assert.equal(nodes['[data-solo-state]'].textContent,'재생 중')
 assert.equal(nodes['[data-solo-live-label]'].textContent,'현장 라이브 보컬 '+(100-ratio))
 audio.currentTime=42;audio.emit('timeupdate');audio.emit('loadedmetadata')
 assert.equal(nodes['[data-solo-current]'].textContent,'0:42')
 assert.equal(nodes['[data-solo-duration]'].textContent,'1:50')
 nodes['.solo-p4-seek'].value='55';nodes['.solo-p4-seek'].emit('input');assert.equal(audio.currentTime,55)
 nodes['.solo-p4-stop'].emit('click')
 assert.equal(audio.paused,true);assert.equal(audio.currentTime,0)
 assert.equal(nodes['[data-solo-state]'].textContent,'정지')
 assert.equal(nodes['[data-solo-current]'].textContent,'0:00')
}
const shell=read('index.html')
assert.match(shell,/canonical" href="https:\/\/wistiastudio.com\/"/)
assert.match(source,/if\(home\)renderDetail\("solo"\)/)
assert.match(source,/function renderLegacyHome/)
const menu=source.slice(source.indexOf('function navigationMenu'),source.indexOf('function header()'))
assert.doesNotMatch(menu,/duet-film|축가 스토리/)
const info=source.slice(source.indexOf('function renderInfoPage'),source.indexOf('function renderEventsPage'))
assert.doesNotMatch(info,/href="\/detail\/duet-film"/)
assert.match(info,/filter\(group=>group.title!=="영상 상품 안내"\)/)
assert.match(info,/sort\(.*AR 축가 안내/)
assert.doesNotMatch(read('sitemap.xml'),/duet-film/)
assert.match(read('detail/duet-film.html'),/name="robots" content="noindex, follow"/)
assert.match(read('detail/duet-film.html'),/http-equiv="refresh" content="0;url=\/"/)
for(const [,asset] of shell.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)(?:\?[^\"]*)?"/g))assert.ok(existsSync(new URL('../'+asset,import.meta.url)),asset)
JSON.parse(shell.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
console.log('16j: SOLO/DUET render, asset paths, visible media state/time/seek/stop, root SEO, retired story routing and navigation passed')
