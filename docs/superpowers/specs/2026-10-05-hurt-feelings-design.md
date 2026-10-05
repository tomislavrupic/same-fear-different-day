# D13-404 Hurt Feelings Report

Approved in conversation: neon mobile-friendly form based on supplied artwork, all five sections, optional name, separate unchecked song consent, receipt. User explicitly selected a public wall of reports; this overrides the private storage phrase in the approval question.

Create `/hurt-feelings/` in existing GitHub Pages store. Link from Support and footer. Artwork is a visual reference, not an image of unusable controls. Header art uses supplied KitiKat crop; actual inputs are semantic HTML. Name/date, single offence scale 0–10, multi-select causes, effects and locations, 500-character message, preferences, and single final verdict. Additional "Other" fields bounded to 80 characters. Keyboard and mobile usable, reduced motion respected.

Submission requires explicit acknowledgement that submitted name and report are public. Song-use permission is a separate false-by-default boolean. Do not request email or publish IP. Public wall shows latest 24 reports, supports pagination, and escapes all content using textContent. No fabricated seed submissions. Error states never claim a successful post. Honeypot, strict validation, request size limits, rate limit binding, same-site allowed origins, UUID idempotency, owner-secret removal endpoint. No third-party analytics.

Cloudflare Worker + D1 database separate from static site. API GET/POST `/reports`, POST `/reports/:id/remove` requires server-side secret. Removal token never shipped to browsers. Reports are immediately visible to honour public-wall request. Removal via local CLI; retention and permission scope described in form copy.

Verify validation failures, write/read/idempotency, HTML injection handling, mobile layout, keyboard submission, consent distinctions, failure/retry, receipt, store link/build and deployed endpoints. GitHub deployment remains static; backend deployment distinct. Auth may require user login; source and local test work proceeds independently.
