import { isGonePath, goneDocument } from './js/gone-paths.mjs'

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
