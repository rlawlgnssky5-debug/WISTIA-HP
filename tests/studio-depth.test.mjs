import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const motion=read('js/site-motion.js'),app=read('js/app.js'),css=read('css/studio-depth.css')
assert.match(app,/function studioSculpture/)
assert.match(app,/studio-address-street/)
assert.match(css,/transform-style:preserve-3d/)
assert.match(css,/body:not\(\[data-page=event\]\):not\(\.menu-open\):not\(\.modal-open\) #floatingKakao/)
assert.doesNotMatch(motion,/querySelectorAll\('button\[data-studio-motion\]'\)/)
assert.doesNotMatch(app,/<button[^>]*data-studio-motion/)
assert.doesNotMatch(motion,/fbq|trackContact|gtag|meta-contact/)
function element(){
 const events=new Map(),classes=new Set(),styles=new Map()
 return {events,classes,styles,textContent:'',attrs:{},setAttribute(key,value){this.attrs[key]=value},addEventListener(key,fn){events.set(key,fn)},removeEventListener(key,fn){if(events.get(key)===fn)events.delete(key)},classList:{add(...keys){keys.forEach(key=>classes.add(key))},remove(...keys){keys.forEach(key=>classes.delete(key))},contains:key=>classes.has(key),toggle(key,on){if(on)classes.add(key);else classes.delete(key)}},style:{setProperty:(key,value)=>styles.set(key,value),removeProperty:key=>styles.delete(key)},getBoundingClientRect:()=>({top:50,left:0,width:300,height:320})}
}
const html=element(),button=element(),scene=element(),card=element(),window=element(),observers=[],storage=new Map(),frames=new Map(),timers=new Map()
html.textContent='document content must survive'
const document={...element(),documentElement:html,querySelector:()=>null,querySelectorAll:selector=>{
 if(selector==='button[data-studio-motion]')return [button]
 if(selector==='[data-studio-motion]')return [html,button] // Protect against selecting the root instead of a button
 if(selector==='.studio-scene')return [scene]
 if(selector.includes('.we-service figure'))return [card]
 return []
}}
window.localStorage={getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)}
class Observer{constructor(callback){this.callback=callback;observers.push(this)}observe(target){this.callback([{target,isIntersecting:true}])}disconnect(){this.disconnected=true}}
runInNewContext(motion,{window,document,IntersectionObserver:Observer,innerHeight:900,matchMedia:query=>({...element(),matches:query.includes('reduced')||false}),setTimeout:fn=>{const key=timers.size+1;timers.set(key,fn);return key},clearTimeout:key=>timers.delete(key),requestAnimationFrame:fn=>{frames.set(1,fn);return 1},cancelAnimationFrame:key=>frames.delete(key)})
window.WistiaMotion.mount()
assert.equal(html.textContent,'document content must survive')
assert.equal(html.attrs['data-studio-motion'],'off')
assert.equal(button.textContent,'')
assert.equal(timers.size,0,'reduced motion does not load libraries')
storage.set('wistia-studio-motion','on')
// Reinitialize the module as a returning visitor with a previously explicit opt-in
runInNewContext(motion,{window,document,IntersectionObserver:Observer,innerHeight:900,matchMedia:query=>({...element(),matches:query.includes('reduced')||false}),setTimeout:fn=>{const key=timers.size+1;timers.set(key,fn);return key},clearTimeout:key=>timers.delete(key),requestAnimationFrame:fn=>{frames.set(1,fn);return 1},cancelAnimationFrame:key=>frames.delete(key)})
window.WistiaMotion.mount()
assert.equal(html.attrs['data-studio-motion'],'on')
assert.equal(button.textContent,'')
assert.ok(scene.classes.has('is-in-view'))
assert.ok(card.classes.has('studio-depth-card'))
window.events.get('scroll')()
const frame=frames.get(1);frames.delete(1);frame()
assert.match(scene.styles.get('--scroll-turn'),/deg$/)
window.WistiaMotion.destroy()
assert.ok(observers[0].disconnected)
assert.equal(scene.styles.size,0)
assert.equal(card.classes.size,0)
assert.equal(frames.size,0)
assert.equal(html.textContent,'document content must survive')
assert.equal(storage.get('wistia-studio-motion'),'on')
window.WistiaMotion.destroy()
assert.equal(button.events.size,0)
console.log('CSS 3D structure, address grouping, restored controls, explicit reduced-motion opt-in and complete teardown passed')
