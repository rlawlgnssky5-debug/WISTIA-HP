(function (global) {
 const prices=global.WistiaPackages, money=prices.money
 // 2026-11-19 지훈: 상품은 하나 — 녹음 2시간 + 보컬 튜닝 + 전문 믹싱 + 마스터링, 정가 240,000원 (50분·1시간 30분·2시간 30분은 없앴다)
 const included=[
  ['recording','녹음 2시간','한 마디씩 끊어서 1:1 디렉팅으로 녹음해요',120000,'🎙️'],
  ['tuning','보컬 튜닝','틀어진 음정과 박자를 자연스럽게 보정해요',40000,'🎵'],
  ['recordingMix','전문 믹싱','목소리를 더욱 선명하고 풍성하게 만들어요',40000,'🎚️'],
  ['recordingMaster','마스터링','전체 음질과 음압을 최종적으로 다듬어요',40000,'🎧']
 ]
 const list=included.reduce((sum,item)=>sum+item[3],0)
 const baseMinutes=120,extraHour=60000,duetFee=40000
 // 2026-11-13 지훈: 녹음 메이킹은 녹음·촬영을 나누어 안내하지 않고 예약 시간에 1시간만 더한다
 const makingMinutes=60
 const makingOption=['makingVideo','녹음 메이킹 영상 추가','',80000]
 const keys=['firstUse','people','recordingMinutes','makingVideo','rush']
 // 2026-11-18 지훈: 이벤트는 달이 바뀌면 그대로 다음 달 이벤트로 이어진다 — 글자 ‘N월’과 말일은 오늘(한국 시간) 기준으로 자동
 // 2026-11-19 지훈: 이벤트는 ‘N월 최저가 보상 이벤트’ −40,000원 (마스터링 무료 이벤트는 끝)
 const monthly=()=>true
 const eventAmount=40000
 const eventMonth=(date=prices.today())=>Number(date.slice(5,7))+'월'
 const eventUntil=(date=prices.today())=>{const y=Number(date.slice(0,4)),m=Number(date.slice(5,7));return m+'월 '+new Date(Date.UTC(y,m,0)).getUTCDate()+'일까지'}
 const eventLabel=(date=prices.today())=>eventMonth(date)+' 최저가 보상 이벤트'
 function preset(tier,duo=false){
  return {people:tier==='D'||duo?'1':'0',recordingMinutes:String(baseMinutes),makingVideo:'',rush:'0',firstUse:'1'}
 }
 function selection(params,duo=false){
  const tier=params.get('package'), v=preset(['A','B','C','D'].includes(tier)?tier:null,duo)
  for(const key of keys){const val=params.get(key);if(key==='recordingMinutes'?['120','180'].includes(val):['0','1'].includes(val)||val===''&&key==='makingVideo')v[key]=val}
  return v
 }
 function quote(v,date=prices.today()){
  const longer=v.recordingMinutes==='180', minutes=longer?180:baseMinutes, duet=v.people==='1', making=v.makingVideo==='1'
  const selected=[]
  if(duet)selected.push({key:'duet',label:'녹음 1인 추가',price:duetFee})
  if(longer)selected.push({key:'extraHour',label:'녹음 1시간 추가',price:extraHour})
  if(making)selected.push({key:'makingVideo',label:makingOption[1],price:makingOption[3]})
  if(v.rush==='1')selected.push({key:'rush',label:'3일 이내 전달',price:30000})
  const discounts=[]
  // 2026-11-16 지훈: 첫 이용 할인은 문의 맨 위 스위치가 켜졌을 때만 (기본 켜짐)
  if(v.firstUse!=='0')discounts.push({key:'first',label:'첫 이용 할인',amount:20000})
  discounts.push({key:'monthly',label:eventLabel(date),amount:eventAmount})
  const advance=prices.advanceDiscount(v.bookingDate,date)
  if(advance)discounts.push(advance)
  const optionTotal=selected.reduce((sum,o)=>sum+o.price,0),discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  return {v,minutes,recordingMinutes:minutes,filmingMinutes:0,making,bookingMinutes:minutes+(making?makingMinutes:0),offer:true,advance,list,base:list,options:selected,optionTotal,discounts,discount,total:list+optionTotal-discount,delivery:v.rush==='1'?'녹음일 기준 3일 이내':'녹음일 기준 7일 이내',package:{key:'custom',name:'축가 녹음',title:'녹음 2시간 + 보컬 튜닝 + 전문 믹싱 + 마스터링'}}
 }
 // 기본 구성 그대로(1인, 첫 이용) 받는 가격
 const startPrice=(date=prices.today())=>list-20000-eventAmount
 const radio=(key,value,current,copy)=>'<label><input type="radio" name="'+key+'" value="'+value+'"'+(current===value?' checked':'')+'>'+copy+'</label>'
 const field=(number,title,body)=>'<fieldset><legend><i>'+number+'</i> '+title+'</legend>'+body+'</fieldset>'
 function optionRow([key,label,copy,price,icon],v){
  return '<div class="rc-work" data-rc-work="'+key+'"><div><strong>'+(icon?'<span aria-hidden="true">'+icon+'</span>&nbsp;':'')+label+'</strong> '+
    (copy?'<small>'+copy+'</small>':'')+'<small data-rc-regular>+'+money(price)+'</small>'+
    '</div><div class="rc-toggle" role="group" aria-label="'+label+'">'+
    radio(key,'0',v[key],'필요 없음')+radio(key,'1',v[key],'필요')+'</div></div>'
 }
 function includedRow([key,label,copy,price,icon]){
  return '<li class="rc-inc-item" data-rc-included="'+key+'"><span class="rc-inc-icon" aria-hidden="true">'+icon+'</span><span class="rc-inc-text"><strong>'+label+'</strong><small>'+copy+'</small></span><span class="rc-inc-price">'+money(price)+'</span></li>'
 }
 // 2026-11-19 지훈: 순서는 01 인원 → 02 기본 구성 → 첫 이용 할인 → 03 녹음 시간 → 04 영상 → 05 작업 기간
 function editor(v,{delivery=true}={}){
  const first='<div class="rc-first"><div class="rc-work" data-rc-work="firstUse"><div><strong>첫 이용 할인</strong> <small>위스티아가 처음이라면 켜 주세요</small><small class="rc-first-amount">−20,000원</small></div><div class="rc-toggle" role="group" aria-label="첫 이용 할인">'+radio('firstUse','0',v.firstUse,'필요 없음')+radio('firstUse','1',v.firstUse,'필요')+'</div></div></div>'
  const base=field('02','기본 구성 <small>모두 포함</small>','<ul class="rc-included">'+included.map(includedRow).join('')+'</ul><p class="rc-inc-total"><span>정가</span><b>'+money(list)+'</b></p>')
  const people=field('01','인원','<div class="rc-pair">'+radio('people','0',v.people,'<b>1인</b><small>기본</small>')+radio('people','1',v.people,'<b>2인 (듀엣곡)</b><small>+'+money(duetFee)+'</small>')+'</div>')
  const duration=field('03','녹음 시간','<div class="rc-pair">'+radio('recordingMinutes','120',v.recordingMinutes,'<b>2시간</b><small>기본</small>')+radio('recordingMinutes','180',v.recordingMinutes,'<b>3시간</b><small>+'+money(extraHour)+'</small>')+'</div>')
  const making=field('04','영상 작업','<img class="rc-making-photo" src="/assets/img/song-options/recording-making-portrait-v3.webp" alt="스튜디오에서 축가를 녹음하는 메이킹 영상 장면" loading="lazy" width="1280" height="730">'+optionRow(makingOption,v))
  return '<div class="recording-config">'+people+base+first+duration+making+(delivery?deliveryField(v):'')+'</div>'
 }
 function inquiryHref(v){return "/event/"+(v.people==="1"?"duo":"solo")+"?"+query(v)}
 function shortcuts(){
  const pct=Math.round((list-startPrice())/list*100)
  return '<div class="ed-hero-types rc-shortcuts rc-shortcuts-one" role="group" aria-label="축가 녹음 가격"><div class="rc-price-card"><span class="rc-shortcut-badge">'+eventMonth()+' 최저가 보상 · '+pct+'% 할인</span><b>녹음 2시간 + 보컬 튜닝 + 전문 믹싱 + 마스터링</b><div class="rc-shortcut-prices"><del class="rc-shortcut-original">'+money(list)+'</del><span class="rc-shortcut-arrow" aria-hidden="true">›</span><strong>'+startPrice().toLocaleString('ko-KR')+'<span class="rc-shortcut-unit">원</span></strong></div></div></div>'
 }
 function deliveryField(v){
  return field('05','작업 기간 <small>녹음일 기준</small>','<div class="rc-pair">'+radio('rush','0',v.rush,'<b>7일 이내</b><small>기본</small>')+radio('rush','1',v.rush,'<b>3일 이내</b><small>+30,000원</small>')+'</div>')
 }
 function summary(q){
  const row=(label,value,cls)=>'<div class="'+cls+'"><dt>'+label+'</dt><dd>'+value+'</dd></div>'
  return '<dl class="rc-summary">'+row('선택한 구성',money(q.list+q.optionTotal),'rc-sum-list')+q.discounts.map(d=>row(d.key==='monthly'?'<span class="rc-sum-event">✨ '+d.label+'</span>':d.label,'−'+money(d.amount),'rc-sum-discount'+(d.key==='monthly'?' is-event':''))).join('')+row('최종 금액','<strong data-rc-total>'+money(q.total)+'</strong>','rc-sum-total')+'</dl>'
 }
 function firstVisit(){return prices.readCouponClaims().firstVisit!==false}
 function preferences(form){return Object.fromEntries(new FormData(form))}
 function query(v){
  const params=new URLSearchParams()
  for(const key of keys){
   if(v[key]==null&&key==='makingVideo')continue
   params.set(key,v[key]??'0')
  }
  return params.toString()
 }
 global.WistiaRecording={keys,list,monthly,eventMonth,eventUntil,eventLabel,eventAmount,startPrice,preset,selection,quote,editor,shortcuts,inquiryHref,deliveryField,summary,query,firstVisit,preferences}
})(window)
