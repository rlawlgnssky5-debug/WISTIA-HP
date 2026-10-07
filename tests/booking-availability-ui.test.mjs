import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/booking-availability.js',import.meta.url),'utf8')
const requests=[],events={}
const control=value=>({value,disabled:false,validationMessage:'',dataset:{},setCustomValidity(message){this.validationMessage=message},setAttribute(){},removeAttribute(){}})
const date=control(''),time=control('17:00'),status={textContent:'',dataset:{}},error={hidden:true,textContent:''},list={hidden:true,textContent:''}
time.options=['','16:00','16:30','17:00','18:00','19:00','23:00'].map(value=>({value,textContent:value||'미정',disabled:false,dataset:{}}))
Object.defineProperty(time,'selectedOptions',{get:()=>time.options.filter(option=>option.value===time.value)})
const form={dataset:{},isConnected:true,querySelector(selector){return ({'#contact-bookingDate':date,'#contact-time':time,'[data-booking-status]':status,'[data-contact-date-error="bookingDate"]':error,'[data-booking-open-times]':list})[selector]}}
date.closest=()=>form
const context={window:{document:{hidden:false,addEventListener(name,handler){events[name]=handler}},WistiaContact:{syncSubmitState(){}}},Date,Intl,AbortController,setTimeout,clearTimeout,fetch(url,options){return new Promise((resolve,reject)=>requests.push({url,options,resolve,reject}))}}
runInNewContext(source,context)
const api=context.window.WistiaBooking,flush=()=>new Promise(resolve=>setTimeout(resolve,0))
const payload=(selected,blocks=[])=>({ok:true,json:async()=>({ok:true,date:selected,blocks})})
api.mount(form,'solo');await flush()
assert.equal(form.dataset.scheduleState,'unknown');assert.equal(requests.length,0)
date.value='2027-10-11';api.changed(date);await flush()
assert.equal(form.dataset.scheduleState,'closed');assert.match(date.validationMessage,/월·화·수/)
assert.equal(requests.length,0)
date.value='2027-10-10';api.changed(date)
assert.equal(form.dataset.scheduleState,'loading');assert.match(date.validationMessage,/확인/)
const booked=[{start:'2027-10-10T08:00:00Z',end:'2027-10-10T10:00:00Z'}]
requests.at(-1).resolve(payload(date.value,booked));await flush()
assert.equal(time.options.find(option=>option.value==='16:00').disabled,false)
assert.equal(time.options.find(option=>option.value==='16:30').disabled,true)
assert.equal(time.options.find(option=>option.value==='19:00').disabled,false)
assert.equal(form.dataset.scheduleState,'closed');assert.match(time.validationMessage,/마감/)
time.value='16:00';api.changed(date);await flush();assert.equal(form.dataset.scheduleState,'ready')
api.mount(form,'duo');await flush()
assert.equal(time.options.find(option=>option.value==='16:00').disabled,true,'full product duration, not just start time, must fit')
assert.equal(time.options.find(option=>option.value==='23:00').disabled,true,'Sunday cannot extend into Monday')
assert.equal(requests.length,1,'duration changes reuse known closures')
const reopen=api.refresh();requests.at(-1).resolve(payload(date.value));await reopen
assert.equal(time.options.find(option=>option.value==='16:00').disabled,false)
const offline=api.refresh();requests.at(-1).reject(Error('unconfigured'));await offline
assert.equal(form.dataset.scheduleState,'unavailable');assert.match(status.textContent,/카카오톡에서 가능 여부/)
assert.equal(date.validationMessage,'');assert.equal(time.validationMessage,'','offline permits wish inquiry, not a false availability promise')
assert.equal(time.options.find(option=>option.value==='23:00').disabled,true,'known operating-day constraints apply even when Notion is offline')
date.value='2027-10-14';api.changed(date);const stale=requests.at(-1)
date.value='2027-10-15';api.changed(date);const fresh=requests.at(-1)
assert.equal(stale.options.signal.aborted,true)
fresh.resolve(payload(date.value));await flush()
stale.resolve(payload('2027-10-14',[{start:'2027-10-14T00:00:00Z',end:'2027-10-16T00:00:00Z'}]));await flush()
assert.equal(form.dataset.scheduleState,'ready','stale responses cannot overwrite current date')
date.disabled=true;api.changed(date);await flush();assert.equal(form.dataset.scheduleState,'unknown')
assert.equal(list.hidden,true)
api.mount(null);events.visibilitychange();assert.equal(requests.length,5)
const contact=readFileSync(new URL('../js/contact-form.js',import.meta.url),'utf8'),app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
assert.match(contact,/role="status" aria-live="polite"/)
assert.match(contact,/aria-describedby="bookingAvailabilityStatus"/)
assert.match(app,/await window.WistiaBooking\?\.refresh\(\)/,'fresh check before copy')
console.log('Booking UI: closed weekdays, unknown dates, duration overlap, refresh/reopening, offline wish-only mode, stale response guard, accessibility and copy refresh passed')
