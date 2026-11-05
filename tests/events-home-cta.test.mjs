import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const eventsMarkup=app.slice(app.indexOf('function renderEventsPage'),app.indexOf('let contactQuote'))
assert.match(eventsMarkup,/<a class="ev2-cta ev2-consult" href="\/">AR 축가 상담하기/)
assert.doesNotMatch(eventsMarkup,/ed-hero-consult/)
assert.doesNotMatch(eventsMarkup,/href="\/event\//)
assert.doesNotMatch(app,/ed-hero-consult/)
assert.doesNotMatch(app,/AR 축가 자세히 보기/)
assert.match(app,/<a class="ed-hero-listen" href="#arcTuning"/)
assert.match(app,/보정 전후 들어보기/)
assert.match(app,/<a class="ed-hero-price-jump" href="#packageSelection"/)
assert.match(app,/타입·가격 바로 보기/)
assert.match(app,/if\(el\.matches\('\.product-inquiry > a'\)&&!el\.closest\('\.wistia-events'\)\)\{e\.preventDefault\(\);showKakaoInquiryDialog\(el\.getAttribute\('href'\)\);return\}/)
for (const page of ['index.html','events.html','contact.html','event/solo.html','event/duo.html','info/faq.html','info/location.html']) {
 const html=readFileSync(new URL('../'+page,import.meta.url),'utf8')
 assert.match(html,/js\/app\.js\?v=20261105-merge-152-1/)
 assert.match(html,/js\/inquiry-funnel\.js\?v=20261105-merge-152-1/)
 assert.match(html,/css\/canvas-780\.css\?v=20261105-merge-152-1/)
 assert.match(html,/js\/package-pricing\.js\?v=20261105-merge-152-1/)
 assert.match(html,/css\/inquiry-ux-51\.css\?v=20261105-tier-blurb-1/)
}
console.log('Home hero consult button is gone; events consult still links home')
