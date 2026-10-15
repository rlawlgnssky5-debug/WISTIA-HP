import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
let shown,aria
const scope={escapeHtml:String,kakao:()=> 'https://pf.kakao.com/_GbExjX/chat',studioIcon:()=>'<svg></svg>',footerIcon:()=>'<svg></svg>',showDialog:(html,type)=>shown={html,type},dialog:{setAttribute:(key,value)=>aria=value}}
runInNewContext(app.slice(app.indexOf('function inquiryPathForPage('),app.indexOf('function openVideo(')),scope)
for(const [path,expected] of [['/','/event/solo'],['/detail/solo','/event/solo'],['/detail/duo','/event/duo'],['/info/faq','/contact'],['/events','/contact']])assert.equal(scope.inquiryPathForPage(path),expected)
scope.showKakaoInquiryDialog('/event/duo')
assert.equal(shown.type,'consult-choice-dialog')
assert.equal(aria,'카카오톡 문의 방법 선택')
assert.ok(shown.html.indexOf('일단 상담부터 받을래요!')<shown.html.indexOf('문의 양식 작성하고 상담받을래요!'))
assert.match(shown.html,/href="https:\/\/pf.kakao.com\/_GbExjX\/chat" target="_blank" rel="noopener noreferrer" data-close/)
assert.match(shown.html,/href="\/event\/duo" data-close/)
assert.match(app,/if\(el.id==='floatingKakaoChat'\)\{e.preventDefault\(\);showKakaoInquiryDialog\(inquiryPathForPage\(\)\);return\}/)
assert.match(app,/<button class="dialog-close" data-close aria-label="닫기">/)
console.log('Floating chooser, direct Kakao and product-aware form routes, warm labels and shared close control passed')
