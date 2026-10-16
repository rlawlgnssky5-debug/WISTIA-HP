import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('js/app.js'),css=read('css/site-layout-safety.css')
const from=(start,end)=>app.slice(app.indexOf(start),app.indexOf(end,app.indexOf(start)))
const scope={config:{},kakao:()=>'/chat',img:()=>'<img alt="로고">',escapeHtml:String,footerIcon:()=>'<svg></svg>'}
runInNewContext(from('function footer(){','function serviceRows('),scope)
const footer=scope.footer()
assert.doesNotMatch(footer,/개인정보처리방침|고객지원|웨딩 · 목소리 · 영상/)
for(const value of ['Instagram','YouTube','Kakao 상담','All rights reserved'])assert.ok(footer.includes(value))
runInNewContext(from("function soloFooter(key='solo')",'function soloPosterStack('),scope)
const detail=scope.soloFooter('duo')
assert.match(detail,/href="\/event\/duo"/)
assert.doesNotMatch(detail,/footer_A|footer-legal|카카오톡 문의/)
assert.match(detail,/문의양식 작성/)
assert.doesNotMatch(app,/const eventSummary=e.target.closest\('\.solo-shot-top \.mas-event-disclosure>summary'\)/)
assert.doesNotMatch(app,/showDialog\('<h2>후기 페이백 안내<\/h2>'/)
assert.match(app,/class="solo-live-benefit"/)
assert.match(css,/\.mas-event-content\{display:none!important\}/)
assert.match(css,/#mediaDialog:has\(\.detail-events-dialog\)/)
assert.match(app,/getAttribute\('href'\)==='\/privacy'\)return/)
assert.match(read('js/before-after.js'),/destroyed\|\|signal.aborted\|\|error.name==='AbortError'/)
console.log('Shared/detail footer removals, preserved inquiry CTA, event modal isolation, live benefit text and navigation cleanup passed')
