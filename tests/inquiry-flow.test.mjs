import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const source=read('js/app.js'),contact=read('js/contact-form.js'),css=read('css/inquiry-flow.css')
const context={window:{}}
runInNewContext(contact,context)
const api=context.window.WistiaContact
const quote={service:'AR 축가 사전녹음',summary:'AR · 13만원',text:'인사\n━━━━━\n• 최종 예상 가격 : 130,000원'}
const embedded=api.render(quote,{embedded:true})
assert.equal((embedded.match(/<h1/g)||[]).length,0)
assert.equal((embedded.match(/<form/g)||[]).length,1)
assert.match(embedded,/name="service" value="AR 축가 사전녹음" readonly/)
assert.match(embedded,/문의 내용 복사하고 카카오톡 상담하기/)
assert.match(api.render(null,{embedded:true}),/name="service" value="상담 후 결정" readonly/)
assert.match(api.render(null,{embedded:true}),/class="contact-quote" hidden/)
const submitted=api.text({name:'검수',source:'인스타 광고',service:quote.service},quote)
assert.match(submitted,/성함 : 검수/)
assert.match(submitted,/최종 예상 가격 : 130,000원/)
assert.doesNotMatch(api.text({service:'상담 후 결정'},null),/가격|120,000/)
const sync=source.slice(source.indexOf('function refreshInquiryQuote(){'),source.indexOf('function jumpToInquiry(){'))
const preview={hidden:false,querySelector:()=>({textContent:''})},service={readOnly:true,value:''}
context.document={querySelector:()=>({querySelector:selector=>selector==='[name="service"]'?service:preview})}
api.syncQuote(quote);assert.equal(service.value,quote.service);assert.equal(preview.hidden,false)
api.syncQuote(null);assert.equal(service.value,'상담 후 결정');assert.equal(preview.hidden,true)
const state={inquiryUndecided:false,currentEventProduct:'solo',window:{WistiaContact:{syncQuote:()=>{}}},calculate:()=>({product:{title:'AR'},finalPrice:130000}),shortWon:()=> '13만원',consultationText:()=>submitted}
runInNewContext('let contactQuote;'+sync+';refreshInquiryQuote();this.quote=contactQuote',state)
assert.equal(state.quote.text,submitted)
state.inquiryUndecided=true;runInNewContext('refreshInquiryQuote();this.quote=contactQuote',state);assert.equal(state.quote,null)
assert.match(source,/function renderContactPage\(\)\{renderEvent\('solo','',true\)\}/)
assert.match(source,/type="button" data-inquiry-jump/)
assert.match(source,/WistiaContact.restore\(document.querySelector\('#contactInquiryForm'\),draft\)/)
assert.match(source,/refreshInquiryQuote\(\);copyConsultationAndShowDialog\(window.WistiaContact.text\(values,contactQuote\)\)/)
assert.match(source,/consult:\(\)=>jumpToInquiry\(\)/)
assert.match(css,/body.inquiry-visible \.booking-price-sidebar\{display:none!important\}/)
assert.match(css,/\.inquiry-price-options\[hidden\]/)
const home=source.slice(source.indexOf('function renderWeddingHome(){'),source.indexOf('function detailPriceData('))
assert.doesNotMatch(home,/AR 축가 준비|studioSculpture\('record'\)/)
assert.ok(home.indexOf('id="homeCases"')<home.indexOf('we-review-wrap'))
assert.ok(home.indexOf('we-review-wrap')<home.indexOf('id="homeSound"'))
assert.match(home,/4단계로 준비하는/)
assert.match(source,/포인트 02|포인트 '\+number/)
assert.match(source,/linearGradient id="arJoinedWave"/)
assert.match(css,/arc-recording-flow li:nth-child\(2\)/)
console.log('Single-page inquiry, optional price, current quote, preserved draft, existing popup and requested home/detail changes passed')
