import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {createRequire} from 'node:module'
const context={}
runInNewContext(readFileSync(new URL('../js/review-sources.js',import.meta.url),'utf8'),context)
const reviews=context.WistiaReviewSources
test('new customer review follows all fourteen existing reviews without invented details',()=>{
 assert.equal(reviews.length,15)
 assert.deepEqual(Array.from(reviews.slice(0,14),r=>r.id),['review-17','review-01','review-02','review-03','review-04','review-05','review-06','review-07','review-08','review-09','review-12','review-13','review-14','review-n7'])
 const review=reviews.at(-1)
 assert.equal(review.id,'review-18');assert.equal(review.name,'고객님');assert.equal(review.meta,'카카오톡 후기');assert.ok(review.body.includes(review.title));assert.ok(review.body.includes('만족합니당 수정사항은 따로 없어요!!😊'));assert.ok(existsSync(new URL('../'+review.src.split('?')[0],import.meta.url)))
 assert.ok(Object.isFrozen(reviews));assert.ok(Object.isFrozen(review))
})
test('active carousel includes the added card, original-image link and navigation dot',()=>{
 const html=createRequire(import.meta.url)('../js/detail-editorial.js').reviews(reviews)
 assert.equal((html.match(/data-ed-review-dot="/g)||[]).length,15)
 assert.equal((html.match(/data-review-slide-index="/g)||[]).length,17)
 assert.ok(html.includes('10번 넘게 반복 재생하면서 듣고 그랬어요'));assert.ok(html.includes('data-review-full="assets/img/reviews/review-18.webp?v=20261028-received-review-1"'));assert.ok(!html.includes('★★★★★'))
})
