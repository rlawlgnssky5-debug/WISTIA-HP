(function(global){
 const fields=[
  ['source','어디에서 보고 오셨나요?','인스타 / 스레드 / 광고 / 카페 / 블로그'],
  ['name','성함','성함을 입력해 주세요'],
  ['service','희망 서비스',''],
  ['eventDate','예식일, 예정일','예: 2026년 11월 15일 또는 미정'],
  ['bookingDate','희망 예약일','목요일~일요일 / 예: 10월 15일'],
  ['time','희망 시간','13시부터 ~ 23시까지'],
  ['purpose','상영 시점 또는 사용 목적','식전 / 식중 / 축가 / 기타']
 ]
 const escape=value=>String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
 const welcome='🤍 🇼 🇪 🇱 🇨 🇴 🇲 🇪 🤍'
 const timeOptions=Array.from({length:21},(_,index)=>{const hour=13+Math.floor(index/2),minute=index%2?'30':'00';return '<option value="'+hour+':'+minute+'">'+hour+'시'+(minute==='30'?' 30분':'')+'</option>'}).join('')
 function dateField(key,label){
  return '<fieldset class="contact-field contact-date-field"><legend>'+label+'</legend><div class="contact-date-toggle"><label><input type="radio" name="'+key+'Mode" value="date" data-contact-date-mode="'+key+'"><span>날짜 선택</span></label><label><input type="radio" name="'+key+'Mode" value="unknown" data-contact-date-mode="'+key+'" checked><span>미정</span></label></div><div class="contact-date-picker" data-contact-date-panel="'+key+'" hidden><label class="sr-only" for="contact-'+key+'">'+label+' 날짜</label><input id="contact-'+key+'" name="'+key+'" type="date" disabled aria-describedby="contact-'+key+'-hint"><em id="contact-'+key+'-hint">'+(key==='bookingDate'?'목요일~일요일 중 선택해 주세요 · 예약 가능 여부는 상담에서 확인합니다':'달력에서 날짜를 선택해 주세요')+'</em><small class="contact-input-error" data-contact-date-error="'+key+'" role="alert" hidden></small></div></fieldset>'
 }
 function timeField(){return '<fieldset class="contact-field contact-time-field"><legend>희망 시간</legend><div class="contact-time-selects"><label for="contact-time"><span>시작 시간</span><select id="contact-time" name="timeStart"><option value="">미정</option>'+timeOptions+'</select></label><label for="contact-time-end"><span>종료 시간</span><select id="contact-time-end" name="timeEnd"><option value="">선택 안 함</option>'+timeOptions+'</select></label></div><em>13시~23시 · 방문 가능한 시간대를 선택해 주세요</em><small class="contact-input-error" data-contact-time-error role="alert" hidden></small></fieldset>'}
 function update(target){
  const form=target.closest('#contactInquiryForm');if(!form)return
  if(target.dataset.contactDateMode){const key=target.dataset.contactDateMode,panel=form.querySelector('[data-contact-date-panel="'+key+'"]'),input=panel.querySelector('input'),known=target.value==='date';panel.hidden=!known;input.disabled=!known;if(!known){input.setCustomValidity('');input.removeAttribute('aria-invalid');panel.querySelector('.contact-input-error').hidden=true}}
  const booking=form.querySelector('#contact-bookingDate'),dateError=form.querySelector('[data-contact-date-error="bookingDate"]')
  const day=booking.value?new Date(booking.value+'T12:00:00').getDay():null
  const bookingMessage=!booking.disabled&&day!==null&&[1,2,3].includes(day)?'희망 예약일은 목요일~일요일 중 선택해 주세요':''
  booking.setCustomValidity(bookingMessage);booking.setAttribute('aria-invalid',String(Boolean(bookingMessage)));dateError.textContent=bookingMessage;dateError.hidden=!bookingMessage
  const start=form.querySelector('#contact-time'),end=form.querySelector('#contact-time-end'),timeError=form.querySelector('[data-contact-time-error]')
  const timeMessage=end.value&&!start.value?'시작 시간을 먼저 선택해 주세요':start.value&&end.value&&end.value<start.value?'종료 시간은 시작 시간 이후로 선택해 주세요':''
  end.setCustomValidity(timeMessage);end.setAttribute('aria-invalid',String(Boolean(timeMessage)));timeError.textContent=timeMessage;timeError.hidden=!timeMessage
 }
 const formatDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)?value.replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$1년 $2월 $3일'):value
 function render(quote){
  const inputs=fields.map(([key,label,hint])=>{
   if(key==='eventDate'||key==='bookingDate')return dateField(key,label)
   if(key==='time')return timeField()
   const id='contact-'+key
   let input
   if(key==='service')input='<select id="'+id+'" name="'+key+'" required><option value="">서비스를 선택해 주세요</option>'+['AR 축가 사전녹음','축가 스토리 필름','상담 후 결정'].map(value=>'<option'+(quote?.service===value?' selected':'')+'>'+value+'</option>').join('')+'</select>'
   else if(key==='purpose')input='<select id="'+id+'" name="'+key+'"><option value="">미정</option>'+['식전','식중','축가','기타'].map(value=>'<option>'+value+'</option>').join('')+'</select>'
   else input='<input id="'+id+'" name="'+key+'" type="text" maxlength="200" autocomplete="'+(key==='name'?'name':'off')+'" placeholder="'+hint+'"'+(key==='name'?' required':'')+(key==='source'?' list="contact-sources"':'')+'>'
   return '<label class="contact-field" for="'+id+'"><span>'+label+(key==='name'||key==='service'?'<small>필수</small>':'')+'</span>'+input+(key==='time'?'<em>방문 가능 시간 편하게 적어주세요</em>':'')+'</label>'
  }).join('')
  return '<section class="contact-page shell" aria-labelledby="contact-title"><header class="contact-intro"><p class="contact-welcome">'+welcome+'</p><h1 id="contact-title">문의 양식</h1><p>아래 문의 양식에 내용을 작성한 후<br>복사해 카카오톡으로 보내주세요 :D</p><p>보내주신 내용을 확인한 후<br>최대한 빠르게 안내드리겠습니다 :)</p></header><form id="contactInquiryForm" class="contact-form"><p class="contact-form-heading">[ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐅𝐨𝐫𝐦 ]</p><p class="contact-form-help">일정이 미정이라면 비워 두셔도 괜찮습니다</p>'+inputs+'<datalist id="contact-sources"><option value="인스타"><option value="스레드"><option value="광고"><option value="카페"><option value="블로그"></datalist>'+(quote?'<aside class="contact-quote"><strong>선택한 구성도 함께 전달합니다</strong><p>'+escape(quote.summary)+'</p><small>작성 내용과 함께 복사되며 최종 금액은 상담에서 확인합니다</small></aside>':'')+'<p class="contact-privacy-note">입력한 내용은 홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다<br>복사한 내용은 카카오톡에서 직접 보내주세요 <a href="/privacy">개인정보처리방침</a></p><button type="submit" class="button dark contact-submit">문의 내용 복사하고 상담하기 <span aria-hidden="true">↗</span></button></form></section>'
 }
 function text(values,quote){
  const lines=[welcome,'','[ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐅𝐨𝐫𝐦 ]','']
  fields.forEach(([key,label])=>{let value=String(values[key]||'').trim();if(key==='eventDate'||key==='bookingDate')value=values[key+'Mode']==='unknown'?'':formatDate(value);if(key==='time'&&!value)value=values.timeStart?(values.timeStart+(values.timeEnd?' ~ '+values.timeEnd:'')):'';lines.push('• '+label+' : '+(value||'미정'),'')})
  if(quote?.text)lines.push('━━━━━','선택한 구성과 가격',quote.text.split('━━━━━').slice(1).join('━━━━━').trim())
  return lines.join('\n').trim()
 }
 global.WistiaContact={render,text,update}
})(window)
