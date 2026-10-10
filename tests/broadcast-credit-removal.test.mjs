import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync,existsSync} from 'node:fs'
import {spawn,execFileSync} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url),root=new URL('../',import.meta.url),retired=/불후\s*의\s*명곡|IMMORTAL\s*SONGS/i
await test('Every tracked HTML/JS/SVG and active banner metadata excludes the retired broadcast credit',()=>{
 const files=execFileSync('git',['ls-files','-z'],{cwd:root}).toString().split('\0').filter(p=>/\.(html|js|svg)$/.test(p))
 for(const path of files)assert.doesNotMatch(readFileSync(new URL(path,root),'utf8'),retired,path)
 const app=readFileSync(new URL('js/app.js',root),'utf8')
 assert.match(app,/〈싱어게인2〉 방송 음악 작업 참여/)
 assert.match(app,/〈싱어게인2〉 등 방송 음악 작업에 참여한 엔지니어/)
 assert.match(app,/broadcast-singagain-v4\.webp/)
 assert.doesNotMatch(app,/broadcast-typography-(?:noir-v3|wistia-v2)\.(?:webp|png)/,'retired banners cannot remain active')
 assert.doesNotMatch(readFileSync(new URL('assets/img/ar-detail/broadcast-singagain-v4.json',root),'utf8'),retired)
})
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('Home, about and every product render clean body/alt/meta with the single-title banner',{skip,timeout:120000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  for(const width of [320,390]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await context.newPage()
   await page.route('https://**/*',r=>r.abort())
   for(const path of ['/','/info/about','/detail/solo','/detail/duo','/detail/duet-film','/detail/solo-film','/detail/wedding','/detail/proposal']){
    await page.goto(`http://127.0.0.1:${port}`+path,{waitUntil:'domcontentloaded'})
    await page.locator('#app h1').first().waitFor()
    const content=await page.evaluate(()=>[document.body.innerText,document.head.outerHTML,...[...document.images].map(n=>n.alt)].join('\n'))
    assert.doesNotMatch(content,retired,path+' '+width)
    if(['/detail/solo','/detail/duo','/detail/duet-film'].includes(path)){
     const banner=page.locator('img[src*="broadcast-singagain-v4.webp"]');assert.equal(await banner.count(),1)
     await banner.scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const n=document.querySelector('img[src*="broadcast-singagain-v4.webp"]');return n?.complete&&n.naturalWidth>0})
     assert.equal(await page.locator('img[src*="broadcast-typography-noir-v3"]').count(),0)
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0,path+' '+width)
   }
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
