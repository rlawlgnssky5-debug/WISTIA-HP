import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {Script,runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const preview=read('tests/mobile-solo-preview.html')
const mobileCss=read('css/mobile-ar-solo.css')
const script=preview.match(/<script>([\s\S]*?)<\/script>/)[1]
new Script(script)
const names=runInNewContext('('+script.match(/const sectionNames=(\{[\s\S]*?\n  \})/)[1]+')')
for(const key of ['mas-gallery','mas-summary','mas-selection','mas-benefits','mas-information','arc-point-recording','arc-point-key','arc-point-tuning','arc-point-ratio','arc-lyrics'])assert.ok(names[key],key)
assert.match(preview,/id="reviewSection" aria-label="검토할 섹션"/)
assert.doesNotMatch(preview,/section-review-marker|review-section-styles|section\.before\(marker\)|border-top:2px solid/)
assert.doesNotMatch(mobileCss,/\.mas-selection\{[^}]*border-block|\.arc-reviews\{[^}]*border-block/)
assert.match(script,/sectionPicker\.add\(new Option\(sectionNames\[name\],String\(index\)\)\)/)
assert.match(script,/dataset\.reviewSections==='ready'/)
assert.match(script,/reviewObserver\?\.disconnect\(\)/)
assert.match(script,/observe\(app,\{childList:true\}\)/)
assert.match(script,/target\.getBoundingClientRect\(\)\.top-80/)
assert.match(script,/path==='\/detail\/duo'\?'duo':path==='\/detail\/solo'\?'solo'/)
assert.doesNotMatch(read('index.html')+read('js/app.js'),/section-review-marker|review-section-styles/,'review guides remain isolated from normal site routes')
console.log('Mobile preview jump menu works without numbered bars or divider markers, and production stays untouched')
