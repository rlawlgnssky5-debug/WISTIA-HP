// Vercel loads this file as CommonJS because the repo has no package.json.
// Keep the allowlist and 410 page in this file. Loading js/gone-paths.mjs from here
// makes Node 24 throw ERR_REQUIRE_ESM and every request fails before the site can answer.

const LIVE_PATHS = new Set([
  '/',
  '/event/solo',
  '/event/duo',
  '/contact',
  '/events',
  '/info/faq',
  '/info/location',
])

const LIVE_FILES = new Set([
  '/index.html',
  '/event/solo.html',
  '/event/duo.html',
  '/contact.html',
  '/events.html',
  '/info/faq.html',
  '/info/location.html',
])

function normalizePath(input) {
  let path = String(input || '/')
  try { path = decodeURIComponent(path) } catch {}
  path = path.split('?')[0].split('#')[0]
  if (!path.startsWith('/')) path = '/' + path
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path || '/'
}

const RETIRED_PATHS = new Set([
  '/film', '/film/extra', '/privacy', '/privacy/rights', '/song', '/before-after',
  '/ar/self', '/ar/friend', '/info/about', '/info/process', '/detail/wedding',
  '/detail/proposal', '/detail/solo-film', '/detail/duet-film', '/event/wedding',
  '/event/proposal', '/event/solo-film', '/event/duet-film', '/choose/wedding',
  '/choose/solo-film', '/find', '/find/role', '/find/people', '/section/homeServices',
  '/section/homeCases', '/section/homeLocation', '/section/homeProcess',
  '/detail/solo/extra', '/event/solo/making',
])

// IndexNow (Bing, Naver, Yandex, Seznam…) reads this key file from the site root to verify URL submissions.
const INDEXNOW_KEY_FILE = '/4b00b68f4bc3ad46fe8137c51fbcf8b3.txt'

function isStaticAsset(path) {
  if (path.split('/').some(part => part.startsWith('.'))) return true
  if (/^\/(?:assets|css|js|api|tests|lib)(?:\/|$)/.test(path)) return true
  if (path === '/robots.txt' || path === '/sitemap.xml' || path === '/favicon.ico' || path === '/wistia-config.json' || path === INDEXNOW_KEY_FILE) return true
  return false
}

function isUnpublishedFile(path) {
  if (/\.(?:zip|md)$/i.test(path)) return true
  if (path.startsWith('/Claude outputs/') || path.startsWith('/tmp/')) return true
  if (/^\/[^/]+\.[^/]+$/.test(path) && !['/robots.txt', '/sitemap.xml', '/favicon.ico', '/wistia-config.json', '/index.html', '/contact.html', '/events.html', INDEXNOW_KEY_FILE].includes(path)) return true
  return false
}

function soloDetailRedirect(input) {
  const path = normalizePath(input)
  if (['/detail/solo', '/detail/solo.html', '/detail/duo', '/detail/duo.html', '/find/service', '/find/service.html'].includes(path)) return '/'
  return ''
}

function isGonePath(input) {
  const path = normalizePath(input)
  if (LIVE_PATHS.has(path) || LIVE_FILES.has(path) || soloDetailRedirect(path) || isStaticAsset(path)) return false
  if (isUnpublishedFile(path)) return true
  if (path.endsWith('.html')) return true
  return RETIRED_PATHS.has(path)
}

function isUnknownPath(input) {
  const path = normalizePath(input)
  if (LIVE_PATHS.has(path) || LIVE_FILES.has(path) || soloDetailRedirect(path) || isStaticAsset(path) || isGonePath(path)) return false
  const base = path.slice(path.lastIndexOf('/') + 1)
  if (base.includes('.')) return false
  return true
}

function goneDocument() {
  return `410 Gone`
}

function notFoundDocument() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>페이지를 찾을 수 없어요 | 위스티아</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fdf6f2;color:#3c3034;font-family:Pretendard,sans-serif}
main{max-width:28rem;padding:32px 20px;text-align:center}
p{margin:0 0 12px;line-height:1.6}
h1{margin:0 0 12px;font-size:22px;line-height:1.4}
a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:999px;background:#9d596c;color:#fff;text-decoration:none}
</style>
</head>
<body>
<main>
<p>404</p>
<h1>페이지를 찾을 수 없어요</h1>
<p>주소가 바뀌었거나 없는 페이지예요.</p>
<a href="/">홈으로 돌아가기</a>
</main>
</body>
</html>`
}

export default function middleware(request) {
  const url = new URL(request.url)
  const home = soloDetailRedirect(url.pathname)
  if (home) {
    const target = new URL(home, url.origin)
    target.search = url.search
    return Response.redirect(target, 301)
  }
  if (isGonePath(url.pathname)) {
    return new Response(goneDocument(), {
      status: 410,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'no-store',
      },
    })
  }
  if (isUnknownPath(url.pathname)) {
    return new Response(notFoundDocument(), {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'no-store',
      },
    })
  }
}
