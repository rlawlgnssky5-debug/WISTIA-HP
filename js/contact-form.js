(function(global){
 const fields=[
  ['source','어디에서 보고 오셨나요?','인스타 / 스레드 / 광고 / 카페 / 블로그'],
  ['name','성함','성함을 입력해 주세요'],
  ['service','희망 서비스',''],
  ['eventDate','예식일, 예정일','예: 2026년 11월 15일 또는 미정'],
  ['bookingDate','희망 예약일','희망 날짜 / 예약 가능 여부는 상담에서 확인'],
  ['time','희망 시간','13시부터 ~ 23시까지']
 ]
 const escape=value=>String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
 const welcome='🤍 🇼 🇪 🇱 🇨 🇴 🇲 🇪 🤍'
 const timeOptions=Array.from({length:21},(_,index)=>{const hour=13+Math.floor(index/2),minute=index%2?'30':'00';return '<option value="'+hour+':'+minute+'">'+hour+'시'+(minute==='30'?' 30분':'')+'</option>'}).join('')
 function dateField(key,label){
  return '<fieldset class="contact-field contact-date-field"><legend>'+label+'</legend><div class="contact-date-toggle"><label><input type="radio" name="'+key+'Mode" value="date" data-contact-date-mode="'+key+'"><span>날짜 선택</span></label><label><input type="radio" name="'+key+'Mode" value="unknown" data-contact-date-mode="'+key+'" checked><span>미정</span></label></div><div class="contact-date-picker" data-contact-date-panel="'+key+'" hidden><label class="sr-only" for="contact-'+key+'">'+label+' 날짜</label><input id="contact-'+key+'" name="'+key+'" type="date" disabled aria-describedby="contact-'+key+'-hint"><em id="contact-'+key+'-hint">'+(key==='bookingDate'?'월~목 예약 시 평일 할인 · 예약 가능 여부는 상담에서 확인합니다':'달력에서 날짜를 선택해 주세요')+'</em><small class="contact-input-error" data-contact-date-error="'+key+'" role="alert" hidden></small></div></fieldset>'
 }
 function timeField(){return '<fieldset class="contact-field contact-time-field"><legend>희망 시간</legend><div class="contact-time-selects"><label for="contact-time"><span class="sr-only">희망 시간 선택</span><select id="contact-time" name="timeStart"><option value="">미정</option>'+timeOptions+'</select></label></div><em>13시~23시 · 방문 가능한 시간을 선택해 주세요</em></fieldset>'}
 function update(target){
  const form=target.closest('#contactInquiryForm');if(!form)return
  if(target.dataset.contactDateMode){const key=target.dataset.contactDateMode,panel=form.querySelector('[data-contact-date-panel="'+key+'"]'),input=panel.querySelector('input'),known=target.value==='date';panel.hidden=!known;input.disabled=!known;if(!known){input.setCustomValidity('');input.removeAttribute('aria-invalid');panel.querySelector('.contact-input-error').hidden=true}}
  const booking=form.querySelector('#contact-bookingDate'),dateError=form.querySelector('[data-contact-date-error="bookingDate"]')
  booking.setCustomValidity('');booking.removeAttribute('aria-invalid');dateError.hidden=true
 }
 const formatDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)?value.replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$1년 $2월 $3일'):value
 function render(quote,{embedded=false,integrated=false}={}){
  const ordered=integrated?['name','eventDate','bookingDate','time','source'].map(key=>fields.find(field=>field[0]===key)):fields
  const inputs=ordered.map(([key,label,hint])=>{
   if(key==='eventDate'||key==='bookingDate')return dateField(key,label)
   if(key==='time')return timeField()
   const id='contact-'+key
   let input
   if(key==='service')input=embedded?'<input id="'+id+'" name="service" value="'+escape(quote?.service||'상담 후 결정')+'" readonly><em>위의 상품 선택에 따라 함께 변경됩니다</em>':'<select id="'+id+'" name="'+key+'" required><option value="">서비스를 선택해 주세요</option>'+['AR 축가 사전녹음','축가 스토리 필름','상담 후 결정'].map(value=>'<option'+(quote?.service===value?' selected':'')+'>'+value+'</option>').join('')+'</select>'
   else if(key==='source'&&integrated)input='<select id="'+id+'" name="source"><option value="">선택 안 함</option>'+['인스타','스레드','메타 광고','카카오톡 채널','카페','블로그','지인 추천','기타'].map(value=>'<option>'+value+'</option>').join('')+'</select>'
   else input='<input id="'+id+'" name="'+key+'" type="text" maxlength="200" autocomplete="'+(key==='name'?'name':'off')+'" placeholder="'+hint+'"'+(key==='name'?' required':'')+(key==='source'?' list="contact-sources"':'')+'>'
   return '<label class="contact-field" for="'+id+'"><span>'+label+(key==='name'||key==='service'?'<small>필수</small>':'')+'</span>'+input+(key==='time'?'<em>방문 가능 시간 편하게 적어주세요</em>':'')+'</label>'
  }).join('')
  if(integrated)return '<section id="bookingInquiry" class="consultation-step consultation-fields" data-contact-fields aria-labelledby="scheduleTitle"><header class="consultation-step-heading"><span class="booking-step">02</span><h2 id="scheduleTitle">이름 및 예식일 작성</h2><p>아직 정해지지 않은 일정은 미정으로 두셔도 괜찮습니다</p></header><input id="contact-service" name="service" type="hidden" value="'+escape(quote?.service||'상담 후 결정')+'" readonly><div class="consultation-field-grid">'+inputs+'</div></section>'
  return '<section class="contact-page'+(embedded?' contact-embedded':' shell')+'" id="bookingInquiry" aria-labelledby="contact-title"><header class="contact-intro"><p class="contact-welcome">'+welcome+'</p><'+(embedded?'h2':'h1')+' id="contact-title">문의 양식 작성</'+(embedded?'h2':'h1')+'><p>내용을 작성한 후 복사해<br>카카오톡 채팅창에 붙여넣어 보내주세요 :D</p></header><form id="contactInquiryForm" class="contact-form"><p class="contact-form-heading">[ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐅𝐨𝐫𝐦 ]</p><p class="contact-form-help">보내주신 내용을 확인한 후 빠르게 안내드리겠습니다 :)<br>일정이 미정이라면 비워 두셔도 괜찮습니다</p>'+inputs+'<datalist id="contact-sources"><option value="인스타"><option value="스레드"><option value="광고"><option value="카페"><option value="블로그"></datalist><aside class="contact-quote"'+(!quote?' hidden':'')+'><strong>선택한 구성도 함께 전달합니다</strong><p>'+escape(quote?.summary)+'</p><small>작성 내용과 함께 복사되며 최종 금액은 상담에서 확인합니다</small></aside><p class="contact-privacy-note">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다<br>복사한 내용은 카카오톡에서 직접 보내주세요 <a href="/privacy">개인정보처리방침</a></p><button type="submit" class="button dark contact-submit">문의 내용 복사하고 카카오톡 상담하기 <span aria-hidden="true">→</span></button></form></section>'
 }
 function submit(){return '<p class="contact-privacy-note">작성 내용은 서버에 저장하거나 자동 전송하지 않습니다<br>복사 후 카카오톡 채팅창에 붙여넣어 보내주세요 <a href="/privacy">개인정보처리방침</a></p><button type="submit" class="button dark contact-submit">문의 내용 복사하고 카카오톡 상담하기 <span aria-hidden="true">→</span></button>'}
 function syncReview(){
  const form=document.querySelector('#contactInquiryForm'),review=document.querySelector('#contactReview');if(!form||!review)return
  const values=snapshot(form),date=key=>values[key+'Mode']==='date'&&values[key]?formatDate(values[key]):'미정'
  const rows=[['성함',values.name?.trim()||'미작성'],['예식일, 예정일',date('eventDate')],['희망 예약일',date('bookingDate')],['희망 시간',values.timeStart||'미정'],['유입 경로',values.source||'선택 안 함']]
  review.innerHTML=rows.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+escape(value)+'</dd></div>').join('')
 }
 function syncQuote(quote){
  const form=document.querySelector('#contactInquiryForm');if(!form)return
  const service=form.querySelector('[name="service"]');if(service?.readOnly)service.value=quote?.service||'상담 후 결정'
  const preview=form.querySelector('.contact-quote');if(preview){preview.hidden=!quote;preview.querySelector('p').textContent=quote?.summary||''}
  syncReview()
 }
 function snapshot(form){const keys=new Set([...fields.map(field=>field[0]),'eventDateMode','bookingDateMode','timeStart']);return form?Object.fromEntries([...new FormData(form)].filter(([key])=>keys.has(key))):null}
 function restore(form,values){
  if(!form||!values)return
  for(const [key,value] of Object.entries(values)){if(key==='service')continue;const controls=[...form.elements].filter(el=>el.name===key);controls.forEach(el=>{if(el.type==='radio')el.checked=el.value===value;else el.value=value})}
  form.querySelectorAll('[data-contact-date-mode]:checked').forEach(update)
 }
 function text(values,quote){
  const lines=[welcome,'','[ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐅𝐨𝐫𝐦 ]','']
  fields.forEach(([key,label])=>{let value=String(values[key]||'').trim();if(key==='eventDate'||key==='bookingDate')value=values[key+'Mode']==='unknown'?'':formatDate(value);if(key==='time')value=values.timeStart||'';lines.push('• '+label+' : '+(value||'미정'),'')})
  if(quote?.text)lines.push('━━━━━','선택한 구성과 가격',quote.text.split('━━━━━').slice(1).join('━━━━━').trim())
  return lines.join('\n').trim()
 }
 global.WistiaContact={render,submit,text,update,syncQuote,syncReview,snapshot,restore}
})(window)
