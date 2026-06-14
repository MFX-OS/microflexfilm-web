# Client Portal — Go-Live Runbook

Run these on your machine (the repo is connected to Firebase App Hosting, which
auto-builds on push to `main`). Project: **mfx-2026** · Site: **microflexfilm.com**

---

## 1. Verify it builds (do this first — non-negotiable)

```bash
cd Website
npm install            # picks up firebase/storage usage
npm run typecheck      # tsc --noEmit  → must pass clean
npm run build          # next build    → must succeed
```

If both pass, you're safe to deploy. If not, fix before pushing — this is a live site.

---

## 2. One-time Firebase Console setup

These make the new sign-in + uploads actually work in production.

1. **Authentication → Sign-in method**
   - Enable **Email/Password**, then turn ON **Email link (passwordless sign-in)**.
   - (Google is already enabled.)
2. **Authentication → Settings → Authorized domains**
   - Confirm `microflexfilm.com` is listed (add it if not). The magic link
     redirects here.
3. **Storage**
   - If Cloud Storage isn't enabled yet, click **Get started** to create the
     default bucket. Note the bucket name (e.g. `mfx-2026.firebasestorage.app`
     or `mfx-2026.appspot.com`).

---

## 3. Environment variable

The portal needs `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` at **build time**. Set it
the same way the other `NEXT_PUBLIC_FIREBASE_*` vars are set for the App Hosting
backend (Firebase Console → App Hosting → your backend → Environment, or in
`apphosting.yaml`). Use the bucket name from step 2.

> Without it, the portal still works — file uploads just degrade gracefully
> ("uploads coming online") while orders, invoices, messages, approvals, and
> reorders all function.

---

## 4. Deploy the security rules

```bash
cd Website
firebase deploy --only firestore:rules,storage --project mfx-2026
```

(Storage must be enabled first — step 2 — or the storage rules deploy errors.)

---

## 5. Deploy the app

App Hosting auto-builds on push to `main`:

```bash
cd Website
git add -A
git commit -m "Client portal: dynamic login + full dashboard (invoices, payments, messages, docs, approvals, notifications)"
git push origin main
```

Watch the build in **Firebase Console → App Hosting**. When it goes green, the
new portal is live at https://microflexfilm.com/portal.

---

## 6. Smoke test (after deploy)

- [ ] Open `/portal` → new animated login appears
- [ ] "Continue with Google" signs in
- [ ] "Sign in with email link" sends an email; the link logs you in
- [ ] Dashboard tabs load; empty states show (no data yet is expected)
- [ ] Upload a file in Documents (if storage bucket env var is set)
- [ ] Submit a New Request → confirm the team notification email arrives

---

## Data model (for your admin tooling)

The portal reads these Firestore collections, filtered by `clientEmail`. Your
team creates/updates these (via the admin tool or console); clients only write
through the secured server actions.

| Collection | Purpose | Key fields |
|---|---|---|
| `orders` | Current/pending + completed orders | `clientEmail`, `orderNumber`, `title`, `packagingType`, `quantity`, `status` (pending→in_review→in_prepress→in_production→shipping→completed), `updatedAt` |
| `portal_requests` | Client requests + reorders | `clientEmail`, `type`, `summary`, `status` (pending/in_review/answered) |
| `invoices` | Billing | `clientEmail`, `invoiceNumber`, `amount` (number, dollars), `currency`, `description`, `status` (unpaid/processing/paid/overdue), `issuedAt`, `dueAt` |
| `portal_messages` | Chat thread | `clientEmail`, `sender` ("team"/"client"), `authorName`, `body`, `readByClient` |
| `portal_documents` | Shared files | `clientEmail`, `name`, `category`, `url`, `uploadedBy` ("team"/"client") |
| `portal_approvals` | Sign-offs | `clientEmail`, `title`, `type`, `description`, `url`, `status` (pending/approved/changes_requested) |
| `portal_notifications` | Alerts | `clientEmail`, `kind`, `title`, `body`, `section`, `read` |

To show a client something, add a doc with their `clientEmail`. e.g. an invoice:
```
clientEmail: "client@brand.com", invoiceNumber: "INV-1042",
amount: 4820.00, currency: "USD", description: "Stand-up pouch run",
status: "unpaid", issuedAt: <serverTimestamp>, dueAt: <Timestamp>
```
