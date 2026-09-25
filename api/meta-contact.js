const PIXEL_ID = "2825959717777272";

function cookieValue(header, name) {
  const match = String(header || "").split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ ok: false });

  const origin = request.headers.origin;
  const host = request.headers.host;
  let parsedOrigin;
  try { parsedOrigin = new URL(origin); } catch { return response.status(403).json({ ok: false }); }
  if (!host || parsedOrigin.host !== host || !["http:", "https:"].includes(parsedOrigin.protocol)) {
    return response.status(403).json({ ok: false });
  }

  const { event_id: eventId, event_source_url: sourceUrl } = request.body || {};
  if (typeof eventId !== "string" || !/^[a-f0-9-]{36}$/i.test(eventId) || typeof sourceUrl !== "string") {
    return response.status(400).json({ ok: false });
  }
  let source;
  try { source = new URL(sourceUrl); } catch { return response.status(400).json({ ok: false }); }
  if (source.origin !== origin || !["http:", "https:"].includes(source.protocol)) {
    return response.status(400).json({ ok: false });
  }

  const token = process.env.META_CONVERSIONS_ACCESS_TOKEN;
  if (!token) return response.status(503).json({ ok: false, reason: "not_configured" });

  const userData = { client_user_agent: request.headers["user-agent"] || "" };
  const ip = String(request.headers["x-forwarded-for"] || request.socket?.remoteAddress || "").split(",")[0].trim();
  if (ip) userData.client_ip_address = ip;
  for (const name of ["_fbp", "_fbc"]) {
    const value = cookieValue(request.headers.cookie, name);
    if (value) userData[name.slice(1)] = value;
  }
  const payload = {
    data: ["Contact", "KakaoTalkClick"].map(eventName => ({
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: "website",
      event_source_url: source.href,
      user_data: userData
    }))
  };
  const urlTestCode = source.searchParams.get("meta_test_code");
  if (urlTestCode && /^TEST[A-Z0-9]{4,32}$/.test(urlTestCode)) {
    payload.test_event_code = urlTestCode;
  } else if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }
  const version = /^v\d+\.\d+$/.test(process.env.META_GRAPH_VERSION || "") ? process.env.META_GRAPH_VERSION : "v26.0";

  try {
    const metaResponse = await fetch(`https://graph.facebook.com/${version}/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    });
    const result = await metaResponse.json();
    if (!metaResponse.ok || result.events_received !== payload.data.length) return response.status(502).json({ ok: false });
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({ ok: false });
  }
}
