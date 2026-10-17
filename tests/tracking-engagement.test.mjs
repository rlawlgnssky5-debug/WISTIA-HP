import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const read = name => readFileSync(new URL("../js/" + name, import.meta.url), "utf8");
const storage = new Map();
const idWindow = () => ({ localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) } });
const one = idWindow(), two = idWindow();
runInNewContext(read("tracking-common.js"), { window: one });
const id = one.wistiaVisitorId();
runInNewContext(read("tracking-common.js"), { window: two });
assert.equal(two.wistiaVisitorId(), id);
const denied = { get localStorage() { throw Error("denied"); } };
runInNewContext(read("tracking-common.js"), { window: denied });
assert.match(denied.wistiaVisitorId(), /^wv_[a-f0-9]{32}$/);
assert.equal(denied.wistiaVisitorId(), denied.wistiaVisitorId());

function environment(path, width = 390) {
  let now = 0, nextTimer = 0;
  const ga = [], meta = [], listeners = {}, docListeners = {}, timers = new Map(), observers = [];
  const rect = { top: 0, bottom: 2000, left: 0, right: width, width, height: 2000 };
  const element = { getBoundingClientRect: () => rect };
  const document = {
    visibilityState: "visible", title: "WISTIA", referrer: "https://example.com/?PRIVATE",
    documentElement: { scrollHeight: 4000 }, body: { scrollHeight: 4000 },
    head: { appendChild() {} }, createElement: () => ({}),
    querySelector: selector => selector === ".mas-intro" ? element : null,
    addEventListener: (name, fn) => (docListeners[name] ||= new Set()).add(fn),
    removeEventListener: (name, fn) => docListeners[name]?.delete(fn)
  };
  const window = {
    innerWidth: width, innerHeight: 800, scrollY: 0,
    gtag: (...args) => ga.push(args), wistiaMeta: { trackSectionView: payload => meta.push(payload) },
    addEventListener: (name, fn) => (listeners[name] ||= new Set()).add(fn),
    removeEventListener: (name, fn) => listeners[name]?.delete(fn),
    setTimeout: fn => { timers.set(++nextTimer, fn); return nextTimer; }, clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => { fn(); return 1; }, cancelAnimationFrame() {}
  };
  class Observer {
    constructor(fn) { this.fn = fn; observers.push(this); }
    observe(target) { this.target = target; } disconnect() { this.disconnected = true; }
  }
  const location = { protocol: "https:", hostname: "example.com", origin: "https://example.com", pathname: path, href: "https://example.com" + path + "?PRIVATE" };
  const context = { window, document, location, IntersectionObserver: Observer, Date: class extends Date { static now() { return now; } } };
  runInNewContext(read("tracking-common.js"), context);
  runInNewContext(read("analytics.js"), context);
  const fire = (name, event = {}) => { for (const fn of [...(listeners[name] || [])]) fn(event); };
  return { window, document, ga, meta, observers, rect, location, fire,
    advance: ms => now += ms,
    hidden: hidden => { document.visibilityState = hidden ? "hidden" : "visible"; for (const fn of docListeners.visibilitychange || []) fn(); },
    scroll: y => { window.scrollY = y; fire("scroll"); }
  };
}
for (const width of [390, 1280]) for (const path of ["/", "/detail/solo", "/detail/duo", "/event/solo", "/event/duo", "/event/wedding"]) {
  const env = environment(path, width);
  env.window.wistiaAnalytics.startPageTracking(path);
  env.scroll(3200);
  assert.deepEqual(env.ga.filter(call => call[1] === "scroll_depth").map(call => call[2].percent), [25, 50, 75, 100]);
  env.advance(2000);
  env.location.pathname = "/contact";
  env.window.wistiaAnalytics.startPageTracking("/contact");
  env.location.pathname = path;
  env.window.wistiaAnalytics.startPageTracking(path);
  env.scroll(3200);
  assert.equal(env.ga.filter(call => call[1] === "scroll_depth" && call[2].page_path === path).length, 8);
  env.advance(2000); env.fire("pagehide");
  assert.equal(env.ga.filter(call => call[1] === "page_dwell").length, 2);
  env.fire("pageshow", { persisted: true }); env.scroll(3200);
  assert.equal(env.ga.filter(call => call[1] === "scroll_depth" && call[2].page_path === path).length, 12);
  for (const call of env.ga.filter(call => call[0] === "event")) {
    assert.match(call[2].visitor_id, /^wv_[a-f0-9]{32}$/);
    // page_view keeps the full page_location/referrer for GA4 campaign (UTM/gclid) attribution, as before funnel2.
    if (call[1] !== "page_view") assert.doesNotMatch(JSON.stringify(call), /PRIVATE/);
  }
}
const sections = environment("/");
sections.window.wistiaAnalytics.startPageTracking("/");
const observer = sections.observers[0];
observer.fn([{ target: observer.target, isIntersecting: true }]); // Tall section covers viewport.
sections.advance(1500); sections.hidden(true);
let sent = sections.ga.filter(call => call[1] === "section_view");
assert.equal(sent.length, 1); assert.equal(sent[0][2].seconds, 1);
assert.equal(sent[0][2].transport_type, "beacon");
sections.advance(10000); sections.hidden(false); sections.advance(2200);
observer.fn([{ target: observer.target, isIntersecting: false }]);
sent = sections.ga.filter(call => call[1] === "section_view");
assert.equal(sent.length, 2); assert.equal(sent[1][2].seconds, 2);
assert.equal(sections.meta.length, 2);
sections.fire("pagehide");
assert.equal(sections.ga.filter(call => call[1] === "section_view").length, 2);
assert.equal(observer.disconnected, true);
console.log("Visitor storage, privacy, mobile/desktop routes, SPA revisit, bfcache, tall-section timing and hidden flush passed");

const capped = environment("/detail/solo", 1280);
capped.window.wistiaAnalytics.startPageTracking("/detail/solo");
const capObserver = capped.observers[0];
capObserver.fn([{ target: capObserver.target, isIntersecting: true }]);
capped.advance(1900000); capped.fire("pagehide");
assert.equal(capped.ga.find(call => call[1] === "section_view")[2].seconds, 1800);
const short = environment("/"); short.window.wistiaAnalytics.startPageTracking("/");
const shortObserver = short.observers[0];
short.rect.height = 400; short.rect.bottom = 400;
shortObserver.fn([{ target: shortObserver.target, isIntersecting: true }]);
short.advance(600); shortObserver.fn([{ target: shortObserver.target, isIntersecting: false }]);
assert.equal(short.meta.length, 0);
shortObserver.fn([{ target: shortObserver.target, isIntersecting: true }]);
short.advance(600); shortObserver.fn([{ target: shortObserver.target, isIntersecting: false }]);
assert.equal(short.meta[0].seconds, 1);
