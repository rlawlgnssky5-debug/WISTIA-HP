import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {createRequire} from 'node:module'
const source=readFileSync(new URL('../js/contact-form.js',import.meta.url),'utf8'),window={}
runInNewContext(source,{window,Date,Intl})
const html=window.WistiaContact.render(null,{integrated:true})
const field=html.match(/<fieldset class="contact-field contact-time-field">([\s\S]*?)<\/fieldset>/)[1]
assert.match(field,/^<legend>희망 시간<\/legend><p data-time-date-hint/)
const values=[...field.matchAll(/<option value="([^"]*)"/g)].map(m=>m[1])
assert.deepEqual(values,['',...Array.from({length:10},(_,i)=>`${13+i}:00`)])
assert.doesNotMatch(field,/:30|30분/)
const rules=createRequire(import.meta.url)('../js/booking-availability.js')
// Preserve precise Notion intervals, but close a day when only a half-hour start fits.
const blocks=[{start:'2026-10-11T00:00:00+09:00',end:'2026-10-11T13:30:00+09:00'},{start:'2026-10-11T14:30:00+09:00',end:'2026-10-12T00:00:00+09:00'}]
assert.equal(rules.slotBlocked('2026-10-11','13:30',60,blocks),false)
assert.equal(rules.dayClosed('2026-10-11','solo',blocks,Date.parse('2026-10-08T03:00Z')),true)
const partial=[{start:'2026-10-11T16:30:00+09:00',end:'2026-10-11T18:30:00+09:00'}]
for(const [time,blocked] of [['15:00',false],['16:00',true],['17:00',true],['18:00',true],['19:00',false]])assert.equal(rules.slotBlocked('2026-10-11',time,60,partial),blocked)
const message=window.WistiaContact.text({bookingDateMode:'date',bookingDate:'2027-10-10',timeStart:'15:00'})
assert.match(message,/희망 시간 : 15~16시\n/);assert.doesNotMatch(message,/30분/)
console.log('Time guidance order, whole-hour options, precise interval overlap, hourly-only closed day and Kakao whole-hour summary passed')
