(function(global){
  function initWistiaBeforeAfter(options){
    const opts=options||{}
    const root=document.querySelector(opts.root||'#wistiaBeforeAfter')
    if(!root)return null
    const assetUrl=source=>{const url=new URL(source,document.baseURI);url.searchParams.set('v','174');return url.href}
    const beforeSrc=assetUrl(opts.beforeSrc||root.dataset.beforeSrc||'assets/audio/before-after/before.mp3')
    const afterSrc=assetUrl(opts.afterSrc||root.dataset.afterSrc||'assets/audio/before-after/after.mp3')
    const tabs=[...root.querySelectorAll('.bap-tab')]
    const switchBtn=root.querySelector('.bap-switch')
    const badge=root.querySelector('.bap-badge')
    const playBtn=root.querySelector('.bap-play')
    const playLabel=playBtn.querySelector('.bap-play-label')
    const timeNow=root.querySelector('.bap-time b')
    const timeAll=root.querySelector('.bap-time span')
    const canvas=root.querySelector('.bap-wave')
    const waveStyle=typeof getComputedStyle==='function'?getComputedStyle(root):null
    const waveColors={before:waveStyle?.getPropertyValue('--ba-wave-before').trim()||'#777d80',after:waveStyle?.getPropertyValue('--ba-wave-after').trim()||'#202324',rest:waveStyle?.getPropertyValue('--ba-wave-rest').trim()||'#dfe1e2'}
    const errorEl=root.querySelector('.bap-error')
    const buffers={before:null,after:null},failures={before:false,after:false}
    // Both recordings share a timeline; keep one reference shape when switching audio.
    // Precomputed from before.mp3 (same makePeaks over OfflineAudioContext 44.1kHz decode) so the waveform and
    // total time render identically before any audio is downloaded. Audio itself is fetched on first play.
    const PRESET=/assets\/audio\/before-after\/before\.mp3/.test(beforeSrc)?{duration:85.46496598639456,peaks:[0.01067,0.01668,0.03344,0.07711,0.35485,1,0.68599,0.34897,0.84142,0.88926,0.6063,0.65419,0.89246,0.26658,0.33007,0.88982,0.88419,0.65944,0.39026,0.71435,0.19378,0.30569,0.80345,0.27364,0.95554,0.78825,0.77742,0.48147,0.09599,0.1304,0.14886,0.77699,0.7494,0.74349,0.53568,0.86325,0.83261,0.63178,0.92431,0.86786,0.44669,0.78198,0.81109,0.858,0.70527,0.34207,0.96456,0.28466,0.22529,0.83391,0.38419,0.90168,0.80484,0.73883,0.61383,0.16032,0.73732,0.93703,0.87494,0.85189,0.87219,0.79663,0.59246,0.47097,0.8564,0.78997,0.82177,0.78054,0.68255,0.80054,0.53512,0.9225,0.72382,0.60068,0.90515,0.69774,0.85661,0.68918,0.65979,0.72774,0.90346,0.81999,0.78811,0.63608,0.7451,0.86195,0.7749,0.86449,0.8194,0.93467,0.51243,0.77748,0.80578,0.74178,0.98065,0.89835,0.76332,0.57223,0.7451,0.77379,0.54875,0.86369,0.78904,0.98969,0.56977,0.88661,0.68974,0.8547,0.84662,0.69556,0.72926,0.86391,0.55277,0.29796,0.34875,0.31824,0.15887,0.15628,0.1325,0.03156]}:null
    let sharedPeaks=PRESET?PRESET.peaks:null
    const loads={}
    const controller=new AbortController()
    const signal=controller.signal
    // The mobile floating contact panel must never cover this player's controls.
    const playerObserver=global.IntersectionObserver?new global.IntersectionObserver(entries=>{
      if(!destroyed)document.body.classList.toggle('is-vocal-comparison-visible',entries.some(entry=>entry.isIntersecting))
    },{threshold:0}):null
    let mode='before',audioCtx=null,source=null,isPlaying=false,pendingPlay=false,startedAt=0,pausedAt=0,raf=0,destroyed=false,playRequest=0
    playerObserver?.observe(root.querySelector('.bap-player'))
    const fmt=value=>{const time=Number.isFinite(value)?value:0;return Math.floor(time/60)+':'+String(Math.floor(time%60)).padStart(2,'0')}
    const activeBuffer=()=>buffers[mode]
    const activePeaks=()=>sharedPeaks
    const duration=()=>activeBuffer()?.duration||PRESET?.duration||0
    const position=()=>isPlaying&&audioCtx?Math.min(pausedAt+(audioCtx.currentTime-startedAt),duration()):pausedAt
    const ensureContext=()=>audioCtx||(audioCtx=new (global.AudioContext||global.webkitAudioContext)())
    function stopSource(){if(!source)return;source.onended=null;try{source.stop()}catch{}source.disconnect();source=null}
    function sync(){
      const current=position()
      root.dataset.position=String(current)
      root.classList.toggle('is-playing',isPlaying)
      timeNow.textContent=fmt(current);timeAll.textContent=fmt(duration())
      // Keep the inline SVG pair intact; CSS follows the actual playback state.
      playLabel.textContent=isPlaying?'일시정지':'재생';playBtn.setAttribute('aria-label',isPlaying?'일시정지':'재생');playBtn.setAttribute('aria-pressed',String(isPlaying))
      switchBtn.setAttribute('aria-label',mode==='before'?'보정 후로 전환하여 듣기':'보정 전으로 전환하여 듣기')
      draw()
    }
    function start(offset){
      const buffer=activeBuffer();if(!buffer||!audioCtx)return false
      stopSource();source=audioCtx.createBufferSource();source.buffer=buffer;source.connect(audioCtx.destination)
      pausedAt=Math.max(0,Math.min(offset,Math.max(0,buffer.duration-.02)));startedAt=audioCtx.currentTime
      source.start(0,pausedAt);source.onended=()=>{source=null;isPlaying=false;pausedAt=0;sync()};return true
    }
    async function play(){
      const request=++playRequest
      if(failures[mode]){errorEl.hidden=false;return}
      if(!activeBuffer())loadAll()
      const context=ensureContext();if(context.state==='suspended')await context.resume()
      if(destroyed||request!==playRequest)return
      if(!activeBuffer()){pendingPlay=true;playBtn.setAttribute('aria-busy','true');loadAll();return}
      pendingPlay=false
      global.wistiaClaimPlayback?.('before-after')
      if(start(pausedAt>=duration()?0:pausedAt)){isPlaying=true;sync()}
    }
    function pause(){playRequest++;pendingPlay=false;pausedAt=position();stopSource();isPlaying=false;sync()}
    function activate(next,autoPlay=false){
      if(!['before','after'].includes(next))return
      if(next===mode){if(autoPlay&&!isPlaying&&!pendingPlay)play();return}
      const current=position(),resume=isPlaying
      stopSource();isPlaying=false;mode=next;pausedAt=Math.min(current,duration()||current)
      tabs.forEach(tab=>{const active=tab.dataset.mode===mode;tab.classList.toggle('active',active);tab.setAttribute('aria-pressed',String(active))})
      // The fixed comparison caption and its emphasis survive mode changes.
      badge.className='bap-badge mode-'+mode
      playBtn.className='bap-play mode-'+mode;errorEl.hidden=!failures[mode]
      sync()
      if(resume||autoPlay||pendingPlay)play()
    }
    playBtn.addEventListener('click',()=>isPlaying?pause():play(),{signal})
    tabs.forEach(tab=>tab.addEventListener('click',()=>activate(tab.dataset.mode,true),{signal}))
    switchBtn.addEventListener('click',()=>activate(mode==='before'?'after':'before',true),{signal})
    function makePeaks(buffer,count=120){
      const data=buffer.getChannelData(0),size=Math.max(1,Math.floor(data.length/count)),result=[]
      for(let i=0;i<count;i++){let sum=0;for(let j=0;j<size;j++)sum+=Math.abs(data[i*size+j]||0);result.push(sum/size)}
      const max=Math.max(...result,.0001);return result.map(value=>value/max)
    }
    const fallback=()=>Array.from({length:72},(_,index)=>.22+Math.abs(Math.sin(index*.71))*.65)
    function draw(){
      const context=canvas.getContext('2d'),width=canvas.width,height=canvas.height,peaks=activePeaks()||fallback(),progress=duration()?position()/duration():0
      context.clearRect(0,0,width,height);const gap=width/peaks.length,barWidth=gap*.55
      peaks.forEach((peak,index)=>{const barHeight=Math.max(height*.12,peak*height*.82);context.fillStyle=index/peaks.length<progress?waveColors[mode]:waveColors.rest;context.fillRect(index*gap+(gap-barWidth)/2,(height-barHeight)/2,barWidth,barHeight)})
    }
    function resize(){const rect=canvas.getBoundingClientRect(),dpr=global.devicePixelRatio||1;canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));draw()}
    canvas.addEventListener('click',event=>{if(!duration())return;const rect=canvas.getBoundingClientRect(),next=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width))*duration();if(isPlaying)start(next);else pausedAt=next;sync()},{signal})
    async function decode(arrayBuffer){const Offline=global.OfflineAudioContext||global.webkitOfflineAudioContext;if(Offline)return new Offline(1,1,44100).decodeAudioData(arrayBuffer);const context=ensureContext();return context.decodeAudioData(arrayBuffer)}
    function loadAll(){const first=mode,other=mode==='before'?'after':'before';load(first);load(other)}
    function load(kind){if(!loads[kind]||failures[kind])loads[kind]=loadNow(kind,kind==='before'?beforeSrc:afterSrc);return loads[kind]}
    async function loadNow(kind,src){
      try{const response=await fetch(src,{signal});if(!response.ok)throw new Error('HTTP '+response.status);const buffer=await decode(await response.arrayBuffer());if(destroyed)return;buffers[kind]=buffer;if(kind==='before'&&!PRESET)sharedPeaks=makePeaks(buffer);failures[kind]=false}
      catch(error){if(destroyed||signal.aborted||error.name==='AbortError')return;failures[kind]=true;console.error('[WISTIA Before/After]',error)}
      if(kind===mode){playBtn.removeAttribute('aria-busy');errorEl.hidden=!failures[kind];if(pendingPlay&&audioCtx&&audioCtx.state==='running'){global.wistiaClaimPlayback?.('before-after');if(start(pausedAt)){pendingPlay=false;isPlaying=true}}sync()}
      if(buffers.before||buffers.after)root.classList.remove('is-loading')
    }
    if(!PRESET){root.classList.add('is-loading');playBtn.setAttribute('aria-busy','true');load('before');load('after')}
    resize()
    global.addEventListener('resize',resize,{signal})
    const tick=()=>{if(destroyed)return;sync();raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)
    return{setMode:activate,play,pause,destroy(){destroyed=true;playerObserver?.disconnect();document.body.classList.remove('is-vocal-comparison-visible');controller.abort();cancelAnimationFrame(raf);stopSource();isPlaying=false;audioCtx?.close();audioCtx=null}}
  }
  global.initWistiaBeforeAfter=initWistiaBeforeAfter
})(window)
