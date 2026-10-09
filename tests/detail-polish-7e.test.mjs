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
 assert.match(markup,/<h1[^>]*class="vocal-comparison-title"[^>]*>보컬 보정 비포 애프터<\/h1>/)
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
await test('Copy, one-line comparison titles and layout at 360/390/1280px',{skip,timeout:240000},async()=>{
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
   for(const path of ['/before-after','/','/detail/solo','/detail/duo','/detail/duet-film','/info/location','/event/solo','/event/duo','/event/duet-film']){
    await page.goto(`http://127.0.0.1:${port}${path}`,{waitUntil:'domcontentloaded'});await page.locator('#app h1').first().waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready)
    if(path==='/before-after'){
     assert.equal(await page.locator('#app h1,#app h2').count(),1)
     assert.equal(await page.locator('#comparisonPageTitle').innerText(),'보컬 보정 비포 애프터')
     assert.equal((await page.locator('.info-page-comparison').innerText()).match(/같은 녹음본/g).length,1)
    }
    const titles=await page.locator('.vocal-comparison-title .svg-section-text').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),style=getComputedStyle(n);return {text:n.textContent,height:r.height,lineHeight:parseFloat(style.lineHeight),scrollWidth:n.scrollWidth,width:r.width}}))
    for(const title of titles){assert.ok(title.height<=title.lineHeight+1,`${width} ${path} title must be one line`);assert.ok(title.scrollWidth<=title.width+1,`${width} ${path} title must fit`)}
    if(path==='/'){
     assert.equal(await page.locator('.we-meta').innerText(),'WISTIA')
     assert.equal(await page.locator('.we-review-wrap [data-solo-kicker]').count(),0)
    }
    if(path.startsWith('/detail/')){
     assert.doesNotMatch(await page.locator('#app').innerText(),/Q & A|한 소절씩 나누어 녹음/)
     const offsets=await page.locator('.detail-point-label').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().width).map(n=>{const r=n.getBoundingClientRect();return r.x+r.width/2-innerWidth/2}))
     for(const offset of offsets)assert.ok(Math.abs(offset)<=1,`${path} POINT center ${offset}`)
    }
    if(path==='/info/location')assert.equal((await page.locator('#app').innerText()).match(/300m/g).length,1)
    if(path.startsWith('/event/')){
     const label=page.locator('#bookingSource .sr-only'),style=await label.evaluate(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,position:getComputedStyle(n).position,clip:getComputedStyle(n).clipPath}))
     assert.deepEqual(style,{width:1,height:1,position:'absolute',clip:'inset(50%)'})
     assert.equal(await page.locator('#contact-source').getAttribute('name'),'source')
     assert.doesNotMatch(await page.locator('.consultation-gifts').innerText(),/후기 페이백 최대 6만원/)
     assert.match(await page.locator('.benefit-kind-limit').innerText(),/최대 6만원/)
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0,`${path} ${width} horizontal overflow`)
    const icon=page.locator('#floatingKakaoChat img');assert.match(await icon.getAttribute('src'),/interface\/kakao-talk.svg/);assert.equal(await icon.evaluate(n=>n.complete&&n.naturalWidth>0),true)
    results.push({width,path,titles,horizontalOverflow:0})
   }
   await page.close()
  }
  mkdirSync(root+'work',{recursive:true})
  writeFileSync(root+'work/7e-browser-results.json',JSON.stringify(results,null,2))
  console.log('7e: 27 page/viewport combinations passed; comparisons remain one line, labels clipped, POINT centers within 1px, SVG loaded, no horizontal overflow')
 }finally{await browser?.close();server.kill()}
})
