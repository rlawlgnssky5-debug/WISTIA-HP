(function(global){
 'use strict'
 const recording=global.WistiaRecording
 const titles=['내 축가 녹음 구성','녹음 날짜와 시작 시간','마지막 확인 후 카톡 문의']
 const steps=['구성','날짜·시간','확인']
 const LAST=steps.length-1,states=new WeakMap(),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const icon=kind=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">'+(kind==='calendar'?'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>':kind==='people'?'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-17a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v4"/>':'<path d="m5 12 4 4L19 6"/>')+'</svg>'
 const error=key=>'<p class="wf-error" id="wf-error-'+key+'" data-wf-error="'+key+'" role="alert" hidden></p>'
 function discountDates(){const today=global.WistiaPackages.today(),format=date=>Number(date.slice(5,7))+'월 '+Number(date.slice(8,10))+'일';return '<div class="wf-earlybird-legend" aria-label="녹음일 사전 예약 할인"><p class="earlybird-one"><strong>'+format(global.WistiaPackages.addMonths(today,1))+'부터</strong><span>10,000원 할인</span></p><small>녹음 날짜 기준</small></div>'}
 function bookingDateField(){return global.WistiaContact.dateField('bookingDate','녹음 날짜').replace('<legend>② 녹음 날짜</legend>','<legend class="sr-only">녹음 날짜 선택</legend>').replace('name="bookingDateMode" value="date"','name="bookingDateMode" value="date" checked').replace('value="unknown" data-contact-date-mode="bookingDate" checked','value="unknown" data-contact-date-mode="bookingDate"').replace('data-contact-date-panel="bookingDate" hidden','data-contact-date-panel="bookingDate"').replace('tabindex="-1" disabled data-calendar-value','tabindex="-1" data-calendar-value').replace('data-calendar="bookingDate" role="dialog"','data-calendar="bookingDate" data-calendar-immediate="true" role="group"').replace('aria-label="녹음 날짜 달력" hidden','aria-label="녹음 날짜 달력"').replace(/<button type="button" class="calendar-close"[\s\S]*?<\/button>/,'')}
 function render(key){
  const selected=recording.selection(new URLSearchParams(global.location.search),key==='duo')
  const sections=[
   recording.editor(selected)+'<div data-rc-summary></div>',
   '<div class="wf-schedule" data-wf-date-view>'+discountDates()+bookingDateField()+'<p class="wf-discount-banner" data-wf-advance-note aria-live="polite" hidden></p>'+error('bookingDate')+'<div class="wf-schedule wf-time-view" data-wf-time-view><div class="wf-schedule-heading"><p data-wf-selected-date tabindex="-1"></p><button type="button" data-wf-change-date>'+icon('calendar')+'날짜 다시 고르기</button></div>'+global.WistiaContact.timeField().replace('role="radiogroup"','role="group"').replace('<legend>방문 희망 시간</legend>','<legend>시작 시간 <small data-wf-duration>50분 진행</small></legend><p class="wf-recording-range" data-wf-recording-range aria-live="polite"></p>')+error('timeStart')+'</div></div>',
   '<label class="wf-field wf-notes-field">특이사항 (선택)<textarea name="specialNotes" rows="3" maxlength="2000" placeholder="궁금한 사항이나 고민되는 부분을&#10;편하게 적어 주세요"></textarea></label><div class="wf-review" data-wf-review></div><p class="wf-payment">결제는 카카오톡에서 맞춤 상담 진행 후 진행돼요</p><p class="wf-copy-note">작성한 내용이 복사되면 카카오톡 채팅창에 붙여넣어 보내주세요</p><p class="wf-privacy">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다</p>'
  ]
  return '<section class="wistia-wizard"><h1>문의양식 작성</h1><form id="contactInquiryForm" data-wizard="true" data-step-total="'+steps.length+'" data-booking-calendar-opened="true" novalidate><p class="wf-step-label sr-only" data-wf-step-label aria-live="polite"></p><ol class="wf-progress wf-progress-three" aria-label="문의 단계" data-wf-progress-list>'+steps.map((title,i)=>'<li data-wf-progress="'+i+'"><button type="button" data-wf-goto="'+i+'" aria-label="'+(i+1)+'단계 '+title+'"><span>'+(i+1)+'</span><small>'+title+'</small></button></li>').join('')+'</ol>'+sections.map((body,i)=>'<section class="wf-step" data-wf-step="'+i+'"'+(i?' hidden':'')+'>'+('<h2 tabindex="-1"'+(i===0?' class="rc-step-title"':'')+'>'+titles[i]+'</h2>')+body+'</section>').join('')+'<div class="wf-nav"><p data-wf-next-hint aria-live="polite" hidden>다음단계 눌러주세요!</p><button type="button" data-wf-prev>이전</button><button type="button" data-wf-next>다음 단계</button><button type="submit" class="wf-submit" hidden>작성한 내용으로 카카오톡 문의하기</button></div><p data-wf-submit-status role="status" hidden></p></form></section>'
 }
 function values(form){const v=Object.fromEntries(new FormData(form));v.firstVisit=recording.firstVisit();delete v.eventDate;delete v.eventDateMode;delete v.paybackBlog;delete v.paybackReaction;return v}
 function quote(form){const v=values(form),q=recording.quote(v);return {...q,v,options:q.options.map(o=>[o.label,o.price])}}
 function range(time,minutes=60){if(!time)return '미정';const start=Number(time.slice(0,2))*60+Number(time.slice(3)),clock=m=>(m>=1440?'다음 날 ':'')+String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');return clock(start)+'~'+clock(start+minutes)}
 function rows(form){const q=quote(form),v=q.v;return [['타입',q.package.name+' | '+q.package.title],['인원',v.people==='1'?'2인(듀엣곡) · 1곡':'1인 · 1곡'],['녹음 소요 시간',global.WistiaPackages.hoursText(q.minutes)],['녹음 날짜',v.bookingDate||'미정'],['녹음 시간',range(v.timeStart,q.minutes)],['추가 옵션',q.options.map(o=>o[0]+' '+(o[0]==='마스터링'&&q.offer?'0원 (11월 이벤트)':'+'+money(o[1]))).join('\n')||'없음'],['할인',(q.allDiscounts||q.discounts).map(d=>d.label+' −'+money(d.amount)).join('\n')||'없음'],['음원 전달',q.delivery],['총 금액',money(q.total)]]}
 // Display only: the Kakao text still comes from rows() unchanged
 function reviewHtml(form,q){
  const d=Object.fromEntries(rows(form)),row=(label,value,cls='')=>'<div'+(cls?' class="'+cls+'"':'')+'><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>'
  const group=(title,body,cls)=>'<section class="wf-review-group '+cls+'"><h3 class="wf-review-head">'+title+'</h3><dl>'+body+'</dl></section>'
  return group('문의 요약',row('총 금액',d['총 금액'],'wf-final-total')+(form.dataset.scheduleState==='unavailable'?row('일정 확인','자동 확인 불가 · 희망 일정 / 상담 후 확정'):'')+row('녹음 날짜',d['녹음 날짜'])+row('녹음 시간',d['녹음 시간']),'is-schedule')
   +group('상품',row('타입',q.package.name,'is-tier" data-tier="'+q.package.key)+row('인원',d['인원'])+row('녹음 소요 시간',d['녹음 소요 시간'])+row('추가 옵션',d['추가 옵션'])+row('음원 전달',d['음원 전달']),'is-product')
   +group('할인·금액',row('선택한 구성',money(q.list+q.optionTotal),'wf-review-list')+((q.allDiscounts||q.discounts).length?(q.allDiscounts||q.discounts).map(x=>row(x.label,'−'+money(x.amount),'wf-review-discount')).join(''):row('할인','없음','wf-review-discount')),'is-amount')
 }
 function text(form){
  // Kakao copy layout approved 2026-10-24: only the lines that apply, included items from the package, added options marked (추가)
  const v=values(form),q=recording.quote(v),notes=String(v.specialNotes||'').trim().replace(/\r\n?/g,'\n')
  const day=v.bookingDate?' ('+['일','월','화','수','목','금','토'][new Date(v.bookingDate+'T12:00:00Z').getUTCDay()]+')':''
  const included=['1:1 디렉팅',...(q.package.tuning?['음정·박자 보정']:[]),...(q.package.mixing?['정밀 믹싱','마스터링']:[])]
  const addedName={duet:'녹음 1인 추가',extraHour:'녹음 1시간 추가',rush:'3일 이내 전달 (녹음일 기준)'}
  const added=q.options.map(o=>'(추가) '+(addedName[o.key]||o.label))
  const discountName=d=>d.key==='first'?'첫 이용 쿠폰':d.key==='advance1'?'사전 예약 할인 (1개월 이후)':d.label
  // One blank line after the title and exactly one between sections; no trailing spaces or commas
  return ['🎙️ 위스티아 | 신규 상담 신청','',
   '📅 녹음 예약',...(form.dataset.scheduleState==='unavailable'?['• 일정 확인 : 자동 확인 불가 · 희망 일정 / 상담 후 확정']:[]),'• 날짜 : '+(v.bookingDate?v.bookingDate+day:'미정'),'• 시간 : '+range(v.timeStart,q.minutes).replace('~',' ~ '),'',
   '📝 특이사항',...(notes?notes.split('\n').map(line=>'• '+line):['• 없음']),'',
   '📦 상품','• 타입 : '+q.package.name,'• 구성 : '+(v.people==='1'?'2인':'1인')+' · 1곡 · 녹음 '+global.WistiaPackages.hoursText(q.minutes),'• 옵션 :',...included.map(item=>'- '+item),'',
   '🎵 추가 옵션',...(added.length?['• 추가 옵션 :',...added.map(item=>'- '+item)]:['• 추가 옵션 : 없음']),'• 음원 전달 : '+q.delivery,'',
   '💰 결제 금액','• 기본 상품 (원가) : '+money(q.list??q.base),'• 추가 옵션 : '+money(q.optionTotal),'',
   '할인 내역',...((q.allDiscounts||q.discounts).length?(q.allDiscounts||q.discounts).map(d=>'• '+discountName(d)+' : -'+money(d.amount)):['• 할인 : 없음']),'━━━━━━━━━━','• 최종 금액 : '+money(q.total)].join('\n')
 }
 // The one place price views are reported (GA4 view_price + pixel ViewPrice); trackers dedupe per product per page
 function trackPriceView(q){const payload={content_name:q.package.name+' · '+q.package.title,content_ids:[q.package.name.toLowerCase()],content_type:'product',value:q.total,currency:'KRW'};try{global.wistiaAnalytics?.trackViewPrice?.(payload)}catch{}try{global.wistiaMeta?.trackViewPrice?.(payload)}catch{}}
 function updateAmount(button,total,state){
  if(state.priceTarget===total)return
  state.priceTarget=total;button.setAttribute('aria-label','다음 단계 · '+money(total))
  let amount=button.querySelector('[data-wf-amount]');if(!amount){button.innerHTML='다음 단계 · <span data-wf-amount aria-hidden="true"></span>';amount=button.querySelector('[data-wf-amount]')}
  if(state.priceFrame)global.cancelAnimationFrame?.(state.priceFrame)
  const from=Number.isFinite(state.priceShown)?state.priceShown:total
  if(from===total||global.matchMedia?.('(prefers-reduced-motion: reduce)').matches){state.priceShown=total;amount.textContent=money(total);return}
  let began;const tick=now=>{if(!amount.isConnected)return;began??=now;const t=Math.min(1,(now-began)/380);state.priceShown=Math.round((from+(total-from)*(1-Math.pow(1-t,3)))/100)*100;amount.textContent=money(t===1?total:state.priceShown);if(t<1)state.priceFrame=global.requestAnimationFrame(tick);else{state.priceShown=total;state.priceFrame=0}};state.priceFrame=global.requestAnimationFrame(tick)
 }
 function update(form,{save=true,track=true}={}){
  const state=states.get(form);if(!state)return
  recording.sync(form)
  const q=quote(form)
  form.querySelector('[data-rc-summary]').innerHTML=recording.summary(q)
  form.querySelector('[data-wf-location-duration]').textContent='1곡 · '+global.WistiaPackages.hoursText(q.minutes)
  const standard=q.minutes===50,advance=q.advance,note=form.querySelector('[data-wf-advance-note]')
  note.hidden=!advance;note.textContent=advance?money(advance.amount)+' 할인 적용돼요!':'';note.classList.toggle('is-applied',!!advance)
  form.querySelector('.wf-earlybird-legend').hidden=standard
  const dateNow=q.v.bookingDate||'',timeNow=q.v.timeStart||''
  const dateTouch=state.lastDate!==undefined&&state.step===1&&(state.lastDate!==dateNow||state.lastTime!==timeNow)
  const freshAdvance=dateTouch&&state.lastAdvance===false&&!!advance
  if(freshAdvance)flashDiscount(form,advance.amount)
  state.lastAdvance=!!advance;state.lastDate=dateNow;state.lastTime=timeNow
  if(dateTouch&&state.lastDiscount!==undefined&&q.discount>state.lastDiscount&&!(q.v.firstVisit==='1'&&!state.lastFirst)&&!(q.v.yearEndCoupon==='1'&&!state.lastYearEnd)){global.WistiaPackages.celebrate(note)}
  state.lastDiscount=q.discount;state.lastFirst=q.v.firstVisit==='1';state.lastYearEnd=q.v.yearEndCoupon==='1'
  const discountList=form.querySelector('[data-wf-discounts]');if(discountList)discountList.innerHTML=(q.allDiscounts||q.discounts).map(d=>'<div><dt>'+esc(d.label)+'</dt><dd>−'+money(d.amount)+'</dd></div>').join('')
  form.dataset.bookingMinutes=String(q.minutes);updateAmount(form.querySelector('[data-wf-next]'),q.total,state);if(track)trackPriceView(q)
  form.querySelector('[data-wf-review]').innerHTML=reviewHtml(form,q)
  form.dataset.wfCurrentStep=String(state.step);if(!form.dataset.wfTimeMode)timeMode(form,false);form.querySelectorAll('[data-wf-step]').forEach(s=>s.hidden=Number(s.dataset.wfStep)!==state.step)
  form.querySelector('[data-wf-step-label]').textContent=(state.step+1)+' / '+steps.length+'단계';form.querySelectorAll('[data-wf-progress]').forEach(li=>{const i=Number(li.dataset.wfProgress),active=i===state.step,done=i<state.step;li.classList.toggle('is-current',active);li.classList.toggle('is-complete',done);const button=li.querySelector('button');button.querySelector('span').innerHTML=done?icon('check'):String(i+1);button.disabled=i>state.step;if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});form.querySelector('[data-wf-next]').hidden=state.step===LAST;form.querySelector('[type="submit"]').hidden=state.step!==LAST
  form.querySelector('[data-wf-recording-range]').textContent=q.v.timeStart?'녹음 시간 · '+range(q.v.timeStart,q.minutes):'시작 시간을 골라 주세요'
  syncSchedule(form);global.WistiaContact?.repaintCalendars?.(form);
  const time=form.querySelector('#contact-time');
  const ready=state.step===0?Boolean(form.querySelector('[name="recordingMinutes"]:checked')&&form.querySelector('[name="people"]:checked')):state.step===1?Boolean(form.querySelector('#contact-bookingDate').value&&!form.querySelector('#contact-bookingDate').validationMessage&&time.value&&!time.selectedOptions[0]?.disabled&&form.dataset.scheduleState!=='loading'):false;
  form.querySelector('[data-wf-next-hint]').hidden=!ready;
  if(save)persistDraft(form)
  if(track)try{global.WistiaInquiryFunnel?.view(form)}catch{}
 }
 function persistDraft(form){const state=states.get(form);if(!state?.draftReady||!global.WistiaBookingDraft)return;global.WistiaBookingDraft.save(state.draftKey,{flow:'recording-v2',fields:{...values(form),...recording.preferences(form)},step:[0,1,4][state.step]+(state.step===1&&form.querySelector('#contact-time')?.value?1:0),view:state.step===1&&form.querySelector('#contact-time')?.value?'time':'date'})}
 function restoreDraft(form,state,onPeople){
  const draft=global.WistiaBookingDraft?.read(state.draftKey);if(!draft)return
  const legacy=draft.fields.recordingMinutes?{}:recording.preset(draft.fields.package,draft.fields.people==='1')
  const fields={...legacy,...draft.fields}
  for(const key of recording.keys)if(fields[key]===''||fields[key]===undefined)fields[key]=legacy[key]??'0'
  const params=new URLSearchParams(global.location.search)
  let configurationChanged=false
  if(params.has('package')||recording.keys.some(key=>params.has(key))){
   const selected=recording.selection(params,state.draftKey==='duo')
   configurationChanged=recording.keys.some(key=>fields[key]!==selected[key])
   Object.assign(fields,selected)
  }
  for(const name of [...recording.keys,'specialNotes'])form.querySelectorAll('[name="'+name+'"]').forEach(input=>{
   if(input.type==='radio'){if(fields[name]!==undefined)input.checked=input.value===fields[name]}
   else input.value=fields[name]||''
  })
  const date=form.querySelector('#contact-bookingDate'),time=form.querySelector('#contact-time');date.value=global.WistiaContact.calendar.selectableDate(draft.fields.bookingDate,'bookingDate')?draft.fields.bookingDate:'';time.value=date.value?draft.fields.timeStart:''
  state.step=configurationChanged?0:([0,1,1,1,2][draft.step]??0);if(state.step>1&&(!date.value||!time.value))state.step=1
  onPeople(form.elements.people.value==='1'?'duo':'solo')
 }
 function mark(form,key,message,number){const el=form.querySelector('[data-wf-error="'+key+'"]');el.textContent=message;el.hidden=!message;form.elements[key]?.setAttribute?.('aria-invalid',String(!!message));if(message)try{global.WistiaInquiryFunnel?.validation(form,key,number)}catch{}}
 function validate(form,step){
  const v=values(form);if(step===1){const date=form.querySelector('#contact-bookingDate'),valid=v.bookingDateMode==='date'&&global.WistiaContact.calendar.selectableDate(v.bookingDate,'bookingDate'),message=valid?(date.validationMessage||''):'녹음 날짜를 골라주세요';mark(form,'bookingDate',message,2);if(message)return false
  const time=form.querySelector('#contact-time'),timeMessage=!v.timeStart||time.selectedOptions[0]?.disabled||form.dataset.scheduleState==='loading'?'시작 시간을 골라주세요':'';mark(form,'timeStart',timeMessage,2);return !timeMessage}return true
 }
 // Short pop on the next-button price plus a '할인 적용!' tag when the 1개월 이후 discount starts
 function flashDiscount(form,amount){const button=form.querySelector('[data-wf-next]');if(!button)return;button.classList.remove('wf-price-pop');void button.offsetWidth;button.classList.add('wf-price-pop');button.querySelector('.wf-discount-flash')?.remove();const tag=global.document.createElement('span');tag.className='wf-discount-flash';tag.setAttribute('aria-hidden','true');tag.textContent=money(amount)+' 할인 적용!';button.appendChild(tag);clearTimeout(button._wfFlash);button._wfFlash=setTimeout(()=>{button.classList.remove('wf-price-pop');tag.remove()},1700)}
 // After a date is tapped the time card takes the calendar's place; leaving it shows the calendar again with the date still selected
 // Keep the panel height during that swap so the browser cannot clamp the current scroll position
 function timeMode(form,on){const view=form.querySelector('[data-wf-date-view]'),times=form.querySelector('[data-wf-time-view]');if(!view||!times)return;const heldHeight=view.offsetHeight;if(heldHeight>0)view.style.setProperty('min-height',Math.max(heldHeight,parseFloat(view.style.minHeight)||0)+'px','important');if(on)form.dataset.wfTimeMode='1';else delete form.dataset.wfTimeMode;const note=form.querySelector('[data-wf-weekday-note]');for(const child of view.children)if(child===note){if(on)child.style.removeProperty('display');else child.style.setProperty('display','none','important')}else if(child!==times){if(on)child.style.setProperty('display','none','important');else child.style.removeProperty('display')}if(on)times.style.removeProperty('display');else times.style.setProperty('display','none','important');const back=times.querySelector('[data-wf-change-date]');if(back){if(on)back.style.setProperty('display','inline-flex','important');else back.style.removeProperty('display')}const heading=times.querySelector('[data-wf-selected-date]');if(heading){if(on){heading.setAttribute('role','button');heading.setAttribute('aria-label',heading.textContent+' 날짜 다시 선택');heading.style.cursor='pointer'}else{heading.removeAttribute('role');heading.removeAttribute('aria-label');heading.style.removeProperty('cursor')}}}
 // Popup A: every wizard validation error shows as a centred card; 확인 closes it and restores focus without scrolling
 function popup(message,done){const doc=global.document;doc.querySelector('.wf-popup')?.remove();const wrap=doc.createElement('div');wrap.className='wf-popup';wrap.innerHTML='<div class="wf-popup-card" role="alertdialog" aria-modal="true" aria-labelledby="wf-popup-msg" aria-describedby="wf-popup-sub"><p class="wf-popup-msg" id="wf-popup-msg"></p><p class="wf-popup-sub" id="wf-popup-sub">확인한 뒤 선택을 이어가세요</p><button type="button" class="wf-popup-ok">확인</button></div>';wrap.querySelector('.wf-popup-msg').textContent=message
  const ok=wrap.querySelector('.wf-popup-ok'),close=()=>{wrap.remove();doc.documentElement.classList.remove('wf-popup-open');doc.removeEventListener('keydown',key,true);done?.()},key=e=>{if(e.key==='Escape'||e.key==='Enter'){e.preventDefault();close()}else if(e.key==='Tab'){e.preventDefault();ok.focus()}}
  ok.addEventListener('click',close);wrap.addEventListener('click',e=>{if(e.target===wrap)ok.focus()});doc.addEventListener('keydown',key,true);doc.documentElement.classList.add('wf-popup-open');doc.body.appendChild(wrap);ok.focus({preventScroll:true})}
 function scrollToStep(form){
  const label=form?.querySelector('[data-wf-progress-list]')||form?.querySelector('[data-wf-step-label]');if(!label)return false
  const header=global.document.querySelector('#siteHeader')
  const inset=Math.max(0,header?.getBoundingClientRect().bottom||0)+12
  if(label.getBoundingClientRect().top>=inset)return true
  global.scrollTo({top:global.scrollY+label.getBoundingClientRect().top-inset,behavior:'instant'})
  return true
 }
 function navigate(form,target){const state=states.get(form);if(target>state.step)for(let i=0;i<target;i++)if(!validate(form,i)){state.step=i;update(form);const err=i===1&&form.querySelector('[data-wf-error="bookingDate"]:not([hidden]),[data-wf-error="timeStart"]:not([hidden])');if(err){const time=err.dataset.wfError==='timeStart'&&!!form.querySelector('#contact-bookingDate')?.value;timeMode(form,time);popup(err.textContent,()=>{(time?form.querySelector('[data-wf-selected-date]'):form.querySelector('[data-wf-step="1"] h2')).focus({preventScroll:true})})}else form.querySelector('[data-wf-step="'+i+'"] h2').focus();return}state.step=Math.max(0,Math.min(LAST,target));update(form);form.querySelector('[data-wf-step="'+state.step+'"] h2').focus({preventScroll:true});scrollToStep(form)}
 function syncSchedule(form){const date=form.querySelector('#contact-bookingDate');form.dataset.wfScheduleView='date';const timeView=form.querySelector('[data-wf-time-view]');if(timeView)timeView.hidden=!date.value;form.querySelector('[data-wf-selected-date]').textContent=date.value?global.WistiaContact.calendar.displayDate(date.value):'녹음 날짜를 먼저 선택해 주세요'}
 function syncTimes(form){
  const list=form.querySelector('[data-calendar-times]'),time=form.querySelector('#contact-time'),date=form.querySelector('#contact-bookingDate');if(!list||!time||!date)return
  const focused=list.contains(global.document.activeElement)?global.document.activeElement.dataset.wfTime:null
  const known=!date.disabled&&!!date.value,loading=form.dataset.scheduleState==='loading';list.hidden=!known||loading;list.closest('[data-time-scroll-wrap]').hidden=!known||loading;time.closest('label').hidden=true;time.disabled=!known
  const hint=form.querySelector('[data-time-date-hint]');hint.hidden=known&&!loading;hint.textContent=known?'가능한 시간을 불러오고 있어요':'녹음 날짜를 먼저 골라 주세요';form.querySelector('[data-time-help]').hidden=true;form.querySelector('[data-wf-duration]').textContent=global.WistiaPackages.hoursText(quote(form).minutes)+' 진행'
  list.setAttribute('aria-busy',String(loading));list.innerHTML=[...time.options].filter(o=>o.value.endsWith(':00')).map(o=>'<button type="button" data-wf-time="'+o.value+'" aria-pressed="'+(!o.disabled&&time.value===o.value)+'"'+(loading?' disabled':o.disabled?' class="is-closed" disabled aria-label="'+o.value+' 마감"':'')+'><strong>'+o.value+'</strong>'+(!loading&&o.disabled?'<small>마감</small>':'')+'</button>').join('');update(form)
  if(focused)list.querySelector('[data-wf-time="'+focused+'"]:not(:disabled)')?.focus({preventScroll:true})
 }

 function offerFirstVisit(){}
 function mount(root,{benefits,onPeople,onSubmit}){
  const form=root.querySelector('[data-wizard]'),state={step:0,benefits:benefits||[],draftKey:values(form).people==='1'?'duo':'solo',draftReady:false,onPeople};states.set(form,state)
  form.querySelector('[data-wf-step-label]').insertAdjacentHTML('beforebegin','<aside class="wf-location-bar" aria-label="녹음실 위치와 녹음 시간"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><div><strong>부천시청역 1번 출구 · 도보 약 300m</strong><small>경기도 부천시 석천로170번길 19, 부광프라자 2층</small></div><span data-wf-location-duration>1곡 · 50분</span></aside>')
  restoreDraft(form,state,onPeople);onPeople(form.elements.people.value==='1'?'duo':'solo');state.draftReady=true
  form.addEventListener('change',event=>{
   event.stopPropagation();const el=event.target
   if(el.name==='people')onPeople(el.value==='1'?'duo':'solo')
   if(['bookingDateMode','bookingDate','timeStart'].includes(el.name))global.WistiaContact.update(el)
   if(el.name==='bookingDate'){mark(form,'bookingDate','');mark(form,'timeStart','');timeMode(form,!!el.value&&!event.wistiaCouponSync)}
   if(el.name==='timeStart')mark(form,'timeStart','')
   update(form,{save:!event.wistiaCouponSync})
   if(el.name==='recordingMinutes'){
    // If the longer session no longer fits, the picked start is cleared by availability; send the user back to repick it
    const picked=form.querySelector('#contact-time')?.value
    global.WistiaBooking.mount(form,bookingKey(form))
    if(picked){let tries=0;const check=()=>{if(!form.isConnected)return;const now=form.querySelector('#contact-time')?.value;if(now===picked&&++tries<15)return void setTimeout(check,200);if(now)return;const st=states.get(form);if(st&&st.step>1){st.step=1;update(form)}timeMode(form,!!form.querySelector('#contact-bookingDate')?.value);mark(form,'timeStart','녹음 시간이 늘어나 '+picked+' 시작은 마감 시간과 겹쳐요 다른 시간을 골라 주세요');const err=form.querySelector('[data-wf-error="timeStart"]');popup(err.textContent,()=>{form.querySelector('[data-wf-selected-date]')?.focus({preventScroll:true})})};setTimeout(check,0)}
   }
  })
  form.addEventListener('input',event=>{if(!recording.keys.includes(event.target.name))update(form,{save:!event.wistiaCouponSync})})
  // Tapping the picked date heading in the time view goes back to the calendar
  form.addEventListener('click',event=>{if(form.dataset.wfTimeMode&&event.target.closest('[data-wf-selected-date]')){timeMode(form,false);return}const day=event.target.closest('[data-calendar="bookingDate"] [data-date],[data-calendar="bookingDate"] [data-calendar-day]');if(day&&!day.disabled)global.setTimeout(()=>{const picked=day.dataset.date||day.dataset.calendarDay;if(!form.dataset.wfTimeMode&&picked&&form.querySelector('#contact-bookingDate')?.value===picked)timeMode(form,true)},0)})
  form.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.disabled)return;if(button.hasAttribute('data-wf-change-date')){timeMode(form,false);return}if(button.dataset.wfTime){const time=form.querySelector('#contact-time');time.value=button.dataset.wfTime;time.dispatchEvent(new Event('change',{bubbles:true}));syncTimes(form)}if(button.hasAttribute('data-wf-goto')&&Number(button.dataset.wfGoto)<state.step)navigate(form,Number(button.dataset.wfGoto));if(button.hasAttribute('data-wf-next'))navigate(form,state.step+1);if(button.hasAttribute('data-wf-prev')){if(state.step===1&&form.dataset.wfTimeMode){timeMode(form,false);return}if(state.step===0){const url=new URL('/',global.location.href);url.search=global.location.search;url.searchParams.delete('package');for(const [key,value] of new URLSearchParams(recording.query(recording.preferences(form))))url.searchParams.set(key,value);global.history.pushState({...global.history.state,wistiaDepth:(global.history.state?.wistiaDepth||0)+1},'',url.pathname+url.search);global.dispatchEvent(new global.PopStateEvent('popstate'))}else navigate(form,state.step-1)}})
  form.addEventListener('submit',async event=>{event.preventDefault();event.stopPropagation();if(state.step!==LAST||form.dataset.copyPending)return;const button=form.querySelector('[type="submit"]');form.dataset.copyPending='true';button.disabled=true;try{await global.WistiaBooking.refresh();if(!form.isConnected)return;for(const step of [1])if(!validate(form,step)){state.step=step;update(form);const err=form.querySelector('[data-wf-error="bookingDate"]:not([hidden]),[data-wf-error="timeStart"]:not([hidden])');if(err){const time=err.dataset.wfError==='timeStart';popup(err.textContent,()=>{(time?form.querySelector('[data-wf-selected-date]'):form.querySelector('[data-wf-step="1"] h2')).focus({preventScroll:true})})}else form.querySelector('[data-wf-step="'+step+'"] h2').focus();return}await onSubmit(text(form))}finally{delete form.dataset.copyPending;button.disabled=false}})
  Promise.resolve(global.WistiaBooking.mount(form,bookingKey(form))).then(()=>{if(!form.isConnected)return;if(state.step>1&&!validate(form,1)){state.step=1;update(form)}});update(form)
 }
 function bookingKey(form){return 'ar-'+quote(form).minutes}
 global.addEventListener('wistia:price-date-change',()=>{
  global.document.querySelectorAll('form[data-wizard]').forEach(form=>update(form,{save:false,track:false}))
 })
 global.WistiaWizard={scrollToStep,currentStep:form=>(states.get(form)?.step??0)+1,render,mount,syncTimes,syncSchedule,text,quote,rows,range,bookingKey,offerFirstVisit}
})(window)
