import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const css=readFileSync(new URL('../css/price-sidebar.css',import.meta.url),'utf8')
const definitions=source.slice(0,source.indexOf('const ACTUAL_REVIEW_IMAGES'))
const pricing=source.slice(source.indexOf('const FILM_FORMAT_PRODUCTS'),source.indexOf('const WORKS'))
const calculation=source.slice(source.indexOf('function eventProductOptions('),source.indexOf('function renderProductOption('))
const formatPrice=source.match(/^function filmFormatPrice[^\n]+/m)[0]
const moneyFormatters=source.match(/^const (?:won|shortWon) =[^\n]+/gm).join('\n')
const updater=source.slice(source.indexOf('function updatePrice(){'),source.indexOf('// The question dialog'))
const options=source.slice(source.indexOf('function renderProductOption('),source.indexOf('function bookingBaseSection('))
const benefits=source.slice(source.indexOf('function eventBenefitsSection('),source.indexOf('function renderEvent('))
const nodes=new Map()
const node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',hidden:false});return nodes.get(id)}
const context={window:{},document:{querySelector:node},inquiryUndecided:false,refreshInquiryQuote:()=>{},finderPriceContext:()=>null,img:(src,alt)=>`<img src="${src}" alt="${alt}">`}
runInNewContext(definitions+pricing+formatPrice+'\n'+moneyFormatters+`
let currentEventProduct='duet-film',currentEventPurpose='',selectedFilmFormat='live',selectedFilmPeople=2
let selectedOptions=new Set(),selectedEvents=new Set(),optionQuantities={},chosenOption=''
`+calculation+options+benefits+updater,context)
const set=state=>{context.state=state;runInNewContext(`currentEventProduct=state.key;selectedFilmFormat=state.format||'live';selectedOptions=new Set(state.options||[]);selectedEvents=new Set(state.events||[]);updatePrice()`,context)}
set({key:'duet-film'})
assert.equal(node('#mobilePrice').textContent,'35만원')
assert.equal(node('#quoteRegular').hidden,true,'no fabricated regular price or discount')
set({key:'duet-film',format:'making',options:['extra-verse'],events:['blog']})
assert.equal(node('#mobilePrice').textContent,'41만원')
assert.equal(node('#quoteBeforePrice').textContent,'41만원')
assert.equal(node('#quoteOptions').textContent,'+6만원')
assert.equal(node('#quoteDiscount').textContent,'선택 없음')
assert.equal(node('#quotePayback').textContent,'3만원')
assert.equal(node('#quoteEffective').textContent,'380,000원')
assert.equal(node('#eventDiscountTotal').textContent,'페이백 3만원')
assert.equal(node('#quoteRegular').hidden,true)
assert.match(node('#bookingSummary').innerHTML,/1절 녹음 추가<\/dt><dd class="plus">\+60,000원/)
assert.match(node('#bookingSummary').innerHTML,/결제 예상 금액<\/dt><dd>410,000원/)
assert.doesNotMatch(node('#bookingSummary').innerHTML,/price-formula/)
assert.doesNotMatch(node('#bookingSummary').innerHTML,/메이킹|−70,000/)
set({key:'duet-film',format:'making',options:['extra-verse'],events:['blog','reaction','cafe','instagram']})
assert.equal(node('#mobilePrice').textContent,'41만원')
assert.equal(node('#quoteEffective').textContent,'350,000원')
assert.equal(node('#eventDiscountTotal').textContent,'페이백 6만원')
assert.match(context.eventBenefitsSection('03'),/후기 페이백 최대 6만원/)
set({key:'solo',options:['lyrics-video','extra-verse']})
assert.equal(node('#mobilePrice').textContent,'22만원')
assert.equal(node('#quoteRegular').hidden,true,'deselecting benefits clears the strike-through')
for(const key of ['lyrics-video']){
 const markup=context.renderProductOption({key,label:key,detail:'설명',price:40000})
 assert.match(markup,/has-option-photo/)
 const src=markup.match(/src="([^"]+)"/)[1]
 assert.ok(existsSync(new URL('../'+src,import.meta.url)))
}
assert.doesNotMatch(context.renderProductOption({key:'extra-verse',label:'1절 녹음 추가',detail:'설명',price:60000}),/img|option-photo/)
set({key:'solo',options:['rush']})
assert.equal(node('#mobilePrice').textContent,'12만원','an old rush selection does not add a removed fee')
assert.equal(node('#quoteOptions').textContent,'0원')
assert.doesNotMatch(node('#bookingSummary').innerHTML,/빠른 작업|30,000원/)
assert.doesNotMatch(source,/cta\('문의 작성','\/event\/solo'\)/,'phone capture request removes the home inquiry button')
const final=source.match(/'<section class="arc-section arc-final"><h2>축가는 직접,[^\n]+/)[0]
assert.doesNotMatch(final,/action\('카카오톡 상담'/)
assert.doesNotMatch(context.priceSidebarSection(),/<button|data-inquiry-jump/)
assert.match(context.eventBenefitsSection('03'),/후기 참여 이벤트/)
assert.equal((context.eventBenefitsSection('03').match(/class="event-terms"/g)||[]).length,4)
assert.doesNotMatch(context.eventBenefitsSection('03'),/<details|<summary/)
context.inquiryUndecided=true
set({key:'solo',options:['lyrics-video'],events:['blog']})
assert.equal(node('#mobilePrice').textContent,'미정')
assert.doesNotMatch(node('#bookingSummary').innerHTML,/120,000|130,000/)
assert.match(node('#bookingSummary').innerHTML,/상담 후 안내/)
assert.match(css,/grid-template-columns:minmax\(0,1fr\) 300px/)
assert.match(css,/position:sticky!important/)
assert.match(css,/@media\(max-width:900px\)/)
console.log('Price sidebar, truthful strike-through, live benefit totals, option photos, navigation and signed breakdown passed')
