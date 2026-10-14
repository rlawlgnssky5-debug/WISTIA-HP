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
assert.ok(html.indexOf('① 가사 영상 추가')<html.indexOf('lyric-video-v2.webp'))
assert.ok(html.indexOf('lyric-video-v2.webp')<html.indexOf('② 1절 녹음 추가'))
assert.match(html,/data-calendar-immediate="true"/)
assert.doesNotMatch(html,/aria-label="녹음 날짜 달력" hidden/)
assert.match(html,/name="eventDateUnknown"/)
assert.match(html,/data-booking-calendar-opened="true"/)
const expected=['인원','결혼식 날짜','녹음 날짜','녹음 시간','빠른 작업','추가 옵션','처음 본 곳','총 금액']
let cases=0
for(const people of ['0','1'])for(const lyricVideo of ['0','1'])for(const extraVerse of ['0','1'])for(const rush of ['0','1']){
 const form={values:{people,...(lyricVideo==='1'?{lyricVideo}:{}),...(extraVerse==='1'?{extraVerse}:{}),...(rush==='1'?{rush}:{}),eventDate:'2026-10-24',bookingDate:'2026-10-22',timeStart:'13:00',discovery:'인스타',specialNotes:'검수용 메모'}}
 const amount=(people==='1'?160000:120000)+(lyricVideo==='1'?40000:0)+(extraVerse==='1'?60000:0)+(rush==='1'?30000:0)
 assert.equal(wizard.quote(form).total,amount)
 const rows=wizard.rows(form)
 assert.deepEqual(Array.from(rows,r=>r[0]),expected)
 assert.equal(rows[1][1],'2026-10-24 (토)')
 assert.equal(rows[2][1],'2026-10-22 (목)')
 assert.equal(rows[3][1],'13:00~'+(people==='1'?'15':'14')+':'+(extraVerse==='1'?'30':'00'))
 assert.equal(rows.at(-1)[1],amount.toLocaleString('ko-KR')+'원')
 const text=wizard.text(form)
 assert.equal(text.split('총 금액 : ').length,2)
 assert.ok(text.indexOf('특이사항 : 검수용 메모')<text.indexOf('인원 : '))
 assert.doesNotMatch(text,/곡 제목|MR 정보|가사 :|후기 페이백|기본 금액|페이백 합계/)
 assert.ok(rows.every(([label,value])=>text.includes(label+' : '+value)))
 cases++
}
assert.equal(wizard.rows({values:{people:'0',eventDateMode:'unknown'}})[1][1],'미정')
assert.equal(wizard.range('22:00','0','1'),'22:00~23:30')
let extra=false
const ruleContext={window:{document:{querySelector:()=>extra?{}:null}},module:{exports:{}},Date,Intl}
// Export pure rules before browser controller setup for deterministic collision checks
runInNewContext(read('js/booking-availability.js').split(' if(!global.document)return')[0]+'\n})(window)',ruleContext)
const rules=ruleContext.module.exports
assert.equal(rules.duration('solo'),60)
extra=true
assert.equal(rules.duration('solo'),90)
assert.equal(rules.duration('duo'),150)
assert.equal(rules.slotBlocked('2026-10-22','22:00',rules.duration('solo'),[]),true)
const calendar=context.window.WistiaContact.calendar
const cells=calendar.cells(2026,9,'bookingDate','','2026-10-15',[],'solo')
assert.doesNotMatch(cells,/data-calendar-day="2026-10-0[1-9]"/)
assert.match(cells,/data-calendar-day="2026-10-19"[^>]*disabled/)
console.log('Five-step render, exact referral order, immediate calendar, 16 price/duration combinations, matching summary/copy, no song/payback, extra-verse collision and past-day blanks passed')
