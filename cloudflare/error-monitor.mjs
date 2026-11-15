// 2026-11-15 WISTIA site error monitor.
// - POST /api/client-error : browser errors from the inline logger in every HTML <head>
// - logServerEvent()       : structured console log for every /api/* 4xx/5xx and Worker exception (Workers Logs),
//                            and a D1 row (site_errors) for 5xx / exceptions so they can be checked later
// - GET /admin/errors      : last 7 days summary, needs ?key= matching the ADMIN_ERRORS_KEY secret
// - GET /api/error-test    : deliberately throws (marked test=1); only works while ERROR_TEST_UNTIL is in the future
// Nothing here may break the site: every D1 call is caught and runs through ctx.waitUntil.

const KINDS = new Set(['js', 'resource', 'promise', 'rage-click', 'custom'])
const RETENTION_DAYS = 30
const cut = (value, max) => String(value ?? '').slice(0, max)

function insert(env, ctx, row) {
  if (!env.ERRORS_DB) return
  const job = (async () => {
    try {
      await env.ERRORS_DB.prepare(
        "INSERT INTO site_errors (ts, kind, host, path, method, status, message, source, stack, device, test) VALUES (datetime('now'),?,?,?,?,?,?,?,?,?,?)"
      ).bind(
        row.kind, cut(row.host, 80), cut(row.path, 200), cut(row.method, 10) || null,
        Number.isFinite(row.status) ? row.status : null, cut(row.message, 300), cut(row.source, 200),
        cut(row.stack, 1200), cut(row.device, 10) || null, row.test ? 1 : 0
      ).run()
      if (Math.random() < 0.02) {
        await env.ERRORS_DB.prepare("DELETE FROM site_errors WHERE ts < datetime('now', ?)").bind(`-${RETENTION_DAYS} days`).run()
      }
    } catch (error) {
      console.log(JSON.stringify({ monitor: 'd1-insert-failed', error_message: cut(error?.message, 200) }))
    }
  })()
  if (ctx?.waitUntil) ctx.waitUntil(job)
  return job
}

export function logServerEvent(env, ctx, info) {
  const entry = {
    monitor: 'server', ts: new Date().toISOString(), path: info.path, method: info.method,
    status: info.status, error_message: info.error_message ? cut(info.error_message, 300) : undefined,
  }
  console.log(JSON.stringify(entry))
  if (info.status >= 500 || info.error_message) {
    insert(env, ctx, {
      kind: info.status >= 500 && !info.exception ? 'server-5xx' : 'server-exception', host: info.host, path: info.path,
      method: info.method, status: info.status, message: info.error_message || `HTTP ${info.status}`,
      source: 'worker', stack: info.stack, test: info.test,
    })
  }
}

function sameSite(request) {
  const host = new URL(request.url).host
  for (const name of ['origin', 'referer']) {
    const value = request.headers.get(name)
    if (!value) continue
    try { return new URL(value).host === host } catch { return false }
  }
  return false
}

export async function handleClientError(request, env, ctx) {
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers })
  if (!sameSite(request)) return new Response(null, { status: 204, headers })
  const text = await request.text()
  if (text.length > 4096) return new Response(null, { status: 204, headers })
  let data
  try { data = JSON.parse(text) } catch { return new Response(null, { status: 204, headers }) }
  if (!data || !KINDS.has(data.kind)) return new Response(null, { status: 204, headers })
  const url = new URL(request.url)
  await insert(env, null, {
    kind: data.kind, host: url.host, path: String(data.path || '').split('?')[0], message: data.message,
    source: data.source, stack: data.stack, device: data.device === 'mobile' ? 'mobile' : 'pc', test: data.test === 1,
  })
  return new Response(null, { status: 204, headers })
}

export function errorTestAllowed(env) {
  const until = Date.parse(env.ERROR_TEST_UNTIL || '')
  return Number.isFinite(until) && Date.now() < until
}

function safeEqual(a, b) {
  a = String(a || ''); b = String(b || '')
  if (!a || !b || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export async function adminErrors(request, env) {
  const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
  const url = new URL(request.url)
  if (!env.ADMIN_ERRORS_KEY) {
    return new Response('<!doctype html><meta charset="utf-8"><title>오류 모니터</title><p style="font-family:sans-serif;padding:24px">관리자 키가 아직 설정되지 않았어요. Cloudflare 대시보드 → Workers → wistia → 설정 → 변수 및 비밀에서 <b>ADMIN_ERRORS_KEY</b> 비밀을 추가한 뒤 <code>/admin/errors?key=그 값</code>으로 열어 주세요.</p>', { status: 403, headers })
  }
  if (!safeEqual(url.searchParams.get('key'), env.ADMIN_ERRORS_KEY)) {
    return new Response('<!doctype html><meta charset="utf-8"><title>오류 모니터</title><p style="font-family:sans-serif;padding:24px">키가 맞지 않아요.</p>', { status: 403, headers })
  }
  if (!env.ERRORS_DB) return new Response('ERRORS_DB 연결이 없어요', { status: 500, headers })
  const since = "datetime('now','-7 days')"
  const db = env.ERRORS_DB
  const [browser, server, perPath, totals] = await Promise.all([
    db.prepare(`SELECT kind, message, source, COUNT(*) n, COUNT(DISTINCT path) pages, GROUP_CONCAT(DISTINCT path) paths, SUM(device='mobile') mobile, MAX(ts) last, MAX(test) test FROM site_errors WHERE ts >= ${since} AND kind NOT LIKE 'server%' GROUP BY kind, message, source ORDER BY n DESC LIMIT 30`).all(),
    db.prepare(`SELECT ts, kind, method, path, status, message, test FROM site_errors WHERE ts >= ${since} AND kind LIKE 'server%' ORDER BY ts DESC LIMIT 50`).all(),
    db.prepare(`SELECT path, COUNT(*) n FROM site_errors WHERE ts >= ${since} GROUP BY path ORDER BY n DESC LIMIT 15`).all(),
    db.prepare(`SELECT SUM(kind NOT LIKE 'server%') browser, SUM(kind LIKE 'server%') server, COUNT(*) total FROM site_errors WHERE ts >= ${since}`).first(),
  ])
  const kst = ts => new Date(Date.parse(String(ts).replace(' ', 'T') + 'Z') + 9 * 3600e3).toISOString().slice(5, 16).replace('T', ' ')
  const kindName = { js: '스크립트 오류', resource: '파일 로드 실패', promise: '비동기 오류', 'rage-click': '클릭 반응 없음 의심', custom: '기타', 'server-5xx': '서버 5xx', 'server-exception': '서버 예외' }
  const tag = t => (t ? ' <em class="t">테스트</em>' : '')
  const rows1 = (browser.results || []).map(r => `<tr><td>${esc(kindName[r.kind] || r.kind)}${tag(r.test)}</td><td><b>${esc(r.message)}</b><small>${esc(r.source)}</small></td><td class="n">${r.n}</td><td>${r.pages}곳<small>${esc(String(r.paths || '').split(',').slice(0, 3).join(', '))}</small></td><td class="n">${r.mobile}</td><td>${kst(r.last)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">최근 7일 동안 없어요</td></tr>'
  const rows2 = (server.results || []).map(r => `<tr><td>${kst(r.ts)}</td><td>${esc(r.method || '')} ${esc(r.path)}${tag(r.test)}</td><td class="n">${r.status ?? ''}</td><td>${esc(r.message)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">최근 7일 동안 없어요</td></tr>'
  const rows3 = (perPath.results || []).map(r => `<tr><td>${esc(r.path)}</td><td class="n">${r.n}</td></tr>`).join('') || '<tr><td colspan="2" class="empty">없어요</td></tr>'
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>WISTIA 오류 모니터</title>
<style>body{margin:0;font-family:Pretendard,system-ui,sans-serif;background:#f6f3f4;color:#2e1f24}main{max-width:1000px;margin:0 auto;padding:24px 16px 48px}h1{font-size:22px;margin:0 0 4px}p.sub{margin:0 0 20px;color:#7d6a70;font-size:13px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}.card{background:#fff;border-radius:14px;padding:14px 16px}.card b{display:block;font-size:26px;color:#9d4e62}.card span{font-size:12.5px;color:#7d6a70}h2{font-size:16px;margin:26px 0 10px}table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;font-size:13px}th,td{padding:10px 12px;border-bottom:1px solid #f0e6e9;text-align:left;vertical-align:top}th{background:#faf6f7;font-size:12px;color:#7d6a70;font-weight:600}td small{display:block;color:#8d7a80;font-size:11.5px;margin-top:2px;word-break:break-all}td.n{text-align:right;font-weight:700;white-space:nowrap}.empty{text-align:center;color:#8d7a80;padding:22px}em.t{font-style:normal;font-size:11px;background:#ffe7a3;border-radius:4px;padding:1px 5px;margin-left:4px}.wrap{overflow-x:auto}</style></head><body><main>
<h1>WISTIA 오류 모니터</h1><p class="sub">최근 7일 · 한국 시간 · 개인정보는 저장하지 않아요 · 30일 지난 기록은 자동 삭제</p>
<div class="cards"><div class="card"><b>${totals?.browser || 0}</b><span>브라우저 오류</span></div><div class="card"><b>${totals?.server || 0}</b><span>서버·API 오류</span></div><div class="card"><b>${totals?.total || 0}</b><span>전체</span></div></div>
<h2>① 브라우저 오류 TOP</h2><div class="wrap"><table><tr><th>종류</th><th>내용 · 파일</th><th>건수</th><th>영향 페이지</th><th>모바일</th><th>마지막</th></tr>${rows1}</table></div>
<h2>② 서버·API 오류</h2><div class="wrap"><table><tr><th>시각</th><th>요청</th><th>상태</th><th>내용</th></tr>${rows2}</table></div>
<h2>③ 페이지별 건수</h2><div class="wrap"><table><tr><th>페이지</th><th>건수</th></tr>${rows3}</table></div>
</main></body></html>`
  return new Response(html, { status: 200, headers })
}
