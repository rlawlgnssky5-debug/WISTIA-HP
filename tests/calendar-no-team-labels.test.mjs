import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/contact-form.js',import.meta.url),'utf8')
const scope={window:{WistiaBooking:{dayClosed:date=>date==='2026-10-23',teamsRemaining:()=>{throw Error('display must not query remaining teams')}}},Date,Intl}
runInNewContext(source,scope)
for(const product of ['solo','duo']){
 const html=scope.window.WistiaContact.calendar.cells(2026,9,'bookingDate','','2026-10-15',[],product)
 assert.doesNotMatch(html,/팀 남음|one-team|has-one-team/)
 assert.match(html,/data-calendar-day="2026-10-22"[^>]+aria-label="2026년 10월 22일 \(목\)"/)
 assert.match(html,/data-calendar-day="2026-10-23"[^>]+disabled[^>]+aria-label="2026년 10월 23일 \(금\) · 마감"/)
 assert.match(html,/<small>마감<\/small>/)
 for(const date of ['19','20','21']){
  const cell=html.match(new RegExp('<button[^>]+data-calendar-day="2026-10-'+date+'"[\\s\\S]*?<\\/button>'))[0]
  assert.match(cell,/disabled/)
  assert.match(cell,/ · 휴무/)
  assert.doesNotMatch(cell,/마감|<small>/)
 }
}
assert.doesNotMatch(source,/팀 남음|scarceTeamLabel/)
console.log('No visible or accessible remaining-team labels, preserved date closures and independent booking rules passed')
