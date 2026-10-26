import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync,readFileSync} from 'node:fs'
import {LIVE_PATHS,goneDocument,isGonePath} from '../js/gone-paths.mjs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')

test('unlinked pages are HTTP 410 and linked pages stay',()=>{
 for(const path of LIVE_PATHS){
  assert.equal(isGonePath(path),false,path)
  assert.equal(isGonePath(path+'/'),false,path+' trailing slash')
 }
 for(const path of ['/film','/film/extra','/privacy','/privacy/rights','/song','/before-after','/ar/self','/ar/friend','/info/about','/info/process','/detail/wedding','/detail/proposal','/detail/solo-film','/detail/duet-film','/event/wedding','/event/proposal','/event/solo-film','/event/duet-film','/choose/wedding','/choose/solo-film','/find','/find/role','/find/service','/find/people','/section/homeServices','/section/homeCases','/section/homeLocation','/section/homeProcess','/detail/solo/extra','/event/solo/making','/foo']){
  assert.equal(isGonePath(path),true,path)
 }
 for(const path of ['/assets/img/og/wistia-og.png','/css/design.css','/js/app.js','/js/before-after.js','/api/availability','/tests/responsive-preview.html','/lib/notion-availability.mjs','/robots.txt','/sitemap.xml','/favicon.ico','/wistia-config.json','/index.html','/detail/solo.html','/event/duo.html','/info/faq.html','/info/location.html']){
  assert.equal(isGonePath(path),false,path)
 }
 assert.equal(isGonePath('/privacy.html'),true)
 assert.equal(isGonePath('/.well-known/acme'),false)
 const app=read('js/app.js')
 const listed=app.match(/const LIVE_ROUTES=new Set\((\[[^\]]+\])\)/)
 assert.deepEqual(JSON.parse(listed[1]),[...LIVE_PATHS])
 assert.match(app,/if\(!isLiveRoute\(routePath\(\)\)\)\{location\.reload\(\);return\}/)
 assert.match(app,/본식 현장 영상/)
 assert.doesNotMatch(app,/function renderPrivacyPage|renderPrivacyPage\(/)
 const doc=goneDocument()
 assert.match(doc,/410 Gone/)
 assert.equal(doc.trim(),'410 Gone','no soft gone page')
 assert.doesNotMatch(doc,/js\/app\.js|예요\./)
 const vercel=read('vercel.json')
 assert.doesNotMatch(vercel,/"redirects"|privacy\.html/)
 assert.match(vercel,/"destination": "\/index.html"/)
 assert.match(vercel,/\/contact/)
 const sitemap=read('sitemap.xml')
 assert.equal((sitemap.match(/<lastmod>2026-10-21<\/lastmod>/g)||[]).length,7)
 for(const loc of ['https://www.wistiastudio.com/','https://www.wistiastudio.com/detail/solo','https://www.wistiastudio.com/event/solo','https://www.wistiastudio.com/event/duo','https://www.wistiastudio.com/events','https://www.wistiastudio.com/info/faq','https://www.wistiastudio.com/info/location'])assert.match(sitemap,new RegExp(loc.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'</loc>'))
 assert.doesNotMatch(sitemap,/\/detail\/duo<\/loc>/)
 assert.doesNotMatch(sitemap,/\/contact|privacy|duet-film|wedding|\/info\/about|\/info\/process|\/song|before-after/)
 assert.match(read('event/solo.html'),/<title>문의 양식 \| 위스티아 AR 축가 사전녹음<\/title>/)
 assert.match(read('event/duo.html'),/<title>듀엣 문의 양식 \| 위스티아 AR 축가 사전녹음<\/title>/)
 assert.match(read('index.html'),/"@type": "WebPage"[\s\S]{0,400}"name": "부천 축가 녹음 · AR 축가 사전녹음 · 셀프 축가 \| 위스티아"/)
 const contact=read('js/contact-form.js')
 assert.match(contact,/않습니다 개인정보처리방침/)
 assert.doesNotMatch(contact,/href="\/privacy"/)
 for(const file of ['privacy.html','js/privacy-content.js','film.html','song.html','before-after.html','info/about.html','info/process.html','detail/duet-film.html','detail/solo-film.html','section/homeServices.html','find/service.html','ar/self.html','ar/friend.html'])assert.equal(existsSync(new URL('../'+file,import.meta.url)),false,file)
 assert.equal(existsSync(new URL('../detail/duo.html',import.meta.url)),false,'retired duet detail page')
 for(const file of ['index.html','detail/solo.html','event/solo.html','event/duo.html','contact.html','events.html','info/faq.html','info/location.html','js/before-after.js'])assert.equal(existsSync(new URL('../'+file,import.meta.url)),true,file)
 for(const path of ['/WISTIA-source-latest.zip','/AGENTS.md','/hcs-edits.js','/tmp/incoming/index.html','/Claude outputs/a.png'])assert.equal(isGonePath(path),true,path)
 const middleware=read('middleware.js')
 assert.doesNotMatch(middleware,/\b(?:import|require)\b/)
 assert.equal(middleware.match(/return `([\s\S]*?)`/)[1].replace(/\r\n/g,'\n'),goneDocument().replace(/\r\n/g,'\n'))
 assert.match(middleware,/status:\s*410/)
})
