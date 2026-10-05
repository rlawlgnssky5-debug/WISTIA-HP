import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const context={window:{}}
runInNewContext(read('js/contact-form.js'),context)
const api=context.window.WistiaContact
const control=(name,value,options={})=>({name,value,required:false,willValidate:true,validity:{valid:true},tagName:'INPUT',attributes:{},setAttribute(key,value){this.attributes[key]=value},removeAttribute(key){delete this.attributes[key]},hasAttribute(key){return key in this.attributes},getAttribute(key){return this.attributes[key]},...options})
const name=control('name','',{required:true}),service=control('service','',{required:true,tagName:'SELECT'}),date=control('bookingDate','',{willValidate:false})
const form={id:'contactInquiryForm',elements:[name,service,date],data:[['name','과거 초안'],['service','상담 후 결정']]}
let issues=api.validationIssues(form)
assert.deepEqual(Array.from(issues,issue=>[issue.label,issue.message]),[['희망 서비스','선택해 주세요']])
assert.equal(name.attributes['aria-invalid'],undefined,'removed name is not validated')
service.value='   ';assert.equal(api.validationIssues(form).length,1,'standalone service still needs a real selection')
service.value='상담 후 결정';assert.equal(api.validationIssues(form).length,0,'no name is needed to proceed')
assert.equal(name.attributes['aria-invalid'],undefined)
date.willValidate=true;assert.equal(api.validationIssues(form).length,0,'optional blank date remains valid')
date.validity.valid=false;date.validationMessage='날짜를 확인해 주세요'
assert.equal(api.validationIssues(form)[0].message,'날짜를 확인해 주세요')
assert.match(api.render(),/<form id="contactInquiryForm" novalidate/)
const source=read('js/app.js')
assert.match(source,/<form id="contactInquiryForm" novalidate/)
const handler=source.split('\n').find(line=>line.startsWith('document.addEventListener("submit",'))
let submitHandler,copyCount=0,refreshCount=0,shown
Object.assign(context,{document:{addEventListener(type,fn){submitHandler=fn}},refreshInquiryQuote(){refreshCount++},contactQuote:null,FormData:class{constructor(form){this.data=form.data}[Symbol.iterator](){return this.data[Symbol.iterator]()}},copyConsultationAndShowDialog(text){copyCount++;assert.match(text,/희망 서비스 : 상담 후 결정/);assert.doesNotMatch(text,/성함|과거 초안/)},showContactValidationDialog(issues){shown=issues}})
runInNewContext(handler,context)
service.value='';date.validity.valid=true
let prevented=false
submitHandler({target:form,preventDefault(){prevented=true}})
assert.equal(prevented,true);assert.equal(copyCount,0);assert.equal(refreshCount,0);assert.equal(shown[0].control,service)
service.value='상담 후 결정';submitHandler({target:form,preventDefault(){}})
assert.equal(copyCount,1);assert.equal(refreshCount,1)
submitHandler({target:{id:'anotherForm'},preventDefault(){throw Error('unrelated form')}})
assert.equal(copyCount,1)
const popup=source.slice(source.indexOf('function showContactValidationDialog('),source.indexOf('function openVideo('))
date.form=form
context.document.querySelectorAll=()=>[]
const editor={querySelector(selector){return selector==='button'?{dataset:{},setAttribute(){},querySelector(){return {textContent:''}}}:{focus(){}}},addEventListener(){}}
Object.assign(context,{escapeHtml:value=>String(value).replaceAll('<','&lt;').replaceAll('>','&gt;'),kakao:()=> 'https://pf.kakao.com/_GbExjX/chat',showDialog(html,type){shown={html,type}},dialog:{setAttribute(){},querySelector(){return editor}},lastDialogFocus:null})
runInNewContext(popup,context)
context.showContactValidationDialog([{control:date,label:'<희망 예약일>',message:'<입력>'}])
assert.match(shown.html,/&lt;희망 예약일&gt;/);assert.doesNotMatch(shown.html,/<희망 예약일>/)
assert.match(shown.html,/문의 양식 없이 바로 상담할래요/)
assert.match(shown.html,/href="https:\/\/pf.kakao.com\/_GbExjX\/chat" target="_blank" rel="noopener noreferrer" data-close/)
assert.match(shown.html,/<form id="contactValidationForm" novalidate/)
assert.match(shown.html,/<input type="text"[^>]+data-inquiry-edit="0"/)
assert.match(shown.html,/type="submit"[^>]+inquiry-edit-submit/)
assert.equal(context.lastDialogFocus,date)
const flowCss=read('css/consultation-flow.css')
const mobileSidebar=flowCss.match(/@media\(max-width:900px\)\{\s*(?:\/\*[\s\S]*?\*\/\s*)?body\[data-page=event\] \.consultation-flow \.booking-price-sidebar\{([^}]+)\}/)?.[1]
assert.ok(mobileSidebar,'mobile quote card rule must be covered')
assert.match(mobileSidebar,/pointer-events:auto/,'copy button and privacy link must receive mouse/touch input')
assert.doesNotMatch(mobileSidebar,/pointer-events:none/)
assert.match(read('index.html'),/consultation-flow.css\?v=20261004-inquiry-pointer-fix-1/)
console.log('No name gate, service/date validation popup, optional dates, preserved draft, safe direct Kakao link and copy guard passed')
