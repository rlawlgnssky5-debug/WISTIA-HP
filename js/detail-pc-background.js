(function(global){
 'use strict'
 // Cover only pale background pixels connected to an image's outside edge.
 // The original image stays visible: text, cards and protected media are never redrawn.
 function backgroundMask(pixels,width,height,protectedRects=[]){
  const count=width*height,mask=new Uint8Array(count),queue=new Int32Array(count)
  const corners=[0,width-1,(height-1)*width,count-1].map(i=>Array.from(pixels.slice(i*4,i*4+3))).filter(c=>Math.min(...c)>=225)
  if(!corners.length)return mask
  const rectangles=protectedRects.map(([x,y,w,h])=>[x*width,y*height,(x+w)*width,(y+h)*height])
  function allowed(i){
   const x=i%width,y=Math.floor(i/width)
   if(rectangles.some(([l,t,r,b])=>x>=l&&x<r&&y>=t&&y<b))return false
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
 if(typeof module==='object'&&module.exports)module.exports={backgroundMask}
 if(!global.document)return
 let cleanup=()=>{}
 function protections(src){
  if(/top_A_pc\.png/.test(src))return [[.055,.04,.455,.89]]
  if(/point01-recording\.webp/.test(src))return [[.09,.58,.82,.38]]
  if(/map_C3\.png/.test(src))return [[.04,.28,.92,.44]]
  return []
 }
 function mount(root){
  cleanup()
  const detail=root.querySelector('.mobile-ar-solo:not(.mobile-story-film)');if(!detail)return
  const media=matchMedia('(min-width:1280px)'),entries=[],observer=new ResizeObserver(()=>entries.forEach(position))
  function position(entry){
   if(!entry.canvas)return
   const box=entry.image.getBoundingClientRect(),parent=entry.image.parentElement.getBoundingClientRect()
   Object.assign(entry.canvas.style,{left:(box.left-parent.left)+'px',top:(box.top-parent.top)+'px',width:box.width+'px',height:box.height+'px'})
  }
  function paint(entry){
   const img=entry.image,src=img.currentSrc||img.src
   if(!media.matches||!img.complete||!img.naturalWidth||getComputedStyle(img).display==='none')return
   if(entry.src===src){position(entry);return}
   entry.canvas?.remove()
   try{
    const width=img.naturalWidth,height=img.naturalHeight,work=document.createElement('canvas');work.width=width;work.height=height
    const ctx=work.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0)
    const pixels=ctx.getImageData(0,0,width,height).data,mask=backgroundMask(pixels,width,height,protections(src))
    const overlay=ctx.createImageData(width,height);let removed=0
    for(let i=0;i<mask.length;i++)if(mask[i]){const p=i*4;overlay.data[p]=246;overlay.data[p+1]=230;overlay.data[p+2]=230;overlay.data[p+3]=255;removed++}
    ctx.putImageData(overlay,0,0);work.className='pc-image-background';work.setAttribute('aria-hidden','true');work.dataset.backgroundPixels=String(removed)
    img.parentElement.classList.add('pc-background-host');img.parentElement.append(work)
    entry.src=src;entry.canvas=work;position(entry)
   }catch{entry.canvas=null}
  }
  const images=detail.querySelectorAll('.detail-poster-image,.solo-shot-frame>.solo-shot-img,.solo-p4-art>.solo-shot-img,.solo-map>.solo-shot-img,.solo-footer>.solo-shot-img')
  images.forEach(image=>{const entry={image};entries.push(entry);entry.load=()=>paint(entry);image.addEventListener('load',entry.load);observer.observe(image);paint(entry)})
  const change=()=>entries.forEach(paint);media.addEventListener('change',change)
  cleanup=()=>{observer.disconnect();media.removeEventListener('change',change);entries.forEach(e=>{e.image.removeEventListener('load',e.load);e.canvas?.remove()})}
 }
 global.WistiaPCBackground={mount}
})(typeof window==='object'?window:globalThis)
