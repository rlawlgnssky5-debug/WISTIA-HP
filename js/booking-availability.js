(function(global){
 'use strict'
 const operatingDays=[0,4,5,6]
 function validDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false
  const parsed=new Date(value+'T12:00:00Z')
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value
 }
 function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
 function isOperatingDay(date){return validDate(date)&&operatingDays.includes(new Date(date+'T12:00:00Z').getUTCDay())}
 function duration(key){return key==='solo'?60:key==='duo'?120:key==='undecided'?1:180}
 function slotBlocked(date,time,minutes,blocks){
  if(!validDate(date)||!/^\d{2}:\d{2}$/.test(time)||!Number.isFinite(minutes)||minutes<=0)return true
  const start=Date.parse(date+'T'+time+':00+09:00'),end=start+minutes*60000
  if(!Number.isFinite(start))return true
  const endDay=new Date(end-1+9*3600000).toISOString().slice(0,10)
  if(!isOperatingDay(date)||!isOperatingDay(endDay))return true
  return blocks.some(block=>start<Date.parse(block.end)&&end>Date.parse(block.start))
 }
 function validRange(from,to){return validDate(from)&&validDate(to)&&to>=from&&(Date.parse(to)-Date.parse(from))/86400000<42}
 function dayClosed(date,key,blocks,now=Date.now()){
  const start=Date.parse(date+'T00:00:00+09:00'),end=start+86400000
  let covered=start
  for(const block of [...blocks].sort((a,b)=>Date.parse(a.start)-Date.parse(b.start))){if(Date.parse(block.start)>covered)break;covered=Math.max(covered,Date.parse(block.end));if(covered>=end)return true}
  return Array.from({length:10},(_,i)=>String(13+i)+':00').every(time=>Date.parse(date+'T'+time+':00+09:00')<now||slotBlocked(date,time,duration(key),blocks))
 }
 const rules={validDate,validRange,today,isOperatingDay,duration,slotBlocked,dayClosed,operatingDays}
 if(typeof module==='object'&&module.exports)module.exports=rules
 if(!global.document)return
 // Every check ends in a rendered schedule, a closed/unknown notice, or the Kakao fallback.
 // Requests are shared per date (a re-mount, product switch or repeated change never drops
 // the only in-flight response) and always settle within timeoutMs.
 const timeoutMs=8000,cacheMs=30000,cache=new Map(),inflight=new Map()
 const rangeCache=new Map(),rangeInflight=new Map(),rangeFailures=new Set(),dateFailures=new Set()
 let activeForm=null,activeKey='solo',generation=0
 const pendingMessage='예약 가능 시간을 확인하고 있습니다'
 const fallbackMessage='카카오톡 확인 필요 · 일정 자동 확인이 연결되지 않았거나 잠시 지연되고 있습니다 · 희망 일정으로 문의하시면 카카오톡에서 가능 여부를 확인합니다'
 function validBlocks(blocks){return Array.isArray(blocks)&&blocks.every(block=>Number.isFinite(Date.parse(block.start))&&Number.isFinite(Date.parse(block.end))&&Date.parse(block.end)>Date.parse(block.start))}
 // Freshness controls requests, not whether validated closures remain visible.
 function calendarBlocks(from,to){return rangeCache.get(from+':'+to)?.blocks??null}
 function calendarRangeFailed(from,to){return rangeFailures.has(from+':'+to)}
 async function loadRange(from,to,fresh=false){
  if(!validRange(from,to))throw Error('invalid range')
  const id=from+':'+to,hit=rangeCache.get(id)
  if(!fresh&&hit&&!rangeFailures.has(id)&&Date.now()-hit.at<cacheMs)return hit.blocks
  if(rangeInflight.has(id))return rangeInflight.get(id)
  const controller=new AbortController();let timer
  const request=(async()=>{const response=await fetch('/api/availability?from='+from+'&to='+to,{signal:controller.signal,cache:'no-store',credentials:'same-origin'});if(!response.ok)throw Error('unavailable');const payload=await response.json();if(!payload.ok||payload.from!==from||payload.to!==to||!validBlocks(payload.blocks))throw Error('invalid response');return payload.blocks})()
  const timeout=new Promise((resolve,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('timeout'))},timeoutMs)})
  const promise=Promise.race([request,timeout]).then(blocks=>{rangeCache.set(id,{blocks,at:Date.now()});rangeFailures.delete(id);global.WistiaContact?.refreshCalendarRange?.(from,to);return blocks},error=>{rangeFailures.add(id);global.WistiaContact?.refreshCalendarRange?.(from,to);throw error}).finally(()=>{clearTimeout(timer);rangeInflight.delete(id)})
  rangeInflight.set(id,promise);return promise
 }
 function controls(){if(!activeForm)return null;const ui={date:activeForm.querySelector('#contact-bookingDate'),time:activeForm.querySelector('#contact-time'),status:activeForm.querySelector('[data-booking-status]'),error:activeForm.querySelector('[data-contact-date-error="bookingDate"]')};return ui.date&&ui.time&&ui.status&&ui.error?ui:null}
 function sync(){global.WistiaContact?.syncSubmitState(activeForm);global.WistiaContact?.syncTimeChoices?.(activeForm)}
 function message(text,state){const ui=controls();if(!ui)return;ui.status.textContent=text;ui.status.hidden=state!=='unavailable';ui.status.dataset.state=state;activeForm.dataset.scheduleState=state;sync()}
 function openList(text){const list=activeForm?.querySelector('[data-booking-open-times]');if(list){list.textContent=text;list.hidden=!text}}
 function resetTimes(disabled=false){const ui=controls();if(!ui)return;[...ui.time.options].forEach(option=>{option.dataset.originalLabel??=option.textContent;option.disabled=disabled&&!!option.value;option.textContent=option.dataset.originalLabel});ui.time.setCustomValidity('')}
 function dateError(text){const ui=controls();if(!ui)return;ui.date.setCustomValidity(text);ui.error.textContent=text;ui.error.hidden=!text;if(text)ui.date.setAttribute('aria-invalid','true');else ui.date.removeAttribute('aria-invalid')}
 function restrictTimes(blocks){
  const ui=controls();if(!ui)return
  resetTimes()
  const minutes=duration(activeKey)
  for(const option of ui.time.options){if(!option.value)continue;option.disabled=Date.parse(ui.date.value+'T'+option.value+':00+09:00')<Date.now()||slotBlocked(ui.date.value,option.value,minutes,blocks);if(option.disabled)option.textContent=option.dataset.originalLabel+' · 마감'}
  ui.time.setCustomValidity(ui.time.selectedOptions[0]?.disabled?'선택한 시간은 마감되었습니다, 다른 시간을 선택해 주세요':'')
 }
 function apply(blocks){
  const ui=controls();if(!ui)return
  restrictTimes(blocks)
  const noSlots=[...ui.time.options].filter(option=>option.value).every(option=>option.disabled)
  dateError(noSlots?'선택한 상품으로 예약 가능한 시간이 없는 날짜입니다, 다른 날짜를 선택해 주세요':'')
  const blocked=!!ui.time.selectedOptions[0]?.disabled
  ui.time.setCustomValidity(blocked?'선택한 시간은 마감되었습니다, 다른 시간을 선택해 주세요':'')
  const labels=[...ui.time.options].filter(option=>option.value&&!option.disabled).map(option=>option.textContent)
  message(noSlots?'이 날짜는 예약 마감입니다':blocked?'선택한 시간은 마감입니다, 다른 시간을 선택해 주세요':'마감 시간을 제외한 희망 시작 시간을 선택해 주세요 · 최종 확정은 카카오톡 상담에서 진행합니다',noSlots||blocked?'closed':'ready')
  // Only plain text is displayed; no customer names or financial properties enter the DOM.
  openList(noSlots?'':labels.join(' / '))
 }
 function fallback(){
  // Never a confirmed-available state: wish times stay selectable only with the Kakao notice.
  const date=controls()?.date.value,from=date?.slice(0,7)+'-01',to=validDate(date)?new Date(Date.UTC(Number(date.slice(0,4)),Number(date.slice(5,7)),0)).toISOString().slice(0,10):''
  openList('');dateError('');restrictTimes(cache.get(date)?.blocks??calendarBlocks(from,to)??[])
  message(fallbackMessage,'unavailable')
 }
 function load(date,fresh){
  const hit=cache.get(date)
  if(!fresh&&hit&&!dateFailures.has(date)&&Date.now()-hit.at<cacheMs)return Promise.resolve(hit.blocks)
  const running=inflight.get(date)
  if(running&&(running.fresh||!fresh))return running.promise
  for(const [key,entry] of inflight)if(key!==date){entry.controller.abort();inflight.delete(key)}
  const controller=new AbortController(),entry={controller,fresh}
  let timer
  const request=(async()=>{
   const response=await fetch('/api/availability?date='+encodeURIComponent(date),{signal:controller.signal,cache:'no-store',credentials:'same-origin'})
   if(!response.ok)throw Error('unavailable')
   const payload=await response.json()
   if(!payload.ok||payload.date!==date||!Array.isArray(payload.blocks)||payload.blocks.some(block=>!Number.isFinite(Date.parse(block.start))||!Number.isFinite(Date.parse(block.end))||Date.parse(block.end)<=Date.parse(block.start)))throw Error('invalid response')
   return payload.blocks
  })()
  request.catch(()=>{})
  const timeout=new Promise((resolve,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('timeout'))},timeoutMs)})
  entry.promise=Promise.race([request,timeout]).then(blocks=>{cache.set(date,{blocks,at:Date.now()});dateFailures.delete(date);return blocks},error=>{dateFailures.add(date);throw error}).finally(()=>{clearTimeout(timer);if(inflight.get(date)===entry)inflight.delete(date)})
  inflight.set(date,entry)
  return entry.promise
 }
 async function check(force=false){
  const ui=controls();if(!ui)return
  ui.date.min=today()
  const date=ui.date.disabled?'':ui.date.value,token=++generation
  openList('');dateError('');resetTimes()
  if(!date){message('목·금·토·일 운영 · 날짜가 미정이면 상담에서 함께 정합니다','unknown');return}
  if(!validDate(date)||date<today()){dateError('오늘 이후의 날짜를 선택해 주세요');resetTimes(true);message('희망 예약일을 다시 선택해 주세요','closed');return}
  if(!isOperatingDay(date)){dateError('월·화·수는 마감입니다, 목·금·토·일 중 선택해 주세요');resetTimes(true);message('월·화·수 마감 · 목·금·토·일 운영','closed');return}
  const hit=!force&&cache.get(date)
  if(hit&&!dateFailures.has(date)&&Date.now()-hit.at<cacheMs){apply(hit.blocks);return}
  // While checking, no time can be chosen as confirmed-available and the form cannot be copied.
  resetTimes(true);ui.date.setCustomValidity(pendingMessage);message(pendingMessage,'loading')
  let blocks,failed=false
  try{blocks=await load(date,force)}catch{failed=true}
  if(token!==generation)return
  const now=controls()
  if(!now||(now.date.disabled?'':now.date.value)!==date){check();return}
  if(failed)fallback();else apply(blocks)
 }
 function mount(form,key='solo'){
  activeForm=form||null;activeKey=key
  if(!activeForm){generation++;return}
  global.WistiaContact?.mountCalendars?.(activeForm)
  return check()
 }
 function changed(target){if(activeForm&&target?.closest('#contactInquiryForm')===activeForm)return check()}
 global.WistiaBooking={...rules,mount,changed,refresh:()=>{global.WistiaContact?.mountCalendars?.(activeForm,true);return check(true)},loadRange,calendarBlocks,calendarRangeFailed,calendarKey:()=>activeKey,timeoutMs}
 global.document.addEventListener('visibilitychange',()=>{if(!global.document.hidden&&activeForm?.isConnected){global.WistiaContact?.mountCalendars?.(activeForm,true);check(true)}})
})(typeof window==='object'?window:globalThis)
