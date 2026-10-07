import {createRequire} from 'node:module'
const require=createRequire(import.meta.url)
const {validDate,operatingDays}=require('../js/booking-availability.js')
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
 return {start:iso(start),end:iso(end)}
}
export function mergeBlocks(blocks,date){
 // Include the following local day so long late-evening bookings cannot overlap
 // a reservation or closure after midnight.
 const start=dayStart(date),end=start+2*dayMs
 const pairs=blocks.map(block=>[Math.max(start,Date.parse(block.start)),Math.min(end,Date.parse(block.end))]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0])
 const merged=[]
 for(const pair of pairs){const prev=merged.at(-1);if(prev&&pair[0]<=prev[1])prev[1]=Math.max(prev[1],pair[1]);else merged.push(pair)}
 return merged.map(([a,b])=>({start:iso(a),end:iso(b)}))
}
export function extractBlocks(pages){
 return pages.flatMap(page=>{
  if(page.archived||page.in_trash||page.is_archived)return []
  const props=page.properties||{},dateProp='방문일'
  const types={'방문일':'date','취소 여부':'select','수입/지출':'select'}
  for(const [name,type] of Object.entries(types))if(props[name]?.type!==type)throw Error('Invalid property schema')
  if(props['취소 여부'].select?.name==='취소'||props['수입/지출'].select?.name==='지출')return []
  return props[dateProp].date?[interval(props[dateProp].date)]:[]
 })
}
async function notionRequest(url,token,fetcher,body){
 const response=await fetcher(url,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Notion-Version':NOTION_VERSION,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(8000)})
 if(!response.ok)throw Error('Notion connection unavailable')
 return response.json()
}
async function querySource(id,token,fetcher){
 if(!/^[a-f0-9-]{32,36}$/i.test(id||''))throw Error('Missing source')
 const base='https://api.notion.com/v1/data_sources/'+id
 const source=await notionRequest(base,token,fetcher)
 const names=['방문일','취소 여부','수입/지출']
 const expected=['date','select','select']
 const url=new URL(base+'/query')
 names.forEach((name,index)=>{const prop=source.properties?.[name];if(prop?.type!==expected[index]||!prop.id)throw Error('Source schema changed');url.searchParams.append('filter_properties',prop.id)})
 const pages=[];let cursor
 for(let count=0;count<30;count++){
  const batch=await notionRequest(url.href,token,fetcher,{page_size:100,filter:{property:names[0],date:{is_not_empty:true}},...(cursor?{start_cursor:cursor}:{})})
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
 const bookings=await querySource(env.NOTION_BOOKING_DATA_SOURCE_ID,env.NOTION_BOOKING_TOKEN,fetcher)
 return {ok:true,date,timeZone:'Asia/Seoul',operatingDays,blocks:mergeBlocks(bookings,date),checkedAt:new Date().toISOString()}
}
