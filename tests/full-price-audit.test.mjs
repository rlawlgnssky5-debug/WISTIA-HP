import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import fs from 'node:fs'
const require=createRequire(import.meta.url),pricing=require('../js/package-pricing.js')
const tiers={A:{price:90000,minutes:50},B:{price:170000,minutes:90},C:{price:220000,minutes:150},D:{price:240000,minutes:150}}
const optionKeys=['tuning','detailMix','precisionMix','extraHour','rush'],fees=[40000,20000,20000,60000,30000]
const ref='2026-10-29',cases=[['',0,false],['2026-10-29',0,true],['2026-10-30',0,true],['2026-10-31',0,false],['2026-11-28',0,false],['2026-11-29',10000,false],['2026-12-28',10000,false],['2026-12-29',20000,false],['2026-12-31',20000,true],['2026-12-25',10000,false],['2027-01-01',20000,false],['2027-01-02',20000,false]]
test('independent approved-price oracle checks every type, option combination, people, coupon and boundary time',()=>{
 let checked=0
 for(const [tier,p] of Object.entries(tiers))for(let bits=0;bits<32;bits++)for(const people of ['0','1'])for(const first of [false,true])for(const limited of [false,true])for(const [date,advance,weekday] of cases)for(const time of ['','12:59','13:00','16:00','16:01']){
  const selected=optionKeys.filter((_,i)=>bits&(1<<i)),slow=tier!=='A'||selected.includes('tuning')
  const payable=selected.filter(k=>!(tier!=='A'&&['tuning','detailMix','precisionMix'].includes(k))&&!(tier==='D'&&k==='extraHour')&&!(k==='rush'&&!slow))
  const optionTotal=payable.reduce((sum,k)=>sum+fees[optionKeys.indexOf(k)],people==='1'&&tier!=='D'?30000:0)
  const weekdayAmount=weekday&&['13:00','16:00'].includes(time)?10000:0,limitedAmount=limited&&tier!=='A'?20000:0
  const expected=p.price+optionTotal-(first&&tier!=='A'?20000:0)-limitedAmount-advance-weekdayAmount
  const q=pricing.quote({package:tier,people,options:selected,firstVisit:first,yearEndCoupon:limited,bookingDate:date,timeStart:time,paybackBlog:true,paybackReaction:true},ref)
  assert.equal(q.total,expected,JSON.stringify({tier,people,selected,first,limited,date,time}))
  assert.equal(q.optionTotal,optionTotal);assert.equal(q.minutes,p.minutes+(selected.includes('extraHour')&&tier!=='D'?60:0));assert.equal(q.payback,60000)
  assert.equal(q.delivery,slow?(payable.includes('rush')?'녹음일 기준 3일 이내 전달':'영업일 7일 이내 전달'):'당일 음원 전달')
  checked++
 }
 fs.mkdirSync(new URL('../output/full-audit-20261029/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../output/full-audit-20261029/arithmetic.json',import.meta.url),JSON.stringify({checked,reference:ref,types:tiers,allPassed:true},null,2))
})
test('month-end advance boundaries use calendar months, including leap-year February',()=>{
 for(const [reference,before1,at1,before2,at2] of [['2026-01-31','2026-02-27','2026-02-28','2026-03-30','2026-03-31'],['2027-12-31','2028-01-30','2028-01-31','2028-02-28','2028-02-29']]){
  for(const [date,amount] of [[before1,0],[at1,10000],[before2,10000],[at2,20000]])assert.equal(pricing.advanceDiscount(date,reference)?.amount||0,amount)
 }
})
test('invalid clock values cannot receive a weekday time discount',()=>{
 for(const time of ['13:60','13:99','14:90','24:00','-1:00','13:0','noon'])assert.equal(pricing.weekdayDiscount('2026-10-30',time),0,time)
})
