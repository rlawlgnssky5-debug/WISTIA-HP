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
 // 2026-11-20 지훈: 축가 AR에서 녹음 메이킹 옵션은 없앤다
 // 2026-11-20 지훈: 3일 이내 작업 옵션은 없앤다 — 작업 기간은 녹음일 기준 7일 이내 하나
 const keys=['firstUse','people','recordingMinutes']
 // 2026-11-18 지훈: 이벤트는 달이 바뀌면 그대로 다음 달 이벤트로 이어진다 — 글자 ‘N월’과 말일은 오늘(한국 시간) 기준으로 자동
 // 2026-11-19 지훈: 이벤트는 ‘N월 최저가 보상 이벤트’ −40,000원 (마스터링 무료 이벤트는 끝)
 const monthly=()=>true
 const eventAmount=40000
 const eventMonth=(date=prices.today())=>Number(date.slice(5,7))+'월'
 const eventUntil=(date=prices.today())=>{const y=Number(date.slice(0,4)),m=Number(date.slice(5,7));return m+'월 '+new Date(Date.UTC(y,m,0)).getUTCDate()+'일까지'}
 const eventLabel=(date=prices.today())=>eventMonth(date)+' 최저가 보상 이벤트'
 function preset(tier,duo=false){
  return {people:tier==='D'||duo?'1':'0',recordingMinutes:String(baseMinutes),firstUse:'1'}
 }
 function selection(params,duo=false){
  const tier=params.get('package'), v=preset(['A','B','C','D'].includes(tier)?tier:null,duo)
  for(const key of keys){const val=params.get(key);if(key==='recordingMinutes'?['120','180'].includes(val):['0','1'].includes(val))v[key]=val}
  return v
 }
 // 2026-11-20 지훈: 프로포즈 필름 — 녹음 1시간 + 촬영 30분(+영상 편집), 옵션 없음, 정가 280,000(축가 240,000 − 1시간 40,000 + 필름 80,000)
 const proposalIncluded=[['recording','녹음 1시간'],['filming','촬영 30분'],['tuning','보컬 튜닝 · 전문 믹싱 · 마스터링'],['film','필름 편집']]
 // 2026-11-20 지훈: 가격 기준은 10분당 1만원(그래서 녹음 1시간 추가 = 60,000) — 프로포즈 필름 정가 300,000 → 첫 이용 −20,000 · 최저가 보상 −40,000 = 240,000, 연말 기념 −20,000 더해 220,000
 const proposalList=300000
 const yearEndUntil='2026-12-31'
 function proposalQuote(v,date){
  const discounts=[{key:'first',label:'첫 이용 할인',amount:20000},{key:'monthly',label:eventLabel(date),amount:eventAmount}]
  if(date<=yearEndUntil)discounts.push({key:'yearEnd',label:'연말 기념 프로포즈 할인',amount:20000})
  const advance=prices.advanceDiscount(v.bookingDate,date)
  if(advance)discounts.push(advance)
  const discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  // 2026-11-20 지훈: 프로포즈 문의 1단계는 녹음 시간(1시간 기본 / 2시간 +60,000)만
  const longer=v.recordingMinutes==='180',minutes=longer?120:60,options=[]
  if(longer)options.push({key:'extraHour',label:'녹음 1시간 추가',price:extraHour})
  const optionTotal=options.reduce((sum,o)=>sum+o.price,0)
  return {v,minutes,recordingMinutes:minutes,filmingMinutes:30,making:false,bookingMinutes:minutes+30,offer:true,advance,list:proposalList,base:proposalList,options,optionTotal,discounts,discount,total:proposalList+optionTotal-discount,delivery:'녹음일 기준 7일 이내',proposal:true,included:proposalIncluded,package:{key:'proposal',name:'프로포즈 필름',title:'녹음 1시간 + 촬영 30분 + 튜닝·믹싱·마스터링 + 필름 편집'}}
 }
 function quote(v,date=prices.today()){
  if(v.product==='proposal')return proposalQuote(v,date)
  const longer=v.recordingMinutes==='180', minutes=longer?180:baseMinutes, duet=v.people==='1'
  const selected=[]
  if(duet)selected.push({key:'duet',label:'2인 (듀엣곡)',price:duetFee})
  if(longer)selected.push({key:'extraHour',label:'녹음 1시간 추가',price:extraHour})
  const discounts=[]
  // 2026-11-16 지훈: 첫 이용 할인은 문의 맨 위 스위치가 켜졌을 때만 (기본 켜짐)
  if(v.firstUse!=='0')discounts.push({key:'first',label:'첫 이용 할인',amount:20000})
  discounts.push({key:'monthly',label:eventLabel(date),amount:eventAmount})
  const advance=prices.advanceDiscount(v.bookingDate,date)
  if(advance)discounts.push(advance)
  const optionTotal=selected.reduce((sum,o)=>sum+o.price,0),discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  return {v,minutes,recordingMinutes:minutes,filmingMinutes:0,making:false,bookingMinutes:minutes,offer:true,advance,list,base:list,options:selected,optionTotal,discounts,discount,total:list+optionTotal-discount,delivery:'녹음일 기준 7일 이내',package:{key:'custom',name:'축가 녹음',title:'녹음 2시간 + 보컬 튜닝 + 전문 믹싱 + 마스터링'}}
 }
 // 기본 구성 그대로(1인, 첫 이용) 받는 가격
 const startPrice=(date=prices.today())=>list-20000-eventAmount
 const radio=(key,value,current,copy)=>'<label><input type="radio" name="'+key+'" value="'+value+'"'+(current===value?' checked':'')+'>'+copy+'</label>'
 const field=(number,title,body)=>'<fieldset><legend><i>'+number+'</i> '+title+'</legend>'+body+'</fieldset>'
 // 2026-11-20 지훈: 문의 1단계(구성)는 없앤다 — 숨긴 값만 두고, 인원(1인/2인)은 날짜 선택 위에서 고른다, 녹음 시간 추가 선택도 없음
 const hiddenMinutes='<input type="radio" name="recordingMinutes" value="120" checked hidden>'
 function editor(v){
  return '<div class="recording-config" hidden><input type="hidden" name="firstUse" value="1">'+hiddenMinutes+'<div class="rc-receipt-slot" data-rc-summary></div></div>'
 }
 function peoplePicker(v){
  return '<div class="recording-config wf-people-pick"><fieldset><legend>인원</legend><div class="rc-pair">'+radio('people','0',v.people,'<b>1인</b><small>기본</small>')+radio('people','1',v.people,'<b>2인 (듀엣곡)</b><small>+'+money(duetFee)+'</small>')+'</div></fieldset></div>'
 }
 function inquiryHref(v){return "/event/"+(v.people==="1"?"duo":"solo")+"?"+query(v)}
 function shortcuts(){
  const pct=Math.round((list-startPrice())/list*100)
  return '<div class="ed-hero-types rc-shortcuts rc-shortcuts-one" role="group" aria-label="축가 녹음 가격"><div class="rc-price-card rc-price-e"><span class="rc-shortcut-badge">'+eventMonth()+' 최저가 보상 · '+pct+'% 할인</span><b>올인원 패키지</b><del class="rc-shortcut-original">'+money(list)+'</del><strong class="rc-e-price">'+startPrice().toLocaleString('ko-KR')+'<span class="rc-shortcut-unit">원</span></strong><ul class="rc-e-incl"><li><i aria-hidden="true">🎙️</i>녹음 2시간</li><li><i aria-hidden="true">🎚️</i>보컬 튜닝</li><li><i aria-hidden="true">🎛️</i>전문 믹싱</li><li><i aria-hidden="true">💿</i>마스터링</li></ul></div></div>'
 }
 function proposalEditor(v){
  return '<div class="recording-config" hidden><input type="hidden" name="product" value="proposal"><input type="hidden" name="firstUse" value="1"><input type="hidden" name="people" value="0">'+hiddenMinutes+'<div class="rc-receipt-slot" data-rc-summary></div></div>'
 }
 function summary(q){
  const line=(label,value,cls='')=>'<div class="rc-rcpt-line'+(cls?' '+cls:'')+'"><dt>'+label+'</dt><dd>'+value+'</dd></div>'
  return '<div class="rc-receipt"><p class="rc-rcpt-brand">WISTIA · '+(q.proposal?'프로포즈 필름 영수증':'내 축가 영수증')+'</p><dl>'+
   (q.included||included).map(item=>line(item[1],'포함','is-included')).join('')+
   q.options.map(o=>Array.isArray(o)?{label:o[0],price:o[1]}:o).map(o=>line(o.label,'+'+money(o.price),'is-option')).join('')+
   line('정가','<s>'+money(q.list+q.optionTotal)+'</s>','is-list')+
   q.discounts.map(d=>line(d.key==='monthly'?'✨ '+d.label:d.label,'−'+money(d.amount),'is-discount')).join('')+
   '</dl><p class="rc-rcpt-total"><span>합계</span><strong data-rc-total>'+money(q.total)+'</strong></p></div>'
 }
 function firstVisit(){return prices.readCouponClaims().firstVisit!==false}
 function preferences(form){return Object.fromEntries(new FormData(form))}
 function query(v){
  const params=new URLSearchParams()
  for(const key of keys){
   params.set(key,v[key]??'0')
  }
  return params.toString()
 }
 global.WistiaRecording={proposalEditor,peoplePicker,keys,list,included,monthly,eventMonth,eventUntil,eventLabel,eventAmount,startPrice,preset,selection,quote,editor,shortcuts,inquiryHref,summary,query,firstVisit,preferences}
})(window)
