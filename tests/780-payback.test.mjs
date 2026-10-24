import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {execFileSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
const root=fileURLToPath(new URL('..',import.meta.url)),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const app=read('js/app.js'),manifest=JSON.parse(read('css/bundles.json'))
const git=p=>execFileSync('git',['show','bc0980a:'+p],{cwd:root,encoding:'utf8',maxBuffer:8e6})
test('Only the two approved 30k paybacks determine every effective price',()=>{
 const events=runInNewContext(app.slice(app.indexOf('const EVENTS ='),app.indexOf('const ACTUAL_REVIEW_IMAGES'))+';EVENTS')
 assert.deepEqual(Array.from(events,e=>[e.key,e.label,e.discount]),[['blog','네이버 블로그 리뷰',30000],['reaction','본식 현장 영상',30000]])
 assert.equal(events.reduce((s,e)=>s+e.discount,0),60000)
 assert.doesNotMatch(app,/1만원 추가 할인|추가 할인|최대 7만원|70,000|sizes="\(min-width: 901px\)/)
})
test('The full approved event copy and every all-entry stylesheet are served',()=>{
 const guide=runInNewContext(app.slice(app.indexOf('const PAYBACK_EVENT_GUIDE ='),app.indexOf('const ACTUAL_REVIEW_IMAGES'))+';PAYBACK_EVENT_GUIDE')
 for(const line of ['일 방문자 100명 이상인 네이버 블로그를 운영하시는 분','세부 작성 기준은 위스티아에서 전달드리는 블로그 안내 가이드를 확인해 주세요','이 후기는 위스티아 후기 이벤트에 참여하여 페이백 혜택을 제공받는 조건으로 작성하였습니다','전달해 주신 영상은 편집 후 위스티아 공식 인스타그램에 업로드될 예정이에요','인스타그램 공개에 동의하시는 경우에 참여해 주세요','참여 자료와 조건을 확인한 뒤 환급 절차를 카카오톡으로 안내해 드려요'])assert.ok(JSON.stringify(guide).includes(line),line)
 for(const [page,data] of Object.entries(manifest.pages)){
  if(!existsSync(new URL('../'+page,import.meta.url)))continue
  if(!read(page).includes('id="app"'))continue
  assert.ok(data.sources.some(x=>x.includes('mobile-gutters-1020.css')),page)
  assert.match(read(page),/canvas-780\.css\?v=20261021-mobile-parity-1/)
  assert.match(read(page),/js\/app\.js\?v=20261021-retire-410-1/)
 }
 assert.equal((read('events.html').match(/후기 페이백 이벤트 2가지, 각 3만원 · 최대 6만원/g)||[]).length,2)
 const quick=read('js/quick-estimate.js');assert.doesNotMatch(quick,/할인과|\['discount','payback'\]/)
 assert.match(quick,/카카오톡으로 환급 절차/)
})
test('Tracking, booking, music and image source files remain byte-identical to the approved base',()=>{
 for(const p of ['js/analytics.js','js/meta-pixel.js','js/tracking-common.js','js/inquiry-funnel.js','js/booking-wizard.js'])assert.equal(read(p).replaceAll('\r\n','\n'),git(p).replaceAll('\r\n','\n'),p)
 const contact=read('js/contact-form.js').replaceAll('\r\n','\n')
 assert.equal(contact,git('js/contact-form.js').replaceAll('\r\n','\n').replace('않습니다 <a href="/privacy">개인정보처리방침</a>','않습니다 개인정보처리방침'))
 assert.doesNotMatch(contact,/href="\/privacy"/)
 const protectedLines=s=>s.replaceAll('\r\n','\n').split('\n').filter(line=>/wistia_vid|KakaoTalkClick|['"]Contact['"]/.test(line))
 assert.deepEqual(protectedLines(app),protectedLines(git('js/app.js')))
 const changed=execFileSync('git',['diff','bc0980a','--name-only','--','assets'],{cwd:root,encoding:'utf8'}).trim()
 assert.equal(changed,'','no music or original image mutations')
 for(const p of Object.keys(manifest.pages)){
  if(!existsSync(new URL('../'+p,import.meta.url)))continue
  assert.ok(manifest.pages[p].sources.some(href=>href.includes('mobile-parity-780.css')),p+' shared parity CSS')
  assert.doesNotMatch(read(p),/privacy-content\.js/,p+' privacy script removed')
 }
})
