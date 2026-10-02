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
assert.match(index,/seamless-surfaces\.css\?v=20261002-portrait-fill-1/)
const poster=app.slice(app.indexOf('function arRecordingPoster('),app.indexOf('function arCommerceDetail('))
const context={img:(src,alt)=>`<img src="${src}" alt="${alt}">`}
runInNewContext(poster,context)
const markup=context.arRecordingPoster()
assert.equal((markup.match(/<img /g)||[]).length,2)
assert.equal((markup.match(/<li>/g)||[]).length,3)
assert.match(markup,/06-mixing\.webp/)
assert.match(markup,/구간별 녹음 방식을 설명하는 이미지/)
console.log('Hero removal, uncropped couple, compact recording/program poster and seamless accessible surfaces passed')
