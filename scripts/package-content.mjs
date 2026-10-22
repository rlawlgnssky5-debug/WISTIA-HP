import {createRequire} from 'node:module'
const require=createRequire(import.meta.url)
const pricing=require('../js/package-pricing.js'),seo=require('../js/seo-meta.js')
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
export function updatePackageHtml(html,file){
 if(!/\bid=["']app["']/.test(html))return html
 const path=file==='index.html'?'/':'/'+file.replace(/\.html$/,''),origin='https://www.wistiastudio.com'
 const meta=path==='/detail/solo'?seo.detail.solo:path==='/detail/duo'?seo.detail.duo:path==='/'?{...seo.home,title:'부천 축가 녹음 · AR 축가 사전녹음 · 셀프 축가 | 위스티아'}:null
 if(meta){
  html=html.replace(/<title>[^<]*<\/title>/,'<title>'+esc(meta.title)+'</title>')
  for(const [attribute,name,value] of [['name','description',meta.description],['property','og:title',meta.title],['property','og:description',meta.description],['name','twitter:title',meta.title],['name','twitter:description',meta.description]])html=html.replace(new RegExp('(<meta '+attribute+'="'+name+'" content=")[^"]*(">)'),(_,start,end)=>start+esc(value)+end)
 }
 const services=Object.values(pricing.packages).map(p=>({'@type':'Service',name:'위스티아 AR 축가 패키지 '+p.key,serviceType:'AR 축가 사전녹음',description:pricing.features(p).join(' · '),url:origin+'/detail/solo?package='+p.key,provider:{'@id':origin+'/#studio'},offers:{'@type':'Offer',price:p.price,priceCurrency:'KRW',url:origin+'/detail/solo?package='+p.key}}))
 const faq={'@type':'FAQPage',mainEntity:[{q:'패키지는 어떻게 다른가요?',a:'A는 녹음 1시간과 기본 믹싱, B는 보컬 튜닝과 디테일 믹싱 포함, C는 B 구성에 녹음 1시간을 더해 총 2시간이에요'},{q:'완성 음원은 언제 받을 수 있나요?',a:'A 기본 구성은 당일, B·C 또는 보컬 튜닝 선택 시 영업일 7일 이내 전달해 드려요'},{q:'100% 립싱크도 선택할 수 있나요?',a:'100% 립싱크 옵션은 20,000원 추가예요'}].map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,start,body,end)=>{
  const data=JSON.parse(body),graph=data['@graph'];if(!graph)return start+body+end
  const retained=graph.filter(x=>!['Service','FAQPage'].includes(x['@type']))
  for(const item of retained){if(item['@type']==='LocalBusiness')item.priceRange='90000-170000 KRW';if(item['@type']==='WebPage'){item.url=origin+path;item['@id']=origin+path+'#webpage';if(meta)item.name=meta.title}}
  return start+'\n'+JSON.stringify({...data,'@graph':[...retained,...services,faq]},null,1)+'\n'+end
 })
 const fallback='<h1>부천 AR 축가 사전녹음 · 위스티아</h1><p>부천시청역 1번 출구 도보 약 300m · 경기도 부천시 석천로170번길 19, 2층</p><h2>패키지로 예약하면 더 저렴해요!</h2>'+Object.values(pricing.packages).map(p=>'<section><h2>'+p.key+' | '+esc(p.title)+' — '+pricing.money(p.price)+'</h2><ul>'+pricing.features(p).map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>').join('')+'<h2>추가 옵션</h2><p>듀엣으로 변경 30,000원 · 녹음 시간 유지</p><ul>'+pricing.options.map(o=>'<li>'+esc(o.label)+' '+pricing.money(o.price)+'</li>').join('')+'</ul><h2>후기 페이백</h2><p>네이버 블로그 리뷰와 본식 현장 영상 제공 각각 30,000원 · 최대 60,000원 · 결제 시 미리 차감하지 않고 조건 확인 후 환급</p>'
 html=html.replace(/(<div class="seo-fallback" data-seo-fallback[^>]*>)[\s\S]*?(<\/div><\/main>)/,(_,start,end)=>start+fallback+end)
 return html
}
