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
for(const field of ['package','people','discovery','eventDateMode','bookingDate','timeStart','rush','tuning','detailMix','extraHour','firstVisit','paybackBlog','paybackReaction','specialNotes'])assert.equal(loaded.fields[field],data.fields[field])
assert.equal(loaded.fields.lipsync,undefined)
assert.equal(loaded.wedding.year,'2026')
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
for(const key of ['eventDate','bookingDate','timeStart'])assert.equal(invalid.fields[key],'')
assert.equal(invalid.fields.specialNotes.length,2000)
assert.equal(invalid.wedding.month,'')
Object.defineProperty(win,'localStorage',{get(){throw Error('blocked')}})
assert.equal(api.read('solo'),null)
assert.equal(api.save('solo',data),false)
console.log('Browser-only allowlisted drafts, expiry, corrupt/blocked storage, partial dates, route isolation and personal-field exclusion passed')

const lifetime=3*60*60*1000,prefix='wistia:inquiry-draft:v1:'
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
for(const age of [lifetime-1,lifetime])test('restores a draft aged '+age+'ms',()=>{
 const f=fixture()
 f.api.save('solo',data)
 f.advance(age)
 assert.equal(f.api.read('solo').fields.specialNotes,data.fields.specialNotes)
 assert.ok(f.storage.has(prefix+'solo'))
})
test('clears only the expired draft after three hours',()=>{
 const f=fixture()
 f.api.save('solo',data)
 f.advance(lifetime+1)
 f.api.save('duo',data)
 assert.equal(f.api.read('solo'),null)
 assert.equal(f.storage.has(prefix+'solo'),false)
 assert.ok(f.api.read('duo'))
 assert.equal(f.storage.get('wistia_vid'),'existing-visitor')
 assert.equal(f.storage.get('unrelated'),'keep')
})
test('each save refreshes savedAt and starts a new three-hour lifetime',()=>{
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
test('wizard input/change handlers save drafts and both notes show three hours',()=>{
 const wizard=readFileSync(new URL('../js/booking-wizard.js',import.meta.url),'utf8').replace(/\r\n/g,'\n')
 assert.match(wizard,/form\.addEventListener\('input',\(\)=>update\(form\)\)/)
 const changeHandler=wizard.split("form.addEventListener('change',event=>{")[1]?.split("form.addEventListener('input'")[0]
 assert.ok(changeHandler,'change listener exists')
 assert.match(changeHandler,/\n   update\(form\)\n/)
 assert.match(changeHandler,/WistiaBooking\.mount\(form,bookingKey\(form\)\)/)
 assert.match(wizard,/function update\(form\)\{[\s\S]*?persistDraft\(form\)/)
 assert.match(wizard,/WistiaBookingDraft\.save\(state\.draftKey,/)
 assert.equal(wizard.split('작성 내용은 이 브라우저에 3시간 동안 임시 저장돼요').length-1,2)
 assert.doesNotMatch(wizard,/7일간/)
})
