(function(global){
 'use strict'
 const packages={
  A:{key:'A',name:'STANDARD',title:'50분 녹음에 정밀 믹싱·마스터링이 필요하다면?',guide:'50분 녹음과 정밀 믹싱·마스터링이 필요하다면? 기본에 충실한 스탠다드를 추천드려요!',price:90000,minutes:50,individual:90000,saving:0,tuning:false,mixing:true,delivery:'녹음일 기준 7일 이내 전달'},
  B:{key:'B',name:'DELUXE',title:'녹음부터 정밀 믹싱·마스터링까지 한 번에 해결하고 싶다면?',guide:'1시간 30분의 여유로운 녹음부터 믹싱·마스터링까지! 완성도 높은 축가를 위한 올인원 패키지예요',price:170000,minutes:90,individual:210000,saving:40000,tuning:true,mixing:true,delivery:'녹음일 기준 7일 이내 전달'},
  C:{key:'C',name:'PREMIUM',title:'넉넉한 녹음 시간에 완성도 높은 패키지를 원한다면?',guide:'노래에 조금 자신이 없는 분들을 위한 패키지! 2시간 30분의 넉넉한 녹음 시간으로 한 소절씩 여유롭게 완성해 보세요!',price:220000,minutes:150,individual:270000,saving:50000,tuning:true,mixing:true,delivery:'녹음일 기준 7일 이내 전달'},
  // DUET bundles 2인 + 2시간 30분 녹음 + 보정 + 정밀 믹싱 + 마스터링, list price 300,000
  D:{key:'D',name:'DUET',title:'두 사람이 함께 특별한 축가를 완성하고 싶다면?',guide:'두 분이 함께 부르는 축가라면? 2시간 30분의 넉넉한 녹음 시간에 믹싱·마스터링까지 포함된 듀엣 전용 올인원 패키지예요!',price:240000,minutes:150,individual:300000,saving:60000,tuning:true,mixing:true,duet:true,delivery:'녹음일 기준 7일 이내 전달'}
 }
 const options=[
  {key:'tuning',label:'음정·박자 보정',price:40000,detail:'음정과 박자를 자연스럽게 다듬어 드려요'},
  {key:'detailMix',label:'마스터링',price:20000,detail:'음압과 톤을 정리해 최종 음원으로 마무리해요'},
  {key:'precisionMix',label:'정밀 믹싱',price:20000,detail:'목소리와 반주의 밸런스를 세밀하게 맞춰 드려요'},
  {key:'extraHour',label:'녹음 1시간 추가',price:60000,detail:'선택한 타입의 녹음 시간에 1시간을 더해 드려요'},
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
 // Keep legacy field/API names for saved drafts; stock and 24h receipt validity come from the server
 // The retired November–December recording restriction must not affect limited coupons
 const yearEndActive=(reference=today())=>validDate(reference)
 const yearEndEligible=(date,reference=today())=>yearEndActive(reference)&&(!date||validDate(date)&&date>=reference)
 const yearEndCopy={label:'선착순 한정 수량 쿠폰',visit:'수령 후 24시간 이내 사용',products:'DELUXE · PREMIUM · DUET ONLY'}
 const limitedClaimed=()=>global.WistiaLimitedCoupon?.isUsable?global.WistiaLimitedCoupon.isUsable():global.WistiaLimitedCoupon?.state.claimed===true
 const limitedAvailable=()=>yearEndActive()&&(!global.document||limitedClaimed()||global.WistiaLimitedCoupon?.state.ready&&global.WistiaLimitedCoupon.state.canClaim===true)
 const discountOfferList=()=>[
  {key:'first',label:'위스티아 첫 이용',discount:20000,detail:'DELUXE · PREMIUM · DUET ONLY · 홈 첫 화면에서 받을 수 있어요'},
  {key:'weekday',label:'목·금 오후 1~4시 시작',discount:10000,detail:'스탠다드 제외 · 공휴일 제외 · 녹음 시작 시간 기준으로 적용돼요'},
  {key:'advance1',label:'녹음일 1개월 이후',discount:10000,detail:'스탠다드 제외 · 예약하는 날에서 1개월 이후의 녹음 일정에 적용돼요'}
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
  if(date>=addMonths(reference,1))return {key:'advance1',label:'사전 예약 할인 (1개월 이후)',amount:10000}
  return null
 }
 function weekdayDiscount(date,time){
  if(!validDate(date)||isPublicHoliday(date)||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time||''))return 0
  const day=new Date(date+'T12:00:00Z').getUTCDay(),[h,m]=time.split(':').map(Number)
  return [4,5].includes(day)&&h*60+m>=780&&h*60+m<=960?10000:0
 }
 function normalize(input={}){
  const selected=Array.isArray(input.options)?input.options:options.filter(o=>input[o.key]==='1'||input[o.key]===true).map(o=>o.key)
  return {...input,package:packageFor(input.package).key,people:packageFor(input.package).duet||input.people==='1'||input.people===2?'1':'0',options:[...new Set(selected.filter(key=>options.some(o=>o.key===key)))],firstVisit:input.firstVisit==='1'||input.firstVisit===true,yearEndCoupon:input.yearEndCoupon==='1'||input.yearEndCoupon===true}
 }
 function quote(input={},reference=today(),preview=false){
  const v=normalize(input),p=packageFor(v.package),duet=v.people==='1'
  // STANDARD 90,000 includes 정밀 믹싱·마스터링 only. 음정·박자 보정 stays a paid option. Every discount is 0 on STANDARD; paid add-ons still add.
  const pitchIncluded=!!p.tuning
  const discountsAllowed=p.key!=='A'
  const entries=options.filter(o=>v.options.includes(o.key)&&!(pitchIncluded&&o.key==='tuning')&&!(p.mixing&&(o.key==='detailMix'||o.key==='precisionMix'))).map(o=>({...o}))
  if(duet&&!p.duet)entries.unshift({key:'duet',label:'녹음 1인 추가',price:30000,detail:'인원 추가 · 2인·1곡'})
  const discounts=[]
  if(discountsAllowed&&v.firstVisit)discounts.push({key:'first',label:'첫 이용 쿠폰',amount:20000})
  if(discountsAllowed&&validDate(v.bookingDate)){
   if(weekdayDiscount(v.bookingDate,v.timeStart))discounts.push({key:'weekday',label:'목·금 할인 (13~16시 시작)',amount:10000})
   const advance=advanceDiscount(v.bookingDate,reference);if(advance)discounts.push(advance)
  }
  const optionTotal=entries.reduce((sum,o)=>sum+o.price,0),discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  const baseMinutes=p.minutes+(v.options.includes('extraHour')?60:0)
  const paybacks=[...(input.paybackBlog==='1'||input.paybackBlog===true?[{key:'blog',label:'네이버 블로그 리뷰',amount:30000}]:[]),...(input.paybackReaction==='1'||input.paybackReaction===true?[{key:'reaction',label:'본식 현장 영상 제공',amount:30000}]:[])]
  const packageLine=p.individual>p.price?[{key:'package',label:'패키지 할인',amount:p.individual-p.price}]:[]
  return {v,package:p,base:p.price,list:p.individual,packageDiscount:p.individual-p.price,allDiscounts:[...packageLine,...discounts],options:entries,optionTotal,discounts,discount,total:p.price+optionTotal-discount,baseMinutes,minutes:baseMinutes,promo:false,paybacks,payback:paybacks.reduce((sum,item)=>sum+item.amount,0),delivery:entries.some(o=>o.key==='rush')?'녹음일 기준 3일 이내 전달':p.delivery}
 }
 function features(p){
  // 전달 is the same for every type, so the comparison table does not repeat it
  return [(p.duet?'2인·1곡':'1인·1곡'),'인원 : '+(p.duet?'2인':'1인'),'녹음 시간 : '+hoursText(p.minutes),'음정·박자 보정 : '+(p.tuning?'포함':'미포함'),'믹싱 : '+(p.mixing?'정밀 믹싱 포함':'미포함'),'마스터링 : '+(p.mixing?'포함':'미포함'),'디렉팅 : 1:1 맞춤 디렉팅','전달 : 녹음일 기준 7일 이내']
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
 const shortTitles={A:packages.A.guide,B:packages.B.guide,C:packages.C.guide,D:packages.D.guide}
 // Best case uses the real quote rules: first Thursday or Friday at 13:00, two months ahead, not a public holiday
 function bestDate(reference=today()){let d=addMonths(reference,2);for(let i=0;i<14;i++){const day=new Date(d+'T12:00:00Z').getUTCDay();if((day===4||day===5)&&!isPublicHoliday(d))return d;d=new Date(Date.parse(d+'T12:00:00Z')+864e5).toISOString().slice(0,10)}return d}
 // A received limited coupon applies before a recording date is chosen as well
 const couponDisplayDate=reference=>reference
 // Only coupons the visitor actually received on this site lower the shown price
 const claimedCoupons=()=>{const c=readCouponClaims();return {firstVisit:c.firstVisit===true,yearEndCoupon:c.yearEndCoupon===true}}
 function cardCouponPrice(p,reference=today(),bookingDate=''){const got=claimedCoupons(),q=quote({package:p.key,firstVisit:got.firstVisit?'1':'',yearEndCoupon:got.yearEndCoupon?'1':'',bookingDate:bookingDate||couponDisplayDate(reference)},reference,true);return p.price-q.discounts.filter(d=>d.key==='first'||d.key==='yearEnd').reduce((sum,d)=>sum+d.amount,0)}
 function bestCouponPrice(p,reference=today(),people=''){
  const dates=[reference,addMonths(reference,1),addMonths(reference,2)]
  return Math.min(...dates.flatMap(start=>Array.from({length:14},(_,i)=>new Date(Date.parse(start+'T12:00:00Z')+i*864e5).toISOString().slice(0,10))).map(bookingDate=>quote({package:p.key,people,firstVisit:claimedCoupons().firstVisit?'1':'',yearEndCoupon:claimedCoupons().yearEndCoupon?'1':'',bookingDate,timeStart:'13:00'},reference,true).total))
 }
 function priceLines(p,reference=today(),bookingDate='',people='',timeStart=''){
  // r72: STANDARD (no package saving) still shows its price box; it was empty since r68 hid the rest of the card
  const got=claimedCoupons(),date=bookingDate||couponDisplayDate(reference)
  const q=quote({package:p.key,people,firstVisit:got.firstVisit?'1':'',yearEndCoupon:got.yearEndCoupon?'1':'',bookingDate:date,timeStart},reference,true)
  const has=key=>q.discounts.some(d=>d.key===key),now=q.total,best=bestCouponPrice(p,reference,people)
  const down=amount=>'<span class="price-down-pill" aria-label="'+money(amount)+' 할인">'+money(amount)+' ↓</span>'
  const line=(cls,label,amount,value)=>'<div class="'+cls+'"><div class="price-line-main"><dt><span class="package-price-label">'+label+'</span>'+(amount?down(amount):'')+'</dt><dd>'+value+'</dd></div></div>'
  const rows=[line('is-list','원가',0,money(p.individual))];if(p.individual>p.price)rows.push(line('is-pkg','패키지 할인',0,'−'+money(p.individual-p.price)));const duetAdd=q.options.find(o=>o.key==='duet');if(duetAdd)rows.push(line('is-date','녹음 1인 추가',0,'+'+money(duetAdd.price)))
  if(has('first'))rows.push(line('is-coupon','첫 이용 쿠폰',0,'−'+money(20000)))
  q.discounts.filter(d=>d.key==='weekday'||d.key.startsWith('advance')).forEach(d=>rows.push(line('is-date',d.label,0,'−'+money(d.amount))))
  rows.push(line('is-now','현재 적용가',Math.max(0,p.individual-now),money(now)))
  if(best<now)rows.push(line('is-best','목·금·사전 예약 할인까지 최대',now-best,money(best)))
  return '<dl class="package-price-lines">'+rows.join('')+'</dl>'
 }
 function selectionDetails(key,bookingDate='',people='',timeStart=''){
  const p=packageFor(key)
  const icon=item=>item.startsWith('인원')?(p.duet?'people':'person'):item.startsWith('전달')?'file':item.startsWith('음정')?'tune':item==='마스터링 : 미포함'?'unmixed':item.includes('믹싱')||item.startsWith('마스터링')?'mix':'record'
  // One rule for every row: mark it when its value differs from the A card (same label, different value)
  const baseRows=features(packageFor('A')).slice(1)
  const featureRows=features(p).slice(1).map(item=>{
   const kind=icon(item),enhanced=p.key!=='A'&&!item.startsWith('전달')&&!baseRows.includes(item)
   return '<li data-feature-icon="'+kind+'"'+(enhanced?' data-feature-enhanced="true"':'')+'><span class="package-feature-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+featurePaths[kind]+'</svg></span><span class="package-feature-copy">'+item+'</span>'+(enhanced?'<b class="package-feature-up" aria-hidden="true">UP</b>':'')+'</li>'
  }).join('')
  return '<div class="package-selected-head"><span class="package-selected-letter">'+p.name.charAt(0)+'</span><h3>'+(p.guide||p.title)+'</h3>'+(p.individual>p.price?'<span class="package-selected-cheaper">개별 옵션 추가보다 패키지로 '+money(p.individual-p.price)+' 저렴하게!</span>':'')+'</div><p class="package-selected-meta">1곡 기준'+' · 녹음 '+hoursText(p.minutes)+'</p><ul class="package-selected-features">'+featureRows+'</ul>'+priceLines(p,today(),bookingDate,people,timeStart)
 }
 function cards(selected='A',mode='detail'){
  const key=packageFor(selected).key
  return '<div class="package-picker"><div class="package-cards" role="group" aria-label="타입 선택">'+Object.values(packages).map(p=>'<label class="package-card'+(p.key===key?' is-selected':'')+'" data-tier="'+p.key+'"><input type="radio" name="'+(mode==='wizard'?'package':'detailPackage')+'" value="'+p.key+'" aria-label="'+p.name+' '+p.title+' 원가 '+money(p.individual)+'"'+(p.key===key?' checked':'')+'><span class="package-card-body"><span class="package-card-name">'+p.name+'</span>'+(p.individual>p.price?'<span class="package-card-was"><s>'+money(p.individual)+'</s></span>':'<span class="package-card-was is-empty" aria-hidden="true"></span>')+'<strong class="package-card-price" data-package-coupon-price="'+p.key+'">'+money(cardCouponPrice(p))+'</strong>'+'<span class="package-card-subtitle">'+shortTitles[p.key].split(/ (?=\+ )/).map(t=>'<span class="package-card-sub-item">'+t+'</span>').join(' ')+'</span></span></label>').join('')+'</div><section data-svg-title="off" class="package-selected-detail" data-package-selection-details data-package-key="'+key+'" aria-label="선택한 타입 상세 구성" aria-live="polite" aria-atomic="true">'+selectionDetails(key)+'</section></div>'
 }
 function typeTable(root){const P=api,cards=root?.querySelector('.package-cards'),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));if(!cards)return;let wrap=root.querySelector('.wf-type-table');const keys=['A','B','C','D'],ck='<svg viewBox="0 0 24 24" class="wf-tt-ck" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',dash='<span class="wf-tt-dash" aria-label="미포함"></span>'
  if(!wrap){const feat=k=>{const f=P.features(P.packageFor(k)).slice(1),v=l=>(f.find(x=>x.startsWith(l))||'').split(' : ')[1]||'';return{people:v('인원'),time:v('녹음 시간'),tune:v('음정')==='포함',mix:v('믹싱').includes('정밀'),master:v('마스터링')==='포함',deliver:v('전달')}}
   const price=k=>{const c=cards.querySelector('.package-card[data-tier="'+k+'"]'),was=c?.querySelector('.package-card-was s')?.textContent||'',now=c?.querySelector('.package-card-price')?.textContent||'';return '<span class="wf-tt-price">'+(was?'<s>'+esc(was)+'</s>':'')+'<strong>'+esc(now)+'</strong></span>'}
   const rows=[['인원',k=>esc(feat(k).people)],['녹음 시간',k=>esc(feat(k).time)],['디렉팅',()=>ck],['음정·박자 보정',k=>feat(k).tune?ck:dash],['정밀 믹싱',k=>feat(k).mix?ck:dash],['마스터링',k=>feat(k).master?ck:dash]]
   cards.insertAdjacentHTML('afterend','<div class="wf-type-table"><table><thead><tr><th scope="col" class="wf-tt-corner">타입</th>'+keys.map(k=>'<th scope="col" data-tt="'+k+'" role="button" tabindex="0" aria-pressed="false"><i class="wf-tt-radio">'+ck+'</i><b>'+esc(P.packageFor(k).name)+'</b>'+price(k)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(([l,f])=>'<tr><th scope="row">'+l+'</th>'+keys.map(k=>{const v=f(k),lv=/<(svg|span)/.test(v)||l==='전달'?0:[...new Set(keys.map(f))].indexOf(v);return '<td data-tt="'+k+'"'+(lv>0?' class="wf-tt-up'+(l==='인원'?2:Math.min(lv,2))+'"':'')+'>'+v+'</td>'}).join('')+'</tr>').join('')+'</tbody></table><p class="wf-tt-when" aria-live="polite"></p></div>')
   wrap=root.querySelector('.wf-type-table')
   const pick=e=>{const c=e.target.closest('[data-tt]');if(!c||(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();const y=global.scrollY,input=cards.querySelector('.package-card[data-tier="'+c.dataset.tt+'"] input');if(!input||input.checked)return;input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));global.requestAnimationFrame(()=>global.scrollTo(0,y))}
   wrap.addEventListener('click',pick);wrap.addEventListener('keydown',pick);root.addEventListener('change',()=>typeTable(root))}
  const s=cards.querySelector('input[type="radio"]:checked')?.value||'';keys.forEach(k=>{const c=cards.querySelector('.package-card[data-tier="'+k+'"] .package-card-price'),t=wrap.querySelector('thead [data-tt="'+k+'"] .wf-tt-price strong');if(c&&t&&t.textContent!==c.textContent)t.textContent=c.textContent});wrap.querySelectorAll('[data-tt]').forEach(e=>{const on=e.dataset.tt===s;e.classList.toggle('is-on',on);if(e.tagName==='TH')e.setAttribute('aria-pressed',String(on))})
  const when=wrap.querySelector('.wf-tt-when'),picked=s?P.packageFor(s):null,save=picked&&picked.individual>picked.price?'<span class="wf-tt-save">개별 옵션 추가보다 패키지로 '+esc(P.money(picked.individual-picked.price))+' 저렴하게!</span>':'',html=picked?'<i>'+esc(picked.name)+'</i>'+save:'<i>이럴 때</i>타입을 골라 주세요';if(s)when.dataset.tt=s;else delete when.dataset.tt;if(when.innerHTML!==html)when.innerHTML=html}
 function syncSelection(root,key){
  const p=packageFor(key),panel=root.querySelector('[data-package-selection-details]'),bookingDate=root.querySelector('[name="bookingDate"]')?.value||'',people=root.querySelector('input[name="people"]:checked')?.value||'',timeStart=root.querySelector('[name="timeStart"]')?.value||''
  root.querySelectorAll('.package-card').forEach(card=>card.classList.toggle('is-selected',!!card.querySelector('input:checked')))
  if(panel&&(panel.dataset.packageKey!==p.key||panel.dataset.couponDate!==bookingDate||(panel.dataset.people||'')!==people||(panel.dataset.timeStart||'')!==timeStart)){panel.innerHTML=selectionDetails(p.key,bookingDate,people,timeStart);panel.dataset.packageKey=p.key;panel.dataset.couponDate=bookingDate;panel.dataset.people=people;panel.dataset.timeStart=timeStart}
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
 function firstVisitBanner(imageSrc='/assets/img/studio-3d/gift-benefits-yellow-v1.webp'){return '<div class="welcome-gift"><img src="'+imageSrc+'" alt="" width="64" height="64" loading="lazy" decoding="async"><div><small>처음 만나는 위스티아의 선물</small><strong>첫 이용 20,000원 할인</strong><em><span class="year-end-products">'+yearEndCopy.products+'</span></em></div><span class="welcome-spark" aria-hidden="true">✦</span></div>'}
 const yearEndImage='/assets/editorial/year-end-ticket-rose-v1.webp'
 function yearEndBookingBanner(){if(!yearEndActive())return '';return '<div class="welcome-gift year-end-ticket" data-year-end-gift><img src="'+yearEndImage+'" alt="" width="64" height="64" loading="lazy" decoding="async"><div><small>'+yearEndCopy.label+'</small><strong>20,000원 할인</strong><em><span class="year-end-products">'+yearEndCopy.products+'</span></em></div></div>'}
 const couponStorageKey='wistia:coupon-claims:v1',couponLifetime=24*60*60*1000,couponKeys=['firstVisit','yearEndCoupon']
 let memoryClaims=null
 function couponRecord(){
  let data=memoryClaims
  try{const raw=global.localStorage?.getItem(couponStorageKey);if(raw)data=JSON.parse(raw)}catch{}
  return data
 }
 function couponRecordCurrent(data=couponRecord()){return !data||data.version!==1||!Number.isFinite(data.savedAt)||Date.now()-data.savedAt<0||Date.now()-data.savedAt>=couponLifetime?null:data}
 function readCouponClaims(){
  const data=couponRecord()
  const current=couponRecordCurrent(data)
  const result=current?Object.fromEntries(couponKeys.filter(key=>typeof current.selections?.[key]==='boolean').map(key=>[key,current.selections[key]])):{}
  // An expired first-use claim reads as not received so its 20,000 drops out everywhere
  if(data&&data.version===1&&Number.isFinite(data.savedAt)&&Date.now()-data.savedAt>=couponLifetime&&data.selections?.firstVisit===true)result.firstVisit=false
  if(global.document)result.yearEndCoupon=yearEndActive()&&limitedClaimed()
  return result
 }
 function writeCouponClaims(selections){const dismissed=couponRecordCurrent()?.dismissed===true;memoryClaims={version:1,savedAt:Date.now(),selections:Object.fromEntries(couponKeys.filter(key=>typeof selections[key]==='boolean').map(key=>[key,selections[key]])),...(dismissed?{dismissed:true}:{})};try{global.localStorage?.setItem(couponStorageKey,JSON.stringify(memoryClaims))}catch{}}
 function firstVisitPromptClosed(){return readCouponClaims().firstVisit===true||couponRecordCurrent()?.dismissed===true}
 function dismissFirstVisitPrompt(){const current=couponRecordCurrent();const selections=current?Object.fromEntries(couponKeys.filter(key=>typeof current.selections?.[key]==='boolean').map(key=>[key,current.selections[key]])):{};memoryClaims={version:1,savedAt:Date.now(),selections,dismissed:true};try{global.localStorage?.setItem(couponStorageKey,JSON.stringify(memoryClaims))}catch{}}
 function couponClaimCard(key,mode='form',imageSrc){
  if(key==='yearEndCoupon'||!couponKeys.includes(key))return ''
  const year=key==='yearEndCoupon',title=year?yearEndCopy.label:'첫 이용 쿠폰',banner=year?yearEndBookingBanner():firstVisitBanner(imageSrc)
  return '<div class="coupon-claim-card" data-coupon-card="'+key+'"'+(year?' data-year-end-coupon':'')+'>'+banner+'<div class="coupon-claim-action"><span class="coupon-claim-hint">여기를 눌러주세요 →</span><button type="button" class="coupon-claim-button" data-coupon-claim="'+key+'" aria-label="'+title+'" aria-pressed="false"><span data-coupon-button-copy>쿠폰 받기</span><b data-coupon-check aria-hidden="true" hidden>✓</b></button>'+(mode==='form'?'<input type="checkbox" name="'+key+'" value="1" hidden aria-hidden="true">':'')+'</div>'+(year?'<div class="limited-coupon-timer" data-coupon-timer hidden role="group" aria-label="쿠폰 사용 남은 시간" aria-live="off"><span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg><span data-coupon-timer-label>쿠폰 사용 남은 시간</span></span><strong data-coupon-timer-value>24:00:00</strong></div>':'')+'</div>'
 }
 function syncCouponControls(root=global.document){
  const claims=readCouponClaims()
  root?.querySelectorAll('[data-coupon-claim]').forEach(button=>{
   const key=button.dataset.couponClaim,form=button.closest('form'),input=form?.querySelector('[name="'+key+'"]'),selected=input?input.checked:claims[key]===true,card=button.closest('[data-coupon-card]'),standard=!!form&&packageFor(form.querySelector('[name="package"]:checked')?.value).key==='A',date=form?.querySelector('[name="bookingDate"]')?.value||''
   button.disabled=standard||!!input?.disabled;button.setAttribute('aria-pressed',String(selected&&!button.disabled));button.querySelector('[data-coupon-button-copy]').textContent=button.disabled?'대상 상품 전용':selected?'받기 완료':'쿠폰 받기';button.querySelector('[data-coupon-check]').hidden=!selected||button.disabled
   card.classList.toggle('is-received',selected&&!button.disabled);card.classList.toggle('is-disabled',button.disabled)
   card.querySelector('.coupon-claim-hint').textContent=button.disabled?'스탠다드 적용 제외':selected&&key==='yearEndCoupon'&&date&&!yearEndEligible(date)?'선택한 날짜는 적용 제외':selected?'쿠폰을 받았어요':'여기를 눌러주세요 →'
   if(key==='yearEndCoupon'){
    const state=global.WistiaLimitedCoupon?.state||{},owned=limitedClaimed(),received=state.received===true,locked=received&&(state.inCooldown||!state.canClaim&&!state.closed),expired=locked&&!owned,closed=state.ready&&state.closed&&!locked
    button.disabled=standard||locked||closed||state.busy||!state.ready&&!state.error
    button.setAttribute('aria-pressed',String(locked));button.setAttribute('aria-busy',String(!!state.busy))
    button.querySelector('[data-coupon-button-copy]').textContent=locked?'받기 완료':standard?'대상 상품 전용':closed?'발급 마감':state.busy?'확인 중':state.error?'다시 확인':'쿠폰 받기'
    button.querySelector('[data-coupon-check]').hidden=!locked
    card.classList.toggle('is-received',locked);card.classList.toggle('is-expired',expired);card.classList.toggle('is-disabled',!locked&&button.disabled)
    const stock=state.ready?state.remaining+'장 남음':state.error?'수량 확인 필요':'잔여 수량 확인 중'
    const note=locked?'쿠폰을 받았어요':closed?'쿠폰이 마감되었어요':state.error?'잠시 후 다시 눌러주세요':standard?'스탠다드 적용 제외':''
    card.querySelector('.coupon-claim-hint').innerHTML='<span data-limited-stock role="status">'+stock+'</span>'+(note?'<span class="limited-coupon-note">'+note+'</span>':'')
    // Stock ran out (remaining 0 or campaign closed): remove the coupon card unless this browser still holds an unexpired one
    const soldOut=state.ready&&(state.closed||state.remaining<=0)&&!owned;if(soldOut)card.style.setProperty('display','none','important');else card.style.removeProperty('display');card.toggleAttribute('data-sold-out',soldOut)
    const timer=card.querySelector('[data-coupon-timer]');timer.hidden=!locked;timer.querySelector('[data-coupon-timer-label]').textContent=expired?'쿠폰이 만료되었어요':'쿠폰 사용 남은 시간'
   }
  })
  global.WistiaLimitedCoupon?.paintTimers()
 }
 function syncCouponClaims(root=global.document,notify=true,system=false){
  const claims=readCouponClaims()
  root?.querySelectorAll('form').forEach(form=>couponKeys.forEach(key=>{
   const input=form.querySelector('[name="'+key+'"]');if(!input||!Object.hasOwn(claims,key))return
   const allowed=packageFor(form.querySelector('[name="package"]:checked')?.value).key!=='A'&&(key!=='yearEndCoupon'||yearEndActive()),checked=allowed&&claims[key]
   if(input.checked===checked)return;input.checked=checked
   if(notify){for(const type of ['input','change']){const event=new global.Event(type,{bubbles:true});event.wistiaCouponSync=system;input.dispatchEvent(event)}}
  }));syncCouponControls(root)
 }
 function setCouponClaim(key,selected){if(!couponKeys.includes(key))return;if(key==='yearEndCoupon')return;writeCouponClaims({...readCouponClaims(),[key]:!!selected});syncCouponClaims(global.document);refreshPricePanels()}
 function refreshPricePanels(){if(!global.document)return;global.document.querySelectorAll('[data-package-selection-details]').forEach(panel=>{panel.innerHTML=selectionDetails(panel.dataset.packageKey,panel.dataset.couponDate||'')});refreshCardPrices(global.document)}
 function restoreCouponClaims(form){
  const claims=readCouponClaims();let seeded=false
  couponKeys.forEach(key=>{const input=form.querySelector('[name="'+key+'"]');if(!input)return;const allowed=packageFor(form.querySelector('[name="package"]:checked')?.value).key!=='A'&&(key!=='yearEndCoupon'||yearEndActive());if(Object.hasOwn(claims,key)){input.checked=claims[key]&&allowed}else{claims[key]=input.checked;input.checked=input.checked&&allowed;seeded=true}})
  if(seeded)writeCouponClaims(claims);syncCouponControls(form)
 }
 function celebrateCoupon(card,button){
  if(!card||!global.document)return
  card.querySelector('.coupon-particle-layer')?.remove()
  const layer=global.document.createElement('span');layer.className='coupon-particle-layer';layer.setAttribute('aria-hidden','true')
  const reduced=global.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  layer.classList.toggle('is-still',!!reduced)
  const width=card.clientWidth,height=card.clientHeight
  // Spread three bursts across the card, rather than shrinking stars beside the button
  for(let i=0;i<(reduced?8:48);i++){
   const bit=global.document.createElement('i'),group=Math.floor(i/16),angle=(-170+(i%16)*10)*Math.PI/180,distance=48+(i%5)*14
   bit.className=i%3?'coupon-particle-star':'coupon-particle-bit';bit.textContent=i%3===1?'✦':i%3===2?'✧':''
   const x=reduced?(i%4+.5)*width/4:width*(.16+group*.34),y=reduced?(i<4?18:height-22):height*.72
   bit.style.cssText='left:'+x+'px;top:'+y+'px;--coupon-size:'+(18+i%4*3)+'px;--coupon-dx:'+Math.cos(angle)*distance+'px;--coupon-dy:'+(Math.sin(angle)*distance-16)+'px;--coupon-delay:'+(group%2*160)+'ms;--coupon-turn:'+(i*31)+'deg';layer.append(bit)
  }
  card.append(layer);global.setTimeout(()=>layer.remove(),1800)
 }
 const couponRoots=new WeakSet()
 function mountCouponClaims(root){
  if(!root)return
  if(root.querySelector('[data-coupon-card="yearEndCoupon"]'))global.WistiaLimitedCoupon?.start()
  syncCouponClaims(root)
  if(couponRoots.has(root))return;couponRoots.add(root)
  root.addEventListener('click',async event=>{const button=event.target.closest('[data-coupon-claim]');if(!button||!root.contains(button)||button.disabled)return;const key=button.dataset.couponClaim;const trusted=event.isTrusted,track=type=>{if(!trusted)return;try{global.wistiaAnalytics?.trackCouponClaim?.(type)}catch{}try{global.wistiaMeta?.trackCouponClaim?.(type)}catch{}};if(key==='yearEndCoupon'){const inventory=global.WistiaLimitedCoupon;if(inventory.state.error){await inventory.refresh();return}const state=await inventory.refresh(true);if(state.newlyClaimed)track('limited');if(state.newlyClaimed)celebrateCoupon(button.closest('[data-coupon-card]'),button);return}const input=button.closest('form')?.querySelector('[name="'+key+'"]'),selected=!(input?input.checked:readCouponClaims()[key]===true);setCouponClaim(key,selected);if(selected)track('first_visit');if(selected)celebrateCoupon(button.closest('[data-coupon-card]'),button)})
 }
 if(global.addEventListener)global.addEventListener('wistia:limited-coupon',()=>{
  syncCouponClaims(global.document,true,true)
  global.document.querySelectorAll('[data-package-selection-details]').forEach(panel=>{panel.innerHTML=selectionDetails(panel.dataset.packageKey,panel.dataset.couponDate||'')})
  refreshCardPrices(global.document)
 })
 // Re-check once a minute so a coupon that expires while the page is open stops lowering prices
 let lastClaimKey=null
 if(global.document&&global.setInterval)global.setInterval(()=>{const c=readCouponClaims(),key=String(c.firstVisit===true)+String(c.yearEndCoupon===true);if(lastClaimKey!==null&&key!==lastClaimKey){syncCouponClaims(global.document);refreshPricePanels()}lastClaimKey=key},60000)
 if(global.addEventListener)global.addEventListener('storage',event=>{if(event.key===couponStorageKey){memoryClaims=null;syncCouponClaims(global.document)}})
 let bannerObserver=null
 function mountYearEndBanners(root=global.document){
  bannerObserver?.disconnect()
  const pairs=[...root.querySelectorAll('[data-year-end-gift]')].map(ticket=>({ticket,reference:(ticket.closest('.wf-welcome,.ed-benefit-lists')||ticket.parentElement).querySelector('.welcome-gift:not([data-year-end-gift])')})).filter(pair=>pair.reference)
  const sync=()=>pairs.forEach(({ticket,reference})=>{if(ticket.isConnected&&reference.isConnected)ticket.style.setProperty('--year-end-height',global.getComputedStyle(reference).height)})
  sync()
  if(global.ResizeObserver&&pairs.length){bannerObserver=new global.ResizeObserver(sync);pairs.forEach(({reference})=>bannerObserver.observe(reference))}
 }
 function celebrate(root){
  root=root?.closest('.wf-welcome')||root
  if(!root||global.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return
  root.querySelector('.benefit-confetti')?.remove()
  const burst=global.document.createElement('span');burst.className='benefit-confetti';burst.setAttribute('aria-hidden','true')
  burst.innerHTML=Array.from({length:16},(_,i)=>'<i style="--i:'+i+';--dx:'+((i%2?1:-1)*(28+i*4))+'px;--turn:'+(i*43)+'deg"></i>').join('')
  root.append(burst);setTimeout(()=>burst.remove(),1600)
 }
 function refreshCardPrices(root,bookingDate=''){root.querySelectorAll('[data-package-coupon-price]').forEach(el=>{const pkg=packageFor(el.dataset.packageCouponPrice),amt=money(cardCouponPrice(pkg,today(),bookingDate));if(el.textContent!==amt)el.textContent=amt;const radio=el.closest('label.package-card')?.querySelector('input[type=radio]');if(radio)radio.setAttribute('aria-label',pkg.name+' '+pkg.title+' 원가 '+money(pkg.individual))})}
 const api={packages,options,money,packageFor,normalize,quote,features,cards,typeTable,selectionDetails,syncSelection,mountSelection,discountsHtml,get discountOffers(){return discountOfferList()},isPublicHoliday,addMonths,today,advanceDiscount,weekdayDiscount,firstVisitBanner,yearEndBookingBanner,yearEndImage,mountYearEndBanners,yearEndCopy,celebrate,hoursText,yearEndActive,yearEndEligible,priceLines,cardCouponPrice,bestDate,bestCouponPrice,couponClaimCard,readCouponClaims,setCouponClaim,restoreCouponClaims,mountCouponClaims,syncCouponControls,celebrateCoupon,firstVisitPromptClosed,dismissFirstVisitPrompt}
 // WistiaLimitedCoupon refreshes server inventory and expires received coupons after 24h
 if(typeof module==='object'&&module.exports)module.exports=api
 global.WistiaPackages=api
})(typeof window==='object'?window:globalThis)
