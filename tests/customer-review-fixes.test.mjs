import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const app=read('js/app.js'),css=read('css/customer-review-fixes.css')
let home=''
const start=app.indexOf('function renderWeddingHome'),end=app.indexOf('function detailPriceData')
runInNewContext(app.slice(start,end)+';renderWeddingHome()',{
 app:{set innerHTML(value){home=value}},img:()=>'',cta:()=>'',faq:()=>'',
 GENERAL_FAQ:[],soloReviewCarousel:()=>'<section id="reviews"></section>',
 wistiaBeforeAfterSection:()=>'',homeDirectionsSection:()=>'<section id="homeLocation"></section>',footer:()=>''
})
assert.doesNotMatch(home,/studio-scene|homeProcess/)
assert.ok(home.indexOf('homeServices')<home.indexOf('id="homePriceReason"'))
assert.ok(home.indexOf('id="homePriceReason"')<home.indexOf('id="homeCases"'))
assert.ok(home.indexOf('id="homeCases"')<home.indexOf('id="reviews"'))
assert.ok(home.includes('id="homeLocation"'))
let directions=''
runInNewContext(app.slice(app.indexOf('function homeDirectionsSection'),app.indexOf('function studioSculpture'))+';directions=homeDirectionsSection()',{
 location:{origin:'http://localhost:4174'},img:()=>'',encodeURIComponent,
 set directions(value){directions=value}
})
assert.match(directions,/href="http:\/\/localhost:4174\/assets\/img\/wistia-directions\.png" target="_blank"/)
const ar=app.slice(app.indexOf('function arCommerceDetail'),app.indexOf('function initArCommerceDetail'))
assert.doesNotMatch(ar,/음정·박자는 다듬고|직접 부르는 순간에도/)
assert.match(ar,/wistiaBeforeAfterSection\(\)/)
assert.match(ar,/arCdRatioSection\(\)/)
assert.match(ar,/arCustomerVideoData\(key\)/)
assert.match(app,/duet-live-proof-v2\.jpg/)
assert.match(app,/routePath\(\)==='\/section\/homeProcess'/)
assert.match(css,/#quickEstimate \.qe-choice\{[^\n]+border:1px solid/)
assert.match(css,/#app \.footer \.footer-brand[^\n]+color:#29343e/)
assert.match(css,/solo-review-carousel>\.shell\{[^\n]+margin-inline:auto/)
assert.match(read('js/quick-estimate.js'),/aria-label="빠른 견적 닫기"><svg/)
// Exercise real audio switching with deliberately different before/after amplitudes.
const elements=new Map(),rects=[]
function element(){return {dataset:{},hidden:false,events:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},addEventListener(type,fn){this.events[type]=fn},getBoundingClientRect:()=>({width:360,height:80,left:0})}}
for(const selector of ['.bap-switch','.bap-badge','.bap-badge b','.bap-play','.bap-play-icon','.bap-play-label','.bap-time b','.bap-time span','.bap-wave','.bap-error','.bap-player'])elements.set(selector,element())
const badge=elements.get('.bap-badge');badge.querySelector=()=>elements.get('.bap-badge b')
elements.get('.bap-play').querySelector=selector=>elements.get(selector)
const before=element(),after=element();before.dataset.mode='before';after.dataset.mode='after'
const root=element();root.querySelector=selector=>elements.get(selector);root.querySelectorAll=()=>[before,after]
const canvas=elements.get('.bap-wave');canvas.getContext=()=>({clearRect(){rects.length=0},fillRect(x,y,w,h){rects.push([x,y,w,h])}})
let audioTime=0,lastBuffer=null
class AudioContext{constructor(){this.state='running';this.destination={}}get currentTime(){return audioTime}createBufferSource(){return {connect(){},disconnect(){},stop(){},start(){lastBuffer=this.buffer}}}close(){}}
class OfflineAudioContext{async decodeAudioData(bytes){const kind=new Uint8Array(bytes)[0];return {kind,duration:85,getChannelData:()=>Float32Array.from({length:240},(_,i)=>kind===1?(i%13+1)/14:(i%5+1)/6)}}}
const window={AudioContext,OfflineAudioContext,addEventListener(){},devicePixelRatio:1}
runInNewContext(read('js/before-after.js'),{window,document:{querySelector:()=>root,baseURI:'http://localhost/',body:element()},URL,AbortController,fetch:async src=>({ok:true,arrayBuffer:async()=>Uint8Array.of(src.includes('before.mp3')?1:2).buffer}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},console})
const player=window.initWistiaBeforeAfter()
await new Promise(resolve=>setImmediate(resolve))
const originalShape=JSON.stringify(rects)
await player.play();audioTime=10
player.setMode('after')
assert.equal(lastBuffer.kind,2,'switch must change real audio, not only the button')
assert.equal(root.dataset.position,'10','switch preserves timeline')
assert.equal(JSON.stringify(rects),originalShape,'waveform bar geometry must remain identical')
player.pause();player.setMode('before');assert.equal(root.dataset.position,'10')
before.events.click();await new Promise(resolve=>setImmediate(resolve))
assert.equal(lastBuffer.kind,1,'clicking the selected before tab resumes audio')
assert.equal(elements.get('.bap-play-label').textContent,'일시정지')
player.pause();after.events.click();await new Promise(resolve=>setImmediate(resolve))
assert.equal(lastBuffer.kind,2,'clicking after while paused starts after audio')
assert.equal(elements.get('.bap-play-label').textContent,'일시정지')
assert.equal(root.dataset.position,'10','auto-play selection preserves paused position')
player.destroy()
console.log('Customer review home order, product video helper, retained players, card contrast and identical waveform switching passed')
