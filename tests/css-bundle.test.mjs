import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
import { stylesheetTokens, inspectCss } from '../scripts/build-css-bundle.mjs'

const root = resolve(import.meta.dirname, '..')
const read = path => readFileSync(resolve(root, path), 'utf8')

test('every served bundle has the original source bytes, cascade order and URL base', () => {
  const manifest = JSON.parse(read('css/bundles.json'))
  assert.equal(Object.keys(manifest.pages).length, 32)
  for (const [page, entry] of Object.entries(manifest.pages)) {
    const html = read(page), local = stylesheetTokens(html).filter(t => /^\/?css\//.test(t.href))
    assert.equal(local.length, 1, page)
    assert.equal(local[0].href, entry.href)
    assert.deepEqual(entry.sources, manifest.bundles[entry.bundle].sources)
    const parts = entry.sources.map(href => {
      const file = href.replace(/^\//, '').split('?')[0], source = read(file)
      assert.equal(file.slice(0, file.lastIndexOf('/')), 'css')
      for (const url of source.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
        assert.equal(new URL(url[2], 'https://example.test/' + file).href, new URL(url[2], 'https://example.test/' + entry.bundle).href)
      }
      const text = source.endsWith('\n') ? source : source + '\n'
      return `/* == ${file} == */\n${text}`
    })
    const bundle = read(entry.bundle)
    assert.equal(bundle, parts.join(''), page + ': exact concatenation')
    assert.equal(createHash('sha256').update(bundle).digest('hex').slice(0, 8), entry.bundle.match(/bundle-(\w+)\.css/)[1])
    assert.equal(Buffer.byteLength(bundle), manifest.bundles[entry.bundle].size)
  }
})

test('CSS boundary validation rejects imports and unterminated input', () => {
  for (const text of ['/* missing', 'a{color:red', 'a{content:"missing}', 'a{color:red}}', '@import "x.css";', '@im\\70 ort "x.css";']) {
    assert.throws(() => inspectCss(text, 'fixture.css'))
  }
  assert.doesNotThrow(() => inspectCss('/* { */ a{content:"}";background:url("data:image/svg+xml,<svg>{}</svg>")}', 'fixture.css'))
  assert.equal(inspectCss('@charset "UTF-8";\na{}', 'fixture.css').body, 'a{}\n')
  assert.throws(() => inspectCss('a{}\n@charset "UTF-8";', 'fixture.css'))
})

test('regeneration, grouping, absolute paths, exclusions and failure before writes', async () => {
  const dir = mkdtempSync(resolve(root, 'tmp/css-bundle-test-'))
  const put = (file, text) => { const path = resolve(dir, file); mkdirSync(resolve(path, '..'), { recursive: true }); writeFileSync(path, text) }
  try {
    put('scripts/build-css-bundle.mjs', read('scripts/build-css-bundle.mjs'))
    put('css/a.css', '@charset "UTF-8";\na{background:url(../image.png)}')
    put('css/b.css', '@charset "utf-8";\nb{}\n')
    const links = '<link rel="stylesheet" href="/css/a.css?v=1">\n  <script defer src="app.js"></script>\n  <link rel="stylesheet" href="/css/b.css?v=2">'
    put('index.html', '<link rel="stylesheet" href="https://cdn.example/font.css">\n' + links + '<style>footer{}</style>')
    put('detail/solo.html', links)
    put('other.html', links.replace('v=1', 'v=3'))
    for (const skip of ['tmp', 'tests', 'node_modules', 'Claude outputs']) put(skip + '/skip.html', '<link rel="stylesheet" href="/css/missing.css">')
    const { buildCssBundles, expandBundledHtml } = await import(pathToFileURL(resolve(dir, 'scripts/build-css-bundle.mjs')).href)
    const manifest = buildCssBundles()
    assert.equal(Object.keys(manifest.pages).length, 3)
    assert.equal(Object.keys(manifest.bundles).length, 1, 'identical bytes may share a content hash despite different query lists')
    assert.notDeepEqual(manifest.pages['index.html'].sources, manifest.pages['other.html'].sources)
    assert.match(readFileSync(resolve(dir, 'index.html'), 'utf8'), /href="\/css\/bundle-/)
    const before = readFileSync(resolve(dir, 'index.html'), 'utf8')
    assert.match(expandBundledHtml(before, manifest), /\/css\/a.css\?v=1/)
    buildCssBundles()
    assert.equal(readFileSync(resolve(dir, 'index.html'), 'utf8'), before)
    // No source CSS is modified and edits propagate using the saved per-page list.
    assert.equal(readFileSync(resolve(dir, 'css/a.css'), 'utf8'), '@charset "UTF-8";\na{background:url(../image.png)}')
    put('css/b.css', 'b{color:blue}')
    const next = buildCssBundles()
    assert.notEqual(next.pages['index.html'].bundle, manifest.pages['index.html'].bundle)
    assert.deepEqual(next.pages['index.html'].sources, manifest.pages['index.html'].sources)
    assert.deepEqual(next.pages['other.html'].sources, manifest.pages['other.html'].sources)
    for (const middle of ['<style>a{}</style>', '<link rel="stylesheet" href="https://cdn.example/extra.css">']) {
      put('interleaved.html', links.replace('<script defer src="app.js"></script>', middle))
      const snapshot = readFileSync(resolve(dir, 'index.html'), 'utf8')
      assert.throws(() => buildCssBundles(), /interleaved/)
      assert.equal(readFileSync(resolve(dir, 'index.html'), 'utf8'), snapshot)
    }
    assert.ok(readdirSync(resolve(dir, 'css')).includes('a.css'))
  } finally {
    assert.ok(dir.startsWith(resolve(root, 'tmp') + sep))
    rmSync(dir, { recursive: true, force: true })
  }
})

test('prerender expands the template sources and generates bundled route pages', async () => {
  const dir = mkdtempSync(resolve(root, 'tmp/css-prerender-test-'))
  const put = (file, text) => { const path = resolve(dir, file); mkdirSync(resolve(path, '..'), { recursive: true }); writeFileSync(path, text) }
  try {
    const manifest = JSON.parse(read('css/bundles.json'))
    for (const file of ['scripts/prerender.mjs', 'scripts/build-css-bundle.mjs', 'js/seo-meta.js', 'index.html', 'css/bundles.json', ...Object.keys(manifest.bundles)]) put(file, read(file))
    for (const entry of Object.values(manifest.bundles)) for (const href of entry.sources) {
      const path = href.replace(/^\//, '').split('?')[0]
      put(path, read(path))
    }
    await import(pathToFileURL(resolve(dir, 'scripts/prerender.mjs')).href)
    const generated = JSON.parse(readFileSync(resolve(dir, 'css/bundles.json'), 'utf8'))
    for (const page of ['index.html', 'detail/solo.html', 'detail/duo.html', 'event/solo.html', 'info/faq.html', 'section/homeServices.html']) {
      assert.deepEqual(generated.pages[page].sources, manifest.pages['index.html'].sources, page)
      const links = stylesheetTokens(readFileSync(resolve(dir, page), 'utf8')).filter(t => /^\/?css\//.test(t.href))
      assert.equal(links.length, 1, page)
    }
  } finally {
    assert.ok(dir.startsWith(resolve(root, 'tmp') + sep))
    rmSync(dir, { recursive: true, force: true })
  }
})
