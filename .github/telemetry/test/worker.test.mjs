import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import worker from "../src/index.js";

let mf, db;
const password = "local-test-password-only";
const salt = randomBytes(16).toString("hex");
const fixture = { kind: "pageview", page: "https://jrdaniels.net/about.html?token=secret#story", referrer: "https://example.org/from?key=secret" };
const headers = { Origin: "https://jrdaniels.net", "CF-Connecting-IP": "192.0.2.12", "Content-Type": "text/plain" };
const request = (path, options = {}) => mf.dispatchFetch("https://stats.example.com" + path, { redirect: "manual", ...options });
const post = (data = fixture, extra = {}) => request("/collect", { method: "POST", headers: { ...headers, ...extra }, body: JSON.stringify(data) });
async function signIn(value = password) {
  return request("/login", { method: "POST", headers: { Origin: "https://stats.example.com", "CF-Connecting-IP": "192.0.2.33", "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ password: value }).toString() });
}
before(async () => {
  const hash = pbkdf2Sync(password, Buffer.from(salt, "hex"), 100000, 32, "sha256").toString("hex");
  mf = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: ".cloudflare/output/v0/workers/default/bundle/index.js", compatibilityDate: "2026-10-22", d1Databases: ["DB"], cf: false,
    bindings: { PASSWORD_HASH: JSON.stringify({ salt, hash }) },
    ratelimits: Object.fromEntries(["COLLECT_LIMIT", "GLOBAL_LIMIT", "LOGIN_LIMIT", "READ_LIMIT"].map((name, i) => [name, { namespace_id: String(i + 1), simple: { limit: 10000, period: 60 } }])) }));
  db = await mf.getD1Database("DB");
  // D1.exec splits at newlines; prepare each complete SQL statement, including triggers.
  const schema = readFileSync("schema.sql", "utf8").replace(/--[^\n]*/g, "");
  const statements = schema.match(/CREATE TRIGGER[\s\S]*?END;|CREATE (?:TABLE|INDEX)[\s\S]*?;/g);
  await db.batch(statements.map(sql => db.prepare(sql)));
});
after(async () => { if (mf) await mf.dispose(); });

test("private routes require login; health exposes no data", async () => {
  assert.equal((await request("/login")).headers.get("referrer-policy"), "same-origin");
  for (const path of ["/", "/events.json"]) { const r = await request(path); assert.equal(r.status, 303); assert.equal(r.headers.get("location"), "/login"); }
  assert.equal(await (await request("/health")).text(), "ok");
});
test("collector rejects foreign origins, malformed events, and oversized streamed bodies", async () => {
  assert.equal((await post(fixture, { Origin: "https://jrdaniels.net.evil.test" })).status, 403);
  assert.equal((await post({ ...fixture, kind: "anything" })).status, 400);
  assert.equal((await post({ ...fixture, page: "https://evil.test/" })).status, 400);
  assert.equal((await post({ ...fixture, padding: "x".repeat(5000) })).status, 400);
});
test("events use trusted IP header and strip URL secrets", async () => {
  assert.equal((await post({ ...fixture, ip: "spoofed", ua: "spoofed" })).status, 204);
  const row = await db.prepare("SELECT * FROM events ORDER BY id DESC LIMIT 1").first();
  assert.equal(row.ip, "192.0.2.12"); assert.equal(row.page, "/about.html"); assert.equal(row.referrer, "https://example.org/from"); assert.notEqual(row.ua, "spoofed");
});
test("GPC and Do Not Track headers do not suppress storage", async () => {
  const count = (await db.prepare("SELECT COUNT(*) AS n FROM events").first()).n;
  assert.equal((await post(fixture, { "Sec-GPC": "1" })).status, 204);
  assert.equal((await post(fixture, { DNT: "1" })).status, 204);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM events").first()).n, count + 2);
});
test("login, cookie protections, escaping, filters, and logout", async () => {
  assert.equal((await signIn("wrong")).status, 401);
  const result = await signIn(); assert.equal(result.status, 303);
  const setCookie = result.headers.get("set-cookie");
  for (const flag of ["HttpOnly", "Secure", "SameSite=Strict", "Path=/"]) assert.ok(setCookie.includes(flag));
  const Cookie = setCookie.split(";")[0];
  const token = Cookie.split("=")[1];
  const stored = await db.prepare("SELECT hash FROM sessions").first(); assert.notEqual(stored.hash, token);
  await post({ ...fixture, kind: "click", target: "https://example.org/", linkText: '<img src=x onerror="alert(1)">' });
  const html = await (await request("/", { headers: { Cookie } })).text();
  assert.ok(html.includes("&lt;img")); assert.ok(!html.includes('<img src=x'));
  const filtered = await request("/events.json?kind=click", { headers: { Cookie } });
  assert.equal(filtered.headers.get("cache-control"), "no-store"); assert.equal((await filtered.json()).every(r => r.kind === "click"), true);
  assert.equal((await request("/logout", { method: "POST", headers: { Cookie, Origin: "https://evil.test" } })).status, 403);
  assert.equal((await request("/logout", { method: "POST", headers: { Cookie, Origin: "https://stats.example.com" } })).status, 303);
  assert.equal((await request("/", { headers: { Cookie } })).status, 303);
});
test("forged and expired sessions cannot read data; cross-site login is rejected", async () => {
  assert.equal((await request("/events.json", { headers: { Cookie: "__Host-telemetry=" + "a".repeat(64) } })).status, 303);
  const login = await signIn(); const Cookie = login.headers.get("set-cookie").split(";")[0];
  await db.prepare("UPDATE sessions SET expires=0").run();
  assert.equal((await request("/events.json", { headers: { Cookie } })).status, 303);
  assert.equal((await request("/login", { method: "POST", headers: { Origin: "https://evil.test" }, body: "password=x" })).status, 403);
});
test("durable daily limit rejects additional events", async () => {
  const day = new Date().toISOString().slice(0, 10);
  await db.prepare("UPDATE daily_usage SET events=5000 WHERE day=?").bind(day).run();
  assert.equal((await post()).status, 429);
  await db.prepare("UPDATE daily_usage SET events=0 WHERE day=?").bind(day).run();
});
test("database trigger enforces rolling 50,000-id storage window", async () => {
  const old = (await db.prepare("SELECT MIN(id) AS id FROM events").first()).id;
  await db.prepare("UPDATE sqlite_sequence SET seq=? WHERE name='events'").bind(old + 50000).run();
  assert.equal((await post()).status, 204);
  assert.equal(await db.prepare("SELECT id FROM events WHERE id=?").bind(old).first(), null);
});
test("distributed login attempts hit the durable budget", async () => {
  await db.prepare("UPDATE login_budget SET window=?, attempts=30 WHERE id=1").bind(Math.floor(Date.now() / 600000)).run();
  assert.equal((await signIn()).status, 429);
});
test("scheduled cleanup removes expired events, sessions, and counters", async () => {
  await db.prepare("UPDATE events SET at=0").run();
  await db.prepare("INSERT INTO daily_usage VALUES('2000-01-01',1)").run();
  await worker.scheduled({}, { DB: db });
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM events").first()).n, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM sessions WHERE expires<=?").bind(Math.floor(Date.now()/1000)).first()).n, 0);
  assert.equal(await db.prepare("SELECT * FROM daily_usage WHERE day='2000-01-01'").first(), null);
});
test("collection rate limiting returns 429 before storing events", async () => {
  const env = await mf.getBindings();
  const before = (await db.prepare("SELECT COUNT(*) AS n FROM events").first()).n;
  const blocked = await worker.fetch(new Request("https://stats.example.com/collect", { method: "POST", headers, body: JSON.stringify(fixture) }),
    { ...env, GLOBAL_LIMIT: { limit: async () => ({ success: true }) }, COLLECT_LIMIT: { limit: async () => ({ success: false }) } });
  assert.equal(blocked.status, 429);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM events").first()).n, before);
});
