import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {graphicsFixture} from './studio-graphics-fixture.mjs'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const source=read('js/app.js')
const setup=read('tests/mobile-ar-solo.test.mjs').split('const desktop=')[0].replace(/^import .*\n/gm,'').replaceAll('import.meta.url',JSON.stringify(new URL('./mobile-ar-solo.test.mjs',import.meta.url).href))
const context={assert,readFileSync,URL,runInNewContext,graphicsFixture}
runInNewContext(setup+'\nglobalThis.fixture=scope',context)
context.fixture.ratioSource=r=>'assets/audio/ratio-'+r+'.wav'
for(const key of ['solo','duo']){
 const html=context.fixture.arCommerceDetail(context.fixture.PRODUCTS[key],key)
 const gallery=html.slice(html.indexOf('class="mas-gallery"'),html.indexOf('class="mas-summary'))
 const posters=[...gallery.matchAll(/<video[^>]*poster="([^"]+)"/g)].map(m=>m[1])
 assert.match(posters[0],key==='duo'?/duet-live-proof-v2.jpg/:/solo-live-proof.jpg/)
 assert.match(gallery,/data-mobile-gallery-start="0"/)
 assert.match(gallery,new RegExp('data-mobile-video-slide="0" aria-label="'+(key==='duo'?'DUET':'SOLO')+' 영상 보기" aria-pressed="true"'))
 assert.doesNotMatch(gallery,/mas-format-badge/)
 assert.match(html,/solo-p4-stop" aria-label="재생"><svg/)
}
// Exercise chat visibility with viewport geometry, including the last FAQ control.
let raf,scope,topBottom,regionBoxes=[],selectors
const classes=new Set(),attrs=new Map()
const button={classList:{toggle(c,on){on?classes.add(c):classes.delete(c)},remove:c=>classes.delete(c)},setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k),getBoundingClientRect:()=>({left:326,right:378,top:836,bottom:888})}
const events={},app={}
const env={window:{},innerHeight:900,document:{querySelector:s=>s==='#floatingKakaoChat'?button:s==='#app'?app:scope},requestAnimationFrame:f=>{raf=f;return 1},cancelAnimationFrame(){},addEventListener:(t,f)=>events[t]=f,removeEventListener(){},ResizeObserver:class{observe(){}disconnect(){}}}
runInNewContext(source.slice(source.indexOf('function initCompactKakao(){'),source.indexOf('function initSoloPoint04(){')),env)
scope={querySelector:()=>({getBoundingClientRect:()=>({bottom:topBottom})}),querySelectorAll:s=>{selectors=s;return regionBoxes.map(box=>({getClientRects:()=>[box],getBoundingClientRect:()=>box}))}}
const paint=()=>{env.initCompactKakao();raf()}
const visible=()=>!classes.has('is-content-overlap')
// 2026-10-17: the yellow chat stays visible and clickable everywhere
topBottom=500;paint();assert.equal(visible(),true,'chat is visible over the top section')
topBottom=-1;regionBoxes=[{left:0,right:390,top:800,bottom:1200}];paint();assert.equal(visible(),true,'protected regions no longer hide chat');assert.equal(attrs.has('tabindex'),false)
scope=null;paint();assert.equal(visible(),true,'leaving detail pages restores chat');assert.equal(attrs.has('tabindex'),false)
console.log('Round 3 follow-up passed: SOLO/DUET first photo, first dot, transport markup, chat protected regions and route reset')
