(function(global){
 'use strict'
 const packages={
  A:{key:'A',title:'음정·박자 보정은 필요 없어요!',price:90000,minutes:60,individual:90000,saving:0,tuning:false,mixing:false,delivery:'당일 음원 전달'},
  B:{key:'B',title:'음정·박자 보정이 필요해요!',price:130000,minutes:60,individual:150000,saving:20000,tuning:true,mixing:true,delivery:'영업일 기준 7일 이내 음원 전달'},
  C:{key:'C',title:'음정·박자 보정과 여유로운 녹음 시간이 필요해요!',price:170000,minutes:120,individual:200000,saving:30000,tuning:true,mixing:true,delivery:'영업일 기준 7일 이내 음원 전달'}
 }
 const options=[
  {key:'tuning',label:'보컬 튜닝',price:40000,detail:'음정·박자 보정 · 선택 시 영업일 기준 7일 이내 전달'},
  {key:'detailMix',label:'디테일 믹싱',price:20000,detail:'목소리의 음색·톤 조절'},
  {key:'extraHour',label:'녹음 1시간 추가',price:50000,detail:'선택한 패키지의 녹음 시간에 1시간 추가'},
  {key:'rush',label:'3일 이내 빠른 작업',price:30000,detail:'제작 일정과 자료 준비 상태에 따라 상담 후 확정'}
 ]
 const money=value=>Number(value).toLocaleString('ko-KR')+'원'
 const packageFor=key=>Object.hasOwn(packages,key)?packages[key]:packages.A
 function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value}
 function addMonths(date,months){
  const [y,m,d]=date.split('-').map(Number),last=new Date(Date.UTC(y,m-1+months+1,0)).getUTCDate()
  return new Date(Date.UTC(y,m-1+months,Math.min(d,last))).toISOString().slice(0,10)
 }
 function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
 function normalize(input={}){
  const selected=Array.isArray(input.options)?input.options:options.filter(o=>input[o.key]==='1'||input[o.key]===true).map(o=>o.key)
  return {...input,package:packageFor(input.package).key,people:input.people==='1'||input.people===2?'1':'0',options:[...new Set(selected.filter(key=>options.some(o=>o.key===key)))],firstVisit:input.firstVisit==='1'||input.firstVisit===true}
 }
 function quote(input={},reference=today()){
  const v=normalize(input),p=packageFor(v.package),duet=v.people==='1'
  const needsTuning=p.tuning||v.options.includes('tuning')
  const entries=options.filter(o=>v.options.includes(o.key)&&!(p.tuning&&o.key==='tuning')&&!(p.mixing&&o.key==='detailMix')&&!(o.key==='rush'&&!needsTuning)).map(o=>({...o}))
  if(duet)entries.unshift({key:'duet',label:'듀엣으로 변경',price:30000,detail:'2인·1곡 · 선택한 패키지의 녹음 시간 유지'})
  const discounts=[]
  if(v.firstVisit)discounts.push({key:'first',label:'위스티아 첫 이용',amount:10000})
  if(validDate(v.bookingDate)){
   const day=new Date(v.bookingDate+'T12:00:00Z').getUTCDay()
   if([4,5].includes(day)&&/^\d{2}:\d{2}$/.test(v.timeStart||'')){
    const [h,m]=v.timeStart.split(':').map(Number),minute=h*60+m
    if(minute>=780&&minute<=960)discounts.push({key:'weekday',label:'목·금 오후 1~4시 방문',amount:10000})
   }
   if(validDate(reference)&&v.bookingDate>=addMonths(reference,2))discounts.push({key:'advance2',label:'두 달 이상 사전 예약',amount:20000})
   else if(validDate(reference)&&v.bookingDate>=addMonths(reference,1))discounts.push({key:'advance1',label:'한 달 이상 사전 예약',amount:10000})
  }
  const optionTotal=entries.reduce((sum,o)=>sum+o.price,0),discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  const promo=v.eventDateMode!=='unknown'&&validDate(v.eventDate)&&v.eventDate.startsWith('2026-')
  const baseMinutes=p.minutes+(v.options.includes('extraHour')?60:0),minutes=baseMinutes+(promo?30:0)
  const paybacks=[...(input.paybackBlog==='1'||input.paybackBlog===true?[{key:'blog',label:'네이버 블로그 리뷰',amount:30000}]:[]),...(input.paybackReaction==='1'||input.paybackReaction===true?[{key:'reaction',label:'본식 현장 영상 제공',amount:30000}]:[])]
  return {v,package:p,base:p.price,options:entries,optionTotal,discounts,discount,total:p.price+optionTotal-discount,baseMinutes,minutes,promo,paybacks,payback:paybacks.reduce((sum,p)=>sum+p.amount,0),delivery:p.tuning||v.options.includes('tuning')?packages.B.delivery:packages.A.delivery}
 }
 function features(p){return ['1인·1곡 기준','녹음 '+p.minutes/60+'시간 + 1:1 디렉팅','기본 믹싱 · 목소리와 MR의 밸런스·울림 조절',p.tuning?'음정·박자 보정 포함':'음정·박자 보정 미포함',...(p.mixing?['디테일 믹싱 서비스 포함 · 음색·톤 조절']:[]),p.delivery]}
 function cards(selected='A',mode='detail'){
  return '<div class="package-cards" role="group" aria-label="패키지 선택">'+Object.values(packages).map(p=>'<label class="package-card'+(p.key===selected?' is-selected':'')+'"><input type="radio" name="'+(mode==='wizard'?'package':'detailPackage')+'" value="'+p.key+'"'+(p.key===selected?' checked':'')+'><span class="package-card-body"><span class="package-card-name">'+p.key+' <b>'+p.title+'</b></span><strong class="package-card-price">'+money(p.price)+'</strong><span class="package-card-features">'+features(p).map(s=>'<span>'+s+'</span>').join('')+'</span>'+(p.saving?'<span class="package-card-saving"><s>개별 선택 '+money(p.individual)+'</s><b>패키지로 '+money(p.saving)+' 절약</b><small>'+(p.key==='C'?'디테일 믹싱 서비스 20,000원 + 녹음 시간 추가 할인 10,000원':'디테일 믹싱 서비스 20,000원')+'</small></span>':'')+'</span></label>').join('')+'</div>'
 }
 function discountsHtml(){return '<section data-svg-title="off" class="package-discount-guide"><h3>할인 내역</h3><ul><li>위스티아 첫 이용 <b>10,000원 할인</b></li><li>목·금 오후 1~4시 방문 <b>10,000원 할인</b></li><li>녹음일까지 한 달 이상~두 달 미만 <b>10,000원 할인</b></li><li>녹음일까지 두 달 이상 <b>20,000원 할인</b></li></ul></section>'}
 const api={packages,options,money,packageFor,normalize,quote,features,cards,discountsHtml,addMonths,today}
 if(typeof module==='object'&&module.exports)module.exports=api
 global.WistiaPackages=api
})(typeof window==='object'?window:globalThis)
