import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const css=read('css/mobile-detail-safety.css')
assert.match(css,/@media\(max-width:900px\)/)
assert.match(css,/body\.is-solo-detail[^\n]*padding-top:64px!important/)
assert.match(css,/\.mas-selection\{min-height:0!important;box-shadow:0 12px 0 12px #F6E6E6!important/)
assert.doesNotMatch(css,/box-shadow:0 0 0 12px/)
assert.match(css,/\.mas-gallery-caption\{top:16px!important/)
assert.match(css,/white-space:normal!important;word-break:keep-all!important/)
assert.match(read('index.html'),/mobile-detail-safety\.css\?v=20261015-mobile-safety-1/)
console.log('Mobile-only header offset, no upward picker mask, scalable picker height, wrapping caption and stylesheet entry passed')
