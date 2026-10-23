// Vercel loads this file as CommonJS because the repo has no package.json.
// Keep the allowlist and 410 page in this file. Loading js/gone-paths.mjs from here
// makes Node 24 throw ERR_REQUIRE_ESM and every request fails before the site can answer.

const LIVE_PATHS = new Set([
  '/',
  '/detail/solo',
  '/event/solo',
  '/event/duo',
  '/contact',
  '/events',
  '/info/faq',
  '/info/location',
])

const LIVE_FILES = new Set([
  '/index.html',
  '/detail/solo.html',
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

function isGonePath(input) {
  const path = normalizePath(input)
  if (LIVE_PATHS.has(path) || LIVE_FILES.has(path)) return false
  if (path.split('/').some(part => part.startsWith('.'))) return false
  if (/^\/(?:assets|css|js|api|tests|lib)(?:\/|$)/.test(path)) return false
  if (path === '/robots.txt' || path === '/sitemap.xml' || path === '/favicon.ico' || path === '/wistia-config.json') return false
  if (path.endsWith('.html')) return true
  const base = path.slice(path.lastIndexOf('/') + 1)
  if (base.includes('.')) return false
  return true
}

function goneDocument() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>없어진 페이지예요</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F5F4F0;color:#252421;font-family:Pretendard,"Pretendard Variable",sans-serif}
main{text-align:center;padding:32px 20px}
p{font-size:22px;font-weight:550;margin:0 0 24px}
a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;background:#252421;color:#F5F4F0;text-decoration:none;border-radius:4px;font-size:15px}
</style>
</head>
<body>
<main>
<p>없어진 페이지예요</p>
<a href="/">홈으로</a>
</main>
</body>
</html>`
}

export default function middleware(request) {
  const url = new URL(request.url)
  if (!isGonePath(url.pathname)) return
  return new Response(goneDocument(), {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
    },
  })
}
