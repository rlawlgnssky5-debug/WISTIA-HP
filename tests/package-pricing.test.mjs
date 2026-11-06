import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
const require=createRequire(import.meta.url),pricing=require('../js/package-pricing.js'),booking=require('../js/booking-availability.js')
const q=v=>pricing.quote(v,'2026-10-22')

test('type table blurb follows the selected header tier color',()=>{
 const js=readFileSync(new URL('../js/package-pricing.js',import.meta.url),'utf8')
 const css=readFileSync(new URL('../css/inquiry-ux-51.css',import.meta.url),'utf8')
 assert.match(js,/if\(s\)when\.dataset\.tt=s;else delete when\.dataset\.tt/)
 assert.match(css,/\[data-tt="A"\]\{--wf-tt:#4A3238/)
 assert.match(css,/\[data-tt="B"\]\{--wf-tt:#A65A6C/)
 assert.match(css,/\[data-tt="C"\]\{--wf-tt:#D99A00/)
 assert.match(css,/\[data-tt="D"\]\{--wf-tt:#E0705A/)
 assert.match(css,/\.wf-tt-when\{[^}]*color:var\(--wf-tt,#5A3A40\)/)
 assert.match(css,/\.wf-tt-when i\{[^}]*color:var\(--wf-tt,#A65A6C\)/)
 assert.match(css,/\.wf-tt-when\{[^}]*background:var\(--wf-tt-bg,#FBE9EE\)/)
 assert.match(js,/class="wf-tt-save"/)
 assert.match(css,/\.wf-tt-save\{[^}]*border-radius:999px/)
 assert.match(css,/\.wf-tt-save\{[^}]*background:var\(--wf-tt-bg,#FBE9EE\)/)
 assert.match(css,/\.wf-tt-save\{[^}]*color:var\(--wf-tt,#5A3A40\)/)
 assert.doesNotMatch(js,/<br>개별 옵션 추가보다/)
})
test('first-use coupon is only for DELUXE PREMIUM DUET, including restored STANDARD selections',()=>{
 for(const firstVisit of ['1',true])for(const yearEndCoupon of ['1',true]){
  const result=q({package:'A',firstVisit,yearEndCoupon})
  assert.equal(result.total,90000)
  assert.equal(result.discounts.some(d=>['first','yearEnd'].includes(d.key)),false)
 }
 for(const key of ['B','C','D'])assert.equal(q({package:key,firstVisit:'1'}).total,pricing.packages[key].price-20000)
 assert.equal(q({package:'A',firstVisit:'1',bookingDate:'2026-12-24',timeStart:'13:00'}).total,60000,'date discounts remain available')
 assert.ok(pricing.firstVisitBanner().includes('DELUXE · PREMIUM · DUET ONLY'))
})
test('approved A/B/C prices and individual savings',()=>{
 assert.deepEqual(Object.values(pricing.packages).map(p=>[p.price,p.minutes,p.individual-p.price]),[[90000,50,0],[170000,90,40000],[220000,150,50000],[240000,150,60000]])
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
test('one additional hour costs 60000, including a further hour after C',()=>{
 assert.deepEqual(['A','B','C','D'].map(p=>{const r=q({package:p,options:['extraHour']});return [r.total,r.minutes]}),[[150000,110],[230000,150],[280000,210],[300000,210]])
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
test('weekday and time-slot discounts are not charged',()=>{
 for(const timeStart of ['09:00','13:00','14:00','15:00','16:00','20:00','']){
  assert.equal(q({bookingDate:'2026-10-23',timeStart}).discount,0)
  assert.equal(q({bookingDate:'2026-10-24',timeStart}).discount,0)
  assert.equal(q({bookingDate:'2026-10-25',timeStart}).discount,0)
 }
 assert.equal(pricing.weekdayDiscount('2026-10-23','13:00'),0)
})
test('one-month advance is 10,000 and a later month does not add another 20,000',()=>{
 assert.equal(q({package:'B',bookingDate:'2026-11-21'}).discount,0)
 assert.equal(q({package:'B',bookingDate:'2026-11-22'}).discount,10000)
 assert.equal(q({package:'B',bookingDate:'2026-12-21'}).discount,10000)
 const result=q({package:'B',bookingDate:'2026-12-22'});assert.equal(result.discount,10000);assert.equal(result.discounts.length,1)
 assert.equal(result.discounts[0].key,'advance1')
 assert.equal(pricing.addMonths('2026-01-31',1),'2026-02-28')
})
test('public holidays still do not add a time discount, and advance stays 10,000',()=>{
 for(const date of ['2026-01-01','2026-05-01','2026-07-17','2026-09-24','2026-09-25','2026-10-09','2026-12-25','2027-01-01','2027-05-13','2027-09-16','2028-01-27','2028-01-28','2028-05-05','2028-10-05','2031-12-25']){
  assert.equal(pricing.isPublicHoliday(date),true,date)
  assert.equal(pricing.weekdayDiscount(date,'13:00'),0,date)
 }
 const christmas=q({package:'C',firstVisit:'1',bookingDate:'2026-12-25',timeStart:'13:00'})
 assert.equal(christmas.discount,30000);assert.equal(christmas.total,190000);assert.ok(!christmas.discounts.some(d=>d.key==='weekday'))
 assert.equal(q({package:'C',firstVisit:'1',bookingDate:'2026-12-24',timeStart:'13:00'}).total,190000)
 assert.equal(pricing.weekdayDiscount('2027-05-14','13:00'),0)
 for(const date of ['','invalid','2026-02-31','2026-12-24'])assert.equal(pricing.isPublicHoliday(date),false)
})

test('calendar and time hint helpers match quote thresholds and reject invalid inputs',()=>{
 for(const [date,amount] of [['2026-11-21',0],['2026-11-22',10000],['2026-12-21',10000],['2026-12-22',10000]])assert.equal(pricing.advanceDiscount(date,'2026-10-22')?.amount||0,amount)
 assert.equal(pricing.advanceDiscount('2026-02-31','2026-01-31'),null)
 assert.equal(pricing.advanceDiscount('2026-02-28','2026-01-31').amount,10000)
 assert.equal(pricing.advanceDiscount('2026-03-31','2026-01-31').amount,10000)
 assert.equal(pricing.advanceDiscount('', '2026-10-22'),null)
 assert.equal(pricing.weekdayDiscount('2026-10-23','13:00'),0)
 for(const args of [['2026-10-23','16:01'],['2026-10-24','14:00'],['invalid','14:00'],['2026-10-23','']])assert.equal(pricing.weekdayDiscount(...args),0)
 assert.equal(q({eventDate:'2027-01-10',bookingDate:'2026-10-24'}).discount,0,'advance discount uses recording date, not wedding date')
})
test('approved discounts combine for eligible packages without inventing a payback cap',()=>{
 const result=q({package:'B',firstVisit:'1',bookingDate:'2026-12-24',timeStart:'14:00',paybackBlog:'1',paybackReaction:'1'})
 assert.equal(result.discount,30000);assert.equal(result.total,140000);assert.equal(result.payback,60000)
 assert.equal(q({paybackBlog:'1',paybackReaction:'1'}).total,90000)
})
test('recording length follows the package and extra hour, with no promo minutes',()=>{
 assert.equal(q({package:'C',extraHour:'1',eventDate:'2026-12-30'}).minutes,210)
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
 assert.equal(q({package:'B',rush:'1'}).total,200000)
})
test('draft whitelist retains new fields and drops removed options',()=>{
 const text=readFileSync(new URL('../js/booking-draft.js',import.meta.url),'utf8')
 assert.ok(!text.includes('lyricVideo'));assert.ok(!text.includes('extraVerse'));assert.ok(!text.includes('lipsync'))
 for(const name of ['package','extraHour','tuning','detailMix','firstVisit'])assert.ok(text.includes(name))
 for(const name of ['paybackBlog','paybackReaction','eventDate'])assert.ok(!text.includes(name))
})
test('정밀 믹싱 option is 20000 for STANDARD and included in mixing packages',()=>{
 assert.equal(q({package:'A',options:['precisionMix']}).total,110000)
 for(const p of ['B','C','D'])assert.equal(q({package:p,options:['precisionMix']}).options.length,0)
})
test('limited coupon combines with first visit and date discounts without the retired visit window',()=>{
 assert.equal(pricing.quote({package:'B',yearEndCoupon:'1',bookingDate:'2026-12-31'},'2026-10-27').total,130000)
 assert.equal(pricing.quote({package:'B'},'2026-10-27').total,170000)
 assert.equal(pricing.quote({package:'A',yearEndCoupon:'1',bookingDate:'2026-12-31'},'2026-10-27').total,70000)
 assert.equal(pricing.quote({package:'B',yearEndCoupon:'1'},'2026-11-01').total,150000)
 assert.equal(pricing.quote({package:'B',yearEndCoupon:'1',bookingDate:'2026-12-31'},'2026-11-01').total,140000)
 assert.equal(pricing.quote({package:'B',yearEndCoupon:'1',bookingDate:'2027-01-02'},'2026-10-27').total,130000)
 assert.deepEqual(['B','C','D'].map(k=>pricing.quote({package:k,firstVisit:'1',yearEndCoupon:'1',bookingDate:pricing.bestDate('2026-10-27'),timeStart:'13:00'},'2026-10-27').total),[100000,150000,170000])
 for(const date of ['2025-12-31','2026-02-30'])assert.equal(pricing.quote({package:'B',yearEndCoupon:'1',bookingDate:date},'2026-10-27').discounts.some(d=>d.key==='yearEnd'),false)
 assert.equal(pricing.yearEndActive('2026-12-31'),true)
 assert.equal(pricing.yearEndActive('2027-01-01'),true,'server receipt validity controls expiry across the new year')
 assert.equal(pricing.quote({package:'B',yearEndCoupon:'1',bookingDate:'2026-12-31'},'2027-01-01').total,170000)
 assert.equal(pricing.quote({package:'B',octoberCoupon:'1',bookingDate:'2026-12-31'},'2026-10-27').discounts.some(d=>d.key==='yearEnd'),false)
 assert.deepEqual(['A','B','C','D'].map(k=>pricing.cardCouponPrice(pricing.packages[k],'2026-10-27')),[90000,130000,180000,200000])
 assert.deepEqual(['A','B','C','D'].map(k=>pricing.cardCouponPrice(pricing.packages[k],'2026-10-27','2027-01-02')),[90000,130000,180000,200000])
 assert.equal(pricing.bestCouponPrice(pricing.packages.B,'2026-11-10'),100000)
})

test('maximum example is only the unused one-month advance, with no weekday amount',()=>{
 for(const [key,price] of [['B',170000],['C',220000],['D',240000]]){
  for(const date of ['','2026-10-30','2026-11-27']){
   const html=pricing.priceLines(pricing.packages[key],'2026-10-29',date)
   assert.match(html,/사전 예약 할인까지 최대/)
   assert.match(html,new RegExp('<dd>'+pricing.money(price-10000)+'</dd>'))
   assert.match(html,/10,000원 ↓/)
   assert.doesNotMatch(html,/목·금|13~16/)
  }
  for(const date of ['2026-12-25','2027-01-02']){
   const html=pricing.priceLines(pricing.packages[key],'2026-10-29',date)
   assert.equal(html.includes('is-best'),false,key+' '+date)
   assert.match(html,/160,000원|210,000원|230,000원|현재 적용가/)
  }
 }
 const actual=pricing.quote({package:'B',firstVisit:'1',yearEndCoupon:'1',bookingDate:'2026-10-30',timeStart:'13:00'},'2026-10-29')
 assert.equal(actual.total,150000)
 assert.equal(actual.discounts.some(d=>d.key==='weekday'||d.key==='advance1'),false)
})

test('received limited coupon works before date selection and for October and January visits',()=>{
 for(const key of ['B','C','D'])for(const date of ['','2026-10-27','2026-10-30','2026-11-01','2026-12-31','2027-01-01','2027-01-02'])assert.equal(pricing.quote({package:key,yearEndCoupon:'1',bookingDate:date},'2026-10-27').discounts.some(d=>d.key==='yearEnd'),true)
 assert.equal(pricing.quote({package:'A',yearEndCoupon:'1'},'2026-10-27').discounts.some(d=>d.key==='yearEnd'),false)
 assert.equal(pricing.cardCouponPrice(pricing.packages.B,'2026-10-27','2026-10-30'),130000)
 assert.equal(pricing.cardCouponPrice(pricing.packages.B,'2026-10-27','2026-11-01'),130000)
 assert.equal(pricing.yearEndCopy.visit,'수령 후 24시간 이내 사용')
 assert.equal(pricing.yearEndCopy.products,'DELUXE · PREMIUM · DUET ONLY')
 const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
 assert.ok(!app.includes('data-package-total'))
 const sales=app.match(/function packageSalesSection\(key\)\{[^\n]+/)[0]
 assert.ok(!sales.includes('firstVisitBanner'))
 assert.ok(sales.includes('WistiaPackages.cards(p.key)'))
 assert.ok(sales.includes('선택한 구성으로 문의양식 작성'))
})

test('approved ticket asset and banner size synchronization preserve coupon eligibility',()=>{
 assert.equal(pricing.yearEndImage,'/assets/editorial/year-end-ticket-rose-v1.webp')
 assert.equal(typeof pricing.mountYearEndBanners,'function')
 const source=readFileSync(new URL('../js/package-pricing.js',import.meta.url),'utf8'),css=readFileSync(new URL('../css/canvas-780.css',import.meta.url),'utf8')
 assert.ok(source.includes('ResizeObserver(sync)'))
 assert.ok(source.includes("global.getComputedStyle(reference).height"))
 assert.ok(css.includes('height:var(--year-end-height,auto)'))
 assert.ok(css.includes('.year-end-products{margin-top:5px'))
 assert.equal(pricing.quote({package:'B',yearEndCoupon:'1',firstVisit:'1',bookingDate:'2026-12-31',timeStart:'13:00'},'2026-10-27').total,100000)
})

test('package savings badge is beside the package price label without duplicate badges',()=>{
 for(const [key,amount,price] of [['B','40,000원','170,000원'],['C','50,000원','220,000원'],['D','60,000원','240,000원']]){
  const html=pricing.selectionDetails(key),row=html.match(/<div class="is-pkg">(.*?)<div class="is-coupon">/)[1]
  assert.ok(row.includes('<dt><span class="package-price-label">패키지 할인가</span><span class="price-down-pill" aria-label="'+amount+' 할인">'+amount+' ↓</span></dt>'))
  assert.equal((row.match(/price-down-pill/g)||[]).length,1)
  assert.ok(row.includes('<dd>'+price+'</dd>'))
 }
})

test('coupon and maximum savings badges share their labels without separate badge rows',()=>{
 const html=pricing.selectionDetails('D')
 for(const cls of ['is-coupon','is-best']){
  const row=html.split('<div class="'+cls+'">')[1].split('</dt>')[0]
  assert.ok(row.includes('<dt><span class="package-price-label">'))
  assert.equal((row.match(/price-down-pill/g)||[]).length,1)
 }
 assert.equal((html.match(/<\/dd><\/div><span class="price-down-pill">/g)||[]).length,0)
})

test('approved rose halo replaces both the section and its legacy grey paint layer',()=>{
 const css=readFileSync(new URL('../css/canvas-780.css',import.meta.url),'utf8')
 assert.ok(css.includes('.ed-worries{--ed-surface:#fff;--ed-next-surface:#fff;background:radial-gradient'))
 assert.ok(css.includes('.ed-worries::before{background:inherit!important}'))
 assert.ok(css.includes('.package-price-label{flex:0 1 auto!important;min-width:0!important;white-space:normal!important'))
 for(const key of ['B','C','D'])assert.ok(!pricing.selectionDetails(key).includes('DOWN'))
})
