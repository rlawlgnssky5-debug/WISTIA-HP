/* Approved intro crop preserves the original real photos and typography. */
(() => {
 if(!['/','/detail/solo','/detail/duo'].includes(location.pathname))return
 const intro=document.createElement('div')
 intro.className='wistia-intro';intro.setAttribute('aria-hidden','true')
 intro.innerHTML='<div class="intro-brand"><img src="assets/img/wistia-logo-transparent.webp" alt=""><span>WISTIA</span></div><div class="intro-composition"><picture><source media="(min-width:901px)" srcset="assets/detail-solo-16j/intro_A_1280-splash.webp?v=16j14"><img src="assets/detail-solo-16j/intro_A_390-splash.webp?v=16j14" alt="" fetchpriority="high"></picture><small class="intro-pc-caption">BUCHEON STUDIO</small></div>'
 document.body.append(intro)
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
 setTimeout(()=>{intro.classList.add('is-leaving');setTimeout(()=>intro.remove(),reduced?0:300)},1600)
})()
