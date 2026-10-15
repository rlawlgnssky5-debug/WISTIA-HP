import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const context={window:{},Date,Intl}
runInNewContext(read('js/contact-form.js'),context)
runInNewContext(read('js/booking-wizard.js'),context)
const wizard=context.window.WistiaWizard
for(const key of ['solo','duo']){
 const html=wizard.render(key,[])
 assert.match(html,/<div data-wf-date-view>/)
 assert.match(html,/<div class="wf-time-view" data-wf-time-view hidden>/)
 assert.match(html,/<button type="button" data-wf-change-date>/)
 assert.match(html,/날짜 다시 선택/)
 assert.ok(html.indexOf('data-wf-selected-date')<html.indexOf('data-calendar-times'))
 assert.ok(html.indexOf('data-calendar-times')<html.indexOf('data-wf-rush'))
}
// Stable clock avoids making UI transition assertions dependent on the test day.
context.window.WistiaContact.calendar.selectableDate=value=>/^2026-10-(22|23)$/.test(value)
const date={value:'',disabled:false},calendarView={},timeView={},selected={}
const controls={'[data-wf-date-view]':calendarView,'[data-wf-time-view]':timeView,'#contact-bookingDate':date,'[data-wf-selected-date]':selected}
const form={dataset:{},querySelector:selector=>controls[selector]}
wizard.syncSchedule(form)
assert.equal(calendarView.hidden,false)
assert.equal(timeView.hidden,true)
date.value='2026-10-22'
wizard.syncSchedule(form,'time')
assert.equal(calendarView.hidden,true)
assert.equal(timeView.hidden,false)
assert.equal(selected.textContent,'2026년 10월 22일 (목)')
wizard.syncSchedule(form,'date')
assert.equal(calendarView.hidden,false)
assert.equal(timeView.hidden,true)
assert.equal(date.value,'2026-10-22','returning to dates must preserve the canonical form value')
wizard.syncSchedule(form)
assert.equal(calendarView.hidden,false,'asynchronous availability updates must not close the reopened calendar')
wizard.syncSchedule(form,'time')
assert.equal(timeView.hidden,false,'selecting the same date must reopen times')
date.value='2026-10-23'
wizard.syncSchedule(form,'time')
assert.equal(selected.textContent,'2026년 10월 23일 (금)')
date.value='2026-10-19'
wizard.syncSchedule(form,'time')
assert.equal(calendarView.hidden,false,'invalid/closed weekday values must return to date selection')
assert.equal(timeView.hidden,true)
assert.doesNotMatch(read('js/booking-availability.js'),/월·화·수(?:는 | )마감/)
console.log('In-place date/time panels, back/same-date/reselection/async states and closed weekday copy passed')
