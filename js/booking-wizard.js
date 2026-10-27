(function(global){
 'use strict'
 const titles=['타입과 인원 선택','녹음 날짜와 시작 시간','추가 옵션','마지막 확인 후 카톡 문의']
 const steps=['상품','날짜·시간','옵션','확인'],sources=['인스타','스레드','광고','카페','블로그','지인 추천']
 const LAST=3,states=new WeakMap(),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const icon=kind=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">'+(kind==='calendar'?'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>':kind==='people'?'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m2-17a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v4"/>':'<path d="m5 12 4 4L19 6"/>')+'</svg>'
 const error=key=>'<p class="wf-error" id="wf-error-'+key+'" data-wf-error="'+key+'" role="alert" hidden></p>'
 function discoveryField(){return '<fieldset><legend>처음에 위스티아를 어디서 보고 오셨나요? (선택)</legend><div class="wf-sources">'+sources.map(source=>'<label class="wf-choice"><input type="radio" name="discovery" value="'+source+'"><span'+(source==='지인 추천'?' class="wf-source-label"':'')+'>'+(source==='지인 추천'?'<span class="wf-source-main">기타</span> <small class="wf-source-sub">(지인 추천 등)</small>':source)+'</span></label>').join('')+'</div></fieldset>'}
 function checkRow(name,label,amount,description=''){return '<label class="wf-check-row"><input type="checkbox" name="'+name+'" value="1"><span class="wf-check-box">'+icon('check')+'</span><span class="wf-check-label">'+esc(label)+(description?'<small>'+esc(description)+'</small>':'')+'</span><strong>+'+money(amount)+'</strong></label>'}
 const tipText={people:'듀엣 패키지로 하면 더 저렴해요!',tuning:'디럭스 패키지로 하면 더 저렴해요!',detailMix:'디럭스 패키지로 하면 더 저렴해요!',precisionMix:'디럭스 패키지로 하면 더 저렴해요!',extraHour:'프리미엄 패키지로 하면 더 저렴해요!'}
 function firstVisitField(){return '<div class="wf-welcome">'+global.WistiaPackages.firstVisitBanner()+'<label class="welcome-toggle"><input type="checkbox" name="firstVisit" value="1"><span>첫 이용 쿠폰 받기</span><strong>20,000원 할인</strong></label>'+(global.WistiaPackages.octoberActive()?'<label class="welcome-toggle october-toggle" data-october-coupon><input type="checkbox" name="octoberCoupon" value="1"><span>10월 예약 쿠폰 받기</span><strong>20,000원 할인</strong></label><p class="october-note" data-october-note hidden>스탠다드에는 적용되지 않아요</p>':'')+'</div>'}
 function discountDates(){const today=global.WistiaPackages.today(),format=date=>Number(date.slice(5,7))+'월 '+Number(date.slice(8,10))+'일';return '<div class="wf-earlybird-legend" aria-label="녹음일 사전 예약 할인"><p class="earlybird-one"><strong>'+format(global.WistiaPackages.addMonths(today,1))+'부터</strong><span>10,000원 할인</span></p><p class="earlybird-two"><strong>'+format(global.WistiaPackages.addMonths(today,2))+'부터</strong><span>20,000원 할인</span></p><small>녹음 날짜 기준 · 두 할인 중 해당하는 한 가지만 적용돼요</small></div>'}
 function bookingDateField(){return global.WistiaContact.dateField('bookingDate','녹음 날짜').replace('<legend>② 녹음 날짜</legend>','<legend class="sr-only">녹음 날짜 선택</legend>').replace('name="bookingDateMode" value="date"','name="bookingDateMode" value="date" checked').replace('value="unknown" data-contact-date-mode="bookingDate" checked','value="unknown" data-contact-date-mode="bookingDate"').replace('data-contact-date-panel="bookingDate" hidden','data-contact-date-panel="bookingDate"').replace('tabindex="-1" disabled data-calendar-value','tabindex="-1" data-calendar-value').replace('data-calendar="bookingDate" role="dialog"','data-calendar="bookingDate" data-calendar-immediate="true" role="group"').replace('aria-label="녹음 날짜 달력" hidden','aria-label="녹음 날짜 달력"').replace(/<button type="button" class="calendar-close"[\s\S]*?<\/button>/,'')}
 function render(key){
  const selected=global.WistiaPackages.packageFor(new URLSearchParams(global.location.search).get('package')).key
  const sections=[
   '<h3 class="package-heading">내게 맞는 녹음 타입을 골라보세요</h3>'+global.WistiaPackages.cards(selected,'wizard')+firstVisitField()+'<fieldset class="wf-people"><legend>녹음 인원</legend><p class="wf-tip is-right" data-wf-tip="people">'+tipText.people+'</p><div class="wf-pair">'+['<b>1인</b><small>1인·1곡 기준</small>','<b>듀엣곡으로 변경</b><small>2인 1곡 기준</small><strong>+30,000원</strong>'].map((label,i)=>'<label class="wf-choice"><input type="radio" name="people" value="'+i+'"'+(String(i)===(key==='duo'?'1':'0')?' checked':'')+'><span>'+icon('people')+label+'</span></label>').join('')+'</div></fieldset>'+discoveryField(),
   '<div class="wf-schedule" data-wf-date-view>'+discountDates()+bookingDateField()+'<p class="wf-discount-banner" data-wf-advance-note aria-live="polite" hidden></p>'+error('bookingDate')+'<div class="wf-schedule wf-time-view" data-wf-time-view><div class="wf-schedule-heading"><p data-wf-selected-date tabindex="-1"></p><button type="button" data-wf-change-date>'+icon('calendar')+'날짜 다시 선택</button></div><p class="wf-discount-banner" data-wf-weekday-note>목·금 13~16시 시작은 10,000원 할인돼요</p>'+global.WistiaContact.timeField().replace('role="radiogroup"','role="group"').replace('<legend>방문 희망 시간</legend>','<legend>시작 시간 <small data-wf-duration>50분 진행</small></legend><p class="wf-recording-range" data-wf-recording-range aria-live="polite"></p>')+error('timeStart')+'</div></div>',
   '<p class="wf-option-guide">필요한 옵션만 선택해 주세요</p><fieldset class="wf-option package-extra-options"><legend>추가 옵션</legend>'+global.WistiaPackages.options.map(o=>(tipText[o.key]?'<p class="wf-tip" data-wf-tip="'+o.key+'">'+tipText[o.key]+'</p>':'')+'<div data-wf-option="'+o.key+'">'+checkRow(o.key,o.label,o.price,o.detail)+'</div>').join('')+'</fieldset>',
   '<label class="wf-field">특이사항 (선택)<textarea name="specialNotes" rows="4" maxlength="2000" placeholder="궁금한 사항이나 고민되는 부분을 편하게 적어 주세요"></textarea></label><div class="wf-review" data-wf-review></div><p class="wf-payment">결제는 카카오톡에서 맞춤 상담 진행 후 진행돼요</p><p class="wf-copy-note">작성한 내용이 복사되면 카카오톡 채팅창에 붙여넣어 보내주세요</p><p class="wf-privacy">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다</p>'
  ]
  return '<section class="wistia-wizard"><h1>문의양식 작성</h1><p class="wf-draft-note" data-wf-draft-note>작성 내용은 이 브라우저에 3시간 동안 임시 저장돼요</p><form id="contactInquiryForm" data-wizard="true" data-booking-calendar-opened="true" novalidate><ol class="wf-progress" aria-label="문의 단계">'+steps.map((title,i)=>'<li data-wf-progress="'+i+'"><button type="button" data-wf-goto="'+i+'" aria-label="'+(i+1)+'단계 '+title+'"><span>'+(i+1)+'</span><small>'+title+'</small></button></li>').join('')+'</ol><p class="wf-step-label" data-wf-step-label aria-live="polite"></p>'+sections.map((body,i)=>'<section class="wf-step" data-wf-step="'+i+'"'+(i?' hidden':'')+'><h2 tabindex="-1">'+titles[i]+'</h2>'+body+'</section>').join('')+'<div class="wf-nav"><button type="button" data-wf-prev>이전</button><button type="button" data-wf-next>다음 단계</button><button type="submit" class="wf-submit" hidden>작성한 내용으로 카카오톡 문의하기</button></div><p data-wf-submit-status role="status" hidden></p></form></section>'
 }
 function values(form){const v=Object.fromEntries(new FormData(form));delete v.eventDate;delete v.eventDateMode;delete v.paybackBlog;delete v.paybackReaction;return v}
 function quote(form){const v=values(form),q=global.WistiaPackages.quote(v);return {...q,v,options:q.options.map(o=>[o.label,o.price])}}
 function range(time,minutes=60){if(!time)return '미정';const start=Number(time.slice(0,2))*60+Number(time.slice(3)),clock=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');return clock(start)+'~'+clock(start+minutes)}
 function rows(form){const q=quote(form),v=q.v;return [['타입',q.package.name+' | '+q.package.title],['인원',v.people==='1'?'2인(듀엣곡) · 1곡':'1인 · 1곡'],['녹음 소요 시간',global.WistiaPackages.hoursText(q.minutes)],['녹음 날짜',v.bookingDate||'미정'],['녹음 시간',range(v.timeStart,q.minutes)],['추가 옵션',q.options.map(o=>o[0]+' +'+money(o[1])).join('\n')||'없음'],['할인',q.discounts.map(d=>d.label+' −'+money(d.amount)).join('\n')||'없음'],['음원 전달',q.delivery],['처음 본 곳',v.discovery||'선택 안 함'],['총 금액',money(q.total)]]}
 // Display only: the Kakao text still comes from rows() unchanged
 function reviewHtml(form,q){
  const d=Object.fromEntries(rows(form)),row=(label,value,cls='')=>'<div'+(cls?' class="'+cls+'"':'')+'><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>'
  const group=(title,body,cls)=>'<section class="wf-review-group '+cls+'"><h3 class="wf-review-head">'+title+'</h3><dl>'+body+'</dl></section>'
  return group('상품',row('타입',q.package.name,'is-tier" data-tier="'+q.package.key)+row('인원',d['인원'])+row('녹음 소요 시간',d['녹음 소요 시간'])+row('추가 옵션',d['추가 옵션'])+row('음원 전달',d['음원 전달'])+row('처음 본 곳',d['처음 본 곳']),'is-product')
   +group('일정',row('녹음 날짜',d['녹음 날짜'])+row('녹음 시간',d['녹음 시간']),'is-schedule')
   +group('할인·금액',(q.discounts.length?q.discounts.map(x=>row(x.label,'−'+money(x.amount),'wf-review-discount')).join(''):row('할인','없음','wf-review-discount'))+row('총 금액',d['총 금액'],'wf-final-total'),'is-amount')
 }
 function text(form){
  // Kakao copy layout approved 2026-10-24: only the lines that apply, included items from the package, added options marked (추가)
  const v=values(form),q=global.WistiaPackages.quote(v),details=Object.fromEntries(rows(form)),notes=String(v.specialNotes||'').trim().replace(/\r\n?/g,'\n')
  const day=v.bookingDate?' ('+['일','월','화','수','목','금','토'][new Date(v.bookingDate+'T12:00:00Z').getUTCDay()]+')':''
  const included=['1:1 디렉팅',...(q.package.tuning?['음정·박자 보정',q.package.mixing?'정밀 믹싱':'기본 믹싱','마스터링']:['기본 믹싱'])]
  const addedName={duet:'2인(듀엣곡) 변경',extraHour:'녹음 50분',rush:'3일 이내 전달 (녹음일 기준)'}
  const added=q.options.map(o=>'(추가) '+(addedName[o.key]||o.label))
  const discountName=d=>d.key==='first'?'첫 이용 할인':d.key==='weekday'?'목·금 시간 할인 (13~16시)':d.key==='advance2'?'사전 예약 할인 (2개월 이후)':d.key==='advance1'?'사전 예약 할인 (1개월 이후)':d.label
  // One blank line after the title and exactly one between sections; no trailing spaces or commas
  return ['🎙️ 위스티아 | 신규 상담 신청','',
   '📅 녹음 예약','• 날짜 : '+(v.bookingDate?v.bookingDate+day:'미정'),'• 시간 : '+range(v.timeStart,q.minutes).replace('~',' ~ '),'',
   '📦 상품','• 타입 : '+q.package.name,'• 구성 : '+(v.people==='1'?'2인':'1인')+' · 1곡 · 녹음 '+global.WistiaPackages.hoursText(q.minutes),'• 옵션 :',...included.map(item=>'- '+item),'',
   '🎵 추가 옵션',...(added.length?['• 추가 옵션 :',...added.map(item=>'- '+item)]:['• 추가 옵션 : 없음']),'• 음원 전달 : '+q.delivery,'',
   '💰 결제 금액','• 기본 상품 : '+money(q.base),'• 추가 옵션 : '+money(q.optionTotal),'',
   '할인 내역',...(q.discounts.length?q.discounts.map(d=>'• '+discountName(d)+' : -'+money(d.amount)):['• 할인 : 없음']),'━━━━━━━━━━','• 최종 금액 : '+money(q.total),'',
   '💬 고객 정보','• 유입 경로 : '+details['처음 본 곳'],'',
   '📝 특이사항',...(notes?notes.split('\n').map(line=>'• '+line):['• 없음'])].join('\n')
 }
 function updateAmount(button,total,state){
  if(state.priceTarget===total)return
  state.priceTarget=total;button.setAttribute('aria-label','다음 단계 · '+money(total))
  let amount=button.querySelector('[data-wf-amount]');if(!amount){button.innerHTML='다음 단계 · <span data-wf-amount aria-hidden="true"></span>';amount=button.querySelector('[data-wf-amount]')}
  if(state.priceFrame)global.cancelAnimationFrame?.(state.priceFrame)
  const from=Number.isFinite(state.priceShown)?state.priceShown:total
  if(from===total||global.matchMedia?.('(prefers-reduced-motion: reduce)').matches){state.priceShown=total;amount.textContent=money(total);return}
  let began;const tick=now=>{if(!amount.isConnected)return;began??=now;const t=Math.min(1,(now-began)/380);state.priceShown=Math.round((from+(total-from)*(1-Math.pow(1-t,3)))/100)*100;amount.textContent=money(t===1?total:state.priceShown);if(t<1)state.priceFrame=global.requestAnimationFrame(tick);else{state.priceShown=total;state.priceFrame=0}};state.priceFrame=global.requestAnimationFrame(tick)
 }
 function syncOptions(form,q){
  {const box=form.querySelector('[data-october-coupon]');if(box&&!global.WistiaPackages.octoberActive()){const input=box.querySelector('input');if(input)input.checked=false;box.remove();form.querySelector('[data-october-note]')?.remove()}else if(box){const input=box.querySelector('input'),standard=q.package.key==='A';input.disabled=standard;if(standard)input.checked=false;box.classList.toggle('is-disabled',standard);const note=form.querySelector('[data-october-note]');if(note)note.hidden=!standard}}
  for(const key of ['tuning','detailMix','precisionMix','extraHour']){const row=form.querySelector('[data-wf-option="'+key+'"]');if(!row)continue;const input=row.querySelector('input'),included=key==='tuning'?q.package.tuning:key==='detailMix'||key==='precisionMix'?q.package.mixing:!!q.package.duet;input.disabled=included;if(included)input.checked=false;row.classList.toggle('is-included',included);const tip=form.querySelector('[data-wf-tip="'+key+'"]');if(tip)tip.hidden=included;row.querySelector('strong').textContent=included?'패키지에 포함되어 있어요':'+'+money(global.WistiaPackages.options.find(o=>o.key===key).price)}
  {const row=form.querySelector('[data-wf-option="rush"]');if(row){const input=row.querySelector('input'),sameDay=!q.package.tuning&&!form.querySelector('input[name="tuning"]')?.checked;input.disabled=sameDay;if(sameDay)input.checked=false;row.classList.toggle('is-same-day',sameDay);row.querySelector('strong').textContent=sameDay?'당일 전달 포함':'+'+money(global.WistiaPackages.options.find(o=>o.key==='rush').price)}}
  const fieldset=form.querySelector('.package-extra-options'),rows=global.WistiaPackages.options.map(option=>form.querySelector('[data-wf-option="'+option.key+'"]'))
  const ordered=rows.filter(row=>!row.querySelector('input').disabled).concat(rows.filter(row=>row.querySelector('input').disabled)),current=[...fieldset.querySelectorAll('[data-wf-option]')]
  if(ordered.some((row,index)=>row!==current[index]))for(const row of ordered)fieldset.appendChild(row)
 }
 // DUET already includes 2인 and 2시간 30분: lock the people choice to 2인 and restore the earlier choice when leaving DUET
 function syncDuet(form,state){
  const duet=!!global.WistiaPackages.packageFor(form.querySelector('input[name="package"]:checked')?.value).duet,people=form.querySelector('.wf-people'),current=form.querySelector('input[name="people"]:checked')?.value||'0'
  if(duet&&form.dataset.peopleBeforeDuet===undefined){form.dataset.peopleBeforeDuet=current;form.querySelectorAll('input[name="people"]').forEach(input=>input.checked=input.value==='1');state.onPeople?.('duo')}
  if(!duet&&form.dataset.peopleBeforeDuet!==undefined){const back=form.dataset.peopleBeforeDuet;delete form.dataset.peopleBeforeDuet;form.querySelectorAll('input[name="people"]').forEach(input=>input.checked=input.value===back);state.onPeople?.(back==='1'?'duo':'solo')}
  if(people)people.hidden=duet
 }
 function update(form){
  const state=states.get(form);if(!state)return
  syncDuet(form,state)
  const q=quote(form);global.WistiaPackages.syncSelection(form,q.package.key)
  const locationDuration=form.querySelector('[data-wf-location-duration]');if(locationDuration)locationDuration.innerHTML='<b class="wf-tier-name" data-tier="'+q.package.key+'">'+q.package.name+'</b> · 1곡 · '+global.WistiaPackages.hoursText(q.minutes)
  const advance=global.WistiaPackages.advanceDiscount(q.v.bookingDate),note=form.querySelector('[data-wf-advance-note]');note.hidden=!advance;note.textContent=advance?money(advance.amount)+' 할인 적용돼요!':'';note.classList.toggle('is-applied',!!advance)
  const weekday=form.querySelector('[data-wf-weekday-note]');weekday.textContent=global.WistiaPackages.isPublicHoliday(q.v.bookingDate)?'공휴일은 목·금 시간대 할인이 적용되지 않아요':'목·금 13~16시 시작은 10,000원 할인돼요 (공휴일 제외)';weekday.classList.toggle('is-applied',!!global.WistiaPackages.weekdayDiscount(q.v.bookingDate,q.v.timeStart))
  if(state.lastDiscount!==undefined&&q.discount>state.lastDiscount){const target=q.v.firstVisit==='1'&&!state.lastFirst?form.querySelector('.wf-welcome'):state.step===1&&!q.v.timeStart?note:weekday;global.WistiaPackages.celebrate(target)}
  state.lastDiscount=q.discount;state.lastFirst=q.v.firstVisit==='1'
  form.querySelector('.welcome-toggle strong').textContent=state.lastFirst?'할인 적용 완료':'20,000원 할인'
  syncOptions(form,q)
  const discountList=form.querySelector('[data-wf-discounts]');if(discountList)discountList.innerHTML=q.discounts.map(d=>'<div><dt>'+esc(d.label)+'</dt><dd>−'+money(d.amount)+'</dd></div>').join('')
  form.dataset.bookingMinutes=String(q.minutes);updateAmount(form.querySelector('[data-wf-next]'),q.total,state)
  form.querySelector('[data-wf-review]').innerHTML=reviewHtml(form,q)
  form.querySelectorAll('[data-wf-step]').forEach(s=>s.hidden=Number(s.dataset.wfStep)!==state.step)
  form.querySelectorAll('[data-wf-progress]').forEach(li=>{const i=Number(li.dataset.wfProgress),active=i===state.step,done=i<state.step;li.classList.toggle('is-current',active);li.classList.toggle('is-complete',done);const button=li.querySelector('button');button.querySelector('span').innerHTML=done?icon('check'):String(i+1);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')})
  form.querySelector('[data-wf-step-label]').textContent=(state.step+1)+' / '+steps.length+'단계';form.querySelector('[data-wf-next]').hidden=state.step===LAST;form.querySelector('[type="submit"]').hidden=state.step!==LAST
  form.querySelector('[data-wf-recording-range]').textContent=q.v.timeStart?'녹음 시간 · '+range(q.v.timeStart,q.minutes):'시작 시간을 골라 주세요'
  syncSchedule(form);persistDraft(form)
  try{global.WistiaInquiryFunnel?.view(form)}catch{}
 }
 function persistDraft(form){const state=states.get(form);if(!state?.draftReady||!global.WistiaBookingDraft)return;const saved=global.WistiaBookingDraft.save(state.draftKey,{flow:'recording-v2',fields:values(form),step:[0,1,3,4][state.step]+(state.step===1&&form.querySelector('#contact-time')?.value?1:0),view:state.step===1&&form.querySelector('#contact-time')?.value?'time':'date'});form.closest('.wistia-wizard').querySelector('[data-wf-draft-note]').textContent=saved?'작성 내용은 이 브라우저에 3시간 동안 임시 저장돼요':'이 브라우저에서는 임시 저장이 제한되어 있어요'}
 function restoreDraft(form,state,onPeople){
  const draft=global.WistiaBookingDraft?.read(state.draftKey);if(!draft)return
  for(const name of ['package','people','discovery','tuning','detailMix','precisionMix','extraHour','firstVisit','octoberCoupon','specialNotes'])form.querySelectorAll('[name="'+name+'"]').forEach(input=>{if(input.type==='radio')input.checked=input.value===draft.fields[name];else if(input.type==='checkbox')input.checked=draft.fields[name]==='1';else input.value=draft.fields[name]||''})
  const date=form.querySelector('#contact-bookingDate'),time=form.querySelector('#contact-time');date.value=global.WistiaContact.calendar.selectableDate(draft.fields.bookingDate,'bookingDate')?draft.fields.bookingDate:'';time.value=date.value?draft.fields.timeStart:''
  state.step=[0,1,1,2,3][draft.step]??0;if(state.step>1&&(!date.value||!time.value))state.step=1
  onPeople(draft.fields.people==='1'?'duo':'solo')
 }
 function mark(form,key,message,number){const el=form.querySelector('[data-wf-error="'+key+'"]');el.textContent=message;el.hidden=!message;form.elements[key]?.setAttribute?.('aria-invalid',String(!!message));if(message)try{global.WistiaInquiryFunnel?.validation(form,key,number)}catch{}}
 function validate(form,step){
  const v=values(form);if(step===1){const date=form.querySelector('#contact-bookingDate'),valid=v.bookingDateMode==='date'&&global.WistiaContact.calendar.selectableDate(v.bookingDate,'bookingDate'),message=valid?(date.validationMessage||''):'녹음 날짜를 골라주세요';mark(form,'bookingDate',message,2);if(message)return false
  const time=form.querySelector('#contact-time'),timeMessage=!v.timeStart||time.selectedOptions[0]?.disabled||form.dataset.scheduleState==='loading'?'시작 시간을 골라주세요':'';mark(form,'timeStart',timeMessage,2);return !timeMessage}return true
 }
 // Scroll so el sits below the fixed header and its bottom (or anchor's) clears the fixed 이전/다음 bar
 function reveal(form,el,anchor){if(!el)return;const doc=global.document,vh=global.innerHeight,fixed=node=>{for(;node&&node!==doc.body;node=node.parentElement){const p=getComputedStyle(node).position;if(p==='fixed'||p==='sticky')return node}return null}
  let top=0;const head=fixed(doc.elementFromPoint(global.innerWidth/2,2));if(head&&!form.contains(head))top=Math.max(0,head.getBoundingClientRect().bottom)
  const nav=form.querySelector('.wf-nav'),navRect=nav?.getBoundingClientRect(),bar=nav&&['fixed','sticky'].includes(getComputedStyle(nav).position)&&navRect.top<vh?vh-navRect.top:0
  const r=el.getBoundingClientRect(),end=(anchor||el).getBoundingClientRect().bottom;let dy=r.top-top-12;if(end-dy>vh-bar-8)dy=end-(vh-bar-8)
  if(Math.abs(dy)<2)return;const smooth=!global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;global.scrollBy({top:dy,behavior:smooth?'smooth':'auto'})}
 // Popup A: every wizard validation error shows as a centred card; 확인 closes it, then scrolls to and focuses the field
 function popup(message,done){const doc=global.document;doc.querySelector('.wf-popup')?.remove();const wrap=doc.createElement('div');wrap.className='wf-popup';wrap.innerHTML='<div class="wf-popup-card" role="alertdialog" aria-modal="true" aria-labelledby="wf-popup-msg" aria-describedby="wf-popup-sub"><p class="wf-popup-msg" id="wf-popup-msg"></p><p class="wf-popup-sub" id="wf-popup-sub">확인을 누르면 해당 항목으로 이동해요</p><button type="button" class="wf-popup-ok">확인</button></div>';wrap.querySelector('.wf-popup-msg').textContent=message
  const ok=wrap.querySelector('.wf-popup-ok'),close=()=>{wrap.remove();doc.documentElement.classList.remove('wf-popup-open');doc.removeEventListener('keydown',key,true);done?.()},key=e=>{if(e.key==='Escape'||e.key==='Enter'){e.preventDefault();close()}else if(e.key==='Tab'){e.preventDefault();ok.focus()}}
  ok.addEventListener('click',close);wrap.addEventListener('click',e=>{if(e.target===wrap)ok.focus()});doc.addEventListener('keydown',key,true);doc.documentElement.classList.add('wf-popup-open');doc.body.appendChild(wrap);ok.focus({preventScroll:true})}
 function navigate(form,target){const state=states.get(form);if(target>state.step)for(let i=0;i<target;i++)if(!validate(form,i)){state.step=i;update(form);const err=i===1&&form.querySelector('[data-wf-error="bookingDate"]:not([hidden]),[data-wf-error="timeStart"]:not([hidden])');if(err){const time=err.dataset.wfError==='timeStart',target=time?form.querySelector('[data-wf-time-view]'):form.querySelector('[data-wf-date-view]');popup(err.textContent,()=>{(time?form.querySelector('[data-wf-selected-date]'):form.querySelector('[data-wf-step="1"] h2')).focus({preventScroll:true});reveal(form,target,err)})}else form.querySelector('[data-wf-step="'+i+'"] h2').focus();return}state.step=Math.max(0,Math.min(LAST,target));update(form);form.querySelector('[data-wf-step="'+state.step+'"] h2').focus()}
 function syncSchedule(form){const date=form.querySelector('#contact-bookingDate');form.dataset.wfScheduleView='date';const timeView=form.querySelector('[data-wf-time-view]');if(timeView)timeView.hidden=!date.value;form.querySelector('[data-wf-selected-date]').textContent=date.value?global.WistiaContact.calendar.displayDate(date.value):'녹음 날짜를 먼저 선택해 주세요'}
 function syncTimes(form){
  const list=form.querySelector('[data-calendar-times]'),time=form.querySelector('#contact-time'),date=form.querySelector('#contact-bookingDate');if(!list||!time||!date)return
  const focused=list.contains(global.document.activeElement)?global.document.activeElement.dataset.wfTime:null
  const known=!date.disabled&&!!date.value,loading=form.dataset.scheduleState==='loading';list.hidden=!known||loading;list.closest('[data-time-scroll-wrap]').hidden=!known||loading;time.closest('label').hidden=true;time.disabled=!known
  const hint=form.querySelector('[data-time-date-hint]');hint.hidden=known&&!loading;hint.textContent=known?'가능한 시간을 불러오고 있어요':'녹음 날짜를 먼저 골라 주세요';form.querySelector('[data-time-help]').hidden=true;form.querySelector('[data-wf-duration]').textContent=global.WistiaPackages.hoursText(quote(form).minutes)+' 진행'
  list.setAttribute('aria-busy',String(loading));list.innerHTML=[...time.options].filter(o=>o.value.endsWith(':00')).map(o=>{const discount=!loading&&!o.disabled&&global.WistiaPackages.weekdayDiscount(date.value,o.value);return '<button type="button" data-wf-time="'+o.value+'" aria-pressed="'+(!o.disabled&&time.value===o.value)+'"'+(loading?' disabled':o.disabled?' class="is-closed" disabled aria-label="'+o.value+' 마감"':'')+'>'+(discount?'<small class="wf-time-discount">−1만원</small>':'')+'<strong>'+o.value+'</strong>'+(!loading&&o.disabled?'<small>마감</small>':'')+'</button>'}).join('');update(form)
  if(focused)list.querySelector('[data-wf-time="'+focused+'"]:not(:disabled)')?.focus({preventScroll:true})
  // After a tapped date, bring the time list into view once the buttons are ready
  if(form.dataset.wfRevealTimes&&known&&!loading&&list.querySelector('[data-wf-time]')){delete form.dataset.wfRevealTimes;global.requestAnimationFrame(()=>reveal(form,form.querySelector('[data-wf-time-view]'),list.querySelector('[data-wf-time]')))}
 }
 function mount(root,{benefits,onPeople,onSubmit}){
  const form=root.querySelector('[data-wizard]'),state={step:0,benefits:benefits||[],draftKey:values(form).people==='1'?'duo':'solo',draftReady:false,onPeople};states.set(form,state)
  global.WistiaPackages.mountSelection(form)
  form.querySelector('[data-wf-step-label]').insertAdjacentHTML('beforebegin','<aside class="wf-location-bar" aria-label="녹음실 위치와 녹음 시간"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><div><strong>부천시청역 1번 출구 · 도보 약 300m</strong><small>경기도 부천시 석천로170번길 19, 부광프라자 2층</small></div><span data-wf-location-duration>1곡 · 50분</span></aside>')
  restoreDraft(form,state,onPeople);state.draftReady=true
  const explicit=new URLSearchParams(global.location.search).get('package');if(['A','B','C','D'].includes(explicit))form.querySelectorAll('[name="package"]').forEach(input=>input.checked=input.value===explicit)
  form.addEventListener('change',event=>{
   event.stopPropagation();const el=event.target
   if(el.name==='people')onPeople(el.value==='1'?'duo':'solo')
   if(['bookingDateMode','bookingDate','timeStart'].includes(el.name))global.WistiaContact.update(el)
   if(el.name==='package'){const url=new URL(global.location.href);url.searchParams.set('package',el.value);global.history.replaceState(global.history.state,'',url.pathname+url.search)}
   if(el.name==='bookingDate'){mark(form,'bookingDate','');mark(form,'timeStart','');if(el.value)form.dataset.wfRevealTimes='1'}
   if(el.name==='timeStart')mark(form,'timeStart','')
   update(form)
   if(['package','people','extraHour'].includes(el.name)){
    // If the longer session no longer fits, the picked start is cleared by availability; send the user back to repick it
    const picked=form.querySelector('#contact-time')?.value
    global.WistiaBooking.mount(form,bookingKey(form))
    if(picked){let tries=0;const check=()=>{if(!form.isConnected)return;const now=form.querySelector('#contact-time')?.value;if(now===picked&&++tries<15)return void setTimeout(check,200);if(now)return;const st=states.get(form);if(st&&st.step>1){st.step=1;update(form)}mark(form,'timeStart','녹음 시간이 늘어나 '+picked+' 시작은 마감 시간과 겹쳐요 다른 시간을 골라 주세요');const err=form.querySelector('[data-wf-error="timeStart"]');popup(err.textContent,()=>{form.querySelector('[data-wf-selected-date]')?.focus({preventScroll:true});reveal(form,form.querySelector('[data-wf-time-view]'),err)})};setTimeout(check,0)}
   }
  })
  form.addEventListener('input',()=>update(form))
  form.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.disabled)return;if(button.hasAttribute('data-wf-change-date')){form.querySelector('[data-wf-date-view]')?.scrollIntoView({block:'start'});return}if(button.dataset.wfTime){const time=form.querySelector('#contact-time');time.value=button.dataset.wfTime;time.dispatchEvent(new Event('change',{bubbles:true}));syncTimes(form)}if(button.hasAttribute('data-wf-goto'))navigate(form,Number(button.dataset.wfGoto));if(button.hasAttribute('data-wf-next'))navigate(form,state.step+1);if(button.hasAttribute('data-wf-prev')){if(state.step===0){const url=new URL('/detail/solo',global.location.href);url.search=global.location.search;url.searchParams.set('package',quote(form).package.key);global.history.pushState({...global.history.state,wistiaDepth:(global.history.state?.wistiaDepth||0)+1},'',url.pathname+url.search);global.dispatchEvent(new global.PopStateEvent('popstate'))}else navigate(form,state.step-1)}})
  form.addEventListener('submit',async event=>{event.preventDefault();event.stopPropagation();if(state.step!==LAST||form.dataset.copyPending)return;const button=form.querySelector('[type="submit"]');form.dataset.copyPending='true';button.disabled=true;try{await global.WistiaBooking.refresh();if(!form.isConnected)return;for(const step of [1])if(!validate(form,step)){state.step=step;update(form);const err=form.querySelector('[data-wf-error="bookingDate"]:not([hidden]),[data-wf-error="timeStart"]:not([hidden])');if(err){const time=err.dataset.wfError==='timeStart';popup(err.textContent,()=>{(time?form.querySelector('[data-wf-selected-date]'):form.querySelector('[data-wf-step="1"] h2')).focus({preventScroll:true});reveal(form,form.querySelector(time?'[data-wf-time-view]':'[data-wf-date-view]'),err)})}else form.querySelector('[data-wf-step="'+step+'"] h2').focus();return}await onSubmit(text(form))}finally{delete form.dataset.copyPending;button.disabled=false}})
  Promise.resolve(global.WistiaBooking.mount(form,bookingKey(form))).then(()=>{if(!form.isConnected)return;if(state.step>1&&!validate(form,1)){state.step=1;update(form)}});update(form)
 }
 function bookingKey(form){return 'ar-'+quote(form).minutes}
 global.WistiaWizard={currentStep:form=>[1,2,3,4][states.get(form)?.step??0]??1,render,mount,syncTimes,syncSchedule,syncOptions,text,quote,rows,range,bookingKey}
})(window)
