# Website telemetry

The static site posts page views and link clicks to `https://stats.jrdaniels.net/collect`. Open **https://stats.jrdaniels.net/** to sign in and view a basic table. Filter by event, exact page path, or IP; expand a row for details. Pages contain 100 events and can be downloaded as JSON. No chart framework or client dependencies.

This source lives under `.github/telemetry` because the existing GitHub Pages artifact action excludes `.github`. It is versioned with the site but deployed separately. `.github/workflows/static.yml` is unchanged. There are no credentials in this directory or in the public client script.

## Data

- Server timestamp, event type, page, link destination and label, referrer (URL queries/fragments and credentials stripped; mailto/tel addresses omitted).
- Raw Cloudflare client IP, approximate country/region/city/postal code/coordinates, ASN and network organization, edge location, HTTP and TLS versions, request ID.
- User agent, available browser client hints and language headers; client-reported language, time zone, screen/viewport sizes, pixel ratio and timestamp.
- No persistent visitor ID, tracking cookie, fingerprint hash, GPS request, or third-party IP lookup. Global Privacy Control and Do Not Track do not suppress collection.

Geo data describes the IP network, not a verified location or identity. Client-supplied events are untrusted and can be forged; the Origin allowlist stops normal cross-site browser submissions but does not authenticate visitors. Referrers and events may be missing because of browser policies, blockers, navigation, or quotas.

## Bounds and authentication

- Collection: 30 requests per IP per minute and 300 per minute per Cloudflare location. Cloudflare's rate-limit bindings are approximate and regional, not strict global counters; shared-network users can share the IP limit.
- D1 atomically accepts at most 5,000 events per UTC day and retains at most 50,000 events. Each event body is limited to 4 KiB and all stored fields have length limits. Older records are evicted first.
- Records older than 90 days are hidden immediately and deleted hourly at minute 17. D1 recovery backups follow Cloudflare's own retention. Database allocation can remain at its high-water mark after row deletion.
- Sign-in: five attempts per IP per minute plus a durable global cap of 30 attempts per ten-minute window. This can temporarily lock out the owner during an attack.
- Password verifier: salted PBKDF2-SHA256 (100,000 iterations), held as a Cloudflare Worker secret. Raw password is not stored. Session tokens use 256 random bits; only token hashes are stored in D1, at most 20 sessions, 12-hour expiry. Logout revokes the token server-side.
- Secure, HttpOnly, SameSite=Strict, host-only cookies; same-origin login/logout checks; no caching or framing; all event text escaped. Public collection never provides database reads.
- No automatic paid-plan upgrades. App quotas bound accepted data, not incoming Worker requests or D1 reads under an attack; Cloudflare account quotas still apply. Blocking/rate-limiting may lose analytics while the static site remains available.

## Development and deployment

Use Node.js 24.15+ with the pinned CLI version. The CLI/Vite packages are build tools only; the deployed Worker has no third-party runtime imports. Dependency overrides pin patched HTTP/image tooling. Install with `npm ci`, then `npm test`. Tests execute the deployed bundle in the Workers runtime and check authentication, session revocation/expiry, XSS escaping, validation, URL sanitization, collection with privacy signals present, daily/storage limits and cleanup.

The `cf` CLI is authenticated separately from Codex MCP. Run `cf auth login` if necessary. Account/database IDs in `cloudflare.config.ts` are identifiers, not secrets.

```sh
node scripts/database.mjs --dry-run  # preview schema initialization
node scripts/database.mjs           # idempotent schema initialization; not a migration system
cf deploy --dry-run
npm run deploy                     # preserves the existing password secret
```

First deployment or password rotation: `node scripts/deploy-with-password.mjs`, then enter the password on stdin. In a terminal input is hidden. Only the salted verifier is written to a temporary file outside the repository, uploaded via `--secrets-file`, and removed in a finally block. Never pass passwords in arguments or commit `.dev.vars`/`.env` files. After a password rotation, revoke existing sessions separately (`DELETE FROM sessions` using D1) if needed; changing the password does not revoke previously issued sessions automatically.

`node scripts/smoke-production.mjs` accepts the password on stdin and checks the live service. It writes a clearly named `/__telemetry_smoke_test` event; delete only that test path after verification. Local tests use a disposable in-memory database and a test-only password.

Cloudflare docs: [configuration](https://developers.cloudflare.com/cf/projects/cloudflare-config/), [rate-limit accuracy](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [D1](https://developers.cloudflare.com/d1/).
