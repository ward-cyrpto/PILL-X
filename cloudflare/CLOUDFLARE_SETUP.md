# PILL-X Cloudflare Configuration
# ─────────────────────────────────────────────────────────────────────────────
# This file documents the required Cloudflare DNS + Workers / Pages settings.
# Apply these settings in the Cloudflare dashboard or via the Cloudflare API.
# ─────────────────────────────────────────────────────────────────────────────

## 1. DNS Records for pill-x.com

| Type  | Name           | Value / Target                        | Proxy  |
|-------|----------------|---------------------------------------|--------|
| A     | @              | <your-server-ip>  OR  Pages CNAME     | ✅ Yes |
| CNAME | www            | pill-x.com                            | ✅ Yes |
| CNAME | pillx          | pill-x.com                            | ✅ Yes |
| TXT   | @              | v=spf1 include:paypal.com ~all        | ❌ No  |

## 2. Domain: pillx.nextgen.com

This subdomain should be managed in the `nextgen.com` Cloudflare zone:

| Type  | Name           | Value / Target                        | Proxy  |
|-------|----------------|---------------------------------------|--------|
| CNAME | pillx          | pill-x.com                            | ✅ Yes |

Or if hosted on Cloudflare Pages:

| Type  | Name           | Value / Target                        | Proxy  |
|-------|----------------|---------------------------------------|--------|
| CNAME | pillx          | pill-x.pages.dev                      | ✅ Yes |

## 3. Cloudflare Pages Deployment

Project name: pill-x
Production branch: main
Build command:    npm run build
Build output dir: frontend/.next
Root directory:   /

Environment variables (set in Cloudflare Pages dashboard):
  NODE_VERSION=20
  NEXT_PUBLIC_PAYPAL_CLIENT_ID=<from PayPal developer dashboard>
  NEXT_PUBLIC_BASE_URL=https://pill-x.com
  NEXT_PUBLIC_CONTRACT_ADDRESS=<after contract deployment>
  METADATA_DIR=/path/to/metadata/tokens
  SERIALS_FILE=/path/to/metadata/serials.json

## 4. Cloudflare SSL/TLS

- Mode: Full (strict)
- Always Use HTTPS: ON
- Min TLS Version: 1.2
- Automatic HTTPS Rewrites: ON

## 5. Page Rules / Cache Rules

Rule 1 — Metadata API (long cache):
  URL pattern: pill-x.com/api/metadata/*
  Cache Level:  Cache Everything
  Edge Cache TTL: 1 day

Rule 2 — NFC verify (no cache):
  URL pattern: pill-x.com/verify/*
  Cache Level: Bypass

Rule 3 — Static assets (aggressive cache):
  URL pattern: pill-x.com/_next/static/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month

## 6. Cloudflare Workers (optional NFC redirect)

If you want NFC taps to resolve ultra-fast at the edge, deploy the
Worker in cloudflare/nfc-worker.js to intercept:
  https://pill-x.com/nfc/<serial>
and redirect to the correct pill page without hitting the origin.

## 7. Custom Error Pages

Configure in Cloudflare dashboard under Custom Pages:
- 404: https://pill-x.com/404
- 500: https://pill-x.com/500

## 8. Security Headers (via Transform Rules)

Add these response headers:
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=()
  Content-Security-Policy: default-src 'self' https://www.paypal.com https://pillx.nextgen.com; script-src 'self' 'unsafe-inline' https://www.paypal.com; img-src 'self' data: https:;
