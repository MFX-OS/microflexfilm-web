# Microflexfilm.com — Deployment & Operations

## How this site deploys
- **App (pages/UI):** Firebase **App Hosting** auto-builds and releases on every push to `main` (repo `MFX-OS/microflexfilm-web`). There is no manual `firebase deploy` for the app.
- **Build config:** `apphosting.yaml`. Public Firebase web config + GA ID live there; secrets (SMTP) are set via `firebase apphosting:secrets:set`.

## ⚠️ Shared Firestore project — rules governance
This site and the internal **MFX-OS** app share the same Firebase project: **`mfx-2026`** (same Firestore, same Storage).

**Only the MFX-OS repo deploys Firestore/Storage rules.** This website's `firebase.json` intentionally does **not** declare `firestore` or `storage` blocks. Never add them, and never run `firebase deploy --only firestore:rules` / `--only storage` from this folder — doing so **overwrites the OS's production rules** and breaks the internal app and the client portal.

- Rules source of truth: `MFX-OS copy/firestore.rules` and `MFX-OS copy/storage.rules`.
- To change portal data access, edit and deploy rules from the **MFX-OS** folder only.

## Dependencies / security
- After dependency changes, run `npm audit` and `npm audit fix` (review any breaking-change fixes before `--force`). Current known: a handful of moderate/high transitive advisories — review periodically.
- `firebase-service-account.json` is **gitignored** (never commit it). Rotate immediately if it is ever exposed.

## Analytics & consent
- GA4 (`G-JSN4SZ1J2Z`) runs through **Google Consent Mode v2** — analytics are **denied by default** and only enabled after the visitor accepts in the consent banner. Microsoft Clarity (optional, `NEXT_PUBLIC_CLARITY_ID`) loads only after consent.
- Keep the Terms "Cookies & Analytics" section aligned with this (analytics with consent).

## Configurator
- Price/MOQ/lead time shown in `/configurator` are an **indicative range**, clearly labeled "confirmed on quote." To make them authoritative, wire `estimate()` in `PackageConfigurator.tsx` to the OS pricing logic (`pricedQtys`).

## Portal — implemented & remaining
**Implemented:** Admin-SDK server actions (ownership-validated), per-user **rate limiting** on PO submission, messaging, quote requests, and profile-change requests (`_portalRateLimits`).

**Remaining follow-ups (not yet built):**
1. **Message read receipts** — set a `readByClient` flag on team messages when a client opens a quote thread, so the unread badge is exact (currently best-effort).
2. **OS-side approval screen** — a view in MFX-OS for staff to review/approve the portal's `portalProfileChanges` (CRM edits) and apply them to the `customers` record. Today these arrive by email + are applied manually.
3. **Instant quote estimator** — connect the configurator/calculator inputs to real OS pricing for a live, authoritative quote.

## Routine smoke test after a deploy
- `/` hero (video on desktop, poster on mobile), `/configurator`, `/materials` (3D studio), `/faq` (packaging helper), `/portal` (sign-in), `sitemap.xml`, `robots.txt`, and a shared link preview (OG image).
