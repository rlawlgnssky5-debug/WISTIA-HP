import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {test} from 'node:test'
const source=readFileSync(new URL('../js/booking-draft.js',import.meta.url),'utf8')
const store=new Map(),win={localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)}}
runInNewContext(source,{window:win,Date,JSON})
const api=win.WistiaBookingDraft
const data={step:4,view:'time',fields:{package:'C',people:'1',discovery:'스레드',eventDateMode:'unknown',bookingDate:'2026-10-22',timeStart:'15:00',rush:'1',tuning:'1',detailMix:'1',extraHour:'1',lipsync:'1',firstVisit:'1',paybackBlog:'1',paybackReaction:'1',lyricVideo:'1',specialNotes:'궁금한 점\n상담 부탁드려요',name:'must never persist',phone:'must never persist',extraVerse:'1'},wedding:{year:'2026',month:'12',day:'25'}}
assert.equal(api.save('solo',data),true)
const stored=JSON.parse(store.get('wistia:inquiry-draft:v1:solo'))
assert.equal(stored.version,1)
assert.ok(stored.savedAt)
assert.doesNotMatch(JSON.stringify(stored),/must never persist|extraVerse|lyricVideo|lipsync|phone|"name"/)
const loaded=api.read('solo')
assert.equal(loaded.step,4)
assert.equal(loaded.view,'time')
for(const field of ['package','people','discovery','bookingDate','timeStart','tuning','detailMix','extraHour','firstVisit','specialNotes'])assert.equal(loaded.fields[field],data.fields[field])
for(const field of ['eventDateMode','eventDate','paybackBlog','paybackReaction'])assert.equal(loaded.fields[field],undefined,'removed wedding and payback fields are discarded')
assert.equal(loaded.fields.rush,'1','approved 3-day delivery must retain its selected fee after reload')
assert.equal(loaded.fields.lipsync,undefined)
assert.equal(loaded.wedding.year,'')
assert.equal(api.read('duo'),null,'explicit product routes keep independent drafts')
api.save('duo',{step:1,wedding:{year:'2027',month:'2'}})
assert.equal(api.read('duo').wedding.day,'','partially filled wedding dates remain drafts')
assert.equal(api.read('solo').fields.people,'1')
stored.savedAt=Date.now()-8*24*60*60*1000
store.set('wistia:inquiry-draft:v1:solo',JSON.stringify(stored))
assert.equal(api.read('solo'),null)
assert.equal(store.has('wistia:inquiry-draft:v1:solo'),false)
store.set('wistia:inquiry-draft:v1:solo','broken json')
assert.equal(api.read('solo'),null)
const invalid=api.sanitize({step:999,fields:{eventDate:'2026-02-31',bookingDate:'bad',timeStart:'22:30',specialNotes:'a'.repeat(3000)},wedding:{year:'bad',month:'13',day:'32'}})
assert.equal(invalid.step,4)
for(const key of ['bookingDate','timeStart'])assert.equal(invalid.fields[key],'')
assert.equal(invalid.fields.specialNotes.length,2000)
assert.equal(invalid.wedding.month,'')
Object.defineProperty(win,'localStorage',{get(){throw Error('blocked')}})
assert.equal(api.read('solo'),null)
assert.equal(api.save('solo',data),false)
console.log('Browser-only allowlisted drafts, expiry, corrupt/blocked storage, partial dates, route isolation and personal-field exclusion passed')

const lifetime=24*60*60*1000,prefix='wistia:inquiry-draft:v1:'
function fixture(){
 let now=Date.UTC(2026,9,17,4)
 const storage=new Map([['wistia_vid','existing-visitor'],['unrelated','keep']])
 const window={localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}}
 class Clock extends Date{static now(){return now}}
 runInNewContext(source,{window,Date:Clock,JSON})
 return {api:window.WistiaBookingDraft,storage,advance:ms=>{now+=ms},now:()=>now}
}
test('legacy 100% AR selection is discarded when an old draft is read and saved',()=>{
 const f=fixture()
 f.storage.set(prefix+'solo',JSON.stringify({...data,version:1,savedAt:f.now()}))
 const draft=f.api.read('solo')
 assert.equal(draft.fields.lipsync,undefined)
 assert.equal(draft.fields.package,'C')
 assert.equal(draft.fields.extraHour,'1')
 f.api.save('solo',draft)
 assert.doesNotMatch(f.storage.get(prefix+'solo'),/lipsync/)
 assert.equal(f.storage.get('wistia_vid'),'existing-visitor')
})
for(const age of [lifetime-1])test('restores a draft aged '+age+'ms',()=>{
 const f=fixture()
 f.api.save('solo',data)
 f.advance(age)
 assert.equal(f.api.read('solo').fields.specialNotes,data.fields.specialNotes)
 assert.ok(f.storage.has(prefix+'solo'))
})
test('clears only the expired draft at 24 hours',()=>{
 const f=fixture()
 f.api.save('solo',data)
 f.advance(lifetime)
 f.api.save('duo',data)
 assert.equal(f.api.read('solo'),null)
 assert.equal(f.storage.has(prefix+'solo'),false)
 assert.ok(f.api.read('duo'))
 assert.equal(f.storage.get('wistia_vid'),'existing-visitor')
 assert.equal(f.storage.get('unrelated'),'keep')
})
test('each save refreshes savedAt and starts a new 24-hour lifetime',()=>{
 const f=fixture()
 f.api.save('solo',data)
 const first=JSON.parse(f.storage.get(prefix+'solo')).savedAt
 f.advance(lifetime-1)
 f.api.save('solo',{...data,fields:{...data.fields,specialNotes:'latest input'}})
 assert.equal(JSON.parse(f.storage.get(prefix+'solo')).savedAt,f.now())
 assert.ok(f.now()>first)
 f.advance(lifetime-1)
 assert.equal(f.api.read('solo').fields.specialNotes,'latest input')
 f.advance(2)
 assert.equal(f.api.read('solo'),null)
 assert.equal(f.storage.has(prefix+'solo'),false)
 assert.equal(f.storage.get('wistia_vid'),'existing-visitor')
})
for(const timestamp of ['missing','future','invalid'])test('removes drafts with '+timestamp+' savedAt',()=>{
 const f=fixture()
 f.api.save('solo',data)
 const stored=JSON.parse(f.storage.get(prefix+'solo'))
 if(timestamp==='missing')delete stored.savedAt
 else stored.savedAt=timestamp==='future'?f.now()+1:'invalid'
 f.storage.set(prefix+'solo',JSON.stringify(stored))
 assert.equal(f.api.read('solo'),null)
 assert.equal(f.storage.has(prefix+'solo'),false)
 assert.equal(f.storage.get('wistia_vid'),'existing-visitor')
 assert.equal(f.storage.get('unrelated'),'keep')
})
test('wizard saves input and change events to the 24-hour browser draft',()=>{
 const f=fixture()
 const fields={people:'0',recordingMinutes:'50',rush:'0',specialNotes:''}
 const nodes=new Map()
 const handlers=new Map()
 const form={
  dataset:{},
  elements:{people:{value:'0'},recordingMinutes:{value:'50'}},
  querySelector(selector){
   if(['[data-wf-date-view]','[data-wf-time-view]','[data-rc-total]'].includes(selector))return null
   if(selector==='[data-rc-work="recordingMaster"]')return master
   if(!nodes.has(selector))nodes.set(selector,{
    value:'',classList:{toggle(){},remove(){}},insertAdjacentHTML(){},setAttribute(){},
    querySelector:child=>child==='[data-wf-amount]'?form.querySelector(child):null
   })
   return nodes.get(selector)
  },
  querySelectorAll:()=>[],
  addEventListener:(name,listener)=>handlers.set(name,listener)
 }
 const master={querySelector:()=>({disabled:false})}
 const window={
  WistiaBookingDraft:f.api,
  WistiaBooking:{mount(){}},
  addEventListener(){}
 }
 const context={window,FormData:class{constructor(){return Object.entries(fields)}}}
 for(const file of ['package-pricing.js','recording-config.js','booking-wizard.js']){
  runInNewContext(readFileSync(new URL('../js/'+file,import.meta.url),'utf8'),context)
 }
 window.WistiaWizard.mount({querySelector:()=>form},{onPeople(){}})
 fields.specialNotes='updated by input'
 handlers.get('input')({target:{name:'specialNotes'}})
 assert.equal(f.api.read('solo').fields.specialNotes,fields.specialNotes)
 fields.tuning='1'
 handlers.get('change')({target:{name:'tuning'},stopPropagation(){}})
 assert.equal(f.api.read('solo').fields.tuning,'1')
 fields.specialNotes='synthetic sync'
 handlers.get('input')({target:{name:'specialNotes'},wistiaCouponSync:true})
 assert.equal(f.api.read('solo').fields.specialNotes,'updated by input')
 f.advance(lifetime)
 assert.equal(f.api.read('solo'),null)
})
