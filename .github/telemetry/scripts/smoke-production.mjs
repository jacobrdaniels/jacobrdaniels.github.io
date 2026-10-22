import assert from "node:assert/strict";
process.stdout.write("Waiting for dashboard password on stdin.\n");
if (process.stdin.isTTY) process.stdin.setRawMode(true);
let input = "";
for await (const chunk of process.stdin) { input += chunk; if (/[\r\n]/.test(input)) break; }
if (process.stdin.isTTY) process.stdin.setRawMode(false);
const password = input.replace(/[\r\n]+$/, "");
const root = "https://stats.jrdaniels.net";
const get = (path, options = {}) => fetch(root + path, { redirect: "manual", ...options });
assert.equal((await get("/events.json")).status, 303);
assert.equal((await get("/collect", { method: "POST", headers: { Origin: "https://evil.test" }, body: "{}" })).status, 403);
const login = await get("/login", { method: "POST", headers: { Origin: root, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ password }) });
assert.equal(login.status, 303, "Production password sign-in");
const Cookie = login.headers.get("set-cookie").split(";")[0];
try {
  assert.equal((await get("/", { headers: { Cookie } })).status, 200);
  const event = await get("/collect", { method: "POST", headers: { Origin: "https://jrdaniels.net", "Content-Type": "text/plain" },
    body: JSON.stringify({ kind: "pageview", page: "https://jrdaniels.net/__telemetry_smoke_test?secret=discard", time: new Date().toISOString() }) });
  assert.equal(event.status, 204, "Production event ingestion");
  const result = await get("/events.json?page=/__telemetry_smoke_test", { headers: { Cookie } });
  assert.equal(result.status, 200);
  const rows = await result.json();
  assert.ok(rows.length > 0 && rows[0].ip && rows[0].page === "/__telemetry_smoke_test");
  console.log("Production checks passed: private reads, origin rejection, password sign-in, event ingestion, raw IP, query stripping, authenticated export.");
} finally {
  assert.equal((await get("/logout", { method: "POST", headers: { Cookie, Origin: root } })).status, 303);
  assert.equal((await get("/events.json", { headers: { Cookie } })).status, 303);
  console.log("Logout revokes the session.");
}
