import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const source=readFileSync(new URL('../js/contact-form.js',import.meta.url),'utf8'),window={}
runInNewContext(source,{window})
const list=[...source.match(/const publicHolidays=new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/'(\d{4}-\d{2}-\d{2})'/g)].map(m=>m[1])
assert.equal(new Set(list).size,64)
for(const [year,count]of [[2026,22],[2027,24],[2028,18]])assert.equal(list.filter(d=>d.startsWith(year+'-')).length,count)
for(const value of list){
 const date=window.WistiaContact.calendar.parseDate(value);assert.ok(date,value)
 for(const key of ['eventDate','bookingDate']){
  const cells=window.WistiaContact.calendar.cells(date.getUTCFullYear(),date.getUTCMonth(),key,'','2026-01-01',[])
  const cell=cells.match(new RegExp('<button[^>]*data-calendar-day="'+value+'"[^>]*>.*?</button>'))[0]
  assert.match(cell,/calendar-red-day/);assert.doesNotMatch(cell,/title=|data-holiday|설날|추석|대체공휴일|노동절|제헌절/)
 }
}
for(const date of ['2026-10-10','2027-05-15','2028-01-08']){
 const d=new Date(date+'T12:00Z'),cells=window.WistiaContact.calendar.cells(d.getUTCFullYear(),d.getUTCMonth(),'eventDate','','2026-01-01')
 assert.doesNotMatch(cells.match(new RegExp('<button[^>]*data-calendar-day="'+date+'"[^>]*>.*?</button>'))[0],/calendar-red-day/,'ordinary Saturdays keep the default colour')
}
assert.ok(list.includes('2027-05-03')&&list.includes('2027-07-19')&&list.includes('2028-10-05'),'current substitute dates included')
assert.ok(list.includes('2026-06-03')&&list.includes('2028-04-12'),'election holidays included')
assert.ok(!list.includes('2026-09-28')&&!list.includes('2028-01-03'),'unannounced temporary holidays and nonexistent New Year substitute must not be invented')
assert.match(window.WistiaContact.render(null,{integrated:true}),/class="calendar-sunday">일<\/span><span>월/)
console.log('64 Korean public-holiday dates, Sunday-only header, ordinary Saturdays and no displayed holiday names passed')
