'use strict'
// Deliberately CommonJS: Vercel transpiles ESM api/*.js to CommonJS, and its runtime
// cannot require() the ESM lib, so the .mjs is loaded with a native dynamic import().
const {validDate,validRange}=require('../js/booking-availability.js')
let notion
module.exports=async function handler(request,response){
 response.setHeader('Cache-Control','no-store')
 if(request.method!=='GET'){response.setHeader('Allow','GET');return response.status(405).json({ok:false})}
 const {date,from,to}=request.query||{},range=from!==undefined||to!==undefined
 if(range?(!validRange(from,to)||date!==undefined):!validDate(date))return response.status(400).json({ok:false,message:'날짜를 확인해 주세요'})
 try{const {availability,availabilityRange}=await (notion??=import('../lib/notion-availability.mjs').catch(error=>{notion=undefined;throw error}));return response.status(200).json(await (range?availabilityRange(from,to):availability(date)))}
 catch{return response.status(503).json({ok:false,message:'일정 자동 확인이 어렵습니다, 카카오톡에서 예약 가능 여부를 확인해 주세요'})}
}
