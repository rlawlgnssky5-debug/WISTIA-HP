/* Progressive enhancement only, no tracking or consultation side effects */
(() => {
 let cleanups=[],generation=0,libraries,preference=null
 try{preference=window.localStorage?.getItem('wistia-studio-motion')||null}catch{}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)')
 const limited=()=>preference==='off'||(reduced.matches&&preference!=='on')
 const listen=(el,type,fn,options)=>{el.addEventListener(type,fn,options);cleanups.push(()=>el.removeEventListener(type,fn,options))}
 function destroy(){generation++;cleanups.splice(0).reverse().forEach(fn=>fn())}
 function dependencies(){
  if(!libraries)libraries=(async()=>{
   const load=src=>new Promise(resolve=>{const script=document.createElement('script');script.src=src;script.onload=()=>resolve(true);script.onerror=()=>resolve(false);document.head.append(script)})
   if(!window.gsap)await load('/js/vendor/gsap.min.js')
   await Promise.all([window.ScrollTrigger||load('/js/vendor/ScrollTrigger.min.js'),window.Lenis||load('/js/vendor/lenis.min.js')])
  })()
  return libraries
 }
 function carousel(){
  document.querySelectorAll('[data-case-carousel]').forEach(track=>{
   const cards=[...track.children],counter=document.querySelector('[data-case-count]')
   if(cards.length<2)return
   const clones=[]
   for(let group=0;group<2;group++)cards.forEach(card=>{const clone=card.cloneNode(true);clone.dataset.caseClone='true';track.append(clone);clones.push(clone)})
   track.classList.add('is-auto-loop')
   let frame=0,last=0,position=0,start=null,dragged=false,holdUntil=0,visible=true,cycle=0
   const measure=()=>{cycle=clones[0].offsetLeft-cards[0].offsetLeft;if(!position&&cycle){position=cycle;track.scrollLeft=position}}
   const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0},{rootMargin:'40px'}):null
   observer?.observe(track)
   const index=()=>{const local=((track.scrollLeft%cycle)+cycle)%cycle;return cards.reduce((best,card,i)=>Math.abs(card.offsetLeft-cards[0].offsetLeft-local)<Math.abs(cards[best].offsetLeft-cards[0].offsetLeft-local)?i:best,0)}
   const move=delta=>{if(!cycle)return;holdUntil=performance.now()+2200;const next=(index()+delta+cards.length)%cards.length;position=cycle+cards[next].offsetLeft-cards[0].offsetLeft;track.scrollTo({left:position,behavior:limited()?'instant':'smooth'})}
   const prev=document.querySelector('[data-case-prev]'),next=document.querySelector('[data-case-next]')
   if(prev)listen(prev,'click',()=>move(-1));if(next)listen(next,'click',()=>move(1))
   listen(track,'keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}})
   listen(track,'pointerdown',event=>{holdUntil=performance.now()+2500;if(event.pointerType!=='mouse'||event.button!==0)return;start={x:event.clientX,left:track.scrollLeft};dragged=false})
   listen(window,'pointermove',event=>{if(!start)return;const delta=event.clientX-start.x;if(Math.abs(delta)>6){dragged=true;track.classList.add('is-dragging');track.scrollLeft=start.left-delta;position=track.scrollLeft;event.preventDefault()}},{passive:false})
   listen(window,'pointerup',()=>{start=null;holdUntil=performance.now()+1800;track.classList.remove('is-dragging')})
   listen(track,'dragstart',event=>event.preventDefault())
   listen(track,'click',event=>{if(dragged){event.preventDefault();event.stopPropagation();dragged=false}},true)
   listen(track,'wheel',()=>{holdUntil=performance.now()+2500},{passive:true})
   listen(track,'focusin',()=>{holdUntil=performance.now()+2500})
   listen(window,'resize',measure)
   const tick=now=>{
    measure()
    const paused=!visible||document.hidden||start||now<holdUntil||track.dataset.casePlaying==='true'||document.querySelector('dialog[open]')||document.body.classList.contains('menu-open')||(track.contains(document.activeElement)&&document.activeElement.matches(':focus-visible'))
    if(cycle&&!paused){position+=Math.min(now-last||0,50)*(limited()?.009:.026);if(position>=cycle*2)position-=cycle;if(position<cycle)position+=cycle;track.scrollLeft=position}else position=track.scrollLeft
    last=now
    if(counter&&cycle)counter.textContent=String(index()+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0')
    frame=requestAnimationFrame(tick)
   }
   measure();frame=requestAnimationFrame(tick)
   cleanups.push(()=>{cancelAnimationFrame(frame);observer?.disconnect();clones.forEach(clone=>clone.remove());track.classList.remove('is-auto-loop');delete track.dataset.casePlaying})
  })
 }
 function processCards(){
  const cards=[...document.querySelectorAll('.story-process-card')]
  if(!cards.length||limited())return
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}}),{threshold:.15}):null
  cards.forEach((card,i)=>{card.style.setProperty('--card-delay',(i%2)*.1+'s');observer?.observe(card)})
  cleanups.push(()=>{observer?.disconnect();cards.forEach(card=>{card.classList.remove('is-revealed');card.style.removeProperty('--card-delay')})})
 }
 function processFolders(){
  document.querySelectorAll('.story-process-folder').forEach(folder=>{
   const summary=folder.querySelector('summary'),content=folder.querySelector('.process-folder-content')
   if(!summary||!content||typeof content.animate!=='function'||limited())return
   let targetOpen=folder.open,animation=null,revision=0
   const clear=()=>{content.style.removeProperty('height');content.style.removeProperty('overflow');content.inert=false;delete folder.dataset.folderMotion}
   listen(summary,'click',event=>{
    event.preventDefault();targetOpen=!targetOpen;const token=++revision
    const start=folder.open?content.getBoundingClientRect().height:0
    animation?.cancel();folder.open=true;content.style.height='auto'
    const end=targetOpen?content.scrollHeight:0
    content.style.overflow='hidden';content.inert=!targetOpen
    folder.dataset.folderMotion=targetOpen?'opening':'closing'
    animation=content.animate([{height:start+'px',opacity:start?1:0},{height:end+'px',opacity:targetOpen?1:0}],{duration:targetOpen?620:300,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})
    animation.finished.then(()=>{if(token!==revision)return;folder.open=targetOpen;animation.cancel();animation=null;clear()},()=>{})
   })
   cleanups.push(()=>{revision++;animation?.cancel();clear()})
  })
 }
 function depth(){
  const scenes=[...document.querySelectorAll('.studio-scene')],cards=[...document.querySelectorAll('.we-service figure,.we-case figure,.we-craft-grid>figure,.arc-product-media,.wistia-location-address,.wistia-specialist-grid article')]
  if(!scenes.length&&!cards.length)return
  let frame=0
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-in-view',entry.isIntersecting)),{rootMargin:'40px'}):null
  scenes.forEach(scene=>{if(observer)observer.observe(scene);else scene.classList.add('is-in-view')})
  if(observer)cleanups.push(()=>observer.disconnect())
  cards.forEach(card=>{
   card.classList.add('studio-depth-card')
   if(!desktop.matches)return
   listen(card,'pointermove',event=>{const rect=card.getBoundingClientRect();card.style.setProperty('--card-x',((.5-(event.clientY-rect.top)/rect.height)*7).toFixed(2)+'deg');card.style.setProperty('--card-y',(((event.clientX-rect.left)/rect.width-.5)*9).toFixed(2)+'deg');card.classList.add('is-pointed')},{passive:true})
   listen(card,'pointerleave',()=>{card.style.setProperty('--card-x','0deg');card.style.setProperty('--card-y','0deg');card.classList.remove('is-pointed')})
  })
  scenes.forEach(scene=>{
   if(!desktop.matches)return
   listen(scene,'pointermove',event=>{const rect=scene.getBoundingClientRect();scene.style.setProperty('--tilt-x',((.5-(event.clientY-rect.top)/rect.height)*16).toFixed(2)+'deg');scene.style.setProperty('--tilt-y',(((event.clientX-rect.left)/rect.width-.5)*22).toFixed(2)+'deg')},{passive:true})
   listen(scene,'pointerleave',()=>{scene.style.setProperty('--tilt-x','0deg');scene.style.setProperty('--tilt-y','0deg')})
  })
  const update=()=>{frame=0;scenes.forEach(scene=>{if(!scene.classList.contains('is-in-view'))return;const rect=scene.getBoundingClientRect(),progress=Math.max(-1,Math.min(1,(innerHeight/2-rect.top-rect.height/2)/innerHeight));scene.style.setProperty('--scroll-turn',(progress*(desktop.matches?24:10)).toFixed(2)+'deg')})}
  listen(window,'scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true})
  cleanups.push(()=>{cancelAnimationFrame(frame);scenes.forEach(scene=>{scene.classList.remove('is-in-view');['--tilt-x','--tilt-y','--scroll-turn'].forEach(name=>scene.style.removeProperty(name))});cards.forEach(card=>{card.classList.remove('studio-depth-card','is-pointed');['--card-x','--card-y'].forEach(name=>card.style.removeProperty(name))})})
 }
 function cursor(){
  const pill=document.createElement('span');pill.className='wistia-cursor';pill.setAttribute('aria-hidden','true');document.body.append(pill);let frame=0,x=0,y=0
  listen(document,'pointermove',event=>{
   const area=event.target.closest('[data-cursor],.arc-product-media,.bap-player,a[href*="/event/"],#floatingPrice')
   const visible=area&&!document.body.classList.contains('menu-open')&&!document.querySelector('dialog[open]')
   pill.classList.toggle('is-visible',Boolean(visible))
   if(!visible)return
   pill.textContent=area.dataset.cursor||(area.matches('a')?'빠른 견적':'재생');x=Math.min(event.clientX+18,innerWidth-105);y=Math.min(event.clientY+18,innerHeight-45)
   if(!frame)frame=requestAnimationFrame(()=>{frame=0;pill.style.transform=`translate3d(${x}px,${y}px,0)`})
  },{passive:true})
  listen(document,'pointerleave',()=>pill.classList.remove('is-visible'))
  cleanups.push(()=>{cancelAnimationFrame(frame);pill.remove()})
 }
 async function enhance(token){
  await dependencies();if(token!==generation||limited())return
  const {gsap,ScrollTrigger,Lenis}=window;if(!gsap||!ScrollTrigger)return
  gsap.registerPlugin(ScrollTrigger)
  const media=gsap.matchMedia();cleanups.push(()=>media.revert())
  media.add({desktop:'(min-width: 901px) and (hover: hover) and (pointer: fine)',reduced:'(prefers-reduced-motion: reduce)'},context=>{
   if(limited())return
   let lenis,tick
   if(context.conditions.desktop&&Lenis){
    lenis=new Lenis({duration:.8,smoothWheel:true,syncTouch:false,prevent:node=>Boolean(node.closest('#mainMenu,dialog,.we-carousel,input,select,textarea,.bap-player,.wistia-ar'))})
    lenis.on('scroll',ScrollTrigger.update);tick=time=>lenis.raf(time*1000);gsap.ticker.add(tick)
   }
   document.querySelectorAll('.we-heading,.we-craft-grid,.we-location,.arc-point>header,.we-process li,.wistia-specialist-grid article,.wistia-location-details article,.arc-process li,.we-service .we-meta,.we-service h3').forEach(el=>{
    // Never hide elements already on screen or conversion controls
    if(el.getBoundingClientRect().top<innerHeight)return
    gsap.from(el,{y:context.conditions.desktop?20:12,opacity:.3,duration:.7,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}})
   })
   if(context.conditions.desktop){
    const title=document.querySelector('.we-hero h1'),spans=[]
    if(title){
     const lines=[...title.querySelectorAll('.type-line')];const owners=lines.length?lines:[title]
     owners.flatMap(owner=>[...owner.childNodes]).filter(node=>node.nodeType===Node.TEXT_NODE).forEach(node=>{
      const fragment=document.createDocumentFragment()
      for(const letter of node.textContent){const span=document.createElement('span');span.textContent=letter===' '?'\u00a0':letter;span.style.display='inline-block';fragment.append(span);spans.push(span)}
      node.replaceWith(fragment)
     })
     gsap.from(spans,{y:8,duration:.65,stagger:.02,ease:'expo.out'})
    }
    document.querySelectorAll('.we-craft-grid>figure img,.arc-point>figure img').forEach(el=>gsap.fromTo(el,{y:-8,scale:1.03},{y:8,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}))
    return ()=>{if(tick)gsap.ticker.remove(tick);lenis?.destroy();spans.forEach(span=>span.replaceWith(span.textContent.replace(/\u00a0/g,' ')));title?.normalize()}
   }
   return ()=>{if(tick)gsap.ticker.remove(tick);lenis?.destroy()}
  })
  ScrollTrigger.refresh()
 }
 function mount(){
  destroy();carousel();processCards();processFolders();const token=generation
  document.documentElement?.setAttribute('data-studio-motion',limited()?'off':'on')
  if(!limited()){depth();if(desktop.matches)cursor();const timer=setTimeout(()=>enhance(token).catch(()=>{}),0);cleanups.push(()=>clearTimeout(timer))}
 }
 const changed=()=>mount();reduced.addEventListener('change',changed);desktop.addEventListener('change',changed)
 window.WistiaMotion={mount,destroy}
})()
