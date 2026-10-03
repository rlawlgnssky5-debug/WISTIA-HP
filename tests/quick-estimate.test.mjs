import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const question=readFileSync(new URL('../js/quick-estimate.js',import.meta.url),'utf8')
const definitions=source.slice(0,source.indexOf('const ACTUAL_REVIEW_IMAGES'))
const pricing=source.slice(source.indexOf('const FILM_FORMAT_PRODUCTS'),source.indexOf('const WORKS'))
const calculate=source.slice(source.indexOf('function eventProductOptions('),source.indexOf('function renderProductOption('))
const bridge=source.slice(source.indexOf('function quoteState('),source.indexOf('function showDialog('))
const formatPrice=source.match(/^function filmFormatPrice[^\n]+/m)[0]
const context={window:{},document:{body:{dataset:{page:'home'}}},routePath:()=>'/detail/duo',won:n=>n.toLocaleString('ko-KR')+'원'}
runInNewContext(definitions+pricing+formatPrice+`
let currentEventProduct='solo',currentEventPurpose='',selectedFilmFormat='live',selectedFilmPeople=1
let selectedOptions=new Set(),selectedEvents=new Set(),optionQuantities={saved:2},chosenOption='saved'
`+calculate+bridge,context)
const api=context.window.WistiaQuote
const baseline=runInNewContext('JSON.stringify({state:quoteState(),optionQuantities,chosenOption})',context)
let copiedQuote=''
context.copyConsultationAndShowDialog=async text=>{copiedQuote=text}
await api.consultKakao({key:'duo',format:'live',options:['lyrics-video'],events:['blog']})
assert.match(copiedQuote,/DUET\(2인\) · 2시간/)
assert.match(copiedQuote,/최종 예상 가격 : 170,000원/)
assert.match(copiedQuote,/가사 영상 추가 \+40,000원/)
assert.equal(runInNewContext('JSON.stringify({state:quoteState(),optionQuantities,chosenOption})',context),baseline,'Kakao handoff must preserve the open inquiry draft')
const cases=[
 [{key:'solo'},120000],
 [{key:'duo'},160000],
 [{key:'duo',options:['lyrics-video','bride-entrance'],events:['blog']},210000],
 [{key:'solo',options:['lyrics-video','bride-entrance','groom-entrance','rush'],events:['blog','reaction','cafe','instagram']},210000],
 [{key:'solo',events:['voice-photo-consent']},110000],
 [{key:'duo',events:['voice-photo-consent']},150000],
 [{key:'solo',events:['blog','reaction','cafe','instagram','voice-photo-consent']},50000],
 [{key:'duet-film',events:['voice-photo-consent']},340000],
 [{key:'duet-film',format:'making',events:['voice-photo-consent']},340000],
 [{key:'duet-film'},350000],
 [{key:'duet-film',format:'making'},350000],
 [{key:'duet-film',format:'making',options:['bride-entrance'],events:['cafe']},380000],
 [{key:'solo-film',format:'making'},120000],
 [{key:'duet-film',options:['bride-entrance','groom-entrance','rush'],events:['blog','reaction','cafe','instagram']},400000]
]
for(const [state,expected] of cases){
 const result=api.preview({format:'live',options:[],events:[],...state})
 assert.equal(result.finalPrice,expected,JSON.stringify(state))
 assert.equal(runInNewContext('JSON.stringify({state:quoteState(),optionQuantities,chosenOption})',context),baseline,'preview must not mutate the open calculator')
}
assert.equal(api.context().key,'duo')
assert.equal(api.options('duet-film').some(o=>o.key==='lyrics-video'),false)
assert.equal(api.events().length,5)
assert.equal(api.events().find(event=>event.key==='voice-photo-consent').discount,10000)
context.state={key:'duo',format:'live',options:['lyrics-video','bride-entrance'],events:['blog']}
runInNewContext('setQuoteState(state)',context)
assert.match(context.consultationText(),/최종 예상 가격 : 210,000원/)
assert.match(context.consultationText(),/가사 영상 추가 \+40,000원/)
assert.match(context.consultationText(),/블로그 리뷰 −30,000원/)
context.state={key:'duet-film',format:'making',options:[],events:[]}
runInNewContext('setQuoteState(state)',context)
assert.doesNotMatch(context.consultationText(),/메이킹|−70,000원/)
assert.match(context.consultationText(),/영상 구성 : 스토리형 영상/)
assert.match(context.consultationText(),/최종 예상 가격 : 350,000원/)
assert.match(question,/try\{await api\(\)\.consultKakao\(state\)/)
assert.match(question,/data-qe-consult>카카오톡 문의 →/)
assert.doesNotMatch(question,/api\(\)\.apply\(state\)/,'quote-to-Kakao must not navigate to a form')
assert.match(question,/contextPath!==location\.pathname/)
assert.match(question,/addEventListener\('cancel'/)
assert.doesNotMatch(question,/<input|<textarea|window\.open|pf\.kakao\.com/)

// Exercise the real question click handler, including explicit skip choices
const handlers=new Map()
const modal={open:false,innerHTML:'',setAttribute(){},addEventListener:(name,fn)=>handlers.set(name,fn),querySelector:()=>({focus(){},scrollTop:0}),showModal(){this.open=true},close(){this.open=false}}
const questionContext={window:{WistiaQuote:api},location:{pathname:'/'},document:{activeElement:null,createElement:()=>modal,getElementById:()=>null,body:{append(){},classList:{add(){},remove(){}}}}}
runInNewContext(question,questionContext)
const tap=async(value,attribute='')=>{const button={dataset:{qeChoice:value},hasAttribute:name=>name===attribute};await handlers.get('click')({target:{closest:()=>button}})}
questionContext.window.WistiaQuickEstimate.open()
await tap('ar');await tap('solo');await tap('bride-entrance')
assert.match(modal.innerHTML,/3 \/ 4/,'paid options retain the multiple-choice stage')
assert.match(modal.innerHTML,/data-qe-choice="bride-entrance" aria-pressed="true"/)
await tap('none-options')
assert.match(modal.innerHTML,/4 \/ 4/,'no extras immediately advances to events')
await tap('blog')
assert.match(modal.innerHTML,/4 \/ 4/,'benefit choices retain the multiple-choice stage')
await tap('none-events')
assert.match(modal.innerHTML,/선택하신 견적입니다/,'no benefits immediately advances to the result')
assert.match(modal.innerHTML,/<strong>120,000원<\/strong>/)
assert.doesNotMatch(modal.innerHTML,/<dt>신부 입장곡 추가|<dt>블로그 리뷰/,'skip choices clear previously selected items')
await tap('', 'data-qe-back');await tap('', 'data-qe-back')
assert.match(modal.innerHTML,/data-qe-choice="none-options" aria-pressed="true"/,'going back preserves the no-extras answer')
questionContext.window.WistiaQuickEstimate.close();questionContext.window.WistiaQuickEstimate.open()
await tap('film')
assert.match(modal.innerHTML,/2 \/ 3/,'film skips the retired format question')
assert.doesNotMatch(modal.innerHTML,/메이킹|data-qe-choice="making"/)
await tap('', 'data-qe-back')
assert.match(modal.innerHTML,/어떤 축가를 준비하시나요/,'back skips the retired format question too')
await tap('film');await tap('none-options');await tap('none-events')
assert.match(modal.innerHTML,/<strong>350,000원<\/strong>/,'story film keeps its base price after both skips')
await tap('', 'data-qe-consult')
assert.equal(modal.open,false,'Kakao handoff closes the estimate dialog')
assert.match(copiedQuote,/최종 예상 가격 : 350,000원/)
assert.equal(questionContext.location.pathname,'/','Kakao handoff does not navigate to a form')
console.log('Quick estimate shared prices, preview isolation, options, benefits, consultation text and handoff passed')
