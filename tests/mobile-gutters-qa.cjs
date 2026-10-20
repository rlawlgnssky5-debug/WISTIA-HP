const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const sharp=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=process.env.WISTIA_QA_ROOT||path.resolve(__dirname,'..');
const dir=path.join(root,'tmp/mobile-gutters-20261020');
const phase=process.argv[2]||'before';
const routes=process.env.QA_CONTACT_ONLY?['/contact']:['/','/detail/solo','/detail/duo','/info/faq','/contact','/event/solo','/event/duo'];
const widths=[360,375,390,1280];
const out=path.join(dir,phase);
// CSS layout uses fractional device pixels; allow < 0.01px serialization noise only.
function sameFont(a,b){const re=/\d+(?:\.\d+)?/g,aa=a.match(re)||[],bb=b.match(re)||[];return a.replace(re,'#')===b.replace(re,'#')&&aa.length===bb.length&&aa.every((v,i)=>Math.abs(Number(v)-Number(bb[i]))<.01)}
// Background canvases are appended as their images decode, not in deterministic DOM order.
// Compare every canvas too, but by its visual rectangle rather than insertion timing.
function canonicalLayout(elements){return [...elements.filter(e=>e.cls!=='pc-image-background'),...elements.filter(e=>e.cls==='pc-image-background').sort((a,b)=>a.rect.y-b.rect.y||a.rect.x-b.rect.x)]}
async function settle(p){
 await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');document.querySelectorAll('video,audio').forEach(v=>v.pause());await document.fonts.ready;await Promise.all([...document.images].map(i=>i.complete?null:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,8000)})))});
 for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=1800){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(20)}
 await p.evaluate(()=>{scrollTo(0,0);document.querySelectorAll('video,audio').forEach(v=>v.pause())});await p.waitForTimeout(300);
}
async function metrics(p){return p.evaluate(()=>{
 const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}};
 const visible=e=>!!(e.getBoundingClientRect().width&&e.getBoundingClientRect().height)&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none';
 const app=document.querySelector('#app'),all=[...app.querySelectorAll('*')];
 return{scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,text:app.textContent,
 elements:all.map(e=>{const s=getComputedStyle(e);return{tag:e.tagName,cls:e.className,rect:rect(e),font:s.font,color:s.color,background:s.backgroundColor,padding:s.padding,radius:s.borderRadius}}),
 images:[...app.querySelectorAll('img')].map(e=>({src:e.getAttribute('src'),cls:e.className,parent:e.parentElement.className,rect:rect(e),visible:visible(e),nw:e.naturalWidth,nh:e.naturalHeight,fit:getComputedStyle(e).objectFit,radius:getComputedStyle(e).borderRadius})),
 fixed:[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed'&&visible(e)).map(e=>({id:e.id,cls:e.className,rect:rect(e)})),
 hidden:[...document.querySelectorAll('[data-seo-fallback],.mas-brand,.mas-product-kicker,.page-back,.intro-overlay')].map(e=>({cls:e.className,rect:rect(e),display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility})),
 gutters:[...document.querySelectorAll('.mobile-ar-solo,.info-page-faq,.wistia-wizard')].map(e=>({cls:e.className,rect:rect(e),padding:getComputedStyle(e).padding}))};
})}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const b=process.env.QA_COMPARE_ONLY?null:await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const report=process.env.QA_COMPARE_ONLY?JSON.parse(fs.readFileSync(path.join(out,'metrics.json'))):[];
 if(!process.env.QA_COMPARE_ONLY)await Promise.all(widths.map(async width=>{for(const route of routes){
  const c=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce',deviceScaleFactor:1});
  await c.route('**/*',r=>{const q=r.request(),u=new URL(q.url());if(!['GET','HEAD'].includes(q.method())||(/^https?:$/.test(u.protocol)&&u.hostname!=='127.0.0.1')||/\.(mp4|mp3|wav|m4a)(\?|$)/.test(u.pathname))return r.abort();return r.continue()});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto((process.env.WISTIA_QA_BASE_URL||'http://127.0.0.1:4196')+route,{waitUntil:'networkidle'});await settle(p);
  const name=(route==='/'?'home':route.slice(1).replaceAll('/','-'))+'-'+width;
  async function capture(suffix=''){await settle(p);await p.screenshot({path:path.join(out,name+suffix+'.png'),fullPage:true,animations:'disabled'});const e={route,width,name:name+suffix,errors:[...errors],...await metrics(p)};report.push(e);console.log(phase,e.name,'height='+e.height,'scrollWidth='+e.scrollWidth,'errors='+errors.length)}
  await capture();
  if(route==='/contact')for(let step=1;step<=4;step++){
   if(step===2)await p.locator('[name="eventDateUnknown"]').check();
   if(step===3){
    const d=p.locator('[data-calendar-day]:not([disabled])').first();
    if(await d.count())await d.click();
    await p.waitForTimeout(800);
    const time=p.locator('[data-wf-time]:not([disabled]):not([aria-disabled="true"])').first();
    if(await time.count())await time.click();
    await capture('-step3-time');
   }
   await p.locator('[data-wf-next]').click();await p.waitForTimeout(150);
   if(!await p.locator('[data-wf-step="'+step+'"]').isVisible()){console.log('Wizard stopped before step',step+1);break}
   await capture('-step'+(step+1));
  }
  await c.close();
 }}));
 await b?.close();
 if(process.env.QA_CONTACT_ONLY&&fs.existsSync(path.join(out,'metrics.json'))){const old=JSON.parse(fs.readFileSync(path.join(out,'metrics.json')));report.push(...old.filter(e=>!report.some(n=>n.name===e.name)));}
 fs.writeFileSync(path.join(out,'metrics.json'),JSON.stringify(report,null,2));
 if(phase==='after'){
  const old=JSON.parse(fs.readFileSync(path.join(dir,'before/metrics.json'))),findings=[];
  fs.mkdirSync(path.join(dir,'comparisons'),{recursive:true});
  for(const e of report){const a=old.find(x=>x.name===e.name);if(!a)continue;
   const pa=path.join(dir,'before',e.name+'.png'),pb=path.join(out,e.name+'.png'),ma=await sharp(pa).metadata(),mb=await sharp(pb).metadata();
   await sharp({create:{width:ma.width+mb.width+12,height:Math.max(ma.height,mb.height),channels:3,background:'#ccc'}}).composite([{input:pa,left:0,top:0},{input:pb,left:ma.width+12,top:0}]).png().toFile(path.join(dir,'comparisons',e.name+'.png'));
   findings.push({name:e.name,width:e.width,scrollWidth:e.scrollWidth,beforeScrollWidth:a.scrollWidth,textUnchanged:e.text===a.text,imagesUnchanged:JSON.stringify(e.images.map(i=>i.src))===JSON.stringify(a.images.map(i=>i.src)),fontsUnchanged:e.elements.every((n,i)=>sameFont(n.font,a.elements[i]?.font||'')),colorsUnchanged:e.elements.every((n,i)=>n.color===a.elements[i]?.color&&n.background===a.elements[i]?.background),fixedUnchanged:JSON.stringify(e.fixed.map(i=>({id:i.id,cls:i.cls,x:i.rect.x,w:i.rect.w})))===JSON.stringify(a.fixed.map(i=>({id:i.id,cls:i.cls,x:i.rect.x,w:i.rect.w}))),desktopGeometryUnchanged:e.width<601||JSON.stringify(canonicalLayout(e.elements))===JSON.stringify(canonicalLayout(a.elements)),brokenImages:e.images.filter(i=>i.visible&&!i.nw).map(i=>i.src),errors:e.errors});
  }
  fs.writeFileSync(path.join(dir,'findings.json'),JSON.stringify(findings,null,2));
  fs.writeFileSync(path.join(dir,'index.html'),'<!doctype html><meta charset="utf-8"><title>모바일 여백 비교</title><style>body{margin:24px;font:16px system-ui;background:#eee}h1{font-size:24px}details{padding:12px;background:white;margin:12px 0}img{display:block;max-width:100%;height:auto}a{margin-right:16px}</style><h1>모바일 여백 검수 · 왼쪽 수정 전 / 오른쪽 수정 후</h1><p>로컬 미리보기 · 실제 문의 전송 없음 · 운영 배포 없음</p>'+report.map(e=>'<details><summary>'+e.name+'</summary><p><a href="before/'+e.name+'.png">수정 전 전체</a><a href="after/'+e.name+'.png">수정 후 전체</a><a href="comparisons/'+e.name+'.png">나란히 전체</a></p><img loading="lazy" src="comparisons/'+e.name+'.png"></details>').join(''));
  console.log(JSON.stringify(findings,null,2));
 }
})().catch(e=>{console.error(e);process.exit(1)});
