import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

class FormDataMock {
 constructor(form){this.entries=Object.entries(form.values)}
 [Symbol.iterator](){return this.entries[Symbol.iterator]()}
}
const context={window:{},FormData:FormDataMock,Date,Intl}
runInNewContext(readFileSync(new URL('../js/booking-wizard.js',import.meta.url),'utf8'),context)
const wizard=context.window.WistiaWizard
const labels=['인원','결혼식 날짜','녹음 날짜','녹음 시간','빠른 작업','추가 옵션','처음 본 곳','총 금액']
const dates=[
 {label:'2026',fields:{eventDateMode:'date',eventDate:'2026-12-12'},promo:true},
 {label:'2027',fields:{eventDateMode:'date',eventDate:'2027-12-12'},promo:false},
 {label:'unknown with retained 2026 date',fields:{eventDateMode:'unknown',eventDate:'2026-12-12'},promo:false},
 {label:'checked unknown with stale date mode',fields:{eventDateMode:'date',eventDate:'2026-12-12'},checked:true,promo:false},
 {label:'serialized unknown checkbox',fields:{eventDateMode:'date',eventDate:'2026-12-12',eventDateUnknown:'on'},promo:false},
 {label:'empty date',fields:{eventDateMode:'date',eventDate:''},promo:false},
 {label:'missing date',fields:{eventDateMode:'date'},promo:false}
]
let cases=0
for(const people of ['0','1'])for(const date of dates)for(const lyricVideo of [false,true])for(const rush of [false,true]){
 const form={values:{people,...date.fields,bookingDateMode:'date',bookingDate:'2026-11-05',timeStart:'13:00',...(lyricVideo?{lyricVideo:'1'}:{}),...(rush?{rush:'1'}:{})},elements:{eventDateUnknown:{checked:!!date.checked}}}
 const total=(people==='1'?160000:120000)+(lyricVideo?40000:0)+(rush?30000:0)
 const rows=Array.from(wizard.rows(form),row=>Array.from(row))
 const expectedLabels=[...labels]
 if(date.promo)expectedLabels.splice(6,0,'서비스')
 assert.deepEqual(rows.map(row=>row[0]),expectedLabels,date.label)
 assert.deepEqual(rows.filter(row=>row[0]==='서비스'),date.promo?[['서비스','녹음 30분 무료 추가 (2026 예식 이벤트)']]:[],date.label)
 assert.equal(rows[3][1],people==='1'?'13:00~15:00':'13:00~14:00')
 assert.equal(wizard.quote(form).total,total,date.label)
 assert.equal(rows.at(-1)[1],total.toLocaleString('ko-KR')+'원')
 const text=wizard.text(form)
 const service=['🎁 서비스','','• 2026 예식 이벤트 : 녹음 30분 무료 추가 ('+(people==='1'?'2인 2시간 → 2시간 30분':'1인 1시간 → 1시간 30분')+')'].join('\n')
 const fast='• 빠른 작업 : '+(rush?'3일 이내 받기 (+30,000원)':'미선택')
 assert.ok(text.includes(fast+'\n\n'+(date.promo?service+'\n\n':'')+'💰 결제 금액'),date.label)
 assert.equal(text.split('🎁 서비스').length-1,date.promo?1:0)
 assert.equal(text.split('• 2026 예식 이벤트 :').length-1,date.promo?1:0)
 if(!date.promo)assert.doesNotMatch(text,/🎁|서비스|녹음 30분 무료 추가/)
 assert.doesNotMatch(text,/\n{3}/)
 assert.ok(text.includes('• 시간 : '+rows[3][1].replace('~',' ~ ')))
 assert.ok(text.includes('• 총 결제 금액 : '+total.toLocaleString('ko-KR')+'원'))
 assert.equal(text.split('• 총 결제 금액 :').length-1,1)
 // Apart from the service block, reservation copy and pricing stay identical
 const withoutPromo={...form,values:{...form.values,eventDateMode:'unknown'}}
 const normalized=text.replace(service+'\n\n','').replace(/^• 결혼식 : .*$/m,'• 결혼식 : 미정')
 assert.equal(normalized,wizard.text(withoutPromo))
 cases++
}
console.log('PASS: '+cases+' SOLO/DUET date/option cases, exact service copy and row order, blank lines, unchanged prices and recording ranges')
if(process.argv.includes('--samples'))for(const year of ['2026','2027']){
 console.log('\nSOLO '+year+' text()\n'+wizard.text({values:{people:'0',eventDateMode:'date',eventDate:year+'-12-12',bookingDateMode:'date',bookingDate:'2026-11-05',timeStart:'13:00'}}))
}
