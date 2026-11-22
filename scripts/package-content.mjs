import {createRequire} from 'node:module'
const require=createRequire(import.meta.url)
const pricing=require('../js/package-pricing.js')
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

// Numbers and labels follow js/recording-config.js — 2026-11-19 단일 상품: 녹음 2시간 + 보컬 튜닝 + 전문 믹싱 + 마스터링
const list=240000,start=180000
const included=[['녹음 2시간',120000],['보컬 튜닝',40000],['전문 믹싱',40000],['마스터링',40000]]
const cities=['부천시','인천광역시','시흥시','김포시']
const origin='https://www.wistiastudio.com'
const priceRange='₩180,000~₩240,000'

function seoFallback(){
 return [
  '<h1>부천 축가 AR 사전 녹음 · 위스티아</h1>',
  '<p>부천시청역 1번 출구 도보 약 300m · 경기도 부천시 석천로170번길 19, 부광프라자 2층</p>',
  '<h2>녹음 2시간 + 보컬 튜닝 + 전문 믹싱 + 마스터링</h2>',
  '<section><h2>기본 구성</h2><ul>'+included.map(([label,price])=>'<li>'+esc(label)+' '+pricing.money(price)+'</li>').join('')+'<li>정가 '+pricing.money(list)+'</li></ul></section>',
  '<section><h2>옵션</h2><ul><li>인원 추가 (듀엣곡) +40,000원</li><li>녹음 1시간 추가 +60,000원</li></ul></section>',
  '<section><h2>할인</h2><ul><li>첫 이용 20,000원 할인</li><li>이번 달 최저가 보상 이벤트 40,000원 할인</li><li>1개월 일찍 예약 10,000원 · 2개월 일찍 예약 20,000원 할인</li><li>첫 이용 기준 '+pricing.money(start)+'</li></ul></section>'
 ].join('')
}

function recordingServices(){
 const areaServed=cities.map(name=>({'@type':'City',name}))
 const url=origin+'/event/solo'
 return [{
  '@type':'Service',
  '@id':origin+'/#service-recording',
  name:'위스티아 축가 AR 사전 녹음 · 올인원 패키지 (녹음 2시간 + 보컬 튜닝 + 전문 믹싱 + 마스터링)',
  serviceType:'축가 AR 사전 녹음',
  description:'1곡 · 녹음 2시간 · 보컬 튜닝·전문 믹싱·마스터링 포함 · 정가 240,000원 · 인원 추가 +40,000원 · 녹음 1시간 추가 +60,000원 · 1:1 디렉팅 · 전달 : 녹음일 기준 7일 이내',
  url,
  provider:{'@id':origin+'/#studio'},
  areaServed,
  offers:{'@type':'Offer',price:start,priceCurrency:'KRW',url,availability:'https://schema.org/InStock'}
 }]
}

function isRetiredTypeService(item){
 if(item['@type']!=='Service')return false
 const blob=JSON.stringify(item)
 return /위스티아 AR 축가 타입|[?&]package=[A-D]\b|STANDARD|DELUXE|\bPREMIUM\b|#service-[A-D]\b|170000|220000|240000/.test(blob)
}

function isCurrentRecordingService(item){
 return item['@type']==='Service' && /#service-(50|90|150|recording)\b/.test(item['@id']||'')
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
  if(item['@type']==='Organization'){
   item.legalName='길지컴퍼니'
   item.taxID='748-53-00845'
  }
  patchFaqPage(item)
 }
 const next=[...graph.filter(item=>!isRetiredTypeService(item)&&!isCurrentRecordingService(item)),...recordingServices()]
 return JSON.stringify({...data,'@graph':next},null,1)
}

export function updatePackageHtml(html,file){
 if(!/\bid=["']app["']/.test(html))return html
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,start,body,end)=>start+'\n'+updateJsonLd(body)+'\n'+end)
 html=html.replace(/(<div class="seo-fallback" data-seo-fallback[^>]*>)[\s\S]*?(<\/div><\/main>)/,(_,start,end)=>start+seoFallback()+end)
 return html
}
