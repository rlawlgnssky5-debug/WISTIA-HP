import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {assertManualReviews} from './manual-reviews-fixture.mjs'
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const definitions=app.slice(app.indexOf('const ACTUAL_REVIEW_IMAGES'),app.indexOf('const SOLO_REVIEW_IMAGES'))
const images=runInNewContext(definitions+';ACTUAL_REVIEW_IMAGES')
assert.equal(images.length,16)
assert.equal(new Set(images).size,16)
assert.equal(images[5],'assets/img/reviews/review-06-clean.webp')
for(const src of images)assert.ok(existsSync(new URL('../'+src,import.meta.url)),src)
assert.equal(images[11],'assets/img/reviews/review-12.webp')
assert.equal(images[15],'assets/img/reviews/review-16.webp')
assertManualReviews(app)
console.log('All 11 previous and 5 new reviews available, manual control preserved')
