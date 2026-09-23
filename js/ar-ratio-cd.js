(function(global){
 const SOURCES=[30,50,70,100]
 const format=value=>{const n=Math.max(0,Math.floor(Number(value)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
 const clamp=value=>Math.max(30,Math.min(100,Math.round(Number(value)||30)))
 const nearest=value=>SOURCES.reduce((best,item)=>Math.abs(item-value)<Math.abs(best-value)?item:best,SOURCES[0])
 const moodFor=value=>value<40?'라이브 중심':value<60?'자연스럽게':value<85?'균형 있게':'AR 중심'

 function initArCdRatio(selector='#arRatioExperience'){
  const root=document.querySelector(selector);if(!root)return null
  const input=root.querySelector('.wistia-ar__ratio-input'),current=root.querySelector('.wistia-ar__ratio-current'),mood=root.querySelector('[data-ratio-mood]'),stage=root.querySelector('.wistia-ar__disc-stage'),play=root.querySelector('.wistia-ar__play'),seek=root.querySelector('.wistia-ar__seek'),timeNow=root.querySelector('[data-current-time]'),timeTotal=root.querySelector('[data-duration]'),volume=root.querySelector('.wistia-ar__volume'),error=root.querySelector('.wistia-ar__error'),audio=root.querySelector('.wistia-ar__audio')
  const listeners=[],urls=new Map(),pending=new Map();let value=70,sourceRatio=70,switchToken=0,resume=false,position=0,destroyed=false,dragging=false,dragStart=0,dragValue=70
  const on=(node,event,handler,opts)=>{node.addEventListener(event,handler,opts);listeners.push(()=>node.removeEventListener(event,handler,opts))}
  const sourceFor=ratio=>root.getAttribute('data-audio-'+ratio)||''
  async function sourceUrl(ratio){if(urls.has(ratio))return urls.get(ratio);if(pending.has(ratio))return pending.get(ratio);const job=fetch(sourceFor(ratio)).then(r=>{if(!r.ok)throw new Error(String(r.status));return r.blob()}).then(blob=>{const url=URL.createObjectURL(blob);urls.set(ratio,url);pending.delete(ratio);return url}).catch(e=>{pending.delete(ratio);throw e});pending.set(ratio,job);return job}
  function progress(){const duration=Number.isFinite(audio.duration)?audio.duration:0;timeNow.textContent=format(audio.currentTime);timeTotal.textContent=format(duration);seek.max=String(duration||1);seek.value=String(audio.currentTime||0);seek.style.setProperty('--wistia-progress',duration?(audio.currentTime/duration*100)+'%':'0%')}
  function playing(state){root.classList.toggle('is-playing',state);stage.classList.toggle('is-playing',state);play.setAttribute('aria-pressed',String(state));play.setAttribute('aria-label',state?'일시정지':'재생')}
  function render(){const tone=nearest(value),moodText=moodFor(value),percent=(value-30)/70*100;root.style.setProperty('--wistia-ratio-progress',percent);root.dataset.ratio=String(value);root.dataset.tone=String(tone);input.value=String(value);input.setAttribute('aria-valuetext',value+'% '+moodText);current.textContent=value+'%';mood.textContent=moodText;stage.setAttribute('aria-label','현재 AR 비율 '+value+'%, '+moodText+', 손가락으로 밀거나 마우스 휠로 변경');root.querySelectorAll('.wistia-ar__ratio-marks span').forEach(node=>node.classList.toggle('is-active',Number(node.dataset.value)===tone))}
  async function switchSource(next,shouldPlay=false){if(next===sourceRatio){if(shouldPlay&&audio.paused)audio.play().catch(()=>{});return}const token=++switchToken;position=audio.currentTime||0;resume=shouldPlay||!audio.paused;audio.pause();sourceRatio=next;error.hidden=true;root.classList.add('is-loading');try{const url=await sourceUrl(sourceRatio);if(destroyed||token!==switchToken)return;audio.dataset.ratio=String(sourceRatio);audio.src=url;audio.load()}catch{if(token!==switchToken)return;root.classList.remove('is-loading');error.hidden=false;playing(false)}}
  function setValue(next){const selected=clamp(next);if(selected===value)return;value=selected;audio.pause();resume=false;render();switchSource(nearest(value),false)}
  on(input,'input',event=>setValue(event.target.value))
  on(stage,'keydown',event=>{if(['ArrowUp','ArrowRight'].includes(event.key)){event.preventDefault();setValue(value+1)}if(['ArrowDown','ArrowLeft'].includes(event.key)){event.preventDefault();setValue(value-1)}})
  on(stage,'wheel',event=>{const direction=Math.sign(Math.abs(event.deltaY)>=Math.abs(event.deltaX)?event.deltaY:event.deltaX);if(!direction)return;const next=value+(direction>0?1:-1);if(next<30||next>100)return;event.preventDefault();setValue(next)},{passive:false})
  on(stage,'pointerdown',event=>{dragging=true;dragStart=event.clientX;dragValue=value;stage.setPointerCapture?.(event.pointerId);stage.classList.add('is-dragging')})
  on(stage,'pointermove',event=>{if(!dragging)return;const width=Math.max(220,stage.getBoundingClientRect().width),distance=event.clientX-dragStart;setValue(dragValue+distance/width*70)})
  const endDrag=()=>{dragging=false;stage.classList.remove('is-dragging')}
  on(stage,'pointerup',endDrag);on(stage,'pointercancel',endDrag)
  on(play,'click',async()=>{error.hidden=true;try{if(audio.paused)await audio.play();else audio.pause()}catch{error.hidden=false;playing(false)}})
  on(volume,'click',()=>{audio.muted=!audio.muted;volume.textContent=audio.muted?'×':'◖';volume.setAttribute('aria-label',audio.muted?'음소거 해제':'음소거')})
  on(seek,'input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(seek.value)})
  on(audio,'timeupdate',progress);on(audio,'play',()=>playing(true));on(audio,'pause',()=>playing(false));on(audio,'ended',()=>playing(false));on(audio,'error',()=>{root.classList.remove('is-loading');error.hidden=false;playing(false)})
  on(audio,'canplay',()=>{root.classList.remove('is-loading');error.hidden=true;if(position)audio.currentTime=Math.min(position,Math.max(0,audio.duration-.05));position=0;if(resume){resume=false;audio.play().catch(()=>{})}progress()})
  audio.dataset.ratio='70';audio.src=sourceFor(70);audio.load();root.classList.add('is-loading');render();progress()
  return{select:ratio=>setValue(ratio),getSelected:()=>value,destroy(){destroyed=true;switchToken++;listeners.splice(0).forEach(fn=>fn());audio.pause();audio.removeAttribute('src');audio.load();urls.forEach(URL.revokeObjectURL);urls.clear();pending.clear()}}
 }
 global.initArCdRatio=initArCdRatio
})(window)
