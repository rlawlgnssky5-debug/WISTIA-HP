import assert from 'node:assert/strict'
import {runInNewContext} from 'node:vm'

export function assertInquiryWithoutName(source){
 const context={window:{},document:{querySelectorAll:()=>[]},FormData:class{constructor(form){this.data=form.data}[Symbol.iterator](){return this.data[Symbol.iterator]()}}}
 runInNewContext(source,context)
 const api=context.window.WistiaContact
 const quote={service:'AR 축가 사전녹음',summary:'AR · 12만원',text:'문의\n━━━━━\n결제 예상 금액 : 120,000원'}
 for(const options of [{},{embedded:true},{integrated:true}]){
  const markup=api.render(quote,options)
  assert.doesNotMatch(markup,/contact-name|name="name"|autocomplete="name"|성함|이름/,'name is not collected in any inquiry rendering mode')
  assert.match(markup,/name="eventDateMode"/)
  assert.match(markup,/name="bookingDateMode"/)
  assert.match(markup,/name="timeStart"/)
 }
 const copied=api.text({name:'과거 초안의 성함',source:'인스타',service:quote.service,eventDateMode:'unknown',bookingDateMode:'unknown',timeStart:'15:00'},quote)
 assert.doesNotMatch(copied,/성함|이름|과거 초안/,'legacy name values never enter copied inquiry text')
 assert.match(copied,/결혼식 날짜 \(예식일\) : 미정/)
 assert.match(copied,/녹음 방문일 \(스튜디오 예약일\) : 미정/)
 assert.match(copied,/희망 시간 : 15:00/)
 assert.match(copied,/결제 예상 금액 : 120,000원/)
 const legacyName={name:'name',value:'현재 값',required:true,willValidate:true,validity:{valid:true}}
 assert.equal(api.validationEditor([{control:legacyName,label:'성함',message:'입력해 주세요'}]),'','a stale name cannot reappear in the validation popup editor')
 const service={name:'service',value:'',required:true,willValidate:true,validity:{valid:true},tagName:'SELECT',removeAttribute(){},setAttribute(){}}
 const eventDate={name:'eventDate',value:'',required:false,willValidate:false,validity:{valid:true},removeAttribute(){},setAttribute(){}}
 const draftForm={data:[['name','과거 초안의 성함'],['source','메타 광고'],['service',quote.service],['timeStart','15:00'],['quoteProduct','duo']],elements:[legacyName,service,eventDate],querySelectorAll:()=>[]}
 const issues=api.validationIssues(draftForm)
 assert.equal(issues.length,1,'deleted name never blocks inquiry copying')
 assert.equal(issues[0].label,'희망 서비스','standalone service validation is retained')
 service.value=quote.service
 assert.equal(api.validationIssues(draftForm).length,0,'unknown optional dates require no name to proceed')
 eventDate.willValidate=true;eventDate.validity.valid=false;eventDate.validationMessage='날짜를 확인해 주세요'
 assert.equal(api.validationIssues(draftForm)[0].message,'날짜를 확인해 주세요','remaining invalid controls still receive actionable validation')
 eventDate.validity.valid=true
 const saved=api.snapshot(draftForm)
 assert.equal(saved.name,undefined,'temporary inquiry snapshots exclude names')
 assert.equal(saved.quoteProduct,undefined,'restoring schedule must not overwrite the chosen product')
 assert.equal(saved.source,'메타 광고')
 const sourceControl={name:'source',value:''};draftForm.elements.push(sourceControl)
 api.restore(draftForm,{name:'과거 초안의 성함',source:'블로그',service:'다른 상품'})
 assert.equal(legacyName.value,'현재 값','a stale name in an old draft is never restored')
 assert.equal(sourceControl.value,'블로그')
 assert.equal(service.value,quote.service,'restoring schedule does not overwrite the selected service')
 const review={innerHTML:''}
 context.document.querySelector=selector=>selector==='#contactInquiryForm'?draftForm:selector==='#contactReview'?review:null
 api.syncReview()
 assert.doesNotMatch(review.innerHTML,/성함|과거 초안/)
 assert.match(review.innerHTML,/메타 광고/)
 assert.equal(api.syncSubmitState(draftForm),true,'a valid inquiry is immediately ready without a name')
 return api
}
