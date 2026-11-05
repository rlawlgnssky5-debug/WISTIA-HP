import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync,readFileSync,readdirSync} from 'node:fs'
import {resolve} from 'node:path'
import middleware from '../middleware.js'
import {soloDetailRedirect} from '../js/gone-paths.mjs'

const root = resolve(import.meta.dirname, '..')
const read = path => readFileSync(resolve(root, path), 'utf8')

test('removed solo detail redirects to home and keeps the query', async () => {
  for (const [from, to] of [
    ['https://www.wistiastudio.com/detail/solo', 'https://www.wistiastudio.com/'],
    ['https://www.wistiastudio.com/detail/solo/', 'https://www.wistiastudio.com/'],
    ['https://www.wistiastudio.com/detail/solo?package=B&utm_source=ad', 'https://www.wistiastudio.com/?package=B&utm_source=ad'],
    ['https://www.wistiastudio.com/detail/solo.html?package=C', 'https://www.wistiastudio.com/?package=C']
  ]) {
    const response = await middleware({url: from})
    assert.equal(response.status, 301, from)
    assert.equal(response.headers.get('location'), to, from)
  }
  assert.equal(await middleware({url: 'https://www.wistiastudio.com/events'}), undefined)
  for (const from of ['https://www.wistiastudio.com/detail/duo','https://www.wistiastudio.com/detail/duo?package=A','https://www.wistiastudio.com/find/service']) {
    const response = await middleware({url: from})
    assert.equal(response.status, 301, from)
    assert.equal(response.headers.get('location'), from.includes('package') ? 'https://www.wistiastudio.com/?package=A' : 'https://www.wistiastudio.com/', from)
  }
  const unknown = await middleware({url: 'https://www.wistiastudio.com/nonexist-xyz'})
  assert.equal(unknown.status, 404)
  assert.match(await unknown.text(), /홈으로 돌아가기/)
  assert.equal((await middleware({url: 'https://www.wistiastudio.com/privacy'})).status, 410)
  assert.equal(soloDetailRedirect('/event/solo'), '')
})

test('served pages and the app no longer link to /detail/solo', () => {
  assert.equal(existsSync(resolve(root, 'detail/solo.html')), false)
  const htmlFiles = []
  const walk = dir => {
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
      if (entry.name.startsWith('.') || ['tmp', 'output', 'node_modules', 'Claude outputs', 'tests'].includes(entry.name)) continue
      const path = resolve(dir, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (entry.name.endsWith('.html')) htmlFiles.push(path)
    }
  }
  walk(root)
  for (const file of htmlFiles) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\/detail\/solo(?![-\w])/, file)
  }
  const app = read('js/app.js')
  assert.doesNotMatch(app, /href=["'][^"']*\/detail\/solo/)
  assert.doesNotMatch(app, /#\/detail\/solo/)
  assert.match(app, /function legacyHomePath/)
  assert.match(app, /if\(legacyHomePath\(routePath\(\)\)\)history\.replaceState/)
  assert.match(app, /path==='\/'\|\|path==='\/detail\/solo'\?'\/event\/solo'/)
  assert.doesNotMatch(read('js/booking-wizard.js'), /\/detail\/solo/)
  assert.doesNotMatch(read('sitemap.xml'), /\/detail\/solo</)
  const vercel = JSON.parse(read('vercel.json'))
  assert.deepEqual(vercel.redirects.map(item => item.source), ['/detail/solo', '/detail/solo/', '/detail/solo.html', '/detail/duo', '/detail/duo/', '/detail/duo.html', '/find/service', '/find/service/', '/find/service.html'])
  assert.ok(vercel.redirects.every(item => item.destination === '/' && item.permanent === true))
  const events = app.slice(app.indexOf('function renderEventsPage'), app.indexOf('let contactQuote'))
  assert.match(events, /<a class="ev2-cta ev2-consult" href="\/">AR 축가 자세히 보기/)
})
