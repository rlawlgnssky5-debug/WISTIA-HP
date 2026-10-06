import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {assertInquiryWithoutName} from './inquiry-without-name-fixture.mjs'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
assertInquiryWithoutName(read('js/contact-form.js'))
const source=read('js/app.js')
const withoutApprovedNotice=source.slice(0,source.indexOf('function mobileArNotices('))+source.slice(source.indexOf('function mobileDetailEvents('))
assert.doesNotMatch(withoutApprovedNotice,/contact-name|const FILM_RUSH_OPTION|"rush"|3일 이내|빠른 작업/,'removed name focus and rush option must not leak outside the newly approved read-only notice')
const definitions=source.slice(0,source.indexOf('const ACTUAL_REVIEW_IMAGES'))
const pricing=source.slice(source.indexOf('const FILM_FORMAT_PRODUCTS'),source.indexOf('const WORKS'))
const calculate=source.slice(source.indexOf('function eventProductOptions('),source.indexOf('function renderProductOption('))
const formatPrice=source.match(/^function filmFormatPrice[^\n]+/m)[0]
const context={}
runInNewContext(definitions+pricing+formatPrice+'\nlet currentEventProduct="solo",currentEventPurpose="",selectedFilmFormat="live",selectedFilmPeople=1,selectedOptions=new Set(),selectedEvents=new Set(),optionQuantities={}\n'+calculate+'\nthis.options=PRODUCT_OPTIONS;this.calculate=calculate',context)
for(const key of ['solo','duo','wedding','duet-film','solo-film','proposal']){
 assert.equal(context.options[key].some(option=>option.key==='rush'),false,key+' exposes no rush option')
 context.key=key
 runInNewContext('currentEventProduct=key;selectedOptions=new Set(["rush"]);this.result=calculate()',context)
 assert.equal(context.result.optionEntries.length,0,'old rush selections are ignored for '+key)
 assert.equal(context.result.optionPrice,0,'removed rush selection cannot charge '+key)
}
console.log('No name collection/draft/copy/focus and no rush option/legacy charge across all inquiry products passed')
