import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('js/app.js'),quick=read('js/quick-estimate.js')
assert.match(app,/function isLiveRoute/)
assert.match(app,/if\(!isLiveRoute\(routePath\(\)\)\)\{location\.reload\(\);return\}/)
assert.doesNotMatch(app,/replaceState\(history\.state,"","\/"\+location\.search\);route\(\)\}\s*if\(type==="detail"&&key==="solo-film"\)/)
for(const file of ['detail/solo-film.html','event/solo-film.html','detail/duet-film.html','event/duet-film.html'])assert.equal(existsSync(new URL('../'+file,import.meta.url)),false,file)
const extra=app.slice(app.indexOf('function bookingExtraSection('),app.indexOf('function eventBenefitsSection('))
const context={renderProductOption:option=>'<label>'+option.label+'</label>'}
runInNewContext(extra,context)
const markup=context.bookingExtraSection({key:'duet-film'},'making',[{label:'추가 1절 녹음'}],'02')
assert.match(markup,/추가 1절 녹음/)
assert.doesNotMatch(markup,/메이킹|data-film-making|−7만원/)
const packageSection=app.slice(app.indexOf('function productPackageOverview('),app.indexOf('function bookingGuideSection('))
assert.doesNotMatch(packageSection,/package-making-option|녹음 메이킹 필름으로 변경/)
assert.doesNotMatch(quick,/메이킹|choice\('making'/)
assert.doesNotMatch(read('sitemap.xml'),/solo-film|duet-film|wedding|proposal/)
assert.doesNotMatch(read('js/seo-meta.js'),/solo-film|duet-film|메이킹/)
assert.ok(existsSync(new URL('../assets/img/solo-film/solo-film-cover-v2.webp',import.meta.url)),'archived media is preserved')
console.log('Retired making routes, stale variant normalization, no selling option, SEO retirement and preserved media: passed')
