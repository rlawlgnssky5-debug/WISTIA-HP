import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const app=read('js/app.js'),css=read('css/detail-readability.css'),motion=read('js/site-motion.js')
assert.match(css,/film-commerce-detail .arc-product-media\{width:100%;aspect-ratio:16\/9/)
assert.match(css,/film-commerce-detail .arc-product-media>img[^\n]+object-fit:contain/)
assert.match(css,/bap-badge\{justify-content:center;text-align:center/)
assert.match(css,/arc-point-key>figure\{width:100%;max-width:420px/)
assert.match(app,/음원 편집 · 키 조절 무료/)
assert.match(app,/추가금 없음/)
assert.match(app,/고객님이 직접 보내주신 본식 영상/)
assert.match(app,/assets\/video\/groom-wedding-song-ar\.mp4/)
const expert=app.slice(app.indexOf('function arExpertStory('),app.indexOf('function wistiaBeforeAfterSection('))
assert.match(expert,/aria-pressed/)
assert.doesNotMatch(expert,/aria-expanded|ar-expert-panel-overlay|ar-expert-panel-toggle/)
assert.match(css,/ar-expert-panel-sub[^\n]+opacity:1;max-height:none/)
const fn=motion.slice(motion.indexOf(' function processFolders(){'),motion.indexOf(' function depth(){'))
async function exercise(reduced=false){
 const listeners={},cleanups=[],animations=[],properties=new Map()
 const summary={addEventListener(type,fn){listeners[type]=fn}}
 const content={scrollHeight:640,inert:false,style:{set height(value){properties.set('height',value)},set overflow(value){properties.set('overflow',value)},removeProperty(key){properties.delete(key)}},getBoundingClientRect:()=>({height:640}),animate(frames,options){let resolve,reject;const finished=new Promise((yes,no)=>{resolve=yes;reject=no});const animation={frames,options,finished,resolve,cancel(){reject(new Error('cancelled'))}};animations.push(animation);return animation}}
 const classes=new Set()
 const folder={open:false,dataset:{},classList:{add:key=>classes.add(key),remove:key=>classes.delete(key),toggle(key,on){on?classes.add(key):classes.delete(key)}},querySelector:selector=>selector==='summary'?summary:content}
 let observerCallback,observed=null,disconnected=false
 class IntersectionObserver{constructor(callback){observerCallback=callback}observe(el){observed=el}disconnect(){disconnected=true}}
 const context={document:{querySelectorAll:()=>[folder]},IntersectionObserver,limited:()=>reduced,cleanups,listen:(el,type,fn)=>el.addEventListener(type,fn)}
 runInNewContext(fn,context);context.processFolders()
 if(reduced){assert.equal(listeners.click,undefined);assert.equal(animations.length,0);return}
 assert.equal(observed,summary);assert.equal(classes.has('is-cue-visible'),false)
 observerCallback([{isIntersecting:true}]);assert.equal(classes.has('is-cue-visible'),true)
 observerCallback([{isIntersecting:false}]);assert.equal(classes.has('is-cue-visible'),false)
 const click=()=>listeners.click({preventDefault(){}})
 click();assert.equal(folder.open,true);assert.equal(folder.dataset.folderMotion,'opening');assert.equal(animations[0].frames[0].height,'0px');assert.equal(animations[0].frames[1].height,'640px')
 click();assert.equal(folder.dataset.folderMotion,'closing');assert.equal(content.inert,true)
 click();assert.equal(folder.dataset.folderMotion,'opening');assert.equal(content.inert,false)
 animations.at(-1).resolve();await Promise.resolve();await Promise.resolve()
 assert.equal(folder.open,true);assert.equal(folder.dataset.folderMotion,undefined);assert.equal(properties.size,0)
 click();animations.at(-1).resolve();await Promise.resolve();await Promise.resolve()
 assert.equal(folder.open,false);assert.equal(content.inert,false)
 click();cleanups.forEach(fn=>fn());await Promise.resolve()
 assert.equal(properties.size,0);assert.equal(content.inert,false)
 assert.equal(disconnected,true);assert.equal(classes.has('is-cue-visible'),false)
}
await exercise();await exercise(true)
console.log('16:9 uncropped film, fixed expert copy, centered badge, free editing copy and reversible folder motion: passed')
