import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {assertManualReviews} from './manual-reviews-fixture.mjs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
assertManualReviews(read('js/app.js'))
const css=read('css/luxury-finish.css'),guide=read('AGENTS.md')
assert.match(css,/\.mas-event-price strong,\.quote-effective,\.quote-effective strong\)\{color:#C62828!important/)
assert.match(css,/\.qe-result \.qe-note b\{color:#C62828!important/)
assert.match(css,/#reviewTrack\{touch-action:pan-y pinch-zoom/)
assert.match(guide,/혜택가와 혜택가 금액[\s\S]*항상 빨간색 `#C62828`/)
assert.match(guide,/승인한 설명 아이콘\/이미지 스타일은 항상/)
console.log('Touch and mouse bidirectional drag, keyboard, gesture hold, cleanup, reduced motion and permanent red benefit prices passed')
