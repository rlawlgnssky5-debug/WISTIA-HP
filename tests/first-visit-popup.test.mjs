import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
const require = createRequire(import.meta.url)
const pricing = require('../js/package-pricing.js')
const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8')

test('선착순 coupon no longer changes a quote or the inquiry copy', () => {
  const plain = pricing.quote({package: 'B', bookingDate: '2026-12-31'}, '2026-10-27')
  const limited = pricing.quote({package: 'B', yearEndCoupon: '1', bookingDate: '2026-12-31'}, '2026-10-27')
  assert.equal(limited.total, plain.total)
  assert.equal(limited.discounts.some(d => d.key === 'yearEnd'), false)
  assert.equal(pricing.quote({package: 'B', firstVisit: '1', yearEndCoupon: '1'}, '2026-10-27').total, 150000)
  assert.equal(pricing.quote({package: 'A', firstVisit: '1', yearEndCoupon: '1'}).total, 90000)
  assert.equal(pricing.couponClaimCard('yearEndCoupon'), '')
  const wizard = read('js/booking-wizard.js')
  assert.match(wizard, /function offerFirstVisit/)
  assert.match(wizard, /name="firstVisit"/)
  assert.doesNotMatch(wizard, /couponClaimCard\('yearEndCoupon'\)/)
  assert.doesNotMatch(wizard, /선착순/)
  const app = read('js/app.js')
  assert.doesNotMatch(app, /couponClaimCard\(/)
  assert.doesNotMatch(app, /선착순/)
})
