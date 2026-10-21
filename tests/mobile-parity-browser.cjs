const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process')
const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/mobile-parity-20261021')
const phase=process.env.WISTIA_PARITY_PHASE||'before',base=process.env.WISTIA_QA_URL||'http://127.0.0.1:4203'
const pages=Object.keys(JSON.parse(fs.readFileSync(path.join(root,'css/bundles.json'))).pages).filter(p=>!p.startsWith('output/'))
const routes=pages.map(p=>p==='index.html'?'/':'/'+p.replace(/\.html$/,'')).filter(r=>!process.env.WISTIA_QA_ROUTES||process.env.WISTIA_QA_ROUTES.split(',').includes(r))
const frozen=new Map()
if(phase==='before'){
 for(const f of cp.execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8'}).trim().split('\n')){
  if(!/^(?:css\/|js\/|[^/]+\.html$|(?:ar|detail|event|find|info|section)\/[^/]+\.html$)/.test(f)||!/\.(?:html|css|js|json)$/.test(f))continue
  const saved=path.join(out,'baseline-source',f)
  frozen.set(f,fs.readFileSync(fs.existsSync(saved)?saved:path.join(root,f)))
 }
}
const slug=r=>r==='/'?'home':r.slice(1).replaceAll('/','-')
async function settle(page){
 await page.waitForFunction(()=>document.querySelector('#app>*')||document.querySelector('.privacy-page main'),{timeout:15000})
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]);await Promise.all([...document.images].map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,4000))])))})
 await page.waitForTimeout(450);await page.evaluate(()=>scrollTo(0,0))
}
async function measure(page){return page.evaluate(()=>{
 const box=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height}}
 const shown=e=>{const s=getComputedStyle(e);return e.getBoundingClientRect().width>1&&e.getBoundingClientRect().height>1&&s.display!=='none'&&s.visibility!=='hidden'&&s.clip!=='rect(0px, 0px, 0px, 0px)'}
 const elements=[...document.querySelectorAll('#siteHeader *,#app *,body.privacy-page main *')].filter(shown)
 const type=elements.filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).map(e=>{
  const s=getComputedStyle(e),parts=[];let node=e
  while(node&&node.id!=='app'&&node.id!=='siteHeader'&&node!==document.body){const siblings=[...node.parentElement.children].filter(n=>n.tagName===node.tagName);parts.unshift(node.tagName.toLowerCase()+':nth-of-type('+(siblings.indexOf(node)+1)+')');node=node.parentElement}
  return {key:(node?.id||'body')+'>'+parts.join('>'),text:[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').slice(0,140),font:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,display:s.display,box:box(e)}
 })
 const selectors=['main#app','#siteHeader','#siteHeader .header-inner','.wistia-wizard','.ev2-wrap','.info-page','.before-after-page','.detail-cover','.footer','.solo-footer-clean','.wistia-about-story','.wistia-specialist-grid','ol.we-process','.booking-guide','.ev2-list','.picker-grid','.process-list.has-images','.ratio-explainer','.service-list','.rv5-grid','#soloPoint04 .solo-p4-buttons','#soloPoint04 .solo-p4-legend','.bap-controls','.solo-p4-transport','#arcKey','.wf-progress','.wf-sources','.solo-map-links']
 const layout=Object.fromEntries(selectors.map(selector=>[selector,[...document.querySelectorAll(selector)].filter(shown).map(e=>{const s=getComputedStyle(e);return {...box(e),display:s.display,columns:s.gridTemplateColumns,direction:s.flexDirection,gap:s.gap,padding:s.padding,background:s.backgroundColor}})]))
 const images=[...document.querySelectorAll('#app img')].filter(shown).map(i=>({src:i.getAttribute('src'),currentSrc:i.currentSrc,...box(i),loaded:i.complete&&i.naturalWidth>0}))
 const clipped=elements.filter(e=>/^(H1|H2|H3|P|LEGEND|STRONG)$/.test(e.tagName)&&e.textContent.trim()).flatMap(e=>{const range=document.createRange();range.selectNodeContents(e);const r=range.getBoundingClientRect();return r.width&&((r.left<-.75)||(r.right>innerWidth+.75))?[{tag:e.tagName,class:e.className,text:e.textContent.slice(0,100),left:r.left,right:r.right}]:[]})
 return {path:location.pathname,width:innerWidth,bodyBackground:getComputedStyle(document.body).backgroundColor,overflow:document.documentElement.scrollWidth-innerWidth,layout,type,images,clipped,seo:[...document.querySelectorAll('.solo-seo,[data-seo-fallback]')].map(e=>({clip:getComputedStyle(e).clip,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),text:document.querySelector('#app')?.innerText||document.body.innerText}
})}
;(async()=>{
 fs.mkdirSync(path.join(out,phase),{recursive:true})
 console.log('Frozen baseline files',frozen.size,'cases',routes.length*4)
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
 async function newContext(){
 const context=await browser.newContext({deviceScaleFactor:1,reducedMotion:'reduce'})
 await context.addInitScript(()=>Object.defineProperty(navigator,'userActivation',{configurable:true,value:{hasBeenActive:false,isActive:false}}))
 await context.route('**/*',async r=>{
  const u=new URL(r.request().url())
  if(!['GET','HEAD'].includes(r.request().method())||/facebook|google-analytics|googletagmanager|doubleclick/.test(u.hostname))return r.abort()
  if(u.origin===base){let file=decodeURIComponent(u.pathname.slice(1)||'index.html');if(!path.extname(file))file+='.html';const data=frozen.get(file);if(data)return r.fulfill({status:200,contentType:file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':'text/html; charset=utf-8',body:file.endsWith('.html')?data.toString().replace(/<meta http-equiv="refresh"[^>]*>/gi,''):data});if(file.endsWith('.html')){const response=await r.fetch();return r.fulfill({response,body:(await response.text()).replace(/<meta http-equiv="refresh"[^>]*>/gi,'')})}}
  return r.continue()
 })
 return context
 }
 const jobs=routes.flatMap(route=>[1280,390].flatMap(width=>['direct','spa'].map(mode=>({route,width,mode}))))
 const saved=process.env.WISTIA_QA_RESUME&&fs.existsSync(path.join(out,phase+'-measurements.json'))?JSON.parse(fs.readFileSync(path.join(out,phase+'-measurements.json'))):null
 const results=saved?.results||[],errors=[];let cursor=0
 async function worker(){
  while(cursor<jobs.length){
   const job=jobs[cursor++],{route,width,mode}=job,name=slug(route)+'-'+width+'-'+mode
   if(results.some(r=>r.route===route&&r.width===width&&r.mode===mode))continue
   const context=await newContext(),page=await context.newPage();page.setDefaultTimeout(20000);await page.setViewportSize({width,height:844})
   page.on('pageerror',e=>errors.push({...job,message:e.message}))
   try{
    await page.goto(base+(mode==='spa'?'/info/about':route),{waitUntil:'domcontentloaded',timeout:30000});await settle(page)
    if(mode==='spa'){await page.evaluate(r=>{history.pushState({},'',r);dispatchEvent(new PopStateEvent('popstate'))},route);await settle(page)}
    const result=await measure(page)
    await page.screenshot({path:path.join(out,phase,name+'.jpg'),fullPage:true,type:'jpeg',quality:68,animations:'disabled',timeout:30000})
    results.push({...job,...result})
    console.log(phase,name,'=>',result.path,'overflow',result.overflow,'main',result.layout['main#app'][0]?.width)
   }catch(e){errors.push({...job,message:e.message});console.log('FAIL',name,e.message)}
   finally{await context.close();fs.writeFileSync(path.join(out,phase+'-measurements.json'),JSON.stringify({base,phase,routes,results,errors},null,2))}
  }
 }
 try{await Promise.all(Array.from({length:Number(process.env.WISTIA_QA_WORKERS||1)},worker))}finally{await browser.close()}
 results.sort((a,b)=>(a.route+a.width+a.mode).localeCompare(b.route+b.width+b.mode))
 fs.writeFileSync(path.join(out,phase+'-measurements.json'),JSON.stringify({base,phase,routes,results,errors},null,2))
 if(errors.length)process.exitCode=1
})().catch(e=>{console.error(e);process.exitCode=1})
