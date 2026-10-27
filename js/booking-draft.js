(function(global){
 'use strict'
 const prefix='wistia:inquiry-draft:v1:',lifetime=3*60*60*1000
 const sources=['인스타','스레드','광고','카페','블로그','지인 추천']
 const date=value=>{
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return ''
  const parsed=new Date(value+'T12:00:00Z')
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value?value:''
 }
 function sanitize(data){
  const input=data?.fields||{},parts=data?.wedding||{}
  return {version:1,flow:'recording-v2',step:Number.isInteger(data?.step)?Math.max(0,Math.min(4,data.step)):0,view:data?.view==='time'?'time':'date',fields:{
   package:['A','B','C','D'].includes(input.package)?input.package:'A',people:input.people==='1'?'1':'0',discovery:sources.includes(input.discovery)?input.discovery:'',
   bookingDate:date(input.bookingDate),
   timeStart:/^(?:1[3-9]|2[0-2]):00$/.test(input.timeStart)?input.timeStart:'',
   tuning:input.tuning==='1'?'1':'',detailMix:input.detailMix==='1'?'1':'',precisionMix:input.precisionMix==='1'?'1':'',extraHour:input.extraHour==='1'?'1':'',firstVisit:input.firstVisit==='1'?'1':'',yearEndCoupon:input.yearEndCoupon==='1'?'1':'',specialNotes:typeof input.specialNotes==='string'?input.specialNotes.slice(0,2000):''
  },wedding:{year:'',month:'',day:''}}
 }
 function read(key){
  try{
   const data=JSON.parse(global.localStorage.getItem(prefix+key))
   if(data?.version!==1||!Number.isFinite(data.savedAt)){global.localStorage.removeItem(prefix+key);return null}
   const age=Date.now()-data.savedAt
   if(age<0||age>lifetime){global.localStorage.removeItem(prefix+key);return null}
   return sanitize(data)
  }catch{return null}
 }
 function save(key,data){
  try{global.localStorage.setItem(prefix+key,JSON.stringify({...sanitize(data),savedAt:Date.now()}));return true}catch{return false}
 }
 global.WistiaBookingDraft={read,save,sanitize}
})(window)
