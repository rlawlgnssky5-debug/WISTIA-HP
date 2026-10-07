import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const source=read('js/booking-availability.js')
const flush=()=>new Promise(resolve=>setImmediate(resolve))
const kst=(date,time)=>new Date(Date.parse(date+'T'+time+':00+09:00')).toISOString()
// 2027-10-08 (Fri) date-only Notion entry, 2027-10-10 (Sun) 17–19 partial, 2027-10-17 (Sun) 13:00–21:30
const october=[{start:kst('2027-10-08','00:00'),end:kst('2027-10-09','00:00')},{start:kst('2027-10-10','17:00'),end:kst('2027-10-10','19:00')},{start:kst('2027-10-17','13:00'),end:kst('2027-10-17','21:30')}]
function harness(){
 const requests=[],timers=[],repaints=[]
 const context={window:{document:{hidden:false,addEventListener(){}},WistiaContact:{syncSubmitState(){},mountCalendars(form){repaints.push(form)}}},Date,Intl,AbortController,
  setTimeout(fn,ms){timers.push({fn,ms,cleared:false});return timers.length},clearTimeout(id){if(timers[id-1])timers[id-1].cleared=true},
  fetch(url,options){return new Promise((resolve,reject)=>requests.push({url,options,resolve,reject}))}}
 runInNewContext(source,context)
 const fire=()=>{for(const timer of timers)if(!timer.cleared){timer.cleared=true;timer.fn()}}
 const form={isConnected:true,dataset:{},querySelector:()=>null}
 return {api:context.window.WistiaBooking,requests,repaints,fire,form}
}
const ok=(from,to,blocks)=>({ok:true,json:async()=>({ok:true,from,to,timeZone:'Asia/Seoul',operatingDays:[0,4,5,6],blocks,checkedAt:'2027-01-01T00:00:00.000Z'})})
const list=set=>[...set].sort()

{ // A fully booked day is marked for the current product from ONE month request
 const {api,requests,repaints,form}=harness()
 api.mount(form,'solo')
 const mounted=repaints.length
 assert.deepEqual(list(api.fullDays(2027,9)),[],'nothing is closed before the schedule has loaded')
 api.fullDays(2027,9)
 assert.equal(requests.length,1,'one shared range request per visible month')
 assert.equal(requests[0].url,'/api/availability?from=2027-10-01&to=2027-10-31')
 requests[0].resolve(ok('2027-10-01','2027-10-31',october));await flush();await flush()
 assert.equal(repaints.length,mounted+1,'the calendar repaints once the month has loaded')
 const loaded=repaints.length
 assert.deepEqual(list(api.fullDays(2027,9)),['2027-10-08'],'SOLO: date-only day closed, partial days stay clickable')
 api.mount(form,'duo')
 assert.deepEqual(list(api.fullDays(2027,9)),['2027-10-08'])
 api.mount(form,'duet-film')
 assert.deepEqual(list(api.fullDays(2027,9)),['2027-10-08','2027-10-17'],'story (180 min) cannot start late on a Sunday before the Monday closure')
 api.mount(form,'undecided')
 assert.deepEqual(list(api.fullDays(2027,9)),['2027-10-08'],'a whole-day entry is closed regardless of product')
 assert.equal(requests.length,1,'product switches reuse the cached month')
 assert.equal(repaints.length,loaded+3,'only the three product mounts repaint; no further range loads')
}
{ // A failed or late month request never closes (or opens) anything; the per-date check still applies
 const {api,requests,repaints,fire,form}=harness()
 api.mount(form,'solo')
 const mounted=repaints.length
 api.fullDays(2027,10)
 requests[0].reject(Error('offline'));await flush();await flush()
 assert.deepEqual(list(api.fullDays(2027,10)),[])
 assert.equal(requests.length,1,'a failure is not retried on every repaint')
 assert.equal(repaints.length,mounted,'a failure does not repaint')
 api.fullDays(2027,11)
 assert.equal(requests.length,2)
 fire();await flush();await flush()
 assert.equal(requests[1].options.signal.aborted,true,'late month requests are aborted after the timeout')
 assert.deepEqual(list(api.fullDays(2027,11)),[])
 api.fullDays(2027,9)
 requests[2].resolve({ok:true,json:async()=>({ok:true,from:'2027-10-01',to:'2027-10-30',blocks:october})});await flush();await flush()
 assert.deepEqual(list(api.fullDays(2027,9)),[],'a mismatched range response is treated as a failure')
 assert.equal(api.wholeDayBlocked('2027-10-08',october),true)
 assert.equal(api.wholeDayBlocked('2027-10-10',october),false)
}
{ // The calendar cell for a fully booked day looks and behaves like Mon/Tue/Wed
 const window={};runInNewContext(read('js/contact-form.js'),{window})
 const cells=window.WistiaContact.calendar.cells(2027,9,'bookingDate','','2027-10-01',new Set(['2027-10-08']))
 assert.match(cells,/data-calendar-day="2027-10-08"[^>]* disabled aria-label="2027년 10월 8일 \(금\) · 마감"[^>]*><span>8<\/span><small>마감<\/small>/)
 assert.match(cells,/data-calendar-day="2027-10-10" tabindex="-1" aria-label="2027년 10월 10일 \(일\)"[^>]*><span>10<\/span><\/button>/,'partly booked day stays clickable')
 assert.match(cells,/data-calendar-day="2027-10-11"[^>]* disabled aria-label="2027년 10월 11일 \(월\) · 마감"/)
 const plain=window.WistiaContact.calendar.cells(2027,9,'bookingDate','','2027-10-01')
 assert.doesNotMatch(plain,/data-calendar-day="2027-10-08"[^>]* disabled/,'without loaded data nothing extra is closed')
 const wedding=window.WistiaContact.calendar.cells(2027,9,'eventDate','','2027-10-01',new Set(['2027-10-08']))
 assert.doesNotMatch(wedding,/data-calendar-day="2027-10-08"[^>]* disabled/,'the wedding date calendar ignores studio bookings')
 const form=read('js/contact-form.js')
 assert.match(form,/state\.full=key==='bookingDate'\?global\.WistiaBooking\?\.fullDays\?\.\(state\.year,state\.month\)/)
 assert.match(form,/selectableDate\(value,key\)&&!state\.full\?\.has\(value\)/,'a closed cell cannot be chosen by click or keyboard')
}
assert.match(read('js/app.js'),/await window\.WistiaBooking\?\.refresh\(\)/,'the chosen date is still re-checked right before copying')
console.log('Month calendar: fully booked days 마감 per product, whole-day entries for every product, partial days open, one cached range request and safe failure fallback passed')
