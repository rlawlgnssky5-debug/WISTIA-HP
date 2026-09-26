import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import handler from "../api/meta-contact.js";

const clientCode = readFileSync(new URL("../js/meta-pixel.js", import.meta.url), "utf8");

function createClient(hostname = "wistiahp.vercel.app", withPixel = true) {
  const calls = [];
  const requests = [];
  let click;
  const location = { protocol: "https:", hostname, pathname: "/", search: "", hash: "#/", href: `https://${hostname}/#/` };
  const window = withPixel ? { fbq: (...args) => calls.push(args) } : {};
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
const soloView = { content_name: "AR 축가 사전녹음 · 1시간", content_ids: ["solo"], content_type: "product", value: 120000, currency: "KRW" };
assert.equal(browser.window.wistiaMeta.trackViewContent(soloView), true);
assert.equal(browser.window.wistiaMeta.trackViewContent(soloView), false);
assert.deepEqual(browser.calls.at(-1), ["track", "ViewContent", soloView]);
browser.location.hash = "#/";
assert.equal(browser.window.wistiaMeta.trackPageView(), true);
browser.location.hash = "#/detail/solo";
assert.equal(browser.window.wistiaMeta.trackPageView(), true);
assert.equal(browser.window.wistiaMeta.trackViewContent(soloView), true);
browser.location.hash = "#/detail/duo";
assert.equal(browser.window.wistiaMeta.trackPageView(), true);
assert.equal(browser.window.wistiaMeta.trackViewContent({ ...soloView, content_name: "AR 축가 사전녹음 · 2시간", content_ids: ["duo"], value: 160000 }), true);
browser.click({ href: "https://pf.kakao.com/_GbExjX/chat" });
assert.deepEqual(browser.calls.slice(-2).map(call => [call[0], call[1]]), [["track", "Contact"], ["trackCustom", "KakaoTalkClick"]]);
assert.equal(browser.calls.at(-2)[3].eventID, JSON.parse(browser.requests[0][1].body).event_id);
assert.equal(browser.calls.at(-1)[3].eventID, JSON.parse(browser.requests[0][1].body).event_id);
assert.equal(browser.requests[0][1].keepalive, true);
browser.click({ href: "https://example.com/" });
assert.equal(browser.requests.length, 1);
const preview = createClient("localhost");
assert.equal(preview.window.wistiaMeta.trackPageView(), false);
assert.equal(preview.window.wistiaMeta.trackViewContent(soloView), false);
preview.click({ href: "https://pf.kakao.com/_GbExjX/chat" });
assert.equal(preview.calls.length, 0);
const blockedPixel = createClient("wistiahp.vercel.app", false);
assert.equal(blockedPixel.window.wistiaMeta.trackViewContent(soloView), false);
blockedPixel.click({ href: "https://pf.kakao.com/_GbExjX/chat" });
assert.equal(blockedPixel.calls.length, 0);
assert.equal(blockedPixel.requests.length, 1);
const throwingPixel = createClient();
throwingPixel.window.fbq = () => { throw new Error("browser pixel blocked"); };
assert.equal(throwingPixel.window.wistiaMeta.trackViewContent(soloView), false);
throwingPixel.click({ href: "https://pf.kakao.com/_GbExjX/chat" });
assert.equal(throwingPixel.requests.length, 1);

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
const originalTestCode = process.env.META_TEST_EVENT_CODE;
try {
  delete process.env.META_CONVERSIONS_ACCESS_TOKEN;
  delete process.env.META_TEST_EVENT_CODE;
  assert.equal((await handler(request, createResponse())).statusCode, 503);
  process.env.META_CONVERSIONS_ACCESS_TOKEN = "test-token";
  let outgoing;
  globalThis.fetch = async (...args) => { outgoing = args; return { ok: true, json: async () => ({ events_received: 2 }) }; };
  const result = await handler(request, createResponse());
  assert.equal(result.statusCode, 200);
  assert.equal(outgoing[1].headers.Authorization, "Bearer test-token");
  const normalPayload = JSON.parse(outgoing[1].body);
  assert.equal(normalPayload.test_event_code, undefined);
  const events = normalPayload.data;
  assert.deepEqual(events.map(event => event.event_name), ["Contact", "KakaoTalkClick"]);
  for (const event of events) {
    assert.equal(event.event_id, request.body.event_id);
    assert.equal(event.user_data.fbp, "fb.1.123.456");
    assert.equal(event.user_data.fbc, "fb.1.123.test");
  }
  const testRequest = {
    ...request,
    body: { ...request.body, event_source_url: "https://wistiahp.vercel.app/?meta_test_code=TEST50039#/event/solo" }
  };
  assert.equal((await handler(testRequest, createResponse())).statusCode, 200);
  assert.equal(JSON.parse(outgoing[1].body).test_event_code, "TEST50039");
  const invalidTestRequest = {
    ...request,
    body: { ...request.body, event_source_url: "https://wistiahp.vercel.app/?meta_test_code=wrong#/event/solo" }
  };
  assert.equal((await handler(invalidTestRequest, createResponse())).statusCode, 200);
  assert.equal(JSON.parse(outgoing[1].body).test_event_code, undefined);
  assert.equal((await handler({ ...request, headers: { ...request.headers, origin: "https://other.example" } }, createResponse())).statusCode, 403);
} finally {
  globalThis.fetch = originalFetch;
  if (originalToken === undefined) delete process.env.META_CONVERSIONS_ACCESS_TOKEN;
  else process.env.META_CONVERSIONS_ACCESS_TOKEN = originalToken;
  if (originalTestCode === undefined) delete process.env.META_TEST_EVENT_CODE;
  else process.env.META_TEST_EVENT_CODE = originalTestCode;
}
console.log("Meta PageView, ViewContent, Contact, KakaoTalkClick, and server deduplication checks passed");
