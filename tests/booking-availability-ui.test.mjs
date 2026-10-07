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

// Regression: the two reported hangs and the timeout fallback, with controllable timers.
function harness(){
 const requests=[],timers=[]
 const context={window:{document:{hidden:false,addEventListener(){}},WistiaContact:{syncSubmitState(){}}},Date,Intl,AbortController,
  setTimeout(fn,ms){timers.push({fn,ms,cleared:false});return timers.length},clearTimeout(id){if(timers[id-1])timers[id-1].cleared=true},
  fetch(url,options){return new Promise((resolve,reject)=>requests.push({url,options,resolve,reject}))}}
 runInNewContext(source,context)
 const fire=min=>{for(const timer of timers)if(!timer.cleared&&timer.ms>=min){timer.cleared=true;timer.fn()}}
 return {api:context.window.WistiaBooking,requests,fire}
}
function makeForm(){
 const date=control(''),time=control(''),status={textContent:'',dataset:{}},error={hidden:true,textContent:''},list={hidden:true,textContent:''}
 date.disabled=true
 time.options=['','14:30','15:30','16:00','16:30','17:00','18:30','19:00'].map(value=>({value,textContent:value||'미정',disabled:false,dataset:{}}))
 Object.defineProperty(time,'selectedOptions',{get:()=>time.options.filter(option=>option.value===time.value)})
 const form={dataset:{},isConnected:true,querySelector(selector){return ({'#contact-bookingDate':date,'#contact-time':time,'[data-booking-status]':status,'[data-contact-date-error="bookingDate"]':error,'[data-booking-open-times]':list})[selector]}}
 date.closest=time.closest=()=>form
 return {form,date,time,status,list,opt:value=>time.options.find(option=>option.value===value)}
}
const day='2027-10-10',booking=[{start:'2027-10-10T08:00:00Z',end:'2027-10-10T10:00:00Z'}]
{ // (a) first date entry: radio change, date change, updatePrice re-mount and duplicate change must share one request
 const {api,requests}=harness(),f=makeForm()
 api.mount(f.form,'solo');await flush();assert.equal(f.form.dataset.scheduleState,'unknown')
 f.date.disabled=false;api.changed(f.date);await flush()
 f.date.value=day;api.changed(f.date);api.mount(f.form,'solo');api.changed(f.date)
 assert.equal(f.form.dataset.scheduleState,'loading')
 assert.ok(f.time.options.filter(option=>option.value).every(option=>option.disabled),'no time is selectable as available while checking')
 assert.equal(f.list.hidden,true)
 assert.equal(requests.length,1,'the only in-flight response is shared, not dropped')
 requests[0].resolve(payload(day,booking));await flush();await flush()
 assert.equal(f.form.dataset.scheduleState,'ready')
 assert.equal(f.opt('16:30').disabled,true);assert.match(f.opt('16:30').textContent,/마감/)
 assert.equal(f.opt('16:00').disabled,false);assert.equal(f.opt('19:00').disabled,false)
}
{ // (a') first date entry whose request never answers: timeout fallback, never "available"
 const {api,requests,fire}=harness(),f=makeForm()
 api.mount(f.form,'solo');f.date.disabled=false;f.date.value=day;api.changed(f.date)
 assert.equal(f.form.dataset.scheduleState,'loading');assert.equal(api.timeoutMs,8000)
 fire(api.timeoutMs);await flush();await flush()
 assert.equal(requests[0].options.signal.aborted,true)
 assert.equal(f.form.dataset.scheduleState,'unavailable');assert.match(f.status.textContent,/카카오톡에서 가능 여부/)
 assert.equal(f.list.hidden,true,'fallback never lists times as available')
 assert.ok(f.time.options.every(option=>!/마감/.test(option.textContent)))
 api.changed(f.date);assert.equal(requests.length,2,'a timed-out date is retried, not served from cache')
}
{ // (b) product switch story → SOLO re-renders the form while the story request is still in flight
 const {api,requests}=harness(),story=makeForm()
 api.mount(story.form,'duet-film');story.date.disabled=false;story.date.value=day;api.changed(story.date)
 const solo=makeForm();api.mount(solo.form,'solo');assert.equal(solo.form.dataset.scheduleState,'unknown')
 solo.date.disabled=false;solo.date.value=day;api.changed(solo.date);api.changed(solo.date);api.mount(solo.form,'solo')
 assert.equal(solo.form.dataset.scheduleState,'loading');assert.equal(requests.length,1,'switching products reuses the in-flight date request')
 requests[0].resolve(payload(day,booking));await flush();await flush()
 assert.equal(solo.form.dataset.scheduleState,'ready')
 assert.equal(solo.opt('16:30').disabled,true);assert.equal(solo.opt('16:00').disabled,false,'SOLO uses 60 minutes')
 // (b') switching back again renders immediately from the known closures for the new duration
 const story2=makeForm();api.mount(story2.form,'duet-film');story2.date.disabled=false;story2.date.value=day;api.changed(story2.date)
 assert.equal(story2.form.dataset.scheduleState,'ready');assert.equal(requests.length,1)
 assert.equal(story2.opt('14:30').disabled,true);assert.equal(story2.opt('19:00').disabled,false,'story blocks 180-minute overlaps')
 const solo2=makeForm();api.mount(solo2.form,'solo');solo2.date.disabled=false;solo2.date.value=day;api.mount(solo2.form,'solo')
 assert.equal(solo2.form.dataset.scheduleState,'ready');assert.equal(solo2.opt('16:00').disabled,false);assert.equal(solo2.opt('16:30').disabled,true)
 // copy refresh: always a fresh request even with a cached schedule, and a failure shows the Kakao fallback
 const copy=api.refresh();assert.equal(requests.length,2,'schedule is re-fetched right before copying');assert.equal(solo2.form.dataset.scheduleState,'loading')
 requests[1].reject(Error('notion down'));await copy
 assert.equal(solo2.form.dataset.scheduleState,'unavailable');assert.match(solo2.status.textContent,/카카오톡에서 가능 여부/)
 const late=api.refresh();requests[2].resolve(payload(day,booking));await late;assert.equal(solo2.form.dataset.scheduleState,'ready')
}
const contact=readFileSync(new URL('../js/contact-form.js',import.meta.url),'utf8'),app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
assert.match(contact,/role="status" aria-live="polite"/)
assert.match(contact,/aria-describedby="bookingAvailabilityStatus"/)
assert.match(app,/await window.WistiaBooking\?\.refresh\(\)/,'fresh check before copy')
console.log('Booking UI: closed weekdays, unknown dates, duration overlap, refresh/reopening, offline wish-only mode, stale response guard, accessibility and copy refresh passed')
