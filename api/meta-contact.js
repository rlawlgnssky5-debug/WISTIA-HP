const PIXEL_ID = "2825959717777272";
// Each kind maps to the browser pixel events that share the same event_id, so Meta deduplicates them
const EVENT_KINDS = { contact: ["Contact", "KakaoTalkClick"], inquiry_submit: ["InquirySubmit"], inquiry_open: ["InquiryOpen"] };

function cookieValue(header, name) {
  const match = String(header || "").split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`));
  if (!match) return undefined;
  // Meta requires _fbc/_fbp exactly as stored, so never decode or change case
  return match.slice(name.length + 1);
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

  const { event_id: eventId, event_source_url: sourceUrl, kind = "contact", fbp: bodyFbp, fbc: bodyFbc, fbclid, fbclid_at: fbclidAt } = request.body || {};
  if (!Object.hasOwn(EVENT_KINDS, kind)) return response.status(400).json({ ok: false });
  if (typeof eventId !== "string" || !/^[a-f0-9-]{36}$/i.test(eventId) || typeof sourceUrl !== "string") {
    return response.status(400).json({ ok: false });
  }
  let source;
  try { source = new URL(sourceUrl); } catch { return response.status(400).json({ ok: false }); }
  if (source.origin !== origin || !["http:", "https:"].includes(source.protocol)) {
    return response.status(400).json({ ok: false });
  }

  const token = process.env.META_CAPI_TOKEN || process.env.META_CONVERSIONS_ACCESS_TOKEN;
  if (!token) return response.status(503).json({ ok: false, reason: "not_configured" });

  const userData = { client_user_agent: request.headers["user-agent"] || "" };
  const ip = String(request.headers["x-forwarded-for"] || request.headers["x-real-ip"] || request.socket?.remoteAddress || "").split(",")[0].trim();
  if (ip) userData.client_ip_address = ip;
  // Cookie first, then the copy the browser read from document.cookie, both unchanged
  const validFbp = value => typeof value === "string" && value.length <= 200 && /^fb\.\d\.\d+\.\d+$/.test(value);
  const validFbc = value => typeof value === "string" && value.length <= 600 && /^fb\.\d\.\d+\.[!-~]+$/.test(value);
  const fbp = [cookieValue(request.headers.cookie, "_fbp"), bodyFbp].find(validFbp);
  let fbc = [cookieValue(request.headers.cookie, "_fbc"), bodyFbc].find(validFbc);
  // No _fbc anywhere: build it from the raw landing fbclid exactly as it appeared in the URL
  if (!fbc && typeof fbclid === "string" && fbclid.length <= 500 && /^[!-~]+$/.test(fbclid) && !/[&#=]/.test(fbclid)) {
    const at = Number.isSafeInteger(fbclidAt) && fbclidAt > 1e12 && fbclidAt <= Date.now() + 6e4 ? fbclidAt : Date.now();
    fbc = `fb.1.${at}.${fbclid}`;
  }
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  const payload = {
    data: EVENT_KINDS[kind].map(eventName => ({
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
