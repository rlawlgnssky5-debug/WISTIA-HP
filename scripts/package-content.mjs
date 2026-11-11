import {createRequire} from 'node:module'
const require=createRequire(import.meta.url)
const pricing=require('../js/package-pricing.js')
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

// Numbers and labels follow js/recording-config.js (sale rate, then list price).
const times=[[50,50000,50000],[90,80000,90000],[150,120000,150000]]
const workOptions=['음정·박자 보정','정밀 믹싱','마스터링']
const cities=['부천시','인천광역시','시흥시','김포시']
const origin='https://www.wistiastudio.com'
const priceRange='₩50,000~₩120,000'

function seoFallback(){
 const timeItems=times.map(([minutes,rate,list])=>{
  const label=pricing.hoursText(minutes)+' '+pricing.money(rate)
  return '<li>'+esc(list>rate?label+' · 할인 적용 전 '+pricing.money(list):label)+'</li>'
 }).join('')
 return [
  '<h1>부천 축가 AR 사전 녹음 · 위스티아</h1>',
  '<p>부천시청역 1번 출구 도보 약 300m · 경기도 부천시 석천로170번길 19, 부광프라자 2층</p>',
  '<h2>인원·녹음 시간·음원 작업을 골라보세요</h2>',
  '<section><h2>녹음 시간</h2><ul>'+timeItems+'</ul></section>',
  '<section><h2>인원</h2><ul><li>1인 기본</li><li>2인 (듀엣곡) +40,000원</li></ul></section>',
  '<section><h2>음원 작업</h2><ul>'+workOptions.map(label=>'<li>'+esc(label)+' +40,000원</li>').join('')+'</ul></section>',
  '<section><h2>작업 기간</h2><ul><li>7일 이내 기본</li><li>3일 이내 +30,000원</li><li>전달 : 녹음일 기준 7일 이내</li></ul></section>',
  '<section><h2>할인</h2><ul>',
  '<li>첫 이용 20,000원 할인 · 50분 제외</li>',
  '<li>11월 마스터링 무료 · 50분 제외</li>',
  '<li>녹음일 1개월 이후 10,000원 할인 · 50분 제외</li>',
  '</ul></section>'
 ].join('')
}

function recordingServices(){
 const areaServed=cities.map(name=>({'@type':'City',name}))
 return times.map(([minutes,rate])=>{
  const label=pricing.hoursText(minutes)
  const url=origin+'/event/solo?recordingMinutes='+minutes
  return {
   '@type':'Service',
   '@id':origin+'/#service-'+minutes,
   name:'위스티아 축가 AR 사전 녹음 · 녹음 '+label,
   serviceType:'축가 AR 사전 녹음',
   description:'1곡 · 녹음 '+label+' · 인원 : 1인 기본, 2인 (듀엣곡) +40,000원 · 음원 작업 : 음정·박자 보정, 정밀 믹싱, 마스터링 각 +40,000원 선택 · 1:1 디렉팅 · 전달 : 녹음일 기준 7일 이내 (3일 이내 +30,000원)',
   url,
   provider:{'@id':origin+'/#studio'},
   areaServed,
   offers:{'@type':'Offer',price:rate,priceCurrency:'KRW',url,availability:'https://schema.org/InStock'}
  }
 })
}

function isRetiredTypeService(item){
 if(item['@type']!=='Service')return false
 const blob=JSON.stringify(item)
 return /위스티아 AR 축가 타입|[?&]package=[A-D]\b|STANDARD|DELUXE|\bPREMIUM\b|#service-[A-D]\b|170000|220000|240000/.test(blob)
}

function isCurrentRecordingService(item){
 return item['@type']==='Service' && /#service-(50|90|150)\b/.test(item['@id']||'')
}

function patchFaqText(text){
 return String(text)
  .replaceAll('모든 타입은 녹음일 기준 7일 이내에 완성 음원을 전달해 드려요','완성 음원은 녹음일 기준 7일 이내에 전달해 드려요')
  .replaceAll('모든 타입은 녹음일 기준 7일 이내에 전달해 드려요','완성 음원은 녹음일 기준 7일 이내에 전달해 드려요')
  .replaceAll('선택하신 타입의 녹음 시간에','선택하신 녹음 시간에')
}

function patchFaqPage(item){
 if(item['@type']!=='FAQPage'||!Array.isArray(item.mainEntity))return item
 for(const question of item.mainEntity){
  const answer=question.acceptedAnswer
  if(answer?.text)answer.text=patchFaqText(answer.text)
 }
 return item
}

function updateJsonLd(body){
 const data=JSON.parse(body),graph=data['@graph']
 if(!graph)return body
 for(const item of graph){
  if(item['@type']==='LocalBusiness'||item['@type']==='ProfessionalService')item.priceRange=priceRange
  patchFaqPage(item)
 }
 const hasCurrent=graph.some(isCurrentRecordingService)
 const withoutRetired=graph.filter(item=>!isRetiredTypeService(item))
 const next=hasCurrent&&withoutRetired.length===graph.length?withoutRetired:[...withoutRetired.filter(item=>!isCurrentRecordingService(item)),...recordingServices()]
 return JSON.stringify({...data,'@graph':next},null,1)
}

export function updatePackageHtml(html,file){
 if(!/\bid=["']app["']/.test(html))return html
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,start,body,end)=>start+'\n'+updateJsonLd(body)+'\n'+end)
 html=html.replace(/(<div class="seo-fallback" data-seo-fallback[^>]*>)[\s\S]*?(<\/div><\/main>)/,(_,start,end)=>start+seoFallback()+end)
 return html
}
