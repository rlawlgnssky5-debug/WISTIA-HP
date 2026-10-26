import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
const require=createRequire(import.meta.url),pricing=require('../js/package-pricing.js'),booking=require('../js/booking-availability.js')
const q=v=>pricing.quote(v,'2026-10-22')
test('approved A/B/C prices and individual savings',()=>{
 assert.deepEqual(Object.values(pricing.packages).map(p=>[p.price,p.minutes,p.individual-p.price]),[[90000,50,0],[150000,90,40000],[200000,150,50000],[220000,150,60000]])
 for(const p of ['A','B','C'])assert.equal(q({package:p}).total,pricing.packages[p].price)
 for(const key of ['unknown','__proto__','constructor'])assert.equal(q({package:key}).total,90000)
})
test('tuning and detail mixing are never charged twice in B/C',()=>{
 assert.equal(q({package:'A',options:['tuning','detailMix']}).total,150000)
 for(const p of ['B','C']){const result=q({package:p,options:['tuning','detailMix']});assert.equal(result.options.length,0);assert.equal(result.total,pricing.packages[p].price)}
})
test('duet changes people, not the selected recording time',()=>{
 for(const p of ['A','B','C']){const result=q({package:p,people:'1'});assert.equal(result.total,pricing.packages[p].price+30000);assert.equal(result.minutes,pricing.packages[p].minutes)}
})
test('one additional hour costs 50000, including a further hour after C',()=>{
 assert.deepEqual(['A','B','C'].map(p=>{const r=q({package:p,options:['extraHour']});return [r.total,r.minutes]}),[[140000,100],[200000,140],[250000,200]])
})
test('removed 100% AR option is not offered or charged from legacy selections',()=>{
 assert.equal(pricing.options.some(o=>o.key==='lipsync'),false)
 for(const p of ['A','B','C']){
  const old=q({package:p,lipsync:'1',options:['lipsync']})
  assert.equal(old.total,pricing.packages[p].price)
  assert.deepEqual(old.options,[])
  assert.deepEqual(old.v.options,[])
  assert.equal(q({package:p,lipsync:'1'}).total,pricing.packages[p].price)
 }
 assert.equal(q({package:'A',options:['lipsync','tuning','detailMix']}).total,150000)
})
test('removed verse and lyric draft selections cannot affect the quote',()=>{
 assert.equal(q({options:['lyrics-video','extra-verse'],lyricVideo:'1',extraVerse:'1'}).total,90000)
 assert.equal(pricing.options.some(o=>/가사|1절/.test(o.label)),false)
})
test('weekday discount is one condition, Thursday/Friday 13:00 through 16:00',()=>{
 for(const timeStart of ['13:00','14:00','15:00','16:00'])assert.equal(q({bookingDate:'2026-10-23',timeStart}).discount,10000)
 for(const [bookingDate,timeStart] of [['2026-10-23','12:59'],['2026-10-23','16:01'],['2026-10-24','14:00'],['2026-10-23','']])assert.equal(q({bookingDate,timeStart}).discount,0)
})
test('one-month and two-month discounts are mutually exclusive calendar intervals',()=>{
 assert.equal(q({bookingDate:'2026-11-21'}).discount,0)
 assert.equal(q({bookingDate:'2026-11-22'}).discount,10000)
 assert.equal(q({bookingDate:'2026-12-21'}).discount,10000)
 const result=q({bookingDate:'2026-12-22'});assert.equal(result.discount,20000);assert.equal(result.discounts.length,1)
 assert.equal(pricing.addMonths('2026-01-31',1),'2026-02-28')
})
test('public holidays never receive the Thursday/Friday time discount',()=>{
 for(const date of ['2026-01-01','2026-05-01','2026-07-17','2026-09-24','2026-09-25','2026-10-09','2026-12-25','2027-01-01','2027-05-13','2027-09-16','2028-01-27','2028-01-28','2028-05-05','2028-10-05','2031-12-25']){
  assert.equal(pricing.isPublicHoliday(date),true,date)
  for(const time of ['13:00','14:00','15:00','16:00'])assert.equal(pricing.weekdayDiscount(date,time),0,date+' '+time)
 }
 const christmas=q({package:'C',firstVisit:'1',bookingDate:'2026-12-25',timeStart:'13:00'})
 assert.equal(christmas.discount,40000);assert.equal(christmas.total,160000);assert.ok(!christmas.discounts.some(d=>d.key==='weekday'))
 assert.equal(q({package:'C',firstVisit:'1',bookingDate:'2026-12-24',timeStart:'13:00'}).total,150000)
 assert.equal(pricing.weekdayDiscount('2027-05-14','13:00'),10000)
 for(const date of ['','invalid','2026-02-31','2026-12-24'])assert.equal(pricing.isPublicHoliday(date),false)
})

test('calendar and time hint helpers match quote thresholds and reject invalid inputs',()=>{
 for(const [date,amount] of [['2026-11-21',0],['2026-11-22',10000],['2026-12-21',10000],['2026-12-22',20000]])assert.equal(pricing.advanceDiscount(date,'2026-10-22')?.amount||0,amount)
 assert.equal(pricing.advanceDiscount('2026-02-31','2026-01-31'),null)
 assert.equal(pricing.advanceDiscount('2026-02-28','2026-01-31').amount,10000)
 assert.equal(pricing.advanceDiscount('2026-03-31','2026-01-31').amount,20000)
 assert.equal(pricing.advanceDiscount('', '2026-10-22'),null)
 assert.equal(pricing.weekdayDiscount('2026-10-23','13:00'),10000)
 for(const args of [['2026-10-23','16:01'],['2026-10-24','14:00'],['invalid','14:00'],['2026-10-23','']])assert.equal(pricing.weekdayDiscount(...args),0)
 assert.equal(q({eventDate:'2027-01-10',bookingDate:'2026-10-24'}).discount,0,'advance discount uses recording date, not wedding date')
})
test('approved discounts combine without inventing a payback cap',()=>{
 const result=q({firstVisit:'1',bookingDate:'2026-12-24',timeStart:'14:00',paybackBlog:'1',paybackReaction:'1'})
 assert.equal(result.discount,50000);assert.equal(result.total,40000);assert.equal(result.payback,60000)
 assert.equal(q({paybackBlog:'1',paybackReaction:'1'}).total,90000)
})
test('recording length follows the package and extra hour, with no promo minutes',()=>{
 assert.equal(q({package:'C',extraHour:'1',eventDate:'2026-12-30'}).minutes,200)
 assert.equal(q({eventDate:'2026-12-30'}).minutes,50)
 assert.equal(q({eventDate:'2026-12-30',eventDateMode:'unknown'}).minutes,50)
 assert.equal(q({eventDate:'2027-01-01'}).minutes,50)
 assert.equal(booking.duration('ar-60'),60);assert.equal(booking.duration('ar-120'),120);assert.equal(booking.duration('ar-180'),180)
})
test('delivery depends on correction rather than people',()=>{
 assert.match(q({package:'A'}).delivery,/당일/)
 assert.match(q({package:'A',tuning:'1'}).delivery,/영업일 7일/)
 assert.match(q({package:'B'}).delivery,/영업일 7일/)
 assert.equal(q({package:'A',rush:'1'}).total,90000,'same-day A is not charged for a removed rush option')
 assert.equal(q({package:'B',rush:'1'}).total,180000)
})
test('draft whitelist retains new fields and drops removed options',()=>{
 const text=readFileSync(new URL('../js/booking-draft.js',import.meta.url),'utf8')
 assert.ok(!text.includes('lyricVideo'));assert.ok(!text.includes('extraVerse'));assert.ok(!text.includes('lipsync'))
 for(const name of ['package','extraHour','tuning','detailMix','firstVisit'])assert.ok(text.includes(name))
 for(const name of ['paybackBlog','paybackReaction','eventDate'])assert.ok(!text.includes(name))
})
