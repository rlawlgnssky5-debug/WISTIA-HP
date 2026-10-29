import {createRequire} from 'node:module'
const require=createRequire(import.meta.url)
const {validDate,validRange,operatingDays}=require('../js/booking-availability.js')
const NOTION_VERSION='2026-03-11'
const dayMs=86400000
const dayStart=date=>Date.parse(date+'T00:00:00+09:00')
const iso=ms=>new Date(ms).toISOString()

function timestamp(value,timeZone){
 if(typeof value!=='string')throw Error('Invalid date')
 if(/(?:Z|[+-]\d{2}:\d{2})$/.test(value))return Date.parse(value)
 if(timeZone==='Asia/Seoul'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value))return Date.parse(value+'+09:00')
 throw Error('Ambiguous timezone')
}
export function interval(date){
 if(!date?.start)throw Error('Missing start')
 if(validDate(date.start)){
  if(date.end&&!validDate(date.end))throw Error('Mixed date types')
  const start=dayStart(date.start),end=dayStart(date.end||date.start)+dayMs
  if(end<=start)throw Error('Invalid range')
  return {start:iso(start),end:iso(end)}
 }
 const start=timestamp(date.start,date.time_zone)
 if(!Number.isFinite(start))throw Error('Invalid datetime')
 // A timed reservation without an end cannot safely be assigned a guessed duration.
 // Close its local day conservatively until the owner adds the end time.
 if(!date.end){const local=iso(start+9*3600000).slice(0,10);return {start:iso(dayStart(local)),end:iso(dayStart(local)+dayMs)}}
 const end=timestamp(date.end,date.time_zone)
 if(!Number.isFinite(end)||end<=start)throw Error('Invalid datetime range')
 // The stored end already includes the session's 30-minute extra time; add only
 // the 30-minute preparation for the next customer. No buffer before the start.
 return {start:iso(start),end:iso(end+30*60000)}
}
export function mergeBlocks(blocks,date,to=date){
 // Include the following local day so long late-evening bookings cannot overlap
 // a reservation or closure after midnight.
 const start=dayStart(date),end=dayStart(to)+2*dayMs
 const pairs=blocks.map(block=>[Math.max(start,Date.parse(block.start)),Math.min(end,Date.parse(block.end))]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0])
 const merged=[]
 for(const pair of pairs){const prev=merged.at(-1);if(prev&&pair[0]<=prev[1])prev[1]=Math.max(prev[1],pair[1]);else merged.push(pair)}
 return merged.map(([a,b])=>({start:iso(a),end:iso(b)}))
}
export function extractBlocks(pages){
 return pages.flatMap(page=>{
  if(page.archived||page.in_trash||page.is_archived)return []
  const props=page.properties||{},dateProp='방문일'
  const types={'방문일':'date','취소 여부':'select','수입/지출':'select','수입 항목':'select'}
  for(const [name,type] of Object.entries(types))if(props[name]?.type!==type)throw Error('Invalid property schema')
  if(props['취소 여부'].select?.name==='취소'||props['수입/지출'].select?.name==='지출')return []
  // Only studio bookings block: rows without a 수입 항목 (personal notes such as a party) are ignored.
  if(!props['수입 항목'].select?.name)return []
  const date=props[dateProp].date
  if(!date)return []
  try{return [interval(date)]}catch(error){
   // A reversed/invalid end in one ledger row must not take every date offline.
   // As with a missing end, keep its known local day closed rather than guessing
   // a duration or silently dropping a real booking. Unknown starts/schema errors
   // still fail closed for the entire request.
   if(error.message!=='Invalid datetime range')throw error
   const start=timestamp(date.start,date.time_zone)
   if(!Number.isFinite(start))throw error
   const local=iso(start+9*3600000).slice(0,10)
   console.warn('[availability] invalid booking end; local day closed')
   return [interval({start:local})]
  }
 })
}
export const PERSONAL_DATA_SOURCE_ID='2535b5f6-7b45-8078-b10d-000bd9f59a16'
// Personal calendar: every '일정' entry blocks booking, '할일' entries never do.
// Timed entries block their own time (no end time means one hour). Date-only entries
// block the whole local day only when explicitly marked '일정'; unmarked date-only
// entries are ignored as before. No buffers; titles are never requested or returned.
export const PERSONAL_KIND='일정 할일 구분'
export function personalInterval(date,kind=null){
 if(kind==='할일')return null
 if(date?.start&&validDate(date.start)){
  if(kind!=='일정')return null
  const end=date.end&&validDate(date.end)?date.end:date.start
  if(end<date.start)return null
  return {start:iso(dayStart(date.start)),end:iso(dayStart(end)+dayMs)}
 }
 if(!date?.start)return null
 const start=timestamp(date.start,date.time_zone)
 if(!Number.isFinite(start))return null
 let end=start+3600000
 if(date.end&&!validDate(date.end)){const value=timestamp(date.end,date.time_zone);if(Number.isFinite(value)&&value>start)end=value}
 return {start:iso(start),end:iso(end)}
}
export function extractPersonalBlocks(pages){
 return pages.flatMap(page=>{
  if(page.archived||page.in_trash||page.is_archived)return []
  const prop=page.properties?.['날짜'],kind=page.properties?.[PERSONAL_KIND]
  if(prop?.type!=='date')return []
  try{const block=personalInterval(prop.date,kind?.type==='select'?kind.select?.name||null:null);return block?[block]:[]}catch{return []}
 })
}
async function queryPersonal(env,fetcher,from,status={}){
 status.personal='unavailable'
 try{
  const token=env.NOTION_TOKEN||env.NOTION_BOOKING_TOKEN,id=env.NOTION_CALENDAR_DB_ID||PERSONAL_DATA_SOURCE_ID
  if(!token||!/^[a-f0-9-]{32,36}$/i.test(id)){status.personalReason='not-configured';return []}
  const signal=AbortSignal.timeout(6000),base='https://api.notion.com/v1/data_sources/'+id
  const source=await notionRequest(base,token,fetcher,undefined,signal)
  const prop=source.properties?.['날짜'];if(prop?.type!=='date'||!prop.id){status.personalReason='schema';return []}
  const url=new URL(base+'/query');url.searchParams.append('filter_properties',prop.id)
  const kind=source.properties?.[PERSONAL_KIND];if(kind?.type==='select'&&kind.id)url.searchParams.append('filter_properties',kind.id)
  const after=iso(dayStart(from)-dayMs).slice(0,10),pages=[];let cursor
  for(let count=0;count<10;count++){
   const batch=await notionRequest(url.href,token,fetcher,{page_size:100,filter:{property:'날짜',date:{on_or_after:after}},...(cursor?{start_cursor:cursor}:{})},signal)
   if(!Array.isArray(batch.results)){status.personalReason='response';return []}
   pages.push(...batch.results)
   if(!batch.has_more||!batch.next_cursor||batch.next_cursor===cursor)break
   cursor=batch.next_cursor
  }
  status.personal='ok';delete status.personalReason
  return extractPersonalBlocks(pages)
 }catch(error){
  // Kept fail-open so the booking calendar still works, but never silently: the
  // reason is logged and reported (no secrets, no titles) as personalCalendar.
  status.personalReason=error?.status?'http-'+error.status:error?.name==='TimeoutError'?'timeout':'error'
  console.error('[availability] personal calendar unavailable:',status.personalReason,error?.code||'')
  return []
 }
}
async function notionRequest(url,token,fetcher,body,signal){
 const response=await fetcher(url,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Notion-Version':NOTION_VERSION,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal})
 if(!response.ok){let code='';try{code=(await response.json())?.code||''}catch{}const error=Error('Notion connection unavailable');error.status=response.status;error.code=code;throw error}
 return response.json()
}
async function querySource(id,token,fetcher){
 if(!/^[a-f0-9-]{32,36}$/i.test(id||''))throw Error('Missing source')
 const signal=AbortSignal.timeout(8000)
 const base='https://api.notion.com/v1/data_sources/'+id
 const source=await notionRequest(base,token,fetcher,undefined,signal)
 const names=['방문일','취소 여부','수입/지출','수입 항목']
 const expected=['date','select','select','select']
 const url=new URL(base+'/query')
 names.forEach((name,index)=>{const prop=source.properties?.[name];if(prop?.type!==expected[index]||!prop.id)throw Error('Source schema changed');url.searchParams.append('filter_properties',prop.id)})
 const pages=[];let cursor
 for(let count=0;count<30;count++){
  const batch=await notionRequest(url.href,token,fetcher,{page_size:100,filter:{property:names[0],date:{is_not_empty:true}},...(cursor?{start_cursor:cursor}:{})},signal)
  if(!Array.isArray(batch.results))throw Error('Invalid Notion response')
  pages.push(...batch.results)
  if(batch.request_status?.type==='incomplete')throw Error('Incomplete query')
  if(!batch.has_more)return extractBlocks(pages)
  if(!batch.next_cursor||batch.next_cursor===cursor)throw Error('Incomplete pagination')
  cursor=batch.next_cursor
 }
 throw Error('Too many rows')
}
export async function availability(date,{env=process.env,fetcher=fetch}={}){
 if(!validDate(date))throw Error('Invalid date')
 if(!env.NOTION_BOOKING_TOKEN||!env.NOTION_BOOKING_DATA_SOURCE_ID)throw Error('Not configured')
 // Read only; neither booking records nor accounting properties are modified.
 // Queries request only availability fields, not names, emails, prices, or notes.
 const status={},[bookings,personal]=await Promise.all([querySource(env.NOTION_BOOKING_DATA_SOURCE_ID,env.NOTION_BOOKING_TOKEN,fetcher),queryPersonal(env,fetcher,date,status)])
 return {ok:true,date,timeZone:'Asia/Seoul',operatingDays,blocks:mergeBlocks([...bookings,...personal],date),personalCalendar:status.personal,...(status.personalReason?{personalReason:status.personalReason}:{}),checkedAt:new Date().toISOString()}
}

export async function availabilityRange(from,to,{env=process.env,fetcher=fetch}={}){
 if(!validRange(from,to))throw Error('Invalid range')
 if(!env.NOTION_BOOKING_TOKEN||!env.NOTION_BOOKING_DATA_SOURCE_ID)throw Error('Not configured')
 const status={},[bookings,personal]=await Promise.all([querySource(env.NOTION_BOOKING_DATA_SOURCE_ID,env.NOTION_BOOKING_TOKEN,fetcher),queryPersonal(env,fetcher,from,status)])
 return {ok:true,from,to,timeZone:'Asia/Seoul',operatingDays,blocks:mergeBlocks([...bookings,...personal],from,to),personalCalendar:status.personal,...(status.personalReason?{personalReason:status.personalReason}:{}),checkedAt:new Date().toISOString()}
}
