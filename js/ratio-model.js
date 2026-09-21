(function(root,factory){
 const api=factory()
 if(typeof module==='object'&&module.exports)module.exports=api
 if(root)root.WistiaRatioModel=api
})(typeof window!=='undefined'?window:globalThis,function(){
 const RATIOS=Object.freeze([30,50,70,100])
 const ANGLES=Object.freeze({30:225,50:315,70:135,100:45})
 const valid=value=>RATIOS.includes(Number(value))
 function createRatioState(initial=70){return{selected:valid(initial)?Number(initial):70,playing:false}}
 function selectRatio(state,value){return valid(value)?{...state,selected:Number(value)}:{...state}}
 function ratioToAngle(value){return ANGLES[valid(value)?Number(value):70]}
 return{RATIOS,createRatioState,selectRatio,ratioToAngle}
})
