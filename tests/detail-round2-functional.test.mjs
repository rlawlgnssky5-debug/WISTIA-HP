import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8')
const requests=[],events={},window={document:{hidden:false,addEventListener:(name,handler)=>events[name]=handler},WistiaContact:{syncSubmitState(){}}}
const control=value=>({value,disabled:false,dataset:{},setCustomValidity(){},setAttribute(){},removeAttribute(){}})
const date=control('2027-10-09'),time=control(''),status={dataset:{}},error={}
time.options=['','16:00','17:00','19:00','22:00'].map(value=>({value,textContent:value,dataset:{},disabled:false}))
Object.defineProperty(time,'selectedOptions',{get:()=>time.options.filter(e=>e.value===time.value)})
const form={isConnected:true,dataset:{},querySelector:selector=>({'#contact-bookingDate':date,'#contact-time':time,'[data-booking-status]':status,'[data-contact-date-error="bookingDate"]':error})[selector]}
date.closest=()=>form
runInNewContext(read('js/booking-availability.js'),{window,Date,Intl,AbortController,setTimeout,clearTimeout,fetch:(url,opts)=>new Promise((resolve,reject)=>requests.push({url,opts,resolve,reject}))})
await window.WistiaBooking.mount(form)
assert.equal(requests.length,0,'saved dates stay lazy on mount')
events.visibilitychange();assert.equal(requests.length,0,'returning to an unopened calendar stays lazy')
form.dataset.bookingCalendarOpened='true'
const opened=window.WistiaBooking.changed(date)
assert.equal(requests.length,1)
requests[0].resolve({ok:true,json:async()=>({ok:true,date:date.value,blocks:[]})});await opened
assert.equal(form.dataset.scheduleState,'ready')
const refresh=window.WistiaBooking.refresh()
requests[1].resolve({ok:false,status:503});await refresh
assert.equal(form.dataset.scheduleState,'unavailable');assert.match(status.textContent,/카카오톡 확인 필요/)

// Exercise the actual calendar confirmation and close functions without a browser.
const source=read('js/contact-form.js'),scope={paintCalendar(){}}
runInNewContext(source.slice(source.indexOf(' function syncEventDateClose('),source.indexOf(' function calendarMarkup('))+source.slice(source.indexOf(' function closeCalendar('),source.indexOf(' function positionCalendar(')),scope)
const label={textContent:''},close={classList:{toggle(){}},setAttribute(){},querySelector:()=>label}
const calendar={dataset:{calendar:'eventDate'},querySelector:()=>close,hidden:false}
scope.syncEventDateClose(calendar,'');assert.equal(label.textContent,'× 닫기')
scope.syncEventDateClose(calendar,'2027-10-09');assert.equal(label.textContent,'확인')
const input={value:'2027-10-09'}
scope.closeCalendar({calendar,input,trigger:{setAttribute(){}}})
assert.equal(calendar.hidden,true);assert.equal(input.value,'2027-10-09')

// Exercise real audio control code with a deterministic media object.
function element(){const listeners={},classes=new Set();return {textContent:'',style:{setProperty(k,v){this[k]=v}},classList:{contains:x=>classes.has(x),add:x=>classes.add(x),remove:x=>classes.delete(x),toggle(x,on){if(on)classes.add(x);else classes.delete(x)}},setAttribute(){},addEventListener:(k,fn)=>listeners[k]=fn,removeEventListener(){},fire:k=>listeners[k]?.()}}
const audio=element();Object.assign(audio,{paused:true,currentTime:0,duration:110,play(){this.paused=false;this.fire('play');return Promise.resolve()},pause(){this.paused=true;this.fire('pause')},removeAttribute(){},load(){}})
const buttons=[30,50,70,100].map(value=>{const el=element();el.dataset={soloRatio:String(value)};return el})
const elements={'[data-solo-audio]':audio}
for(const name of ['.solo-p4-card','.solo-p4-seek','.solo-p4-stop','[data-solo-mix]','[data-solo-current]','[data-solo-duration]','[data-solo-live]','[data-solo-ar]','[data-solo-live-label]','[data-solo-ar-label]','.solo-p4-error','[data-solo-state]'])elements[name]=element()
const root={querySelector:s=>elements[s],querySelectorAll:()=>buttons},app=read('js/app.js')
const mediaScope={soloPoint04Cleanup:null,document:{querySelector:()=>root,activeElement:null},window:{},ratioSource:r=>'ratio-'+r}
runInNewContext(app.slice(app.indexOf('function initSoloPoint04(){'),app.indexOf('function initSoloReviewLightbox(){')),mediaScope)
mediaScope.initSoloPoint04()
assert.match(elements['.solo-p4-stop'].innerHTML,/<path[^>]*M2 1v10l9-5Z/,'idle transport has a play triangle')
assert.match(elements['.solo-p4-stop'].innerHTML,/>재생<\/span>/)
for(const button of buttons){button.fire('click');assert.equal(audio.src,'ratio-'+button.dataset.soloRatio);assert.equal(elements['[data-solo-state]'].textContent,'재생 중');assert.equal(elements['[data-solo-mix]'].textContent,'AR '+button.dataset.soloRatio+'%')}
assert.equal((elements['.solo-p4-stop'].innerHTML.match(/<rect/g)||[]).length,1,'playing transport has exactly one stop square')
assert.match(elements['.solo-p4-stop'].innerHTML,/<rect width="12" height="12" rx="2"/)
assert.match(elements['.solo-p4-stop'].innerHTML,/>정지<\/span>/)
audio.currentTime=42;audio.fire('loadedmetadata');audio.fire('timeupdate')
assert.equal(elements['[data-solo-current]'].textContent,'0:42');assert.equal(elements['[data-solo-duration]'].textContent,'1:50')
assert.equal(elements['.solo-p4-seek'].style['--progress'],(42/110*100)+'%')
mediaScope.document.activeElement=elements['.solo-p4-seek'];audio.currentTime=50;audio.fire('timeupdate');assert.equal(elements['.solo-p4-seek'].value,'50')
elements['.solo-p4-seek'].value='60';elements['.solo-p4-seek'].fire('input');assert.equal(audio.currentTime,60)
elements['.solo-p4-stop'].fire('click');assert.equal(audio.currentTime,0);assert.equal(audio.paused,true);assert.equal(elements['[data-solo-state]'].textContent,'재생 대기')
assert.match(elements['.solo-p4-stop'].innerHTML,/>재생<\/span>/)
elements['.solo-p4-stop'].fire('click');assert.equal(audio.paused,false,'idle play button restarts the selected ratio');assert.equal(audio.src,'ratio-100')
audio.pause();assert.match(elements['.solo-p4-stop'].innerHTML,/>재생<\/span>/,'external pause updates the transport')
console.log('Round 2 functional checks passed: lazy lookup, 503 fallback, date confirmation/close, all ratios, live time, seek and stop')
