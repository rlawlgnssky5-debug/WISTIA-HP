(function(global){
 'use strict'
 const titles=['인원 선택','결혼식 날짜','녹음 날짜·시작 시간','추가 옵션','마지막 확인 후 카톡 문의']
 const steps=['인원','결혼식','녹음','옵션','확인']
 const sources=['인스타','스레드','광고','카페','블로그','지인 추천']
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const icon=kind=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">'+(kind==='people'?'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-17a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v4"/>':kind==='calendar'?'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>':kind==='music'?'<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>':kind==='arrow'?'<path d="m9 5 7 7-7 7"/>':'<path d="m5 12 4 4L19 6"/>')+'</svg>'
 const error=key=>'<p class="wf-error" id="wf-error-'+key+'" data-wf-error="'+key+'" role="alert" hidden></p>'
 const states=new WeakMap()
 function pair(name,labels,selected='0',kind='check'){
  return '<div class="wf-pair">'+labels.map((label,index)=>'<label class="wf-choice"><input type="radio" name="'+name+'" value="'+index+'"'+(String(index)===selected?' checked':'')+'><span>'+icon(kind)+label+'</span></label>').join('')+'</div>'
 }
 function discoveryField(){return '<fieldset><legend>처음에 위스티아를 어디서 보고 오셨나요? (선택)</legend><div class="wf-sources">'+sources.map(source=>'<label class="wf-choice"><input type="radio" name="discovery" value="'+esc(source)+'"><span>'+esc(source)+'</span></label>').join('')+'</div></fieldset>'}
 function checkRow(name,label,amount){return '<label class="wf-check-row"><input type="checkbox" name="'+name+'" value="1"><span class="wf-check-box">'+icon('check')+'</span><span class="wf-check-label">'+label+'</span><strong>+'+money(amount)+'</strong></label>'}
 function eventDateField(){
  return '<fieldset class="contact-field contact-date-field contact-date-eventDate"><legend class="sr-only">결혼식 일정 선택</legend><p class="contact-date-description">결혼식이 열리는 날짜를 알려 주세요</p><input type="hidden" name="eventDateMode" value="date"><input id="contact-eventDate" name="eventDate" type="hidden"><div class="wf-date-dropdowns"><label>년<select data-wf-date-part="year" aria-label="결혼식 연도"></select></label><label>월<select data-wf-date-part="month" aria-label="결혼식 월"></select></label><label>일<select data-wf-date-part="day" aria-label="결혼식 일"></select></label></div><p data-wf-event-label aria-live="polite" hidden></p><label class="wf-undecided"><input type="checkbox" name="eventDateUnknown">아직 미정이에요</label></fieldset>'+error('eventDate')
 }
 function bookingDateField(){
  return global.WistiaContact.dateField('bookingDate','녹음 날짜').replace('<legend>② 녹음 날짜</legend>','<legend class="sr-only">녹음 날짜 선택</legend>').replace('name="bookingDateMode" value="date"','name="bookingDateMode" value="date" checked').replace('value="unknown" data-contact-date-mode="bookingDate" checked','value="unknown" data-contact-date-mode="bookingDate"').replace('data-contact-date-panel="bookingDate" hidden','data-contact-date-panel="bookingDate"').replace('tabindex="-1" disabled data-calendar-value','tabindex="-1" data-calendar-value').replace('data-calendar="bookingDate" role="dialog"','data-calendar="bookingDate" data-calendar-immediate="true" role="group"').replace('aria-label="녹음 날짜 달력" hidden','aria-label="녹음 날짜 달력"').replace(/<button type="button" class="calendar-close"[\s\S]*?<\/button>/,'')+error('bookingDate')
 }
 function render(key,benefits){
  const sections=[
   pair('people',['<b>SOLO(1인)</b><small>1곡 기준·1시간</small><strong>12만원</strong>','<b>DUET(2인)</b><small>1곡 기준·2시간</small><strong>16만원</strong>'],key==='duo'?'1':'0','people')+discoveryField(),
   eventDateField(),
   bookingDateField()+global.WistiaContact.timeField().replace('role="radiogroup"','role="group"').replace('<legend>방문 희망 시간</legend>','<legend>시작 시간 <small data-wf-duration>1시간 진행</small></legend>')+'<p class="wf-recording-range" data-wf-recording-range aria-live="polite">시작 시간을 고르면 녹음 시간이 나와요</p>'+error('timeStart')+'<fieldset class="wf-rush" data-wf-rush><legend class="sr-only">빠른 작업</legend>'+checkRow('rush','3일 이내 받기',30000)+'<p>제작 일정과 자료 준비 상태에 따라 상담 후 확정돼요</p></fieldset>',
   '<fieldset class="wf-option"><legend class="sr-only">가사 영상 옵션</legend>'+checkRow('lyricVideo','① 가사 영상 추가',40000)+'<img class="wf-lyric-example" src="/assets/img/song-options/lyric-video-v2.webp" width="1600" height="900" alt="두 사람의 사진과 노래 가사가 함께 나오는 가사 영상 예시" loading="lazy"></fieldset><fieldset class="wf-option"><legend class="sr-only">1절 녹음 옵션</legend>'+checkRow('extraVerse','② 1절 녹음 추가',60000)+'<p class="wf-option-description">신부·신랑 입장곡처럼 다른 곡을 1절만 더 녹음할 수 있어요. 녹음·튠·믹스를 각각 30분씩 진행해요.</p></fieldset>',
   '<label class="wf-field">특이사항 (선택)<textarea name="specialNotes" rows="4" maxlength="2000"></textarea></label><dl data-wf-review></dl><p class="wf-payment">결제는 카카오톡에서 맞춤 상담 진행 후 진행돼요</p><p class="wf-copy-note">작성한 내용이 복사되면 카카오톡 채팅창에 붙여넣어 보내주세요</p><p class="wf-privacy">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다 <a href="/privacy">개인정보처리방침</a></p>'
  ]
  return '<section class="wistia-wizard"><h1>문의양식 작성</h1><form id="contactInquiryForm" data-wizard="true" data-booking-calendar-opened="true" novalidate><ol class="wf-progress" aria-label="문의 단계">'+steps.map((title,index)=>'<li data-wf-progress="'+index+'"><button type="button" data-wf-goto="'+index+'" aria-label="'+(index+1)+'단계 '+title+'"><span>'+(index+1)+'</span><small>'+title+'</small></button></li>').join('')+'</ol><p class="wf-step-label" aria-live="polite" data-wf-step-label></p>'+sections.map((body,index)=>'<section class="wf-step" data-wf-step="'+index+'"'+(index?' hidden':'')+'><h2 tabindex="-1">'+titles[index]+'</h2>'+body+'</section>').join('')+'<div class="wf-nav"><button type="button" data-wf-prev>이전</button><button type="button" data-wf-next>다음 단계</button><button type="submit" class="wf-submit" hidden>작성한 내용으로 카카오톡 문의하기</button></div><p data-wf-submit-status role="status" hidden></p></form></section>'
 }
 function values(form){return Object.fromEntries(new FormData(form))}
 function quote(form){
  const v=values(form),state=states.get(form),base=v.people==='1'?160000:120000
  const options=[...(v.lyricVideo==='1'?[['가사 영상 추가',40000]]:[]),...(v.extraVerse==='1'?[['1절 녹음 추가',60000]]:[])]
  const paybacks=[],total=base+options.reduce((s,o)=>s+o[1],0)+(v.rush==='1'?30000:0)
  return {v,base,options,total,paybacks,payback:paybacks.reduce((s,b)=>s+b.discount,0)}
 }
 const clock=value=>Number(value.slice(0,2))*60+Number(value.slice(3))
 const clockText=minute=>String(Math.floor(minute/60)).padStart(2,'0')+':'+String(minute%60).padStart(2,'0')
 function range(time,people,extraVerse){if(!time)return '미정';const start=clock(time);return clockText(start)+'~'+clockText(start+(people==='1'?120:60)+(extraVerse==='1'?30:0))}
 function rows(form){
  const q=quote(form),v=q.v,date=key=>v[key+'Mode']==='unknown'?'미정':v[key]?v[key]+' ('+['일','월','화','수','목','금','토'][new Date(v[key]+'T12:00:00Z').getUTCDay()]+')':'미정'
  return [['인원',v.people==='1'?'DUET(2인) · 1곡 · 2시간':'SOLO(1인) · 1곡 · 1시간'],['결혼식 날짜',date('eventDate')],['녹음 날짜',date('bookingDate')],['녹음 시간',range(v.timeStart,v.people,v.extraVerse)],['빠른 작업',v.rush==='1'?'3일 이내 받기 +30,000원':'선택 안 함'],['추가 옵션',q.options.map(o=>o[0]+' +'+money(o[1])).join('\n')||'없음'],['처음 본 곳',v.discovery||'선택 안 함'],['총 금액',money(q.total)]]
 }
 function text(form){const notes=String(values(form).specialNotes||'').trim();return ['[위스티아 상담 요청]','특이사항 : '+(notes||'없음'),'',...rows(form).map(([label,value])=>label+' : '+value),'','결제는 카카오톡에서 맞춤 상담 진행 후 진행돼요'].join('\n')}
 function update(form){
  const state=states.get(form);if(!state)return
  const q=quote(form)
  form.querySelector('[data-wf-next]').textContent='다음 단계 · '+money(q.total)
  form.querySelector('[data-wf-review]').innerHTML=rows(form).map(([label,value])=>'<div'+(label==='총 금액'?' class="wf-final-total"':'')+'><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('')
  form.querySelectorAll('[data-wf-step]').forEach(section=>section.hidden=Number(section.dataset.wfStep)!==state.step)
  form.querySelectorAll('[data-wf-progress]').forEach(li=>{const index=Number(li.dataset.wfProgress),active=index===state.step,done=index<state.step;li.classList.toggle('is-current',active);li.classList.toggle('is-complete',done);const button=li.querySelector('button');button.querySelector('span').innerHTML=done?icon('check'):String(index+1);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')})
  form.querySelector('[data-wf-step-label]').textContent=(state.step+1)+' / 5단계'
  form.querySelector('[data-wf-prev]').disabled=state.step===0
  form.querySelector('[data-wf-next]').hidden=state.step===4
  form.querySelector('[type="submit"]').hidden=state.step!==4
  const recording=form.querySelector('[data-wf-recording-range]');recording.textContent=q.v.timeStart?'녹음 시간 · '+range(q.v.timeStart,q.v.people,q.v.extraVerse):'시작 시간을 고르면 녹음 시간이 나와요';recording.classList.toggle('has-selection',!!q.v.timeStart)
 }
 function mark(form,key,message){
  const el=form.querySelector('[data-wf-error="'+key+'"]');el.textContent=message;el.hidden=!message
  form.elements[key]?.setAttribute?.('aria-invalid',String(!!message))
 }
 function validate(form,step){
  const v=values(form);let okay=true
  const check=(key,message)=>{mark(form,key,message);if(message)okay=false}
  if(step===1)check('eventDate',v.eventDateMode==='unknown'||global.WistiaContact.calendar.selectableDate(v.eventDate,'eventDate')?'':'결혼식 날짜를 골라주세요')
  if(step===2){
   const date=form.querySelector('#contact-bookingDate'),valid=v.bookingDateMode==='date'&&global.WistiaContact.calendar.selectableDate(v.bookingDate,'bookingDate')
   check('bookingDate',valid?(date.validationMessage||''):'녹음 날짜를 골라주세요')
   const time=form.querySelector('#contact-time')
   check('timeStart',valid&&(!v.timeStart||time.selectedOptions[0]?.disabled||form.dataset.scheduleState==='loading')?'시작 시간을 골라주세요':'')
  }
  return okay
 }
 function navigate(form,target){
  const state=states.get(form)
  if(target>state.step)for(let step=0;step<target;step++)if(!validate(form,step)){state.step=step;update(form);form.querySelector('[data-wf-step="'+step+'"] h2').focus();return}
  state.step=Math.max(0,Math.min(4,target));update(form);form.querySelector('[data-wf-step="'+state.step+'"] h2').focus()
 }
 function syncTimes(form){
  const list=form.querySelector('[data-calendar-times]'),time=form.querySelector('#contact-time'),date=form.querySelector('#contact-bookingDate');if(!list||!time||!date)return
  const known=!date.disabled&&!!date.value,loading=form.dataset.scheduleState==='loading',minutes=values(form).people==='1'?120:60
  list.hidden=!known||loading;list.closest('[data-time-scroll-wrap]').hidden=!known||loading;time.closest('label').hidden=true;time.disabled=!known
  const hint=form.querySelector('[data-time-date-hint]');hint.hidden=known&&!loading;hint.textContent=known?'가능한 시간을 불러오고 있어요':'날짜를 먼저 골라 주시면 가능한 시간을 보여 드릴게요';form.querySelector('[data-time-help]').hidden=true
  form.querySelector('[data-wf-duration]').textContent=minutes/60+'시간 진행'
  list.innerHTML=[...time.options].filter(o=>o.value).map(o=>'<button type="button" data-wf-time="'+o.value+'" aria-pressed="'+(time.value===o.value)+'"'+(o.disabled?' disabled':'')+'><strong>'+o.value+'</strong>'+(o.disabled?'<em>예약 불가</em>':'')+'</button>').join('')
  update(form)
 }
 function syncEventDropdowns(form){
  const today=global.WistiaContact.calendar.today(),minYear=Number(today.slice(0,4)),year=form.querySelector('[data-wf-date-part="year"]'),month=form.querySelector('[data-wf-date-part="month"]'),day=form.querySelector('[data-wf-date-part="day"]')
  const previous={year:year.value,month:month.value,day:day.value}
  year.innerHTML='<option value="">년</option>'+Array.from({length:4},(_,i)=>'<option value="'+(minYear+i)+'">'+(minYear+i)+'년</option>').join('');year.value=previous.year
  month.innerHTML='<option value="">월</option>'+(year.value?Array.from({length:12},(_,i)=>i+1).filter(m=>Number(year.value)!==minYear||m>=Number(today.slice(5,7))).map(m=>'<option value="'+m+'">'+m+'월</option>').join(''):'');month.value=previous.month
  if(month.selectedOptions[0]?.disabled)month.value=''
  const days=year.value&&month.value?new Date(Date.UTC(Number(year.value),Number(month.value),0)).getUTCDate():0
  day.innerHTML='<option value="">일</option>'+Array.from({length:days},(_,i)=>i+1).filter(d=>year.value+'-'+month.value.padStart(2,'0')+'-'+String(d).padStart(2,'0')>=today).map(d=>'<option value="'+d+'">'+d+'일</option>').join('');day.value=previous.day
  if(day.selectedOptions[0]?.disabled||!day.value)day.value=''
  const value=year.value&&month.value&&day.value?year.value+'-'+month.value.padStart(2,'0')+'-'+day.value.padStart(2,'0'):''
  const canonical=form.querySelector('#contact-eventDate');canonical.value=value
  const label=form.querySelector('[data-wf-event-label]');label.hidden=!value;label.textContent=value?value+' ('+['일','월','화','수','목','금','토'][new Date(value+'T12:00:00Z').getUTCDay()]+')':''
  if(value)mark(form,'eventDate','')
 }
 function mount(root,{benefits,onPeople,onSubmit}){
  const form=root.querySelector('[data-wizard]'),state={step:0,benefits:benefits||[]};states.set(form,state)
  syncEventDropdowns(form)
  form.addEventListener('change',event=>{
   event.stopPropagation();const el=event.target
   if(el.hasAttribute('data-wf-date-part'))syncEventDropdowns(form)
   else if(el.name==='people'){const key=el.value==='1'?'duo':'solo';onPeople(key);global.WistiaBooking.mount(form,key)}
   else if(['bookingDateMode','bookingDate','timeStart','extraVerse'].includes(el.name))global.WistiaContact.update(el)
   if(el.name==='eventDateUnknown'){form.elements.eventDateMode.value=el.checked?'unknown':'date';form.querySelectorAll('[data-wf-date-part]').forEach(select=>select.disabled=el.checked);form.querySelector('.wf-date-dropdowns').classList.toggle('is-undecided',el.checked);if(el.checked)form.querySelector('[data-wf-event-label]').hidden=true;else syncEventDropdowns(form);mark(form,'eventDate','')}
   if(el.name==='bookingDate')mark(form,'bookingDate','')
   if(el.name==='timeStart')mark(form,'timeStart','')
   update(form)
  })
  form.addEventListener('input',()=>update(form))
  form.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button)return
   if(button.dataset.wfTime){form.querySelector('#contact-time').value=button.dataset.wfTime;form.querySelector('#contact-time').dispatchEvent(new Event('change',{bubbles:true}));syncTimes(form)}
   if(button.hasAttribute('data-wf-goto'))navigate(form,Number(button.dataset.wfGoto))
   if(button.hasAttribute('data-wf-next'))navigate(form,state.step+1)
   if(button.hasAttribute('data-wf-prev'))navigate(form,state.step-1)
  })
  form.addEventListener('submit',async event=>{
   event.preventDefault();event.stopPropagation()
   if(state.step!==4||form.dataset.copyPending)return
   const button=form.querySelector('[type="submit"]');form.dataset.copyPending='true';button.disabled=true
   try{
    await global.WistiaBooking.refresh()
    if(!form.isConnected)return
    for(const step of [1,2])if(!validate(form,step)){state.step=step;update(form);form.querySelector('[data-wf-step="'+step+'"] h2').focus();return}
    await onSubmit(text(form))
   }finally{delete form.dataset.copyPending;button.disabled=false}
  })
  global.WistiaBooking.mount(form,values(form).people==='1'?'duo':'solo');update(form)
 }
 global.WistiaWizard={render,mount,syncTimes,text,quote,rows,range}
})(window)
