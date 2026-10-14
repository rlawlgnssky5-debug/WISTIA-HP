import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const booking=createRequire(import.meta.url)('../js/booking-availability.js')
const day='2026-10-22',now=Date.parse('2026-10-14T00:00:00+09:00')
const blocks=hour=>[{start:day+'T'+hour+':30:00+09:00',end:day+'T23:59:00+09:00'}]
// Capacity is studio time, independent of the selected product's duration.
for(const key of ['solo','duo']){
 assert.equal(booking.teamsRemaining(day,key,[],now),3)
 assert.equal(booking.teamsRemaining(day,key,blocks('19'),now),2)
 assert.equal(booking.teamsRemaining(day,key,blocks('16'),now),1)
}
assert.equal(booking.slotBlocked('2026-10-18','18:00',60,[]),true)
assert.equal(booking.slotBlocked('2026-10-18','17:00',60,[]),false)
assert.equal(booking.slotBlocked('2026-10-19','13:00',60,[]),true)
assert.equal(booking.slotBlocked(day,'22:00',120,[]),true)
console.log('10 capacity, Sunday closure, weekday closure and full-duration assertions passed')
