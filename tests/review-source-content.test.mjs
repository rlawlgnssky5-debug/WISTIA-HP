import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'

const editorial = createRequire(import.meta.url)('../js/detail-editorial.js')
const context = {}
runInNewContext(fs.readFileSync(new URL('../js/review-sources.js', import.meta.url), 'utf8'), context)
const reviews = context.WistiaReviewSources
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))

test('review sources have unique captures, literal excerpts and valid highlight bounds', () => {
  assert.equal(reviews.length, 15)
  assert.equal(new Set(reviews.map(item => item.id)).size, reviews.length)
  assert.equal(new Set(reviews.map(item => item.src)).size, reviews.length)
  for (const review of reviews) {
    assert.ok(review.body.includes(review.title), review.id)
    const capture = fs.readFileSync(new URL('../' + review.src, import.meta.url))
    assert.ok(capture.length > 0)
    const [left, top, width, height] = review.highlight
    assert.ok(left >= 0 && top >= 0 && width > 0 && height > 0 && left + width <= 100 && top + height <= 100, review.id)
    assert.equal(review.name, review.id === 'review-12' ? '송○○' : '고객님')
    assert.equal(review.meta, '카카오톡 후기')
  }
})

test('review cards show literal excerpts and keep original links', () => {
  const html = editorial.reviews(reviews)
  assert.doesNotMatch(html, /★★★★★|별점 5점|ed-review-stars/)
  assert.equal((html.match(/class="ed-review-slide(?: is-current)?"/g) || []).length, reviews.length + 2)
  assert.equal((html.match(/data-ed-review-dot="/g) || []).length, reviews.length)
  for (const review of reviews) {
    assert.ok(html.includes('<h3>' + escape(review.title) + '</h3>'), review.id)
    assert.ok(!html.includes(escape(review.body)), review.id + ' full text stays in the original')
    assert.ok(html.includes('data-review-full="' + escape(review.src) + '"'), review.id + ' original link')
  }
})

test('customer text and original-image attributes cannot inject review markup', () => {
  const unsafe = '<img src=x onerror="alert(1)"> & \'quoted\''
  const html = editorial.reviews([{ title: unsafe, body: unsafe + '\nsecond paragraph', name: unsafe, meta: unsafe, src: 'capture.webp" autofocus onfocus="alert(1)' }])
  assert.doesNotMatch(html, /<img|data-review-full="capture.webp" autofocus/)
  assert.ok(html.includes('<h3>' + escape(unsafe) + '</h3>'))
  assert.ok(!html.includes('second paragraph'))
  assert.ok(html.includes('<b>' + escape(unsafe) + '</b>'))
  assert.ok(html.includes('<span>' + escape(unsafe) + '</span>'))
  assert.ok(html.includes('data-review-full="capture.webp&quot; autofocus onfocus=&quot;alert(1)"'))
})
