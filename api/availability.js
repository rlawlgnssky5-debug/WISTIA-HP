import {availability} from '../lib/notion-availability.mjs'
import {createRequire} from 'node:module'
const require=createRequire(import.meta.url)
const {validDate}=require('../js/booking-availability.js')
export default async function handler(request,response){
 response.setHeader('Cache-Control','no-store')
 if(request.method!=='GET'){response.setHeader('Allow','GET');return response.status(405).json({ok:false})}
 const date=request.query?.date
 if(!validDate(date))return response.status(400).json({ok:false,message:'날짜를 확인해 주세요'})
 try{return response.status(200).json(await availability(date))}
 catch{return response.status(503).json({ok:false,message:'일정 자동 확인이 어렵습니다, 카카오톡에서 예약 가능 여부를 확인해 주세요'})}
}
