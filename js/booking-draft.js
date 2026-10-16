(function(global){
 'use strict'
 const prefix='wistia:inquiry-draft:v1:',lifetime=7*24*60*60*1000
 const sources=['인스타','스레드','광고','카페','블로그','지인 추천']
 const date=value=>{
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return ''
  const parsed=new Date(value+'T12:00:00Z')
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value?value:''
 }
 function sanitize(data){
  const input=data?.fields||{},parts=data?.wedding||{}
  return {version:1,step:Number.isInteger(data?.step)?Math.max(0,Math.min(4,data.step)):0,view:data?.view==='time'?'time':'date',fields:{
   people:input.people==='1'?'1':'0',discovery:sources.includes(input.discovery)?input.discovery:'',
   eventDateMode:input.eventDateMode==='unknown'?'unknown':'date',eventDate:date(input.eventDate),bookingDate:date(input.bookingDate),
   timeStart:/^(?:1[3-9]|2[0-2]):00$/.test(input.timeStart)?input.timeStart:'',
   rush:input.rush==='1'?'1':'',lyricVideo:input.lyricVideo==='1'?'1':'',lyricNone:input.lyricNone==='1'&&input.lyricVideo!=='1'?'1':'',specialNotes:typeof input.specialNotes==='string'?input.specialNotes.slice(0,2000):''
  },wedding:{year:/^\d{4}$/.test(parts.year)?String(parts.year):'',month:/^(?:[1-9]|1[0-2])$/.test(parts.month)?String(parts.month):'',day:/^(?:[1-9]|[12]\d|3[01])$/.test(parts.day)?String(parts.day):''}}
 }
 function read(key){
  try{
   const data=JSON.parse(global.localStorage.getItem(prefix+key))
   if(data?.version!==1||!Number.isFinite(data.savedAt))return null
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
