(function(global){
 'use strict'
 const state={ready:false,remaining:null,claimed:false,received:false,expired:false,expiresAt:null,nextClaimAt:null,inCooldown:false,canClaim:false,closed:false,busy:false,error:false}
 let request=null,started=false,deadline=0,reclaimDeadline=0
 const monotonic=()=>global.performance.now()
 const remainingMs=()=>state.received?Math.max(0,deadline-monotonic()):0
 const isUsable=()=>state.received&&!state.expired&&remainingMs()>0
 function paintTimers(){
  if(state.received&&state.inCooldown&&reclaimDeadline<=monotonic()){state.inCooldown=false;refresh();return}
  if(state.received&&!state.expired&&remainingMs()<=0){state.expired=true;state.claimed=false;notify();return}
  const seconds=Math.ceil(remainingMs()/1000),pad=n=>String(n).padStart(2,'0'),text=pad(Math.floor(seconds/3600))+':'+pad(Math.floor(seconds%3600/60))+':'+pad(seconds%60)
  global.document.querySelectorAll('[data-coupon-timer-value]').forEach(el=>{if(el.textContent!==text)el.textContent=text})
 }
 function notify(){global.dispatchEvent(new Event('wistia:limited-coupon'))}
 async function refresh(issue=false){
  if(request){await request;if(!issue||state.received&&!state.canClaim)return state;return refresh(true)}
  if(issue&&(!state.ready||state.received&&!state.canClaim))return state
  state.busy=true;state.error=false;notify()
  request=(async()=>{
   try{
    const sentAt=monotonic()
    const response=await fetch('/api/limited-coupon',{method:issue?'POST':'GET',credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(12000)})
    const data=await response.json()
    if(!response.ok||!data.ok||!Number.isInteger(data.remaining)||data.remaining<0||data.remaining>20||typeof data.claimed!=='boolean'||typeof data.closed!=='boolean')throw Error('Unavailable')
    const expiresAt=Date.parse(data.expiresAt),serverNow=Date.parse(data.serverNow)
    if(data.claimed&&(!Number.isFinite(expiresAt)||!Number.isFinite(serverNow)||typeof data.expired!=='boolean'))throw Error('Missing receipt expiry')
    deadline=data.claimed?sentAt+Math.max(0,expiresAt-serverNow):0
    const expired=data.claimed&&(data.expired||expiresAt<=serverNow)
    const nextClaimAt=data.claimed?(data.nextClaimAt||new Date(expiresAt+6*86400000).toISOString()):null,next=Date.parse(nextClaimAt)
    if(data.claimed&&!Number.isFinite(next))throw Error('Missing reclaim date')
    reclaimDeadline=data.claimed?sentAt+Math.max(0,next-serverNow):0
    Object.assign(state,{ready:true,remaining:data.remaining,received:data.claimed,claimed:data.claimed&&!expired,expired,expiresAt:data.claimed?data.expiresAt:null,nextClaimAt,inCooldown:data.claimed&&next>serverNow,canClaim:typeof data.canClaim==='boolean'?data.canClaim:!data.claimed&&!data.closed&&data.remaining>0,closed:data.closed,newlyClaimed:data.newlyClaimed===true})
   }catch{state.error=true;state.newlyClaimed=false}
   finally{state.busy=false;request=null;notify()}
   return state
  })()
  return request
 }
 function start(){if(started)return;started=true;refresh();global.setInterval(()=>{if(document.visibilityState==='visible')refresh()},30000);global.setInterval(paintTimers,1000)}
 global.addEventListener('focus',()=>{if(started)refresh()})
 global.document.addEventListener('visibilitychange',()=>{if(started&&document.visibilityState==='visible')refresh()})
 global.WistiaLimitedCoupon={state,refresh,start,remainingMs,isUsable,paintTimers}
})(window)
