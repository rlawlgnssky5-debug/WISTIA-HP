import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('Every public route has exactly one compact yellow floating pill, ordinary body CTAs and clear footer',{skip,timeout:180000},async()=>{
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
    await page.locator('#floatingKakaoChat').waitFor()
    const check=await page.evaluate(()=>{
     const dock=document.querySelector('#floatingKakaoChat'),s=getComputedStyle(dock),r=dock.getBoundingClientRect()
     const follows=n=>{for(let p=n;p&&p!==document.body;p=p.parentElement)if(['fixed','sticky'].includes(getComputedStyle(p).position))return true;return false}
     const visible=n=>n.getBoundingClientRect().height>0&&getComputedStyle(n).visibility!=='hidden'
     const links=[...document.querySelectorAll('a[href*="pf.kakao.com"],[data-kakao-inquiry],.contact-submit')].filter(visible)
     return {following:links.filter(follows).map(n=>n.id||n.className),height:r.height,width:r.width,right:innerWidth-r.right,bottom:innerHeight-r.bottom,bg:s.backgroundColor,color:s.color,radius:s.borderRadius,svg:dock.querySelectorAll('svg path').length,old:document.querySelectorAll('#floatingKakao,#soloDesktopCta,.mas-bottom').length,overflow:document.documentElement.scrollWidth-innerWidth,body:links.filter(n=>n!==dock).length,position:s.position,before:getComputedStyle(dock,'::before').display,after:getComputedStyle(dock,'::after').display}
    })
    assert.deepEqual(check.following,['floatingKakaoChat'],path+' '+width)
    assert.equal(check.old,0);assert.equal(check.height,48);assert.ok(check.width<220&&check.width>130)
    assert.equal(check.right,16);assert.equal(check.bottom,16);assert.equal(check.bg,'rgb(254, 229, 0)');assert.equal(check.color,'rgb(25, 25, 25)');assert.equal(check.radius,'999px');assert.equal(check.svg,1);assert.equal(check.position,'fixed');assert.equal(check.before,'none');assert.equal(check.after,'none');assert.equal(check.overflow,0,path+' '+width)
    if(path!='/privacy')assert.ok(check.body>0,path+' ordinary CTA preserved')
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight))
    const clearance=await page.evaluate(()=>({footer:document.querySelector('footer')?.getBoundingClientRect().bottom,pill:document.querySelector('#floatingKakaoChat').getBoundingClientRect().top}))
    if(clearance.footer)assert.ok(clearance.footer<=clearance.pill,path+' '+width+' footer must stay clear '+JSON.stringify(clearance))
   }
   await page.goto(`http://127.0.0.1:${port}/detail/solo`,{waitUntil:'domcontentloaded'})
   await page.locator('#floatingKakaoChat').click();await page.locator('#mediaDialog[open] .consult-copy-dialog').waitFor()
   assert.equal(await page.locator('#floatingKakaoChat').evaluate(n=>n.inert),true)
   await page.locator('#mediaDialog .dialog-close').click();assert.equal(await page.locator('#floatingKakaoChat').evaluate(n=>n.inert),false)
   await page.locator('.product-inquiry a').click();assert.equal(await page.locator('#mediaDialog a[href="/event/solo"]').count(),1)
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
