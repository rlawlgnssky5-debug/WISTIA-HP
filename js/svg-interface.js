/* Title and interface SVGs only: genuine media and approved 3D artwork stay intact */
(function(global){
 'use strict'
 const skipTitles='.footer,.we-hero,.bap-player,.wistia-ar__deck,.wistia-ar__disc-stage,.wistia-ar__player,.qe-result,[data-svg-title="off"]'
 const skipChrome='svg,script,style,textarea,select,.bap-player,.wistia-ar__artboard,[data-svg-chrome="off"]'
 const glyphs={'↗':'external','↔':'compare','→':'next','←':'previous','↑':'up','↓':'down','▼':'chevron','▲':'up','▶':'play','Ⅱ':'pause','✕':'close','×':'close','✓':'check','✔':'check','＋':'plus','−':'minus','›':'chevron','‹':'chevron'}
 const glyphPattern=/[↗↔→←↑↓▼▲▶Ⅱ✕×✓✔＋−›‹]/g
 function all(root,selector){return [...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)]}
 function iconFor(title){
  const text=title.textContent.replace(/\s+/g,' ').trim(),parent=title.closest('section,article,header,div')
  const context=(parent?.getAttribute('aria-label')||'')+' '+(parent?.id||'')+' '+(parent?.className||'')
  if(/AR.*비율|비율.*AR|비율을 골라/.test(text))return 'mix'
  if(/페이백/.test(text))return 'refund'
  if(/할인/.test(text))return 'tag'
  if(/실제.*후기|고객.*후기|리뷰/.test(text))return 'chat'
  if(/위스티아.*장점/.test(text))return 'shield'
  if(/예약 전|예약 전에|확인할 사항|예약 안내/.test(text))return 'file'
  if(/자주 묻|궁금|Q\s*&\s*A|FAQ/.test(text))return 'help'
  if(/오시는|주소|위치|지하철|차량|주차|부천에서 만나요/.test(text)||/homeLocation/.test(context))return 'pin'
  if(/상품|기본 구성|포함|구성은/.test(text))return 'package'
  if(/인원|혼자 또는|SOLO|DUET/.test(text))return 'people'
  if(/가격|저렴|금액|합리적/.test(text))return 'receipt'
  if(/혜택|이벤트|선물/.test(text))return 'gift'
  if(/일정|예약일|일정 작성/.test(text))return 'calendar'
  if(/보정|보컬|음정|박자|키 조절|음역|노래를 잘/.test(text))return 'tune'
  if(/진행|순서|과정|어떻게|준비부터|녹음부터/.test(text))return 'workflow'
  if(/전달|파일|검수|최종/.test(text))return 'file'
  if(/시간|기간|납기/.test(text))return 'clock'
  if(/문의|상담/.test(text))return 'chat'
  if(/인터뷰/.test(text))return 'microphone'
  if(/편지/.test(text))return 'letter'
  if(/메시지/.test(text))return 'note'
  if(/녹음|디렉팅/.test(text))return 'microphone'
  if(/음원|사운드|믹싱|마스터링|엔지니어|방송/.test(text))return 'headphones'
  if(/영상|촬영|필름|장면|이야기|목소리가 전한|목소리로 전한/.test(text))return 'camera'
  if(/전문가|다릅니다|선택|차이|완성/.test(text))return 'shield'
  if(/review/.test(context))return 'chat'
  if(/process/.test(context))return 'workflow'
  if(/faq/.test(context))return 'help'
  return 'file'
 }
 function makeIcon(document,icon,name,className){
  const span=document.createElement('span')
  span.className=className
  span.setAttribute('aria-hidden','true')
  span.innerHTML=icon(name)
  return span
 }
 function markDescription(title,container,level){
  if(!container)return
  const card=level>2
  container.classList.add(card?'svg-item-copy':'svg-section-heading')
  for(const node of container.children){
   if(node===title)continue
   if(node.matches('p')&&!node.matches('.eyebrow,.detail-point-label,.arc-kicker,.we-kicker,[data-solo-kicker],.wps-kicker,.wistia-ar__eyebrow,.wistia-ba-eyebrow,.package-overview-eyebrow,.info-section-kicker,.arc-option-fee')){
    node.classList.add(card?'svg-item-description':'svg-section-description')
   }
   if(node.matches('.eyebrow,.detail-point-label,.arc-kicker,.we-kicker,.we-section-tag,.price-reason-label,[data-solo-kicker],.wps-kicker,.wistia-ar__eyebrow,.wistia-ba-eyebrow,.info-section-kicker'))node.classList.add('svg-section-kicker')
  }
 }
 function detailLayout(root){
  for(const scope of all(root,'.ar-commerce-detail')){
   for(const group of scope.querySelectorAll(':scope > .arc-advantages')){
    group.classList.add('detail-section-group')
    for(const section of group.children)if(section.matches('section')&&section.querySelector('h2'))section.classList.add('detail-section-layout')
   }
   for(const section of scope.children){
    if(section.matches('section,.arc-engineer,.arc-reviews')&&section.querySelector('h2'))section.classList.add('detail-section-layout')
   }
  }
  for(const badge of all(root,'.ar-commerce-detail .detail-point-label,.ar-commerce-detail .price-reason-label')){
   if(badge.dataset.pointNumberMounted)continue
   const match=/^(POINT\s+)(\d+)(.*)$/.exec(badge.textContent)
   if(!match)continue
   const number=badge.ownerDocument.createElement('span');number.className='detail-point-number';number.textContent=match[2]
   badge.replaceChildren(badge.ownerDocument.createTextNode(match[1]),number,badge.ownerDocument.createTextNode(match[3]))
   badge.dataset.pointNumberMounted='true'
  }
 }
 function mount(root,icon){
  if(!root||typeof icon!=='function')return
  const titles=all(root,'h2,h3,h4,.info-page-intro>h1,.calculator-intro>h1,.contact-intro>h1')
  for(const title of titles){
   if(title.closest(skipTitles)||title.id==='quoteService'||title.hasAttribute('data-process-title')||title.dataset.svgTitleMounted||!title.textContent.trim())continue
   // Existing title SVGs are already explicit icons, never append a second one
   if(title.querySelector('svg'))continue
   const level=title.closest('.benefit-kind-header')?3:Number(title.tagName.slice(1))||2,document=title.ownerDocument
   const text=document.createElement('span')
   text.className='svg-section-text'
   while(title.firstChild)text.append(title.firstChild)
   title.append(text)
   const name=iconFor(title)
   title.prepend(makeIcon(document,icon,name,'svg-title-icon'))
   title.classList.add(level>2?'svg-item-title':'svg-section-title')
   title.dataset.svgTitleMounted='true'
   title.dataset.svgTitleIcon=name
   markDescription(title,title.parentElement,level)
   const outer=title.closest('.section-heading')
   if(outer&&outer!==title.parentElement){
    outer.classList.add('svg-section-heading')
    for(const kicker of outer.children)if(kicker.matches('.eyebrow'))kicker.classList.add('svg-section-kicker')
   }
  }
  // The home reviews share the same content edge as the adjacent home sections
  for(const header of all(root,'.we-home .review-carousel-head header'))header.classList.add('svg-section-heading')
  for(const kicker of all(root,'.we-home .we-review-wrap>.we-shell>.we-section-tag'))kicker.classList.add('svg-section-kicker')
  for(const copy of all(root,'.detail-price-reason>.shell')){
   copy.classList.add('svg-section-heading')
   for(const node of copy.children)if(node.matches('p'))node.classList.add('svg-section-description')
  }
  // The legacy location header has a separate decorative pin, not a second label
  for(const header of all(root,'.mas-location>header')){
   if(header.querySelector('.svg-title-icon svg[data-icon="pin"]'))header.querySelector(':scope > svg[data-icon="pin"]')?.remove()
  }
  // Product metadata keeps its native definition-list semantics and original values
  for(const label of all(root,'.mas-information dt')){
   if(label.dataset.svgInfoMounted||label.querySelector('svg')||!label.textContent.trim())continue
   const document=label.ownerDocument,text=document.createElement('span'),name=iconFor(label)
   text.className='svg-info-text'
   while(label.firstChild)text.append(label.firstChild)
   label.append(makeIcon(document,icon,name,'svg-info-icon'),text)
   label.classList.add('svg-info-label')
   label.dataset.svgInfoMounted='true'
  }
  detailLayout(root)
 }
 function replaceGlyphs(node,icon){
  const value=node.nodeValue
  glyphPattern.lastIndex=0
  const single=/^\s*([+-])\s*$/.exec(value)
  const matches=single?[{index:0,0:value,name:single[1]==='+'?'plus':'minus'}]:[...value.matchAll(glyphPattern)]
  if(!matches.length)return
  const document=node.ownerDocument,fragment=document.createDocumentFragment()
  let offset=0
  for(const match of matches){
   if(match.index>offset)fragment.append(document.createTextNode(value.slice(offset,match.index)))
   const chrome=makeIcon(document,icon,match.name||glyphs[match[0]],'svg-chrome-icon')
   if(match[0]==='›'||match[0]==='‹')chrome.classList.add(match[0]==='›'?'svg-chevron-right':'svg-chevron-left')
   fragment.append(chrome)
   offset=match.index+match[0].length
  }
  if(offset<value.length)fragment.append(document.createTextNode(value.slice(offset)))
  node.replaceWith(fragment)
 }
 function mountChrome(root,icon){
  if(!root||typeof icon!=='function')return
  for(const target of all(root,'a,button,summary,[aria-hidden="true"].option-symbol,[aria-hidden="true"].story-process-expand-arrow')){
   if(target.closest(skipChrome))continue
   const document=target.ownerDocument,walker=document.createTreeWalker(target,4),nodes=[]
   let node
   while((node=walker.nextNode())){
    const parent=node.parentElement
    if(!parent||parent.closest(skipChrome)||parent.closest('.svg-chrome-icon,.svg-title-icon'))continue
    // Within disclosure rows only decorative glyphs are replaced, not their prose
    if(target.tagName==='SUMMARY'&&!parent.matches('b,em,[aria-hidden="true"],.process-expand,.process-folder-cue')&&!parent.closest('[aria-hidden="true"]'))continue
    nodes.push(node)
   }
   nodes.forEach(node=>replaceGlyphs(node,icon))
  }
  for(const toggle of all(root,'#menuToggle')){
   if(toggle.querySelector('svg'))continue
   toggle.replaceChildren(makeIcon(toggle.ownerDocument,icon,'menu','svg-menu-open'),makeIcon(toggle.ownerDocument,icon,'close','svg-menu-close'))
   toggle.classList.add('svg-menu-toggle')
  }
 }
 global.WistiaSvgUI={mount,mountChrome}
})(window)
