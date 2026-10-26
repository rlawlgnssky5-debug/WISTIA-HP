import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {availabilityRange,personalInterval,PERSONAL_DATA_SOURCE_ID} from '../lib/notion-availability.mjs'
const rules=createRequire(import.meta.url)('../js/booking-availability.js')
// '일정' blocks (timed or all-day), '할일' never blocks, unmarked date-only stays ignored
assert.equal(personalInterval({start:'2026-12-05'},'할일'),null)
assert.equal(personalInterval({start:'2026-12-05'},null),null)
assert.deepEqual(personalInterval({start:'2026-12-05'},'일정'),{start:'2026-12-04T15:00:00.000Z',end:'2026-12-05T15:00:00.000Z'})
assert.equal(personalInterval({start:'2026-11-08T02:00:00.000Z',end:'2026-11-08T03:00:00.000Z'},'할일'),null)
const ledger='9675b5f6-7b45-8268-9d4d-87bee91ae79a',env={NOTION_BOOKING_TOKEN:'T',NOTION_BOOKING_DATA_SOURCE_ID:ledger}
const page=(date,kind)=>({properties:{'날짜':{type:'date',date},'일정 할일 구분':{type:'select',select:kind?{name:kind}:null}}})
// Real 엄마학원 rows (Sundays 11:00~23:00 KST) as stored in the To-Do 캘린더
const sundays=['2026-11-08','2026-11-15','2026-11-22','2026-11-29','2026-12-06','2026-12-13','2026-12-20','2026-12-27']
const rows=[...sundays.map(d=>page({start:d+'T02:00:00.000Z',end:d+'T14:00:00.000Z'},'일정')),page({start:'2026-11-21T04:00:00.000Z',end:'2026-11-21T10:00:00.000Z'},'일정'),page({start:'2026-12-05'},'일정'),page({start:'2026-11-13'},'할일'),page({start:'2026-11-19T05:00:00.000Z',end:'2026-11-19T06:00:00.000Z'},'할일')]
const ledgerSchema={properties:{'방문일':{type:'date',id:'v'},'취소 여부':{type:'select',id:'c'},'수입/지출':{type:'select',id:'i'},'수입 항목':{type:'select',id:'k'}}}
const fetcher=async(url,o)=>{
 if(url.includes(ledger))return o.method==='GET'?{ok:true,json:async()=>ledgerSchema}:{ok:true,json:async()=>({results:[],has_more:false})}
 assert.ok(url.includes(PERSONAL_DATA_SOURCE_ID))
 if(o.method==='GET')return {ok:true,json:async()=>({properties:{'날짜':{type:'date',id:'d'},'일정 할일 구분':{type:'select',id:'g'},'할 일':{type:'title',id:'title'}}})}
 assert.deepEqual(new URL(url).searchParams.getAll('filter_properties'),['d','g'],'titles never requested')
 return {ok:true,json:async()=>({results:rows,has_more:false})}
}
for(const [from,to] of [['2026-11-01','2026-11-30'],['2026-12-01','2026-12-31']]){
 const r=await availabilityRange(from,to,{env,fetcher});assert.equal(r.personalCalendar,'ok')
 for(const d of sundays.filter(d=>d>=from&&d<=to))for(const t of ['13:00','14:00','15:00','16:00','17:00'])assert.equal(rules.slotBlocked(d,t,60,r.blocks),true,d+' '+t+' must be 마감')
 if(from.startsWith('2026-12')){assert.equal(rules.dayClosed('2026-12-05','solo',r.blocks),true,'all-day 일정 closes 12/05');assert.equal(rules.slotBlocked('2026-12-04','14:00',60,r.blocks),false)}
 else{assert.equal(rules.slotBlocked('2026-11-21','14:00',60,r.blocks),true);assert.equal(rules.slotBlocked('2026-11-21','20:00',60,r.blocks),false);assert.equal(rules.slotBlocked('2026-11-19','14:00',60,r.blocks),false,'할일 ignored');assert.equal(rules.dayClosed('2026-11-13','solo',r.blocks),false,'할일 ignored')}
}
// Access failure (e.g. the integration is not connected to the To-Do 캘린더) is reported, not silent
const denied=async(url,o)=>url.includes(ledger)?fetcher(url,o):{ok:false,status:404,json:async()=>({code:'object_not_found'})}
const origError=console.error;let logged='';console.error=(...a)=>{logged+=a.join(' ')}
const r2=await availabilityRange('2026-12-01','2026-12-31',{env,fetcher:denied});console.error=origError
assert.equal(r2.personalCalendar,'unavailable');assert.equal(r2.personalReason,'http-404');assert.match(logged,/http-404 object_not_found/)
console.log('personal schedule ok')
