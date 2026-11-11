// Cloudflare Worker entry for www.wistiastudio.com.
// Static files are served directly by Workers static assets (headers from _headers, built from vercel.json).
// This Worker only runs when no static file matches: API routes, vercel.json redirects,
// clean-URL / trailing-slash redirects, and the 410/404 rules from middleware.js.
// The same api/*.js and middleware.js files keep running on Vercel unchanged.
import middleware from '../middleware.js'
import availability from '../api/availability.js'
import health from '../api/health.js'
import limitedCoupon from '../api/limited-coupon.js'
import metaContact from '../api/meta-contact.js'
import vercelConfig from '../vercel.json'
import { runVercelHandler } from './vercel-adapter.mjs'

const API = {
  '/api/availability': availability,
  '/api/health': health,
  '/api/limited-coupon': limitedCoupon,
  '/api/meta-contact': metaContact,
}

// vercel.json "headers" sources are simple prefixes like "/(.*)" or "/css/(.*)" or exact paths.
function headerRules() {
  return (vercelConfig.headers || []).map(rule => {
    const source = rule.source
    const prefix = source.endsWith('(.*)') ? source.slice(0, -4) : null
    return { test: path => (prefix !== null ? path.startsWith(prefix) : path === source), headers: rule.headers }
  })
}
const HEADER_RULES = headerRules()

function withSiteHeaders(response, path) {
  const out = new Response(response.body, response)
  for (const rule of HEADER_RULES) if (rule.test(path)) for (const { key, value } of rule.headers) out.headers.set(key, value)
  return out
}

function redirect(url, location, status) {
  const target = new URL(location, url.origin)
  if (!target.search) target.search = url.search
  return new Response('Redirecting...', { status, headers: { Location: target.pathname + target.search, 'Content-Type': 'text/plain' } })
}

function notFound() {
  return new Response('The page could not be found\n\nNOT_FOUND\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } })
}

async function route(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  // vercel.json redirects (permanent → 308), then trailingSlash:false and cleanUrls redirects.
  for (const rule of vercelConfig.redirects || []) {
    if (rule.source === path) return redirect(url, rule.destination, rule.permanent ? 308 : 307)
  }
  if (path.length > 1 && path.endsWith('/')) return redirect(url, path.replace(/\/+$/, '') || '/', 308)
  if (path.endsWith('.html')) return redirect(url, path === '/index.html' ? '/' : path.slice(0, -5), 308)

  const api = API[path]
  if (api) return runVercelHandler(api, request)

  const early = await middleware(request)
  if (early) return early

  // Static files that exist were already served by the assets layer; anything left is missing.
  if (env.ASSETS && request.method === 'GET') {
    const asset = await env.ASSETS.fetch(request)
    if (asset.status !== 404) return asset
  }
  return notFound()
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname
    return withSiteHeaders(await route(request, env), path)
  },
}
