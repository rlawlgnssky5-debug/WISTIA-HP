(()=>{
  'use strict';
  let scheduled=false;
  const normalize=()=>{
    scheduled=false;
    for(const e of document.querySelectorAll('.wf-location-bar>div>strong')){
      const text=e.textContent.replace('도보 약 300m','300m');
      if(e.textContent!==text)e.textContent=text;
    }
    const compactFeatures={
      '녹음 50분':['녹음 50분'],
      '+ 음정 박자 보정':['음정·박자','보정'],
      '+ 시간 1시간 추가':['녹음 1시간','추가'],
      '+ 1명 추가':['1명 추가']
    };
    for(const e of document.querySelectorAll('.package-card-sub-item:not([data-layout-compact])')){
      const source=e.textContent.trim(),parts=compactFeatures[source];
      e.dataset.layoutCompact='true';
      if(source.startsWith('+'))e.dataset.layoutPlus='true';
      if(parts)e.replaceChildren(...parts.map(text=>{const span=document.createElement('span');span.textContent=text;return span}));
    }
    const optionDescriptions={tuning:'음정·박자를 자연스럽게 다듬어요',detailMix:'음압과 톤을 정리해 최종 음원으로 완성해요',precisionMix:'목소리와 반주의 밸런스를 맞춰요',extraHour:'선택한 녹음 시간에 1시간을 더해요',rush:'녹음일 기준 3일 이내에 음원을 받아요'};
    for(const e of document.querySelectorAll('[data-wf-option] .wf-check-label:not([data-layout-option])')){
      e.dataset.layoutOption='true';
      for(const node of [...e.childNodes])if(node.nodeType===3&&node.textContent.trim()){const span=document.createElement('span');span.className='layout-option-title';span.textContent=node.textContent;node.replaceWith(span)}
      const small=e.querySelector('small'),key=e.closest('[data-wf-option]').dataset.wfOption;
      if(small&&optionDescriptions[key])small.textContent=optionDescriptions[key];
    }
    const featureSize=7.5;
    for(const e of document.querySelectorAll('.package-card-sub-item')){
      if(e.clientWidth<=0)continue;
      e.style.setProperty('--layout-feature-size',featureSize+'px');
      const css=getComputedStyle(e),parts=[...e.children],available=e.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight),required=parts.reduce((sum,x)=>sum+x.getBoundingClientRect().width,0)+Math.max(0,parts.length-1)*2;
      if(required>available)e.style.setProperty('--layout-feature-size',Math.floor(featureSize*available/required*10)/10+'px');
    }
    for(const root of document.querySelectorAll('#app,#siteHeader,#mainMenu')){
      for(const e of [root,...root.querySelectorAll('*')]){
        if(e.namespaceURI?.includes('svg')||!Array.from(e.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;
        const s=getComputedStyle(e);if(s.display==='none')continue;
        const size=parseFloat(s.fontSize);if(!Number.isFinite(size))continue;
        if(e.closest('.package-cards,.package-selected-cheaper,.type-poster-standard,.wf-location-bar,.ed-hero-overview h1'))continue;
        const clamped=Math.max(e.closest('.ed-event-discount')?10:11,Math.min(20,size));
        if(Math.abs(size-clamped)>.01)e.style.setProperty('font-size',clamped+'px','important');
      }
    }
    window.dispatchEvent(new Event('wistia:layout-ready'));
  };
  const queue=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(normalize)}};
  new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  document.fonts.addEventListener('loadingdone',queue);
  addEventListener('DOMContentLoaded',queue);addEventListener('resize',queue);document.addEventListener('click',queue);document.addEventListener('change',queue);document.fonts.ready.then(queue);queue();
})();
