(function(global){
  const END=85.4
  const CUTS=[39,45.2,50,54.8,59.2,64.4,69.2,71.6,77.6,80.2,85.4]
  const FADE=.06
  const SEQUENCE=[]
  let sequenceDuration=0
  CUTS.slice(0,-1).forEach((start,index)=>{
    const duration=CUTS[index+1]-start
    for(const kind of ['before','after']){
      SEQUENCE.push({start,duration,kind,phrase:index+1,offset:sequenceDuration})
      sequenceDuration+=duration
    }
  })
  const DURATION=sequenceDuration

  function initWistiaHomeHighlight(){
    const root=document.querySelector('#homeVocalHighlight')
    if(!root)return null
    const button=root.querySelector('.finder-home-highlight-play')
    const icon=button.querySelector('span')
    const label=button.querySelector('b')
    const now=root.querySelector('.finder-home-highlight-now')
    const time=root.querySelector('.finder-home-highlight-time')
    const progress=root.querySelector('.finder-home-highlight-progress span')
    const error=root.querySelector('.finder-home-highlight-error')
    const modeLabels=[...root.querySelectorAll('.finder-home-highlight-modes span')]
    const controller=new AbortController()
    let context=null,buffers=null,loadPromise=null,sources=[],state='idle',elapsed=0,startAt=0,frame=0,request=0,destroyed=false,lastMode=''

    const format=seconds=>Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0')
    const current=()=>state==='playing'&&context?Math.max(0,Math.min(DURATION,context.currentTime-startAt)):elapsed
    function update(){
      const seconds=current()
      const segment=SEQUENCE.find(item=>seconds<item.offset+item.duration)||SEQUENCE[SEQUENCE.length-1]
      const mode=state==='playing'||state==='paused'?segment.kind:''
      const status=state+'-'+segment.phrase+'-'+mode
      if(status!==lastMode){
        lastMode=status
        root.dataset.mode=mode
        root.dataset.phrase=String(segment.phrase)
        modeLabels.forEach(item=>item.classList.toggle('is-active',item.dataset.kind===mode))
        now.textContent=state==='playing'?segment.phrase+'번째 구절 · 보정 '+(mode==='before'?'전':'후')+' 재생 중':state==='paused'?segment.phrase+'번째 구절에서 일시정지':state==='loading'?'음원을 준비하고 있습니다':'재생 버튼을 눌러 비교해 보세요'
      }
      root.dataset.position=String(seconds)
      root.dataset.playbackState=state
      progress.style.width=(seconds/DURATION*100)+'%'
      time.textContent=format(seconds)+' / '+format(DURATION)
      button.setAttribute('aria-label',state==='playing'?'보컬 보정 전후 하이라이트 일시정지':'보컬 보정 전후 하이라이트 재생')
      button.setAttribute('aria-busy',String(state==='loading'))
      button.disabled=state==='loading'
      icon.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">'+(state==='playing'?'<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>':'<path d="m7 4 14 8-14 8Z"/>')+'</svg>'
      label.textContent=state==='playing'?'일시정지':state==='loading'?'준비 중':'비교 재생'
    }
    function stopSources(){
      sources.forEach(source=>{source.onended=null;try{source.stop()}catch{}source.disconnect()})
      sources=[]
    }
    function reset(){
      cancelAnimationFrame(frame);frame=0
      stopSources();state='idle';elapsed=0;lastMode='';update()
    }
    function tick(){
      if(destroyed||state!=='playing')return
      if(current()>=DURATION-.03){reset();return}
      update();frame=requestAnimationFrame(tick)
    }
    async function load(){
      if(buffers)return buffers
      if(!loadPromise)loadPromise=Promise.all(['before','after'].map(async kind=>{
        const response=await fetch('assets/audio/before-after/'+kind+'.mp3?v=174',{signal:controller.signal})
        if(!response.ok)throw new Error('HTTP '+response.status)
        return context.decodeAudioData(await response.arrayBuffer())
      })).then(result=>{
        if(result.some(buffer=>buffer.duration<END))throw new Error('Highlight exceeds audio duration')
        buffers=result
        return result
      }).catch(problem=>{loadPromise=null;throw problem})
      return loadPromise
    }
    function schedule(){
      stopSources()
      startAt=context.currentTime+.04
      SEQUENCE.forEach(segment=>{
        const source=context.createBufferSource()
        const gain=context.createGain()
        const at=startAt+segment.offset
        const fade=Math.min(FADE,segment.duration/4)
        source.buffer=buffers[segment.kind==='before'?0:1]
        source.connect(gain).connect(context.destination)
        gain.gain.setValueAtTime(0,at)
        gain.gain.linearRampToValueAtTime(1,at+fade)
        gain.gain.setValueAtTime(1,at+segment.duration-fade)
        gain.gain.linearRampToValueAtTime(0,at+segment.duration)
        source.start(at,segment.start,segment.duration)
        sources.push(source)
      })
      sources[sources.length-1].onended=()=>{if(state==='playing')reset()}
      elapsed=0
      state='playing'
      update()
      frame=requestAnimationFrame(tick)
    }
    async function play(){
      if(destroyed||state==='loading')return
      const token=++request
      error.hidden=true
      try{
        context ||= new (global.AudioContext||global.webkitAudioContext)()
        const resumed=context.resume()
        if(state==='paused'){
          await resumed
          if(destroyed||token!==request)return
          global.wistiaClaimPlayback?.('home-highlight')
          state='playing';update();frame=requestAnimationFrame(tick);return
        }
        state='loading';lastMode='';update()
        await resumed
        await load()
        if(destroyed||token!==request)return
        global.wistiaClaimPlayback?.('home-highlight')
        schedule()
      }catch(problem){
        if(destroyed||token!==request)return
        console.error('[WISTIA Home Highlight]',problem)
        reset();error.hidden=false
      }
    }
    function pause(){
      if(state==='loading'){request++;state='idle';lastMode='';update();return}
      if(state!=='playing')return
      elapsed=current();state='paused';cancelAnimationFrame(frame);frame=0
      context?.suspend();lastMode='';update()
    }
    button.addEventListener('click',()=>state==='playing'?pause():play(),{signal:controller.signal})
    update()
    return{play,pause,destroy(){destroyed=true;request++;controller.abort();cancelAnimationFrame(frame);stopSources();context?.close();context=null}}
  }
  global.initWistiaHomeHighlight=initWistiaHomeHighlight
})(window)
