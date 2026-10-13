/* A brief introduction on a fresh visit, using only existing real photographs */
(() => {
 if(!['/','/detail/solo','/detail/duo'].includes(location.pathname))return
 const intro=document.createElement('div')
 intro.className='wistia-intro';intro.setAttribute('aria-hidden','true')
 intro.innerHTML='<div class="intro-brand"><img src="assets/img/wistia-logo-transparent.webp" alt=""><span>WISTIA</span></div><div class="intro-composition"><div class="intro-photos"><img src="assets/img/wedding/04-recording-making.webp" alt=""><img src="assets/img/ar-detail/duet-live-proof-v2.jpg" alt=""><img src="assets/img/ar-detail/solo-live-proof.jpg" alt=""></div><div class="intro-copy"><p>목소리로 전하는 결혼식</p><h2>웨딩 축가<br><strong>전문</strong> 스튜디오</h2><small>BUCHEON STUDIO</small></div></div>'
 // Reuse the exact SOLO customer poster, even if its asset name changes
 const soloPoster=document.querySelector('.mas-gallery-slide img')
 if(soloPoster)intro.querySelector('.intro-photos img:last-child').src=soloPoster.src
 document.body.append(intro)
 const close=()=>{intro.classList.add('is-leaving');setTimeout(()=>intro.remove(),350)}
 setTimeout(close,1500)
})()
