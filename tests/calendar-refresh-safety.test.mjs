import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=name=>readFileSync(new URL('../js/'+name,import.meta.url),'utf8')
const requests=[],timers=new Map(),window={document:{addEventListener(){},querySelectorAll(){return []}}}
runInNewContext(read('booking-availability.js'),{window,Date,Intl,AbortController,fetch:(url,options)=>new Promise((resolve,reject)=>requests.push({url,options,resolve,reject})),setTimeout:(fn,ms)=>{const id={};timers.set(id,{fn,ms});return id},clearTimeout:id=>timers.delete(id)})
runInNewContext(read('contact-form.js'),{window,Date,Intl})
const api=window.WistiaBooking,cells=window.WistiaContact.calendar.cells,from='2026-10-01',to='2026-10-31'
const blocks=[9,18,25].map(day=>({start:`2026-10-${String(day-1).padStart(2,'0')}T15:00Z`,end:`2026-10-${String(day).padStart(2,'0')}T15:00Z`}))
const reply=blocks=>({ok:true,json:async()=>({ok:true,from,to,blocks})})
function closed(){for(const product of ['solo','duo','duet-film'])for(const day of [9,18,25]){const markup=cells(2026,9,'bookingDate','','2026-10-08',api.calendarBlocks(from,to),product,true),cell=markup.match(new RegExp('<button[^>]*data-calendar-day="2026-10-'+String(day).padStart(2,'0')+'"[^>]*>.*?</button>'))[0];assert.match(cell,/ disabled/);assert.match(cell,/<small>마감<\/small>/)}}
const initial=cells(2026,9,'bookingDate','','2026-10-08',null)
for(const day of [9,11,18,25])assert.match(initial.match(new RegExp('<button[^>]*data-calendar-day="2026-10-'+String(day).padStart(2,'0')+'"[^>]*>'))[0],/ disabled[^>]*확인 중/)
const first=api.loadRange(from,to);requests[0].reject(Error('first offline'));await assert.rejects(first)
assert.equal(api.calendarBlocks(from,to),null);assert.equal(api.calendarRangeFailed(from,to),true)
const success=api.loadRange(from,to);requests[1].resolve(reply(blocks));await success;closed()
const failure=api.loadRange(from,to,true);requests[2].reject(Error('refresh offline'));await assert.rejects(failure);closed()
assert.equal(api.calendarRangeFailed(from,to),true)
const timeout=api.loadRange(from,to,true),rejection=assert.rejects(timeout)
for(const timer of [...timers.values()])if(timer.ms===8000)timer.fn()
await rejection;closed();assert.equal(requests[3].options.signal.aborted,true)
requests[3].resolve(reply([]));await Promise.resolve();await Promise.resolve();closed()
const recovery=api.loadRange(from,to);assert.equal(requests.length,5,'failed refresh retries even with a retained fresh cache');requests[4].resolve(reply([]));await recovery
assert.equal(api.calendarBlocks(from,to).length,0);assert.equal(api.calendarRangeFailed(from,to),false)
console.log('First unknown/failed dates disabled, successful closures retained across failed and timed-out refreshes, late response rejected, successful recovery reopens dates passed')

const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
assert.match(app.slice(app.indexOf('const INFO_FAQ_GROUPS='),app.indexOf('const SERVICE_ORDER')),/모든 상품은 1곡 기준이에요.*60,000원/)
