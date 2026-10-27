(function(global){
 'use strict'
 const packages={
  A:{key:'A',name:'STANDARD',title:'음정·박자 보정은 필요 없어요!',price:90000,minutes:50,individual:90000,saving:0,tuning:false,mixing:false,delivery:'당일 음원 전달'},
  B:{key:'B',name:'DELUXE',title:'음정·박자 보정이 필요해요!',price:170000,minutes:90,individual:210000,saving:40000,tuning:true,mixing:true,delivery:'영업일 7일 이내 전달'},
  C:{key:'C',name:'PREMIUM',title:'음정 박자 보정 + 1시간 녹음 추가!',price:220000,minutes:150,individual:270000,saving:50000,tuning:true,mixing:true,delivery:'영업일 7일 이내 전달'},
  // DUET bundles 2인 + 2시간 30분 녹음 + 보정 + 기본 믹싱 + 마스터링, list price 300,000 (정밀 믹싱 +20,000 added to list prices 2026-10-27 04:52)
  D:{key:'D',name:'DUET',title:'둘이 함께 부르는 듀엣 녹음!',price:240000,minutes:150,individual:300000,saving:60000,tuning:true,mixing:true,duet:true,delivery:'영업일 7일 이내 전달'}
 }
 const options=[
  {key:'tuning',label:'보컬 튜닝',price:40000,detail:'음정과 박자를 자연스럽게 다듬어 드려요 · 영업일 7일 이내 전달'},
  {key:'detailMix',label:'마스터링',price:20000,detail:'목소리의 음색과 톤을 MR에 맞게 세밀하게 다듬어 드려요'},
  {key:'precisionMix',label:'정밀 믹싱',price:20000,detail:'기본 믹싱보다 목소리와 MR의 밸런스를 세밀하게 맞춰 드려요'},
  {key:'extraHour',label:'녹음 50분 추가',price:50000,detail:'선택한 타입의 녹음 시간에 50분을 더해 드려요'},
  {key:'rush',label:'3일 이내 받기',price:30000,detail:'녹음일 기준 3일 이내에 음원을 받아요',messageLabel:'3일 이내 전달 (녹음일 기준)'},
 ]
 const hoursText=minutes=>minutes<60?minutes+'분':Math.floor(minutes/60)+'시간'+(minutes%60?' '+minutes%60+'분':'')
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const packageFor=key=>Object.hasOwn(packages,key)?packages[key]:packages.A
 // One holiday source for calendar colours, time badges and actual quotes
 // Checked 2026-10-23 against KASA 2027 almanac and KASI 2026–2028 data
 // https://www.kasa.go.kr/prog/plcyBrf/brief/kor/sub01_01_04/view.do?plcyBrfNo=431
 // https://astro.kasi.re.kr/kor/life/post/calendarData?year=2027
 // 2028 is KASI preliminary data; update when the official almanac is announced
 // Add newly announced temporary holidays here, never infer them from weekends
 const publicHolidays=new Set([
  '2026-01-01','2026-02-16','2026-02-17','2026-02-18','2026-03-01','2026-03-02',
  '2026-05-01','2026-05-05','2026-05-24','2026-05-25','2026-06-03','2026-06-06',
  '2026-07-17','2026-08-15','2026-08-17','2026-09-24','2026-09-25','2026-09-26',
  '2026-10-03','2026-10-05','2026-10-09','2026-12-25',
  '2027-01-01','2027-02-06','2027-02-07','2027-02-08','2027-02-09','2027-03-01',
  '2027-05-01','2027-05-03','2027-05-05','2027-05-13','2027-06-06','2027-07-17',
  '2027-07-19','2027-08-15','2027-08-16','2027-09-14','2027-09-15','2027-09-16',
  '2027-10-03','2027-10-04','2027-10-09','2027-10-11','2027-12-25','2027-12-27',
  '2028-01-01','2028-01-26','2028-01-27','2028-01-28','2028-03-01','2028-04-12',
  '2028-05-01','2028-05-02','2028-05-05','2028-06-06','2028-07-17','2028-08-15',
  '2028-10-02','2028-10-03','2028-10-04','2028-10-05','2028-10-09','2028-12-25'
 ])
 const fixedHolidays=new Set(['01-01','03-01','05-01','05-05','06-06','07-17','08-15','10-03','10-09','12-25'])
 // Visit-date coupon for DELUXE·PREMIUM·DUET, expires at 2027-01-01 00:00 KST
 const yearEndActive=(reference=today())=>validDate(reference)&&reference<'2027-01-01'
 const yearEndEligible=(date,reference=today())=>yearEndActive(reference)&&validDate(date)&&date>='2026-11-01'&&date<='2026-12-31'&&date>=reference
 const yearEndCopy={label:'연말 방문 할인 쿠폰',visit:'2026년 11·12월 방문 시 적용',products:'DELUXE · PREMIUM · DUET ONLY'}
 const discountOfferList=()=>[
  ...(yearEndActive()?[{key:'yearEnd',label:yearEndCopy.label,discount:20000,detail:yearEndCopy.visit+' · '+yearEndCopy.products}]:[]),
  {key:'first',label:'위스티아 첫 이용',discount:20000,detail:'처음 이용하신다면 문의 양식에서 첫 이용을 선택해 주세요'},
  {key:'weekday',label:'목·금 오후 1~4시 시작',discount:10000,detail:'공휴일 제외 · 녹음 시작 시간 기준으로 적용돼요'},
  {key:'advance1',label:'녹음일 1개월 이후',discount:10000,detail:'예약하는 날에서 1개월 이후의 녹음 일정에 적용돼요'},
  {key:'advance2',label:'녹음일 2개월 이후',discount:20000,detail:'사전 예약 할인은 1개월·2개월 중 해당하는 한 가지만 적용돼요'}
 ]
 function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value}
 function isPublicHoliday(date){return validDate(date)&&(publicHolidays.has(date)||Number(date.slice(0,4))>=2026&&fixedHolidays.has(date.slice(5)))}
 function addMonths(date,months){
  const [y,m,d]=date.split('-').map(Number),last=new Date(Date.UTC(y,m-1+months+1,0)).getUTCDate()
  return new Date(Date.UTC(y,m-1+months,Math.min(d,last))).toISOString().slice(0,10)
 }
 function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
 function advanceDiscount(date,reference=today()){
  if(!validDate(date)||!validDate(reference))return null
  if(date>=addMonths(reference,2))return {key:'advance2',label:'녹음일 2개월 이후 사전 예약',amount:20000}
  if(date>=addMonths(reference,1))return {key:'advance1',label:'녹음일 1개월 이후 사전 예약',amount:10000}
  return null
 }
 function weekdayDiscount(date,time){
  if(!validDate(date)||isPublicHoliday(date)||!/^\d{2}:\d{2}$/.test(time||''))return 0
  const day=new Date(date+'T12:00:00Z').getUTCDay(),[h,m]=time.split(':').map(Number)
  return [4,5].includes(day)&&h*60+m>=780&&h*60+m<=960?10000:0
 }
 function normalize(input={}){
  const selected=Array.isArray(input.options)?input.options:options.filter(o=>input[o.key]==='1'||input[o.key]===true).map(o=>o.key)
  return {...input,package:packageFor(input.package).key,people:packageFor(input.package).duet||input.people==='1'||input.people===2?'1':'0',options:[...new Set(selected.filter(key=>options.some(o=>o.key===key)))],firstVisit:input.firstVisit==='1'||input.firstVisit===true,yearEndCoupon:input.yearEndCoupon==='1'||input.yearEndCoupon===true}
 }
 function quote(input={},reference=today()){
  const v=normalize(input),p=packageFor(v.package),duet=v.people==='1'
  // 3일 이내 받기 only applies when the delivery would otherwise be 영업일 7일 이내 (A without tuning is already same-day)
  const slowDelivery=p.tuning||v.options.includes('tuning')
  const entries=options.filter(o=>v.options.includes(o.key)&&!(p.tuning&&o.key==='tuning')&&!(p.mixing&&(o.key==='detailMix'||o.key==='precisionMix'))&&!(o.key==='rush'&&!slowDelivery)&&!(p.duet&&o.key==='extraHour')).map(o=>({...o}))
  if(duet&&!p.duet)entries.unshift({key:'duet',label:'2인(듀엣곡)으로 변경',price:30000,detail:'인원 추가 · 2인·1곡'})
  const discounts=[]
  if(v.yearEndCoupon&&p.key!=='A'&&yearEndEligible(v.bookingDate,reference))discounts.push({key:'yearEnd',label:'연말 방문 할인 쿠폰',amount:20000})
  if(v.firstVisit)discounts.push({key:'first',label:'첫 이용',amount:20000})
  if(validDate(v.bookingDate)){
   if(weekdayDiscount(v.bookingDate,v.timeStart))discounts.push({key:'weekday',label:'목·금 13~16시 시작',amount:10000})
   const advance=advanceDiscount(v.bookingDate,reference);if(advance)discounts.push(advance)
  }
  const optionTotal=entries.reduce((sum,o)=>sum+o.price,0),discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  const baseMinutes=p.minutes+(v.options.includes('extraHour')&&!p.duet?50:0)
  const paybacks=[...(input.paybackBlog==='1'||input.paybackBlog===true?[{key:'blog',label:'네이버 블로그 리뷰',amount:30000}]:[]),...(input.paybackReaction==='1'||input.paybackReaction===true?[{key:'reaction',label:'본식 현장 영상 제공',amount:30000}]:[])]
  return {v,package:p,base:p.price,options:entries,optionTotal,discounts,discount,total:p.price+optionTotal-discount,baseMinutes,minutes:baseMinutes,promo:false,paybacks,payback:paybacks.reduce((sum,item)=>sum+item.amount,0),delivery:slowDelivery?(entries.some(o=>o.key==='rush')?'녹음일 기준 3일 이내 전달':packages.B.delivery):packages.A.delivery}
 }
 function features(p){
  const when=p.delivery.replace(/ ?음원 전달$| 전달$/,'')
  // Spec row order: 인원 / 녹음 시간 / 음정·박자 보정 / 믹싱 / 마스터링 / 디렉팅 / 전달
  const tuned=p.key!=='A'
  return [(p.duet?'2인·1곡':'1인·1곡'),'인원 : '+(p.duet?'2인':'1인'),'녹음 시간 : '+hoursText(p.minutes),'음정·박자 보정 : '+(tuned?'포함':'미포함'),'믹싱 : '+(tuned?'정밀 믹싱 포함':'기본 믹싱'),'마스터링 : '+(tuned?'포함':'미포함'),'디렉팅 : 1:1 맞춤 디렉팅','전달 : '+when]
 }
 const featurePaths={
  record:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11v2a6 6 0 0 0 12 0v-2M12 19v3M8 22h8"/>',
  mix:'<path d="M5 3v6m0 4v8M12 3v10m0 4v4M19 3v2m0 4v12"/><circle cx="5" cy="11" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="19" cy="7" r="2"/>',
  tune:'<path d="M4 15h5v-5h6V5h5M3 20h18m-5-5 2 2 4-4"/>',
  untuned:'<path d="M4 15h5v-5h6V5h5M3 3l18 18M3 21 21 3"/>',
  unmixed:'<path d="M5 3v6m0 4v8M12 3v10m0 4v4M19 3v2m0 4v12M3 3l18 18M3 21 21 3"/><circle cx="5" cy="11" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="19" cy="7" r="2"/>',
  file:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
  person:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M15.5 4.6a3.5 3.5 0 0 1 0 6.8M18 13.6a6.5 6.5 0 0 1 3.5 6.4"/>'
 }
 const shortTitles={A:'기본 녹음',B:'+ 보컬 보정',C:'+ 보컬 보정 + 녹음 1시간',D:'+ 보컬 보정 + 녹음 1시간 + 1인 추가'}
 // Best case uses the real quote rules: first Thursday or Friday at 13:00, two months ahead, not a public holiday
 function bestDate(reference=today()){let d=addMonths(reference,2);for(let i=0;i<14;i++){const day=new Date(d+'T12:00:00Z').getUTCDay();if((day===4||day===5)&&!isPublicHoliday(d))return d;d=new Date(Date.parse(d+'T12:00:00Z')+864e5).toISOString().slice(0,10)}return d}
 // Without a chosen date show the conditional Nov–Dec visit price, never an applied quote
 const couponDisplayDate=reference=>reference<'2026-11-01'?'2026-11-01':reference
 function cardCouponPrice(p,reference=today(),bookingDate=''){const q=quote({package:p.key,firstVisit:'1',yearEndCoupon:'1',bookingDate:bookingDate||couponDisplayDate(reference)},reference);return p.price-q.discounts.filter(d=>d.key==='first'||d.key==='yearEnd').reduce((sum,d)=>sum+d.amount,0)}
 function bestCouponPrice(p,reference=today()){
  const dates=[reference,addMonths(reference,1),addMonths(reference,2)]
  return Math.min(...dates.flatMap(start=>Array.from({length:14},(_,i)=>new Date(Date.parse(start+'T12:00:00Z')+i*864e5).toISOString().slice(0,10))).map(bookingDate=>quote({package:p.key,firstVisit:'1',yearEndCoupon:'1',bookingDate,timeStart:'13:00'},reference).total))
 }
 function priceLines(p,reference=today(),bookingDate=''){
  if(p.key==='A')return ''
  const eligible=yearEndEligible(bookingDate||couponDisplayDate(reference),reference),coupon=cardCouponPrice(p,reference,bookingDate),best=validDate(bookingDate)?quote({package:p.key,firstVisit:'1',yearEndCoupon:'1',bookingDate,timeStart:'13:00'},reference).total:bestCouponPrice(p,reference)
  const down=amount=>'<span class="price-down-pill">'+money(amount)+' DOWN</span>'
  const couponLabel=eligible?'연말 쿠폰 + 첫 이용 적용가':'첫 이용 쿠폰 적용가'
  return '<dl class="package-price-lines">'+
   '<div class="is-list"><div class="price-line-main"><dt>원가</dt><dd><s>'+money(p.individual)+'</s></dd></div></div>'+
   '<div class="is-pkg"><div class="price-line-main"><dt>패키지 할인가</dt><dd>'+money(p.price)+'</dd></div>'+down(p.individual-p.price)+'</div>'+
   '<div class="is-coupon"><div class="price-line-main"><dt>'+couponLabel+'</dt><dd>'+money(coupon)+'</dd></div>'+down(p.price-coupon)+'</div>'+
   '<div class="is-best"><div class="price-line-main"><dt>사전 예약·평일 할인까지 최대</dt><dd>'+money(best)+'</dd></div>'+down(coupon-best)+'</div>'+
   '</dl>'
 }
 function selectionDetails(key,bookingDate=''){
  const p=packageFor(key)
  const icon=item=>item.startsWith('인원')?(p.duet?'people':'person'):item.startsWith('전달')?'file':item.startsWith('음정')?(p.key==='A'?'untuned':'tune'):item==='마스터링 : 미포함'?'unmixed':item.includes('믹싱')||item.startsWith('마스터링')?'mix':'record'
  // One rule for every row: mark it when its value differs from the A card (same label, different value)
  const baseRows=features(packageFor('A')).slice(1)
  const featureRows=features(p).slice(1).map(item=>{
   const kind=icon(item),enhanced=p.key!=='A'&&!item.startsWith('전달')&&!baseRows.includes(item)
   return '<li data-feature-icon="'+kind+'"'+(enhanced?' data-feature-enhanced="true"':'')+'><span class="package-feature-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+featurePaths[kind]+'</svg></span><span class="package-feature-copy">'+item+'</span>'+(enhanced?'<b class="package-feature-up" aria-hidden="true">UP</b>':'')+'</li>'
  }).join('')
  return '<div class="package-selected-head"><span class="package-selected-letter">'+p.name.charAt(0)+'</span><h3>'+p.title+'</h3>'+(p.individual>p.price?'<span class="package-selected-cheaper">패키지로 예약하면 '+money(p.individual-p.price)+' 저렴해져요</span>':'')+'</div><p class="package-selected-meta">1곡 기준'+' · 녹음 '+hoursText(p.minutes)+'</p><ul class="package-selected-features">'+featureRows+'</ul>'+priceLines(p,today(),bookingDate)
 }
 function cards(selected='A',mode='detail'){
  const key=packageFor(selected).key
  return '<div class="package-picker"><div class="package-cards" role="group" aria-label="타입 선택">'+Object.values(packages).map(p=>'<label class="package-card'+(p.key===key?' is-selected':'')+'" data-tier="'+p.key+'"><input type="radio" name="'+(mode==='wizard'?'package':'detailPackage')+'" value="'+p.key+'" aria-label="'+p.name+' '+p.title+' '+money(cardCouponPrice(p))+'"'+(p.key===key?' checked':'')+'><span class="package-card-body"><span class="package-card-name">'+p.name+'</span>'+(p.individual>p.price?'<span class="package-card-was"><s>'+money(p.individual)+'</s></span>':'<span class="package-card-was is-empty" aria-hidden="true"></span>')+'<strong class="package-card-price" data-package-coupon-price="'+p.key+'">'+money(cardCouponPrice(p))+'</strong>'+'<span class="package-card-subtitle">'+shortTitles[p.key].split(/ (?=\+ )/).map(t=>'<span class="package-card-sub-item">'+t+'</span>').join(' ')+'</span></span></label>').join('')+'</div><section data-svg-title="off" class="package-selected-detail" data-package-selection-details data-package-key="'+key+'" aria-label="선택한 타입 상세 구성" aria-live="polite" aria-atomic="true">'+selectionDetails(key)+'</section></div>'
 }
 function syncSelection(root,key){
  const p=packageFor(key),panel=root.querySelector('[data-package-selection-details]'),bookingDate=root.querySelector('[name="bookingDate"]')?.value||''
  root.querySelectorAll('.package-card').forEach(card=>card.classList.toggle('is-selected',!!card.querySelector('input:checked')))
  if(panel&&(panel.dataset.packageKey!==p.key||panel.dataset.couponDate!==bookingDate)){panel.innerHTML=selectionDetails(p.key,bookingDate);panel.dataset.packageKey=p.key;panel.dataset.couponDate=bookingDate}
  refreshCardPrices(root,bookingDate)
 }
 const selectionRoots=new WeakSet()
 function mountSelection(root){
  if(!root||selectionRoots.has(root))return
  selectionRoots.add(root)
  root.addEventListener('click',event=>{
   const card=event.target.closest('.package-card'),input=card?.querySelector('input[type="radio"]')
   if(!input||!root.contains(card)||input.disabled||event.target===input||event.defaultPrevented)return
   // Native label forwarding scrolls its 1px radio into the viewport's centre
   // Preserve radio/keyboard semantics while preventing that pointer-focus jump
   event.preventDefault();input.focus({preventScroll:true})
   if(input.checked)return
   input.checked=true
   input.dispatchEvent(new global.Event('input',{bubbles:true}))
   input.dispatchEvent(new global.Event('change',{bubbles:true}))
  })
 }
 function discountsHtml(){return '<section data-svg-title="off" class="package-discount-guide"><h3>할인 내역</h3><ul>'+discountOfferList().map(item=>'<li>'+item.label+' <b>'+money(item.discount)+' 할인</b><small>'+item.detail+'</small></li>').join('')+'</ul></section>'}
 function firstVisitBanner(imageSrc='/assets/img/studio-3d/gift-benefits-yellow-v1.webp'){return '<div class="welcome-gift"><img src="'+imageSrc+'" alt="" width="64" height="64" loading="lazy" decoding="async"><div><small>처음 만나는 위스티아의 선물</small><strong>첫 이용 20,000원 할인</strong></div><span class="welcome-spark" aria-hidden="true">✦</span></div>'}
 function yearEndBookingBanner(imageSrc='/assets/editorial/welcome-gift-rose.webp'){if(!yearEndActive())return '';return '<div class="welcome-gift" data-year-end-gift><img src="'+imageSrc+'" alt="" width="64" height="64" loading="lazy" decoding="async"><div><small>'+yearEndCopy.label+'</small><strong>20,000원 할인</strong><em><span>'+yearEndCopy.visit+'</span><span class="year-end-products">'+yearEndCopy.products+'</span></em></div><span class="welcome-spark" aria-hidden="true">✦</span></div>'}
 function celebrate(root){
  root=root?.closest('.wf-welcome')||root
  if(!root||global.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return
  root.querySelector('.benefit-confetti')?.remove()
  const burst=global.document.createElement('span');burst.className='benefit-confetti';burst.setAttribute('aria-hidden','true')
  burst.innerHTML=Array.from({length:16},(_,i)=>'<i style="--i:'+i+';--dx:'+((i%2?1:-1)*(28+i*4))+'px;--turn:'+(i*43)+'deg"></i>').join('')
  root.append(burst);setTimeout(()=>burst.remove(),1600)
 }
 function refreshCardPrices(root,bookingDate=''){root.querySelectorAll('[data-package-coupon-price]').forEach(el=>{const pkg=packageFor(el.dataset.packageCouponPrice),amt=money(cardCouponPrice(pkg,today(),bookingDate));if(el.textContent!==amt)el.textContent=amt;const radio=el.closest('label.package-card')?.querySelector('input[type=radio]');if(radio)radio.setAttribute('aria-label',pkg.name+' '+pkg.title+' '+amt)})}
 const api={packages,options,money,packageFor,normalize,quote,features,cards,selectionDetails,syncSelection,mountSelection,discountsHtml,get discountOffers(){return discountOfferList()},isPublicHoliday,addMonths,today,advanceDiscount,weekdayDiscount,firstVisitBanner,yearEndBookingBanner,yearEndCopy,celebrate,hoursText,yearEndActive,yearEndEligible,priceLines,cardCouponPrice,bestDate,bestCouponPrice}
 // Refresh open pages at expiry, including after a suspended tab resumes
 function refreshYearEnd(){
  if(yearEndActive()||!global.document)return
  global.document.querySelectorAll('[data-package-selection-details]').forEach(panel=>{panel.innerHTML=selectionDetails(panel.dataset.packageKey)})
  global.document.querySelectorAll('.package-discount-guide').forEach(guide=>{guide.outerHTML=discountsHtml()})
  global.document.querySelectorAll('form').forEach(form=>{if(form.querySelector('[data-year-end-coupon]'))form.dispatchEvent(new global.Event('input',{bubbles:true}))})
  const nums=['첫 번째','두 번째','세 번째','네 번째','다섯 번째','여섯 번째']
  global.document.querySelectorAll('.events-discount-list .evd-card').forEach(card=>{if(card.textContent.includes('연말 방문 할인 쿠폰'))card.remove()})
  global.document.querySelectorAll('.events-discount-list .evd-no').forEach((el,i)=>{el.textContent=nums[i]||(i+1)+'번째'})
  global.document.querySelectorAll('.ed-benefit-items[data-benefit-type="discount"] li').forEach(li=>{if(li.textContent.includes('연말 방문 할인 쿠폰'))li.remove()})
  global.document.querySelectorAll('[data-year-end-gift]').forEach(el=>el.remove())
  refreshCardPrices(global.document)
 }
 if(global.document&&global.setTimeout&&yearEndActive()){
  const schedule=()=>{const left=Date.parse('2027-01-01T00:00:00+09:00')-Date.now();if(left<=0){refreshYearEnd();return}global.setTimeout(schedule,Math.min(left+50,2147483647))}
  schedule();global.document.addEventListener('visibilitychange',()=>{if(global.document.visibilityState==='visible')refreshYearEnd()})
 }
 if(typeof module==='object'&&module.exports)module.exports=api
 global.WistiaPackages=api
})(typeof window==='object'?window:globalThis)
