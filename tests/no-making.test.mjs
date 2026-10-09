import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('js/app.js'),quick=read('js/quick-estimate.js')
const routeGuard=app.slice(app.indexOf('function route('),app.indexOf(' const previousScrollY=preserveScroll?'))+'}'
for(const [path,expected] of [
 ['/detail/solo-film','/'],['/detail/solo-film/duo','/'],
 ['/event/solo-film','/'],['/event/solo-film/making','/'],['/choose/solo-film','/'],
 ['/detail/duet-film/making','/detail/duet-film'],
 ['/event/duet-film/making','/event/duet-film'],
 ['/choose/duet-film/making','/choose/duet-film'],
 ['/event/duet-film','/event/duet-film'],['/event/solo','/event/solo']
]){
 let current=path
 const query='?utm_source=instagram&utm_campaign=wedding'
 const context={window:{},document:{body:{classList:{remove(){}}}},inquiryObserver:null,closeDialog(){},routePath:()=>current,location:{search:query},history:{state:{},replaceState(_state,_title,url){assert.ok(url.endsWith(query));current=url.split('?')[0]}}}
 runInNewContext(routeGuard+';route()',context)
 assert.equal(current,expected,path)
}
const extra=app.slice(app.indexOf('function bookingExtraSection('),app.indexOf('function eventBenefitsSection('))
const context={renderProductOption:option=>'<label>'+option.label+'</label>'}
runInNewContext(extra,context)
const markup=context.bookingExtraSection({key:'duet-film'},'making',[{label:'추가 1절 녹음'}],'02')
assert.match(markup,/추가 1절 녹음/)
assert.doesNotMatch(markup,/메이킹|data-film-making|−7만원/)
const packageSection=app.slice(app.indexOf('function productPackageOverview('),app.indexOf('function bookingGuideSection('))
assert.doesNotMatch(packageSection,/package-making-option|녹음 메이킹 필름으로 변경/)
assert.doesNotMatch(quick,/메이킹|choice\('making'/)
assert.doesNotMatch(read('sitemap.xml'),/solo-film/)
assert.doesNotMatch(read('js/seo-meta.js'),/solo-film|메이킹/)
for(const page of ['detail/solo-film.html','event/solo-film.html']){
 assert.match(read(page),/<meta name="robots" content="noindex, follow">/)
 assert.doesNotMatch(read(page),/<title>[^<]*메이킹/)
}
assert.ok(existsSync(new URL('../assets/img/solo-film/solo-film-cover-v2.webp',import.meta.url)),'archived media is preserved')
console.log('Retired making routes, stale variant normalization, no selling option, SEO retirement and preserved media: passed')
