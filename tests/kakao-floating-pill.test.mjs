import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright')}catch{
 try{playwright=createRequire('/tmp/pw/node_modules/playwright-core/package.json')('playwright-core')}catch{skip='Playwright not installed'}
}
if(!skip){
 executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium','/opt/google/chrome/chrome','/usr/bin/google-chrome',typeof playwright.chromium.executablePath==='function'?playwright.chromium.executablePath():''].filter(Boolean).find(existsSync)
 if(!executable)skip='Chromium not installed'
}
await test('Public routes retain one compact yellow pill except event inquiry, ordinary body CTAs and clear footer',{skip,timeout:180000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  const paths=['/','/contact','/privacy','/before-after','/song','/film','/events','/ar/self','/ar/friend',...['about','faq','location','process'].map(p=>'/info/'+p),...['role','service','people'].map(p=>'/find/'+p),...['homeServices','homeCases','homeLocation','homeProcess'].map(p=>'/section/'+p),...['solo','duo','duet-film','solo-film','wedding','proposal'].flatMap(p=>['/detail/'+p,'/event/'+p])]
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:true}),page=await context.newPage()
   await page.route('https://**/*',r=>r.abort())
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks:[]}})})
   for(const path of paths){
    await page.goto(`http://127.0.0.1:${port}`+path,{waitUntil:'domcontentloaded'})
    if(path!='/privacy')await page.locator('#app h1').first().waitFor()
    if(path==='/detail/solo'||path==='/detail/duo'){
     const form=await page.locator('.solo-footer-inquiry').evaluate(node=>{
      const s=getComputedStyle(node),pill=document.querySelector('#floatingKakaoChat'),ps=getComputedStyle(pill)
      return {text:node.innerText.replace(/\s+/g,' ').trim(),href:node.getAttribute('href'),kakao:node.hasAttribute('data-kakao-inquiry'),pillText:pill?.innerText.replace(/\s+/g,' ').trim(),pillDisplay:ps.display,pillHref:pill?.getAttribute('href')||''}
     })
     assert.equal(form.text,'문의양식 작성',path)
     assert.equal(form.href,path==='/detail/solo'?'/event/solo':'/event/duo')
     assert.equal(form.kakao,false)
     assert.equal(form.pillText,'카카오톡 문의')
     assert.equal(form.pillDisplay,'none')
     assert.equal(form.pillHref,'https://pf.kakao.com/_GbExjX/chat')
     continue
    }
    const eventInquiry=await page.locator('body').evaluate(n=>n.classList.contains('is-event-inquiry'))
    await page.locator('#floatingKakaoChat').waitFor({state:eventInquiry?'hidden':'visible'})
    const check=await page.evaluate(()=>{
     const dock=document.querySelector('#floatingKakaoChat'),s=getComputedStyle(dock),r=dock.getBoundingClientRect()
     const follows=n=>{for(let p=n;p&&p!==document.body;p=p.parentElement)if(['fixed','sticky'].includes(getComputedStyle(p).position))return true;return false}
     const visible=n=>n.getBoundingClientRect().height>0&&getComputedStyle(n).visibility!=='hidden'
     const links=[...document.querySelectorAll('a[href*="pf.kakao.com"],[data-kakao-inquiry],.contact-submit')].filter(visible)
     return {following:links.filter(follows).map(n=>n.id||n.className),height:r.height,width:r.width,right:innerWidth-r.right,bottom:innerHeight-r.bottom,bg:s.backgroundColor,color:s.color,radius:s.borderRadius,svg:dock.querySelectorAll('svg path').length,old:document.querySelectorAll('#floatingKakao,#soloDesktopCta,.mas-bottom').length,overflow:document.documentElement.scrollWidth-innerWidth,body:links.filter(n=>n!==dock).length,position:s.position,before:getComputedStyle(dock,'::before').display,after:getComputedStyle(dock,'::after').display,pillHref:dock.getAttribute('href'),pillTarget:dock.target,pillRel:dock.rel}
    })
    assert.equal(check.old,0);assert.equal(check.overflow,0,path+' '+width)
    if(path!='/privacy')assert.ok(check.body>0,path+' ordinary CTA preserved')
    assert.equal(check.pillHref,'https://pf.kakao.com/_GbExjX/chat',path+' '+width)
    assert.equal(check.pillTarget,'_blank',path)
    assert.match(check.pillRel,/noopener/,path)
    if(eventInquiry){assert.deepEqual(check.following,[],path+' '+width);assert.equal(check.height,0);continue}
    assert.deepEqual(check.following,['floatingKakaoChat'],path+' '+width)
    assert.equal(check.old,0);assert.equal(check.height,48);assert.ok(check.width<220&&check.width>130)
    assert.equal(check.right,16);assert.equal(check.bottom,16);assert.equal(check.bg,'rgb(254, 229, 0)');assert.equal(check.color,'rgb(25, 25, 25)');assert.equal(check.radius,'999px');assert.equal(check.svg,1);assert.equal(check.position,'fixed');assert.equal(check.before,'none');assert.equal(check.after,'none');assert.equal(check.overflow,0,path+' '+width)
    if(path!='/privacy')assert.ok(check.body>0,path+' ordinary CTA preserved')
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight))
    const clearance=await page.evaluate(()=>({footer:document.querySelector('footer')?.getBoundingClientRect().bottom,pill:document.querySelector('#floatingKakaoChat').getBoundingClientRect().top}))
    if(clearance.footer)assert.ok(clearance.footer<=clearance.pill,path+' '+width+' footer must stay clear '+JSON.stringify(clearance))
   }
   if(width===390){
    await context.route('https://pf.kakao.com/_GbExjX/chat',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>kakao-chat</title>'}))
    for(const path of ['/','/contact','/privacy','/detail/duet-film','/events','/info/location']){
     await page.goto(`http://127.0.0.1:${port}`+path,{waitUntil:'domcontentloaded'})
     const [popup]=await Promise.all([page.waitForEvent('popup'),page.locator('#floatingKakaoChat').click()])
     await popup.waitForLoadState('domcontentloaded')
     assert.equal(popup.url(),'https://pf.kakao.com/_GbExjX/chat',path)
     assert.equal(await page.locator('#mediaDialog[open]').count(),0,path+' must not open the inquiry chooser')
     assert.equal(new URL(page.url()).pathname,path)
     await popup.close()
    }
   }
   await page.goto(`http://127.0.0.1:${port}/detail/duet-film`,{waitUntil:'domcontentloaded'})
   await page.locator('.product-inquiry a').click();assert.equal(await page.locator('#mediaDialog a[href="/event/duet-film"]').count(),1)
   await page.goto(`http://127.0.0.1:${port}/detail/solo`,{waitUntil:'domcontentloaded'})
   await page.locator('.solo-footer-inquiry').click()
   await page.waitForURL(/\/event\/solo$/)
   assert.equal(await page.locator('#mediaDialog[open]').count(),0)
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
