// Runs the existing Vercel-style api/*.js handlers (request, response) inside a Cloudflare Worker.
// Only the small part of the Vercel Node helpers these handlers use is provided.

function parseBody(text, type) {
  if (!text) return undefined
  if (type.includes('application/json')) { try { return JSON.parse(text) } catch { return undefined } }
  if (type.includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(text))
  return text
}

export async function runVercelHandler(handler, request) {
  const url = new URL(request.url)
  const headers = {}
  request.headers.forEach((value, key) => { headers[key] = value })
  headers.host = url.host
  const ip = request.headers.get('cf-connecting-ip')
  if (ip && !headers['x-forwarded-for']) headers['x-forwarded-for'] = ip
  const query = {}
  for (const [key, value] of url.searchParams) {
    query[key] = Object.hasOwn(query, key) ? [].concat(query[key], value) : value
  }
  let body
  if (!['GET', 'HEAD'].includes(request.method)) body = parseBody(await request.text(), headers['content-type'] || '')
  const req = { method: request.method, url: url.pathname + url.search, headers, query, body, socket: { remoteAddress: ip || '' } }

  return new Promise((resolve, reject) => {
    const out = new Headers()
    let statusCode = 200, done = false
    const finish = payload => {
      if (done) return
      done = true
      resolve(new Response(request.method === 'HEAD' ? null : payload ?? null, { status: statusCode, headers: out }))
    }
    const res = {
      get statusCode() { return statusCode },
      set statusCode(value) { statusCode = value },
      setHeader(name, value) {
        if (Array.isArray(value)) { out.delete(name); value.forEach(v => out.append(name, String(v))) }
        else if (name.toLowerCase() === 'set-cookie') out.append(name, String(value))
        else out.set(name, String(value))
        return res
      },
      getHeader(name) { return out.get(name) ?? undefined },
      status(code) { statusCode = code; return res },
      json(data) {
        if (!out.has('content-type')) out.set('content-type', 'application/json; charset=utf-8')
        finish(JSON.stringify(data))
        return res
      },
      send(data) {
        if (data !== null && typeof data === 'object' && !(data instanceof Uint8Array)) return res.json(data)
        finish(data)
        return res
      },
      end(data) { finish(data); return res },
    }
    Promise.resolve().then(() => handler(req, res)).then(() => finish(), reject)
  })
}
