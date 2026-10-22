// Run `node scripts/build-css-bundle.mjs` after editing source CSS. Original,
// ordered hrefs (including cache queries) live per page in css/bundles.json.
// Prerender expands the template bundle first, then calls buildCssBundles().
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { mobileCanvasCss } from './mobile-canvas-css.mjs'
import { updatePackageHtml } from './package-content.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = resolve(root, 'css/bundles.json')
const version = '20261022-home-neutral-1'
const fail = message => { throw new Error(message) }
const read = path => readFileSync(resolve(root, path), 'utf8')
const loadManifest = () => existsSync(manifestPath) ? JSON.parse(read('css/bundles.json')) : { pages: {}, bundles: {} }
const isLocal = href => /^\/?css\/[^?#]+\.css(?:\?[^#]*)?$/.test(href || '') && !/canvas-780\.css/.test(href || '')
const isBundle = href => /^\/?css\/bundle-[a-f0-9]{8}\.css(?:\?.*)?$/.test(href || '')

// Ignore tags inside comments and raw script/style text, including JS strings.
export function stylesheetTokens(html) {
  const result = []
  const tags = /<!--[\s\S]*?(?:-->|$)|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<link\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi
  for (const match of html.matchAll(tags)) {
    if (match[0].startsWith('<!--') || match[1]?.toLowerCase() === 'script') continue
    if (match[1]) { result.push({ start: match.index, end: match.index + match[0].length, style: true }); continue }
    const attrs = {}
    for (const a of match[0].slice(5, -1).matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? ''
    if (!(attrs.rel || '').toLowerCase().split(/\s+/).includes('stylesheet')) continue
    result.push({ start: match.index, end: match.index + match[0].length, href: attrs.href, attrs, raw: match[0] })
  }
  return result
}

function sourcePath(href) {
  const path = href.replace(/^\//, '').split('?')[0]
  if (!/^css\/[^/\\]+\.css$/.test(path) || path.includes('..')) fail(`Unsafe or nested CSS path: ${href}; bundle must share its directory`)
  return path
}

// Lex strings/comments/escapes so braces in SVG data URLs and quoted content
// are not mistaken for rules. Reject @import and unbalanced input before writes.
export function inspectCss(text, file) {
  const stack = []
  let quote = '', comment = false, clean = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1]
    if (comment) { if (c === '*' && next === '/') { comment = false; i++; clean += ' ' } continue }
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue }
    if (c === '/' && next === '*') { comment = true; i++; continue }
    if (c === '"' || c === "'") { quote = c; clean += ' '; continue }
    if (c === '\\') { i++; clean += ' '; continue }
    if ('{(['.includes(c)) stack.push(c)
    if ('})]'.includes(c) && stack.pop() !== ({ '}': '{', ')': '(', ']': '[' })[c]) fail(`${file}: unbalanced ${c} at ${i}`)
    clean += c
  }
  if (comment || quote || stack.length) fail(`${file}: unterminated comment/string or unbalanced braces`)
  // Decode CSS identifier escapes as well (e.g. @im\\70 ort).
  const decoded = text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\\([a-f\d]{1,6})\s?|\\([^\r\n])/gi, (_, hex, char) => hex ? String.fromCodePoint(parseInt(hex, 16)) : char)
  if (/@import\b/i.test(clean) || /@import\b/i.test(decoded)) fail(`${file}: @import cannot be concatenated safely`)
  let body = text.replace(/^\uFEFF/, '')
  const charset = body.match(/^@charset "([^"]+)";\r?\n?/i)
  if (charset && !/^utf-8$/i.test(charset[1])) fail(`${file}: only UTF-8 @charset is supported`)
  if (charset) body = body.slice(charset[0].length)
  if (/@charset\b/i.test(body.replace(/\/\*[\s\S]*?\*\//g, ' '))) fail(`${file}: @charset must be at the very top`)
  // Source and output are both in css/: every relative url(), including ../,
  // retains exactly the same base URL. Nested source paths are rejected above.
  body = body.endsWith('\n') ? body : body + '\n'
  return { body: mobileCanvasCss(body, file), charset: Boolean(charset) }
}

export function expandBundledHtml(html, manifest = loadManifest(), page = 'index.html') {
  const tokens = stylesheetTokens(html).filter(t => isBundle(t.href))
  for (const token of tokens.reverse()) {
    const key = token.href.replace(/^\//, '').split('?')[0]
    const bundle = manifest.bundles[key]
    if (!bundle) fail(`Missing manifest sources for ${key}`)
    const sources = manifest.pages[page]?.bundle === key ? manifest.pages[page].sources : bundle.sources
    const links = sources.filter(href => !/canvas-780\.css/.test(href)).map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ')
    html = html.slice(0, token.start) + links + html.slice(token.end)
  }
  return html
}

function servedPages(dir = root) {
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    if (entry.name.startsWith('.') || ['tmp', 'output', 'tests', 'node_modules', 'Claude outputs'].includes(entry.name)) return []
    const path = resolve(dir, entry.name)
    return entry.isDirectory() ? servedPages(path) : /\.html$/i.test(entry.name) ? [relative(root, path).replaceAll('\\', '/')] : []
  })
}

export function buildCssBundles() {
  const previous = loadManifest(), manifest = { version: 1, cacheVersion: version, bundles: {}, pages: {} }
  const plans = [], groups = new Map(), errors = []
  for (const page of servedPages()) {
    try {
      let html = updatePackageHtml(read(page),page)
      if (/\bid=["']app["']/.test(html)) {
        if (!/src="js\/package-pricing\.js/.test(html)) html=html.replace(/(<script src="js\/booking-wizard\.js)/,'<script src="js/package-pricing.js?v='+version+'" defer></script>\n  $1')
        html=html.replace(/(src="js\/(?:app|booking-wizard|booking-draft|booking-availability|seo-meta|detail-pc-background)\.js)(?:\?[^"<>]*)?/g,'$1?v='+version)
      }
      const tokens = stylesheetTokens(html), local = tokens.filter(t => isLocal(t.href))
      if (!local.length) continue
      const between = tokens.filter(t => t.start > local[0].start && t.start < local.at(-1).start)
      if (between.some(t => t.style || !isLocal(t.href))) fail(`${page}: interleaved <style> or non-local stylesheet; page not bundled (${between.filter(t => t.style || !isLocal(t.href)).map(t => t.href || '<style>').join(', ')})`)
      for (const token of local) {
        if (Object.keys(token.attrs).some(key => !['href', 'rel'].includes(key))) fail(`${page}: local stylesheet has extra attributes; cannot preserve semantics`)
      }
      const sources = local.flatMap(t => {
        if (!isBundle(t.href)) return [t.href]
        const key = t.href.replace(/^\//, '').split('?')[0]
        const saved = previous.pages[page]
        if (saved?.bundle === key) return saved.sources
        return previous.bundles[key]?.sources ?? fail(`${page}: missing original sources for ${key}`)
      }).filter(href => !/canvas-780\.css/.test(href))
      // Every app entry can reach the same routes through pushState
      // Keep the existing mobile gutter rules in every entry's source list
      if (/\bid=["']app["']/.test(html) && !sources.some(href => /mobile-gutters-1020\.css/.test(href))) {
        const beforeHero = sources.findIndex(href => /hero-slider\.css/.test(href))
        sources.splice(beforeHero < 0 ? sources.length : beforeHero, 0, 'css/mobile-gutters-1020.css?v=20261020-mobile-gutters-1')
      }
      if (/\bid=["']app["']/.test(html) && !sources.some(href => /mobile-parity-780\.css/.test(href))) sources.push('css/mobile-parity-780.css?v=20261021-mobile-parity-1')
      if (/\bid=["']app["']/.test(html) && !sources.some(href => /package-pricing\.css/.test(href))) sources.push('css/package-pricing.css?v='+version)
      if (/\bid=["']app["']/.test(html) && !sources.some(href => /home-neutral\.css/.test(href))) sources.push('css/home-neutral.css?v='+version)
      const groupKey = JSON.stringify(sources)
      let group = groups.get(groupKey)
      if (!group) {
        const parts = sources.map(href => { const path = sourcePath(href); return { path, ...inspectCss(read(path), path) } })
        const content = (parts.some(p => p.charset) ? '@charset "UTF-8";\n' : '') + parts.map(p => `/* == ${p.path} == */\n${p.body}`).join('')
        const hash = createHash('sha256').update(content).digest('hex').slice(0, 8)
        group = { key: `css/bundle-${hash}.css`, sources, content, size: Buffer.byteLength(content), pages: [] }
        groups.set(groupKey, group)
      }
      group.pages.push(page)
      const prefix = local[0].href.startsWith('/') ? '/' : ''
      let output = html
      for (let i = local.length - 1; i >= 0; i--) {
        const token = local[i]
        if (i === 0) output = output.slice(0, token.start) + `<link rel="stylesheet" href="${prefix}${group.key}?v=${version}">` + output.slice(token.end)
        else {
          // Remove an otherwise empty line, preserving all unrelated markup.
          const lineStart = output.lastIndexOf('\n', token.start - 1) + 1
          const tail = output.slice(token.end).match(/^[\t ]*\r?\n/)
          const wholeLine = /^[\t ]*$/.test(output.slice(lineStart, token.start)) && tail
          output = output.slice(0, wholeLine ? lineStart : token.start) + output.slice(wholeLine ? token.end + tail[0].length : token.end)
        }
      }
      manifest.pages[page] = { bundle: group.key, sources, href: `${prefix}${group.key}?v=${version}`, linksRemoved: sources.length - 1 }
      plans.push({ page, html: output, group })
    } catch (error) { errors.push(error.message) }
  }
  if (errors.length) fail(`CSS bundling stopped without writes:\n${errors.join('\n')}`)
  for (const group of groups.values()) {
    writeFileSync(resolve(root, group.key), group.content)
    const existing = manifest.bundles[group.key]
    if (existing) {
      // Cache-query differences can produce the same content hash. Preserve
      // every distinct list and page while sharing the identical output bytes.
      existing.sourceLists.push(group.sources)
      existing.pages.push(...group.pages)
    } else manifest.bundles[group.key] = { sources: group.sources, sourceLists: [group.sources], pages: [...group.pages], size: group.size }
  }
  for (const plan of plans) if (read(plan.page) !== plan.html) writeFileSync(resolve(root, plan.page), plan.html)
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  // Independently re-read source files and remove only the separators we added.
  for (const plan of plans) {
    const actual = read(plan.group.key)
    let offset = actual.startsWith('@charset "UTF-8";\n') ? '@charset "UTF-8";\n'.length : 0
    let recovered = '', expected = ''
    for (const href of manifest.pages[plan.page].sources) {
      const path = sourcePath(href), part = inspectCss(read(path), path).body, separator = `/* == ${path} == */\n`
      if (actual.slice(offset, offset + separator.length) !== separator) fail(`${plan.page}: separator mismatch`)
      offset += separator.length
      recovered += actual.slice(offset, offset + part.length)
      expected += part
      offset += part.length
    }
    if (offset !== actual.length || recovered !== expected) fail(`${plan.page}: source/bundle text mismatch`)
  }
  console.table(plans.map(({ page, group }) => ({ page, bundle: group.key, removed: manifest.pages[page].linksRemoved, bytes: group.size })))
  return manifest
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildCssBundles()
