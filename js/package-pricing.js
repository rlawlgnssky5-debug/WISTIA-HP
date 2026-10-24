(function(global){
 'use strict'
 const packages={
  A:{key:'A',title:'음정·박자 보정은 필요 없어요!',price:90000,minutes:60,individual:90000,saving:0,tuning:false,mixing:false,delivery:'당일 음원 전달'},
  B:{key:'B',title:'음정·박자 보정이 필요해요!',price:130000,minutes:60,individual:150000,saving:20000,tuning:true,mixing:true,delivery:'영업일 7일 이내 전달'},
  C:{key:'C',title:'음정·박자 보정과 여유로운 녹음 시간이 필요해요!',price:170000,minutes:120,individual:200000,saving:30000,tuning:true,mixing:true,delivery:'영업일 7일 이내 전달'}
 }
 const options=[
  {key:'tuning',label:'보컬 튜닝',price:40000,detail:'음정과 박자를 자연스럽게 다듬어 드려요 · 영업일 7일 이내 전달'},
  {key:'detailMix',label:'디테일 믹싱',price:20000,detail:'목소리의 음색과 톤을 MR에 맞게 세밀하게 다듬어 드려요'},
  {key:'extraHour',label:'녹음 1시간 추가',price:50000,detail:'선택한 타입의 녹음 시간에 1시간을 더해 드려요'},
  {key:'rush',label:'3일 이내 받기',price:30000,detail:'녹음일 기준 3일 이내에 음원을 받아요',messageLabel:'3일 이내 전달 (녹음일 기준)'},
 ]
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
 const discountOffers=[
  {key:'first',label:'위스티아 첫 이용',discount:10000,detail:'처음 이용하신다면 문의 양식에서 첫 이용을 선택해 주세요'},
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
  return {...input,package:packageFor(input.package).key,people:input.people==='1'||input.people===2?'1':'0',options:[...new Set(selected.filter(key=>options.some(o=>o.key===key)))],firstVisit:input.firstVisit==='1'||input.firstVisit===true}
 }
 function quote(input={},reference=today()){
  const v=normalize(input),p=packageFor(v.package),duet=v.people==='1'
  // 3일 이내 받기 only applies when the delivery would otherwise be 영업일 7일 이내 (A without tuning is already same-day)
  const slowDelivery=p.tuning||v.options.includes('tuning')
  const entries=options.filter(o=>v.options.includes(o.key)&&!(p.tuning&&o.key==='tuning')&&!(p.mixing&&o.key==='detailMix')&&!(o.key==='rush'&&!slowDelivery)).map(o=>({...o}))
  if(duet)entries.unshift({key:'duet',label:'2인(듀엣곡)으로 변경',price:30000,detail:'인원 추가 · 2인·1곡'})
  const discounts=[]
  if(v.firstVisit)discounts.push({key:'first',label:'첫 이용',amount:10000})
  if(validDate(v.bookingDate)){
   if(weekdayDiscount(v.bookingDate,v.timeStart))discounts.push({key:'weekday',label:'목·금 13~16시 시작',amount:10000})
   const advance=advanceDiscount(v.bookingDate,reference);if(advance)discounts.push(advance)
  }
  const optionTotal=entries.reduce((sum,o)=>sum+o.price,0),discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  const baseMinutes=p.minutes+(v.options.includes('extraHour')?60:0)
  const paybacks=[...(input.paybackBlog==='1'||input.paybackBlog===true?[{key:'blog',label:'네이버 블로그 리뷰',amount:30000}]:[]),...(input.paybackReaction==='1'||input.paybackReaction===true?[{key:'reaction',label:'본식 현장 영상 제공',amount:30000}]:[])]
  return {v,package:p,base:p.price,options:entries,optionTotal,discounts,discount,total:p.price+optionTotal-discount,baseMinutes,minutes:baseMinutes,promo:false,paybacks,payback:paybacks.reduce((sum,item)=>sum+item.amount,0),delivery:slowDelivery?(entries.some(o=>o.key==='rush')?'녹음일 기준 3일 이내 전달':packages.B.delivery):packages.A.delivery}
 }
 function features(p){
  const when=p.delivery.replace(/ ?음원 전달$| 전달$/,'')
  if(p.key==='A')return ['1인·1곡','녹음 시간 : '+(p.minutes/60)+'시간','디렉팅 : 1:1','믹싱 : 기본 믹싱(목소리와 MR 밸런스·울림)','음정·박자 보정 : 미포함','전달 : '+when]
  return ['1인·1곡','녹음 시간 : '+(p.minutes/60)+'시간','디렉팅 : 1:1','믹싱 : 디테일 믹싱','음정·박자 보정 : 포함','전달 : '+when]
 }
 const featurePaths={
  record:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11v2a6 6 0 0 0 12 0v-2M12 19v3M8 22h8"/>',
  mix:'<path d="M5 3v6m0 4v8M12 3v10m0 4v4M19 3v2m0 4v12"/><circle cx="5" cy="11" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="19" cy="7" r="2"/>',
  tune:'<path d="M4 15h5v-5h6V5h5M3 20h18m-5-5 2 2 4-4"/>',
  untuned:'<path d="M4 15h5v-5h6V5h5M3 3l18 18M3 21 21 3"/>',
  file:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>'
 }
 const shortTitles={A:'기본 녹음',B:'보컬 보정',C:'여유로운 녹음'}
 function selectionDetails(key){
  const p=packageFor(key)
  const icon=item=>item.startsWith('전달')?'file':item.startsWith('음정')?(p.key==='A'?'untuned':'tune'):item.includes('믹싱')?'mix':'record'
  // One rule for every row: mark it when its value differs from the A card (same label, different value)
  const baseRows=features(packageFor('A')).slice(1)
  const featureRows=features(p).slice(1).map(item=>{
   const kind=icon(item),enhanced=p.key!=='A'&&!item.startsWith('전달')&&!baseRows.includes(item)
   return '<li data-feature-icon="'+kind+'"'+(enhanced?' data-feature-enhanced="true"':'')+'><span class="package-feature-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+featurePaths[kind]+'</svg></span><span class="package-feature-copy">'+item+'</span>'+(enhanced?'<b class="package-feature-up" aria-hidden="true">UP</b>':'')+'</li>'
  }).join('')
  return '<div class="package-selected-head"><span class="package-selected-letter">'+p.key+'</span><h3>'+p.title+'</h3></div><p class="package-selected-meta">1인·1곡 기준 · 녹음 '+p.minutes/60+'시간</p><ul class="package-selected-features">'+featureRows+'</ul>'+(p.saving?'<p class="package-selected-saving"><b>'+money(p.saving)+' 절약</b></p>':'')
 }
 function cards(selected='A',mode='detail'){
  const key=packageFor(selected).key
  return '<div class="package-picker"><div class="package-cards" role="group" aria-label="타입 선택">'+Object.values(packages).map(p=>'<label class="package-card'+(p.key===key?' is-selected':'')+'"><input type="radio" name="'+(mode==='wizard'?'package':'detailPackage')+'" value="'+p.key+'" aria-label="'+p.key+' 타입 '+p.title+' '+money(p.price)+'"'+(p.key===key?' checked':'')+'><span class="package-card-body"><span class="package-card-name">'+p.key+' 타입</span>'+(p.individual>p.price?'<span class="package-card-was"><small>따로 고르면</small> <s>'+money(p.individual)+'</s></span>':'')+'<strong class="package-card-price">'+money(p.price)+'</strong><span class="package-card-subtitle">'+shortTitles[p.key]+'</span></span></label>').join('')+'</div><section data-svg-title="off" class="package-selected-detail" data-package-selection-details data-package-key="'+key+'" aria-label="선택한 타입 상세 구성" aria-live="polite" aria-atomic="true">'+selectionDetails(key)+'</section></div>'
 }
 function syncSelection(root,key){
  const p=packageFor(key),panel=root.querySelector('[data-package-selection-details]')
  root.querySelectorAll('.package-card').forEach(card=>card.classList.toggle('is-selected',!!card.querySelector('input:checked')))
  if(panel&&panel.dataset.packageKey!==p.key){panel.innerHTML=selectionDetails(p.key);panel.dataset.packageKey=p.key}
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
 function discountsHtml(){return '<section data-svg-title="off" class="package-discount-guide"><h3>할인 내역</h3><ul>'+discountOffers.map(item=>'<li>'+item.label+' <b>'+money(item.discount)+' 할인</b><small>'+item.detail+'</small></li>').join('')+'</ul></section>'}
 function firstVisitBanner(imageSrc='/assets/img/studio-3d/gift-benefits-yellow-v1.webp'){return '<div class="welcome-gift"><img src="'+imageSrc+'" alt="" width="64" height="64"><div><small>처음 만나는 위스티아의 선물</small><strong>첫 이용 10,000원 할인</strong></div><span class="welcome-spark" aria-hidden="true">✦</span></div>'}
 function celebrate(root){
  root=root?.closest('.wf-welcome')||root
  if(!root||global.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return
  root.querySelector('.benefit-confetti')?.remove()
  const burst=global.document.createElement('span');burst.className='benefit-confetti';burst.setAttribute('aria-hidden','true')
  burst.innerHTML=Array.from({length:16},(_,i)=>'<i style="--i:'+i+';--dx:'+((i%2?1:-1)*(28+i*4))+'px;--turn:'+(i*43)+'deg"></i>').join('')
  root.append(burst);setTimeout(()=>burst.remove(),1600)
 }
 const api={packages,options,money,packageFor,normalize,quote,features,cards,selectionDetails,syncSelection,mountSelection,discountsHtml,discountOffers,isPublicHoliday,addMonths,today,advanceDiscount,weekdayDiscount,firstVisitBanner,celebrate}
 if(typeof module==='object'&&module.exports)module.exports=api
 global.WistiaPackages=api
})(typeof window==='object'?window:globalThis)
