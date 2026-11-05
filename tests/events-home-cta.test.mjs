import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const eventsMarkup=app.slice(app.indexOf('function renderEventsPage'),app.indexOf('let contactQuote'))
assert.match(eventsMarkup,/<a class="ev2-cta ev2-consult" href="\/">AR 축가 상담하기/)
assert.doesNotMatch(eventsMarkup,/ed-hero-consult/)
assert.doesNotMatch(eventsMarkup,/href="\/event\//)
assert.match(app,/<a class="ed-hero-consult" href="#packageSelection" data-ar-section="packageSelection">AR 축가 자세히 보기/)
assert.doesNotMatch(app,/ed-hero-consult" data-package-inquiry|ed-hero-consult[^>]*>AR 축가 상담하기/)
assert.match(app,/if\(el\.matches\('\.product-inquiry > a'\)&&!el\.closest\('\.wistia-events'\)\)\{e\.preventDefault\(\);showKakaoInquiryDialog\(el\.getAttribute\('href'\)\);return\}/)
assert.doesNotMatch(app,/matches\('\.product-inquiry > a,\.ed-hero-consult'\)/)
for (const page of ['index.html','events.html','contact.html','event/solo.html','event/duo.html','info/faq.html','info/location.html']) {
 assert.match(readFileSync(new URL('../'+page,import.meta.url),'utf8'),/js\/app\.js\?v=20261105-hero-detail-1/)
}
console.log('Home hero scrolls to the type section; events consult button still links home')
