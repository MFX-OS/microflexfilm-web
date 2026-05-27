# Microflex Film — Marketing Site

Public marketing/landing site for **Microflex Film Corporation** — flexible packaging, engineered to perform. Built with Next.js (App Router) and deployed on **Firebase App Hosting** inside the existing **MFX-OS (`mfx-2026`)** Firebase project. Inquiries are written to **Firestore** via a Next.js Server Action.

> Positioning line: *Flexible Packaging. Engineered to Perform.*
> Brand idea: *Microflex builds the surface layer between a product and the world.*

---

## What's in this repo

```
.
├── apphosting.yaml          # Firebase App Hosting backend config
├── firebase.json            # Firestore rules/indexes wiring
├── firestore.rules          # Locks `inquiries` to server-only writes
├── firestore.indexes.json
├── .firebaserc              # Points at the mfx-2026 project
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                       # Home (Hero, Capabilities, Services, Work, About, Contact)
    │   ├── thank-you/page.tsx
    │   ├── contact-error/page.tsx
    │   ├── actions/submitInquiry.ts       # Server Action → Firestore
    │   └── globals.css
    ├── components/
    │   ├── Header.tsx
    │   ├── Hero.tsx
    │   ├── Capabilities.tsx
    │   ├── Services.tsx
    │   ├── Portfolio.tsx
    │   ├── About.tsx
    │   ├── Contact.tsx
    │   └── Footer.tsx
    └── lib/
        └── firebase-admin.ts              # Admin SDK init (uses ADC in App Hosting)
```

---

## 1. Prerequisites

Install once on your machine:

- **Node.js 20+** (Node 22 LTS recommended) — https://nodejs.org
- **Firebase CLI** — `npm install -g firebase-tools`
- **gcloud CLI** (optional, for local Admin SDK auth) — https://cloud.google.com/sdk/docs/install

Then sign in:

```bash
firebase login
gcloud auth application-default login   # only for local dev
```

---

## 2. Install + run locally

```bash
cd "C:\Users\A10ti\OneDrive\Desktop\Website"
npm install
npm run dev
```

Open http://localhost:3000.

The contact form writes to Firestore via the `submitInquiry` Server Action. Locally that needs Application Default Credentials — `gcloud auth application-default login` is enough. (You can also skip Firestore locally by temporarily commenting the `adminDb.collection(...).add(...)` line.)

---

## 3. First-time Firebase setup

Make sure the CLI is pointing at the right project:

```bash
firebase use mfx-2026
```

Deploy Firestore rules (locks the `inquiries` collection to server-only writes):

```bash
firebase deploy --only firestore:rules
```

---

## 4. Deploy via Firebase App Hosting

Firebase App Hosting builds Next.js apps natively from a Git repo. The recommended flow:

1. **Push this folder to GitHub** (a private repo is fine):

   ```bash
   git init
   git add .
   git commit -m "Initial Microflex Film marketing site"
   git branch -M main
   git remote add origin https://github.com/<your-org>/microflexfilm-web.git
   git push -u origin main
   ```

2. **Create the App Hosting backend** (one time):

   ```bash
   firebase apphosting:backends:create \
     --project mfx-2026 \
     --location us-central1
   ```

   The CLI will walk you through:
   - Connecting your GitHub account
   - Selecting the repo + branch (`main`)
   - Naming the backend (suggested: `microflexfilm-web`)
   - Picking a root directory (use `/`)

   From here, every push to `main` will trigger a build + rollout automatically. `apphosting.yaml` controls runtime instance settings.

3. **Or skip GitHub** and deploy a one-off bundle from your laptop:

   ```bash
   firebase apphosting:rollouts:create microflexfilm-web --project mfx-2026
   ```

After the first rollout completes, the App Hosting backend exposes a URL like
`https://microflexfilm-web--mfx-2026.us-central1.hosted.app`.

---

## 5. Attach the custom domain `microflexfilm.com`

Custom domains live under the App Hosting backend you just created.

**In the Firebase Console:**

1. Go to **Build → App Hosting** in the `mfx-2026` project.
2. Open the `microflexfilm-web` backend.
3. Click **Add custom domain** → enter `microflexfilm.com` (and add `www.microflexfilm.com` as well).
4. Firebase will give you DNS records — typically:
   - An **A** record (or **ALIAS**/**ANAME** at the apex) pointing `microflexfilm.com` to Google's IPs.
   - A **CNAME** for `www` pointing to the App Hosting host.
   - One **TXT** record for domain verification.
5. Add those records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
6. Wait for verification (usually 15 minutes to a few hours). Firebase will provision a managed TLS cert automatically.

Once verified, `https://microflexfilm.com` will serve this site directly from App Hosting.

---

## 6. Inquiries — where they land

- Form data flows: `Contact form → /actions/submitInquiry (Server Action) → Firestore: inquiries/`
- Schema for each document:
  ```ts
  {
    name: string;
    company: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
    source: "microflexfilm.com";
    status: "new";
    createdAt: Timestamp;
  }
  ```
- Read them in the Firebase Console → Firestore → `inquiries` collection.
- Optional next step: a Cloud Function `onCreate` trigger that emails sales when a new doc lands. (We left that as a hook — see the commented `INQUIRY_NOTIFY_EMAIL` secret in `apphosting.yaml`.)

---

## 7. Useful commands

```bash
# Local dev
npm run dev

# Type-check
npm run typecheck

# Lint
npm run lint

# Production build (matches what App Hosting runs)
npm run build && npm start

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Trigger a fresh App Hosting rollout
firebase apphosting:rollouts:create microflexfilm-web --project mfx-2026
```

---

## 8. Design notes

- **Palette:** `ink` (near-black) base, `paper` (warm off-white) foreground, `ember` (warm copper) accent — evokes printed substrate + ink.
- **Type:** Instrument Serif for display, Inter for body, JetBrains Mono for spec ribbons and labels.
- **Texture:** subtle SVG film grain overlay on the body, ambient radial-gradient glow behind the hero.
- **Layout:** 7-section single-page scroll (Hero · Capabilities · Services · Work · About · Contact · Footer).

To restyle, edit `tailwind.config.ts` (palette/fonts) and `src/app/globals.css` (component classes like `.card`, `.btn`, `.eyebrow`).

---

© Microflex Film Corporation. *Flexible packaging. Engineered to perform.*
