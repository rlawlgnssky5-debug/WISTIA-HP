(function(global){
 const RATIOS=[30,50,70,100]
 const MOODS=['라이브 중심','자연스럽게','균형 있게','AR 중심']
 const format=value=>{const n=Math.max(0,Math.floor(Number(value)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
 function initArCdRatio(selector='#arRatioExperience'){
  const root=document.querySelector(selector);if(!root)return null
  const input=root.querySelector('.wistia-ar__ratio-input'),current=root.querySelector('.wistia-ar__ratio-current'),mood=root.querySelector('[data-ratio-mood]'),stage=root.querySelector('.wistia-ar__disc-stage'),play=root.querySelector('.wistia-ar__play'),seek=root.querySelector('.wistia-ar__seek'),timeNow=root.querySelector('[data-current-time]'),timeTotal=root.querySelector('[data-duration]'),volume=root.querySelector('.wistia-ar__volume'),error=root.querySelector('.wistia-ar__error'),audio=root.querySelector('.wistia-ar__audio')
  const listeners=[],urls=new Map(),pending=new Map();let index=2,switchToken=0,resume=false,position=0,destroyed=false,wheelLock=false,dragging=false,dragStart=0,dragIndex=2
  const on=(node,event,handler,opts)=>{node.addEventListener(event,handler,opts);listeners.push(()=>node.removeEventListener(event,handler,opts))}
  const sourceFor=ratio=>root.getAttribute('data-audio-'+ratio)||''
  async function sourceUrl(ratio){if(urls.has(ratio))return urls.get(ratio);if(pending.has(ratio))return pending.get(ratio);const job=fetch(sourceFor(ratio)).then(r=>{if(!r.ok)throw new Error(String(r.status));return r.blob()}).then(blob=>{const url=URL.createObjectURL(blob);urls.set(ratio,url);pending.delete(ratio);return url}).catch(e=>{pending.delete(ratio);throw e});pending.set(ratio,job);return job}
  function progress(){const duration=Number.isFinite(audio.duration)?audio.duration:0;timeNow.textContent=format(audio.currentTime);timeTotal.textContent=format(duration);seek.max=String(duration||1);seek.value=String(audio.currentTime||0);seek.style.setProperty('--wistia-progress',duration?(audio.currentTime/duration*100)+'%':'0%')}
  function playing(value){root.classList.toggle('is-playing',value);stage.classList.toggle('is-playing',value);play.setAttribute('aria-pressed',String(value));play.setAttribute('aria-label',value?'일시정지':'재생')}
  function render(){const ratio=RATIOS[index];root.style.setProperty('--wistia-ratio-index',index);root.dataset.ratio=String(ratio);input.value=String(index);input.setAttribute('aria-valuetext',ratio+'% '+MOODS[index]);current.textContent=ratio+'%';mood.textContent=MOODS[index];stage.setAttribute('aria-label','현재 AR 비율 '+ratio+'%, '+MOODS[index]+', 손가락으로 밀거나 마우스 휠로 변경');root.querySelectorAll('.wistia-ar__ratio-marks span').forEach(node=>node.classList.toggle('is-active',Number(node.dataset.index)===index))}
  async function select(next,shouldPlay=false){next=Math.max(0,Math.min(3,Number(next)));if(next===index){if(shouldPlay&&audio.paused)audio.play().catch(()=>{});return}const token=++switchToken;position=audio.currentTime||0;resume=shouldPlay||!audio.paused;audio.pause();index=next;render();error.hidden=true;root.classList.add('is-loading');try{const url=await sourceUrl(RATIOS[index]);if(destroyed||token!==switchToken)return;audio.dataset.ratio=String(RATIOS[index]);audio.src=url;audio.load()}catch{if(token!==switchToken)return;root.classList.remove('is-loading');error.hidden=false;playing(false)}}
  const hear=next=>select(next,true)
  on(input,'input',event=>hear(event.target.value))
  on(input,'keydown',event=>{if(['ArrowUp','ArrowRight'].includes(event.key)){event.preventDefault();hear(index+1)}if(['ArrowDown','ArrowLeft'].includes(event.key)){event.preventDefault();hear(index-1)}})
  on(stage,'keydown',event=>{if(['ArrowUp','ArrowRight'].includes(event.key)){event.preventDefault();hear(index+1)}if(['ArrowDown','ArrowLeft'].includes(event.key)){event.preventDefault();hear(index-1)}})
  on(stage,'wheel',event=>{const direction=Math.sign(Math.abs(event.deltaY)>=Math.abs(event.deltaX)?event.deltaY:event.deltaX);if(!direction||wheelLock)return;const next=index+(direction>0?1:-1);if(next<0||next>3)return;event.preventDefault();wheelLock=true;hear(next);setTimeout(()=>{wheelLock=false},260)},{passive:false})
  on(stage,'pointerdown',event=>{dragging=true;dragStart=event.clientX;dragIndex=index;stage.setPointerCapture?.(event.pointerId);stage.classList.add('is-dragging')})
  on(stage,'pointermove',event=>{if(!dragging)return;const width=Math.max(220,stage.getBoundingClientRect().width),distance=event.clientX-dragStart,steps=Math.round(distance/(width*.18));if(steps)hear(dragIndex+steps)})
  const endDrag=()=>{dragging=false;stage.classList.remove('is-dragging')}
  on(stage,'pointerup',endDrag);on(stage,'pointercancel',endDrag)
  on(play,'click',async()=>{error.hidden=true;try{if(audio.paused)await audio.play();else audio.pause()}catch{error.hidden=false;playing(false)}})
  on(volume,'click',()=>{audio.muted=!audio.muted;volume.textContent=audio.muted?'×':'◖';volume.setAttribute('aria-label',audio.muted?'음소거 해제':'음소거')})
  on(seek,'input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(seek.value)})
  on(audio,'timeupdate',progress);on(audio,'play',()=>playing(true));on(audio,'pause',()=>playing(false));on(audio,'ended',()=>playing(false));on(audio,'error',()=>{root.classList.remove('is-loading');error.hidden=false;playing(false)})
  on(audio,'canplay',()=>{root.classList.remove('is-loading');error.hidden=true;if(position)audio.currentTime=Math.min(position,Math.max(0,audio.duration-.05));position=0;if(resume){resume=false;audio.play().catch(()=>{})}progress()})
  audio.dataset.ratio='70';audio.src=sourceFor(70);audio.load();root.classList.add('is-loading');render();progress()
  return{select:ratio=>select(RATIOS.indexOf(Number(ratio))),getSelected:()=>RATIOS[index],destroy(){destroyed=true;switchToken++;listeners.splice(0).forEach(fn=>fn());audio.pause();audio.removeAttribute('src');audio.load();urls.forEach(URL.revokeObjectURL);urls.clear();pending.clear()}}
 }
 global.initArCdRatio=initArCdRatio
})(window)
