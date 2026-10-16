import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
class FormDataMock{
 constructor(form){this.entries=Object.entries(form.values)}
 [Symbol.iterator](){return this.entries[Symbol.iterator]()}
 getAll(key){return this.entries.filter(([k])=>k===key).map(([,v])=>v)}
}
const context={window:{},FormData:FormDataMock,Date,Intl}
runInNewContext(read('js/contact-form.js'),context)
runInNewContext(read('js/booking-wizard.js'),context)
const wizard=context.window.WistiaWizard,html=wizard.render('solo',[])
assert.equal((html.match(/data-wf-step="/g)||[]).length,5)
assert.equal((html.match(/data-wf-goto="/g)||[]).length,5)
assert.doesNotMatch(html,/name="(?:payback|song|songLink|lyrics|name|phone|email)"/)
assert.doesNotMatch(html,/곡 정보와 가사|추가 안 함|data-calendar-close/)
const sources=[...html.matchAll(/name="discovery" value="([^"]+)"/g)].map(m=>m[1])
assert.deepEqual(sources,['인스타','스레드','광고','카페','블로그','지인 추천'])
assert.ok(html.indexOf('가사영상 제작 추가 옵션')<html.indexOf('lyric-video-v2.webp'))
assert.match(html,/완성 음원이 빨리 필요해요!<small class="wf-check-description">3일 이내 받기<\/small>/)
assert.match(html,/스크린에 띄울 가사 영상도 필요해요!/)
assert.doesNotMatch(html,/extraVerse|1절 녹음|60,000원/)
assert.match(html,/선택하실 추가 옵션이 없으시면 바로 다음 단계로 넘어가셔도 됩니다!/)
assert.match(html,/data-calendar-immediate="true"/)
assert.doesNotMatch(html,/aria-label="녹음 날짜 달력" hidden/)
assert.match(html,/name="eventDateUnknown"/)
assert.match(html,/data-booking-calendar-opened="true"/)
assert.ok(html.indexOf('data-wf-recording-range')<html.indexOf('data-calendar-times'))
assert.match(html,/placeholder="궁금한 사항이나 고민되는 부분을 편하게 적어 주세요"/)
const expected=['인원','결혼식 날짜','녹음 날짜','녹음 시간','빠른 작업','추가 옵션','처음 본 곳','총 금액']
let cases=0
for(const people of ['0','1'])for(const lyricVideo of ['0','1'])for(const extraVerse of ['0','1'])for(const rush of ['0','1']){
 const form={values:{people,...(lyricVideo==='1'?{lyricVideo}:{}),...(extraVerse==='1'?{extraVerse}:{}),...(rush==='1'?{rush}:{}),eventDate:'2026-10-24',bookingDate:'2026-10-22',timeStart:'13:00',discovery:'인스타',specialNotes:'검수용 메모'}}
 const amount=(people==='1'?160000:120000)+(lyricVideo==='1'?40000:0)+(rush==='1'?30000:0)
 assert.equal(wizard.quote(form).total,amount)
 const rows=wizard.rows(form)
 assert.deepEqual(Array.from(rows,r=>r[0]),expected)
 assert.equal(rows[1][1],'2026-10-24 (토)')
 assert.equal(rows[2][1],'2026-10-22 (목)')
 assert.equal(rows[3][1],'13:00~'+(people==='1'?'15':'14')+':00')
 assert.equal(rows.at(-1)[1],amount.toLocaleString('ko-KR')+'원')
 const text=wizard.text(form)
 assert.equal(text.split('총 결제 금액 : ').length,2)
 assert.match(text,/^🎙️ 위스티아 \| 신규 상담 신청\n\n📅 녹음 예약\n\n/)
 assert.match(text,/• 날짜 : 2026-10-22 \(목\)/)
 assert.ok(text.includes('• 시간 : '+rows[3][1].replace('~',' ~ ')))
 assert.ok(text.includes('• 구성 : '+rows[0][1]))
 assert.ok(text.includes('• 총 결제 금액 : '+rows.at(-1)[1]))
 assert.ok(text.includes('• 특이사항 : 검수용 메모'))
 assert.doesNotMatch(text,/곡 제목|MR 정보|가사 :|후기 페이백|기본 금액|페이백 합계|1절 녹음/)
 const groups=['📅 녹음 예약','🎵 추가 옵션','💰 결제 금액','💬 고객 정보','📌 결제 안내']
 assert.ok(groups.every((label,index)=>!index||text.indexOf(label)>text.indexOf(groups[index-1])))
 assert.ok(text.includes('• 추가 금액 : '+(amount-(people==='1'?160000:120000)).toLocaleString('ko-KR')+'원'))
 cases++
}
assert.equal(wizard.rows({values:{people:'0',eventDateMode:'unknown'}})[1][1],'미정')
const multiline=wizard.text({values:{people:'0',eventDateMode:'unknown',specialNotes:'첫 번째 질문\n두 번째 질문'}})
assert.match(multiline,/• 결혼식 : 미정/)
assert.match(multiline,/• 특이사항 : 첫 번째 질문\n  두 번째 질문/)
assert.match(multiline,/• 추가 옵션 : 없음/)
assert.equal(wizard.range('22:00','0','1'),'22:00~23:00','retired option does not extend a session')
let extra=false
const ruleContext={window:{document:{querySelector:()=>extra?{}:null}},module:{exports:{}},Date,Intl}
// Export pure rules before browser controller setup for deterministic collision checks
runInNewContext(read('js/booking-availability.js').split(' if(!global.document)return')[0]+'\n})(window)',ruleContext)
const rules=ruleContext.module.exports
assert.equal(rules.duration('solo'),60)
assert.deepEqual(Array.from(rules.timeWindows('solo'),slot=>slot.value),Array.from({length:10},(_,i)=>(13+i)+':00'))
assert.doesNotMatch(context.window.WistiaContact.timeField(),/value="\d{2}:30"/)
const list={closest:()=>({})},time={value:'13:00',options:[{value:''},{value:'13:00'},{value:'13:30'},{value:'17:00',disabled:true},{value:'22:00'},{value:'22:30',disabled:true}],closest:()=>({})}
const controls={'[data-calendar-times]':list,'#contact-time':time,'#contact-bookingDate':{value:'2026-10-22'},'[data-time-date-hint]':{},'[data-time-help]':{},'[data-wf-duration]':{}}
wizard.syncTimes({values:{people:'0'},dataset:{scheduleState:'ready'},querySelector:selector=>controls[selector]})
assert.match(list.innerHTML,/data-wf-time="13:00"/)
assert.match(list.innerHTML,/data-wf-time="22:00"/)
assert.doesNotMatch(list.innerHTML,/13:30|22:30|예약 불가/)
assert.match(list.innerHTML,/data-wf-time="17:00" aria-pressed="false" class="is-closed" disabled aria-label="17:00 마감"><strong>17:00<\/strong><small>마감<\/small>/)
assert.equal((list.innerHTML.match(/data-wf-time=/g)||[]).length,3,'closed hourly times stay visible without restoring half-hour starts')
extra=true
assert.equal(rules.duration('solo'),60)
assert.equal(rules.duration('duo'),120)
assert.equal(rules.slotBlocked('2026-10-22','22:00',rules.duration('solo'),[]),false)
const calendar=context.window.WistiaContact.calendar
const cells=calendar.cells(2026,9,'bookingDate','','2026-10-15',[],'solo')
assert.doesNotMatch(cells,/data-calendar-day="2026-10-0[1-9]"/)
assert.match(cells,/data-calendar-day="2026-10-19"[^>]*disabled/)
console.log('Five-step render, lyric-only options, retired option ignored in 16 price/duration combinations, matching summary/copy, hourly starts and past-day blanks passed')
