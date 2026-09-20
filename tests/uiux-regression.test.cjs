const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function appContext() {
  const elements = new Map();
  const element = () => ({innerHTML:'',addEventListener(){},querySelector(){return element()},querySelectorAll(){return []},classList:{add(){},remove(){},toggle(){}},setAttribute(){}});
  const context = vm.createContext({console,URL,URLSearchParams,Set,Map,AbortSignal,
    document:{querySelector(s){if(!elements.has(s)) elements.set(s,element());return elements.get(s)},querySelectorAll(){return []},addEventListener(){}},
    window:{addEventListener(){}},history:{state:{},replaceState(){}},sessionStorage:{getItem(){return null}},location:{hash:'#/'}});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/app.js'),'utf8').replace(/init\(\)\s*$/, ''),context);
  return {run:s=>vm.runInContext(s,context),elements};
}
test('unknown-price option is identified separately from the known subtotal',()=>{
  const {run}=appContext();
  run('currentEventProduct="solo"; chosenOption="lyrics-making"');
  assert.equal(run('calculate().finalPrice'),120000);
  assert.equal(run('calculate().hasUnquoted'),true);
  assert.match(run('consultationText()'),/별도 견적/);
});
test('base prices, paid option and discount cap are preserved',()=>{
  const {run}=appContext();
  for(const [key,price] of Object.entries({solo:120000,duo:160000,wedding:280000,'duet-film':280000,'solo-film':220000,proposal:200000})){
    run(`currentEventProduct=${JSON.stringify(key)};selectedFilmFormat=BASE_FILM_FORMAT[currentEventProduct]||"live"`);
    assert.equal(run('calculate().finalPrice'),price);
  }
  run('currentEventProduct="solo";chosenOption="lyrics";EVENTS.forEach(e=>selectedEvents.add(e.key))');
  assert.equal(run('calculate().finalPrice'),100000);
});
test('solo detail puts price and AR before reviews and provides native video controls',()=>{
  const {run,elements}=appContext();run('renderDetail("solo")');const html=elements.get('#app').innerHTML;
  assert.ok(html.indexOf('booking-facts')<html.indexOf('ratio-section'));
  assert.ok(html.indexOf('ratio-section')<html.indexOf('reviews-section'));
  assert.match(html,/<video[^>]*controls/);
  assert.doesNotMatch(html,/3배 이상|autoplay|완전 안전|가장 인기/);
});
