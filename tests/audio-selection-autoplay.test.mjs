import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const elements=new Map()
function element(){const classes=new Set();return {dataset:{},style:{setProperty(){}},value:'70',hidden:true,events:{},attrs:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,b){b?classes.add(x):classes.delete(x)}},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},addEventListener(k,fn){this.events[k]=fn},removeEventListener(){}}}
for(const selector of ['.wistia-ar__ratio-input','.wistia-ar__ratio-current','[data-ratio-mood]','.wistia-ar__disc-stage','.wistia-ar__ratio','.wistia-ar__play','.wistia-ar__seek','[data-current-time]','[data-duration]','.wistia-ar__volume','.wistia-ar__error'])elements.set(selector,element())
const root=element();root.querySelector=s=>elements.get(s);root.querySelectorAll=()=>[];root.getAttribute=s=>s
let clock=0,claims=0,contexts=0
class AudioContext{constructor(){contexts++;this.state='running';this.destination={}}get currentTime(){return clock}createGain(){return {connect(){},gain:{value:0,cancelScheduledValues(){},setValueAtTime(){},setTargetAtTime(){}}}}createBufferSource(){return {connect(){},disconnect(){},start(){},stop(){}}}close(){return Promise.resolve()}}
class OfflineAudioContext{async decodeAudioData(){return {duration:85}}}
const window={AudioContext,OfflineAudioContext,wistiaClaimPlayback:()=>claims++}
runInNewContext(read('js/ar-ratio-cd.js'),{window,document:{querySelector:()=>root},navigator:{},AbortController,fetch:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},console})
const player=window.initArCdRatio()
const flush=()=>new Promise(resolve=>setImmediate(resolve))
await flush();assert.equal(contexts,0,'preloading alone must not start playback')
const input=elements.get('.wistia-ar__ratio-input'),disc=elements.get('.wistia-ar__disc-stage')
input.events.input({target:{value:'50'}});await flush()
assert.equal(disc.attrs['aria-pressed'],'true','moving the ratio slider starts audio')
clock=10;input.events.input({target:{value:'69'}});await flush()
assert.equal(player.getSelected(),69);assert.equal(disc.attrs['aria-pressed'],'true')
player.pause();assert.equal(disc.attrs['aria-pressed'],'false')
let prevented=false
elements.get('.wistia-ar__ratio').events.wheel({deltaY:1,deltaX:0,preventDefault(){prevented=true}});await flush()
assert.equal(prevented,true);assert.equal(disc.attrs['aria-pressed'],'true','wheel adjustment resumes paused audio')
assert.ok(claims>=2,'user-triggered audio participates in exclusive playback')
player.pause();player.select(80);await flush()
assert.equal(disc.attrs['aria-pressed'],'false','programmatic selection alone does not autoplay')
player.destroy()
console.log('AR slider and wheel autoplay, continued playback, pause and programmatic non-autoplay passed')
