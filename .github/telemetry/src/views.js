export const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const layout = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · jrdaniels.net</title><style>
body{font:14px system-ui,sans-serif;margin:24px;color:#111;background:#fff}h1{font-size:22px}a{color:inherit}input,select,button{font:inherit;padding:6px}label{display:inline-block;margin:0 12px 12px 0}button{cursor:pointer}a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid #2255bb;outline-offset:2px}.toolbar{display:flex;gap:16px;align-items:center;flex-wrap:wrap}.table-wrap{overflow-x:auto;border:1px solid #aaa}table{border-collapse:collapse;width:100%;min-width:900px}th,td{padding:9px;border:1px solid #ddd;text-align:left;vertical-align:top}th{background:#eee}td{overflow-wrap:anywhere;max-width:260px}time,.ip{white-space:nowrap}summary{cursor:pointer}dl{min-width:220px}dt{font-weight:bold;margin-top:8px}dd{margin:0}p{line-height:1.5}.muted{color:#555}.error{color:#a00000}.login{max-width:380px;margin:10vh auto}.login input{box-sizing:border-box;width:100%}.login label{display:block}.pages{display:flex;gap:24px;margin:20px 0}@media(max-width:600px){body{margin:12px}}
</style></head><body>${body}</body></html>`;

export function loginPage(message = "") {
  return layout("Sign in", `<main class="login"><h1>Website telemetry</h1><p>Private event log for jrdaniels.net.</p>${message ? `<p role="alert" class="error">${escape(message)}</p>` : ""}<form method="post" action="/login"><label>Password <input type="password" name="password" autocomplete="current-password" maxlength="200" required autofocus></label><button>Sign in</button></form></main>`);
}

export function dashboard({ rows, more, today }, url) {
  const filters = name => escape(url.searchParams.get(name) || "");
  const next = new URLSearchParams(url.searchParams);
  next.set("before", rows.at(-1)?.id || "");
  const content = rows.map(row => {
    const details = JSON.parse(row.details);
    const extra = { "User agent": row.ua, "Referrer": row.referrer || "Direct / unavailable", ...details };
    return `<tr><td><time>${escape(new Date(row.at * 1000).toISOString().replace("T", " ").replace(".000Z", " UTC"))}</time><br>#${row.id}</td><td>${escape(row.kind)}<br>${escape(row.page)}</td><td>${escape(row.target || "—")}</td><td class="ip">${escape(row.ip)}</td><td>${escape([row.city, row.region, row.country].filter(Boolean).join(", "))}<br>${escape(row.network)} ${row.asn ? `(AS${row.asn})` : ""}</td><td><details><summary>Details</summary><dl>${Object.entries(extra).filter(([,v]) => v !== null && v !== "").map(([k,v]) => `<dt>${escape(k)}</dt><dd>${escape(v)}</dd>`).join("")}</dl></details></td></tr>`;
  }).join("");
  return layout("Event log", `<main><div class="toolbar"><h1>Website telemetry</h1><a href="/">Refresh / latest</a><a href="/events.json${escape(url.search)}">Download these rows (JSON)</a><form method="post" action="/logout"><button>Sign out</button></form></div>
  <p>${today.toLocaleString("en-US")} accepted events today (UTC), out of a 5,000 daily limit. Newest 50,000 events retained for up to 90 days. Times below are UTC.</p>
  <form method="get" action="/"><label>Event <select name="kind"><option value="">All</option value="pageview"${filters("kind") === "pageview" ? " selected" : ""}>Page view</option><option value="click"${filters("kind") === "click" ? " selected" : ""}>Link click</option></select></label><label>Page (exact path) <input name="page" value="${filters("page")}" placeholder="/about.html"></label><label>IP (exact) <input name="ip" value="${filters("ip")}" maxlength="64"></label><button>Filter</button></form>
  <div class="table-wrap" tabindex="0" role="region" aria-label="Event log; scroll horizontally for all columns"><table><thead><tr><th scope="col">Received</th><th scope="col">Event / page</th><th scope="col">Link destination</th><th scope="col">IP</th><th scope="col">Location / network</th><th scope="col">More</th></tr></thead><tbody>${content || '<tr><td colspan="6">No events match these filters.</td></tr>'}</tbody></table></div>
  <nav class="pages" aria-label="Log pages"><a href="/">Newest events</a>${more ? `<a href="/?${escape(next)}">Older events →</a>` : ""}</nav><p class="muted">Location is inferred from the network and may be inaccurate. Client event data can be spoofed. Referrers may be absent; URL queries and fragments are removed. Browser privacy settings and blockers can prevent collection.</p></main>`);
}
