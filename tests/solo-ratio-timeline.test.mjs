import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
function element(){
 const events=new Map(),classes=new Set()
 return {dataset:{},value:'0',hidden:true,textContent:'',style:{setProperty(k,v){this[k]=v}},classList:{contains:c=>classes.has(c),remove:c=>classes.delete(c),toggle(c,on){on?classes.add(c):classes.delete(c)}},setAttribute(){},addEventListener(k,f){if(!events.has(k))events.set(k,new Set());events.get(k).add(f)},removeEventListener(k,f){events.get(k)?.delete(f)},fire(k){for(const f of events.get(k)||[])f()},click(){this.fire('click')}}
}
const audio=element(),plays=[]
let position=0,src=''
Object.assign(audio,{paused:true,readyState:0,duration:NaN,play(){this.paused=false;this.fire('play');return new Promise((resolve,reject)=>plays.push({resolve,reject}))},pause(){this.paused=true;this.fire('pause')},removeAttribute(){},load(){}})
Object.defineProperties(audio,{src:{get:()=>src,set(value){src=value;position=0;audio.readyState=0;audio.duration=NaN;audio.paused=true}},currentTime:{get:()=>position,set(value){if(audio.readyState===0)throw new Error('metadata unavailable');position=value}}})
const buttons=[30,50,70,100].map(value=>Object.assign(element(),{dataset:{soloRatio:String(value)}}))
const nodes=Object.fromEntries(['.solo-p4-card','.solo-p4-seek','.solo-p4-stop','[data-solo-mix]','[data-solo-current]','[data-solo-duration]','[data-solo-live]','[data-solo-ar]','[data-solo-live-label]','[data-solo-ar-label]','.solo-p4-error','[data-solo-state]'].map(s=>[s,element()]))
nodes['[data-solo-audio]']=audio
const root=element();root.querySelector=s=>nodes[s];root.querySelectorAll=()=>buttons
const scope={document:{querySelector:()=>root},window:{},soloPoint04Cleanup:null,ratioSource:r=>'ratio-'+r+'.wav'}
runInNewContext(source.slice(source.indexOf('function initSoloPoint04(){'),source.indexOf('function initSoloReviewLightbox(){')),scope)
scope.initSoloPoint04()
const meta=(duration=32)=>{audio.readyState=1;audio.duration=duration;audio.fire('loadedmetadata')}
const seek=nodes['.solo-p4-seek'],stop=nodes['.solo-p4-stop']

buttons[0].click();meta();audio.currentTime=12.5;audio.fire('timeupdate')
buttons[1].click()
audio.fire('timeupdate');audio.fire('loadedmetadata')
assert.equal(nodes['[data-solo-current]'].textContent,'0:12','loading keeps elapsed display')
assert.equal(seek.value,'12.5','loading keeps seek position')
assert.equal(seek.max,'32','loading retains the established seek range')
meta();assert.equal(audio.currentTime,12.5,'playing ratio change restores exact timeline after metadata')
assert.equal(audio.paused,false)
audio.currentTime=15;buttons[1].click()
assert.equal(audio.currentTime,15,'clicking the selected ratio does not reload its source')
audio.pause();audio.currentTime=18.25;buttons[2].click();meta()
assert.equal(audio.currentTime,18.25,'paused ratio click starts from the paused timeline')
assert.equal(audio.paused,false,'user ratio click retains autoplay intent')

audio.currentTime=21;buttons[3].click();buttons[0].click();meta()
assert.equal(audio.currentTime,21,'rapid ratio changes retain pending timeline while src reports zero')
assert.equal(audio.src,'ratio-30.wav')
plays.at(-2).reject(Object.assign(new Error('superseded'),{name:'AbortError'}));await Promise.resolve()
assert.equal(nodes['.solo-p4-error'].hidden,true,'stale play rejection does not fail current selection')

buttons[1].click();seek.value='25.75';seek.fire('input');meta()
assert.equal(audio.currentTime,25.75,'seeking during loading replaces pending timeline')
buttons[2].click();meta(20)
assert.equal(audio.currentTime,20,'timeline is clamped to the newly loaded duration')

buttons[3].click();stop.click();meta()
assert.equal(audio.paused,true,'stop during loading cancels playback')
assert.equal(audio.currentTime,0,'stop during loading clears pending timeline')
plays.at(-1).reject(new Error('cancelled by stop'));await Promise.resolve()
assert.equal(nodes['.solo-p4-error'].hidden,true,'stop invalidates the cancelled play callback')
buttons[0].click();audio.pause();const playCount=plays.length;meta()
assert.equal(audio.paused,true,'external pause during loading remains paused after metadata')
assert.equal(plays.length,playCount,'metadata never restarts cancelled playback')
scope.soloPoint04Cleanup();plays.at(-1).reject(new Error('unmounted'));await Promise.resolve()
assert.equal(nodes['.solo-p4-error'].hidden,true,'cleanup invalidates outstanding play callbacks')
console.log('POINT04 timeline: playing/paused switch, deferred metadata, rapid changes, stale promises, seek, clamp, stop and cleanup passed')
