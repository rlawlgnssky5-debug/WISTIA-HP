import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const code = readFileSync(new URL("../js/analytics.js", import.meta.url), "utf8");
const calls = [];
const listeners = new Map();
const timers = new Map();
let nextTimer = 1;
let click;
let change;
let visible;
const location = { protocol: "https:", hostname: "www.wistiastudio.com", origin: "https://www.wistiastudio.com", pathname: "/detail/solo", href: "https://www.wistiastudio.com/detail/solo", hash: "" };
const window = {
  wistiaVisitorId: () => "analytics-test-visitor",
  gtag: (...args) => calls.push(args),
  innerHeight: 800,
  scrollY: 0,
  addEventListener: (name, fn) => listeners.set(name, fn),
  removeEventListener: name => listeners.delete(name),
  setTimeout: (fn, delay) => { const id = nextTimer++; timers.set(id, { fn, delay }); return id; },
  clearTimeout: id => timers.delete(id)
};
const document = {
  referrer: "",
  title: "AR 축가",
  head: { appendChild() {} },
  createElement: () => ({}),
  addEventListener: (name, fn) => { if (name === "click") click = fn; if (name === "change") change = fn; },
  querySelector: selector => selector === ".booking-base-amount" ? {} : null,
  documentElement: { scrollHeight: 2400 },
  body: { scrollHeight: 2400 }
};
class IntersectionObserver {
  constructor(callback) { visible = callback; }
  observe() {}
  disconnect() {}
}
runInNewContext(code, { window, document, location, URL, Date, IntersectionObserver, setTimeout, clearTimeout });
const analytics = window.wistiaAnalytics;
assert.equal(typeof analytics.startPageTracking, "function");
assert.equal(analytics.trackPageView(), true);
assert.equal(analytics.trackPageView(), false);
assert.equal(calls.find(call => call[1] === "page_view")[2].page_location, location.href);
assert.equal(calls.find(call => call[1] === "page_view")[2].visitor_id, "analytics-test-visitor");

analytics.startPageTracking("/detail/solo", null);
window.scrollY = 1600;
listeners.get("scroll")();
assert.deepEqual(calls.filter(call => call[1] === "scroll_depth").map(call => call[2].percent), [25, 50, 75, 100]);
const oldTimer = [...timers.values()].find(timer => timer.delay === 30000);
oldTimer.fn();
assert.equal(calls.find(call => call[1] === "time_on_page")[2].page_path, "/detail/solo");

location.pathname = "/event/solo";
location.href = "https://www.wistiastudio.com/event/solo";
analytics.startPageTracking("/event/solo", () => ({ content_ids: ["solo"], content_name: "AR 축가", value: 120000, currency: "KRW" }));
assert.deepEqual([...timers.values()].map(timer => timer.delay).sort((a, b) => a - b), [0, 30000, 60000, 120000]);
assert.equal(calls.some(call => call[1] === "view_price"), false);
const priceView = { content_ids: ["deluxe"], content_name: "DELUXE", content_type: "product", value: 170000, currency: "KRW" };
assert.equal(analytics.trackViewPrice(priceView), true);
assert.equal(analytics.trackViewPrice({ ...priceView, value: 150000 }), false);
assert.equal(analytics.trackViewPrice({ ...priceView, content_ids: ["premium"], value: 220000 }), true);
assert.deepEqual(calls.filter(call => call[1] === "view_price").map(call => [call[2].content_ids[0], call[2].value, call[2].page_path]), [["deluxe", 170000, "/event/solo"], ["premium", 220000, "/event/solo"]]);

function clickLink({ href, id = "", modal = false }) {
  click({ target: { closest: () => ({ href, id, matches: selector => selector === "a[href]" || (selector === ".consult-copy-action" && modal) }) } });
}
const kakaoHref = "https://pf.kakao.com/_GbExjX/chat";
clickLink({ href: kakaoHref });
clickLink({ href: kakaoHref, id: "soloDesktopCtaKakao" });
assert.equal(calls.filter(call => call[1] === "kakao_chat_click" || call[1] === "floating_kakao_click").length, 0);
clickLink({ href: kakaoHref, id: "floatingKakaoChat" });
assert.equal(calls.filter(call => call[1] === "floating_kakao_click").length, 1);
assert.equal(calls.filter(call => call[1] === "kakao_chat_click").length, 0);
clickLink({ href: kakaoHref, modal: true });
assert.equal(calls.filter(call => call[1] === "kakao_chat_click").length, 1);
assert.equal(calls.filter(call => call[1] === "floating_kakao_click").length, 1);
change({ target: { dataset: { option: "lyrics-video" }, checked: true } });
assert.equal(calls.find(call => call[1] === "option_select")[2].option_key, "lyrics-video");
assert.equal(calls.filter(call => call[1] === "page_view").length, 2);
assert.equal(calls.findLast(call => call[1] === "page_view")[2].page_referrer, "https://www.wistiastudio.com/detail/solo");
console.log("GA4 route, scroll, time, price and Kakao click checks passed");
