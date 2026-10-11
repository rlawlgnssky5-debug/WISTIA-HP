import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const contact=readFileSync(new URL('../js/contact-form.js',import.meta.url),'utf8')
const definitions=source.slice(0,source.indexOf('const ACTUAL_REVIEW_IMAGES'))
const pricing=source.slice(source.indexOf('const FILM_FORMAT_PRODUCTS'),source.indexOf('const WORKS'))
const calculate=source.slice(source.indexOf('function eventProductOptions('),source.indexOf('function renderProductOption('))
const bridge=source.slice(source.indexOf('function quoteState('),source.indexOf('function showDialog('))
const formatPrice=source.match(/^function filmFormatPrice[^\n]+/m)[0]
const context={window:{},document:{body:{dataset:{page:'home'}}},routePath:()=>'/detail/solo',won:n=>n.toLocaleString('ko-KR')+'원'}
runInNewContext(definitions+pricing+formatPrice+`
let currentEventProduct='solo',currentEventPurpose='',selectedFilmFormat='live',selectedFilmPeople=1
let selectedOptions=new Set(),selectedEvents=new Set(),optionQuantities={},chosenOption=''
`+calculate+bridge+contact,context)
const quoteFor=state=>{context.testState=state;runInNewContext('setQuoteState(testState)',context);return context.consultationText()}
const numbers=text=>[...text.matchAll(/^(\d+)\) /gm)].map(match=>Number(match[1]))
const selected={key:'solo',options:[],events:['voice-photo-consent','blog','reaction','instagram']}
const text=quoteFor(selected)
assert.deepEqual(numbers(text),[1,2,3])
assert.match(text,/\n\n2\) 결제 안내\n기본 가격 : 120,000원\n결제 예상 금액 : 120,000원\n\n/)
assert.doesNotMatch(text,/활용 동의|선택한 할인|할인 합계/)
assert.match(text,/3\) 선택한 후기 페이백\n블로그 리뷰 30,000원\n현장 리액션 영상 10,000원\n인스타그램 후기 10,000원\n후기 페이백 합계 : 50,000원\n\n페이백 완료 후 혜택가 : 70,000원/)
assert.doesNotMatch(text,/이미 반영된 할인/)
assert.match(text,/조건을 모두 충족/)
assert.match(text,/조건 충족 확인 후 별도 지급\n결제 시 미리 차감하지 않습니다$/)
assert.doesNotMatch(text,/🇼|WELCOME|^• |30,000원 \/|null|undefined|빠른 작업/gm)
const form=context.window.WistiaContact.text({name:'예전 이름',source:'메타 광고',service:'AR 축가 사전녹음',eventDate:'2026-11-15',eventDateMode:'date',bookingDateMode:'unknown',timeStart:'15:00'},{text})
assert.deepEqual(numbers(form),[])
assert.match(form,/📅 일정\n예식일 : 11월 15일 \(일\)\n방문 희망일 : 미정\n방문 희망 시간 : 오후 3시~오후 4시 \(1시간\)\n━━━━━━━━━━━━\n유입 경로 : 메타 광고/)
assert.equal(form.split('예상 금액 :').length,2)
assert.doesNotMatch(form,/예전 이름|희망 서비스 :|WELCOME|선택한 구성과 가격/)
const empty=quoteFor({key:'solo',options:[],events:[]})
assert.match(empty,/추가 옵션 :\n선택 없음/)
assert.match(empty,/결제 예상 금액 : 120,000원/)
assert.match(empty,/후기 페이백 합계 : 0원$/)
assert.doesNotMatch(empty,/페이백 완료 후 혜택가|조건을 모두 충족/)
assert.deepEqual(numbers(context.window.WistiaContact.text({service:'상담 후 결정',eventDateMode:'unknown',bookingDateMode:'unknown'})),[])
for(const key of ['solo','duo','duet-film']){
 for(let mask=0;mask<64;mask++){
  const events=Array.from(context.window.WistiaQuote.events()).filter((_,index)=>mask&(1<<index)).map(event=>event.key)
  const state={key,options:[],events},result=context.window.WistiaQuote.preview(state),copied=quoteFor(state)
  assert.match(copied,new RegExp('결제 예상 금액 : '+context.won(result.finalPrice)))
  assert.match(copied,new RegExp('후기 페이백 합계 : '+context.won(result.payback)))
  assert.deepEqual(numbers(copied),[1,2,3])
  const inquiry=context.window.WistiaContact.text({source:'인스타'}, {text:copied})
  assert.match(inquiry,new RegExp('예상 금액 : '+context.won(result.finalPrice)))
  assert.match(inquiry,result.payback?new RegExp('페이백 합계 : −'+context.won(result.payback)):/후기 페이백 : 없음/)
  assert.deepEqual(numbers(inquiry),[])
  if(result.payback)assert.match(copied,new RegExp('페이백 완료 후 혜택가 : '+context.won(result.effectivePrice)))
 }
}
const options=quoteFor({key:'duo',options:['lyrics-video','extra-verse'],events:[]})
assert.match(options,/추가 옵션 :\n가사 영상 추가 \+40,000원\n추가 1절 녹음 \+60,000원/)
assert.match(options,/추가 옵션 합계 : \+100,000원/)
assert.match(options,/결제 예상 금액 : 260,000원/)
console.log('Numbered quote and inquiry, line-separated options/benefits, no stale names, and 192 price combinations passed')
