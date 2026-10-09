import assert from 'node:assert/strict'
import {readFileSync,readdirSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const window={};runInNewContext(read('js/contact-form.js'),{window})
const api=window.WistiaContact,calendar=api.calendar
assert.equal(calendar.displayDate('2026-10-16'),'2026년 10월 16일 (금)')
assert.equal(calendar.displayDate('2026-10-15'),'2026년 10월 15일 (목)')
for(const invalid of ['',undefined,'2026-02-30','2026-13-01','2026-1-1','not a date']){
 assert.equal(calendar.parseDate(invalid),null)
 assert.equal(calendar.displayDate(invalid),'날짜를 선택해 주세요')
 assert.doesNotMatch(calendar.displayDate(invalid),/\(\s*\)/)
}
for(const [value,operating] of [['2026-10-11',true],['2026-10-12',false],['2026-10-13',false],['2026-10-14',false],['2026-10-15',true],['2026-10-16',true],['2026-10-17',true]]){
 assert.equal(calendar.selectableDate(value,'bookingDate','2026-10-08'),operating,value)
 assert.equal(calendar.selectableDate(value,'eventDate','2026-10-08'),true,'wedding dates allow every weekday')
}
assert.equal(calendar.selectableDate('2026-10-07','eventDate','2026-10-08'),false)
assert.equal(calendar.selectableDate('2026-10-07','bookingDate','2026-10-08'),false)
assert.equal(calendar.selectableDate('2026-10-08','bookingDate','2026-10-08'),true,'today is included')
const cells=calendar.cells(2026,9,'bookingDate','2026-10-16','2026-10-08',[])
assert.equal((cells.match(/data-calendar-day=/g)||[]).length,31)
for(const date of ['2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05','2026-10-06','2026-10-07','2026-10-12','2026-10-13','2026-10-14']){
 const cell=cells.match(new RegExp('<button[^>]*data-calendar-day="'+date+'"[^>]*>.*?</button>'))[0]
 assert.match(cell,/ disabled/);assert.doesNotMatch(cell,/<small>/)
}
assert.match(cells,/is-selected" data-calendar-day="2026-10-16"[^>]*aria-label="2026년 10월 16일 \(금\)"[^>]*aria-pressed="true"/)
assert.match(cells,/is-today" data-calendar-day="2026-10-08"[^>]*aria-current="date"/)
for(const date of cells.matchAll(/data-calendar-day="([^"]+)"/g))assert.match(date[1],/^\d{4}-\d{2}-\d{2}$/)
assert.equal((calendar.cells(2028,1,'eventDate','','2026-10-08').match(/data-calendar-day=/g)||[]).length,29,'leap years')
const markup=api.render(null,{integrated:true})
assert.doesNotMatch(markup,/type="date"|\(\s*\)/)
assert.match(markup,/calendar-inline" id="calendar-bookingDate"/)
assert.match(markup,/calendar-popup" id="calendar-eventDate"[^>]* hidden/)
assert.doesNotMatch(markup,/calendar-operating|booking-availability-note|목·금·토·일 운영 · 월·화·수 마감|목·금·토·일만 운영해요|data-booking-refresh|예약 가능 시간 다시 확인/)
assert.match(markup,/data-booking-status role="status" aria-live="polite" hidden/)
for(const options of [{},{embedded:true},{integrated:true}]){
 const form=api.render(null,options)
 assert.doesNotMatch(form,/calendar-operating|booking-availability-note|data-booking-refresh|예약 가능 시간 다시 확인/,'every shared inquiry rendering removes the notices')
 assert.match(form,/data-booking-status role="status" aria-live="polite" hidden/)
}
assert.doesNotMatch(read('js/quick-estimate.js'),/calendar-operating|booking-availability-note|예약 가능 시간 다시 확인/,'quick estimate uses no separate operating notice')
assert.match(markup,/data-calendar-times role="radiogroup"/)
for(const key of ['eventDate','bookingDate'])assert.match(markup,new RegExp('name="'+key+'" type="text" hidden tabindex="-1" disabled'))
// Copy formatting remains separate from the Korean UI weekday display.
assert.match(api.text({bookingDateMode:'date',bookingDate:'2026-10-16'}),/방문 희망일 : 10월 16일 \(금\)\n/)
assert.match(api.text({bookingDateMode:'date',bookingDate:'2026-10-16'}),/\(금\)/)
for(const page of ['index.html','contact.html',...readdirSync(new URL('../event/',import.meta.url)).filter(x=>x.endsWith('.html')).map(x=>'event/'+x)]){
 const html=read(page)
 for(const asset of ['js/contact-form.js','js/booking-availability.js','css/booking-availability.css'])assert.ok(html.includes(asset+'?v=20261010-detail-polish-11'),page+' '+asset)
}
assert.match(read('api/availability.js'),/module.exports/,'CommonJS endpoint stays intact')
console.log('Custom calendars: Korean weekdays, ISO values, closed weekdays, past dates, today/selection, leap months and cache versions passed')
