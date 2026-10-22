import { dashboard, loginPage } from "./views.js";

const ORIGINS = new Set(["https://jrdaniels.net", "https://www.jrdaniels.net"]);
const RETENTION = 90 * 86400;
const SESSION_TTL = 12 * 3600;
const COOKIE = "__Host-telemetry";
const encoder = new TextEncoder();
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
const unhex = text => Uint8Array.from(text.match(/../g) || [], h => parseInt(h, 16));
const sha = async text => hex(await crypto.subtle.digest("SHA-256", encoder.encode(text)));
const short = (value, limit = 160) => typeof value === "string" ? value.slice(0, limit) : "";
const now = () => Math.floor(Date.now() / 1000);

function response(body, status = 200, extra = {}) {
  return new Response(body, { status, headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    // Browsers can send Origin: null on form POSTs with no-referrer.
    // Preserve same-origin form submissions while hiding referrers from other sites.
    "Referrer-Policy": "same-origin",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Strict-Transport-Security": "max-age=31536000",
    ...extra,
  } });
}

async function boundedBody(request, max) {
  if (Number(request.headers.get("content-length")) > max) throw new Error("body-size");
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) { await reader.cancel(); throw new Error("body-size"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}

// Keep URL paths useful without retaining query-string tokens or email addresses.
export function cleanUrl(input, pageOnly = false) {
  if (typeof input !== "string" || input.length > 2048) return "";
  try {
    const url = new URL(input);
    if (pageOnly && !ORIGINS.has(url.origin)) return "";
    if (url.protocol === "mailto:" || url.protocol === "tel:") return pageOnly ? "" : url.protocol;
    if (!["https:", "http:"].includes(url.protocol)) return "";
    return (pageOnly ? url.pathname : url.origin + url.pathname).slice(0, 768);
  } catch { return ""; }
}

async function collect(request, env) {
  const origin = request.headers.get("Origin");
  if (!ORIGINS.has(origin)) return response("Forbidden", 403);
  const cors = { "Access-Control-Allow-Origin": origin, Vary: "Origin" };
  if (request.method === "OPTIONS") return response(null, 204, { ...cors,
    "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" });
  if (request.method !== "POST") return response("Method not allowed", 405, cors);
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return response("Missing client address", 400, cors);
  if (!(await env.GLOBAL_LIMIT.limit({ key: "collection" })).success ||
      !(await env.COLLECT_LIMIT.limit({ key: ip })).success) return response("Rate limited", 429, { ...cors, "Retry-After": "60" });
  let data;
  try { data = JSON.parse(await boundedBody(request, 4096)); }
  catch { return response("Invalid event", 400, cors); }
  if (!data || typeof data !== "object" || !["pageview", "click"].includes(data.kind)) return response("Invalid event", 400, cors);
  const page = cleanUrl(data.page, true);
  const target = data.kind === "click" ? cleanUrl(data.target) : "";
  if (!page || (data.kind === "click" && !target)) return response("Invalid URL", 400, cors);
  const cf = request.cf || {};
  const dimension = n => Number.isInteger(n) && n >= 0 && n <= 20000 ? n : null;
  const details = {
    clientTime: short(data.time, 40),
    language: short(data.language, 80), timezone: short(data.timezone, 80),
    viewportWidth: dimension(data.viewportWidth), viewportHeight: dimension(data.viewportHeight),
    screenWidth: dimension(data.screenWidth), screenHeight: dimension(data.screenHeight),
    pixelRatio: typeof data.pixelRatio === "number" && data.pixelRatio > 0 && data.pixelRatio < 20 ? data.pixelRatio : null,
    linkText: short(data.linkText, 120),
    acceptLanguage: short(request.headers.get("Accept-Language"), 160),
    browserPlatform: short(request.headers.get("Sec-CH-UA-Platform"), 60),
    browserHints: short(request.headers.get("Sec-CH-UA"), 240),
    mobileHint: short(request.headers.get("Sec-CH-UA-Mobile"), 10),
    continent: short(cf.continent, 8), postalCode: short(cf.postalCode, 24),
    latitude: short(cf.latitude, 24), longitude: short(cf.longitude, 24),
    networkTimezone: short(cf.timezone, 80), regionCode: short(cf.regionCode, 24),
    colo: short(cf.colo, 10), httpProtocol: short(cf.httpProtocol, 20), tlsVersion: short(cf.tlsVersion, 20),
    ray: short(request.headers.get("CF-Ray"), 64),
  };
  const result = await env.DB.prepare(`INSERT INTO events
    (at,kind,page,target,referrer,ip,country,region,city,asn,network,ua,details)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(now(), data.kind, page, target,
    cleanUrl(data.referrer), short(ip, 64), short(cf.country, 8), short(cf.region, 80), short(cf.city, 80),
    Number.isInteger(cf.asn) ? cf.asn : null, short(cf.asOrganization, 160), short(request.headers.get("User-Agent"), 512),
    JSON.stringify(details)).run();
  return result.meta.changes ? response(null, 204, cors) : response("Daily event limit reached", 429, { ...cors, "Retry-After": "3600" });
}

async function verifyPassword(password, serialized) {
  const config = JSON.parse(serialized);
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const candidate = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unhex(config.salt), iterations: 100000 }, key, 256);
  // Web Crypto's HMAC verification provides a constant-time comparison.
  const compareKey = await crypto.subtle.importKey("raw", unhex(config.hash), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  const expected = await crypto.subtle.sign("HMAC", compareKey, unhex(config.hash));
  return crypto.subtle.verify("HMAC", compareKey, expected, candidate);
}

async function session(request, env) {
  const token = request.headers.get("Cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const hash = await sha(token);
  const row = await env.DB.prepare("SELECT hash FROM sessions WHERE hash=? AND expires>?").bind(hash, now()).first();
  return row?.hash || null;
}

async function login(request, env) {
  if (request.method === "GET") return response(loginPage());
  if (request.method !== "POST") return response("Method not allowed", 405);
  if (request.headers.get("Origin") !== new URL(request.url).origin) return response("Forbidden", 403);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!(await env.LOGIN_LIMIT.limit({ key: ip })).success) return response(loginPage("Too many attempts. Try again in a minute."), 429, { "Retry-After": "60" });
  // A single durable counter also limits distributed password guessing: 30 attempts / ten minutes.
  const window = Math.floor(now() / 600);
  const budget = await env.DB.prepare(`INSERT INTO login_budget VALUES(1,?,1)
    ON CONFLICT(id) DO UPDATE SET window=excluded.window,
    attempts=CASE WHEN login_budget.window=excluded.window THEN login_budget.attempts+1 ELSE 1 END
    RETURNING attempts`).bind(window).first();
  if (budget.attempts > 30) return response(loginPage("Sign-in is temporarily rate limited. Try again in ten minutes."), 429, { "Retry-After": "600" });
  let password;
  try { password = new URLSearchParams(await boundedBody(request, 1024)).get("password") || ""; }
  catch { return response(loginPage("Invalid request."), 400); }
  if (!await verifyPassword(password, env.PASSWORD_HASH)) return response(loginPage("Incorrect password."), 401);
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE expires <= ?").bind(now()),
    env.DB.prepare("DELETE FROM sessions WHERE hash IN (SELECT hash FROM sessions ORDER BY expires DESC LIMIT -1 OFFSET 19)"),
    env.DB.prepare("INSERT INTO sessions VALUES (?,?)").bind(await sha(token), now() + SESSION_TTL),
  ]);
  return response(null, 303, { Location: "/", "Set-Cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL}` });
}

async function records(url, env) {
  const clauses = ["at >= ?"];
  const values = [now() - RETENTION];
  const kind = url.searchParams.get("kind");
  if (["pageview", "click"].includes(kind)) { clauses.push("kind=?"); values.push(kind); }
  for (const field of ["ip", "page"]) {
    const value = short(url.searchParams.get(field), 768);
    if (value) { clauses.push(`${field}=?`); values.push(value); }
  }
  const before = Number(url.searchParams.get("before"));
  if (Number.isSafeInteger(before) && before > 0) { clauses.push("id < ?"); values.push(before); }
  const { results } = await env.DB.prepare(`SELECT * FROM events WHERE ${clauses.join(" AND ")} ORDER BY id DESC LIMIT 101`).bind(...values).all();
  const more = results.length > 100;
  const rows = results.slice(0, 100);
  const today = await env.DB.prepare("SELECT events FROM daily_usage WHERE day=?").bind(new Date().toISOString().slice(0, 10)).first();
  return { rows, more, today: today?.events || 0 };
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/collect") return collect(request, env);
  if (url.pathname === "/health") return response("ok", 200, { "Content-Type": "text/plain" });
  if (url.pathname === "/robots.txt") return response("User-agent: *\nDisallow: /\n", 200, { "Content-Type": "text/plain" });
  if (!env.PASSWORD_HASH) return response("Sign-in is not configured.", 503);
  if (url.pathname === "/login") return login(request, env);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!(await env.READ_LIMIT.limit({ key: ip })).success) return response("Rate limited", 429);
  const hash = await session(request, env);
  if (!hash) return response(null, 303, { Location: "/login" });
  if (url.pathname === "/logout" && request.method === "POST") {
    if (request.headers.get("Origin") !== url.origin) return response("Forbidden", 403);
    await env.DB.prepare("DELETE FROM sessions WHERE hash=?").bind(hash).run();
    return response(null, 303, { Location: "/login", "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
  }
  if (request.method !== "GET") return response("Method not allowed", 405);
  if (url.pathname !== "/" && url.pathname !== "/events.json") return response("Not found", 404);
  const data = await records(url, env);
  if (url.pathname === "/events.json") return response(JSON.stringify(data.rows.map(row => ({ ...row, details: JSON.parse(row.details) })), null, 2), 200,
    { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="telemetry.json"' });
  return response(dashboard(data, url));
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env); }
    catch { console.error(JSON.stringify({ event: "telemetry_request_failed", path: new URL(request.url).pathname })); return response("Service temporarily unavailable.", 503); }
  },
  async scheduled(_controller, env) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM events WHERE at < ?").bind(now() - RETENTION),
      env.DB.prepare("DELETE FROM daily_usage WHERE day < ?").bind(new Date((now() - RETENTION) * 1000).toISOString().slice(0, 10)),
      env.DB.prepare("DELETE FROM sessions WHERE expires <= ?").bind(now()),
    ]);
  },
};
