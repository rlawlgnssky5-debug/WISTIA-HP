import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');

test('fresh home records the first inquiry click before lazy form scripts load, without duplicates', () => {
  const meta = [], ga = [], server = [], listeners = [];
  const location = { protocol: 'https:', hostname: 'www.wistiastudio.com',
    origin: 'https://www.wistiastudio.com', pathname: '/', search: '',
    href: 'https://www.wistiastudio.com/' };
  const window = { fbq: (...args) => meta.push(args), gtag: (...args) => ga.push(args), addEventListener() {} };
  const document = { cookie: '', documentElement: {},
    head: { appendChild() {} }, createElement: () => ({}), querySelector: () => null,
    addEventListener: (type, fn) => { if (type === 'click') listeners.push(fn); } };
  const context = { window, document, location, URL, URLSearchParams, Date,
    crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000001' },
    fetch: (url, options) => { server.push({ url, body: JSON.parse(options.body) }); return Promise.resolve({}); },
    MutationObserver: class { observe() {} }, queueMicrotask, setTimeout };
  const trackingFiles = new Set(['js/tracking-common.js', 'js/meta-pixel.js', 'js/analytics.js', 'js/inquiry-funnel.js']);
  const loadTracking = sources => {
    for (const src of sources) {
      const file = src.split('?')[0].replace(/^\//, '');
      if (trackingFiles.has(file)) runInNewContext(readFileSync(new URL(file, root), 'utf8'), context, { filename: file });
    }
  };
  // Follow the real home document's eager vs. lazy loading boundary.
  loadTracking([...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)].map(match => match[1]));
  const link = { id: '', classList: [], textContent: '문의양식 작성하기',
    disabled: false, closest: () => null, hasAttribute: () => false,
    getAttribute: name => name === 'href' ? '/event/solo' : null,
    matches: () => false };
  const click = () => listeners.forEach(fn => fn({ isTrusted: true, target: { closest: () => link } }));
  click();
  const opens = () => meta.filter(call => call[1] === 'InquiryOpen');
  assert.equal(opens().length, 1, 'first home inquiry click must emit InquiryOpen before form scripts load');
  assert.equal(ga.filter(call => call[1] === 'inquiry_open').length, 1);
  assert.equal(server.filter(call => call.body.kind === 'inquiry_open').length, 1);
  assert.equal(opens()[0][2].button_location, 'inquiry_link');
  assert.equal(opens()[0][2].page_path, '/');
  assert.equal(opens()[0][3].eventID, server[0].body.event_id);
  loadTracking([...html.matchAll(/<template\b[^>]*data-inquiry-script="([^"]+)"/g)].map(match => match[1]));
  assert.equal(opens().length, 1, 'loading the form must not replay the opening event');
  click();
  assert.equal(opens().length, 2, 'a second real click must produce only one more event');
  assert.equal(server.length, 2, 'lazy loading must not register a second tracking listener');
});
