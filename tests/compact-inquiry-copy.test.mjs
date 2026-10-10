import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
class FixedDate extends Date{constructor(...args){super(...(args.length?args:['2026-10-08T03:00Z']))}static now(){return Date.parse('2026-10-08T03:00Z')}}
const context={window:{},Date:FixedDate};runInNewContext(readFileSync(new URL('../js/contact-form.js',import.meta.url),'utf8'),context)
const api=context.window.WistiaContact
const details={product:'AR 축가 · SOLO(1인) · 1시간',base:120000,total:120000,options:[],paybacks:[],paybackTotal:0}
const values={eventDateMode:'unknown',bookingDateMode:'date',bookingDate:'2026-10-11'}
const plain=api.text(values,{details})
assert.equal(plain,`[위스티아 상담 요청]
━━━━━━━━━━━━
📦 상품
AR 축가 SOLO (1인·1시간)
추가 옵션 : 없음

💰 금액
예상 금액 : 120,000원
후기 페이백 : 없음
━━━━━━━━━━━━
📅 일정
예식일 : 미정
방문 희망일 : 10월 11일 (일)
방문 희망 시간 : 미정
━━━━━━━━━━━━

※ 예약 가능 여부는 상담에서 확정돼요`)
const full=api.text({...values,eventDateMode:'date',eventDate:'2027-01-09',timeStart:'15:00',source:'메타 광고'},{details:{...details,total:220000,options:[{label:'가사 영상 추가',amount:40000},{label:'추가 1절 녹음',amount:60000}],paybacks:[{label:'블로그 리뷰',amount:30000},{label:'인스타그램 후기',amount:10000}],paybackTotal:40000}})
assert.match(full,/추가 옵션 :\n· 가사 영상 \(\+40,000원\)\n· 추가 1절 녹음 \(\+60,000원\)/)
assert.match(full,/예상 금액 : 220,000원\n기본 120,000원 \+ 옵션 100,000원/)
assert.match(full,/후기 페이백 :\n· 블로그 리뷰 \(−30,000원\)\n· 인스타 후기 \(−10,000원\)\n페이백 합계 : −40,000원/)
assert.match(full,/예식일 : 2027년 1월 9일 \(토\)/);assert.match(full,/방문 희망 시간 : 오후 3시~오후 4시 \(1시간\)/)
assert.doesNotMatch(full,/^\d+\) |결제 예상 금액|페이백 완료 후|최종 확정|WELCOME/gm)
assert.equal((full.match(/[📦💰📅]/gu)||[]).length,3)
for(const line of full.split('\n').filter(line=>line.startsWith('━')))assert.equal(line.length,12)
assert.match(api.text({}, {details:{...details,product:'AR 축가 · DUET(2인) · 2시간'}}),/AR 축가 DUET \(2인·2시간\)/)
assert.match(api.text({}, {details:{...details,product:'축가 스토리 필름'}}),/📦 상품\n축가 스토리 필름/)
assert.match(api.text({...values,eventDateMode:'unknown',eventDate:'2027-01-09',bookingDateMode:'unknown'}),/예식일 : 미정\n방문 희망일 : 미정/)
const integrated=api.render(null,{integrated:true})
assert.ok(integrated.indexOf('id="contact-source"')<integrated.indexOf('id="bookingInquiry"'))
assert.match(integrated,/booking-step">02<\/span><h2 id="sourceTitle">어디에서 보고 오셨나요\?/)
assert.match(integrated,/booking-step">03<\/span><h2 id="scheduleTitle">일정 작성/)
console.log('Exact compact Kakao template, real prices/options/paybacks, short dates/times and source-first form passed')

for(const source of ['', '기타', '카카오톡 채널', '선택 안 함'])assert.doesNotMatch(api.text({...values,source},{details}),/유입 경로/);
for(const source of ['인스타','스레드','메타 광고','카페','블로그','지인 추천'])assert.ok(api.text({...values,source},{details}).includes('유입 경로 : '+source))
