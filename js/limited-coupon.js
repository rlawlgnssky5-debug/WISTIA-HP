(function(global){
 'use strict'
 const state={ready:false,remaining:null,claimed:false,closed:false,busy:false,error:false}
 let request=null,started=false
 function notify(){global.dispatchEvent(new Event('wistia:limited-coupon'))}
 async function refresh(issue=false){
  if(request){await request;if(!issue||state.claimed)return state;return refresh(true)}
  state.busy=true;state.error=false;notify()
  request=(async()=>{
   try{
    const response=await fetch('/api/limited-coupon',{method:issue?'POST':'GET',credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(12000)})
    const data=await response.json()
    if(!response.ok||!data.ok||!Number.isInteger(data.remaining)||data.remaining<0||data.remaining>20||typeof data.claimed!=='boolean'||typeof data.closed!=='boolean')throw Error('Unavailable')
    Object.assign(state,{ready:true,remaining:data.remaining,claimed:data.claimed,closed:data.closed,newlyClaimed:data.newlyClaimed===true})
   }catch{state.error=true;state.newlyClaimed=false}
   finally{state.busy=false;request=null;notify()}
   return state
  })()
  return request
 }
 function start(){if(started)return;started=true;refresh();global.setInterval(()=>{if(document.visibilityState==='visible')refresh()},30000)}
 global.addEventListener('focus',()=>{if(started)refresh()})
 global.document.addEventListener('visibilitychange',()=>{if(started&&document.visibilityState==='visible')refresh()})
 global.WistiaLimitedCoupon={state,refresh,start}
})(window)
