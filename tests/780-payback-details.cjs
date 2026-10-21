const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process')
const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/780-payback-20261021')
const base=process.env.WISTIA_QA_URL||'http://127.0.0.1:4203',production=base.startsWith('https:')
const saved=production?{}:JSON.parse(fs.readFileSync(path.join(out,'baseline-sources.json'),'utf8'))
;(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
 try{for(const phase of production?['production']:['before','after'])for(const width of [1280,390])for(const product of ['solo','duo']){
  const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:'reduce'})
  await page.route('**/*',r=>{const u=new URL(r.request().url());if(/facebook|google-analytics|googletagmanager|doubleclick/.test(u.hostname)||!['GET','HEAD'].includes(r.request().method()))return r.abort();const file=u.pathname==='/detail/'+product?'detail/'+product+'.html':u.pathname.slice(1);const source=saved[path.join(root,file).replaceAll('\\','/')];if(phase==='before'&&source!==undefined)return r.fulfill({status:200,contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript',body:source});return r.continue()})
  await page.goto(base+'/detail/'+product,{waitUntil:'domcontentloaded'});await page.waitForTimeout(500)
  const details=page.locator('.mas-event-disclosure');await details.evaluate(e=>e.open=true)
  const content=details.locator('.mas-event-content');await content.screenshot({path:path.join(out,phase,`detail-${product}-${width}-expanded.jpg`),type:'jpeg',quality:90})
  console.log(phase,product,width,(await content.innerText()).replaceAll('\n',' / '))
  await page.close()
 }}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
