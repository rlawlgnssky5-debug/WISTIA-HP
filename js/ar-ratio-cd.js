(function(global){
 // 30·50·70·100 네 음원을 같은 시각에 함께 재생하고, 비율에 따라 볼륨만 교차 조절한다
 // 비율을 옮겨도 노래는 끊기지 않고 계속 재생된다 (Web Audio, before-after.js와 같은 방식)
 const ANCHORS=[30,50,70,100]
 const format=value=>{const n=Math.max(0,Math.floor(Number(value)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
 const clamp=value=>Math.max(30,Math.min(100,Math.round(Number(value)||30)))
 const nearest=value=>ANCHORS.reduce((best,item)=>Math.abs(item-value)<Math.abs(best-value)?item:best,ANCHORS[0])
 const moodFor=value=>value<40?'라이브 중심':value<60?'자연스럽게':value<85?'균형 있게':'AR 중심'
 function mixFor(value){
  const mix={};ANCHORS.forEach(r=>{mix[r]=0})
  for(let i=0;i<ANCHORS.length-1;i++){const a=ANCHORS[i],b=ANCHORS[i+1];if(value<=b){const t=Math.max(0,Math.min(1,(value-a)/(b-a)));mix[a]=Math.cos(t*Math.PI/2);mix[b]=Math.sin(t*Math.PI/2);return mix}}
  mix[100]=1;return mix
 }

 function initArCdRatio(selector='#arRatioExperience'){
  const root=document.querySelector(selector);if(!root)return null
  const q=s=>root.querySelector(s)
  const input=q('.wistia-ar__ratio-input'),current=q('.wistia-ar__ratio-current'),mood=q('[data-ratio-mood]'),stage=q('.wistia-ar__disc-stage'),ratioBox=q('.wistia-ar__ratio'),play=q('.wistia-ar__play'),seek=q('.wistia-ar__seek'),timeNow=q('[data-current-time]'),timeTotal=q('[data-duration]'),volume=q('.wistia-ar__volume'),error=q('.wistia-ar__error')
  const listeners=[],buffers={},loading={},failures={},sources={},gains={},aborter=new AbortController()
  let value=clamp(input?.value||70),ctx=null,master=null,isPlaying=false,pendingPlay=false,startedAt=0,offset=0,raf=0,muted=false,destroyed=false,observer=null
  const on=(node,event,handler,opts)=>{if(!node)return;node.addEventListener(event,handler,opts);listeners.push(()=>node.removeEventListener(event,handler,opts))}
  const sourceFor=ratio=>root.getAttribute('data-audio-'+ratio)||''
  const duration=()=>Math.max(0,...ANCHORS.map(r=>buffers[r]?.duration||0))
  const position=()=>isPlaying&&ctx?Math.min(duration(),ctx.currentTime-startedAt):offset
  const touched=()=>root.classList.add('is-touched')

  async function decode(data){const Offline=global.OfflineAudioContext||global.webkitOfflineAudioContext;if(Offline)return new Offline(1,1,48000).decodeAudioData(data);return ensureContext().decodeAudioData(data)}
  function load(ratio){
   if(buffers[ratio]||loading[ratio]||failures[ratio])return loading[ratio]
   root.classList.add('is-loading')
   loading[ratio]=fetch(sourceFor(ratio),{signal:aborter.signal}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.arrayBuffer()}).then(decode).then(buffer=>{
    if(destroyed)return;buffers[ratio]=buffer
    if(isPlaying)startSource(ratio,position())
    applyMix(true);progress()
    if(pendingPlay)begin()
   }).catch(e=>{if(e?.name==='AbortError')return;failures[ratio]=true;console.error('[WISTIA AR ratio]',e);if(!ANCHORS.some(r=>buffers[r])){pendingPlay=false;error.hidden=false;setPlaying(false)}}).finally(()=>{delete loading[ratio];if(!Object.keys(loading).length)root.classList.remove('is-loading')})
   return loading[ratio]
  }
  const loadAll=()=>{load(nearest(value));ANCHORS.forEach(load)}

  function ensureContext(){
   if(ctx)return ctx
   const Ctx=global.AudioContext||global.webkitAudioContext;ctx=new Ctx()
   master=ctx.createGain();master.gain.value=muted?0:1;master.connect(ctx.destination)
   ANCHORS.forEach(r=>{const g=ctx.createGain();g.gain.value=0;g.connect(master);gains[r]=g})
   applyMix(true);return ctx
  }
  function applyMix(immediate){
   if(!ctx)return
   const mix=mixFor(value),ready=ANCHORS.filter(r=>buffers[r])
   let targets={};ready.forEach(r=>{targets[r]=mix[r]})
   let power=Math.sqrt(ready.reduce((sum,r)=>sum+targets[r]*targets[r],0))
   if(power<.001&&ready.length){const fallback=ready.reduce((best,r)=>Math.abs(r-value)<Math.abs(best-value)?r:best,ready[0]);targets={[fallback]:1};power=1}
   ANCHORS.forEach(r=>{const next=power?(targets[r]||0)/power:0,g=gains[r].gain;g.cancelScheduledValues(ctx.currentTime);if(immediate)g.setValueAtTime(next,ctx.currentTime);else g.setTargetAtTime(next,ctx.currentTime,.06)})
  }
  function stopSource(ratio){const s=sources[ratio];if(!s)return;s.onended=null;try{s.stop()}catch{}s.disconnect();delete sources[ratio]}
  function startSource(ratio,at){if(!ctx||!buffers[ratio])return;stopSource(ratio);const s=ctx.createBufferSource();s.buffer=buffers[ratio];s.connect(gains[ratio]);s.start(0,Math.min(at,Math.max(0,buffers[ratio].duration-.01)));sources[ratio]=s}
  const stopAll=()=>ANCHORS.forEach(stopSource)
  function startAll(at){startedAt=ctx.currentTime-at;ANCHORS.forEach(r=>startSource(r,at))}

  function setPlaying(state){root.classList.toggle('is-playing',state);stage.classList.toggle('is-playing',state);play.setAttribute('aria-pressed',String(state));play.setAttribute('aria-label',state?'일시정지':'재생');stage.setAttribute('aria-label',state?'턴테이블 일시정지':'턴테이블 재생');stage.setAttribute('aria-pressed',String(state))}
  function progress(){const d=duration(),pos=position();timeNow.textContent=format(pos);timeTotal.textContent=format(d);seek.max=String(d||1);seek.value=String(pos);seek.style.setProperty('--wistia-progress',d?(pos/d*100)+'%':'0%')}
  function tick(){progress();if(!isPlaying)return;if(position()>=duration()-.02){stopAll();isPlaying=false;offset=0;setPlaying(false);progress();return}raf=requestAnimationFrame(tick)}
  function begin(){
   if(destroyed||!ctx||!ANCHORS.some(r=>buffers[r]))return
   pendingPlay=false;play.removeAttribute('aria-busy')
   global.wistiaClaimPlayback?.('ar-ratio')
   const at=offset>=duration()-.05?0:offset
   startAll(at);applyMix(true);isPlaying=true;setPlaying(true);cancelAnimationFrame(raf);tick()
  }
  async function start(){
   error.hidden=true;touched()
   const c=ensureContext()
   try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch{}
   if(c.state==='suspended'){try{await c.resume()}catch{}}
   if(destroyed)return
   loadAll()
   if(!ANCHORS.some(r=>buffers[r])){pendingPlay=true;play.setAttribute('aria-busy','true');setPlaying(true);return}
   begin()
  }
  function pause(){
   const wasPending=pendingPlay;pendingPlay=false;play.removeAttribute('aria-busy')
   if(isPlaying){offset=position();stopAll();isPlaying=false}
   if(isPlaying||wasPending||root.classList.contains('is-playing'))setPlaying(false)
   cancelAnimationFrame(raf);progress()
  }
  const togglePlay=()=>{if(isPlaying||pendingPlay)pause();else start()}

  function render(){const moodText=moodFor(value),percent=(value-30)/70*100,tone=nearest(value);root.style.setProperty('--wistia-ratio-progress',percent);root.dataset.ratio=String(value);root.dataset.tone=String(tone);input.value=String(value);input.setAttribute('aria-valuetext',value+'% '+moodText);current.textContent=value+'%';mood.textContent=moodText;root.querySelectorAll('.wistia-ar__ratio-marks span').forEach(node=>node.classList.toggle('is-active',Number(node.dataset.value)===tone))}
  // 비율이 바뀌어도 재생은 멈추지 않는다 — 음원 간 볼륨만 부드럽게 넘어간다
  function setValue(next){touched();const selected=clamp(next);if(selected===value)return;value=selected;render();applyMix(false);if(ctx)loadAll();else load(nearest(value))}
  function onWheel(event){const delta=Math.abs(event.deltaY)>=Math.abs(event.deltaX)?event.deltaY:event.deltaX,direction=Math.sign(delta);if(!direction)return;const next=value+(direction>0?1:-1);if(next<30||next>100)return;event.preventDefault();setValue(next)}

  on(input,'input',event=>setValue(event.target.value))
  // 턴테이블은 재생 버튼 역할만 한다, 소리 비율은 비율 바(드래그·클릭·휠·키보드)에서만 바뀐다
  on(stage,'click',togglePlay)
  on(stage,'keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();togglePlay()}})
  on(ratioBox,'wheel',onWheel,{passive:false})
  on(input,'pointerdown',touched);on(input,'focus',touched)
  on(play,'click',togglePlay)
  on(volume,'click',()=>{muted=!muted;if(master&&ctx)master.gain.setTargetAtTime(muted?0:1,ctx.currentTime,.03);volume.classList.toggle('is-muted',muted);volume.setAttribute('aria-pressed',String(muted));volume.setAttribute('aria-label',muted?'음소거 해제':'음소거')})
  on(seek,'input',()=>{const d=duration();if(!d)return;offset=Math.max(0,Math.min(d,Number(seek.value)));if(isPlaying){stopAll();startAll(offset);applyMix(true)}progress()})

  // 섹션이 보이기 시작하면 현재 비율 음원 하나만 미리 받아 재생 대기 시간을 줄인다
  if('IntersectionObserver' in global){observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){load(nearest(value));observer.disconnect();observer=null}},{rootMargin:'300px 0px'});observer.observe(root)}else load(nearest(value))

  render();progress()
  return{
   select:ratio=>setValue(ratio),getSelected:()=>value,pause,
   destroy(){destroyed=true;observer?.disconnect();aborter.abort();cancelAnimationFrame(raf);stopAll();isPlaying=false;listeners.splice(0).forEach(fn=>fn());if(ctx&&ctx.state!=='closed')ctx.close().catch(()=>{})}
  }
 }
 global.initArCdRatio=initArCdRatio
})(window)
