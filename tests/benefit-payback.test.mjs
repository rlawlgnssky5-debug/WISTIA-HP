import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const context={window:{}}
const definitions=source.slice(0,source.indexOf('const ACTUAL_REVIEW_IMAGES'))
const pricing=source.slice(source.indexOf('const FILM_FORMAT_PRODUCTS'),source.indexOf('const WORKS'))
const format=source.match(/^function filmFormatPrice[^\n]+/m)[0]
const calculation=source.slice(source.indexOf('function eventProductOptions('),source.indexOf('function renderProductOption('))
runInNewContext(definitions+pricing+format+`
let currentEventProduct='solo',currentEventPurpose='',selectedFilmFormat='live',selectedFilmPeople=1
let selectedOptions=new Set(),selectedEvents=new Set(),optionQuantities={},chosenOption=''
`+calculation,context)
const preview=(key,events)=>{context.state={key,events};return runInNewContext('currentEventProduct=state.key;selectedEvents=new Set(state.events);calculate()',context)}
const cashback=['blog','reaction','cafe','instagram']
for(const [key,base] of [['solo',120000],['duo',160000],['duet-film',350000]]){
 const only=preview(key,cashback)
 assert.equal(only.finalPrice,base,'cashback cannot lower payment')
 assert.equal(only.payback,60000)
 // Stale drafts holding the removed usage-consent or weekday discounts change nothing.
 const all=preview(key,[...cashback,'voice-photo-consent','weekday'])
 assert.equal(all.discount,0)
 assert.equal(all.finalPrice,base)
 assert.equal(all.effectivePrice,base-60000)
}
assert.doesNotMatch(source,/voice-photo-consent|활용 동의/,'the usage-consent discount is removed')
assert.doesNotMatch(source,/syncWeekdayDiscount|key:'weekday'/,'the abolished weekday discount cannot return through stale choices')
const footer=source.slice(source.indexOf('function footer('),source.indexOf('function footer(')+2500)
assert.match(footer,/완성도는 높이고, 부담은 줄인 가격을 약속드립니다/)
assert.doesNotMatch(source,/경기도 부천에서 본식에 전할 축가를 함께 준비합니다/)
console.log('Payback/payment separation, four paybacks without the consent discount, ignored legacy weekday discount and approved footer passed')
