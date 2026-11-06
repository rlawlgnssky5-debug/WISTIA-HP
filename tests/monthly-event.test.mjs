import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
const pricing = createRequire(import.meta.url)('../js/package-pricing.js')
const wizard = readFileSync(new URL('../js/booking-wizard.js', import.meta.url), 'utf8')
const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8')
const nov = '2026-11-06'
const dec = '2026-12-01'

test('November books PREMIUM and DUET at 20,000 off, even when the recording day is outside November', () => {
  assert.equal(pricing.quote({package:'C'}, nov).total, 200000)
  assert.equal(pricing.quote({package:'C', firstVisit:'1'}, nov).total, 180000)
  assert.equal(pricing.quote({package:'C', firstVisit:'1', bookingDate:'2026-12-10'}, nov).total, 170000)
  assert.equal(pricing.quote({package:'C', bookingDate:'2026-12-20', timeStart:'13:00'}, nov).total, 190000)
  assert.equal(pricing.quote({package:'D'}, nov).total, 220000)
  assert.equal(pricing.quote({package:'D', firstVisit:'1'}, nov).total, 200000)
  assert.equal(pricing.quote({package:'D', firstVisit:'1', bookingDate:'2026-12-10'}, nov).total, 190000)
  assert.equal(pricing.quote({package:'B'}, nov).total, 170000)
  assert.equal(pricing.quote({package:'B', firstVisit:'1'}, nov).total, 150000)
  assert.equal(pricing.quote({package:'B', firstVisit:'1', bookingDate:'2026-12-10'}, nov).total, 140000)
  assert.equal(pricing.quote({package:'A', firstVisit:'1', bookingDate:'2026-12-10', timeStart:'13:00'}, nov).total, 90000)
  const stacked = pricing.quote({package:'C', firstVisit:'1', bookingDate:'2026-12-10'}, nov)
  assert.deepEqual(stacked.discounts.map(item => item.key), ['first', 'monthly', 'advance1'])
  assert.equal(stacked.discounts[1].label, '11월 이벤트 쿠폰')
  assert.equal(stacked.discounts.some(item => item.key === 'weekday'), false)
})

test('the coupon is gone from December 1 and from the offer list outside November', () => {
  assert.equal(pricing.activeMonthlyEvent('2026-11-30').name, '11월 이벤트 쿠폰')
  assert.equal(pricing.activeMonthlyEvent(dec), null)
  assert.equal(pricing.quote({package:'C'}, dec).total, 220000)
  assert.equal(pricing.quote({package:'D', firstVisit:'1', bookingDate:'2027-01-10'}, dec).total, 210000)
  assert.equal(pricing.quote({package:'C', bookingDate:'2026-11-20'}, dec).discounts.some(item => item.key === 'monthly'), false)
  const offers = (reference) => {
    const event = pricing.activeMonthlyEvent(reference)
    return event ? event.name : ''
  }
  assert.equal(offers(nov), '11월 이벤트 쿠폰')
  assert.equal(offers(dec), '')
  assert.match(wizard, /activeMonthlyEvent/)
  assert.match(app, /activeMonthlyEvent/)
})
