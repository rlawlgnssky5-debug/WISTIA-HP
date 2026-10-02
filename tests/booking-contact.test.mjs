import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const context={window:{}}
runInNewContext(read('js/contact-form.js'),context)
const api=context.window.WistiaContact
const markup=api.render()
const keys=['source','name','service','eventDate','bookingDate','time','purpose']
assert.equal((markup.match(/class="contact-field(?: |")/g)||[]).length,7)
for(const key of keys){
 assert.match(markup,new RegExp('for="contact-'+key+'"'))
 assert.match(markup,new RegExp('id="contact-'+key+'" name="'+(key==='time'?'timeStart':key)+'"'))
}
assert.match(markup,/목요일~일요일/)
assert.match(markup,/13시~23시/)
for(const purpose of ['식전','식중','축가','기타'])assert.match(markup,new RegExp('<option>'+purpose+'</option>'))
assert.match(markup,/name="eventDate" type="date" disabled/)
assert.match(markup,/name="bookingDate" type="date" disabled/)
assert.match(markup,/name="timeEnd"/)
assert.equal((markup.match(/data-contact-date-mode=/g)||[]).length,4)
assert.doesNotMatch(markup,/name="(?:eventDate|bookingDate|time|purpose)" type="text"/)
assert.match(markup,/홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다/)
assert.doesNotMatch(read('js/contact-form.js'),/fetch\(|localStorage|XMLHttpRequest/)
const values={source:'인스타',name:'검수용 문의',service:'AR 축가 사전녹음',eventDate:'2026년 11월 15일',bookingDate:'10월 15일',time:'15~17시',purpose:'축가'}
const text=api.text(values)
assert.equal((text.match(/^• /gm)||[]).length,7)
for(const value of Object.values(values))assert.ok(text.includes(value))
assert.match(api.text({}),/성함 : 미정/)
assert.match(api.text({eventDate:'2026-11-15',bookingDate:'2026-10-08',timeStart:'15:00',timeEnd:'17:30',purpose:'축가'}),/예식일, 예정일 : 2026년 11월 15일/)
assert.match(api.text({bookingDate:'2026-10-08',bookingDateMode:'unknown',timeStart:'15:00',timeEnd:'17:30'}),/희망 예약일 : 미정/)
assert.match(api.text({timeStart:'15:00',timeEnd:'17:30'}),/희망 시간 : 15:00 ~ 17:30/)
assert.match(api.text({timeStart:'23:00'}),/희망 시간 : 23:00/)
const input=()=>({value:'',disabled:true,attributes:{},setCustomValidity(value){this.validityMessage=value},setAttribute(key,value){this.attributes[key]=value},removeAttribute(key){delete this.attributes[key]}})
const eventDate=input(),bookingDate=input(),start=input(),end=input(),dateError={hidden:true},eventError={hidden:true},timeError={hidden:true}
const eventPanel={hidden:true,querySelector:selector=>selector==='input'?eventDate:eventError}
const bookingPanel={hidden:true,querySelector:selector=>selector==='input'?bookingDate:dateError}
const nodes={'[data-contact-date-panel="eventDate"]':eventPanel,'[data-contact-date-panel="bookingDate"]':bookingPanel,'#contact-bookingDate':bookingDate,'[data-contact-date-error="bookingDate"]':dateError,'#contact-time':start,'#contact-time-end':end,'[data-contact-time-error]':timeError}
const form={querySelector:selector=>nodes[selector]}
const target=(key,value)=>({dataset:key?{contactDateMode:key}:{},value,closest:()=>form})
api.update(target('eventDate','date'));assert.equal(eventPanel.hidden,false);assert.equal(eventDate.disabled,false)
api.update(target('bookingDate','date'));bookingDate.value='2026-10-05';api.update(target());assert.match(bookingDate.validityMessage,/목요일~일요일/);assert.equal(dateError.hidden,false)
bookingDate.value='2026-10-08';api.update(target());assert.equal(bookingDate.validityMessage,'');assert.equal(dateError.hidden,true)
start.value='17:00';end.value='15:00';api.update(target());assert.match(end.validityMessage,/시작 시간 이후/)
end.value='18:00';api.update(target());assert.equal(end.validityMessage,'')
api.update(target('bookingDate','unknown'));assert.equal(bookingDate.disabled,true);assert.equal(bookingPanel.hidden,true);assert.equal(bookingDate.validityMessage,'')
const quote={service:'AR 축가 사전녹음',summary:'AR <검수> · 11만원',text:'🤍 WELCOME 🤍\n━━━━━\n최종 예상 가격 : 110,000원'}
assert.match(api.render(quote),/AR &lt;검수&gt; · 11만원/)
assert.match(api.render(quote),/<option selected>AR 축가 사전녹음/)
assert.match(api.text(values,quote),/최종 예상 가격 : 110,000원/)
assert.equal((api.text(values,quote).match(/WELCOME/g)||[]).length,0)
const app=read('js/app.js')
assert.match(app,/name="quoteProduct"/)
assert.match(app,/type="radio"[^\n]+data-product-select/)
assert.doesNotMatch(app,/<select id="bookingService"/)
assert.match(app,/contactQuote=null;document.querySelector\('\.contact-quote'\)\?\.remove\(\)/)
assert.match(app,/new FormData\(e.target\)/)
assert.match(app,/copyConsultationAndShowDialog\(window.WistiaContact.text\(values,contactQuote\)\)/)
const css=read('css/booking-contact.css')
assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/)
assert.match(css,/input:checked\+\.booking-product-face/)
assert.match(css,/@keyframes product-select/)
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
assert.match(css,/input:focus-visible/)
assert.match(css,/font-size:16px/)
const page=read('contact.html')
assert.match(page,/contact-form.js\?v=20261002-contact-toggles-1/)
assert.match(page,/noindex,\s*follow/)
console.log('Seven contact fields, clipboard text, quote snapshot, no server transmission, two product cards and accessible selection passed')
