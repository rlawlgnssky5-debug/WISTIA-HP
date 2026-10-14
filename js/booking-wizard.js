(function(global){
 'use strict'
 const titles=['인원 선택','결혼식 날짜','녹음 날짜·시작 시간·빠른 작업','곡과 추가 옵션','연락처·유입 경로·특이사항','마지막 확인 후 카톡 문의']
 const sources=['지인·가족 추천','웨딩플래너·웨딩홀 소개','네이버 검색','인스타그램·유튜브','블로그·카페 후기','기타']
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const icon=kind=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">'+(kind==='people'?'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-17a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v4"/>':kind==='calendar'?'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>':kind==='music'?'<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>':'<path d="m5 12 4 4L19 6"/>')+'</svg>'
 const error=key=>'<p class="wf-error" id="wf-error-'+key+'" data-wf-error="'+key+'" role="alert" hidden></p>'
 function pair(name,labels,selected='0',kind='check'){
  return '<div class="wf-pair">'+labels.map((label,index)=>'<label class="wf-choice"><input type="radio" name="'+name+'" value="'+index+'"'+(String(index)===selected?' checked':'')+'><span>'+icon(kind)+label+'</span></label>').join('')+'</div>'
 }
 function dateField(key,label){
  return global.WistiaContact.dateField(key,label).replace(/ checked/g,'').replace(/<legend>[①②] /,'<legend>').replace('<span>날짜 선택</span>','<span>'+icon('calendar')+'날짜 선택</span>').replace('<span>미정</span>','<span>'+icon('calendar')+'미정</span>')+error(key)
 }
 function render(key,benefits){
  const sections=[
   pair('people',['<b>SOLO(1인)</b><small>1곡 기준·1시간</small><strong>12만원</strong>','<b>DUET(2인)</b><small>1곡 기준·2시간</small><strong>16만원</strong>'],key==='duo'?'1':'0','people'),
   dateField('eventDate','결혼식 날짜'),
   dateField('bookingDate','녹음 날짜')+global.WistiaContact.timeField().replace('role="radiogroup"','role="group"')+error('timeStart')+'<fieldset class="wf-rush" data-wf-rush hidden><legend>빠른 작업이 필요하시면 선택해 주세요</legend><label class="wf-choice"><input type="checkbox" name="rush" value="1"><span>'+icon('check')+'3일 이내 받기 +30,000원</span></label><p>제작 일정과 자료 준비 상태에 따라 상담 후 확정돼요</p></fieldset>',
   '<details class="wf-song"><summary>'+icon('music')+'곡 정보와 가사 <span>입력하기</span></summary><label>곡 제목·가수 (선택)<input name="song" maxlength="200" autocomplete="off"></label><label>곡 링크·MR 정보 (선택)<input name="songLink" maxlength="1000" autocomplete="off"></label><label>가사 (선택)<textarea name="lyrics" rows="6" maxlength="10000"></textarea></label></details><fieldset><legend>1절 녹음 추가 +60,000원</legend>'+pair('extraVerse',['추가 안 함','1절 녹음 추가'],'0','music')+'</fieldset><fieldset><legend>가사 영상 추가 +40,000원</legend>'+pair('lyricVideo',['추가 안 함','가사 영상 추가'],'0','music')+'<img class="wf-lyric-example" src="/assets/img/song-options/lyric-video-v2.webp" width="1600" height="900" alt="두 사람의 사진과 노래 가사가 함께 나오는 가사 영상 예시" loading="lazy"></fieldset><details class="wf-benefits"><summary>후기 페이백 (선택)</summary><p>참여 조건 확인 후 지급되며 결제 시 미리 차감되지 않아요</p>'+benefits.map(item=>'<label class="wf-benefit"><input type="checkbox" name="payback" value="'+esc(item.key)+'"><span><b>'+esc(item.label)+' · '+money(item.discount)+'</b><small>'+esc(item.detail)+'</small></span></label>').join('')+'</details>',
   '<label class="wf-field">연락처<input type="tel" name="phone" autocomplete="tel" maxlength="30" placeholder="010-0000-0000" aria-describedby="wf-error-phone"></label>'+error('phone')+'<fieldset><legend>처음에 위스티아를 어디서 보고 오셨나요? (선택)</legend><div class="wf-sources">'+sources.map(source=>'<label class="wf-choice"><input type="radio" name="discovery" value="'+esc(source)+'"><span>'+esc(source)+'</span></label>').join('')+'</div></fieldset><label class="wf-field">특이사항이나 궁금한 점 (선택)<textarea name="specialNotes" rows="4" maxlength="2000"></textarea></label>',
   '<dl data-wf-review></dl><p class="wf-payment">결제는 카카오톡에서 맞춤 상담 진행 후 진행돼요</p><p class="wf-copy-note">작성한 내용이 복사되면 카카오톡 채팅창에 붙여넣어 보내주세요</p><p class="wf-privacy">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다 <a href="/privacy">개인정보처리방침</a></p>'
  ]
  return '<section class="wistia-wizard"><h1>문의양식 작성</h1><form id="contactInquiryForm" data-wizard="true" novalidate><ol class="wf-progress" aria-label="문의 단계">'+titles.map((title,index)=>'<li data-wf-progress="'+index+'"><span>'+(index+1)+'</span><small>'+title+'</small></li>').join('')+'</ol><p class="wf-step-label" aria-live="polite" data-wf-step-label></p>'+sections.map((body,index)=>'<section class="wf-step" data-wf-step="'+index+'"'+(index?' hidden':'')+'><h2 tabindex="-1">'+titles[index]+'</h2>'+body+'</section>').join('')+'<p class="wf-total">총 금액 <strong data-wf-total></strong></p><div class="wf-nav"><button type="button" data-wf-prev>이전</button><button type="button" data-wf-next>다음 단계</button><button type="submit" class="wf-submit" hidden>작성한 내용으로 카카오톡 문의하기</button></div><p data-wf-submit-status role="status" hidden></p></form></section>'
 }
 const states=new WeakMap()
 function values(form){return Object.fromEntries(new FormData(form))}
 function quote(form){
  const v=values(form),state=states.get(form),base=v.people==='1'?160000:120000
  const options=[...(v.rush&&v.timeStart?[['3일 이내 받기',30000]]:[]),...(v.extraVerse==='1'?[['1절 녹음 추가',60000]]:[]),...(v.lyricVideo==='1'?[['가사 영상 추가',40000]]:[])]
  const chosen=new FormData(form).getAll('payback'),paybacks=(state?.benefits||[]).filter(b=>chosen.includes(b.key)),total=base+options.reduce((s,o)=>s+o[1],0)
  return {v,base,options,total,paybacks,payback:paybacks.reduce((s,b)=>s+b.discount,0)}
 }
 const clock=value=>{const minute=Number(value.slice(0,2))*60+Number(value.slice(3));return minute}
 const clockText=minute=>Math.floor(minute/60)+'시'+(minute%60?minute%60+'분':'')
 function range(time,people){if(!time)return '미정';const start=clock(time);return clockText(start)+'~'+clockText(start+(people==='1'?120:60))}
 function rows(form){
  const q=quote(form),v=q.v,date=key=>v[key+'Mode']==='unknown'?'미정':global.WistiaContact.calendar.displayDate(v[key])
  return [['인원',v.people==='1'?'DUET(2인) · 1곡 · 2시간':'SOLO(1인) · 1곡 · 1시간'],['결혼식 날짜',date('eventDate')],['녹음 날짜',date('bookingDate')],['시작 시간',range(v.timeStart,v.people)],['추가 옵션',q.options.map(o=>o[0]+' +'+money(o[1])).join('\n')||'없음'],['곡 제목·가수',v.song||'미입력'],['곡 링크·MR 정보',v.songLink||'미입력'],['가사',v.lyrics||'미입력'],['연락처',v.phone||''],['처음 본 곳',v.discovery||'선택 안 함'],['특이사항',v.specialNotes||'없음'],['기본 금액',money(q.base)],['총 금액',money(q.total)],['후기 페이백',q.paybacks.map(b=>b.label+' '+money(b.discount)).join('\n')||'없음'],['페이백 합계',money(q.payback)],...(q.payback?[['페이백 완료 후 혜택가',money(q.total-q.payback)]]:[])]
 }
 function text(form){return ['[위스티아 상담 요청]','상품 : AR 축가 사전녹음','',...rows(form).map(([label,value])=>label+' : '+value),'','후기 페이백은 참여 조건 확인 후 지급되며 결제 시 미리 차감되지 않아요','예약 가능 여부와 빠른 작업은 카카오톡 상담에서 최종 확정돼요'].join('\n')}
 function update(form){
  const state=states.get(form);if(!state)return
  const q=quote(form)
  form.querySelector('[data-wf-total]').textContent=money(q.total)
  form.querySelector('[data-wf-review]').innerHTML=rows(form).map(([label,value])=>'<div'+(label==='페이백 완료 후 혜택가'?' class="wf-benefit-price"':'')+'><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('')
  form.querySelectorAll('[data-wf-step]').forEach(section=>section.hidden=Number(section.dataset.wfStep)!==state.step)
  form.querySelectorAll('[data-wf-progress]').forEach(li=>{const active=Number(li.dataset.wfProgress)===state.step;li.classList.toggle('is-current',active);if(active)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')})
  form.querySelector('[data-wf-step-label]').textContent=(state.step+1)+' / 6단계'
  form.querySelector('[data-wf-prev]').disabled=state.step===0
  form.querySelector('[data-wf-next]').hidden=state.step===5
  form.querySelector('[type="submit"]').hidden=state.step!==5
 }
 function mark(form,key,message){
  const el=form.querySelector('[data-wf-error="'+key+'"]');el.textContent=message;el.hidden=!message
  const control=form.elements[key];if(control instanceof RadioNodeList){for(const radio of control)radio.setAttribute('aria-invalid',String(!!message))}else control?.setAttribute('aria-invalid',String(!!message))
 }
 function validate(form,step){
  const v=values(form);let okay=true
  const check=(key,message)=>{mark(form,key,message);if(message)okay=false}
  if(step===1)check('eventDate',v.eventDateMode==='unknown'||global.WistiaContact.calendar.selectableDate(v.eventDate,'eventDate')?'':'결혼식 날짜를 골라주세요')
  if(step===2){
   const known=v.bookingDateMode==='date',valid=known&&global.WistiaContact.calendar.selectableDate(v.bookingDate,'bookingDate')
   check('bookingDate',v.bookingDateMode==='unknown'||valid?'':'녹음 날짜를 골라주세요')
   const time=form.querySelector('#contact-time')
   check('timeStart',known&&(!v.timeStart||time.selectedOptions[0]?.disabled||form.dataset.scheduleState==='loading')?'시작 시간을 골라주세요':'')
   if(valid&&form.querySelector('#contact-bookingDate').validationMessage)check('bookingDate',form.querySelector('#contact-bookingDate').validationMessage)
  }
  if(step===4)check('phone',/^0\d{8,10}$/.test((v.phone||'').replace(/[\s()-]/g,''))?'':'연락처를 정확하게 입력해 주세요')
  return okay
 }
 function syncTimes(form){
  const list=form.querySelector('[data-calendar-times]'),time=form.querySelector('#contact-time'),date=form.querySelector('#contact-bookingDate');if(!list||!time||!date)return
  const known=!date.disabled&&!!date.value,minutes=global.WistiaBooking.duration(global.WistiaBooking.calendarKey())
  list.hidden=!known;list.closest('[data-time-scroll-wrap]').hidden=!known;time.closest('label').hidden=true;time.disabled=!known
  form.querySelector('[data-time-date-hint]').hidden=known;form.querySelector('[data-time-help]').hidden=true
  list.innerHTML=[...time.options].filter(o=>o.value).map(o=>{const start=clock(o.value);return '<button type="button" class="'+(start%60?'has-half':'')+'" data-wf-time="'+o.value+'" aria-pressed="'+(time.value===o.value)+'"'+(o.disabled?' disabled':'')+'><small>'+clockText(start)+'</small><strong>'+clockText(start)+'~'+clockText(start+minutes)+'</strong>'+(o.disabled?'<em>예약 불가</em>':'')+'</button>'}).join('')
  const rush=form.querySelector('[data-wf-rush]'),invalid=!known||!time.value||(form.dataset.scheduleState!=='loading'&&!!time.selectedOptions[0]?.disabled)
  rush.hidden=invalid
  if(invalid)form.querySelector('[name="rush"]').checked=false
  update(form)
 }
 function mount(root,{benefits,onPeople,onSubmit}){
  const form=root.querySelector('[data-wizard]')
  // Benefit conditions come directly from the existing product data at render time.
  const state={step:0,benefits:benefits||[]};states.set(form,state)
  form.addEventListener('change',event=>{
   event.stopPropagation();const el=event.target
   if(el.name==='people'){const key=el.value==='1'?'duo':'solo';onPeople(key);global.WistiaBooking.mount(form,key)}
   else if(['eventDateMode','bookingDateMode','eventDate','bookingDate','timeStart'].includes(el.name))global.WistiaContact.update(el)
   if(el.name==='phone')mark(form,'phone','')
   if(el.name==='eventDate'||el.name==='eventDateMode')mark(form,'eventDate','')
   if(el.name==='bookingDate'||el.name==='bookingDateMode')mark(form,'bookingDate','')
   if(el.name==='timeStart')mark(form,'timeStart','')
   update(form)
  })
  form.addEventListener('input',()=>update(form))
  form.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button)return
   if(button.dataset.wfTime){form.querySelector('#contact-time').value=button.dataset.wfTime;form.querySelector('#contact-time').dispatchEvent(new Event('change',{bubbles:true}));syncTimes(form)}
   if(button.hasAttribute('data-wf-next')){if(!validate(form,state.step))return;state.step++;update(form);form.querySelector('[data-wf-step="'+state.step+'"] h2').focus()}
   if(button.hasAttribute('data-wf-prev')){state.step=Math.max(0,state.step-1);update(form);form.querySelector('[data-wf-step="'+state.step+'"] h2').focus()}
  })
  form.addEventListener('submit',async event=>{
   event.preventDefault();event.stopPropagation()
   if(state.step!==5||form.dataset.copyPending)return
   const button=form.querySelector('[type="submit"]');form.dataset.copyPending='true';button.disabled=true
   try{
    if(values(form).bookingDateMode==='date')await global.WistiaBooking.refresh()
    if(!form.isConnected)return
    for(const step of [1,2,4])if(!validate(form,step)){state.step=step;update(form);return}
    await onSubmit(text(form))
   }finally{delete form.dataset.copyPending;button.disabled=false}
  })
  global.WistiaBooking.mount(form,values(form).people==='1'?'duo':'solo');update(form)
 }
 global.WistiaWizard={render,mount,syncTimes,text,quote}
})(window)
