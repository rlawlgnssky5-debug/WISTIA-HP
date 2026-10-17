import {readWithBundleSources} from './bundled-html-fixture.mjs'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=readWithBundleSources
const source=read('js/app.js'),css=read('css/mobile-ar-solo.css'),home=read('css/home-form-refresh.css')
assert.match(source,/return \['solo','duo'\]\.includes\(key\)\?mobileArSoloDetail\(p,desktopHtml,key\):desktopHtml/)
assert.match(source,/app.innerHTML=key==='duet-film'\?mobileStoryFilmDetail\(p\):filmCommerceDetail\(p,key,purpose\)/)
assert.doesNotMatch(source,/soloMobileViewport/,'viewport resizing must preserve the page and media state')
assert.doesNotMatch(source,/matchMedia[^\n]*\?mobile(?:ArSolo|StoryFilm)Detail/)
assert.match(css,/@media \(min-width:0px\)/,'approved mobile styles also apply to PC')
assert.match(css,/@media \(min-width:769px\)/,'wide layouts only resize and arrange the shared composition')
assert.match(css,/\.mobile-ar-solo\{max-width:1120px;margin-inline:auto/)
assert.match(css,/\.mas-bottom\{left:50%;right:auto/)
assert.match(home,/border:1px solid #bdcad5/)
assert.match(home,/0 5px 0 #d2dce4,0 16px 28px/)
assert.match(home,/prefers-reduced-motion:reduce/)
assert.ok(read('index.html').includes('js/app.js?v=20261014-detail-polish-16j'))
assert.ok(read('index.html').includes('css/mobile-ar-solo.css?v=20261014-detail-polish-16j'))
assert.ok(read('index.html').includes('css/home-form-refresh.css?v=20261014-detail-polish-16j'))
console.log('One approved composition across PC/mobile, stable media on resize, responsive sizing and raised home cards passed')
