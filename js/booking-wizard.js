(function(global){
 'use strict'
 const titles=['인원 선택','결혼식 날짜','녹음 날짜·시작 시간·빠른 작업','곡과 추가 옵션','이벤트','마지막 확인 후 카톡 문의']
 const sources=['지인·가족 추천','웨딩플래너·웨딩홀 소개','네이버 검색','인스타그램·유튜브','블로그·카페 후기','기타']
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const icon=kind=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">'+(kind==='people'?'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-17a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v4"/>':kind==='calendar'?'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>':kind==='music'?'<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>':kind==='arrow'?'<path d="m9 5 7 7-7 7"/>':'<path d="m5 12 4 4L19 6"/>')+'</svg>'
 const error=key=>'<p class="wf-error" id="wf-error-'+key+'" data-wf-error="'+key+'" role="alert" hidden></p>'
 const states=new WeakMap()
 function pair(name,labels,selected='0',kind='check'){
  return '<div class="wf-pair">'+labels.map((label,index)=>'<label class="wf-choice"><input type="radio" name="'+name+'" value="'+index+'"'+(String(index)===selected?' checked':'')+'><span>'+icon(kind)+label+'</span></label>').join('')+'</div>'
 }
 function discoveryField(){return '<fieldset><legend>처음에 위스티아를 어디서 보고 오셨나요? (선택)</legend><div class="wf-sources">'+sources.map(source=>'<label class="wf-choice"><input type="radio" name="discovery" value="'+esc(source)+'"><span>'+esc(source)+'</span></label>').join('')+'</div></fieldset>'}
 function eventDateField(){
  return '<fieldset class="contact-field contact-date-field contact-date-eventDate"><legend>결혼식 날짜</legend><p class="contact-date-description">결혼식이 열리는 날짜를 알려 주세요</p><div class="contact-date-toggle"><label><input type="radio" name="eventDateMode" value="date" data-contact-date-mode="eventDate"><span>'+icon('calendar')+'날짜 선택</span></label><label><input type="radio" name="eventDateMode" value="unknown" data-contact-date-mode="eventDate"><span>'+icon('calendar')+'미정</span></label></div><div class="contact-date-picker" data-contact-date-panel="eventDate" hidden><input id="contact-eventDate" name="eventDate" type="hidden" disabled><div class="wf-date-dropdowns"><label>년<select data-wf-date-part="year" aria-label="결혼식 연도"><option value="">년</option></select></label><label>월<select data-wf-date-part="month" aria-label="결혼식 월"><option value="">월</option></select></label><label>일<select data-wf-date-part="day" aria-label="결혼식 일"><option value="">일</option></select></label></div><p data-wf-event-label aria-live="polite" hidden></p><small class="contact-input-error" hidden></small></div></fieldset>'+error('eventDate')
 }
 function bookingDateField(){
  return global.WistiaContact.dateField('bookingDate','녹음 날짜').replace(/ checked/g,'').replace('<legend>② 녹음 날짜</legend>','<legend>녹음 날짜 <small class="wf-required">필수 선택</small></legend>').replace('data-calendar-trigger="bookingDate"','role="button" tabindex="0" aria-label="녹음 날짜 선택" data-calendar-trigger="bookingDate"').replace('<span>날짜 선택</span>','<span>날짜를 선택해 주세요'+icon('arrow')+'</span>').replace('<label><input type="radio" name="bookingDateMode"','<label hidden><input type="radio" name="bookingDateMode"')+error('bookingDate')
 }
 function render(key,benefits){
  const sections=[
   pair('people',['<b>SOLO(1인)</b><small>1곡 기준·1시간</small><strong>12만원</strong>','<b>DUET(2인)</b><small>1곡 기준·2시간</small><strong>16만원</strong>'],key==='duo'?'1':'0','people')+discoveryField(),
   eventDateField(),
   bookingDateField()+global.WistiaContact.timeField().replace('role="radiogroup"','role="group"').replace('<legend>방문 희망 시간</legend>','<legend>시작 시간 <small data-wf-duration>1시간 진행</small></legend><p class="wf-operating" data-wf-operating hidden></p>')+error('timeStart')+'<fieldset class="wf-rush" data-wf-rush hidden><legend>빠른 작업이 필요하시면 선택해 주세요</legend><label class="wf-choice"><input type="checkbox" name="rush" value="1"><span>'+icon('check')+'3일 이내 받기 +30,000원</span></label><p>제작 일정과 자료 준비 상태에 따라 상담 후 확정돼요</p></fieldset>',
   '<details class="wf-song"><summary>'+icon('music')+'곡 정보와 가사 <span>입력하기</span></summary><label>곡 제목·가수 (선택)<input name="song" maxlength="200" autocomplete="off"></label><label>곡 링크·MR 정보 (선택)<input name="songLink" maxlength="1000" autocomplete="off"></label><label>가사 (선택)<textarea name="lyrics" rows="6" maxlength="10000"></textarea></label></details><fieldset><legend>1절 녹음 추가 +60,000원</legend><p class="wf-option-description">신부·신랑 입장곡처럼 다른 곡을 1절만 더 녹음할 수 있어요. 녹음·튠·믹스를 각각 30분씩 진행해요.</p>'+pair('extraVerse',['추가 안 함','1절 녹음 추가'],'0','music')+'</fieldset><fieldset><legend>가사 영상 추가 +40,000원</legend>'+pair('lyricVideo',['추가 안 함','가사 영상 추가'],'0','music')+'<img class="wf-lyric-example" src="/assets/img/song-options/lyric-video-v2.webp" width="1600" height="900" alt="두 사람의 사진과 노래 가사가 함께 나오는 가사 영상 예시" loading="lazy"></fieldset>',
   '<details class="wf-benefits" open><summary>후기 페이백 (선택)</summary><p>참여 조건 확인 후 지급되며 결제 시 미리 차감되지 않아요</p>'+benefits.map(item=>'<label class="wf-benefit"><input type="checkbox" name="payback" value="'+esc(item.key)+'"><span><b>'+esc(item.label)+' · '+money(item.discount)+'</b><small>'+esc(item.detail)+'</small></span></label>').join('')+'</details>',
   '<label class="wf-field">특이사항 (선택)<textarea name="specialNotes" rows="4" maxlength="2000"></textarea></label><dl data-wf-review></dl><p class="wf-payment">결제는 카카오톡에서 맞춤 상담 진행 후 진행돼요</p><p class="wf-copy-note">작성한 내용이 복사되면 카카오톡 채팅창에 붙여넣어 보내주세요</p><p class="wf-privacy">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다 <a href="/privacy">개인정보처리방침</a></p>'
  ]
  return '<section class="wistia-wizard"><h1>문의양식 작성</h1><form id="contactInquiryForm" data-wizard="true" novalidate><ol class="wf-progress" aria-label="문의 단계">'+titles.map((title,index)=>'<li data-wf-progress="'+index+'"><button type="button" data-wf-goto="'+index+'" aria-label="'+(index+1)+'단계 '+title+'"><span>'+(index+1)+'</span><small>'+title+'</small></button></li>').join('')+'</ol><p class="wf-step-label" aria-live="polite" data-wf-step-label></p>'+sections.map((body,index)=>'<section class="wf-step" data-wf-step="'+index+'"'+(index?' hidden':'')+'><h2 tabindex="-1">'+titles[index]+'</h2>'+body+'</section>').join('')+'<div class="wf-nav"><button type="button" data-wf-prev>이전</button><button type="button" data-wf-next>다음 단계</button><button type="submit" class="wf-submit" hidden>작성한 내용으로 카카오톡 문의하기</button></div><p data-wf-submit-status role="status" hidden></p></form></section>'
 }
 function values(form){return Object.fromEntries(new FormData(form))}
 function quote(form){
  const v=values(form),state=states.get(form),base=v.people==='1'?160000:120000
  const options=[...(v.rush&&v.timeStart?[['3일 이내 받기',30000]]:[]),...(v.extraVerse==='1'?[['1절 녹음 추가',60000]]:[]),...(v.lyricVideo==='1'?[['가사 영상 추가',40000]]:[])]
  const chosen=new FormData(form).getAll('payback'),paybacks=(state?.benefits||[]).filter(b=>chosen.includes(b.key)),total=base+options.reduce((s,o)=>s+o[1],0)
  return {v,base,options,total,paybacks,payback:paybacks.reduce((s,b)=>s+b.discount,0)}
 }
 const clock=value=>Number(value.slice(0,2))*60+Number(value.slice(3))
 const clockText=minute=>Math.floor(minute/60)+'시'+(minute%60?minute%60+'분':'')
 function range(time,people){if(!time)return '미정';const start=clock(time);return clockText(start)+'~'+clockText(start+(people==='1'?120:60))}
 function rows(form){
  const q=quote(form),v=q.v,date=key=>v[key+'Mode']==='unknown'?'미정':global.WistiaContact.calendar.displayDate(v[key])
  return [['인원',v.people==='1'?'DUET(2인) · 1곡 · 2시간':'SOLO(1인) · 1곡 · 1시간'],['결혼식 날짜',date('eventDate')],['녹음 날짜',date('bookingDate')],['시작 시간',range(v.timeStart,v.people)],['추가 옵션',q.options.map(o=>o[0]+' +'+money(o[1])).join('\n')||'없음'],['곡 제목·가수',v.song||'미입력'],['곡 링크·MR 정보',v.songLink||'미입력'],['가사',v.lyrics||'미입력'],['처음 본 곳',v.discovery||'선택 안 함'],['기본 금액',money(q.base)],['총 금액',money(q.total)],['후기 페이백',q.paybacks.map(b=>b.label+' '+money(b.discount)).join('\n')||'없음'],['페이백 합계',money(q.payback)],...(q.payback?[['페이백 완료 후 혜택가',money(q.total-q.payback)]]:[])]
 }
 function text(form){const notes=String(values(form).specialNotes||'').trim();return ['[위스티아 상담 요청]','상품 : AR 축가 사전녹음','',...rows(form).map(([label,value])=>label+' : '+value),...(notes?['','특이사항 : '+notes]:[]),'','후기 페이백은 참여 조건 확인 후 지급되며 결제 시 미리 차감되지 않아요','예약 가능 여부와 빠른 작업은 카카오톡 상담에서 최종 확정돼요'].join('\n')}
 function update(form){
  const state=states.get(form);if(!state)return
  const q=quote(form)
  form.querySelector('[data-wf-next]').textContent='다음 단계 · '+money(q.total)
  form.querySelector('[data-wf-review]').innerHTML=rows(form).map(([label,value])=>'<div'+(label==='페이백 완료 후 혜택가'?' class="wf-benefit-price"':'')+'><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('')
  form.querySelectorAll('[data-wf-step]').forEach(section=>section.hidden=Number(section.dataset.wfStep)!==state.step)
  form.querySelectorAll('[data-wf-progress]').forEach(li=>{const active=Number(li.dataset.wfProgress)===state.step;li.classList.toggle('is-current',active);const button=li.querySelector('button');if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')})
  form.querySelector('[data-wf-step-label]').textContent=(state.step+1)+' / 6단계'
  form.querySelector('[data-wf-prev]').disabled=state.step===0
  form.querySelector('[data-wf-next]').hidden=state.step===5
  form.querySelector('[type="submit"]').hidden=state.step!==5
  const trigger=form.querySelector('[data-calendar-trigger="bookingDate"]'),value=form.querySelector('#contact-bookingDate').value
  trigger.querySelector('span').innerHTML=(value?global.WistiaContact.calendar.displayDate(value).replace(/^\d+년 /,''):'날짜를 선택해 주세요')+icon('arrow')
  trigger.setAttribute('aria-label',value?global.WistiaContact.calendar.displayDate(value).replace(/^\d+년 /,'')+' 녹음 날짜 변경':'녹음 날짜 선택')
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
   if(!form.querySelector('#calendar-bookingDate').hidden&&valid)check('bookingDate','고른 녹음 날짜를 확인해 주세요')
  }
  return okay
 }
 function navigate(form,target){
  const state=states.get(form)
  if(target>state.step)for(let step=0;step<target;step++)if(!validate(form,step)){state.step=step;update(form);form.querySelector('[data-wf-step="'+step+'"] h2').focus();return}
  state.step=Math.max(0,Math.min(5,target));update(form);form.querySelector('[data-wf-step="'+state.step+'"] h2').focus()
 }
 function syncTimes(form){
  const list=form.querySelector('[data-calendar-times]'),time=form.querySelector('#contact-time'),date=form.querySelector('#contact-bookingDate');if(!list||!time||!date)return
  const known=!date.disabled&&!!date.value,minutes=global.WistiaBooking.duration(global.WistiaBooking.calendarKey())
  list.hidden=!known;list.closest('[data-time-scroll-wrap]').hidden=!known;time.closest('label').hidden=true;time.disabled=!known
  form.querySelector('[data-time-date-hint]').hidden=known;form.querySelector('[data-time-help]').hidden=true
  form.querySelector('[data-wf-duration]').textContent=minutes/60+'시간 진행'
  const operating=form.querySelector('[data-wf-operating]');operating.hidden=!known;operating.textContent=known&&new Date(date.value+'T12:00:00Z').getUTCDay()===0?'일요일 · 13:00~18:00 전 시작':'운영 시간 · 13:00~23:00'
  list.innerHTML=[...time.options].filter(o=>o.value).map(o=>'<button type="button" data-wf-time="'+o.value+'" aria-pressed="'+(time.value===o.value)+'"'+(o.disabled?' disabled':'')+'><strong>'+o.value+'</strong>'+(o.disabled?'<em>예약 불가</em>':'')+'</button>').join('')
  const rush=form.querySelector('[data-wf-rush]'),invalid=!known||!time.value||(form.dataset.scheduleState!=='loading'&&!!time.selectedOptions[0]?.disabled)
  rush.hidden=invalid;if(invalid)form.querySelector('[name="rush"]').checked=false
  update(form)
 }
 function syncEventDropdowns(form){
  const today=global.WistiaContact.calendar.today(),minYear=Number(today.slice(0,4)),year=form.querySelector('[data-wf-date-part="year"]'),month=form.querySelector('[data-wf-date-part="month"]'),day=form.querySelector('[data-wf-date-part="day"]')
  const previous={year:year.value,month:month.value,day:day.value}
  year.innerHTML='<option value="">년</option>'+Array.from({length:4},(_,i)=>'<option value="'+(minYear+i)+'">'+(minYear+i)+'년</option>').join('');year.value=previous.year
  month.innerHTML='<option value="">월</option>'+Array.from({length:12},(_,i)=>{const m=i+1,disabled=!year.value||(Number(year.value)===minYear&&m<Number(today.slice(5,7)));return '<option value="'+m+'"'+(disabled?' disabled':'')+'>'+m+'월</option>'}).join('');month.value=previous.month
  if(month.selectedOptions[0]?.disabled)month.value=''
  const days=year.value&&month.value?new Date(Date.UTC(Number(year.value),Number(month.value),0)).getUTCDate():0
  day.innerHTML='<option value="">일</option>'+Array.from({length:days},(_,i)=>{const d=i+1,value=year.value+'-'+month.value.padStart(2,'0')+'-'+String(d).padStart(2,'0');return '<option value="'+d+'"'+(value<today?' disabled':'')+'>'+d+'일</option>'}).join('');day.value=previous.day
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
   else if(['eventDateMode','bookingDateMode','eventDate','bookingDate','timeStart'].includes(el.name))global.WistiaContact.update(el)
   if(el.name==='eventDateMode'){if(el.value==='unknown')form.querySelector('[data-wf-event-label]').hidden=true;else syncEventDropdowns(form);mark(form,'eventDate','')}
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
   if(state.step!==5||form.dataset.copyPending)return
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
 global.WistiaWizard={render,mount,syncTimes,text,quote}
})(window)
