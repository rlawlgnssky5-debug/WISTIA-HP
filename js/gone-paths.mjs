// Shared by Vercel edge middleware and the local preview server.
// Classic scripts cannot import this module, so js/app.js keeps the same allowlist.
export const LIVE_PATHS = new Set([
  '/',
  '/detail/solo',
  '/event/solo',
  '/event/duo',
  '/contact',
  '/events',
  '/info/faq',
  '/info/location',
])

export const LIVE_FILES = new Set([
  '/index.html',
  '/detail/solo.html',
  '/event/solo.html',
  '/event/duo.html',
  '/contact.html',
  '/events.html',
  '/info/faq.html',
  '/info/location.html',
])

export function normalizePath(input) {
  let path = String(input || '/')
  try { path = decodeURIComponent(path) } catch {}
  path = path.split('?')[0].split('#')[0]
  if (!path.startsWith('/')) path = '/' + path
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path || '/'
}

export function isGonePath(input) {
  const path = normalizePath(input)
  if (LIVE_PATHS.has(path) || LIVE_FILES.has(path)) return false
  // Files that only exist in the repo (archives, notes, drafts, old imports) are never served
  if (/\.(?:zip|md)$/i.test(path)) return true
  if (path.startsWith('/Claude outputs/') || path.startsWith('/tmp/')) return true
  if (/^\/[^/]+\.[^/]+$/.test(path) && !['/robots.txt', '/sitemap.xml', '/favicon.ico', '/wistia-config.json', '/index.html', '/contact.html', '/events.html'].includes(path)) return true
  if (path.split('/').some(part => part.startsWith('.'))) return false
  if (/^\/(?:assets|css|js|api|tests|lib)(?:\/|$)/.test(path)) return false
  if (path === '/robots.txt' || path === '/sitemap.xml' || path === '/favicon.ico' || path === '/wistia-config.json') return false
  if (path.endsWith('.html')) return true
  const base = path.slice(path.lastIndexOf('/') + 1)
  if (base.includes('.')) return false
  return true
}

export function goneDocument() {
  return `410 Gone`
}
