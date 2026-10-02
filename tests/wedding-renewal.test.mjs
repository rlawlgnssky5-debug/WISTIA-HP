import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {runInNewContext} from 'node:vm'

const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const app=read('js/app.js'),motion=read('js/site-motion.js'),index=read('index.html')
const home=app.slice(app.indexOf('function renderWeddingHome'),app.indexOf('function renderHome'))
for(const phrase of ['AR 축가 사전녹음','축가 스토리 필름','결혼식에서 직접 축가를 부른다면','우리 목소리로 축가 영상을 만든다면','homeCases','homeProcess','/info/location'])assert.ok(home.includes(phrase),phrase)
assert.doesNotMatch(home,/\/detail\/(wedding|proposal)/)
assert.match(home,/service\('duet-film'/)
const homeCases=runInNewContext(home.match(/const cases=(\[[^\n]+\])/)[1])
assert.equal(homeCases.length,4)
assert.equal(homeCases[3][2],'AQ9Z1flOUPo')
assert.match(home,/String\(cases.length\)\.padStart\(2,'0'\)/)
assert.match(app,/window\.WistiaMotion\?\.destroy\(\)/)
assert.match(app,/window\.WistiaMotion\?\.mount\(\)/)
assert.match(index,/site-motion\.js\?v=20261002-motion-audit-1/)
assert.match(index,/meta-pixel\.js\?v=20261002-tracking-resilience-1/)
assert.match(index,/analytics\.js\?v=20260929-path-1/)
const protectedHashes={
 'js/analytics.js':'25e519522592a7e15723cadb872bbcbefc00052399dbfb0e3aa56a05ac4afd07'
}
// Meta resilience is covered by meta-events.test.mjs, including the unchanged event IDs and click contract.
for(const [file,hash] of Object.entries(protectedHashes))assert.equal(createHash('sha256').update(readFileSync(new URL('../'+file,import.meta.url))).digest('hex'),hash,file+' must remain unchanged')

// Exercise motion lifecycle without overriding any browser or telemetry runtime
async function exercise({reduced=false,desktop=true,blocked=false}={}){
 let lenisCount=0,destroyed=0,removed=0,reverted=0
 const scripts=[],nodes=[],timers=new Map(),callbacks=new Set()
 const target=()=>({addEventListener(){},removeEventListener(){}})
 const window={...target()}
 const gsap={registerPlugin(){},ticker:{add(fn){callbacks.add(fn)},remove(fn){callbacks.delete(fn)}},matchMedia:()=>({add(queries,fn){this.cleanup=fn({conditions:{desktop,reduced}})},revert(){this.cleanup?.();reverted++}})}
 const scrollTrigger={update(){},refresh(){}}
 class Lenis{constructor(options){lenisCount++;assert.equal(options.syncTouch,false)}on(){}raf(){}destroy(){destroyed++}}
 const document={...target(),body:{...target(),append(node){nodes.push(node)}},querySelectorAll:()=>[],querySelector:()=>null,createElement(tag){return {style:{},classList:{remove(){},toggle(){}},setAttribute(){},remove(){removed++},tag}},head:{append(script){scripts.push(script.src);queueMicrotask(()=>{if(blocked){script.onerror();return}if(script.src.includes('gsap'))window.gsap=gsap;if(script.src.includes('ScrollTrigger'))window.ScrollTrigger=scrollTrigger;if(script.src.includes('lenis'))window.Lenis=Lenis;script.onload()})}}}
 const context={window,document,matchMedia:query=>({...target(),matches:query.includes('reduced')?reduced:desktop}),setTimeout(fn){const id=timers.size+1;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id),requestAnimationFrame:()=>1,cancelAnimationFrame(){},Node:{TEXT_NODE:3}}
 runInNewContext(motion,context)
 window.WistiaMotion.mount()
 for(const fn of timers.values())fn()
 await new Promise(resolve=>setImmediate(resolve))
 window.WistiaMotion.destroy()
 assert.equal(callbacks.size,0,'ticker cleaned on navigation')
 if(reduced){assert.equal(scripts.length,0);assert.equal(nodes.length,0);assert.equal(lenisCount,0)}
 else if(blocked){assert.equal(lenisCount,0)}
 else{assert.equal(scripts.length,3);assert.equal(lenisCount,desktop?1:0);assert.equal(destroyed,desktop?1:0);assert.equal(reverted,1);assert.equal(removed,desktop?1:0)}
}
await exercise()
await exercise({desktop:false})
await exercise({reduced:true})
await exercise({blocked:true})
console.log('Renewal product links, preserved analytics, desktop/mobile motion, reduced motion, blocked dependencies and teardown passed')
