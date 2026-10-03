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
 const all=preview(key,[...cashback,'voice-photo-consent','weekday'])
 assert.equal(all.discount,20000)
 assert.equal(all.finalPrice,base-20000)
 assert.equal(all.effectivePrice,base-80000)
}
const date={value:'',disabled:true},card={classList:{toggle(name,value){this.unavailable=value}}}
const choice={disabled:false,checked:false,closest:()=>card}
context.document={querySelector:selector=>selector==='#contact-bookingDate'?date:choice}
runInNewContext(source.slice(source.indexOf('function syncWeekdayDiscount(){'),source.indexOf('// The question dialog')),context)
for(const [value,eligible] of [['2026-10-05',true],['2026-10-06',true],['2026-10-07',true],['2026-10-08',true],['2026-10-09',false],['2026-10-10',false],['2026-10-11',false]]){
 date.value=value;date.disabled=false;choice.checked=true
 runInNewContext("selectedEvents.add('weekday');syncWeekdayDiscount()",context)
 assert.equal(choice.disabled,!eligible,value)
 assert.equal(choice.checked,eligible,value)
 assert.equal(runInNewContext("selectedEvents.has('weekday')",context),eligible,value)
}
date.disabled=true;context.syncWeekdayDiscount();assert.equal(choice.disabled,false,'unknown date keeps a conditional estimate available')
const footer=source.slice(source.indexOf('function footer('),source.indexOf('function footer(')+2500)
assert.match(footer,/완성도는 높이고, 부담은 줄인 가격을 약속드립니다/)
assert.doesNotMatch(source,/경기도 부천에서 본식에 전할 축가를 함께 준비합니다/)
console.log('Payback/payment separation, all six benefits, Mon–Thu eligibility and global approved footer passed')
