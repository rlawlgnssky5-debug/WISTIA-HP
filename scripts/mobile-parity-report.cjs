const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/mobile-parity-20261021')
const read=f=>JSON.parse(fs.readFileSync(path.join(out,f),'utf8'))
const before=read('before-measurements.json'),after=read('after-measurements.json')
const summary={cases:after.results.length,errors:after.errors,overflow:[],width:[],font:[],spa:[],missingImages:[],clipped:[],mobileUnexpectedFonts:[],protectedFiles:[],videoMentions:[]}
for(const r of after.results){
 if(r.overflow)summary.overflow.push([r.route,r.width,r.mode,r.overflow])
 if(r.bodyBackground!=='rgb(255, 255, 255)'&&r.width===1280)summary.width.push([r.route,'body',r.bodyBackground])
 if(r.width===1280){
  for(const k of ['main#app','#siteHeader','.footer','.wistia-wizard','.ev2-wrap','.info-page','.detail-cover'])for(const v of r.layout[k]||[])if(Math.abs(v.x-250)>.2||Math.abs(v.width-780)>.2)summary.width.push([r.route,k,v.x,v.width])
  const m=after.results.find(x=>x.route===r.route&&x.width===390&&x.mode===r.mode)
  if(m){const t=new Map(m.type.map(t=>[t.key+'|'+t.text,t]));for(const e of r.type){const p=t.get(e.key+'|'+e.text);if(p&&Math.abs(parseFloat(p.font)-parseFloat(e.font))>.05)summary.font.push([r.route,e.text,p.font,e.font])}}
 }
 if(r.mode==='direct'){
  const s=after.results.find(x=>x.route===r.route&&x.width===r.width&&x.mode==='spa')
  if(s){const t=new Map(s.type.map(t=>[t.key+'|'+t.text,t]));const diff=r.type.filter(e=>{const p=t.get(e.key+'|'+e.text);return !p||['x','y','width','height'].some(k=>Math.abs(p.box[k]-e.box[k])>.2)||p.font!==e.font});if(diff.length)summary.spa.push([r.route,r.width,diff.slice(0,3)])}
  if(r.width===390){const old=before.results.find(x=>x.route===r.route&&x.width===390&&x.mode==='direct');if(old){const t=new Map(old.type.map(t=>[t.key+'|'+t.text,t]));const diff=r.type.filter(x=>{const p=t.get(x.key+'|'+x.text);return p&&Math.abs(parseFloat(p.font)-parseFloat(x.font))>.05});if(diff.length)summary.mobileUnexpectedFonts.push([r.route,diff])}}
 }
 if(r.images.some(i=>!i.loaded))summary.missingImages.push([r.route,r.width,r.mode])
 if(r.clipped.length)summary.clipped.push([r.route,r.width,r.mode,r.clipped])
}
const tracked=cp.execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8'}).trim().split('\n')
for(const f of ['js/analytics.js','js/meta-pixel.js','js/tracking-common.js','js/inquiry-funnel.js','js/contact-form.js','js/booking-wizard.js'])summary.protectedFiles.push({file:f,unchanged:fs.readFileSync(path.join(root,f),'utf8').replaceAll('\r\n','\n')===cp.execFileSync('git',['show','bc0980a:'+f],{cwd:root,encoding:'utf8'}).replaceAll('\r\n','\n')})
for(const f of tracked.filter(f=>/\.(html|js|json|md|svg)$/.test(f)&&!f.startsWith('tests/'))){const s=fs.readFileSync(path.join(root,f),'utf8');s.split(/\r?\n/).forEach((line,i)=>{if(/영상 편집|촬영|뮤직비디오|\bMV\b|스토리 필름/.test(line))summary.videoMentions.push({file:f,line:i+1,excerpt:line.trim().slice(0,400)})})}
const visibleVideo=[]
for(const r of after.results.filter(r=>r.width===390&&r.mode==='direct'))for(const line of r.text.split('\n'))if(/영상 편집|촬영|뮤직비디오|\bMV\b|스토리 필름/.test(line))visibleVideo.push([r.route,line])
summary.visibleVideoMentions=visibleVideo
fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify(summary,null,2))
fs.writeFileSync(path.join(out,'remaining-video-copy.txt'),'화면에 표시되는 문구\n'+visibleVideo.map(x=>x.join(' : ')).join('\n')+'\n\n소스 전체 검색 결과 (기존 비활성 상품·문서·SEO 포함)\n'+summary.videoMentions.map(x=>x.file+':'+x.line+' '+x.excerpt).join('\n'))
const slug=r=>r==='/'?'home':r.slice(1).replaceAll('/','-'),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const section=(title,items)=>'<section><h2>'+title+'</h2><div class="pair">'+items.map(([label,src])=>'<figure><figcaption>'+esc(label)+'</figcaption><a href="'+src+'"><img loading="lazy" src="'+src+'"></a></figure>').join('')+'</div></section>'
let html='<!doctype html><html lang="ko"><meta charset="utf-8"><title>위스티아 780px 검수</title><style>body{margin:0;padding:32px;font:15px/1.6 system-ui;background:#fbf3f3;color:#5a3a40}main{max-width:1500px;margin:auto}.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;align-items:start}section{background:white;padding:24px;margin:24px 0;border:1px solid #ebd5d8;border-radius:16px}figure{margin:0;min-width:0}img{display:block;width:100%;height:auto}a{color:#a65a6c}nav{display:flex;gap:16px;flex-wrap:wrap}.raw{font-family:monospace;font-size:12px}details{margin:18px 0}h1{font-size:28px}h2{font-size:20px}summary{cursor:pointer}@media(max-width:600px){body{padding:12px}.pair{gap:8px}section{padding:12px}}</style><main><h1>위스티아 전체 화면 검수</h1><p>1~5번·7번 반영본 / 6번 색상은 승인 대기 시안이며 배포되지 않음</p><nav><a href="validation.json">측정 결과</a><a href="remaining-video-copy.txt">영상 관련 잔여 문구</a><a href="before-measurements.json">수정 전 128건</a><a href="after-measurements.json">수정 후 128건</a><a href="node-suite.txt">전체 테스트 원문</a></nav>'
html+=section('6번 승인용 상세페이지 전체 시안',[['390px 분홍 구간 시안','extras/colour-preview-detail-solo-390.jpg'],['1280px 분홍 구간 시안','extras/colour-preview-detail-solo-1280.jpg']])
html+=section('메뉴 색상과 780px 오른쪽 정렬',[['390px','extras/menu-390.png'],['1280px','extras/menu-1280.png']])
html+=section('그림 버튼을 제외하고 실제 버튼으로 교체',[['390px','extras/map-390.png'],['1280px','extras/map-1280.png']])
html+='<section><h2>360px 후기 제목</h2><img style="max-width:390px" src="extras/review-360.png"></section>'
for(const route of after.routes){
 const id=slug(route);html+='<details><summary>'+esc(route)+' — PC / 휴대폰, 수정 전 / 후 전체 화면</summary>'
 for(const mode of ['direct','spa']){
  html+=section(esc(route)+' · '+(mode==='direct'?'바로 열기':'소개에서 페이지 이동'),[['PC 1280px','after/'+id+'-1280-'+mode+'.jpg'],['휴대폰 390px','after/'+id+'-390-'+mode+'.jpg']])
  for(const width of [390,1280])html+=section(width+'px 수정 전 / 수정 후',[['수정 전','before/'+id+'-'+width+'-'+mode+'.jpg'],['수정 후','after/'+id+'-'+width+'-'+mode+'.jpg']])
 }
 html+='</details>'
}
html+='</main></html>';fs.writeFileSync(path.join(out,'index.html'),html)
console.log(JSON.stringify({...summary,videoMentions:summary.videoMentions.length,visibleVideoMentions:summary.visibleVideoMentions.slice(0,18)},null,2))
if(after.results.length!==128||['errors','overflow','width','font','spa','missingImages','clipped','mobileUnexpectedFonts'].some(k=>summary[k].length))process.exitCode=1
