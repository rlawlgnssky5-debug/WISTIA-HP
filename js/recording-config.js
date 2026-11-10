(function (global) {
 const prices=global.WistiaPackages, money=prices.money
 const times={50:{list:50000,rate:50000},90:{list:90000,rate:80000},150:{list:150000,rate:120000}}
 const options=[
  ['tuning','음정·박자 보정','틀어진 음정과 박자를 자연스럽게 보정해요'],
  ['recordingMix','정밀 믹싱','목소리를 더욱 선명하고 풍성하게 만들어요'],
  ['recordingMaster','마스터링','전체 음질과 음압을 최종적으로 다듬어요']
 ]
 const keys=['people','recordingMinutes',...options.map(o=>o[0]),'rush']
 const monthly=(date=prices.today())=>date.startsWith('2026-11')
 function preset(tier,duo=false){
  return {people:tier==='D'||duo?'1':'0',recordingMinutes:tier==='B'?'90':tier==='C'||tier==='D'?'150':'50',tuning:tier&&tier!=='A'?'1':'0',recordingMix:tier?'1':'0',recordingMaster:tier?'1':'0',rush:'0'}
 }
 function selection(params,duo=false){
  const tier=params.get('package'), v=preset(['A','B','C','D'].includes(tier)?tier:null,duo)
  for(const key of keys){const val=params.get(key);if(key==='recordingMinutes'?Object.hasOwn(times,val):['0','1'].includes(val))v[key]=val}
  return v
 }
 function quote(v,date=prices.today()){
  const minutes=Number(v.recordingMinutes)||50, {list,rate}=times[minutes]||times[50], duet=v.people==='1', offer=monthly(date)&&minutes!==50 // 2026-11-11 지훈: 50분에는 마스터링 이벤트 없음
  const selected=options.filter(([key])=>key==='recordingMaster'&&offer||v[key]==='1').map(([key,label])=>({key,label,price:40000}))
  if(duet)selected.unshift({key:'duet',label:'녹음 1인 추가',price:40000})
  if(v.rush==='1')selected.push({key:'rush',label:'3일 이내 전달',price:30000})
  const discounts=[]
  if(list!==rate)discounts.push({key:'recording',label:'녹음 시간 할인',amount:list-rate})
  if(offer)discounts.push({key:'monthly',label:'11월 마스터링 서비스',amount:40000})
  if(!offer&&minutes===50&&!duet&&v.tuning!=='1'&&v.recordingMix==='1'&&v.recordingMaster==='1')discounts.push({key:'standard',label:'믹싱·마스터링 묶음가 적용',amount:40000})
  if(minutes!==50)discounts.push({key:'first',label:'첫 이용 할인',amount:20000})
  const advance=minutes===50?null:prices.advanceDiscount(v.bookingDate,date)
  if(advance)discounts.push(advance)
  const optionTotal=selected.reduce((sum,o)=>sum+o.price,0),discount=discounts.reduce((sum,d)=>sum+d.amount,0)
  return {v,minutes,offer,advance,list,base:list,options:selected,optionTotal,discounts,discount,total:list+optionTotal-discount,delivery:v.rush==='1'?'녹음일 기준 3일 이내':'녹음일 기준 7일 이내',package:{key:'custom',name:'맞춤 녹음',title:'내 축가 녹음 구성'}}
 }
 const radio=(key,value,current,copy)=>'<label><input type="radio" name="'+key+'" value="'+value+'"'+(current===value?' checked':'')+'>'+copy+'</label>'
 const field=(number,title,body)=>'<fieldset><legend><i>'+number+'</i> '+title+'</legend>'+body+'</fieldset>'
 function editor(v,{delivery=true}={}){
  const people=field('01','인원','<div class="rc-pair">'+radio('people','0',v.people,'<b>1인</b><small>기본</small>')+radio('people','1',v.people,'<b>2인 (듀엣곡)</b><small>+40,000원</small>')+'</div>')
  const duration=field('02','녹음 시간','<div class="rc-times">'+Object.entries(times).map(([n,{list,rate}])=>radio('recordingMinutes',n,v.recordingMinutes,'<span>'+prices.hoursText(Number(n))+'</span><span class="rc-rate">'+(rate<list?'<small><b>'+Math.round((list-rate)/list*100)+'%</b> <del>'+money(list)+'</del></small>':'')+'<strong>'+money(rate)+'</strong></span>')).join('')+'</div>')
  const work=field('03','음원 작업',options.map(([key,label,copy])=>'<div class="rc-work" data-rc-work="'+key+'"><div><strong>'+label+'</strong> '+(key==='recordingMaster'?'<small data-rc-event hidden>11월 이벤트</small>':'')+'<small>'+copy+'</small><small data-rc-regular>+40,000원</small>'+(key==='recordingMaster'?'<small data-rc-free hidden><del>40,000원</del> <b>0원</b></small>':'')+'</div><div class="rc-toggle" role="group" aria-label="'+label+'">'+radio(key,'0',v[key],'필요 없음')+radio(key,'1',v[key],'필요')+'</div></div>').join(''))
  return '<div class="recording-config">'+people+duration+work+(delivery?deliveryField(v):'')+'</div>'
 }
 function inquiryHref(v){return "/event/"+(v.people==="1"?"duo":"solo")+"?"+query(v)}
 function shortcuts(v){
  const cards=Object.entries(times).map(([minutes,{list,rate}])=>{
   const saving=Math.round((list-rate)/list*100)
   const offer=saving?'<span class="rc-shortcut-badge">'+saving+'% 할인</span>':''
   const original=saving?'<del class="rc-shortcut-original">'+money(list)+'</del>':''
   return '<button type="button" data-hero-recording="'+minutes+'" aria-pressed="'+(v.recordingMinutes===minutes)+'">'+offer+'<b>'+prices.hoursText(Number(minutes))+'</b>'+original+'<strong>'+rate.toLocaleString('ko-KR')+'<span class="rc-shortcut-unit">원</span></strong></button>'
  })
  return '<div class="ed-hero-types rc-shortcuts" role="group" aria-label="녹음 시간 선택">'+cards.join('')+'</div>'
 }
 function deliveryField(v){
  return field('04','작업 기간 <small>녹음일 기준</small>','<div class="rc-pair">'+radio('rush','0',v.rush,'<b>7일 이내</b><small>기본</small>')+radio('rush','1',v.rush,'<b>3일 이내</b><small>+30,000원</small>')+'</div>')
 }
 function sync(form,date=prices.today()){
  const row=form.querySelector('[data-rc-work="recordingMaster"]'), no=row.querySelector('input[value="0"]'), offer=monthly(date)&&form.elements.recordingMinutes?.value!=='50'
  if(offer&&!no.disabled){row.dataset.previous=form.elements.recordingMaster.value;form.elements.recordingMaster.value='1'}
  if(!offer&&no.disabled)form.elements.recordingMaster.value=row.dataset.previous||'0'
  no.disabled=offer
  row.querySelector('[data-rc-regular]').hidden=offer
  row.querySelector('[data-rc-free]').hidden=!offer
  row.querySelector('[data-rc-event]').hidden=!offer
 }
 function summary(q){
  const row=(label,value)=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>'
  return '<dl class="rc-summary">'+row('선택한 구성',money(q.list+q.optionTotal))+q.discounts.map(d=>row(d.label,'−'+money(d.amount))).join('')+row('최종 금액','<strong>'+money(q.total)+'</strong>')+'</dl>'
 }
 function firstVisit(){return prices.readCouponClaims().firstVisit!==false}
 function preferences(form){
  const v=Object.fromEntries(new FormData(form)), row=form.querySelector('[data-rc-work="recordingMaster"]')
  if(row?.querySelector('input[value="0"]').disabled)v.recordingMaster=row.dataset.previous||'0'
  return v
 }
 function query(v){
  const params=new URLSearchParams()
  for(const key of keys)params.set(key,v[key]||'0')
  return params.toString()
 }
 global.WistiaRecording={keys,monthly,preset,selection,quote,editor,shortcuts,inquiryHref,deliveryField,sync,summary,query,firstVisit,preferences}
})(window)
