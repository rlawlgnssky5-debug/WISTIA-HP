(function(global){
 'use strict'
 const titles=['패키지와 인원 선택','결혼식 날짜','녹음 날짜·시작 시간','추가 옵션과 할인','마지막 확인 후 카톡 문의']
 const steps=['상품','결혼식','녹음','옵션','확인']
 const sources=['인스타','스레드','광고','카페','블로그','지인 추천']
 const sourceLabels={'지인 추천':'기타 (지인 추천 등)'}
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const icon=kind=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">'+(kind==='people'?'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-17a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v4"/>':kind==='calendar'?'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>':kind==='music'?'<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>':kind==='arrow'?'<path d="m9 5 7 7-7 7"/>':'<path d="m5 12 4 4L19 6"/>')+'</svg>'
 const error=key=>'<p class="wf-error" id="wf-error-'+key+'" data-wf-error="'+key+'" role="alert" hidden></p>'
 const states=new WeakMap()
 function pair(name,labels,selected='0',kind='check'){
  return '<div class="wf-pair">'+labels.map((label,index)=>'<label class="wf-choice"><input type="radio" name="'+name+'" value="'+index+'"'+(String(index)===selected?' checked':'')+'><span>'+icon(kind)+label+'</span></label>').join('')+'</div>'
 }
 function discoveryField(){return '<fieldset><legend>처음에 위스티아를 어디서 보고 오셨나요? (선택)</legend><div class="wf-sources">'+sources.map(source=>'<label class="wf-choice"><input type="radio" name="discovery" value="'+esc(source)+'"><span'+(sourceLabels[source]?' class="wf-source-label"':'')+'>'+(sourceLabels[source]?'<span class="wf-source-main">'+esc(sourceLabels[source].split(' (')[0])+'</span> <small class="wf-source-sub">'+esc(sourceLabels[source].slice(sourceLabels[source].indexOf(' (')+1))+'</small>':esc(source))+'</span></label>').join('')+'</div></fieldset>'}
 function checkRow(name,label,amount,description=''){return '<label class="wf-check-row"><input type="checkbox" name="'+name+'" value="1"><span class="wf-check-box">'+icon('check')+'</span><span class="wf-check-label">'+esc(label)+(description?'<small class="wf-check-description">'+esc(description)+'</small>':'')+'</span><strong>+'+money(amount)+'</strong></label>'}
 function eventDateField(){
  return '<fieldset class="contact-field contact-date-field contact-date-eventDate"><legend class="sr-only">결혼식 일정 선택</legend><p class="contact-date-description">결혼식이 열리는 날짜를 알려 주세요</p><input type="hidden" name="eventDateMode" value="date"><input id="contact-eventDate" name="eventDate" type="hidden"><div class="wf-date-dropdowns"><label>년<select data-wf-date-part="year" aria-label="결혼식 연도"></select></label><label>월<select data-wf-date-part="month" aria-label="결혼식 월"></select></label><label>일<select data-wf-date-part="day" aria-label="결혼식 일"></select></label></div><p data-wf-event-label aria-live="polite" hidden></p><label class="wf-undecided"><input type="checkbox" name="eventDateUnknown">아직 미정이에요</label></fieldset>'+error('eventDate')
 }
 function bookingDateField(){
  return global.WistiaContact.dateField('bookingDate','녹음 날짜').replace('<legend>② 녹음 날짜</legend>','<legend class="sr-only">녹음 날짜 선택</legend>').replace('name="bookingDateMode" value="date"','name="bookingDateMode" value="date" checked').replace('value="unknown" data-contact-date-mode="bookingDate" checked','value="unknown" data-contact-date-mode="bookingDate"').replace('data-contact-date-panel="bookingDate" hidden','data-contact-date-panel="bookingDate"').replace('tabindex="-1" disabled data-calendar-value','tabindex="-1" data-calendar-value').replace('data-calendar="bookingDate" role="dialog"','data-calendar="bookingDate" data-calendar-immediate="true" role="group"').replace('aria-label="녹음 날짜 달력" hidden','aria-label="녹음 날짜 달력"').replace(/<button type="button" class="calendar-close"[\s\S]*?<\/button>/,'')
 }
 function render(key,benefits){
  const selected=global.WistiaPackages.packageFor(new URLSearchParams(global.location.search).get('package')).key
  const sections=[
   '<h3 class="package-heading">패키지로 예약하면 더 저렴해요!</h3>'+global.WistiaPackages.cards(selected,'wizard')+'<fieldset class="wf-people"><legend>녹음 인원</legend>'+pair('people',['<b>1인</b><small>1인·1곡 기준</small>','<b>듀엣으로 변경</b><small>2인·1곡 · 녹음 시간 유지</small><strong>+30,000원</strong>'],key==='duo'?'1':'0','people')+'</fieldset>'+discoveryField(),
   eventDateField(),
   '<div class="wf-schedule"><div data-wf-date-view>'+bookingDateField()+'</div><div class="wf-time-view" data-wf-time-view hidden><div class="wf-schedule-heading"><p data-wf-selected-date tabindex="-1" aria-live="polite"></p><button type="button" data-wf-change-date>'+icon('calendar')+'날짜 다시 선택</button></div>'+global.WistiaContact.timeField().replace('role="radiogroup"','role="group"').replace('<legend>방문 희망 시간</legend>','<legend>시작 시간 <small data-wf-duration>1시간 진행</small></legend><p class="wf-recording-range" data-wf-recording-range aria-live="polite">시작 시간을 고르면 녹음 시간이 나와요</p>')+error('timeStart')+'</div>'+error('bookingDate')+'</div>',
   '<p class="wf-option-guide">필요한 옵션만 선택해 주세요</p><fieldset class="wf-option package-extra-options"><legend>추가 옵션</legend>'+global.WistiaPackages.options.map(o=>'<div data-wf-option="'+o.key+'">'+checkRow(o.key,o.label,o.price,o.detail)+'</div>').join('')+'</fieldset>'+global.WistiaPackages.discountsHtml()+'<label class="wf-check-row package-first-visit"><input type="checkbox" name="firstVisit" value="1"><span class="wf-check-box">'+icon('check')+'</span><span class="wf-check-label">첫 이용</span><strong>−10,000원</strong></label><p class="package-auto-discount-note">방문 요일·시간과 사전 예약 할인은 선택한 녹음 일정에 따라 자동 반영돼요</p><dl class="package-discount-result" data-wf-discounts aria-live="polite"></dl><fieldset class="wf-option package-paybacks"><legend>페이백 이벤트</legend><label class="wf-check-row"><input type="checkbox" name="paybackReaction" value="1"><span class="wf-check-box">'+icon('check')+'</span><span class="wf-check-label">본식 현장 영상 제공<small>얼굴 공개·공식 인스타 게시 동의</small></span><strong>30,000원 환급</strong></label><label class="wf-check-row"><input type="checkbox" name="paybackBlog" value="1"><span class="wf-check-box">'+icon('check')+'</span><span class="wf-check-label">네이버 블로그 리뷰<small>일 방문자 100명 이상, 위스티아 가이드대로</small></span><strong>30,000원 환급</strong></label><p>둘 다 참여하면 60,000원 환급<br>결제 때 차감하지 않고 조건 확인 후 카카오톡으로 환급 안내</p></fieldset>',
   '<label class="wf-field">특이사항 (선택)<textarea name="specialNotes" rows="4" maxlength="2000" placeholder="궁금한 사항이나 고민되는 부분을 편하게 적어 주세요"></textarea></label><dl data-wf-review></dl><p class="wf-payment">결제는 카카오톡에서 맞춤 상담 진행 후 진행돼요</p><p class="wf-copy-note">작성한 내용이 복사되면 카카오톡 채팅창에 붙여넣어 보내주세요</p><p class="wf-privacy">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다</p>'
  ]
  return '<section class="wistia-wizard"><h1>문의양식 작성</h1><p class="wf-draft-note" data-wf-draft-note>작성 내용은 이 브라우저에 3시간 동안 임시 저장돼요</p><form id="contactInquiryForm" data-wizard="true" data-booking-calendar-opened="true" novalidate><ol class="wf-progress" aria-label="문의 단계">'+steps.map((title,index)=>'<li data-wf-progress="'+index+'"><button type="button" data-wf-goto="'+index+'" aria-label="'+(index+1)+'단계 '+title+'"><span>'+(index+1)+'</span><small>'+title+'</small></button></li>').join('')+'</ol><p class="wf-step-label" aria-live="polite" data-wf-step-label></p>'+sections.map((body,index)=>'<section class="wf-step" data-wf-step="'+index+'"'+(index?' hidden':'')+'><h2 tabindex="-1">'+titles[index]+'</h2>'+body+'</section>').join('')+'<div class="wf-nav"><button type="button" data-wf-prev>이전</button><button type="button" data-wf-next>다음 단계</button><button type="submit" class="wf-submit" hidden>작성한 내용으로 카카오톡 문의하기</button></div><p data-wf-submit-status role="status" hidden></p></form></section>'
 }
 function values(form){const v=Object.fromEntries(new FormData(form));if(form.elements?.eventDateUnknown?.checked||v.eventDateUnknown)v.eventDateMode='unknown';return v}
 function quote(form){
  const v=values(form),result=global.WistiaPackages.quote(v)
  return {...result,v,options:result.options.map(o=>[o.label,o.price])}
 }
 const clock=value=>Number(value.slice(0,2))*60+Number(value.slice(3))
 const clockText=minute=>String(Math.floor(minute/60)).padStart(2,'0')+':'+String(minute%60).padStart(2,'0')
 function range(time,minutes=60){if(!time)return '미정';const start=clock(time);return clockText(start)+'~'+clockText(start+(typeof minutes==='number'?minutes:60))}
 function payableLabel(q){return q.v.people==='1'&&q.optionTotal===30000&&!q.discount?money(q.base)+' + 30,000원':money(q.total)}
 function rows(form){
  const q=quote(form),v=q.v,date=key=>v[key+'Mode']==='unknown'?'미정':v[key]?v[key]+' ('+['일','월','화','수','목','금','토'][new Date(v[key]+'T12:00:00Z').getUTCDay()]+')':'미정'
  return [['패키지',q.package.key+' | '+q.package.title],['인원',v.people==='1'?'듀엣(2인) · 1곡':'1인 · 1곡'],['녹음 소요 시간',q.minutes+'분'],['결혼식 날짜',date('eventDate')],['녹음 날짜',date('bookingDate')],['녹음 시간',range(v.timeStart,q.minutes)],['추가 옵션',q.options.map(o=>o[0]+' +'+money(o[1])).join('\n')||'없음'],['할인',q.discounts.map(d=>d.label+' −'+money(d.amount)).join('\n')||'없음'],['음원 전달',q.delivery],['페이백',q.paybacks.map(p=>p.label+' '+money(p.amount)+' 환급').join('\n')||'선택 안 함'],['처음 본 곳',v.discovery||'선택 안 함'],['총 금액',payableLabel(q)]]
 }
 function text(form){
  const q=quote(form),details=Object.fromEntries(rows(form)),date=value=>value
  const notes=String(q.v.specialNotes||'').trim().replace(/\r\n?/g,'\n').replace(/\n/g,'\n  ')
  return [
   '🎙️ 위스티아 | 신규 상담 신청','',
   '📅 녹음 예약','',
   '• 날짜 : '+date(details['녹음 날짜']),
   '• 시간 : '+details['녹음 시간'].replace('~',' ~ '),
   '• 패키지 : '+details['패키지'],
   '• 구성 : '+details['인원']+' · '+details['녹음 소요 시간'],
   '• 결혼식 : '+date(details['결혼식 날짜']),'',
   '🎵 추가 옵션','',
   ...(q.options.length?q.options.map(([label,amount])=>'• '+label+' : +'+money(amount)):['• 추가 옵션 : 없음']),
   '• 음원 전달 : '+q.delivery,'',
   '💰 결제 금액','',
   '• 기본 상품 : '+money(q.base),
   '• 추가 금액 : '+money(q.optionTotal),
   ...q.discounts.map(d=>'• '+d.label+' : −'+money(d.amount)),
   '• 총 결제 금액 : '+payableLabel(q),'',
   ...(q.paybacks.length?['💝 후기 페이백','',...q.paybacks.map(p=>'• '+p.label+' : '+money(p.amount)+' 환급'),'결제 시 미리 차감하지 않고, 참여 조건 확인 후 카카오톡으로 환급 안내','']:[]),
   '💬 고객 정보','',
   '• 유입 경로 : '+details['처음 본 곳'],
   '• 특이사항 : '+(notes||'없음'),'',
   '📌 결제 안내',
   '카카오톡 맞춤 상담 후 결제를 진행해요'
  ].join('\n')
 }
 function updateAmount(button,total,state){
  if(state.priceTarget===total)return
  state.priceTarget=total
  button.setAttribute('aria-label','다음 단계 · '+money(total))
  let amount=button.querySelector('[data-wf-amount]')
  if(!amount){button.innerHTML='다음 단계 · <span data-wf-amount aria-hidden="true"></span>';amount=button.querySelector('[data-wf-amount]')}
  if(state.priceFrame)global.cancelAnimationFrame?.(state.priceFrame)
  const from=Number.isFinite(state.priceShown)?state.priceShown:total
  const reduced=global.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if(from===total||reduced||!global.requestAnimationFrame){state.priceShown=total;amount.textContent=money(total);return}
  let began
  const tick=now=>{
   if(!amount.isConnected)return
   began??=now
   const progress=Math.min(1,(now-began)/380),eased=1-Math.pow(1-progress,3)
   state.priceShown=Math.round((from+(total-from)*eased)/100)*100
   amount.textContent=money(progress===1?total:state.priceShown)
   if(progress<1)state.priceFrame=global.requestAnimationFrame(tick)
   else{state.priceShown=total;state.priceFrame=0}
  }
  state.priceFrame=global.requestAnimationFrame(tick)
 }
 function update(form){
  const state=states.get(form);if(!state)return
  const q=quote(form)
  const durationLabel=form.querySelector('[data-wf-location-duration]')
  if(durationLabel)durationLabel.textContent=q.package.key+' · 1곡 · '+q.minutes+'분'
  form.querySelectorAll('.package-card').forEach(card=>card.classList.toggle('is-selected',!!card.querySelector('input:checked')))
  for(const key of ['tuning','detailMix']){
   const row=form.querySelector('[data-wf-option="'+key+'"]'),input=row.querySelector('input'),included=key==='tuning'?q.package.tuning:q.package.mixing
   input.disabled=included;if(included)input.checked=false
   row.classList.toggle('is-included',included)
   row.querySelector('strong').textContent=included?'패키지 포함':'+'+money(global.WistiaPackages.options.find(o=>o.key===key).price)
  }
  form.querySelector('[data-wf-discounts]').innerHTML=q.discounts.map(d=>'<div><dt>'+esc(d.label)+'</dt><dd>−'+money(d.amount)+'</dd></div>').join('')
  form.dataset.bookingMinutes=String(q.minutes)
  const next=form.querySelector('[data-wf-next]')
  if(q.v.people==='1'&&q.optionTotal===30000&&!q.discount){
   const label=payableLabel(q)
   state.priceTarget=q.base
   state.priceShown=q.base
   if(state.priceFrame){global.cancelAnimationFrame?.(state.priceFrame);state.priceFrame=0}
   next.setAttribute('aria-label','다음 단계 · '+label)
   let amount=next.querySelector('[data-wf-amount]')
   if(!amount){next.innerHTML='다음 단계 · <span data-wf-amount aria-hidden="true"></span>';amount=next.querySelector('[data-wf-amount]')}
   amount.textContent=label
  }else updateAmount(next,q.total,state)
  form.querySelector('[data-wf-review]').innerHTML=rows(form).map(([label,value])=>'<div'+(label==='총 금액'?' class="wf-final-total"':'')+'><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('')
  form.querySelectorAll('[data-wf-step]').forEach(section=>section.hidden=Number(section.dataset.wfStep)!==state.step)
  form.querySelectorAll('[data-wf-progress]').forEach(li=>{const index=Number(li.dataset.wfProgress),active=index===state.step,done=index<state.step;li.classList.toggle('is-current',active);li.classList.toggle('is-complete',done);const button=li.querySelector('button');button.querySelector('span').innerHTML=done?icon('check'):String(index+1);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')})
  form.querySelector('[data-wf-step-label]').textContent=(state.step+1)+' / 5단계'
  form.querySelector('[data-wf-prev]').disabled=false
  form.querySelector('[data-wf-prev]').title=state.step===0?'상품 상세페이지로 돌아가기':'이전 단계'
  form.querySelector('[data-wf-next]').hidden=state.step===4
  form.querySelector('[type="submit"]').hidden=state.step!==4
  const recording=form.querySelector('[data-wf-recording-range]');recording.textContent=q.v.timeStart?'녹음 시간 · '+range(q.v.timeStart,q.minutes):'시작 시간을 고르면 녹음 시간이 나와요';recording.classList.toggle('has-selection',!!q.v.timeStart)
  persistDraft(form)
  try{global.WistiaInquiryFunnel?.view(form)}catch{}
 }
 function persistDraft(form){
  const state=states.get(form);if(!state?.draftReady||!global.WistiaBookingDraft)return
  const fields={...values(form),bookingDate:form.querySelector('#contact-bookingDate').value,timeStart:form.querySelector('#contact-time').value}
  const wedding=Object.fromEntries(['year','month','day'].map(part=>[part,form.querySelector('[data-wf-date-part="'+part+'"]').value]))
  const saved=global.WistiaBookingDraft.save(state.draftKey,{fields,wedding,step:state.step,view:form.dataset.wfScheduleView})
  const note=form.closest('.wistia-wizard').querySelector('[data-wf-draft-note]')
  note.textContent=saved?'작성 내용은 이 브라우저에 3시간 동안 임시 저장돼요':'이 브라우저에서는 임시 저장이 제한되어 있어요'
 }
 function syncEventMode(form){
  const unknown=form.elements.eventDateUnknown.checked
  form.elements.eventDateMode.value=unknown?'unknown':'date'
  form.querySelectorAll('[data-wf-date-part]').forEach(select=>select.disabled=unknown)
  form.querySelector('.wf-date-dropdowns').classList.toggle('is-undecided',unknown)
  if(unknown)form.querySelector('[data-wf-event-label]').hidden=true;else syncEventDropdowns(form)
 }
 function restoreDraft(form,state,onPeople){
  const draft=global.WistiaBookingDraft?.read(state.draftKey);if(!draft)return
  const fields=draft.fields
  for(const name of ['package','people','discovery','tuning','detailMix','extraHour','lipsync','firstVisit','paybackBlog','paybackReaction','specialNotes']){
   form.querySelectorAll('[name="'+name+'"]').forEach(control=>{
    if(control.type==='radio')control.checked=control.value===fields[name]
    else if(control.type==='checkbox')control.checked=fields[name]==='1'
    else control.value=fields[name]
   })
  }
  for(const part of ['year','month','day']){form.querySelector('[data-wf-date-part="'+part+'"]').value=draft.wedding[part];syncEventDropdowns(form)}
  form.elements.eventDateUnknown.checked=fields.eventDateMode==='unknown';syncEventMode(form)
  const date=form.querySelector('#contact-bookingDate'),time=form.querySelector('#contact-time')
  date.value=global.WistiaContact.calendar.selectableDate(fields.bookingDate,'bookingDate')?fields.bookingDate:''
  time.value=date.value?fields.timeStart:''
  form.dataset.wfScheduleView=draft.view
  state.step=draft.step
  if(state.step>1&&form.elements.eventDateMode.value!=='unknown'&&!form.elements.eventDate.value)state.step=1
  if(state.step>2&&(!date.value||!time.value))state.step=2
  onPeople(fields.people==='1'?'duo':'solo')
 }
 function mark(form,key,message,number){
  const el=form.querySelector('[data-wf-error="'+key+'"]');el.textContent=message;el.hidden=!message
  form.elements[key]?.setAttribute?.('aria-invalid',String(!!message))
  if(message)try{global.WistiaInquiryFunnel?.validation(form,key,number)}catch{}
 }
 function validate(form,step){
  const v=values(form);let okay=true
  const check=(key,message)=>{mark(form,key,message,step+1);if(message)okay=false}
  if(step===1)check('eventDate',v.eventDateMode==='unknown'||global.WistiaContact.calendar.selectableDate(v.eventDate,'eventDate')?'':'결혼식 날짜를 골라주세요')
  if(step===2){
   const date=form.querySelector('#contact-bookingDate'),valid=v.bookingDateMode==='date'&&global.WistiaContact.calendar.selectableDate(v.bookingDate,'bookingDate')
   check('bookingDate',valid?(date.validationMessage||''):'녹음 날짜를 골라주세요')
   const time=form.querySelector('#contact-time')
   check('timeStart',valid&&(!v.timeStart||time.selectedOptions[0]?.disabled||form.dataset.scheduleState==='loading')?'시작 시간을 골라주세요':'')
   if(!okay)syncSchedule(form,valid?'time':'date')
  }
  return okay
 }
 function navigate(form,target){
  const state=states.get(form)
  if(target>state.step)for(let step=0;step<target;step++)if(!validate(form,step)){state.step=step;update(form);form.querySelector('[data-wf-step="'+step+'"] h2').focus();return}
  state.step=Math.max(0,Math.min(4,target));update(form);form.querySelector('[data-wf-step="'+state.step+'"] h2').focus()
 }
 function syncSchedule(form,view){
  const calendarView=form.querySelector('[data-wf-date-view]'),timeView=form.querySelector('[data-wf-time-view]')
  if(!calendarView||!timeView)return
  const date=form.querySelector('#contact-bookingDate'),known=!date.disabled&&global.WistiaContact.calendar.selectableDate(date.value,'bookingDate')
  form.dataset.wfScheduleView=known?(view||form.dataset.wfScheduleView||'time'):'date'
  const showTime=form.dataset.wfScheduleView==='time'
  calendarView.hidden=showTime;timeView.hidden=!showTime
  form.querySelector('[data-wf-selected-date]').textContent=known?global.WistiaContact.calendar.displayDate(date.value):''
 }
 function syncTimes(form){
  const list=form.querySelector('[data-calendar-times]'),time=form.querySelector('#contact-time'),date=form.querySelector('#contact-bookingDate');if(!list||!time||!date)return
  const known=!date.disabled&&!!date.value,loading=form.dataset.scheduleState==='loading',minutes=quote(form).minutes
  list.hidden=!known||loading;list.closest('[data-time-scroll-wrap]').hidden=!known||loading;time.closest('label').hidden=true;time.disabled=!known
  const hint=form.querySelector('[data-time-date-hint]');hint.hidden=known&&!loading;hint.textContent=known?'가능한 시간을 불러오고 있어요':'날짜를 먼저 골라 주시면 가능한 시간을 보여 드릴게요';form.querySelector('[data-time-help]').hidden=true
  form.querySelector('[data-wf-duration]').textContent=minutes+'분 진행'
  list.classList?.toggle('is-loading',loading);list.setAttribute?.('aria-busy',String(loading));list.innerHTML=[...time.options].filter(o=>o.value.endsWith(':00')).map(o=>loading?'<button type="button" data-wf-time="'+o.value+'" class="is-loading" disabled aria-pressed="false"><strong>'+o.value+'</strong></button>':'<button type="button" data-wf-time="'+o.value+'" aria-pressed="'+(!o.disabled&&time.value===o.value)+'"'+(o.disabled?' class="is-closed" disabled aria-label="'+o.value+' 마감"':'')+'><strong>'+o.value+'</strong>'+(o.disabled?'<small>마감</small>':'')+'</button>').join('')
  syncSchedule(form)
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
  const form=root.querySelector('[data-wizard]'),state={step:0,benefits:benefits||[],draftKey:values(form).people==='1'?'duo':'solo',draftReady:false};states.set(form,state)
  form.querySelector('[data-wf-step-label]').insertAdjacentHTML('beforebegin','<aside class="wf-location-bar" aria-label="녹음실 위치와 녹음 시간"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><div><strong>부천시청역 1번 출구 · 도보 약 300m</strong><small>경기도 부천시 석천로170번길 19, 2층</small></div><span data-wf-location-duration>1곡 · 1시간</span></aside>')
  syncEventDropdowns(form)
  restoreDraft(form,state,onPeople);state.draftReady=true
  const explicitPackage=new URLSearchParams(global.location.search).get('package')
  if(['A','B','C'].includes(explicitPackage))form.querySelectorAll('[name="package"]').forEach(input=>input.checked=input.value===explicitPackage)
  form.addEventListener('change',event=>{
   event.stopPropagation();const el=event.target
   if(el.hasAttribute('data-wf-date-part'))syncEventDropdowns(form)
   else if(el.name==='people'){const key=el.value==='1'?'duo':'solo';onPeople(key)}
   else if(['bookingDateMode','bookingDate','timeStart'].includes(el.name))global.WistiaContact.update(el)
   if(el.name==='eventDateUnknown'){syncEventMode(form);mark(form,'eventDate','')}
   if(el.name==='package'){const url=new URL(global.location.href);url.searchParams.set('package',el.value);global.history.replaceState(global.history.state,'',url.pathname+url.search)}
   if(el.name==='bookingDate'){mark(form,'bookingDate','');mark(form,'timeStart','');syncSchedule(form,'time');form.querySelector('[data-wf-selected-date]').focus({preventScroll:true})}
   if(el.name==='timeStart')mark(form,'timeStart','')
   update(form)
   if(['package','people','extraHour','eventDateUnknown'].includes(el.name)||el.hasAttribute('data-wf-date-part'))global.WistiaBooking.mount(form,bookingKey(form))
  })
  form.addEventListener('input',()=>update(form))
  form.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button)return
   if(button.disabled)return
   if(button.hasAttribute('data-wf-change-date')){syncSchedule(form,'date');persistDraft(form);const selected=form.querySelector('.calendar-day.is-selected:not(:disabled)')||form.querySelector('.calendar-day:not(:disabled)');selected?.focus({preventScroll:true});return}
   if(button.dataset.wfTime){form.querySelector('#contact-time').value=button.dataset.wfTime;form.querySelector('#contact-time').dispatchEvent(new Event('change',{bubbles:true}));syncTimes(form)}
   if(button.hasAttribute('data-wf-goto'))navigate(form,Number(button.dataset.wfGoto))
   if(button.hasAttribute('data-wf-next'))navigate(form,state.step+1)
   if(button.hasAttribute('data-wf-prev')){if(state.step===0)global.location.assign('/detail/'+(values(form).people==='1'?'duo':'solo'));else navigate(form,state.step-1)}
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
  Promise.resolve(global.WistiaBooking.mount(form,bookingKey(form))).then(()=>{
   if(!form.isConnected)return
   if(state.step>2&&!validate(form,2)){state.step=2;update(form)}
  });update(form)
 }
 function bookingKey(form){return 'ar-'+quote(form).minutes}
 global.WistiaWizard={currentStep:form=>(states.get(form)?.step??0)+1,render,mount,syncTimes,syncSchedule,text,quote,rows,range,bookingKey}
})(window)
