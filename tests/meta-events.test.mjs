import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import handler from "../api/meta-contact.js";

const clientCode = readFileSync(new URL("../js/meta-pixel.js", import.meta.url), "utf8");

function createClient(hostname = "wistiahp.vercel.app") {
  const calls = [];
  const requests = [];
  let click;
  const location = { protocol: "https:", hostname, pathname: "/", search: "", hash: "#/", href: `https://${hostname}/#/` };
  const window = { fbq: (...args) => calls.push(args) };
  const document = { addEventListener: (type, listener) => { if (type === "click") click = listener; } };
  runInNewContext(clientCode, { window, document, location, crypto: { randomUUID: () => "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" }, fetch: (...args) => { requests.push(args); return Promise.resolve({ ok: true }); }, URL });
  return { window, location, calls, requests, click: link => click({ target: { closest: () => link } }) };
}

const browser = createClient();
assert.equal(browser.window.wistiaMeta.trackPageView(), true);
assert.equal(browser.window.wistiaMeta.trackPageView(), false);
browser.location.hash = "#/detail/solo";
assert.equal(browser.window.wistiaMeta.trackPageView(), true);
assert.equal(browser.window.wistiaMeta.trackPageView(), false);
assert.deepEqual(browser.calls.map(call => call[1]), ["PageView", "PageView"]);
browser.click({ href: "https://pf.kakao.com/_GbExjX/chat" });
assert.equal(browser.calls.at(-1)[1], "Contact");
assert.equal(browser.calls.at(-1)[3].eventID, JSON.parse(browser.requests[0][1].body).event_id);
assert.equal(browser.requests[0][1].keepalive, true);
browser.click({ href: "https://example.com/" });
assert.equal(browser.requests.length, 1);
const preview = createClient("localhost");
assert.equal(preview.window.wistiaMeta.trackPageView(), false);
preview.click({ href: "https://pf.kakao.com/_GbExjX/chat" });
assert.equal(preview.calls.length, 0);

function createResponse() {
  return { statusCode: 200, setHeader() {}, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
const request = {
  method: "POST",
  headers: {
    origin: "https://wistiahp.vercel.app",
    host: "wistiahp.vercel.app",
    "user-agent": "WISTIA test",
    "x-forwarded-for": "203.0.113.10",
    cookie: "_fbp=fb.1.123.456; _fbc=fb.1.123.test"
  },
  body: { event_id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee", event_source_url: "https://wistiahp.vercel.app/#/detail/solo" }
};
const originalFetch = globalThis.fetch;
const originalToken = process.env.META_CONVERSIONS_ACCESS_TOKEN;
try {
  delete process.env.META_CONVERSIONS_ACCESS_TOKEN;
  assert.equal((await handler(request, createResponse())).statusCode, 503);
  process.env.META_CONVERSIONS_ACCESS_TOKEN = "test-token";
  let outgoing;
  globalThis.fetch = async (...args) => { outgoing = args; return { ok: true, json: async () => ({ events_received: 1 }) }; };
  const result = await handler(request, createResponse());
  assert.equal(result.statusCode, 200);
  assert.equal(outgoing[1].headers.Authorization, "Bearer test-token");
  const event = JSON.parse(outgoing[1].body).data[0];
  assert.equal(event.event_name, "Contact");
  assert.equal(event.event_id, request.body.event_id);
  assert.equal(event.user_data.fbp, "fb.1.123.456");
  assert.equal(event.user_data.fbc, "fb.1.123.test");
  assert.equal((await handler({ ...request, headers: { ...request.headers, origin: "https://other.example" } }, createResponse())).statusCode, 403);
} finally {
  globalThis.fetch = originalFetch;
  if (originalToken === undefined) delete process.env.META_CONVERSIONS_ACCESS_TOKEN;
  else process.env.META_CONVERSIONS_ACCESS_TOKEN = originalToken;
}
console.log("Meta PageView, Contact, and server deduplication checks passed");
