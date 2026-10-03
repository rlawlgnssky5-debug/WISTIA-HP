/* Question UI only — prices and consultation are owned by app.js */
(() => {
 const modal=document.createElement('dialog')
 modal.id='quickEstimate';modal.setAttribute('aria-labelledby','quickEstimateTitle');document.body.append(modal)
 let state=null,step=0,previousFocus=null,busy=false,contextPath=''
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
 const money=value=>value.toLocaleString('ko-KR')+'원'
 const api=()=>window.WistiaQuote
 function inert(value){['siteHeader','app','floatingKakao','mainMenu','soloDesktopCta'].forEach(id=>{const el=document.getElementById(id);if(el)el.inert=value})}
 function close(){if(!modal.open)return;modal.close();inert(false);document.body.classList.remove('modal-open');if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true})}
 function choice(value,title,description='',selected=false){return '<button type="button" class="qe-choice'+(selected?' is-selected':'')+'" data-qe-choice="'+value+'" aria-pressed="'+selected+'"><strong>'+title+'</strong>'+(description?'<small>'+description+'</small>':'')+'</button>'}
 function render(){
  const film=state.key==='duet-film',options=api().options(state.key),events=api().events(),result=api().preview(state)
  let title='',description='',content=''
  if(step===0){title='어떤 축가를 준비하시나요?';description='본식에서 마음을 전할 방식을 골라주세요';content=choice('ar','직접 부르는 AR 축가','목소리는 미리 녹음하고, 본식에서는 직접 노래해요',!film)+choice('film','축가 스토리 필름','우리 목소리와 이야기를 영상으로 상영해요',film)}
  if(step===1){title='몇 분이 부르시나요?';description='두 상품 모두 1곡 기준이며, 표시 시간은 안내·연습·부가 시간을 포함합니다';content=choice('solo','1인 · 1시간','12만원 · 혼자 부르는 축가',state.key==='solo')+choice('duo','2인 · 2시간','16만원 · 두 분이 함께 부르는 축가',state.key==='duo')}
  if(step===2){title='추가로 필요한 것이 있나요?';description='여러 항목을 함께 선택할 수 있습니다';content=options.map(o=>choice(o.key,esc(o.label)+' <span>+'+money(o.price)+'</span>',esc(o.detail),state.options.includes(o.key))).join('')+choice('none-options','추가 없음','기본 구성만 준비할게요',!state.options.length)}
  if(step===3){title='후기 참여 이벤트';description='할인과 후기 페이백을 구분하여 선택하세요';content=['discount','payback'].map(type=>'<h3 class="qe-full">'+(type==='payback'?'후기 페이백':'할인')+'</h3>'+events.filter(e=>e.type===type).map(e=>choice(e.key,esc(e.label)+' <span>'+(type==='payback'?'페이백 ':'할인 −')+money(e.discount)+'</span>',esc(e.detail),state.events.includes(e.key))).join('')).join('')+choice('none-events','참여 안 함','이벤트 혜택 없이 확인할게요',!state.events.length)+'<p class="qe-note qe-full">페이백은 참여 조건 충족 확인 후 지급되며, 결제 시 미리 차감되지 않습니다</p>'}
  if(step===4){title='선택하신 견적입니다';description='구성과 금액을 확인한 뒤 상담하실 수 있습니다';content='<div class="qe-result qe-full"><h3>'+(film?'축가 스토리 필름 · 2인':state.key==='duo'?'AR 축가 · 2인 · 2시간':'AR 축가 · 1인 · 1시간')+'</h3><p>'+(film?'스토리형 구성':'1곡 기준')+'</p><dl><div><dt>기본 가격</dt><dd>'+money(result.product.normal)+'</dd></div>'+result.optionEntries.map(o=>'<div><dt>'+esc(o.label)+'</dt><dd>'+(o.total<0?'−':'+')+money(Math.abs(o.total))+'</dd></div>').join('')+result.chosen.map(e=>'<div><dt>'+esc(e.label)+'</dt><dd>'+(e.type==='payback'?'페이백 ':'할인 −')+money(e.discount)+'</dd></div>').join('')+'</dl><div class="qe-total"><span>결제 예상 금액</span><strong>'+money(result.finalPrice)+'</strong></div>'+(result.payback?'<p class="qe-note">페이백 완료 후 혜택가 <b>'+money(result.effectivePrice)+'</b></p>':'')+'<p class="qe-note">페이백은 참여 조건 충족 확인 후 지급되며 결제 시 미리 차감하지 않습니다<br>최종 금액과 적용 여부는 상담에서 확인합니다</p></div>'}
  const totalSteps=film?3:4,currentStep=film&&step>0?step:step+1
  modal.innerHTML='<div class="qe-shell"><header class="qe-top"><span>빠른 견적</span><button type="button" data-qe-close aria-label="빠른 견적 닫기"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></header><div class="qe-progress" role="progressbar" aria-label="견적 질문 진행률" aria-valuemin="0" aria-valuemax="'+totalSteps+'" aria-valuenow="'+Math.min(currentStep,totalSteps)+'"><span style="width:'+Math.min(currentStep/totalSteps*100,100)+'%"></span></div><div class="qe-scroll"><span class="qe-step">'+(step===4?'견적 확인':currentStep+' / '+totalSteps)+'</span><h2 id="quickEstimateTitle" tabindex="-1">'+title+'</h2><p class="qe-description">'+description+'</p><div class="qe-choices">'+content+'</div></div><footer class="qe-actions"><button type="button" data-qe-back'+(step===0?' disabled':'')+'>← 이전</button>'+(step>=2&&step<4?'<button type="button" class="qe-primary" data-qe-next>'+(step===3?'견적 확인':'다음 →')+'</button>':step===4?'<button type="button" class="qe-primary" data-qe-consult>카카오톡 문의 →</button>':'<span>답변을 누르면 다음 질문으로 넘어갑니다</span>')+'</footer></div>'
  modal.querySelector('#quickEstimateTitle').focus({preventScroll:true});modal.querySelector('.qe-scroll').scrollTop=0
 }
 function open(){if(!api()||modal.open)return;previousFocus=document.activeElement;if(!state||contextPath!==location.pathname){const context=api().context();state={...context,options:context.options||[],events:context.events||[]};contextPath=location.pathname}step=0;busy=false;render();modal.showModal();inert(true);document.body.classList.add('modal-open');modal.querySelector('#quickEstimateTitle').focus({preventScroll:true})}
 modal.addEventListener('click',async event=>{
  const button=event.target.closest('button');if(event.target===modal){close();return}if(!button||busy)return
  if(button.hasAttribute('data-qe-close')){close();return}
  if(button.hasAttribute('data-qe-back')){step=state.key==='duet-film'&&step===2?0:Math.max(0,step-1);render();return}
  if(button.hasAttribute('data-qe-next')){step++;render();return}
  if(button.hasAttribute('data-qe-consult')){busy=true;button.disabled=true;close();try{await api().consultKakao(state)}finally{busy=false}return}
  const value=button.dataset.qeChoice;if(!value)return
  if(step===0){const key=value==='film'?'duet-film':state.key==='duo'?'duo':'solo';if(key!==state.key){state.key=key;state.options=state.options.filter(k=>api().options(key).some(o=>o.key===k))}state.format='live';step=key==='duet-film'?2:1}
  else if(step===1){state.key=value;step=2}
  else {const field=step===2?'options':'events';if(value.startsWith('none-')){state[field]=[];step++}else state[field]=state[field].includes(value)?state[field].filter(k=>k!==value):[...state[field],value]}
  render()
 })
 modal.addEventListener('cancel',event=>{event.preventDefault();close()})
 window.WistiaQuickEstimate={open,close}
})()
