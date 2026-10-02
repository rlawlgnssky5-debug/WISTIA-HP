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
const context={window:{},document:{querySelector:node},finderPriceContext:()=>null,img:(src,alt)=>`<img src="${src}" alt="${alt}">`}
runInNewContext(definitions+pricing+formatPrice+'\n'+moneyFormatters+`
let currentEventProduct='duet-film',currentEventPurpose='',selectedFilmFormat='live',selectedFilmPeople=2
let selectedOptions=new Set(),selectedEvents=new Set(),optionQuantities={},chosenOption=''
`+calculation+options+benefits+updater,context)
const set=state=>{context.state=state;runInNewContext(`currentEventProduct=state.key;selectedFilmFormat=state.format||'live';selectedOptions=new Set(state.options||[]);selectedEvents=new Set(state.events||[]);updatePrice()`,context)}
set({key:'duet-film'})
assert.equal(node('#mobilePrice').textContent,'35만원')
assert.equal(node('#quoteRegular').hidden,true,'no fabricated regular price or discount')
set({key:'duet-film',format:'making',options:['bride-entrance'],events:['blog']})
assert.equal(node('#mobilePrice').textContent,'29만원')
assert.equal(node('#quoteBeforePrice').textContent,'32만원')
assert.equal(node('#quoteOptions').textContent,'−3만원')
assert.equal(node('#quoteDiscount').textContent,'−3만원')
assert.equal(node('#eventDiscountTotal').textContent,'선택 할인 −3만원')
assert.equal(node('#quoteRegular').hidden,false)
assert.match(node('#bookingSummary').innerHTML,/<small>추가 옵션<\/small>−30,000원/)
set({key:'duet-film',format:'making',options:['bride-entrance'],events:['blog','reaction','cafe','instagram']})
assert.equal(node('#mobilePrice').textContent,'26만원')
assert.equal(node('#eventDiscountTotal').textContent,'선택 할인 −6만원')
assert.match(context.eventBenefitsSection('03'),/최대 6만원 할인/)
set({key:'solo',options:['lyrics-video','groom-entrance']})
assert.equal(node('#mobilePrice').textContent,'20만원')
assert.equal(node('#quoteRegular').hidden,true,'deselecting benefits clears the strike-through')
for(const key of ['lyrics-video','bride-entrance','groom-entrance','rush']){
 const markup=context.renderProductOption({key,label:key,detail:'설명',price:40000})
 assert.match(markup,/has-option-photo/)
 const src=markup.match(/src="([^"]+)"/)[1]
 assert.ok(existsSync(new URL('../'+src,import.meta.url)))
}
assert.match(source,/cta\('가격 보기','\/event\/solo'\)/)
const final=source.match(/'<section class="arc-section arc-final"><h2>축가는 직접,[^\n]+/)[0]
assert.doesNotMatch(final,/action\('카카오톡 상담'/)
assert.match(context.priceSidebarSection(),/type="submit"/)
assert.match(css,/grid-template-columns:minmax\(0,1fr\) 300px/)
assert.match(css,/position:sticky!important/)
assert.match(css,/@media\(max-width:900px\)/)
console.log('Price sidebar, truthful strike-through, live benefit totals, option photos, navigation and signed breakdown passed')
