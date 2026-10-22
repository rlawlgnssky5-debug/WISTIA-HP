(function(global){
 'use strict'
 // Cover only pale background pixels connected to an image's outside edge.
 // The original image stays visible: text, cards and protected media are never redrawn.
 function backgroundMask(pixels,width,height,protectedRects=[]){
  const count=width*height,mask=new Uint8Array(count),queue=new Int32Array(count)
  const corners=[0,width-1,(height-1)*width,count-1].map(i=>Array.from(pixels.slice(i*4,i*4+3))).filter(c=>Math.min(...c)>=225)
  if(!corners.length)return mask
  const rectangles=protectedRects.map(([x,y,w,h,radius=0])=>[x*width,y*height,(x+w)*width,(y+h)*height,radius*width])
  function allowed(i){
   const x=i%width,y=Math.floor(i/width)
   if(rectangles.some(([l,t,r,b,radius])=>{if(x<l||x>=r||y<t||y>=b)return false;const dx=Math.max(l+radius-x,0,x-(r-radius)),dy=Math.max(t+radius-y,0,y-(b-radius));return dx*dx+dy*dy<=radius*radius}))return false
   const p=i*4
   return pixels[p+3]>0&&Math.min(pixels[p],pixels[p+1],pixels[p+2])>=225&&corners.some(c=>Math.abs(c[0]-pixels[p])<=18&&Math.abs(c[1]-pixels[p+1])<=18&&Math.abs(c[2]-pixels[p+2])<=18)
  }
  let head=0,tail=0
  function add(i){if(!mask[i]&&allowed(i)){mask[i]=1;queue[tail++]=i}}
  for(let x=0;x<width;x++){add(x);add((height-1)*width+x)}
  for(let y=0;y<height;y++){add(y*width);add(y*width+width-1)}
  while(head<tail){const i=queue[head++],x=i%width;if(x)add(i-1);if(x<width-1)add(i+1);if(i>=width)add(i-width);if(i<count-width)add(i+width)}
  return mask
 }
 // Neutral surface ramp: white and near-white greys only, so the rose accent
 // stays the single colour on the page. Alternating bands keep the sections
 // from reading as one continuous sheet.
 const sectionTones=[
  ['.mas-intro','#FFFFFF'],
  ['.mas-information','#F5F5F7'],
  ['.arc-reviews','#FFFFFF'],
  ['#arcRecording','#F5F5F7'],
  ['#arcKey','#FFFFFF'],
  ['#arcTuning','#F5F5F7'],
  ['#soloPoint04','#FFFFFF'],
  ['.solo-lyric-poster','#F5F5F7'],
  ['[data-tone-poster="point-adv"]','#FFFFFF'],
  ['[data-tone-poster="point-price"]','#F5F5F7'],
  ['[data-tone-poster="cred-a2"]','#FFFFFF'],
  ['#arcProcess','#F5F5F7'],
  ['#arcFaq','#FFFFFF'],
  ['.solo-notice','#F5F5F7'],
  ['.solo-map','#FFFFFF']
 ]
 function numberSections(detail){
  detail.querySelectorAll('.solo-poster-stack>.detail-poster-image').forEach(image=>{
   const name=(image.getAttribute('src')||'').match(/\/(point-adv|point-price|cred-a2)\.webp/)
   if(!name)return
   const section=document.createElement('section');section.className='wistia-tone-poster';section.dataset.tonePoster=name[1]
   image.before(section);section.append(image)
  })
  let number=0
  const ordered=sectionTones.map(([selector,color])=>({section:detail.querySelector(selector),color})).filter(item=>item.section)
  ordered.sort((a,b)=>a.section===b.section?0:a.section.compareDocumentPosition(b.section)&4?-1:1)
  ordered.forEach(({section,color})=>{
   section.dataset.wistiaSection=String(++number).padStart(2,'0')
   section.style.setProperty('--wistia-section-surface',color)
   section.querySelector(':scope>.wistia-section-number')?.remove()
  })
  detail.classList.add('wistia-section-tones')
 }
 if(typeof module==='object'&&module.exports)module.exports={backgroundMask,sectionTones}
 if(!global.document)return
 let cleanup=()=>{}
 function protections(src){
  if(/top_[AB]_pc\.png/.test(src))return [[.055,.04,.455,.89]]
  if(/point01-recording\.webp/.test(src))return [[.09,.58,.82,.38]]
  // Protect each complete foreground panel, never cut a panel at a shared boundary.
  if(/map_C3(?:_v2)?\.png/.test(src))return [[.058,.155,.884,.327,.035],[.058,.525,.884,.25,.047],[.058,.788,.884,.09,.035],[.058,.9,.432,.054,.045],[.512,.9,.432,.054,.045]]
  if(/point04_ui_390\.png/.test(src))return [[0,.20,1,.29]]
  return []
 }
 function mount(root){
  cleanup()
  const detail=root.querySelector('.mobile-ar-solo:not(.mobile-story-film)');if(!detail)return
  // Preserve the separate, unfinished ivory mockup and its original behavior
  const themed=!document.documentElement.classList.contains('ivory-preview')
  if(themed)numberSections(detail)
  const media=matchMedia('(min-width:1280px)'),entries=[],observer=new ResizeObserver(()=>entries.forEach(position))
  function position(entry){
   if(!entry.canvas)return
   const box=entry.image.getBoundingClientRect(),parent=entry.image.parentElement.getBoundingClientRect()
   Object.assign(entry.canvas.style,{left:(box.left-parent.left)+'px',top:(box.top-parent.top)+'px',width:box.width+'px',height:box.height+'px'})
  }
  function paint(entry){
   const img=entry.image,src=img.currentSrc||img.src
   if((!themed&&!media.matches)||!img.complete||!img.naturalWidth||getComputedStyle(img).display==='none')return
   const surface=img.closest('[data-wistia-section]')?.style.getPropertyValue('--wistia-section-surface')||'#FFFFFF'
   if(entry.src===src&&entry.surface===surface){position(entry);return}
   entry.canvas?.remove()
   try{
    const width=img.naturalWidth,height=img.naturalHeight,work=document.createElement('canvas');work.width=width;work.height=height
    const ctx=work.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0)
    const pixels=ctx.getImageData(0,0,width,height).data,mask=backgroundMask(pixels,width,height,protections(src))
    const overlay=ctx.createImageData(width,height);let removed=0
    const color=surface.match(/^#([\da-f]{6})$/i)?.[1]||'FFFFFF',rgb=[0,2,4].map(i=>parseInt(color.slice(i,i+2),16))
    for(let i=0;i<mask.length;i++)if(mask[i]){const p=i*4;overlay.data[p]=rgb[0];overlay.data[p+1]=rgb[1];overlay.data[p+2]=rgb[2];overlay.data[p+3]=255;removed++}
    ctx.putImageData(overlay,0,0);work.className='pc-image-background';work.setAttribute('aria-hidden','true');work.dataset.backgroundPixels=String(removed)
    img.parentElement.classList.add('pc-background-host');img.parentElement.append(work)
    entry.src=src;entry.surface=surface;entry.canvas=work;position(entry)
   }catch{entry.canvas=null}
  }
  const images=detail.querySelectorAll('.detail-poster-image,.solo-shot-frame .solo-shot-img,.solo-approved-info,.solo-approved-faq,.solo-review-grid>.solo-shot-img,.solo-p4-art>.solo-shot-img,.solo-map-art>.solo-shot-img,.solo-footer>.solo-shot-img')
  images.forEach(image=>{const entry={image};entries.push(entry);entry.load=()=>paint(entry);image.addEventListener('load',entry.load);observer.observe(image);paint(entry)})
  const change=()=>entries.forEach(paint);media.addEventListener('change',change)
  cleanup=()=>{observer.disconnect();media.removeEventListener('change',change);entries.forEach(e=>{e.image.removeEventListener('load',e.load);e.canvas?.remove()})}
 }
 global.WistiaPCBackground={mount}
})(typeof window==='object'?window:globalThis)
