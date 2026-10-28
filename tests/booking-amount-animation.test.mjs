import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/booking-wizard.js',import.meta.url),'utf8')
const frames=new Map();let serial=0,reduced=false
const win={requestAnimationFrame:fn=>{frames.set(++serial,fn);return serial},cancelAnimationFrame:id=>frames.delete(id),matchMedia:()=>({matches:reduced})}
runInNewContext(source.replace(' global.WistiaWizard=',' global.testUpdateAmount=updateAmount;\n global.WistiaWizard='),{window:win})
const amount={isConnected:true,textContent:''},button={setAttribute(name,value){this[name]=value},querySelector:()=>amount},state={}
const advance=now=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now))}
win.testUpdateAmount(button,120000,state)
assert.equal(amount.textContent,'120,000원')
win.testUpdateAmount(button,180000,state)
assert.equal(button['aria-label'],'다음 단계 · 180,000원')
advance(0);advance(190)
assert.ok(state.priceShown>120000&&state.priceShown<180000)
// Reverse midway: cancel the prior target and continue from the shown amount
win.testUpdateAmount(button,120000,state)
assert.equal(frames.size,1)
advance(200);advance(580)
assert.equal(amount.textContent,'120,000원')
assert.equal(frames.size,0)
reduced=true
win.testUpdateAmount(button,250000,state)
assert.equal(amount.textContent,'250,000원')
assert.equal(frames.size,0)
console.log('Animated totals, immediate accessible target, interrupted reversal and reduced-motion preference passed')
