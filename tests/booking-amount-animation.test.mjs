import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../js/'+file,import.meta.url),'utf8')
const source=read('booking-wizard.js')
const frames=new Map();let serial=0,reduced=false
const win={addEventListener(){},requestAnimationFrame:fn=>{frames.set(++serial,fn);return serial},cancelAnimationFrame:id=>frames.delete(id),matchMedia:()=>({matches:reduced})}
const context={window:win}
for(const file of ['package-pricing.js','recording-config.js'])runInNewContext(read(file),context)
runInNewContext(source.replace(' global.WistiaWizard=',' global.testUpdateAmount=updateAmount;\n global.WistiaWizard='),context)
const amount={isConnected:true,textContent:'',classList:{add(){},remove(){}}},button={setAttribute(name,value){this[name]=value},querySelector:()=>amount},state={}
const advance=now=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now))}
win.testUpdateAmount(button,120000,state)
assert.equal(amount.textContent,'120,000원')
win.testUpdateAmount(button,180000,state)
assert.equal(button['aria-label'],'다음 단계 · 180,000원')
advance(0);advance(190)
assert.ok(state.rolls.next.shown>120000&&state.rolls.next.shown<180000)
// Reverse midway: cancel the prior target and continue from the shown amount
win.testUpdateAmount(button,120000,state)
assert.equal(frames.size,1)
advance(200);advance(700)
assert.equal(amount.textContent,'120,000원')
assert.equal(frames.size,0)
reduced=true
win.testUpdateAmount(button,250000,state)
assert.equal(amount.textContent,'250,000원')
assert.equal(frames.size,0)
console.log('Animated totals, immediate accessible target, interrupted reversal and reduced-motion preference passed')
