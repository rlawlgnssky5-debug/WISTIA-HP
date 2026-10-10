import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'

const hash=text=>createHash('sha256').update(text.replace(/\r\n/g,'\n')).digest('hex')

export function assertContactBusinessPreserved(source){
 const start=source.indexOf(' function submitIcon('),end=source.indexOf(' function validationEditor('),copy=source.indexOf(' function text(')
 assert.ok(start>=0&&end>start&&copy>end,'the SVG submit UI and explicitly revised copy formatter and calendar have independent boundaries')
 // Date/time controls and their validation are intentionally revised for Notion.
 // Round 12 revises half-hour choices, range formatting and invalid-selection snapshots; dedicated behavior tests cover them.
 // Protect fields/draft logic from deployed 10b2079; render baseline is explicitly revised for the user-requested source-first section order (5th pass).
 for(const [a,b,digest] of [
  [' function render(',' function submitIcon(','fd308b63b32deb88ebafc173a4dd52a8269b00e0b34a2a392f9cbb892e6e87f7'],
  [' function validationEditor(',' function snapshot(','287ee6c7f3a043eceffb437f2e11b1c4a0495c4a8e1d4359acaa23ba6eb0c9a5'],
  [' function restore(',' function text(','ca71503dc2a2ae3330fc985fe207b382497f1759ce4101a687d070ec74cda0dd']
 ]){
  const i=source.indexOf(a),j=source.indexOf(b,i+a.length)
  // Round 7 adds only the optional notes field and its in-memory draft key.
  const baseline=source.replace(",'specialNotes'",'').replace(/^   if\(key==='time'\)return timeField\(\)\+.*$/m,"   if(key==='time')return timeField()")
  const protectedText=baseline.slice(baseline.indexOf(a),baseline.indexOf(b,baseline.indexOf(a)+a.length)).replace(/\r\n/g,'\n').replace("  global.WistiaBooking?.changed(form.querySelector('#contact-bookingDate'))\n",'').replace('  mountCalendars(form)\n','').replaceAll('결혼식 날짜 (예식일)','예식일, 예정일').replaceAll('녹음 방문일 (스튜디오 예약일)','희망 예약일').replace("['AR 축가 사전녹음','축가 스토리 필름'].map","['AR 축가 사전녹음','축가 스토리 필름','상담 후 결정'].map").replace('작성한 내용으로 카카오톡 문의하기','내용을 작성한 후 복사해<br>카카오톡 채팅창에 붙여넣어 보내주세요 :D')
  assert.equal(hash(protectedText),digest,'unchanged contact logic: '+a)
 }
 assert.match(source,/global.WistiaContact=\{render,submit,text,update,syncQuote,syncReview,snapshot,restore,validationIssues,syncSubmitState,validationEditor,mountCalendars,refreshCalendarRange,syncTimeChoices,calendar:/)
}

export function assertBeforeAfterCorePreserved(source){
 for(const [start,end,digest] of [
  ['    function start(offset){','    function activate(next,autoPlay=false){','f4dc19e3ada603f939e215ac15fc03de245aecdde3397843ae242ff830000d5f'],
  ['    function makePeaks(buffer,count=120){',"    root.classList.add('is-loading')",'d0682b27127d7e7e8c7ec77ff3fbe063a39fc844e9a0f0e2eb87af94a74f5109']
 ]){
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length)
  assert.ok(a>=0&&b>a,'audio core boundaries remain available')
  assert.equal(hash(source.slice(a,b)),digest,'before/after audio timing, decoding and waveform remain unchanged')
 }
}
