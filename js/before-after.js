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
    const badgeText=badge.querySelector('b')
    const playBtn=root.querySelector('.bap-play')
    const playGlyph=playBtn.querySelector('.bap-play-icon')
    const playLabel=playBtn.querySelector('.bap-play-label')
    const timeNow=root.querySelector('.bap-time b')
    const timeAll=root.querySelector('.bap-time span')
    const canvas=root.querySelector('.bap-wave')
    const errorEl=root.querySelector('.bap-error')
    const status={before:'VOCAL 원본',after:'VOCAL 노이즈 제거 · 보컬튜닝 · 보컬믹싱 · 마스터링'}
    const buffers={before:null,after:null},peakSets={before:null,after:null},failures={before:false,after:false}
    const controller=new AbortController()
    const signal=controller.signal
    let mode='before',audioCtx=null,source=null,isPlaying=false,pendingPlay=false,startedAt=0,pausedAt=0,raf=0,destroyed=false
    const fmt=value=>{const time=Number.isFinite(value)?value:0;return Math.floor(time/60)+':'+String(Math.floor(time%60)).padStart(2,'0')}
    const activeBuffer=()=>buffers[mode]
    const activePeaks=()=>peakSets[mode]
    const duration=()=>activeBuffer()?.duration||0
    const position=()=>isPlaying&&audioCtx?Math.min(pausedAt+(audioCtx.currentTime-startedAt),duration()):pausedAt
    const ensureContext=()=>audioCtx||(audioCtx=new (global.AudioContext||global.webkitAudioContext)())
    function stopSource(){if(!source)return;source.onended=null;try{source.stop()}catch{}source.disconnect();source=null}
    function sync(){
      const current=position()
      root.dataset.position=String(current)
      root.classList.toggle('is-playing',isPlaying)
      timeNow.textContent=fmt(current);timeAll.textContent=fmt(duration())
      playGlyph.textContent=isPlaying?'Ⅱ':'▶';playLabel.textContent=isPlaying?'일시정지':'재생';playBtn.setAttribute('aria-label',isPlaying?'일시정지':'재생')
      draw()
    }
    function start(offset){
      const buffer=activeBuffer();if(!buffer||!audioCtx)return false
      stopSource();source=audioCtx.createBufferSource();source.buffer=buffer;source.connect(audioCtx.destination)
      pausedAt=Math.max(0,Math.min(offset,Math.max(0,buffer.duration-.02)));startedAt=audioCtx.currentTime
      source.start(0,pausedAt);source.onended=()=>{source=null;isPlaying=false;pausedAt=0;sync()};return true
    }
    async function play(){
      if(failures[mode]){errorEl.hidden=false;return}
      const context=ensureContext();if(context.state==='suspended')await context.resume()
      if(destroyed)return
      if(!activeBuffer()){pendingPlay=true;playBtn.setAttribute('aria-busy','true');return}
      pendingPlay=false
      if(start(pausedAt>=duration()?0:pausedAt)){isPlaying=true;sync()}
    }
    function pause(){pendingPlay=false;pausedAt=position();stopSource();isPlaying=false;sync()}
    function activate(next){
      if(!['before','after'].includes(next)||next===mode)return
      const current=position(),resume=isPlaying
      stopSource();isPlaying=false;mode=next;pausedAt=Math.min(current,duration()||current)
      tabs.forEach(tab=>{const active=tab.dataset.mode===mode;tab.classList.toggle('active',active);tab.setAttribute('aria-pressed',String(active))})
      badge.className='bap-badge mode-'+mode;badgeText.textContent=status[mode]
      playBtn.className='bap-play mode-'+mode;errorEl.hidden=!failures[mode]
      if(resume&&activeBuffer())play();else sync()
    }
    playBtn.addEventListener('click',()=>isPlaying?pause():play(),{signal})
    tabs.forEach(tab=>tab.addEventListener('click',()=>activate(tab.dataset.mode),{signal}))
    switchBtn.addEventListener('click',()=>activate(mode==='before'?'after':'before'),{signal})
    function makePeaks(buffer,count=120){
      const data=buffer.getChannelData(0),size=Math.max(1,Math.floor(data.length/count)),result=[]
      for(let i=0;i<count;i++){let sum=0;for(let j=0;j<size;j++)sum+=Math.abs(data[i*size+j]||0);result.push(sum/size)}
      const max=Math.max(...result,.0001);return result.map(value=>value/max)
    }
    const fallback=()=>Array.from({length:72},(_,index)=>.22+Math.abs(Math.sin(index*.71))*.65)
    function draw(){
      const context=canvas.getContext('2d'),width=canvas.width,height=canvas.height,peaks=activePeaks()||fallback(),progress=duration()?position()/duration():0
      context.clearRect(0,0,width,height);const gap=width/peaks.length,barWidth=gap*.55
      peaks.forEach((peak,index)=>{const barHeight=Math.max(height*.12,peak*height*.82);context.fillStyle=index/peaks.length<progress?(mode==='before'?'#777d80':'#202324'):'#dfe1e2';context.fillRect(index*gap+(gap-barWidth)/2,(height-barHeight)/2,barWidth,barHeight)})
    }
    function resize(){const rect=canvas.getBoundingClientRect(),dpr=global.devicePixelRatio||1;canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));draw()}
    canvas.addEventListener('click',event=>{if(!duration())return;const rect=canvas.getBoundingClientRect(),next=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width))*duration();if(isPlaying)start(next);else pausedAt=next;sync()},{signal})
    async function decode(arrayBuffer){const Offline=global.OfflineAudioContext||global.webkitOfflineAudioContext;if(Offline)return new Offline(1,1,44100).decodeAudioData(arrayBuffer);const context=ensureContext();return context.decodeAudioData(arrayBuffer)}
    async function load(kind,src){
      try{const response=await fetch(src,{signal});if(!response.ok)throw new Error('HTTP '+response.status);const buffer=await decode(await response.arrayBuffer());if(destroyed)return;buffers[kind]=buffer;peakSets[kind]=makePeaks(buffer);failures[kind]=false}
      catch(error){if(error.name==='AbortError')return;failures[kind]=true;console.error('[WISTIA Before/After]',error)}
      if(kind===mode){playBtn.removeAttribute('aria-busy');errorEl.hidden=!failures[kind];if(pendingPlay&&audioCtx&&audioCtx.state==='running'&&start(pausedAt)){pendingPlay=false;isPlaying=true}sync()}
      if(buffers.before||buffers.after)root.classList.remove('is-loading')
    }
    root.classList.add('is-loading');playBtn.setAttribute('aria-busy','true')
    load('before',beforeSrc);load('after',afterSrc);resize()
    global.addEventListener('resize',resize,{signal})
    const tick=()=>{if(destroyed)return;sync();raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)
    return{setMode:activate,play,pause,destroy(){destroyed=true;controller.abort();cancelAnimationFrame(raf);stopSource();isPlaying=false;audioCtx?.close();audioCtx=null}}
  }
  global.initWistiaBeforeAfter=initWistiaBeforeAfter
})(window)
