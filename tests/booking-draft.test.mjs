import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/booking-draft.js',import.meta.url),'utf8')
const store=new Map(),win={localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)}}
runInNewContext(source,{window:win,Date,JSON})
const api=win.WistiaBookingDraft
const data={step:4,view:'time',fields:{people:'1',discovery:'스레드',eventDateMode:'unknown',bookingDate:'2026-10-22',timeStart:'15:00',rush:'1',lyricVideo:'1',specialNotes:'궁금한 점\n상담 부탁드려요',name:'must never persist',phone:'must never persist',extraVerse:'1'},wedding:{year:'2026',month:'12',day:'25'}}
assert.equal(api.save('solo',data),true)
const stored=JSON.parse(store.get('wistia:inquiry-draft:v1:solo'))
assert.equal(stored.version,1)
assert.ok(stored.savedAt)
assert.doesNotMatch(JSON.stringify(stored),/must never persist|extraVerse|phone|"name"/)
const loaded=api.read('solo')
assert.equal(loaded.step,4)
assert.equal(loaded.view,'time')
for(const field of ['people','discovery','eventDateMode','bookingDate','timeStart','rush','lyricVideo','specialNotes'])assert.equal(loaded.fields[field],data.fields[field])
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
