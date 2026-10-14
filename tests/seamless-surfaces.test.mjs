import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const app=read('js/app.js'),css=read('css/seamless-surfaces.css'),index=read('index.html')
const home=app.slice(app.indexOf('function renderWeddingHome('),app.indexOf('function renderHome('))
assert.doesNotMatch(home,/we-hero-photo|making-male\.webp/)
assert.match(home,/AQ9Z1flOUPo\/maxresdefault\.jpg/)
assert.match(css,/\.we-service figure img\{[^}]*aspect-ratio:4\/5[^}]*object-fit:cover/)
assert.match(css,/\.we-service:nth-child\(2\) figure img\{object-position:80% center/)
assert.doesNotMatch(css,/\.we-service:nth-child\(2\) figure\{grid-column:1\/-1/)
assert.match(css,/#arRatioExperience\.wistia-ar[^}]*background:transparent!important/)
assert.match(css,/--section-fade:linear-gradient/)
assert.match(css,/\.we-service:focus-visible \.we-service-link\{outline:2px/)
assert.match(index,/seamless-surfaces\.css\?v=20261014-detail-polish-16j/)
const poster=app.slice(app.indexOf('function arRecordingPoster('),app.indexOf('function arCommerceDetail('))
const context={img:(src,alt)=>`<img src="${src}" alt="${alt}">`,escapeHtml:value=>value}
runInNewContext(poster,context)
const markup=context.arRecordingPoster()
assert.equal((markup.match(/<img /g)||[]).length,1)
assert.match(markup,/class="detail-poster-image"/)
assert.match(markup,/src="assets\/detail\/point01-recording\.webp\?v=16f"/)
assert.match(markup,/width="860" height="2236"/)
assert.match(markup,/loading="lazy" decoding="async"/)
assert.match(markup,/POINT 01 한 소절씩 녹음하는 장면/)
assert.doesNotMatch(markup,/object-fit|process-no-people\/06\.svg/)
console.log('Hero removal, uncropped couple, POINT 01 recording poster and seamless accessible surfaces passed')
