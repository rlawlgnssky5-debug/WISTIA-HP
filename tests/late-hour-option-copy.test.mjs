import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const require=createRequire(import.meta.url),pricing=require('../js/package-pricing.js'),booking=require('../js/booking-availability.js')
assert.equal(booking.timeWindows('ar-150').at(-1).value,'23:00')
for(const key of ['A','B','C','D'])assert.equal(booking.slotBlocked('2026-11-05','23:00',pricing.packages[key].minutes,[]),false,key+' late start')
const nextDay=[{start:'2026-11-06T00:00:00+09:00',end:'2026-11-06T02:00:00+09:00'}]
for(const key of ['A','B','C','D'])assert.equal(booking.slotBlocked('2026-11-05','23:00',pricing.packages[key].minutes,nextDay),true,key+' next-day booking buffer remains blocking')
assert.equal(booking.slotBlocked('2026-11-08','23:00',50,[]),true,'Sunday closing is unchanged')
assert.equal(booking.slotBlocked('2026-11-05','23:30',50,[]),true,'23:00 is the last start')
assert.equal(booking.slotBlocked('2026-11-04','23:00',50,[]),true,'non-operating dates remain closed')
for(const [key,total,minutes]of [['A',150000,110],['B',230000,150],['C',280000,210]]){
 const q=pricing.quote({package:key,extraHour:'1'},'2026-10-30');assert.equal(q.total,total);assert.equal(q.minutes,minutes);assert.equal(q.options.find(o=>o.key==='extraHour').label,'녹음 1시간 추가')
}
// DUET's already-included extra time is not charged a second time.
assert.equal(pricing.quote({package:'D',extraHour:'1'}).total,240000)
const window={WistiaPackages:pricing};runInNewContext(readFileSync(new URL('../js/booking-wizard.js',import.meta.url),'utf8'),{window})
assert.equal(window.WistiaWizard.range('23:00',150),'23:00~다음 날 01:30')
assert.equal(window.WistiaWizard.range('23:00',210),'23:00~다음 날 02:30')
assert.equal(window.WistiaWizard.range('13:00',110),'13:00~14:50')
console.log('23:00 choices, next-day collision protection, Sunday closure, 60-minute/60000 option, included DUET and readable midnight ranges passed')
