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
 const services=Object.values(pricing.packages).map(p=>({'@type':'Service',name:'위스티아 AR 축가 타입 '+p.key,serviceType:'AR 축가 사전녹음',description:pricing.features(p).join(' · '),url:origin+'/?package='+p.key,provider:{'@id':origin+'/#studio'},offers:{'@type':'Offer',price:p.price,priceCurrency:'KRW',url:origin+'/?package='+p.key}}))
 const homeFaq={'@type':'FAQPage',mainEntity:[{q:'노래를 잘 못해도 괜찮을까요?',a:'네, 한 구간씩 나누어 녹음하고 옆에서 1:1로 방향을 잡아 드려요'},{q:'어려운 부분은 다시 부를 수 있나요?',a:'어려운 구간은 충분히 다시 녹음하며 맞춰갑니다. 한 소절씩 듣고 디렉팅을 받아 편하게 진행하실 수 있습니다'},{q:'원곡의 키가 너무 높은데 괜찮을까요?',a:'원키가 높거나 낮아도 괜찮아요. 녹음 전에 직접 불러 보면서 목소리에 가장 편한 키로 맞춰 드려요'},{q:'완성 음원은 언제 받을 수 있나요?',a:'STANDARD 기본 구성은 당일 전달해 드려요. DELUXE·PREMIUM·DUET 또는 음정·박자 보정 선택 시 영업일 7일 이내에 전달해 드려요'},{q:'본식에서는 어떻게 사용하나요?',a:'예식장에서 AR을 재생하고 그 위에 직접 노래하시면 돼요. 본식 전에 예식장 담당자에게 음원을 전달하고, 재생과 마이크 리허설이 되는지 확인해 주세요'},{q:'녹음한 목소리의 비율도 고를 수 있나요?',a:'위스티아는 모든 비율을 다 만들어 드려요, 그날 컨디션에 맞게 골라 쓰세요'}].map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,start,body,end)=>{
  const data=JSON.parse(body),graph=data['@graph'];if(!graph)return start+body+end
  const existingFaq=graph.find(x=>x['@type']==='FAQPage')
  const faq=path==='/'?homeFaq:path==='/info/faq'?existingFaq:null
  const retained=graph.filter(x=>!['Service','FAQPage'].includes(x['@type']))
  for(const item of retained){if(item['@type']==='LocalBusiness')item.priceRange='90000-200000 KRW';if(item['@type']==='WebPage'){item.url=origin+path;item['@id']=origin+path+'#webpage';if(meta)item.name=meta.title}}
  return start+'\n'+JSON.stringify({...data,'@graph':[...retained,...services,...(faq?[faq]:[])]},null,1)+'\n'+end
 })
 const fallback='<h1>부천 AR 축가 사전녹음 · 위스티아</h1><p>부천시청역 1번 출구 도보 약 300m · 경기도 부천시 석천로170번길 19, 부광프라자 2층</p><h2>내게 맞는 녹음 타입을 골라보세요</h2>'+Object.values(pricing.packages).map(p=>'<section><h2>'+p.key+' | '+esc(p.title)+' — '+pricing.money(p.price)+'</h2><ul>'+pricing.features(p).map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>').join('')+'<h2>추가 옵션</h2><p>듀엣으로 변경 30,000원 · 녹음 시간 유지</p><ul>'+pricing.options.map(o=>'<li>'+esc(o.label)+' '+pricing.money(o.price)+'</li>').join('')+'</ul><h2>후기 페이백</h2><p>네이버 블로그 리뷰와 본식 현장 영상 제공 각각 30,000원 · 최대 60,000원 · 결제 시 미리 차감하지 않고 조건 확인 후 환급</p>'
 html=html.replace(/(<div class="seo-fallback" data-seo-fallback[^>]*>)[\s\S]*?(<\/div><\/main>)/,(_,start,end)=>start+fallback+end)
 return html
}
