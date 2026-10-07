import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const context={window:{}}
runInNewContext(read('js/contact-form.js'),context)
const api=context.window.WistiaContact
const markup=api.render()
const keys=['source','service','eventDate','bookingDate','time']
assert.equal((markup.match(/class="contact-field(?: |")/g)||[]).length,5)
assert.doesNotMatch(markup,/contact-name|name="name"|성함/)
for(const key of keys){
 assert.match(markup,new RegExp('for="contact-'+key+'"'))
 assert.match(markup,new RegExp('id="contact-'+key+'" name="'+(key==='time'?'timeStart':key)+'"'))
}
assert.doesNotMatch(markup,/목·금·토·일 운영 · 월·화·수 마감/)
assert.match(markup,/13시~23시/)
assert.match(markup,/name="eventDate" type="text" hidden tabindex="-1" disabled/)
assert.match(markup,/name="bookingDate" type="text" hidden tabindex="-1" disabled/)
assert.doesNotMatch(markup,/name="timeEnd"|상영 시점|name="purpose"/)
assert.equal((markup.match(/data-contact-date-mode=/g)||[]).length,4)
assert.doesNotMatch(markup,/type="date"/)
assert.match(markup,/홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다/)
assert.doesNotMatch(read('js/contact-form.js'),/fetch\(|localStorage|XMLHttpRequest/)
const values={source:'인스타',service:'AR 축가 사전녹음',eventDate:'2026년 11월 15일',bookingDate:'10월 15일',timeStart:'15:00'}
const text=api.text(values)
assert.deepEqual([...text.matchAll(/^(\d+)\) /gm)].map(match=>Number(match[1])),[1,2,3])
assert.doesNotMatch(text,/^• |WELCOME|𝐂𝐨𝐧𝐭𝐚𝐜𝐭/gm)
for(const value of Object.values(values))assert.ok(text.includes(value))
assert.doesNotMatch(api.text({name:'과거 초안 이름'}),/성함|과거 초안 이름/)
assert.match(api.text({eventDate:'2026-11-15',bookingDate:'2026-10-08',timeStart:'15:00',timeEnd:'17:30',purpose:'축가'}),/결혼식 날짜 \(예식일\) : 2026년 11월 15일/)
assert.match(api.text({bookingDate:'2026-10-08',bookingDateMode:'unknown',timeStart:'15:00',timeEnd:'17:30'}),/녹음 방문일 \(스튜디오 예약일\) : 미정/)
assert.match(api.text({timeStart:'15:00',timeEnd:'17:30'}),/희망 시간 : 15:00/)
assert.doesNotMatch(api.text({timeStart:'15:00',timeEnd:'17:30',purpose:'식중'}),/17:30|식중|상영 시점/)
assert.match(api.text({timeStart:'23:00'}),/희망 시간 : 23:00/)
const input=()=>({value:'',disabled:true,attributes:{},setCustomValidity(value){this.validityMessage=value},setAttribute(key,value){this.attributes[key]=value},removeAttribute(key){delete this.attributes[key]}})
const eventDate=input(),bookingDate=input(),start=input(),end=input(),dateError={hidden:true},eventError={hidden:true},timeError={hidden:true}
const eventPanel={hidden:true,querySelector:selector=>selector==='input'?eventDate:eventError}
const bookingPanel={hidden:true,querySelector:selector=>selector==='input'?bookingDate:dateError}
const nodes={'[data-contact-date-panel="eventDate"]':eventPanel,'[data-contact-date-panel="bookingDate"]':bookingPanel,'#contact-bookingDate':bookingDate,'[data-contact-date-error="bookingDate"]':dateError,'#contact-time':start,'#contact-time-end':end,'[data-contact-time-error]':timeError}
const form={querySelector:selector=>nodes[selector]}
const target=(key,value)=>({dataset:key?{contactDateMode:key}:{},value,closest:()=>form})
api.update(target('eventDate','date'));assert.equal(eventPanel.hidden,false);assert.equal(eventDate.disabled,false)
api.update(target('bookingDate','date'));bookingDate.value='2026-10-05';api.update(target());assert.equal(bookingDate.validityMessage,'');assert.equal(dateError.hidden,true)
bookingDate.value='2026-10-08';api.update(target());assert.equal(bookingDate.validityMessage,'');assert.equal(dateError.hidden,true)
api.update(target('bookingDate','unknown'));assert.equal(bookingDate.disabled,true);assert.equal(bookingPanel.hidden,true);assert.equal(bookingDate.validityMessage,'')
const quote={service:'AR 축가 사전녹음',summary:'AR <검수> · 11만원',text:'🤍 WELCOME 🤍\n━━━━━\n최종 예상 가격 : 110,000원'}
assert.match(api.render(quote),/AR &lt;검수&gt; · 11만원/)
assert.match(api.render(quote),/<option selected>AR 축가 사전녹음/)
assert.match(api.text(values,quote),/최종 예상 가격 : 110,000원/)
assert.equal((api.text(values,quote).match(/WELCOME/g)||[]).length,0)
const app=read('js/app.js')
assert.match(app,/name="quoteProduct"/)
assert.match(app,/<select id="bookingService" name="quoteProduct" data-product-select/)
assert.doesNotMatch(app,/type="radio"[^\n]+data-product-select/)
assert.match(app,/closest\('\[data-contact-fields\]'\)/)
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
assert.match(page,/contact-form.js\?v=20261008-contact-calendar-5/)
assert.match(page,/noindex,\s*follow/)
console.log('Five contact fields without names, single start time, dropdown, clipboard text, preserved draft and no server transmission passed')
