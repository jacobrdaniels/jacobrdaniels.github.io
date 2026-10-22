import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const source = readFileSync(new URL("../../../telemetry.js", import.meta.url), "utf8");
function client({ hostname = "jrdaniels.net", privacy = {}, prerendering = false } = {}) {
  const sent = [], listeners = {};
  class Element { closest() { return this; } hasAttribute() { return false; } }
  const document = { referrer: "https://example.org/source?private=value", prerendering, addEventListener: (name, fn) => { listeners[name] = fn; } };
  const sandbox = { location: { hostname, href: `https://${hostname}/about.html?secret=value#story` }, navigator: { language: "en-US", ...privacy }, window: {}, document,
    screen: { width: 1920, height: 1080 }, innerWidth: 1200, innerHeight: 800, devicePixelRatio: 1.25, Element, URL, Intl, Date,
    fetch: (url, options) => { sent.push({ url, options, event: JSON.parse(options.body) }); return Promise.resolve({ status: 204 }); } };
  runInNewContext(source, sandbox);
  return { sent, listeners, Element };
}
test("client logs sanitized production page views without credentials", () => {
  const { sent } = client(); assert.equal(sent.length, 1);
  assert.equal(sent[0].event.page, "https://jrdaniels.net/about.html");
  assert.equal(sent[0].event.referrer, "https://example.org/source");
  assert.equal(sent[0].options.credentials, "omit"); assert.equal(sent[0].options.keepalive, true);
});
test("client respects privacy preferences and exact production hostnames", () => {
  for (const hostname of ["localhost", "jrdaniels.net.evil.test", "stats.jrdaniels.net"]) assert.equal(client({ hostname }).sent.length, 0);
  assert.equal(client({ privacy: { globalPrivacyControl: true } }).sent.length, 0);
  assert.equal(client({ privacy: { doNotTrack: "1" } }).sent.length, 0);
});
test("client handles keyboard clicks, middle clicks, and redacts mail addresses", () => {
  const c = client(); const link = new c.Element();
  link.href = "https://example.net/target?token=private#anchor"; link.textContent = "My project";
  c.listeners.click({ type: "click", target: link, button: 0 });
  c.listeners.auxclick({ type: "auxclick", target: link, button: 1 });
  c.listeners.auxclick({ type: "auxclick", target: link, button: 2 });
  assert.equal(c.sent.length, 3); assert.equal(c.sent[1].event.target, "https://example.net/target");
  link.href = "mailto:private@example.net"; link.textContent = "private@example.net";
  c.listeners.click({ type: "click", target: link });
  assert.equal(c.sent.at(-1).event.target, "mailto:"); assert.equal(c.sent.at(-1).event.linkText, "");
});
test("prerendered pages wait for activation", () => {
  const c = client({ prerendering: true }); assert.equal(c.sent.length, 0);
  c.listeners.prerenderingchange(); assert.equal(c.sent.length, 1);
});
