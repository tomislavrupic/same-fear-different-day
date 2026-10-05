# D13-404 reports service

The site is on GitHub Pages. This separate Worker persists reports in D1. Reports publish immediately once authors acknowledge public visibility; song consent is independent and defaults to false. The public wall has cursor pagination, never injects user HTML, and never displays IP addresses. Rate limits cover writes; body, string and selection limits apply server-side. No fictional seed reports.

Use the installed Wrangler CLI. Local steps:

1. `wrangler d1 execute DB --local --file schema.sql`
2. Put `ADMIN_TOKEN=local-test-owner` in ignored `.dev.vars` for local tests only.
3. `wrangler dev --port 8787`
4. Serve `site` on port 4173; temporarily point `config.json` to port 8787 for local development, then restore the deployed URL.
5. `npm run test:reports` at repository root checks CORS, D1 persistence, deduplication and authenticated removal using a temporary local record.

Deploy:

1. Authenticate Wrangler with account/Workers/D1 permissions.
2. `wrangler d1 create kitikat-hurt-feelings`; save returned database ID in config.
3. `wrangler d1 execute DB --remote --file schema.sql`
4. Generate a fresh owner secret, store in ignored `.hurt-feelings-admin-token` with mode 0600, and upload via `wrangler secret put ADMIN_TOKEN`. Never expose it in client assets or logs.
5. `wrangler deploy`, put the returned HTTPS Workers URL in site/hurt-feelings/config.json, and rebuild the Pages site.
6. Verify a real submission/read/receipt and remove the test using the owner tool.

Owner removal: `node scripts/remove-report.mjs REPORT_UUID`. Hidden reports leave the public feed immediately. They remain stored for owner audit until deleted from D1. Public-facing text makes no promise of automatic song generation or emotional resolution.
