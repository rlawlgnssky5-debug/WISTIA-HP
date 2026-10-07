import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {availability,availabilityRange,interval,extractBlocks,mergeBlocks} from '../lib/notion-availability.mjs'
import handler from '../api/availability.js'
const require=createRequire(import.meta.url)
const rules=require('../js/booking-availability.js')
assert.equal(rules.validDate('2026-02-30'),false)
assert.equal(rules.validDate('2028-02-29'),true)
for(const [date,open] of [['2026-10-08',true],['2026-10-09',true],['2026-10-10',true],['2026-10-11',true],['2026-10-12',false],['2026-10-13',false],['2026-10-14',false]])assert.equal(rules.isOperatingDay(date),open)
assert.deepEqual(['solo','duo','duet-film'].map(rules.duration),[60,120,180])
const block=interval({start:'2026-10-11T17:00:00+09:00',end:'2026-10-11T19:00:00+09:00'})
assert.deepEqual(block,{start:'2026-10-11T08:00:00.000Z',end:'2026-10-11T10:00:00.000Z'})
assert.equal(rules.slotBlocked('2026-10-11','16:00',60,[block]),false,'adjacent SOLO ends exactly at reservation start')
assert.equal(rules.slotBlocked('2026-10-11','16:00',120,[block]),true,'DUET overlaps an existing reservation')
assert.equal(rules.slotBlocked('2026-10-11','16:30',60,[block]),true)
assert.equal(rules.slotBlocked('2026-10-11','19:00',60,[block]),false,'end is exclusive')
assert.equal(rules.slotBlocked('2026-10-11','23:00',120,[]),true,'Sunday booking cannot extend into Monday closure')
assert.deepEqual(interval({start:'2026-10-09',end:'2026-10-11'}),{start:'2026-10-08T15:00:00.000Z',end:'2026-10-11T15:00:00.000Z'})
assert.deepEqual(interval({start:'2026-10-11T17:00:00+09:00'}),interval({start:'2026-10-11'}),'missing timed end closes the day rather than guessing')
assert.deepEqual(interval({start:'2026-10-11T17:00:00',end:'2026-10-11T19:00:00',time_zone:'Asia/Seoul'}),block)
assert.throws(()=>interval({start:'2026-10-11T17:00:00',end:'2026-10-11T19:00:00'}))
assert.throws(()=>interval({start:'2026-10-11T19:00:00Z',end:'2026-10-11T17:00:00Z'}))
const booking=(date,cancel=null,income='수입')=>({object:'page',properties:{'방문일':{type:'date',date},'취소 여부':{type:'select',select:cancel?{name:cancel}:null},'수입/지출':{type:'select',select:{name:income}},'클라이언트':{type:'title',title:[{plain_text:'PRIVATE CUSTOMER'}]},'이메일':{type:'rich_text',rich_text:[{plain_text:'PRIVATE EMAIL'}]},'입금금액':{type:'number',number:987654}}})
const row=booking({start:'2026-10-11T17:00:00+09:00',end:'2026-10-11T19:00:00+09:00'})
assert.deepEqual(extractBlocks([row,booking(row.properties['방문일'].date,'취소'),booking(row.properties['방문일'].date,null,'지출'),{...row,in_trash:true}],'bookings'),[block])
assert.throws(()=>extractBlocks([{properties:{}}],'bookings'))
assert.equal(rules.slotBlocked('2026-10-11','13:00',60,extractBlocks([booking({start:'2026-10-11'})])),true,'date-only visit blocks the day')
assert.deepEqual(extractBlocks([booking({start:'2026-10-11'},'취소')]),[],'existing cancellation field releases the reservation')
const cross=interval({start:'2026-10-10T23:30:00+09:00',end:'2026-10-11T01:00:00+09:00'})
assert.equal(rules.slotBlocked('2026-10-10','23:00',120,mergeBlocks([cross],'2026-10-10')),true,'next-day overlap retained')
const env={NOTION_BOOKING_TOKEN:'TEST_ONLY_TOKEN',NOTION_BOOKING_DATA_SOURCE_ID:'9675b5f6-7b45-8268-9d4d-87bee91ae79a'}
const calls=[]
const fetcher=async(url,options)=>{
 calls.push({url,options})
 assert.equal(options.headers['Notion-Version'],'2026-03-11')
 assert.ok(url.includes(env.NOTION_BOOKING_DATA_SOURCE_ID),'only the owner-provided ledger is queried')
 if(options.method==='GET')return {ok:true,json:async()=>({properties:{'방문일':{type:'date',id:'visit'},'취소 여부':{type:'select',id:'cancel'},'수입/지출':{type:'select',id:'income'}}})}
 const body=JSON.parse(options.body)
 assert.deepEqual(new URL(url).searchParams.getAll('filter_properties'),['visit','cancel','income'])
 if(!body.start_cursor)return {ok:true,json:async()=>({results:[row],has_more:true,next_cursor:'second'})}
 return {ok:true,json:async()=>({results:[booking({start:'2026-10-11T20:00:00+09:00',end:'2026-10-11T21:00:00+09:00'})],has_more:false,next_cursor:null})}
}
const result=await availability('2026-10-11',{env,fetcher})
assert.equal(result.blocks.length,2)
assert.equal(calls.length,3,'existing ledger schema and pagination fetched without a second table')
assert.doesNotMatch(JSON.stringify(result),/PRIVATE|TEST_ONLY|9675|eac81|987654|사유|클라이언트|이메일|입금/)
await assert.rejects(availability('2026-10-11',{env:{},fetcher}))
await assert.rejects(availability('2026-10-11',{env,fetcher:async()=>({ok:false})}))
const respond=()=>({headers:{},setHeader(key,value){this.headers[key]=value},status(code){this.code=code;return this},json(payload){this.payload=payload;return this}})
const invalid=respond();await handler({method:'GET',query:{date:'2026-02-30'}},invalid);assert.equal(invalid.code,400)
const wrongMethod=respond();await handler({method:'POST',query:{}},wrongMethod);assert.equal(wrongMethod.code,405)
const offline=respond();await handler({method:'GET',query:{date:'2026-10-11'}},offline);assert.equal(offline.code,503)
assert.doesNotMatch(JSON.stringify(offline.payload),/token|NOTION_|source|PRIVATE/i)
console.log('Existing ledger only, read-only privacy, pagination, cancellation, KST visit dates, duration overlap and offline-safe API passed')

for(const [from,to,expected] of [['2026-10-01','2026-11-11',true],['2026-10-01','2026-11-12',false],['2026-10-10','2026-10-09',false],['2026-02-30','2026-03-01',false]])assert.equal(rules.validRange(from,to),expected)
const beforeRange=calls.length
const range=await availabilityRange('2026-10-01','2026-10-31',{env,fetcher})
assert.equal(calls.length-beforeRange,3,'a range reads the ledger once, including required pagination, not per day')
assert.equal(range.from,'2026-10-01');assert.equal(range.to,'2026-10-31')
assert.deepEqual(range.blocks,result.blocks)
assert.doesNotMatch(JSON.stringify(range),/PRIVATE|TEST_ONLY|987654|클라이언트|이메일|입금/)
await assert.rejects(availabilityRange('2026-10-01','2026-11-12',{env,fetcher}))
await assert.rejects(availabilityRange('2026-10-01','2026-10-31',{env,fetcher:async()=>{throw Error('timeout')}}))
for(const query of [{from:'2026-10-01'},{to:'2026-10-31'},{from:'2026-10-01',to:'2026-11-12'},{date:'2026-10-09',from:'2026-10-01',to:'2026-10-31'}]){const response=respond();await handler({method:'GET',query},response);assert.equal(response.code,400)}
const full=extractBlocks([booking({start:'2026-10-09'})])
for(const key of ['solo','duo','duet-film','undecided'])assert.equal(rules.dayClosed('2026-10-09',key,full,0),true,'date-only closure applies to every product')
const onlySolo=[{start:'2026-10-10T14:00:00+09:00',end:'2026-10-11T00:00:00+09:00'}]
assert.equal(rules.dayClosed('2026-10-10','solo',onlySolo,0),false)
assert.equal(rules.dayClosed('2026-10-10','duo',onlySolo,0),true)
assert.equal(rules.dayClosed('2026-10-10','duet-film',onlySolo,0),true)
for(const key of ['solo','duo','duet-film'])assert.equal(rules.dayClosed('2026-10-11',key,[block],0),false,'partial bookings keep date selectable')
assert.equal(rules.dayClosed('2026-10-09','solo',[{start:'2026-10-09T00:00:00+09:00',end:'2026-10-09T12:00:00+09:00'},{start:'2026-10-09T12:00:00+09:00',end:'2026-10-10T00:00:00+09:00'}],0),true,'adjacent blocks cover the entire KST day')
console.log('42-day validation, single range query, privacy, failure handling and product-specific closed days passed')
const originalFetch=globalThis.fetch,originalToken=process.env.NOTION_BOOKING_TOKEN,originalSource=process.env.NOTION_BOOKING_DATA_SOURCE_ID
try{
 Object.assign(process.env,env);globalThis.fetch=fetcher
 const rangeResponse=respond();await handler({method:'GET',query:{from:'2026-10-01',to:'2026-10-31'}},rangeResponse)
 assert.equal(rangeResponse.code,200);assert.equal(rangeResponse.headers['Cache-Control'],'no-store')
 assert.equal(rangeResponse.payload.from,'2026-10-01')
 const dateResponse=respond();await handler({method:'GET',query:{date:'2026-10-11'}},dateResponse)
 assert.equal(dateResponse.code,200);assert.deepEqual(Object.keys(dateResponse.payload),['ok','date','timeZone','operatingDays','blocks','checkedAt'],'legacy date shape is unchanged')
 assert.doesNotMatch(JSON.stringify(rangeResponse.payload),/PRIVATE|TEST_ONLY|987654/)
}finally{
 globalThis.fetch=originalFetch
 if(originalToken===undefined)delete process.env.NOTION_BOOKING_TOKEN;else process.env.NOTION_BOOKING_TOKEN=originalToken
 if(originalSource===undefined)delete process.env.NOTION_BOOKING_DATA_SOURCE_ID;else process.env.NOTION_BOOKING_DATA_SOURCE_ID=originalSource
}
console.log('CommonJS handler native dynamic import: range and legacy date success passed')
