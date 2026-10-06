import assert from 'node:assert/strict'
import {runInNewContext} from 'node:vm'
export function assertManualReviews(app){
 const listeners={},loop={style:{}},classes=new Set();let capture=null,clock=0,frame,removed=0
 const track={setAttribute(){},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},addEventListener(type,fn,options){listeners[type]={fn,options}},removeEventListener(type,fn){assert.equal(listeners[type].fn,fn);delete listeners[type];removed++},setPointerCapture(id){capture=id},hasPointerCapture:id=>capture===id,releasePointerCapture(){capture=null}}
 let reduced=false
 const context={document:{querySelector:s=>s==='#reviewTrack'?track:null},requestAnimationFrame(fn){frame=fn;return 1},cancelAnimationFrame(){},matchMedia:()=>({matches:reduced}),reviewMetrics:()=>({loop,setWidth:1000,step:200}),reviewFrame:0,reviewLast:0,reviewTarget:0,reviewDisplay:0,reviewCleanup:null,reviewHoldUntil:0,Date:{now:()=>clock}}
 runInNewContext(app.slice(app.indexOf('function paintReviews('),app.indexOf('function processMedia(')),context)
 const pointer=(x,y=0,type='touch')=>({clientX:x,clientY:y,pointerId:1,pointerType:type,button:0,isPrimary:true,preventDefault(){this.prevented=true}})
 context.startReviewCarousel();frame(100);frame(200)
 assert.ok(context.reviewDisplay>0)
 const start=context.reviewDisplay
 listeners.pointerdown.fn(pointer(200));const right=pointer(300);listeners.pointermove.fn(right)
 assert.equal(context.reviewDisplay,start-100,'finger moving right must move reviews right')
 assert.equal(context.reviewTarget,context.reviewDisplay);assert.equal(right.prevented,true);assert.equal(capture,1)
 const left=pointer(150);listeners.pointermove.fn(left)
 assert.equal(context.reviewDisplay,start+50,'finger moving left must move reviews left')
 listeners.pointerup.fn(left);assert.equal(capture,null);assert.equal(classes.size,0)
 const held=context.reviewDisplay;frame(300);assert.equal(context.reviewDisplay,held)
 clock=6000;frame(400);assert.ok(context.reviewDisplay>held,'auto motion resumes only after the manual hold')
 const beforeVertical=context.reviewDisplay;listeners.pointerdown.fn(pointer(200));const vertical=pointer(202,90);listeners.pointermove.fn(vertical)
 assert.equal(context.reviewDisplay,beforeVertical);assert.equal(vertical.prevented,undefined);assert.equal(capture,null)
 listeners.pointercancel.fn(vertical)
 const beforeMouse=context.reviewDisplay;listeners.pointerdown.fn(pointer(250,0,'mouse'));listeners.pointermove.fn(pointer(120,0,'mouse'))
 assert.equal(context.reviewDisplay,beforeMouse+130,'mouse dragging works as well as touch')
 listeners.pointerup.fn(pointer(120,0,'mouse'))
 let prevented=false;const beforeKey=context.reviewDisplay
 listeners.keydown.fn({key:'ArrowLeft',preventDefault(){prevented=true}})
 assert.equal(context.reviewDisplay,beforeKey-200);assert.equal(prevented,true)
 context.reviewDisplay=-100;context.paintReviews();assert.equal(loop.style.transform,'translate3d(-900px,0,0)','backward wrapping has no blank space')
 context.startReviewCarousel(false);assert.equal(removed,11,'reinitialization removes all old handlers')
 reduced=true;context.startReviewCarousel();frame(500);frame(600);assert.equal(context.reviewDisplay,0)
 listeners.keydown.fn({key:'ArrowRight',preventDefault(){}});assert.equal(context.reviewDisplay,200,'manual control remains available with reduced motion')
 return context
}
