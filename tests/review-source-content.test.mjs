import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'

const editorial = createRequire(import.meta.url)('../js/detail-editorial.js')
const context = {}
runInNewContext(fs.readFileSync(new URL('../js/review-sources.js', import.meta.url), 'utf8'), context)
const reviews = context.WistiaReviewSources
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))

test('17 unique review sources exist and each title is a literal customer excerpt', () => {
  assert.equal(reviews.length, 17)
  assert.equal(new Set(reviews.map(item => item.id)).size, 17)
  assert.equal(new Set(reviews.map(item => item.src)).size, 17)
  const audit = JSON.parse(fs.readFileSync(new URL('../work/review-source-audit.json', import.meta.url)))
  for (const review of reviews) {
    assert.ok(review.body.includes(review.title), review.id)
    const capture = fs.readFileSync(new URL('../' + review.src, import.meta.url))
    assert.ok(capture.length > 0)
    assert.equal(createHash('sha256').update(capture).digest('hex'), audit.reviews.find(item => item.id === review.id).sha256)
    assert.equal(review.name, review.id === 'review-12' ? '송○○' : '고객님')
    assert.equal(review.meta, '카카오톡 후기')
  }
})

test('review cards retain every customer paragraph and omit unsupported ratings', () => {
  const html = editorial.reviews(reviews)
  assert.doesNotMatch(html, /★★★★★|별점 5점|ed-review-stars/)
  assert.equal((html.match(/class="ed-review-slide(?: is-current)?"/g) || []).length, 19)
  assert.equal((html.match(/data-ed-review-dot="/g) || []).length, 17)
  for (const review of reviews) {
    assert.ok(html.includes('<h3>' + escape(review.title) + '</h3>'), review.id)
    assert.ok(html.includes('<p>' + escape(review.body) + '</p>'), review.id + ' complete body')
    assert.ok(html.includes('data-review-full="' + escape(review.src) + '"'), review.id + ' original link')
  }
})

test('customer text and original-image attributes cannot inject review markup', () => {
  const unsafe = '<img src=x onerror="alert(1)"> & \'quoted\''
  const html = editorial.reviews([{ title: unsafe, body: unsafe + '\nsecond paragraph', name: unsafe, meta: unsafe, src: 'capture.webp" autofocus onfocus="alert(1)' }])
  assert.doesNotMatch(html, /<img|data-review-full="capture.webp" autofocus/)
  assert.ok(html.includes('<h3>' + escape(unsafe) + '</h3>'))
  assert.ok(html.includes('<p>' + escape(unsafe) + '\nsecond paragraph</p>'))
  assert.ok(html.includes('<b>' + escape(unsafe) + '</b>'))
  assert.ok(html.includes('<span>' + escape(unsafe) + '</span>'))
  assert.ok(html.includes('data-review-full="capture.webp&quot; autofocus onfocus=&quot;alert(1)"'))
})
