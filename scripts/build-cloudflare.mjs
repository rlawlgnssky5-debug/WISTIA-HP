// Builds the Cloudflare Workers copy of the site. Vercel does not use this file.
//   dist/cloudflare/assets  public files served by Workers static assets (+ _headers from vercel.json)
//   dist/cloudflare/src     Worker sources; lib/notion-availability.mjs gets a static import instead of
//                           createRequire so the Worker bundler can include js/booking-availability.js.
// Usage: node scripts/build-cloudflare.mjs   (wrangler.jsonc runs it before every deploy)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'dist', 'cloudflare')
const assets = join(out, 'assets')
const src = join(out, 'src')
rmSync(out, { recursive: true, force: true })
mkdirSync(assets, { recursive: true })

// Public files: the pages and folders middleware.js allows on Vercel.
const PUBLIC_FILES = ['index.html', 'contact.html', 'events.html', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'wistia-config.json', '4b00b68f4bc3ad46fe8137c51fbcf8b3.txt']
const PUBLIC_DIRS = ['event', 'info', 'css', 'js', 'assets', 'lib', 'carousel']
const skip = name => name.startsWith('.') || /\.(?:md|zip|py)$/i.test(name)

function copyTree(from, to) {
  for (const name of readdirSync(from)) {
    if (skip(name)) continue
    const a = join(from, name), b = join(to, name)
    if (statSync(a).isDirectory()) { mkdirSync(b, { recursive: true }); copyTree(a, b) }
    else cpSync(a, b)
  }
}
for (const file of PUBLIC_FILES) if (existsSync(join(root, file))) cpSync(join(root, file), join(assets, file))
for (const dir of PUBLIC_DIRS) if (existsSync(join(root, dir))) { mkdirSync(join(assets, dir), { recursive: true }); copyTree(join(root, dir), join(assets, dir)) }

// vercel.json headers → _headers ("/(.*)" becomes "/*").
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'))
const headerLines = []
for (const rule of vercel.headers || []) {
  headerLines.push(rule.source.replace(/\(\.\*\)$/, '*'))
  for (const { key, value } of rule.headers) headerLines.push(`  ${key}: ${value}`)
}
writeFileSync(join(assets, '_headers'), headerLines.join('\n') + '\n')

// Worker sources.
mkdirSync(join(src, 'api'), { recursive: true })
mkdirSync(join(src, 'lib'), { recursive: true })
mkdirSync(join(src, 'js'), { recursive: true })
mkdirSync(join(src, 'cloudflare'), { recursive: true })
for (const file of readdirSync(join(root, 'api'))) cpSync(join(root, 'api', file), join(src, 'api', file))
for (const file of ['worker.mjs', 'vercel-adapter.mjs']) cpSync(join(root, 'cloudflare', file), join(src, 'cloudflare', file))
cpSync(join(root, 'middleware.js'), join(src, 'middleware.js'))
cpSync(join(root, 'vercel.json'), join(src, 'vercel.json'))
cpSync(join(root, 'js', 'booking-availability.js'), join(src, 'js', 'booking-availability.js'))
const lib = readFileSync(join(root, 'lib', 'notion-availability.mjs'), 'utf8')
const patched = lib
  .replace("import {createRequire} from 'node:module'\n", "import bookingRules from '../js/booking-availability.js'\n")
  .replace('const require=createRequire(import.meta.url)\n', '')
  .replace("require('../js/booking-availability.js')", 'bookingRules')
if (patched === lib || patched.includes('createRequire')) throw new Error('lib/notion-availability.mjs changed; update scripts/build-cloudflare.mjs')
writeFileSync(join(src, 'lib', 'notion-availability.mjs'), patched)
console.log('Cloudflare build ready:', out)
