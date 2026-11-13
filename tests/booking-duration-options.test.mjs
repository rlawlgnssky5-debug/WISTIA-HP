import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {runInNewContext} from 'node:vm'
const require=createRequire(import.meta.url),rules=require('../js/booking-availability.js'),pricing=require('../js/package-pricing.js')
const read=p=>readFileSync(new URL('../js/'+p,import.meta.url),'utf8')

test('full recording duration respects Sunday 18:00 and ordinary latest start 23:00',()=>{
 assert.equal(rules.slotBlocked('2027-10-10','17:00',60,[]),false)
 assert.equal(rules.slotBlocked('2027-10-10','16:00',120,[]),false)
 assert.equal(rules.slotBlocked('2027-10-10','17:00',120,[]),true,'C must finish by Sunday 18:00')
 assert.equal(rules.slotBlocked('2027-10-10','16:00',180,[]),true,'C plus extra hour crosses Sunday close')
 assert.equal(rules.slotBlocked('2027-10-09','21:00',120,[]),false)
 assert.equal(rules.slotBlocked('2027-10-09','22:00',120,[]),false)
 assert.equal(rules.slotBlocked('2027-10-09','21:00',180,[]),false)
 assert.equal(rules.slotBlocked('2027-10-09','23:00',150,[]),false)
 assert.equal(rules.slotBlocked('2027-10-09','23:30',50,[]),true,'no starts after 23:00')
})

test('closed cells anywhere in the recording and existing buffers block its start',()=>{
 const blocks=[{start:'2027-10-09T15:00:00+09:00',end:'2027-10-09T16:00:00+09:00'}]
 assert.equal(rules.slotBlocked('2027-10-09','13:00',60,blocks),false,'one hour and the current 60-minute occupied buffer end at the closure boundary')
 assert.equal(rules.slotBlocked('2027-10-09','13:00',120,blocks),true,'C intersects the closed 14:00 start')
 assert.equal(rules.slotBlocked('2027-10-09','13:00',180,blocks),true)
 assert.equal(rules.slotBlocked('2027-10-09','14:00',60,blocks),true)
 assert.equal(rules.slotBlocked('2027-10-09','16:00',60,blocks),false,'existing buffer boundary remains unchanged')
})

function schedule(dateValue='2027-10-09'){
 const node=value=>({value,disabled:false,dataset:{},setCustomValidity(v){this.validationMessage=v},setAttribute(){},removeAttribute(){}})
 const date=node(dateValue),time=node(''),status={dataset:{}},error={},list={}
 time.options=['',...Array.from({length:10},(_,i)=>`${13+i}:00`)].map(value=>({value,disabled:false,dataset:{},textContent:value||'미정'}))
 Object.defineProperty(time,'selectedOptions',{get:()=>time.options.filter(o=>o.value===time.value)})
 const form={dataset:{bookingCalendarOpened:'true'},querySelector:s=>({'#contact-bookingDate':date,'#contact-time':time,'[data-booking-status]':status,'[data-contact-date-error="bookingDate"]':error,'[data-booking-open-times]':list})[s]}
 const pending=[]
 const window={document:{addEventListener(){}},WistiaContact:{syncSubmitState(){}}}
 runInNewContext(read('booking-availability.js'),{window,Date,Intl,AbortController,setTimeout,clearTimeout,fetch:()=>new Promise((resolve,reject)=>pending.push({resolve,reject}))})
 return {api:window.WistiaBooking,form,date,time,status,pending,option:v=>time.options.find(o=>o.value===v),reply(blocks=[]){pending.at(-1).resolve({ok:true,json:async()=>({ok:true,date:date.value,blocks})})}}
}

test('changing A/B/C and extra hour rechecks cached closures, clears invalid start and explains it',async()=>{
 const f=schedule(),p=f.api.mount(f.form,'ar-60')
 f.reply([{start:'2027-10-09T15:00:00+09:00',end:'2027-10-09T16:00:00+09:00'}]);await p
 f.time.value='13:00'
 await f.api.mount(f.form,'ar-120')
 assert.equal(f.option('13:00').disabled,true)
 assert.equal(f.time.value,'')
 assert.equal(f.status.hidden,false,'clearing a selected start must leave a visible explanation')
 assert.match(f.status.textContent,/소요 시간|녹음 시간/)
 assert.match(f.status.textContent,/다시|다른/)
 assert.equal(f.form.dataset.scheduleState,'ready','a new valid start can still be chosen')
 assert.equal(f.pending.length,1,'duration changes use validated cached closure data')
 await f.api.mount(f.form,'ar-60');assert.equal(f.option('13:00').disabled,false)
 f.time.value='21:00';await f.api.mount(f.form,'ar-120');assert.equal(f.time.value,'21:00')
 await f.api.mount(f.form,'ar-180');assert.equal(f.time.value,'21:00');assert.equal(f.option('21:00').disabled,false,'a valid late start no longer depends on finishing by 23:00')
})

test('Sunday duration changes and failed refresh retain closure restrictions',async()=>{
 const f=schedule('2027-10-10'),p=f.api.mount(f.form,'ar-60');f.reply();await p
 f.time.value='17:00';await f.api.mount(f.form,'ar-120')
 assert.equal(f.time.value,'');assert.equal(f.option('17:00').disabled,true)
 const refresh=f.api.refresh();f.pending.at(-1).reject(Error('offline'));await refresh
 assert.equal(f.form.dataset.scheduleState,'unavailable')
 assert.equal(f.option('17:00').disabled,true)
 assert.equal(f.option('16:00').disabled,false)
})

test('custom recording work options use binary radios and making video adds one booking hour',()=>{
 const window={WistiaPackages:pricing,addEventListener(){}}
 const fields={people:'0',recordingMinutes:'90',tuning:'1',recordingMix:'0',recordingMaster:'0',makingVideo:'0',rush:'0'}
 const context={window,FormData:class{constructor(){return Object.entries(fields)}}}
 runInNewContext(read('recording-config.js'),context)
 runInNewContext(read('booking-wizard.js'),context)
 const editor=window.WistiaRecording.editor(fields)
 for(const [key,selected] of [['tuning','1'],['recordingMix','0'],['recordingMaster','0'],['makingVideo','0']]){
  const row=editor.split('data-rc-work="'+key+'"')[1]?.split('data-rc-work=')[0]
  assert.ok(row,key+' has its own work option')
  const radios=[...row.matchAll(new RegExp('<input type="radio" name="'+key+'" value="([01])"( checked)?>','g'))]
  assert.deepEqual(radios.map(radio=>radio[1]),['0','1'])
  assert.deepEqual(radios.filter(radio=>radio[2]).map(radio=>radio[1]),[selected])
 }
 const form={}
 assert.equal(window.WistiaWizard.bookingKey(form),'ar-90')
 fields.makingVideo='1'
 assert.equal(window.WistiaWizard.bookingKey(form),'ar-150')
 assert.equal(Object.fromEntries(window.WistiaWizard.rows(form))['소요 시간'],pricing.hoursText(150))
 fields.makingVideo='0'
 assert.equal(window.WistiaWizard.bookingKey(form),'ar-90')
})
