import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFileSync,existsSync,writeFileSync,mkdirSync} from 'node:fs'
import {createRequire} from 'node:module'
import {runInNewContext} from 'node:vm'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
import {fileURLToPath} from 'node:url'
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFileSync(root+p,'utf8'),app=read('js/app.js')
await test('Shared comparisons and inquiry headings contain no repeated copy',()=>{
 const scope={app:{},studioIcon:()=>'<svg></svg>',footer:()=>'<footer></footer>'}
 runInNewContext(app.slice(app.indexOf('function wistiaBeforeAfterSection('),app.indexOf('function setExpertPanel(')),scope)
 runInNewContext(app.slice(app.indexOf('function renderBeforeAfterPage('),app.indexOf('// Two active product families')),scope)
 scope.renderBeforeAfterPage()
 const markup=scope.app.innerHTML
 assert.equal((markup.match(/<h[12]\b/g)||[]).length,1)
 assert.match(markup,/<h1[^>]*class="vocal-comparison-title"[^>]*>노래를 다듬은 전후 비교<\/h1>/)
 assert.equal((markup.match(/같은 녹음본/g)||[]).length,1)
 assert.match(markup,/보정 전후를 직접 들어보세요/)
 assert.doesNotMatch(markup,/wistia-ba-eyebrow|전후 차이를 직접|같은 녹음, 다른 완성도/)
 assert.doesNotMatch(app,/같은 녹음본의 보정 전후를 직접|WISTIA · 웨딩 축가 전문 스튜디오|<span class="arc-kicker">Q & A|<strong>한 소절씩 나누어 녹음<\/strong>|<p>후기 페이백 최대 6만원<\/p>/)
 const reviews=app.slice(app.indexOf('function soloReviewCarousel('),app.indexOf('function ',app.indexOf('function soloReviewCarousel(')+10))
 assert.doesNotMatch(reviews,/<span data-solo-kicker>고객 후기/)
 const location=app.split('\n').find(line=>line.startsWith(' const locationContent='))
 assert.equal((location.match(/300m/g)||[]).length,1)
 const window={};runInNewContext(read('js/contact-form.js'),{window})
 assert.match(window.WistiaContact.render(null,{integrated:true}),/for="contact-source"><span class="sr-only">어디에서 보고 오셨나요\?<\/span>/)
 const svg=read('assets/img/interface/kakao-talk.svg')
 assert.match(svg,/<path/);assert.doesNotMatch(svg,/<image|<text|data:image/)
 assert.ok(existsSync(root+'assets/img/kakao-talk.png'))
})
let playwright,executable,skip=false
try{playwright=createRequire(import.meta.url)('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':playwright.chromium.executablePath());if(!existsSync(executable))skip='Chromium is not installed'}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;skip='Playwright is not installed'}
await test('Copy, one-line comparison titles and layout at 360/390/1280px',{skip,timeout:300000},async()=>{
 const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{cwd:root,env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 const results=[]
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview startup timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({executablePath:executable,args:['--no-sandbox']})
  for(const width of [360,390,1280]){
   const page=await browser.newPage({viewport:{width,height:844},hasTouch:width<600,isMobile:width<600})
   await page.route('https://**/*',route=>route.abort())
   await page.route('**/api/availability?*',route=>{const q=new URL(route.request().url()).searchParams;return route.fulfill({json:{ok:true,date:q.get('date'),from:q.get('from'),to:q.get('to'),blocks:[]}})})
   for(const path of ['/before-after','/','/detail/solo','/detail/duo','/detail/duet-film','/info/location','/info/about','/events','/contact','/ar/friend','/ar/self','/event/solo','/event/duo','/event/duet-film']){
    await page.goto(`http://127.0.0.1:${port}${path}`,{waitUntil:'domcontentloaded'});await page.locator('#app h1').first().waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready)
    if(path==='/before-after'){
     assert.equal(await page.locator('#app h1,#app h2').count(),1)
     assert.equal(await page.locator('#comparisonPageTitle').innerText(),'노래를 다듬은 전후 비교')
     assert.equal((await page.locator('.info-page-comparison').innerText()).match(/같은 녹음본/g).length,1)
     const centers=await page.evaluate(()=>{
      const center=n=>{const r=n.getBoundingClientRect();return r.x+r.width/2-innerWidth/2}
      const title=document.querySelector('#comparisonPageTitle'),icon=title.querySelector('.svg-title-icon'),text=title.querySelector('.svg-section-text'),description=document.querySelector('.wistia-ba-copy>p'),player=document.querySelector('.bap-player')
      return {title:center(title),icon:center(icon),text:center(text),description:center(description),player:center(player),iconBottom:icon.getBoundingClientRect().bottom,textTop:text.getBoundingClientRect().top,headerBottom:title.parentElement.getBoundingClientRect().bottom,playerTop:player.getBoundingClientRect().top}
     })
     for(const part of ['title','icon','text','description','player'])assert.ok(Math.abs(centers[part])<=1,`${width} comparison ${part} center: ${centers[part]}`)
     assert.ok(centers.iconBottom<=centers.textTop,'comparison icon sits above the title')
     assert.ok(centers.headerBottom<=centers.playerTop,'comparison player sits below the heading')
     results.push({width,path,comparisonCenters:centers})
    }
    const titles=await page.locator('.vocal-comparison-title .svg-section-text').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),style=getComputedStyle(n);return {text:n.textContent,height:r.height,lineHeight:parseFloat(style.lineHeight),scrollWidth:n.scrollWidth,width:r.width}}))
    for(const title of titles){assert.ok(title.height<=title.lineHeight+1,`${width} ${path} title must be one line`);assert.ok(title.scrollWidth<=title.width+1,`${width} ${path} title must fit`)}
    if(path==='/'){
     assert.equal(await page.locator('.we-meta').innerText(),'WISTIA')
     assert.equal(await page.locator('.we-review-wrap [data-solo-kicker]').count(),0)
     assert.equal(await page.locator('.we-review-wrap [data-solo-sub]').innerText(),'카카오톡으로 받은 후기 원문 그대로예요')
     const gaps=await page.evaluate(()=>['.we-cases','.we-review-wrap','#homeSound'].map(selector=>{const s=document.querySelector(selector);return {selector,gap:s.querySelector('.svg-title-icon').getBoundingClientRect().top-s.querySelector('.we-section-tag').getBoundingClientRect().bottom}}))
     for(const {gap} of gaps)assert.ok(Math.abs(gap-20)<=1,'every home POINT intro has the same 20px badge/icon gap')
     const videoTitle=page.locator('.home-cases-title .svg-section-text')
     assert.equal(await videoTitle.locator('br').count(),0)
     assert.equal(await videoTitle.innerText(),'말보다 먼저, 목소리가 전한 마음')
     results.push({width,path,pointBadgeIconGaps:gaps})
     const processTitle=page.locator('#homeExpert>details>summary .process-folder-label>strong')
     assert.equal(await processTitle.innerText(),'녹음부터 완성까지')
     assert.equal(await processTitle.evaluate(n=>n.getBoundingClientRect().height<=parseFloat(getComputedStyle(n).lineHeight)+1),true,'home process title is one line')
    }
    if(path.startsWith('/detail/')){
     assert.doesNotMatch(await page.locator('#app').innerText(),/Q & A|한 소절씩 나누어 녹음|첫 소절과 다음 소절|편안한 음역, 더 자연스러운 노래/)
     if(path!=='/detail/duet-film'){
      const cardTitle=page.locator('.mas-cut-heading strong');assert.equal(await cardTitle.innerText(),'녹음 구간 연결 예시')
      assert.equal(await cardTitle.evaluate(n=>n.getBoundingClientRect().height<=parseFloat(getComputedStyle(n).lineHeight)+1),true,'recording card title is one line')
     }
     const offsets=await page.locator('.detail-point-label').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().width).map(n=>{const r=n.getBoundingClientRect();return r.x+r.width/2-innerWidth/2}))
     for(const offset of offsets)assert.ok(Math.abs(offset)<=1,`${path} POINT center ${offset}`)
    }
    if(path==='/info/location')assert.doesNotMatch(await page.locator('#app').innerText(),/지하철 안내|주차 안내|위스티아 · 경기도 부천|위스티아는 경기도 부천에 있습니다/)
    if(path==='/info/about'){
     assert.equal(await page.locator('#specialistTitle').innerText(),'함께 완성하는 전문가들')
     assert.doesNotMatch(await page.locator('.wistia-specialists header').innerText(),/각 분야의 전문가/)
    }
    if(path==='/ar/self'||path==='/ar/friend'){
     const headings=page.locator('.service-list').locator('..').locator('.section-heading')
     assert.equal(await headings.innerText(),'녹음 인원 선택')
    }
    if(path==='/'||path.startsWith('/detail/')){
     assert.equal(await page.locator('#soloReviewTitle').innerText(),'직접 남겨 주신 이야기')
     if(path==='/'){
      assert.match(await page.locator('#homeSound .we-section-tag').innerText(),/POINT 05 · 보컬 보정/)
      assert.doesNotMatch(await page.locator('.we-cases-guide').innerText(),/실제 제작 영상/)
     }
    }
    for(const n of await page.locator('.single-line-heading .svg-section-text').evaluateAll(nodes=>nodes.map(n=>({height:n.getBoundingClientRect().height,lineHeight:parseFloat(getComputedStyle(n).lineHeight),width:n.getBoundingClientRect().width,scrollWidth:n.scrollWidth})))){assert.ok(n.height<=n.lineHeight+1,'short heading is one line');assert.ok(n.scrollWidth<=n.width+1,'short heading fits')}
    if(path==='/events'||path==='/contact'||path.startsWith('/event/')||path.startsWith('/detail/')){
     const card=page.locator('.benefit-kind-card[data-benefit-type="payback"]').first()
     assert.equal(await card.locator('.benefit-kind-timing').count(),0)
     const cardText=await card.textContent();assert.match(cardText,/참여 조건 충족 확인 후 돌려드리는 금액이며/);assert.match(cardText,/결제 금액에서 미리 차감하지 않습니다/)
    }
    if(path==='/ar/self')assert.equal((await page.locator('.ratio-guide').innerText()).match(/결정합니다/g).length,1)
    if(path==='/info/location')assert.equal((await page.locator('#app').innerText()).match(/300m/g).length,1)
    if(path.startsWith('/event/')||path==='/contact'){
     const hint=page.locator('[data-time-date-hint]')
     for(const undecided of [false,true]){
      if(undecided)await page.locator('[data-contact-date-mode="bookingDate"][value="unknown"]').locator('..').click()
      assert.equal(await hint.isVisible(),true)
      const gap=await hint.evaluate(n=>n.getBoundingClientRect().top-n.closest('fieldset').querySelector('legend').getBoundingClientRect().bottom)
      assert.ok(Math.abs(gap-16)<=1,'initial/undecided time hint starts below its floating legend')
      results.push({width,path,timeGuidanceLegendGap:gap,undecided})
     }
    }
    if(path.startsWith('/event/')){
     const label=page.locator('#bookingSource .sr-only'),style=await label.evaluate(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,position:getComputedStyle(n).position,clip:getComputedStyle(n).clipPath}))
     assert.deepEqual(style,{width:1,height:1,position:'absolute',clip:'inset(50%)'})
     assert.equal(await page.locator('#contact-source').getAttribute('name'),'source')
     assert.doesNotMatch(await page.locator('.consultation-gifts').innerText(),/후기 페이백 최대 6만원/)
     assert.match(await page.locator('.benefit-kind-limit').innerText(),/최대 6만원/)
     assert.equal(await page.locator('.booking-price-sidebar .quote-note').count(),0)
     assert.equal((await page.locator('.consultation-gifts').innerText()).match(/미리 차감하지 않습니다/g).length,1)
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0,`${path} ${width} horizontal overflow`)
    const icon=page.locator('#floatingKakaoChat img');assert.match(await icon.getAttribute('src'),/interface\/kakao-talk.svg/);assert.equal(await icon.evaluate(n=>n.complete&&n.naturalWidth>0),true)
    results.push({width,path,titles,horizontalOverflow:0})
   }
   await page.close()
  }
  mkdirSync(root+'work',{recursive:true})
  writeFileSync(root+'work/9d-browser-results.json',JSON.stringify(results,null,2))
  console.log('9: 42 page/viewport combinations passed; comparison center axes within 1px, icons above title, single-column player; comparisons remain one line, labels clipped, POINT centers within 1px, SVG loaded, no horizontal overflow')
 }finally{await browser?.close();server.kill()}
})
