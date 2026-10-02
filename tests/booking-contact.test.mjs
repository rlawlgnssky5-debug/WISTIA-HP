import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const context={window:{}}
runInNewContext(read('js/contact-form.js'),context)
const api=context.window.WistiaContact
const markup=api.render()
const keys=['source','name','service','eventDate','bookingDate','time','purpose']
assert.equal((markup.match(/class="contact-field"/g)||[]).length,7)
for(const key of keys){
 assert.match(markup,new RegExp('for="contact-'+key+'"'))
 assert.match(markup,new RegExp('id="contact-'+key+'" name="'+key+'"'))
}
assert.match(markup,/목요일~일요일/)
assert.match(markup,/13시부터 ~ 23시까지/)
assert.match(markup,/식전 \/ 식중 \/ 축가 \/ 기타/)
assert.match(markup,/홈페이지 서버에 저장하거나 자동으로 전송하지 않습니다/)
assert.doesNotMatch(read('js/contact-form.js'),/fetch\(|localStorage|XMLHttpRequest/)
const values={source:'인스타',name:'검수용 문의',service:'AR 축가 사전녹음',eventDate:'2026년 11월 15일',bookingDate:'10월 15일',time:'15~17시',purpose:'축가'}
const text=api.text(values)
assert.equal((text.match(/^• /gm)||[]).length,7)
for(const value of Object.values(values))assert.ok(text.includes(value))
assert.match(api.text({}),/성함 : 미정/)
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
assert.match(page,/contact-form.js\?v=20261002-contact-1/)
assert.match(page,/noindex,\s*follow/)
console.log('Seven contact fields, clipboard text, quote snapshot, no server transmission, two product cards and accessible selection passed')
