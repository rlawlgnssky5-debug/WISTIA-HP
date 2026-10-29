import assert from 'node:assert/strict'
import {availability,availabilityRange,extractBlocks,interval} from '../lib/notion-availability.mjs'
import handler from '../api/availability.js'

const row=(date,cancel=null,income='수입')=>({properties:{
 '방문일':{type:'date',date},'취소 여부':{type:'select',select:cancel?{name:cancel}:null},
 '수입/지출':{type:'select',select:{name:income}},'수입 항목':{type:'select',select:{name:'AR 축가 녹음'}},
 '클라이언트':{type:'title',title:[{plain_text:'PRIVATE_CUSTOMER'}]}
}})
// Same reversed start/end shape that took the production calendar offline.
const reversed=row({start:'2026-10-23T10:00:00Z',end:'2026-10-23T03:00:00Z'})
const valid=row({start:'2026-10-30T06:00:00Z',end:'2026-10-30T07:30:00Z'})
const closed={start:'2026-10-22T15:00:00.000Z',end:'2026-10-23T15:00:00.000Z'}
const oldWarn=console.warn,warnings=[];console.warn=(...args)=>warnings.push(args.join(' '))
try{
 assert.throws(()=>interval(reversed.properties['방문일'].date),/Invalid datetime range/,'strict interval parsing remains strict')
 assert.deepEqual(extractBlocks([reversed,valid]),[closed,interval(valid.properties['방문일'].date)],'only the malformed booking day closes; good bookings remain')
 assert.deepEqual(extractBlocks([row(reversed.properties['방문일'].date,'취소'),row(reversed.properties['방문일'].date,null,'지출')]),[])
 assert.deepEqual(extractBlocks([row({start:'2026-10-24T01:00:00+09:00',end:'2026-10-24T00:00:00+09:00'})]),[interval({start:'2026-10-24'})],'closure uses KST, not the UTC calendar date')
 assert.deepEqual(extractBlocks([row({start:'2026-10-30T06:00:00Z'})]),[interval({start:'2026-10-30'})],'missing-end policy is unchanged')
 assert.throws(()=>extractBlocks([row({start:'bad',end:'bad'})]),'an unknown start must never be ignored')
 assert.throws(()=>extractBlocks([{properties:{}}]),/Invalid property schema/)
 const env={NOTION_BOOKING_TOKEN:'TEST_ONLY',NOTION_BOOKING_DATA_SOURCE_ID:'9675b5f6-7b45-8268-9d4d-87bee91ae79a',NOTION_CALENDAR_DB_ID:'off'}
 const fetcher=async(url,options)=>({ok:true,json:async()=>options.method==='GET'?{properties:{'방문일':{type:'date',id:'v'},'취소 여부':{type:'select',id:'c'},'수입/지출':{type:'select',id:'i'},'수입 항목':{type:'select',id:'k'}}}:{results:[reversed,valid],has_more:false}})
 const range=await availabilityRange('2026-10-01','2026-10-31',{env,fetcher})
 assert.equal(range.ok,true);assert.ok(range.blocks.some(b=>b.start===closed.start))
 const day=await availability('2026-10-30',{env,fetcher})
 assert.deepEqual(day.blocks,[interval(valid.properties['방문일'].date)],'past malformed row cannot disable a future valid day')
 assert.doesNotMatch(JSON.stringify(range),/PRIVATE|TEST_ONLY|9675/)
 const prior={fetch:globalThis.fetch,env:Object.fromEntries(Object.keys(env).map(k=>[k,process.env[k]]))}
 try{
  Object.assign(process.env,env);globalThis.fetch=fetcher
  for(const query of [{date:'2026-10-30'},{from:'2026-10-01',to:'2026-10-31'}]){
   const response={headers:{},setHeader(k,v){this.headers[k]=v},status(v){this.code=v;return this},json(v){this.body=v;return this}}
   await handler({method:'GET',query},response)
   assert.equal(response.code,200);assert.equal(response.body.ok,true);assert.equal(response.headers['Cache-Control'],'no-store')
  }
 }finally{
  globalThis.fetch=prior.fetch
  for(const [key,value] of Object.entries(prior.env)){if(value===undefined)delete process.env[key];else process.env[key]=value}
 }
 assert.ok(warnings.length>0);assert.ok(warnings.every(w=>!(/PRIVATE|TEST_ONLY|2026|9675/.test(w))),'operational warning contains no record data')
}finally{console.warn=oldWarn}
console.log('Malformed booking isolation, conservative KST closure, valid reservations, privacy and date/range API regression passed')
