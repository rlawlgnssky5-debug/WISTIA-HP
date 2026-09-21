(function(global){
 const labels={30:'안정감 중심',50:'균형 있게',70:'자연스럽게',100:'목소리 중심'}
 const pad=value=>String(value).padStart(2,'0')
 const formatTime=value=>{const time=Number.isFinite(value)?value:0;return Math.floor(time/60)+':'+pad(Math.floor(time%60))}

 function initArCdRatio(selector='#arRatioExperience'){
  const model=global.WistiaRatioModel
  const root=document.querySelector(selector)
  if(!root||!model)return null
  const audio=root.querySelector('.ar-cd-audio'),play=root.querySelector('.ar-cd-play'),volume=root.querySelector('.ar-cd-volume'),progress=root.querySelector('.ar-cd-progress'),time=root.querySelector('.ar-cd-time'),error=root.querySelector('.ar-cd-error'),discCopy=root.querySelector('.ar-cd-disc-copy'),visual=root.querySelector('.ar-cd-visual')
  const controls=[...root.querySelectorAll('[data-ratio]')]
  const listeners=[],sourceUrls=new Map(),sourcePromises=new Map()
  let state=model.createRatioState(70),pendingPosition=0,pendingPlay=false,pendingSwitch=false,switchToken=0,destroyed=false
  const on=(target,event,handler,options)=>{target.addEventListener(event,handler,options);listeners.push(()=>target.removeEventListener(event,handler,options))}
  const srcFor=ratio=>root.getAttribute('data-audio-'+ratio)
  async function blobSource(ratio){
   if(sourceUrls.has(ratio))return sourceUrls.get(ratio)
   if(sourcePromises.has(ratio))return sourcePromises.get(ratio)
   const pending=fetch(srcFor(ratio)).then(response=>{if(!response.ok)throw new Error('audio load failed: '+response.status);return response.blob()}).then(blob=>{const url=URL.createObjectURL(blob);sourceUrls.set(ratio,url);sourcePromises.delete(ratio);return url}).catch(error=>{sourcePromises.delete(ratio);throw error})
   sourcePromises.set(ratio,pending)
   return pending
  }
  function render(){
   root.style.setProperty('--ar-angle',model.ratioToAngle(state.selected)+'deg')
   root.classList.toggle('is-playing',state.playing)
   controls.forEach(control=>{const active=Number(control.dataset.ratio)===state.selected;if(control.classList.contains('ar-cd-tab'))control.setAttribute('aria-pressed',String(active));else control.setAttribute('aria-current',String(active))})
   discCopy.innerHTML='<small>'+labels[state.selected]+'</small><strong>'+state.selected+'<span>%</span></strong>'
   visual.setAttribute('aria-label','선택한 AR 비율 '+state.selected+'퍼센트')
   play.textContent=state.playing?'Ⅱ':'▶'
   play.setAttribute('aria-label',state.playing?'일시정지':'재생')
  }
  function updateTime(){const duration=Number.isFinite(audio.duration)?audio.duration:0;time.textContent=formatTime(audio.currentTime)+' / '+formatTime(duration);progress.value=duration?Math.round(audio.currentTime/duration*1000):0}
  function setLoading(loading){root.classList.toggle('is-loading',loading);play.disabled=loading;play.setAttribute('aria-busy',String(loading))}
  async function setRatio(value){
   const next=Number(value)
   if(next===state.selected||!model.RATIOS.includes(next))return
   const token=++switchToken
   pendingPosition=audio.currentTime||0
   pendingPlay=!audio.paused
   pendingSwitch=true
   audio.pause()
   state=model.selectRatio(state,next)
   setLoading(true)
   error.hidden=true
   render()
   try{
    const sourceUrl=await blobSource(next)
    if(destroyed||token!==switchToken)return
    audio.dataset.ratio=String(next)
    audio.src=sourceUrl
    audio.load()
   }catch{
    if(destroyed||token!==switchToken)return
    pendingPlay=false;pendingSwitch=false;error.hidden=false;setLoading(false);setPlaying(false)
   }
  }
  async function togglePlay(){
   try{if(audio.paused)await audio.play();else audio.pause()}catch{error.hidden=false;setLoading(false)}
  }
  function toggleMute(){audio.muted=!audio.muted;volume.textContent=audio.muted?'×':'◖';volume.setAttribute('aria-label',audio.muted?'음소거 해제':'음소거')}
  function seek(){if(Number.isFinite(audio.duration))audio.currentTime=Number(progress.value)/1000*audio.duration}
  function loaded(){
   if(destroyed)return
   updateTime()
  }
  function ready(){
   if(destroyed)return
   error.hidden=true
   setLoading(false)
   if(!pendingSwitch)return
   const target=Math.min(pendingPosition,Math.max(0,audio.duration-.05)),resume=pendingPlay
   pendingSwitch=false
   pendingPlay=false
   let resumed=false
   const resumeAtTarget=()=>{if(resumed||destroyed)return;resumed=true;updateTime();if(resume)audio.play().catch(()=>{error.hidden=false})}
   if(target>.05){audio.addEventListener('seeked',resumeAtTarget,{once:true});listeners.push(()=>audio.removeEventListener('seeked',resumeAtTarget));audio.currentTime=target}else resumeAtTarget()
  }
  function setPlaying(playing){state={...state,playing};render()}
  controls.forEach(control=>on(control,'click',()=>setRatio(control.dataset.ratio)))
  on(play,'click',togglePlay)
  on(volume,'click',toggleMute)
  on(progress,'input',seek)
  on(audio,'loadedmetadata',loaded)
  on(audio,'play',()=>setPlaying(true))
  on(audio,'pause',()=>setPlaying(false))
  on(audio,'ended',()=>setPlaying(false))
  on(audio,'timeupdate',updateTime)
  on(audio,'error',()=>{if(destroyed)return;error.hidden=false;setLoading(false);setPlaying(false)})
  on(audio,'canplay',ready)
  audio.dataset.ratio=String(state.selected)
  audio.src=srcFor(state.selected)
  setLoading(true)
  audio.load()
  render()
  updateTime()
  return{
   select:setRatio,
   getSelected:()=>state.selected,
   destroy(){destroyed=true;switchToken++;pendingPlay=false;pendingSwitch=false;listeners.splice(0).forEach(remove=>remove());audio.pause();audio.removeAttribute('src');audio.load();sourceUrls.forEach(url=>URL.revokeObjectURL(url));sourceUrls.clear();sourcePromises.clear();root.classList.remove('is-playing','is-loading')}
  }
 }
 global.initArCdRatio=initArCdRatio
})(window)
