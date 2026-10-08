import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {assertContactBusinessPreserved,assertBeforeAfterCorePreserved} from './svg-interface-fixture.mjs'
import {runInNewContext} from 'node:vm'
import {graphicsFixture,assertPreservedAppLogic} from './studio-graphics-fixture.mjs'
import {assertManualReviews} from './manual-reviews-fixture.mjs'
import {assertInquiryWithoutName} from './inquiry-without-name-fixture.mjs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const bytes=path=>readFileSync(new URL('../'+path,import.meta.url))
const hash=data=>createHash('sha256').update(data).digest('hex')
const textHash=path=>hash(read(path).replace(/\r\n/g,'\n'))
const source=read('js/app.js'),css=read('css/detail-consistency.css'),finish=read('css/luxury-finish.css')
const slice=(start,end)=>{
 const from=source.indexOf(start),to=source.indexOf(end,from+start.length)
 assert.ok(from>=0&&to>from,start+' has an explicit isolated source boundary')
 return source.slice(from,to)
}
const scope={window:{},app:{innerHTML:''},footer:()=>'',escapeHtml:value=>String(value)}
runInNewContext(source.slice(0,source.indexOf('const ACTUAL_REVIEW_IMAGES'))+graphicsFixture(source),scope)
runInNewContext(source.match(/^const (?:won|shortWon) =[^\n]+/gm).join('\n'),scope)
runInNewContext(slice('function mobileDetailEvents(','function mobileDetailReviews(')+slice('function eventBenefitsSection(','function priceSidebarSection(')+slice('function renderEventsPage(','let contactQuote='),scope)
const events=JSON.parse(runInNewContext('JSON.stringify(EVENTS)',scope))
assert.deepEqual(events,[
 {key:'blog',type:'payback',label:'블로그 리뷰',discount:30000,detail:'일 방문자 100명 이상 · 안내 가이드에 따라 작성'},
 {key:'reaction',type:'payback',label:'현장 리액션 영상',discount:10000,detail:'본식 현장 촬영 파일 제공'},
 {key:'cafe',type:'payback',label:'웨딩 카페 후기',discount:10000,detail:'300자 이상 · 관련 사진 4장 이상'},
 {key:'instagram',type:'payback',label:'인스타그램 후기',discount:10000,detail:'후기 50자 이상 · 사진 4장 이상 · BGM 추가 · 공식 계정 태그 · 공개 계정'},
],'the four review paybacks remain unchanged')

const checkGroups=html=>{
 const groups=[...html.matchAll(/<section class="[^"]*benefit-kind-card" data-benefit-type="(discount|payback)"[^>]*>([\s\S]*?)<\/section>/g)]
 assert.deepEqual(groups.map(match=>match[1]),['payback'],'two separate boxes in payment order')
 for(const [index,type,title,maximum,timing] of [[0,'payback','후기 페이백','6만원','조건 확인 후 지급']]){
  const group=groups[index][2]
  assert.match(group,new RegExp('<h[24]>'+title+'</h[24]>'))
  assert.ok(group.includes('class="benefit-kind-limit">최대 '+maximum+'</strong>'))
  assert.ok(group.includes('class="benefit-kind-timing">'+timing+'</span>'))
  for(const event of events){
   assert.equal(group.includes(event.label),event.type===type,event.key+' is only in its correct box')
   assert.equal(group.includes(event.detail),event.type===type,event.key+' keeps its full condition')
  }
 }
 assert.ok(groups[0][2].includes('결제 금액에서 미리 차감하지 않습니다'),'payback timing is never disguised as an immediate discount')
 return groups
}

const detail=scope.mobileDetailEvents()
const detailGroups=checkGroups(detail)
assert.match(detail,/<details class="mas-event-disclosure"><summary>/,'native disclosure remains initially closed and keyboard operable')
assert.match(detail,/참여 혜택 최대 6만원/)
assert.equal((detailGroups[0][2].match(/<li>/g)||[]).length,4)
assert.doesNotMatch(detail,/<input|<form|data-event=/,'detail disclosure cannot change the inquiry selection')
const gift='assets/img/studio-3d/gift-benefits-yellow-v1.webp'
assert.ok(detail.includes('<span class="mas-event-gift" aria-hidden="true"><img src="/'+gift+'" alt="" width="48" height="48"'),'the yellow 3D gift is decorative, not duplicated accessible content')
assert.doesNotMatch(detail,/studio-icon-gift|🎁|gift\.svg/,'the selected gift is not replaced by an emoji or flat drawing')

runInNewContext('let selectedEvents=new Set()',scope)
for(const keys of [[],['weekday','blog'],events.map(event=>event.key)]){
 scope.selectedKeys=keys
 runInNewContext('selectedEvents=new Set(selectedKeys)',scope)
 const inquiry=scope.eventBenefitsSection('03'),groups=checkGroups(inquiry)
 assert.equal((groups[0][2].match(/data-event=/g)||[]).length,4)
 assert.equal((inquiry.match(/class="event-terms"/g)||[]).length,4)
 for(const event of events){
  const input=inquiry.match(new RegExp('<input[^>]+data-event="'+event.key+'"[^>]*>'))
  assert.ok(input,event.key+' retains its original selection binding')
  assert.equal(/\bchecked\b/.test(input[0]),keys.includes(event.key),event.key+' preserves the chosen state')
 }
 assert.match(inquiry,/id="eventDiscountTotal" aria-live="polite"/,'live totals are preserved')
 assert.doesNotMatch(inquiry,/<details|<summary|data-option="rush"/)
 assert.deepEqual(JSON.parse(runInNewContext('JSON.stringify([...selectedEvents])',scope)),keys,'rendering the new boxes never mutates selection state')
}
scope.renderEventsPage()
const publicGroups=checkGroups(scope.app.innerHTML)
assert.equal((publicGroups[0][2].match(/class="wistia-event-card"/g)||[]).length,4)
assert.doesNotMatch(scope.app.innerHTML,/<input|<form/,'the general event listing remains read-only')

// Exercise all 32 remaining benefit combinations for all three active products
runInNewContext(slice('const FILM_FORMAT_PRODUCTS','const WORKS')+source.match(/^function filmFormatPrice[^\n]+/m)[0]+`
let currentEventProduct='solo',currentEventPurpose='',selectedFilmFormat='live',selectedFilmPeople=1
let selectedOptions=new Set(['rush']),optionQuantities={},chosenOption=''
`+slice('function eventProductOptions(','function renderProductOption('),scope)
for(const [key,base] of [['solo',120000],['duo',160000],['duet-film',350000]]){
 for(let mask=0;mask<16;mask++){
  const chosen=events.filter((event,index)=>mask&(1<<index))
  scope.calculationState={key,keys:chosen.map(event=>event.key)}
  const result=runInNewContext('currentEventProduct=calculationState.key;selectedEvents=new Set(calculationState.keys);calculate()',scope)
  const total=type=>chosen.filter(event=>event.type===type).reduce((sum,event)=>sum+event.discount,0)
  assert.equal(result.product.normal,base,key+' keeps its approved base price')
  assert.equal(result.optionPrice,0,'a stale rush selection never adds an option fee')
  assert.equal(result.discount,total('discount'))
  assert.equal(result.payback,total('payback'))
  assert.equal(result.finalPrice,base-total('discount'),'payback never reduces payment')
  assert.equal(result.effectivePrice,base-total('discount')-total('payback'))
 }
}
assertPreservedAppLogic(source)
assertManualReviews(source)
assertInquiryWithoutName(read('js/contact-form.js'))
assertContactBusinessPreserved(read('js/contact-form.js'))
assertBeforeAfterCorePreserved(read('js/before-after.js'))
assert.equal(textHash('js/quick-estimate.js'),'d3c34804d4c951aad4a628f501fe878a7cdf0aaaea1c116bbcb1e9e64464b40b','unused quick estimate remains unchanged from deployed HEAD')

const reviewHashes=['c34f36e0763fece782dd51343734e8c9b1bc3cf46dd450442c454011f1b6bb87','ee5a9f80df26b10046cb12383d92539d00945d0555901e6b6a2f4d1abe90d2a6','82f8aefd3500ed2b818523a472d856524bb21c12dfe7c42d5f3ebe639fc4bfb0','fc2da2aa7e5fb4658a916ea56d16a4047071ae5e45e58da32ceef52e4636a0d7','047b61fe0fdf596c7f09a31924dab97e0b28733f00aaa19c2a1307641817094a','47ff783549421d3e538e92f2ef240fcb35e52695aac0f6096971b55b7e09b59b','695751ebf0fc9a73485e385befe4bbdec733a87917a9256c2e387e3e0cb3e996','929fbe2166f459cf2ad7693e8c78fbdae56a515f1d04089a3a9e803acbf7b876','dc7e3ad502bdead4c9e233a412cafeadb502673ad37c37f5eaa0282f3f90ccd1','14ec6a4807fc94baada76923beeb35abddf7933fb5956b178d8f9bb0847d3189','80e61027606a5a3be1928e60ca578e057c7e8ce390a8dc6b28857f256752131e','24bbdfc0787c96ba4406b223e784a0753ce1f69fc47edea9703d76d81267688d','0c79775358105675a204461f09fc477d40af426af126f4f775e55d8976ad8117','42ceecd5a10ed775026548a8fc1ec84f8e7866394fb0d17c1fb3a0a8c2c20cfb','f68f9e03b5a1b72bf80d2270f20908b61f3be9c23c1647ad5aa0ee4c5eb314d7','2a8b8f52f00db96e0e4d22c31e07bd7773fc43d1e47e99bb228c7c1700596399']
for(let index=0;index<reviewHashes.length;index++){
 const filename=index===5?'review-06-clean.webp':'review-'+String(index+1).padStart(2,'0')+'.webp'
 assert.equal(hash(bytes('assets/img/reviews/'+filename)),reviewHashes[index],filename+' remains the real approved review')
}
for(const [path,digest] of [
 ['assets/img/song-options/lyric-video-v2.webp','ca947d5ef39db38f9e296be8d378f222fad426c55406750693de237616c9414b'],
 ['assets/img/ar-detail/broadcast-typography-wistia-v2.png','af7f610506d96dab20753b836fa6a01c97a10948ea16d3deb4464cca2883d929'],
 ['assets/img/studio-graphics/broadcast.svg','e59ec317eb091527adb6b7553e94bc0e563ad8e9efe5a4e7fff09a57241e270e']
])assert.equal(hash(bytes(path)),digest,path+' is preserved byte-for-byte')
assert.match(finish,/\.mas-event-price strong,\.quote-effective,\.quote-effective strong\)\{color:#C62828!important/,'effective price remains red')

const giftBytes=bytes(gift),manifest=JSON.parse(read(gift.replace('.webp','.json')))
assert.equal(giftBytes.subarray(0,4).toString(),'RIFF')
assert.equal(giftBytes.subarray(8,16).toString(),'WEBPVP8X')
assert.equal(giftBytes.readUInt32LE(4)+8,giftBytes.length)
assert.ok(giftBytes[20]&0x10,'transparency is preserved in the generated WebP')
assert.equal(giftBytes.readUIntLE(24,3)+1,256)
assert.equal(giftBytes.readUIntLE(27,3)+1,256)
assert.ok(giftBytes.length<25000,'the gift stays compact enough for a small UI image')
assert.equal(manifest.output,gift)
assert.equal(manifest.transparent,true)
assert.match(manifest.mode,/built-in image_gen/)
assert.match(manifest.prompt,/3D/)
assert.match(manifest.prompt,/#E7B928/)
assert.match(manifest.prompt,/no people, no faces, no hands, no letters, no numbers, no logos, no text/)
assert.doesNotMatch(JSON.stringify(manifest),/[A-Z]:[\\/]|C:\\Users/i,'provenance contains no private absolute workstation path')
assert.match(css,/\.mas-event-gift img\{[^}]*object-fit:contain!important;filter:none!important/)
assert.match(css,/\.mas-event-disclosure>summary\{[^}]*grid-template-columns:48px minmax\(0,1fr\) 20px!important;gap:12px!important;[^}]*min-height:80px!important/)
assert.match(css,/\.benefit-kind-grid\{[^}]*grid-template-columns:minmax\(0,1fr\)!important;gap:20px!important/)
assert.match(css,/@media\(min-width:769px\)[\s\S]*grid-template-columns:repeat\(auto-fit,minmax\(min\(100%,290px\),1fr\)\)!important/,'two columns depend on content width rather than overflowing the narrow inquiry column')
assert.match(css,/@media\(max-width:360px\)[\s\S]*\.benefit-kind-grid>\.benefit-kind-card\{padding:18px 14px!important\}/)
for(const path of ['index.html','events.html','contact.html','detail/solo.html','detail/duo.html','detail/duet-film.html','event/solo.html','event/duo.html','event/duet-film.html']){
 const html=read(path)
 assert.match(html,/js\/app.js\?v=20261008-contact-calendar-9/,path+' loads the current renderer')
 assert.match(html,/css\/detail-consistency.css\?v=20261006-benefit-boxes-1/,path+' loads the separated boxes styles')
}
console.log('Yellow gift, four paybacks, 48 calculations, selection preservation, protected assets and caches passed')
