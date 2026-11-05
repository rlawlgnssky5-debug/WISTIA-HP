import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const require = createRequire(import.meta.url);
function loadChromium() {
  for (const name of ["playwright", "playwright-core"]) {
    try { return require(name).chromium; } catch {}
  }
  return null;
}
const chromium = loadChromium();
const executable = process.env.WISTIA_BROWSER_EXECUTABLE || "/usr/bin/google-chrome";

async function freePort() {
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, "127.0.0.1", resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  return port;
}

function pixelSnapshot(page) {
  return page.evaluate(() => {
    const pixel = window.__pixel || [];
    const inquiryOpen = pixel.filter(call => call[0] === "fbq" && call[1] === "trackCustom" && call[2] === "InquiryOpen");
    const inquiry_open = pixel.filter(call => call[0] === "gtag" && call[1] === "event" && call[2] === "inquiry_open");
    const kakao = pixel.filter(call => call[0] === "fbq" && ((call[1] === "track" && call[2] === "Contact") || (call[1] === "trackCustom" && call[2] === "KakaoTalkClick")));
    const open = inquiryOpen.at(-1);
    const ga = inquiry_open.at(-1);
    return {
      inquiryOpen: inquiryOpen.length,
      inquiry_open: inquiry_open.length,
      kakao: kakao.length,
      meta: open ? open[3] : null,
      ga: ga ? ga[3] : null,
      vid: localStorage.getItem("wistia_vid"),
      form: !!document.querySelector("#contactInquiryForm"),
      dialog: document.querySelector("#mediaDialog")?.open === true,
      path: location.pathname + location.search
    };
  });
}

test("InquiryOpen fires only when the inquiry form opens", { skip: chromium ? false : "Playwright is not installed", timeout: 180000 }, async () => {
  const port = await freePort();
  const server = spawn(process.execPath, ["scripts/local-preview.mjs"], {
    env: { ...process.env, WISTIA_PREVIEW_PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("preview timeout")), 10000);
      server.stdout.once("data", () => { clearTimeout(timer); resolve(); });
      server.once("error", reject);
    });
    browser = await chromium.launch({
      headless: true,
      executablePath: executable,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--host-resolver-rules=MAP wistia.localhost 127.0.0.1"]
    });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => {
      window.__pixel = [];
      window.fbq = function () { window.__pixel.push(["fbq", ...arguments]); };
      window.gtag = function () { window.__pixel.push(["gtag", ...arguments]); };
    });
    await context.route("**/*", route => {
      const host = new URL(route.request().url()).hostname;
      if (host === "wistia.localhost" || host === "127.0.0.1") return route.continue();
      return route.abort();
    });
    const page = await context.newPage();
    const origin = `http://wistia.localhost:${port}`;
    await page.goto(origin + "/detail/solo", { waitUntil: "domcontentloaded" });
    await page.locator(".ed-hero-consult").waitFor({ state: "visible" });
    const vid = await page.evaluate(() => localStorage.getItem("wistia_vid"));
    assert.match(vid, /^wv_[a-f0-9]{16,64}$/);

    await page.locator(".ed-hero-consult").click();
    await page.locator("#mediaDialog .consult-choice-dialog").waitFor({ state: "visible" });
    let snap = await pixelSnapshot(page);
    assert.equal(snap.inquiryOpen, 0, "choice dialog must not emit InquiryOpen");
    assert.equal(snap.inquiry_open, 0);
    assert.equal(snap.form, false);
    assert.equal(snap.dialog, true);
    assert.match(await page.locator("#mediaDialog h2").innerText(), /어떤 상담이 편하신가요/);

    const kakaoHref = await page.locator("#mediaDialog .consult-choice-direct").getAttribute("href");
    assert.match(kakaoHref, /^https:\/\/pf\.kakao\.com\/_GbExjX\/chat/);
    const popupPromise = page.waitForEvent("popup", { timeout: 8000 });
    await page.locator("#mediaDialog .consult-choice-direct").click();
    const popup = await popupPromise;
    await popup.close();
    await page.waitForFunction(() => document.querySelector("#mediaDialog")?.open !== true);
    snap = await pixelSnapshot(page);
    assert.equal(snap.inquiryOpen, 0, "Kakao choice must not emit InquiryOpen");
    assert.equal(snap.inquiry_open, 0);
    assert.equal(snap.kakao, 0, "consult-choice Kakao is not the Contact or floating Kakao path");
    assert.equal(snap.form, false);
    assert.equal(new URL(page.url()).pathname, "/detail/solo");

    await page.locator(".ed-hero-consult").click();
    await page.locator("#mediaDialog .consult-choice-form").click();
    await page.locator("#contactInquiryForm").waitFor({ state: "visible" });
    await page.waitForTimeout(500);
    snap = await pixelSnapshot(page);
    assert.equal(snap.inquiryOpen, 1);
    assert.equal(snap.inquiry_open, 1);
    assert.equal(snap.meta.button_location, "consult_choice_form");
    assert.equal(snap.meta.button_label, "문의 양식 작성하고 상담받을래요!");
    assert.equal(snap.ga.button_location, snap.meta.button_location);
    assert.equal(snap.ga.button_label, snap.meta.button_label);
    assert.equal(snap.ga.page_path, "/detail/solo");
    assert.equal(snap.vid, vid);
    assert.doesNotMatch(JSON.stringify(snap.meta) + JSON.stringify(snap.ga), /package=|@[a-z]|010/);
    assert.match(page.url(), /\/event\/solo/);

    await page.goto(origin + "/detail/solo", { waitUntil: "domcontentloaded" });
    await page.locator(".package-inquiry-link").click();
    await page.locator("#contactInquiryForm").waitFor({ state: "visible" });
    await page.waitForTimeout(500);
    snap = await pixelSnapshot(page);
    assert.equal(snap.inquiryOpen, 1);
    assert.equal(snap.inquiry_open, 1);
    assert.equal(snap.meta.button_location, "package-inquiry-link");
    assert.equal(snap.meta.button_label, "선택한 구성으로 문의양식 작성");
    assert.equal(snap.vid, vid);
    assert.match(page.url(), /\/event\/solo/);

    await page.goto(origin + "/detail/solo", { waitUntil: "domcontentloaded" });
    await page.locator("#arcRecording").waitFor();
    await page.evaluate(() => {
      const point = document.querySelector("#arcRecording");
      const header = document.getElementById("siteHeader");
      const top = header ? header.getBoundingClientRect().bottom : 0;
      window.scrollBy(0, point.getBoundingClientRect().bottom - top + 24);
    });
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".solo-footer-inquiry")).pointerEvents === "auto");
    await page.locator(".solo-footer-inquiry").click();
    await page.locator("#contactInquiryForm").waitFor({ state: "visible" });
    await page.waitForTimeout(500);
    snap = await pixelSnapshot(page);
    assert.equal(snap.inquiryOpen, 1);
    assert.equal(snap.inquiry_open, 1);
    assert.equal(snap.meta.button_location, "detail_footer_fixed");
    assert.equal(snap.meta.button_label, "문의양식 작성");
    assert.equal(snap.ga.button_label, "문의양식 작성");
    assert.equal(snap.vid, vid);
    assert.equal(await page.locator("#contactInquiryForm").count(), 1);
    console.log("Choice dialog skipped InquiryOpen; form choice, package link, and footer each fired once");
  } finally {
    await browser?.close();
    server.kill();
  }
});
