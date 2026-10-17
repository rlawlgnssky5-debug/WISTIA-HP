import {readWithBundleSources} from './bundled-html-fixture.mjs'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=readWithBundleSources
const css=read('css/alignment-audit.css')
assert.match(css,/\.we-hero-grid\.we-hero-text\{grid-template-columns:minmax\(0,1fr\);text-align:center\}/)
assert.match(css,/\.we-hero :is\(\.we-kicker,h1,\.we-lead\)\{text-align:center;margin-inline:auto\}/)
assert.match(css,/\.we-hero h1\{width:100%;max-width:900px\}/)
assert.match(css,/\.we-hero \.we-lead\{width:100%;max-width:600px\}/)
assert.ok(read('index.html').includes('css/alignment-audit.css?v=20261014-detail-polish-16j'))
console.log('Home hero keeps a centered single-column layout across the desktop boundary')
