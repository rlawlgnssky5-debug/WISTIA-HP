(()=>{
  'use strict';
  let queued=false;
  function apply(){
    queued=false;
    for(const e of document.querySelectorAll('.info-page-location .studio-address:not([data-address-grouped])')){
      e.dataset.addressGrouped='true';
      e.innerHTML='<span class="material-address-street"><span class="material-address-part">경기도 부천시</span><span class="material-address-part">석천로170번길 19</span></span><span class="material-address-building">부광프라자 2층</span>';
    }
  }
  function queue(){if(!queued){queued=true;requestAnimationFrame(apply)}}
  new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  document.addEventListener('DOMContentLoaded',queue);addEventListener('popstate',queue);document.addEventListener('click',queue);document.fonts.ready.then(queue);queue();
})();
