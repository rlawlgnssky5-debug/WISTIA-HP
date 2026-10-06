import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('js/app.js'),css=read('css/detail-consistency.css')
const context={mobileArDesignIcon:()=>'<svg></svg>'}
runInNewContext(app.match(/^function detailPriceReason[^\n]+/m)[0]+app.slice(app.indexOf('function mobileArNotices('),app.indexOf('// Read-only disclosure shares')),context)
const price=context.detailPriceReason()
assert.match(price,/<span class="we-section-tag price-reason-label">POINT 02 · 가격 안내/)
assert.match(price,/<u class="wistia-emphasis-underline">서울이 아닌 부천<\/u>에서 운영해 가격 부담을 낮췄습니다/)
assert.match(price,/보컬 디렉팅·수작업 보정·믹싱·마스터링은 기본 구성에 포함합니다/)
assert.doesNotMatch(price,/<br>|가격에 대한 이야기|기본 가격과 추가 옵션/,'approved home copy remains identical without forced line breaks')
for(const story of [false,true]){
 const notice=context.mobileArNotices(story)
 assert.equal((notice.match(/class="mas-rush-notice"/g)||[]).length,1)
 assert.match(notice,/요청 시 3일 이내 · 추가 3만원/)
 assert.match(notice,/제작 일정과 자료 준비 상태를 상담에서 확인한 뒤, 가능한 경우에만 진행합니다/)
 assert.doesNotMatch(notice,/<input|<form|data-option|data-price|data-rush|type="checkbox"/,'notice never becomes a pricing option')
 assert.match(notice,story?/약 14일/:/최대 7일 이내/,'regular delivery promises remain')
 assert.match(notice,/3회까지 무료/)
 assert.match(notice,/4회차부터 회당 1만원/)
}
assert.match(css,/:is\(\.we-home \.we-affordability \.we-location,\.detail-price-reason\)/,'one visual rule covers home and detail')
assert.match(css,/background:var\(--palette-charcoal\)!important;color:var\(--palette-paper\)!important/)
assert.match(css,/overflow-wrap:anywhere;white-space:normal!important/,'small viewports wrap naturally')
console.log('Home/detail price-story parity and conditional read-only 3-day/30,000 notice passed')
