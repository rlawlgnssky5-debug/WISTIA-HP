import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {availabilityRange,availability,personalInterval,PERSONAL_DATA_SOURCE_ID} from '../lib/notion-availability.mjs'
const rules=createRequire(import.meta.url)('../js/booking-availability.js')
assert.equal(personalInterval({start:'2026-10-17'}),null,'date-only ignored')
assert.deepEqual(personalInterval({start:'2026-10-17T15:00:00.000+09:00'}),{start:'2026-10-17T06:00:00.000Z',end:'2026-10-17T07:00:00.000Z'},'no end = 1h')
const ledger='9675b5f6-7b45-8268-9d4d-87bee91ae79a',env={NOTION_BOOKING_TOKEN:'T',NOTION_BOOKING_DATA_SOURCE_ID:ledger}
const page=(date,title='SECRET_TITLE')=>({properties:{'할 일':{type:'title',title:[{plain_text:title}]},'날짜':{type:'date',date}}})
const fetcher=async(url,options)=>{
 if(url.includes(ledger)){if(options.method==='GET')return {ok:true,json:async()=>({properties:{'방문일':{type:'date',id:'v'},'취소 여부':{type:'select',id:'c'},'수입/지출':{type:'select',id:'i'}}})};return {ok:true,json:async()=>({results:[],has_more:false})}}
 assert.ok(url.includes(PERSONAL_DATA_SOURCE_ID))
 if(options.method==='GET')return {ok:true,json:async()=>({properties:{'날짜':{type:'date',id:'d'}}})}
 assert.deepEqual(new URL(url).searchParams.getAll('filter_properties'),['d'],'titles not requested')
 return {ok:true,json:async()=>({results:[page({start:'2026-10-17T15:00:00.000+09:00'}),page({start:'2026-10-18T12:00:00.000+09:00',end:'2026-10-18T14:30:00.000+09:00'}),page({start:'2026-10-24'})],has_more:false})}
}
const r=await availabilityRange('2026-10-15','2026-10-31',{env,fetcher})
assert.doesNotMatch(JSON.stringify(r),/SECRET/)
const b=r.blocks
assert.equal(rules.slotBlocked('2026-10-17','13:00',60,b),false,'1인 13:00 OK (site keeps 30-min buffer)')
assert.equal(rules.slotBlocked('2026-10-17','14:00',120,b),true,'2인 14:00 overlaps')
assert.equal(rules.slotBlocked('2026-10-17','15:30',60,b),true)
assert.equal(rules.slotBlocked('2026-10-17','16:30',60,b),false)
assert.equal(rules.slotBlocked('2026-10-18','14:00',60,b),true)
assert.equal(rules.slotBlocked('2026-10-24','14:00',60,b),false,'all-day ignored')
// Personal calendar failure keeps the calendar working as before
const broken=async(url,o)=>url.includes(ledger)?fetcher(url,o):{ok:false}
assert.deepEqual((await availability('2026-10-17',{env,fetcher:broken})).blocks,[])
console.log('personal busy ok')
