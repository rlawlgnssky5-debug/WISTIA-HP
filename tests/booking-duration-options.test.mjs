import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {runInNewContext} from 'node:vm'
const require=createRequire(import.meta.url),rules=require('../js/booking-availability.js'),pricing=require('../js/package-pricing.js')
const read=p=>readFileSync(new URL('../js/'+p,import.meta.url),'utf8')

test('full recording duration respects Sunday 18:00 and ordinary 23:00 closing',()=>{
 assert.equal(rules.slotBlocked('2027-10-10','17:00',60,[]),false)
 assert.equal(rules.slotBlocked('2027-10-10','16:00',120,[]),false)
 assert.equal(rules.slotBlocked('2027-10-10','17:00',120,[]),true,'C must finish by Sunday 18:00')
 assert.equal(rules.slotBlocked('2027-10-10','16:00',180,[]),true,'C plus extra hour crosses Sunday close')
 assert.equal(rules.slotBlocked('2027-10-09','21:00',120,[]),false)
 assert.equal(rules.slotBlocked('2027-10-09','22:00',120,[]),true)
 assert.equal(rules.slotBlocked('2027-10-09','21:00',180,[]),true)
})

test('closed cells anywhere in the recording and existing buffers block its start',()=>{
 const blocks=[{start:'2027-10-09T14:30:00+09:00',end:'2027-10-09T15:30:00+09:00'}]
 assert.equal(rules.slotBlocked('2027-10-09','13:00',60,blocks),false,'one hour still fits with its cleanup buffer')
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
 f.reply([{start:'2027-10-09T14:30:00+09:00',end:'2027-10-09T15:30:00+09:00'}]);await p
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
 await f.api.mount(f.form,'ar-180');assert.equal(f.time.value,'');assert.equal(f.option('21:00').disabled,true)
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

test('selectable options precede included disabled options after repeated type changes',()=>{
 const window={WistiaPackages:pricing};runInNewContext(read('booking-wizard.js'),{window})
 assert.equal(typeof window.WistiaWizard.syncOptions,'function','wizard must share option-state and DOM ordering updates')
 const order=['tuning','detailMix','extraHour'],rows=new Map(order.map(key=>[key,{dataset:{wfOption:key},input:{disabled:false,checked:true},strong:{textContent:''},classList:{toggle(){}},querySelector(s){return s==='input'?this.input:this.strong}}]))
 let moves=0
 const fieldset={querySelectorAll(){return order.map(key=>rows.get(key))},appendChild(row){moves++;order.splice(order.indexOf(row.dataset.wfOption),1);order.push(row.dataset.wfOption)}}
 const form={querySelector:s=>s==='.package-extra-options'?fieldset:rows.get(s.match(/data-wf-option="([^"]+)"/)?.[1])}
 for(const [key,expected] of [['B',['extraHour','tuning','detailMix']],['A',['tuning','detailMix','extraHour']],['C',['extraHour','tuning','detailMix']],['B',['extraHour','tuning','detailMix']]]){
  const previous=order.join(','),beforeMoves=moves
  window.WistiaWizard.syncOptions(form,pricing.quote({package:key}))
  if(previous===expected.join(','))assert.equal(moves,beforeMoves,'unchanged rows must retain checkbox focus during updates')
  assert.deepEqual(order,expected)
  assert.equal(rows.get('extraHour').input.disabled,false)
  for(const option of ['tuning','detailMix']){
   assert.equal(rows.get(option).input.disabled,key!=='A')
   if(key!=='A'){assert.equal(rows.get(option).input.checked,false);assert.equal(rows.get(option).strong.textContent,'패키지에 포함되어 있어요')}
  }
 }
})
