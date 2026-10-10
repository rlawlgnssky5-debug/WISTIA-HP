import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const state={window:{}}
runInNewContext(read('js/contact-form.js'),state)
const api=state.window.WistiaContact
const control={name:'source',value:'',type:'text',tagName:'INPUT',required:true,willValidate:true,validity:{valid:true},attributes:{required:'',maxlength:'200',autocomplete:'off'},hasAttribute(key){return key in this.attributes},getAttribute(key){return this.attributes[key]},setAttribute(key,value){this.attributes[key]=value},removeAttribute(key){delete this.attributes[key]},dispatchEvent(){changes++}}
const form={elements:[control],requestSubmit(){submissions++}}
control.form=form
const button=()=>({dataset:{},attributes:{},label:{innerHTML:''},setAttribute(key,value){this.attributes[key]=value},querySelector(){return this.label}})
const mainButton=button(),modalButton=button()
state.document={querySelector:()=>form,querySelectorAll:()=>[mainButton]}
assert.equal(api.syncSubmitState(),false)
assert.equal(mainButton.attributes['aria-label'],'작성한 내용으로 카카오톡 문의하기')
assert.equal(control.attributes['aria-invalid'],undefined,'state updates do not mark untouched fields invalid')
control.value='   ';assert.equal(api.syncSubmitState(),false)
control.value='검수';assert.equal(api.syncSubmitState(),true)
assert.equal(mainButton.attributes['aria-label'],'작성한 내용으로 카카오톡 문의하기')
assert.doesNotMatch(mainButton.label.innerHTML,/inquiry-submit-next|<br>/)
control.value='"<img src=x>'
const escaped=api.validationEditor([{control,label:'<유입 경로>',message:'<입력>'}])
assert.match(escaped,/&lt;유입 경로&gt;/);assert.match(escaped,/value="&quot;&lt;img src=x&gt;"/);assert.doesNotMatch(escaped,/<img/)
assert.match(escaped,/maxlength="200" autocomplete="off"/)
const select={...control,tagName:'SELECT',options:[{value:'',textContent:'선택',selected:true},{value:'<AR>',textContent:'AR & 축가',selected:false}]}
assert.match(api.validationEditor([{control:select,label:'서비스',message:'선택해 주세요'}]),/<select[^>]+>[\s\S]*value="&lt;AR&gt;">AR &amp; 축가/)
const date={...control,type:'date',attributes:{min:'2026-01-01',max:'2027-01-01'}}
assert.match(api.validationEditor([{control:date,label:'희망 예약일',message:'확인해 주세요'}]),/type="date"[^>]+min="2026-01-01" max="2027-01-01"/)
let changes=0,submissions=0,closed=0,shown,focused=false
const listeners={},error={textContent:''},input={id:'inquiry-edit-0',dataset:{inquiryEdit:'0'},value:'',closest(){return this},setAttribute(){},focus(){focused=true}}
const editor={querySelector(selector){return selector==='button'?modalButton:selector.endsWith('-error')?error:input},addEventListener(type,callback){listeners[type]=callback}}
Object.assign(state,{dialog:{setAttribute(){},querySelector(){return editor}},escapeHtml:value=>value,kakao:()=> 'https://pf.kakao.com/_GbExjX/chat',showDialog(html,type){shown={html,type}},closeDialog(){closed++},Event:class{constructor(type,options){this.type=type;this.bubbles=options.bubbles}}})
const app=read('js/app.js')
const channel={config:{accounts:{kakao:'http://pf.kakao.com/_GbExjX/chat'}},KAKAO_FALLBACK:'http://pf.kakao.com/_GbExjX/chat'}
runInNewContext(app.split('\n').find(line=>line.startsWith('function kakao(){')),channel)
assert.equal(channel.kakao(),'https://pf.kakao.com/_GbExjX/chat')
channel.config.accounts.kakao='https://pf.kakao.com/_GbExjX/chat';assert.equal(channel.kakao(),'https://pf.kakao.com/_GbExjX/chat')
runInNewContext(app.slice(app.indexOf('function showContactValidationDialog('),app.indexOf('function openVideo(')),state)
control.value='';state.showContactValidationDialog(api.validationIssues(form))
assert.equal(focused,true);assert.equal(mainButton.dataset.submitState,'incomplete')
listeners.submit({preventDefault(){}});assert.equal(submissions,0);assert.equal(closed,0)
input.value=' ';listeners.input({target:input});assert.equal(control.value,' ');assert.equal(modalButton.dataset.submitState,'incomplete')
input.value='인스타';listeners.input({target:input})
assert.equal(control.value,'인스타');assert.equal(error.textContent,'');assert.equal(mainButton.dataset.submitState,'ready');assert.equal(modalButton.dataset.submitState,'ready')
assert.equal(changes,2)
listeners.submit({preventDefault(){}});assert.equal(submissions,1);assert.equal(closed,1)
state.showKakaoInquiryDialog('/event/duo')
assert.match(shown.html,/href="\/event\/duo" data-close>문의 양식 작성할게요!/)
assert.match(shown.html,/href="https:\/\/pf.kakao.com\/_GbExjX\/chat" target="_blank" rel="noopener noreferrer" data-close>바로 상담할래요!/)
assert.match(app,/el.id==='floatingKakaoChat'\|\|el.matches\('\.product-inquiry > a'\)/)
assert.match(read('css/inquiry-choice-editor.css'),/max-height:calc\(100dvh/)
assert.match(read('index.html'),/inquiry-choice-editor\.css\?v=20261005-inquiry-choice-editor-1/)
console.log('Inquiry choice, editable missing fields, state labels, escaping, constraints, whitespace and native resubmit passed')
