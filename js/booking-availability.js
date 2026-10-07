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
 const rules={validDate,today,isOperatingDay,duration,slotBlocked,operatingDays}
 if(typeof module==='object'&&module.exports)module.exports=rules
 if(!global.document)return
 let activeForm=null,activeKey='solo',generation=0,controller=null,lastDate='',result=null
 const pendingMessage='예약 가능 시간을 확인하고 있습니다'
 function controls(){return activeForm?{date:activeForm.querySelector('#contact-bookingDate'),time:activeForm.querySelector('#contact-time'),status:activeForm.querySelector('[data-booking-status]'),error:activeForm.querySelector('[data-contact-date-error="bookingDate"]')}:null}
 function sync(){global.WistiaContact?.syncSubmitState(activeForm)}
 function message(text,state){const ui=controls();if(!ui)return;ui.status.textContent=text;ui.status.dataset.state=state;activeForm.dataset.scheduleState=state;sync()}
 function resetTimes(disabled=false){const ui=controls();if(!ui)return;[...ui.time.options].forEach(option=>{option.dataset.originalLabel??=option.textContent;option.disabled=disabled&&!!option.value;option.textContent=option.dataset.originalLabel});ui.time.setCustomValidity('')}
 function dateError(text){const ui=controls();if(!ui)return;ui.date.setCustomValidity(text);ui.error.textContent=text;ui.error.hidden=!text;if(text)ui.date.setAttribute('aria-invalid','true');else ui.date.removeAttribute('aria-invalid')}
 function restrictTimes(blocks){
  const ui=controls();if(!ui)return
  resetTimes()
  const minutes=duration(activeKey)
  for(const option of ui.time.options){if(!option.value)continue;option.disabled=Date.parse(ui.date.value+'T'+option.value+':00+09:00')<Date.now()||slotBlocked(ui.date.value,option.value,minutes,blocks);if(option.disabled)option.textContent=option.dataset.originalLabel+' · 마감'}
  ui.time.setCustomValidity(ui.time.selectedOptions[0]?.disabled?'선택한 시간은 마감되었습니다, 다른 시간을 선택해 주세요':'')
 }
 function apply(){
  const ui=controls();if(!ui)return
  restrictTimes(result.blocks)
  const noSlots=[...ui.time.options].filter(option=>option.value).every(option=>option.disabled)
  dateError(noSlots?'선택한 상품으로 예약 가능한 시간이 없는 날짜입니다, 다른 날짜를 선택해 주세요':'')
  const blocked=!!ui.time.selectedOptions[0]?.disabled
  ui.time.setCustomValidity(blocked?'선택한 시간은 마감되었습니다, 다른 시간을 선택해 주세요':'')
  const labels=[...ui.time.options].filter(option=>option.value&&!option.disabled).map(option=>option.textContent)
  message(noSlots?'이 날짜는 예약 마감입니다':blocked?'선택한 시간은 마감입니다, 다른 시간을 선택해 주세요':'마감 시간을 제외한 희망 시작 시간을 선택해 주세요 · 최종 확정은 카카오톡 상담에서 진행합니다',noSlots||blocked?'closed':'ready')
  // Only plain text is displayed; no customer names or financial properties enter the DOM.
  const list=activeForm.querySelector('[data-booking-open-times]');if(list){list.textContent=noSlots?'':labels.join(' / ');list.hidden=noSlots}
 }
 async function check(force=false){
  const ui=controls();if(!ui)return
  ui.date.min=today()
  const date=ui.date.disabled?'':ui.date.value
  if(!force&&date===lastDate&&result){apply();return}
  if(!force&&date===lastDate&&activeForm.dataset.scheduleState==='loading'){ui.date.setCustomValidity(pendingMessage);sync();return}
  controller?.abort();controller=null;const token=++generation;lastDate=date;result=null
  const list=activeForm.querySelector('[data-booking-open-times]');if(list){list.hidden=true;list.textContent=''}
  dateError('');resetTimes()
  if(!date){message('목·금·토·일 운영 · 날짜가 미정이면 상담에서 함께 정합니다','unknown');return}
  if(!validDate(date)||date<today()){dateError('오늘 이후의 날짜를 선택해 주세요');resetTimes(true);message('희망 예약일을 다시 선택해 주세요','closed');return}
  if(!isOperatingDay(date)){dateError('월·화·수는 휴무입니다, 목·금·토·일 중 선택해 주세요');resetTimes(true);message('월·화·수 휴무 · 목·금·토·일 운영','closed');return}
  resetTimes(true);ui.date.setCustomValidity(pendingMessage);message(pendingMessage,'loading')
  controller=new AbortController();const requestController=controller,timer=setTimeout(()=>requestController.abort(),12000)
  try{
   const response=await fetch('/api/availability?date='+encodeURIComponent(date),{signal:controller.signal,cache:'no-store',credentials:'same-origin'})
   if(!response.ok)throw Error('unavailable')
   const payload=await response.json()
   if(!payload.ok||payload.date!==date||!Array.isArray(payload.blocks)||payload.blocks.some(block=>!Number.isFinite(Date.parse(block.start))||!Number.isFinite(Date.parse(block.end))||Date.parse(block.end)<=Date.parse(block.start)))throw Error('invalid response')
   if(token!==generation||activeForm!==ui.date.closest('form'))return
   result={blocks:payload.blocks};apply()
  }catch{
   if(token!==generation)return
   dateError('');restrictTimes([])
   message('일정 자동 확인이 연결되지 않았거나 잠시 지연되고 있습니다 · 희망 일정으로 문의하시면 카카오톡에서 가능 여부를 확인합니다','unavailable')
  }finally{clearTimeout(timer);if(token===generation)sync()}
 }
 function mount(form,key='solo'){
  if(form===activeForm){activeKey=key;check();return}
  controller?.abort();generation++;activeForm=form;activeKey=key;lastDate='';result=null
  if(!form)return
  check(true)
 }
 function changed(target){if(target?.closest('#contactInquiryForm')===activeForm)check()}
 global.WistiaBooking={...rules,mount,changed,refresh:()=>check(true)}
 global.document.addEventListener('visibilitychange',()=>{if(!global.document.hidden&&activeForm?.isConnected)check(true)})
})(typeof window==='object'?window:globalThis)
