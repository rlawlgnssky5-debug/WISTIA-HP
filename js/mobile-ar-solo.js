(()=>{
 let cleanup=null
 function destroy(){cleanup?.();cleanup=null}
 function mount(){
  destroy()
  const root=document.querySelector('.mobile-ar-solo'),track=root?.querySelector('.mas-gallery-track')
  if(!track)return
  const slides=[...track.querySelectorAll('[data-mobile-slide]')],dots=[...root.querySelectorAll('[data-mobile-slide-to]')],count=root.querySelector('.mas-gallery-count')
  let current=0,frame=0
  const update=()=>{
   frame=0
   const index=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))))
   if(index!==current)slides[current]?.querySelector('video')?.pause()
   current=index
   dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)))
   if(count)count.textContent=(index+1)+' / '+slides.length
  }
  const go=index=>track.scrollTo({left:index*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)}
  const click=event=>{const dot=event.target.closest('[data-mobile-slide-to]');if(dot&&root.contains(dot))go(Number(dot.dataset.mobileSlideTo))}
  const key=event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(Math.max(0,Math.min(slides.length-1,current+(event.key==='ArrowRight'?1:-1))))}}
  const resize=()=>{track.scrollTo({left:current*track.clientWidth,behavior:'instant'});update()}
  root.addEventListener('click',click);track.addEventListener('keydown',key);track.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize)
  update()
  cleanup=()=>{cancelAnimationFrame(frame);root.removeEventListener('click',click);track.removeEventListener('keydown',key);track.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize)}
 }
 window.WistiaMobileSolo={mount,destroy}
})()
