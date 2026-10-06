import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {assertManualReviews} from './manual-reviews-fixture.mjs'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('js/app.js'),css=read('css/phone-capture-fixes.css')
const home=app.slice(app.indexOf('function renderWeddingHome'),app.indexOf('function renderWeddingHome')+11000)
assert.doesNotMatch(home,/cta\('문의 작성'|빠른 견적 ↗|studio-meta-actions/)
// Latest home request explicitly restores the fixed estimate, but not hero CTAs.
assert.doesNotMatch(css,/body\[data-page="home"\] #floatingPrice\{display:none\}/)
assert.match(css,/#floatingKakao :is\(#floatingPrice,#floatingKakaoChat\)\{display:flex/)
assert.match(css,/\.mas-format-badge\{display:none\}/)
assert.match(css,/\.process-flow\{display:none\}/)
assert.match(css,/\.we-carousel-controls\{display:none\}/)
assert.match(css,/white-space:nowrap/)
assert.match(css,/\.we-hero>\.we-meta>span\{max-width:none;text-align:center\}/)
assert.match(css,/\.mas-brand\{[^\n]*border:0[^\n]*background:none;box-shadow:none/)
assert.match(css,/\.mas-brand>img\{width:30px;height:30px/)
assert.match(css,/\.qe-scroll\{flex:1 1 auto;min-height:0;overflow-y:auto;touch-action:pan-y/)
assert.match(css,/\.review-captures\{overscroll-behavior:auto;touch-action:pan-y\}/)
assert.match(app,/menu-open'\)&&!e.target.closest\('#mainMenu,#menuToggle'\)/)
assert.match(app,/target\?\.id==='homeCases'[\s\S]*?innerHeight\*\.35/)
const directions=app.slice(app.indexOf('function homeDirectionsSection'),app.indexOf('function studioSculpture'))
assert.doesNotMatch(directions,/주차비 지원|주차 요금/)
assert.match(directions,/공영주차장을 이용하실 수 있습니다/)
assertManualReviews(app)
console.log('Eleven phone requests, scoped removals, vertical scrolling and manual bidirectional review control passed')
