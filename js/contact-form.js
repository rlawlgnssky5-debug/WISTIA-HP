(function(global){
 const fields=[
  ['source','어디에서 보고 오셨나요?','인스타 / 스레드 / 광고 / 카페 / 블로그'],
  ['service','희망 서비스',''],
  ['eventDate','결혼식 날짜 (예식일)','예: 2026년 11월 15일 또는 미정'],
  ['bookingDate','녹음 방문일 (스튜디오 예약일)','희망 날짜 / 예약 가능 여부는 상담에서 확인'],
  ['time','희망 시간','13시부터 ~ 23시까지']
 ]
 const snapshotKeys=new Set([...fields.map(field=>field[0]),'eventDateMode','bookingDateMode','timeStart'])
 const escape=value=>String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
 const welcome='🤍 🇼 🇪 🇱 🇨 🇴 🇲 🇪 🤍'
 const timeOptions=Array.from({length:21},(_,index)=>{const hour=13+Math.floor(index/2),minute=index%2?'30':'00';return '<option value="'+hour+':'+minute+'">'+hour+'시'+(minute==='30'?' 30분':'')+'</option>'}).join('')
 // Calendar display uses KST dates; form controls retain the existing ISO value.
 const weekdays=['일','월','화','수','목','금','토']
 function parseDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null
  const date=new Date(value+'T12:00:00Z')
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value?date:null
 }
 function calendarToday(){
  const parts=new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date())
  const part=type=>parts.find(item=>item.type===type).value
  return part('year')+'-'+part('month')+'-'+part('day')
 }
 function displayDate(value){const date=parseDate(value);return date?date.getUTCFullYear()+'년 '+(date.getUTCMonth()+1)+'월 '+date.getUTCDate()+'일 ('+weekdays[date.getUTCDay()]+')':'날짜를 선택해 주세요'}
 function isoDate(date){return date.toISOString().slice(0,10)}
 function selectableDate(value,key,today=calendarToday()){const date=parseDate(value);return !!date&&value>=today&&(key!=='bookingDate'||[0,4,5,6].includes(date.getUTCDay()))}
 function selectableBookingDate(value,key){
  if(!selectableDate(value,key))return false
  if(key!=='bookingDate')return true
  const date=parseDate(value),from=isoDate(new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),1))),to=isoDate(new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0))),booking=global.WistiaBooking,blocks=booking?.calendarBlocks(from,to)
  return blocks==null||!booking.dayClosed(value,booking.calendarKey(),blocks)
 }
 function calendarCells(year,month,key,selected='',today=calendarToday(),blocks=null,product='solo'){
  const first=new Date(Date.UTC(year,month,1)),count=new Date(Date.UTC(year,month+1,0)).getUTCDate()
  let cells='<span class="calendar-empty" aria-hidden="true"></span>'.repeat(first.getUTCDay())
  for(let day=1;day<=count;day++){
   const date=new Date(Date.UTC(year,month,day)),value=isoDate(date),weekdayClosed=key==='bookingDate'&&[1,2,3].includes(date.getUTCDay()),notionClosed=key==='bookingDate'&&!weekdayClosed&&blocks!==null&&global.WistiaBooking?.dayClosed(value,product,blocks),closed=weekdayClosed||notionClosed,past=value<today,enabled=selectableDate(value,key,today)&&!closed
   cells+='<button type="button" class="calendar-day'+(value===selected?' is-selected':'')+(value===today?' is-today':'')+'" data-calendar-day="'+value+'" tabindex="-1"'+(!enabled?' disabled':'')+' aria-label="'+displayDate(value)+(closed?' · 마감':past?' · 예약불가':'')+'" aria-pressed="'+(value===selected)+'"'+(value===today?' aria-current="date"':'')+'><span>'+day+'</span>'+(notionClosed?'<small>마감</small>':!weekdayClosed&&past?'<small>불가</small>':'')+'</button>'
  }
  return cells
 }
 const calendarIcon=direction=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="'+(direction==='prev'?'m14 6-6 6 6 6':'m10 6 6 6-6 6')+'"/></svg>'
 function calendarMarkup(key,label){
  const booking=key==='bookingDate'
  return '<div class="contact-calendar'+(booking?' calendar-inline':' calendar-popup')+'" id="calendar-'+key+'" data-calendar="'+key+'" role="'+(booking?'group':'dialog')+'" aria-label="'+label+' 달력"'+(!booking?' hidden':'')+'><div class="calendar-caption"><strong>날짜 선택</strong><span data-calendar-selection aria-live="polite">날짜를 선택해 주세요</span>'+(!booking?'<button type="button" class="calendar-close" data-calendar-close aria-label="달력 닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>':'')+'</div><div class="calendar-navigation"><button type="button" data-calendar-move="-1" aria-label="이전 달">'+calendarIcon('prev')+'</button><div class="calendar-month-selects"><label><span class="sr-only">연도 선택</span><select data-calendar-year aria-label="연도 선택"></select></label><label><span class="sr-only">월 선택</span><select data-calendar-month aria-label="월 선택">'+Array.from({length:12},(_,i)=>'<option value="'+i+'">'+(i+1)+'월</option>').join('')+'</select></label></div><button type="button" data-calendar-move="1" aria-label="다음 달">'+calendarIcon('next')+'</button></div><p class="calendar-month-announcement sr-only" data-calendar-month-label aria-live="polite"></p>'+'<div class="calendar-weekdays" aria-hidden="true">'+weekdays.map(day=>'<span>'+day+'</span>').join('')+'</div><div class="calendar-grid" data-calendar-grid role="group" aria-label="날짜"></div><div class="calendar-legend"><span><i class="legend-unavailable"></i>마감/예약불가</span><span><i class="legend-today"></i>오늘</span><span><i class="legend-selected"></i>선택</span></div></div>'
 }
 const calendarStates=new WeakMap()
 let openCalendar=null,outsideListener=false
 function closeCalendar(restoreFocus=false){
  if(!openCalendar)return
  const state=openCalendar;state.calendar.hidden=true;state.trigger.setAttribute('aria-expanded','false');openCalendar=null
  if(restoreFocus)state.trigger.focus()
 }
 function positionCalendar(state){
  const rect=state.trigger.getBoundingClientRect(),width=Math.min(360,global.innerWidth-24)
  state.calendar.style.width=width+'px'
  const height=state.calendar.offsetHeight
  state.calendar.style.left=Math.max(12,Math.min(rect.left,global.innerWidth-width-12))+'px'
  state.calendar.style.top=Math.max(12,Math.min(rect.bottom+8,global.innerHeight-height-12))+'px'
 }
 function paintCalendar(state,focusValue){
  focusValue??=state.calendar.contains(global.document.activeElement)?global.document.activeElement.dataset.calendarDay:undefined
  const {calendar,input,key}=state,today=calendarToday(),yearSelect=calendar.querySelector('[data-calendar-year]'),monthSelect=calendar.querySelector('[data-calendar-month]')
  const minYear=Number(today.slice(0,4)),maxYear=Math.max(minYear+15,state.year)
  yearSelect.innerHTML=Array.from({length:maxYear-minYear+1},(_,i)=>'<option value="'+(minYear+i)+'">'+(minYear+i)+'년</option>').join('')
  yearSelect.value=String(state.year);monthSelect.value=String(state.month)
  calendar.querySelector('[data-calendar-month-label]').textContent=state.year+'년 '+(state.month+1)+'월'
  calendar.querySelector('[data-calendar-move="-1"]').disabled=state.year===minYear&&state.month<=Number(today.slice(5,7))-1
  calendar.querySelector('[data-calendar-selection]').textContent=displayDate(input.value)
  if(state.trigger)state.trigger.querySelector('[data-calendar-display]').textContent=displayDate(input.value)
  const grid=calendar.querySelector('[data-calendar-grid]')
  const from=isoDate(new Date(Date.UTC(state.year,state.month,1))),to=isoDate(new Date(Date.UTC(state.year,state.month+1,0))),booking=global.WistiaBooking
  grid.innerHTML=calendarCells(state.year,state.month,key,input.value,today,key==='bookingDate'?booking?.calendarBlocks(from,to)??null:null,booking?.calendarKey()||'solo')
  if(key==='bookingDate'&&booking?.loadRange){
   const id=from+':'+to
   if(state.rangeId!==id){state.rangeId=id;booking.loadRange(from,to).catch(()=>{}).finally(()=>{if(state.rangeId===id&&calendar.isConnected)paintCalendar(state)})}
  }
  const active=grid.querySelector('[data-calendar-day="'+(focusValue||input.value||today)+'"]:not(:disabled)')||grid.querySelector('button:not(:disabled)')
  if(active){active.tabIndex=0;if(focusValue)active.focus()}
  if(openCalendar===state)positionCalendar(state)
 }
 function refreshCalendarRange(from,to){
  global.document?.querySelectorAll('[data-calendar="bookingDate"]').forEach(calendar=>{
   const state=calendarStates.get(calendar)
   if(state&&isoDate(new Date(Date.UTC(state.year,state.month,1)))===from&&isoDate(new Date(Date.UTC(state.year,state.month+1,0)))===to)paintCalendar(state)
  })
 }
 function changeMonth(state,amount){
  const date=new Date(Date.UTC(state.year,state.month+amount,1)),today=parseDate(calendarToday())
  if(date.getUTCFullYear()<today.getUTCFullYear()||(date.getUTCFullYear()===today.getUTCFullYear()&&date.getUTCMonth()<today.getUTCMonth()))return
  state.year=date.getUTCFullYear();state.month=date.getUTCMonth();paintCalendar(state)
 }
 function mountCalendars(form,fresh=false){
  if(!form?.querySelectorAll||!global.document?.addEventListener)return
  if(openCalendar&&!openCalendar.calendar.isConnected)closeCalendar()
  if(!outsideListener){
   outsideListener=true
   global.document.addEventListener('pointerdown',event=>{if(openCalendar&&!openCalendar.calendar.contains(event.target)&&!openCalendar.trigger.contains(event.target))closeCalendar()})
   global.document.addEventListener('keydown',event=>{if(event.key==='Escape'&&openCalendar){event.preventDefault();closeCalendar(true)}})
   global.document.addEventListener('focusin',event=>{if(openCalendar&&!openCalendar.calendar.contains(event.target)&&!openCalendar.trigger.contains(event.target))closeCalendar()})
   global.addEventListener('resize',()=>{if(openCalendar)positionCalendar(openCalendar)})
   global.addEventListener('scroll',()=>{if(openCalendar)positionCalendar(openCalendar)},{passive:true})
  }
  form.querySelectorAll('[data-calendar]').forEach(calendar=>{
   const key=calendar.dataset.calendar,input=form.querySelector('#contact-'+key)
   let state=calendarStates.get(calendar)
   if(state){
    if(fresh&&key==='bookingDate'&&global.WistiaBooking?.loadRange){const from=isoDate(new Date(Date.UTC(state.year,state.month,1))),to=isoDate(new Date(Date.UTC(state.year,state.month+1,0)));global.WistiaBooking.loadRange(from,to,true).catch(()=>{}).finally(()=>{if(calendar.isConnected)paintCalendar(state)})}
    paintCalendar(state);return
   }
   const date=(input.value>=calendarToday()?parseDate(input.value):null)||parseDate(calendarToday()),trigger=form.querySelector('[data-calendar-trigger="'+key+'"]')
   state={calendar,key,input,trigger,year:date.getUTCFullYear(),month:date.getUTCMonth()};calendarStates.set(calendar,state)
   trigger?.addEventListener('click',()=>{
    if(openCalendar===state){closeCalendar();return}
    closeCalendar();const date=(input.value>=calendarToday()?parseDate(input.value):null)||parseDate(calendarToday());state.year=date.getUTCFullYear();state.month=date.getUTCMonth()
    calendar.hidden=false;openCalendar=state;trigger.setAttribute('aria-expanded','true');paintCalendar(state);positionCalendar(state)
    calendar.querySelector('.calendar-day[tabindex="0"]')?.focus()
   })
   calendar.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return
    if(button.hasAttribute('data-calendar-close')){closeCalendar(true);return}
    if(button.hasAttribute('data-calendar-move')){changeMonth(state,Number(button.dataset.calendarMove));return}
    const value=button.dataset.calendarDay
    if(value&&selectableBookingDate(value,key)){
     input.value=value;paintCalendar(state,value);if(key==='eventDate')closeCalendar(true)
     input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))
    }
   })
   calendar.addEventListener('change',event=>{
    if(!event.target.matches('[data-calendar-year],[data-calendar-month]'))return
    state.year=Number(calendar.querySelector('[data-calendar-year]').value);state.month=Number(calendar.querySelector('[data-calendar-month]').value)
    const today=parseDate(calendarToday());if(state.year===today.getUTCFullYear()&&state.month<today.getUTCMonth())state.month=today.getUTCMonth()
    paintCalendar(state)
   })
   calendar.addEventListener('keydown',event=>{
    const value=event.target.dataset.calendarDay;if(!value)return
    const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}
    if(event.key==='PageUp'||event.key==='PageDown'){event.preventDefault();changeMonth(state,(event.key==='PageUp'?-1:1)*(event.shiftKey?12:1));calendar.querySelector('.calendar-day[tabindex="0"]')?.focus();return}
    const amount=moves[event.key];if(!amount)return
    event.preventDefault();const date=parseDate(value);date.setUTCDate(date.getUTCDate()+amount)
    for(let i=0;i<42&&!selectableBookingDate(isoDate(date),key);i++){if(isoDate(date)<calendarToday())return;date.setUTCDate(date.getUTCDate()+Math.sign(amount))}
    if(!selectableBookingDate(isoDate(date),key))return
    state.year=date.getUTCFullYear();state.month=date.getUTCMonth();paintCalendar(state,isoDate(date))
   })
   paintCalendar(state)
  })
  syncTimeChoices(form)
 }
 function syncTimeChoices(form){
  if(!form?.querySelector)return
  const list=form.querySelector('[data-calendar-times]'),time=form.querySelector('#contact-time'),date=form.querySelector('#contact-bookingDate')
  if(!list||!time||!date)return
  const known=!date.disabled&&!!parseDate(date.value)
  list.hidden=!known;time.closest('label').hidden=known
  const focused=list.contains(global.document.activeElement)?global.document.activeElement.dataset.calendarTime:null
  const closedLabel=form.dataset.scheduleState==='loading'?'확인 중':'마감'
  list.innerHTML=[...time.options].map(option=>'<button type="button" role="radio" aria-checked="'+(time.value===option.value)+'" data-calendar-time="'+option.value+'"'+(option.disabled?' disabled':'')+'>'+escape(option.dataset.originalLabel||option.textContent)+(option.disabled?'<small>'+closedLabel+'</small>':'')+'</button>').join('')
  if(!list.dataset.mounted){
   list.dataset.mounted='true'
   list.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.disabled)return;time.value=button.dataset.calendarTime;time.dispatchEvent(new Event('change',{bubbles:true}));syncTimeChoices(form)})
   list.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return
    const buttons=[...list.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(event.target);if(index<0)return
    event.preventDefault();const columns=global.getComputedStyle(list).gridTemplateColumns.split(' ').length,amount={ArrowLeft:-1,ArrowRight:1,ArrowUp:-columns,ArrowDown:columns}[event.key];buttons[(index+amount+buttons.length)%buttons.length]?.focus()
   })
  }
  if(focused!==null)list.querySelector('[data-calendar-time="'+focused+'"]')?.focus()
 }
 function dateField(key,label){
  return '<fieldset class="contact-field contact-date-field contact-date-'+key+'"><legend>'+(key==='eventDate'?'① ':'② ')+label+'</legend><p class="contact-date-description">'+(key==='eventDate'?'결혼식이 열리는 날짜를 알려 주세요':'스튜디오에 방문해 녹음하실 희망 날짜를 골라 주세요')+'</p><div class="contact-date-toggle"><label><input type="radio" name="'+key+'Mode" value="date" data-contact-date-mode="'+key+'"><span>날짜 선택</span></label><label><input type="radio" name="'+key+'Mode" value="unknown" data-contact-date-mode="'+key+'" checked><span>미정</span></label></div><div class="contact-date-picker" data-contact-date-panel="'+key+'" hidden><label class="sr-only" for="contact-'+key+'">'+label+' 날짜</label><input id="contact-'+key+'" name="'+key+'" type="text" hidden tabindex="-1" disabled '+(key==='eventDate'?'aria-describedby="contact-eventDate-hint"':'')+' data-calendar-value>'+ (key==='eventDate'?'<button type="button" class="calendar-trigger" data-calendar-trigger="'+key+'" aria-haspopup="dialog" aria-expanded="false" aria-controls="calendar-'+key+'"><span data-calendar-display>날짜를 선택해 주세요</span>'+calendarIcon('next')+'</button>':'')+calendarMarkup(key,label)+(key==='eventDate'?'<em id="contact-eventDate-hint">달력에서 날짜를 선택해 주세요</em>':'')+'<small class="contact-input-error" data-contact-date-error="'+key+'" role="alert" hidden></small></div></fieldset>'
 }
 function timeField(){return '<fieldset class="contact-field contact-time-field"><legend>희망 시간</legend><div class="contact-time-selects"><label for="contact-time"><span class="sr-only">희망 시간 선택</span><select id="contact-time" name="timeStart" aria-describedby="bookingAvailabilityStatus"><option value="">미정</option>'+timeOptions+'</select></label></div><div class="calendar-time-grid" data-calendar-times role="radiogroup" aria-label="희망 시작 시간" hidden></div><em>13시~23시 · 희망 시작 시간을 선택해 주세요</em><p id="bookingAvailabilityStatus" data-booking-status role="status" aria-live="polite" hidden></p></fieldset>'}
 function validationIssues(form,{mark=true}={}){
  return [...form.elements].filter(control=>control.willValidate&&control.name!=='name').flatMap(control=>{
   const missing=control.required&&!String(control.value||'').trim(),invalid=missing||!control.validity.valid
   if(!invalid){if(mark)control.removeAttribute('aria-invalid');return []}
   if(mark)control.setAttribute('aria-invalid','true')
   const label=fields.find(field=>field[0]===(control.name==='timeStart'?'time':control.name))?.[1]||'입력 내용'
   return [{control,label,message:missing?(control.tagName==='SELECT'?'선택해 주세요':'입력해 주세요'):(control.validationMessage||'입력 내용을 확인해 주세요')}]
  })
 }
 function update(target){
  const form=target.closest('#contactInquiryForm');if(!form)return
  if(target.dataset.contactDateMode){const key=target.dataset.contactDateMode,panel=form.querySelector('[data-contact-date-panel="'+key+'"]'),input=panel.querySelector('input'),known=target.value==='date';panel.hidden=!known;input.disabled=!known;if(!known)closeCalendar();if(!known){input.setCustomValidity('');input.removeAttribute('aria-invalid');panel.querySelector('.contact-input-error').hidden=true}}
  const event=form.querySelector('#contact-eventDate')
  if(event&&!event.disabled){const invalid=event.value&&!selectableDate(event.value,'eventDate');event.setCustomValidity(invalid?'오늘 이후의 날짜를 선택해 주세요':'')}
  const booking=form.querySelector('#contact-bookingDate'),dateError=form.querySelector('[data-contact-date-error="bookingDate"]')
  booking.setCustomValidity('');booking.removeAttribute('aria-invalid');dateError.hidden=true
  mountCalendars(form)
  global.WistiaBooking?.changed(target)
 }
 const formatDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)?value.replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$1년 $2월 $3일'):value
 function render(quote,{embedded=false,integrated=false}={}){
  const ordered=integrated?['eventDate','bookingDate','time','source'].map(key=>fields.find(field=>field[0]===key)):fields
  const inputs=ordered.map(([key,label,hint])=>{
   if(key==='eventDate'||key==='bookingDate')return dateField(key,label)
   if(key==='time')return timeField()
   const id='contact-'+key
   let input
   if(key==='service')input=embedded?'<input id="'+id+'" name="service" value="'+escape(quote?.service||'상담 후 결정')+'" readonly><em>위의 상품 선택에 따라 함께 변경됩니다</em>':'<select id="'+id+'" name="'+key+'" required><option value="">서비스를 선택해 주세요</option>'+['AR 축가 사전녹음','축가 스토리 필름','상담 후 결정'].map(value=>'<option'+(quote?.service===value?' selected':'')+'>'+value+'</option>').join('')+'</select>'
   else if(key==='source'&&integrated)input='<select id="'+id+'" name="source"><option value="">선택 안 함</option>'+['인스타','스레드','메타 광고','카카오톡 채널','카페','블로그','지인 추천','기타'].map(value=>'<option>'+value+'</option>').join('')+'</select>'
   else input='<input id="'+id+'" name="'+key+'" type="text" maxlength="200" autocomplete="off" placeholder="'+hint+'"'+(key==='source'?' list="contact-sources"':'')+'>'
   return '<label class="contact-field" for="'+id+'"><span>'+label+(key==='service'?'<small>필수</small>':'')+'</span>'+input+(key==='time'?'<em>방문 가능 시간 편하게 적어주세요</em>':'')+'</label>'
  }).join('')
  if(integrated)return '<section id="bookingInquiry" class="consultation-step consultation-fields" data-contact-fields aria-labelledby="scheduleTitle"><header class="consultation-step-heading"><span class="booking-step">02</span><h2 id="scheduleTitle">일정 작성</h2><p>아직 정해지지 않은 일정은 미정으로 두셔도 괜찮습니다</p></header><input id="contact-service" name="service" type="hidden" value="'+escape(quote?.service||'상담 후 결정')+'" readonly><div class="consultation-field-grid">'+inputs+'</div></section>'
  return '<section class="contact-page'+(embedded?' contact-embedded':' shell')+'" id="bookingInquiry" aria-labelledby="contact-title"><header class="contact-intro"><p class="contact-welcome">'+welcome+'</p><'+(embedded?'h2':'h1')+' id="contact-title">문의 양식 작성</'+(embedded?'h2':'h1')+'><p>내용을 작성한 후 복사해<br>카카오톡 채팅창에 붙여넣어 보내주세요 :D</p></header><form id="contactInquiryForm" novalidate class="contact-form"><p class="contact-form-heading">[ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐅𝐨𝐫𝐦 ]</p><p class="contact-form-help">보내주신 내용을 확인한 후 빠르게 안내드리겠습니다 :)<br>일정이 미정이라면 비워 두셔도 괜찮습니다</p>'+inputs+'<datalist id="contact-sources"><option value="인스타"><option value="스레드"><option value="광고"><option value="카페"><option value="블로그"></datalist><aside class="contact-quote"'+(!quote?' hidden':'')+'><strong>선택한 구성도 함께 전달합니다</strong><p>'+escape(quote?.summary)+'</p><small>작성 내용과 함께 복사되며 최종 금액은 상담에서 확인합니다</small></aside>'+submit()+'</form></section>'
 }
 function submitIcon(name){return '<span class="svg-submit-icon" aria-hidden="true">'+(typeof global.studioIcon==='function'?global.studioIcon(name):'<svg class="studio-icon" data-icon="'+name+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false">'+(name==='check'?'<path d="m5 12 4.5 4.5L19 7"/>':'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M5 16H3V3h13v2"/>')+'</svg>')+'</span>'}
 function submit(){return '<p class="contact-privacy-note">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다<br>복사 후 카카오톡 채팅창에 붙여넣어 보내주세요 <a href="/privacy">개인정보처리방침</a></p><aside class="inquiry-actions" aria-label="카카오톡 상담 방법"><a class="inquiry-direct" href="https://pf.kakao.com/_GbExjX/chat" target="_blank" rel="noopener noreferrer">양식 없이 일단 상담하기</a><button type="submit" class="button dark contact-submit" data-submit-state="incomplete" aria-label="(작성이 필요해요)"><span data-submit-label>'+submitIcon('copy')+'(작성이 필요해요)</span></button></aside>'}
 function syncSubmitState(form=document.querySelector('#contactInquiryForm'),extraButton){
  if(!form)return
  const ready=validationIssues(form,{mark:false}).length===0,label=ready?'이제 복사하고 카카오톡으로!':'(작성이 필요해요)'
  const buttons=[...document.querySelectorAll('.contact-submit'),...(extraButton?[extraButton]:[])]
  buttons.forEach(button=>{button.dataset.submitState=ready?'ready':'incomplete';button.setAttribute('aria-label',label);button.querySelector('[data-submit-label]').innerHTML=submitIcon(ready?'check':'copy')+(ready?'이제 복사하고 <span class="inquiry-submit-next">카카오톡으로!</span>':label)})
  return ready
 }
 function validationEditor(issues){
  return issues.filter(({control})=>control.name!=='name').map(({control,label,message},index)=>{
   const id='inquiry-edit-'+index,attributes=['required','min','max','step','maxlength','minlength','pattern','autocomplete'].map(key=>control.hasAttribute(key)?' '+key+'="'+escape(control.getAttribute(key))+'"':'').join('')
   const common=' id="'+id+'" data-inquiry-edit="'+index+'" aria-describedby="'+id+'-error" aria-invalid="true"'+attributes
   let input
   if(control.tagName==='SELECT')input='<select'+common+'>'+[...control.options].map(option=>'<option value="'+escape(option.value)+'"'+(option.selected?' selected':'')+(option.disabled?' disabled':'')+'>'+escape(option.textContent)+'</option>').join('')+'</select>'
   else if(control.tagName==='TEXTAREA')input='<textarea'+common+'>'+escape(control.value)+'</textarea>'
   else input='<input type="'+escape(control.type||'text')+'"'+common+' value="'+escape(control.value)+'">'
   return '<div class="inquiry-edit-field"><label for="'+id+'">'+escape(label)+'</label>'+input+'<p id="'+id+'-error" class="inquiry-edit-error" role="status">'+escape(label+' '+message)+'</p></div>'
  }).join('')
 }
 function syncReview(){
  const form=document.querySelector('#contactInquiryForm'),review=document.querySelector('#contactReview');if(!form)return;syncSubmitState(form);if(!review)return
  const values=snapshot(form),date=key=>values[key+'Mode']==='date'&&values[key]?formatDate(values[key]):'미정'
  const rows=[['결혼식 날짜 (예식일)',date('eventDate')],['녹음 방문일 (스튜디오 예약일)',date('bookingDate')],['희망 시간',values.timeStart||'미정'],['유입 경로',values.source||'선택 안 함']]
  review.innerHTML=rows.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+escape(value)+'</dd></div>').join('')
 }
 function syncQuote(quote){
  const form=document.querySelector('#contactInquiryForm');if(!form)return
  const service=form.querySelector('[name="service"]');if(service?.readOnly)service.value=quote?.service||'상담 후 결정'
  const preview=form.querySelector('.contact-quote');if(preview){preview.hidden=!quote;preview.querySelector('p').textContent=quote?.summary||''}
  syncReview()
 }
 function snapshot(form){return form?Object.fromEntries([...new FormData(form)].filter(([key])=>snapshotKeys.has(key))):null}
 function restore(form,values){
  if(!form||!values)return
  for(const [key,value] of Object.entries(values)){if(key==='service'||!snapshotKeys.has(key))continue;const controls=[...form.elements].filter(el=>el.name===key);controls.forEach(el=>{if(el.type==='radio')el.checked=el.value===value;else el.value=value})}
  form.querySelectorAll('[data-contact-date-mode]:checked').forEach(update)
  global.WistiaBooking?.changed(form.querySelector('#contact-bookingDate'))
  mountCalendars(form)
  syncSubmitState(form)
 }
 function text(values,quote){
  const quoteBody=quote?.text?.split('━━━━━').slice(1).join('━━━━━').trim()
  const lines=['[위스티아 상담 요청]','']
  let next=1
  if(quoteBody){lines.push(quoteBody,'');const numbers=[...quoteBody.matchAll(/^(\d+)\) /gm)].map(match=>Number(match[1]));next=numbers.length?Math.max(...numbers)+1:1}
  else{lines.push((next++)+') 희망 서비스','희망 서비스 : '+(String(values.service||'').trim()||'미정'),'')}
  lines.push((next++)+') 예약 일정')
  fields.filter(([key])=>['eventDate','bookingDate','time'].includes(key)).forEach(([key,label])=>{let value=String(values[key]||'').trim();if(key==='eventDate'||key==='bookingDate')value=values[key+'Mode']==='unknown'?'':formatDate(value);if(key==='time')value=values.timeStart||'';lines.push(label+' : '+(value||'미정'))})
  if(values.bookingDateMode==='date'&&values.bookingDate)lines.push('일정 안내 : 희망 일정이며 예약 가능 여부와 최종 확정은 카카오톡 상담에서 확인')
  lines.push('',next+') 유입 경로','어디에서 보고 오셨나요? : '+(String(values.source||'').trim()||'선택 안 함'))
  return lines.join('\n').trim()
 }
 global.WistiaContact={render,submit,text,update,syncQuote,syncReview,snapshot,restore,validationIssues,syncSubmitState,validationEditor,mountCalendars,refreshCalendarRange,syncTimeChoices,calendar:{parseDate,today:calendarToday,displayDate,selectableDate,cells:calendarCells}}
})(window)
