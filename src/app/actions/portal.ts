"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

/* ========================================================================
   Microflex client portal — backed by the SAME Firestore (mfx-2026) the
   MFX-OS internal app uses. The client-facing workflow lives on:

     quotes        → the hub. Client views the quote, picks a qty tier / SKU,
                     uploads PO + art, and submits a PO (status sent → won),
                     which auto-creates a salesOrder (mirrors portalSubmitPO).
     salesOrders   → client signs + approves the artwork proof; staff drive it
                     through production / shipping.
     jobTickets    → production stages (linked back to the quote / SO).
     quotes/{id}/portalMessages → per-quote communications thread.

   All reads/writes here run through the Admin SDK (server actions), scoped
   by the caller's verified email.
   ======================================================================== */

/* ----------------------------- types ----------------------------------- */

export type QtyTier = { qty: number; ppu: number; total: number };

export type PortalQuote = {
  id: string;
  quoteNum: string;
  rev: string;
  status: string;
  statusLabel: string;
  company: string;
  attn: string;
  jobDesc: string;
  specs: string;
  payTerms: string;
  tiers: QtyTier[]; // resolved for the currently-selected SKU column
  skuCount: number; // number of SKU variants available
  items: { label: string; tiers: QtyTier[] }[]; // per-SKU pricing for the detail view
  // PO submission state (what the client has entered/locked in)
  poNumber?: string;
  poShipTo?: string;
  poInstructions?: string;
  poSignature?: string;
  poSignedAt?: string;
  poQtyIndex?: number;
  poSkuCount?: number;
  poSelectedQty?: number;
  poSelectedTotal?: number;
  poFiles: PortalFile[];
  artFiles: PortalFile[];
  quotePdfUrl?: string; // generated quote PDF (Drive link)
  createdAt: string;
  updatedAt: string;
  canSubmitPO: boolean; // status === 'sent'
};

export type PortalFile = { name: string; url: string; uploadedAt?: string; uploadedBy?: string };

export type PortalSalesOrder = {
  id: string;
  soNum: string;
  quoteId: string;
  quoteNum: string;
  status: string;
  statusLabel: string;
  jobDesc: string;
  selectedQty: number;
  ppu: number;
  total: number;
  poNumber?: string;
  clientSignature?: string;
  clientSignedAt?: string;
  clientApproved?: boolean;
  artworkApproved?: boolean;
  artworkApprovedAt?: string;
  artworkRevisionNote?: string;
  signatureFlow?: string;
  signingDocLink?: string;
  pdfUrl?: string; // signed sales-order PDF (Drive link)
  artFiles: PortalFile[];
  createdAt: string;
};

export type PortalMessage = {
  id: string;
  quoteId: string;
  from: "client" | "staff" | "system";
  name: string;
  text: string;
  type?: string;
  createdAt: string;
};

export type PipelineStage = { key: string; label: string };

export type PortalJob = {
  quoteId: string;
  quoteNum: string;
  title: string;
  stageIndex: number; // -1 .. stages.length-1
  stageLabel: string;
  soNum?: string;
  updatedAt: string;
};

export type CustomerProfile = {
  customerId?: string;
  company: string;
  industry: string;
  contact: string;
  phone: string;
  email: string;
  billTo: string;
  shipTo: string;
  notes: string;
  brandColors: string; // comma-separated hex values, client-owned
  found: boolean; // a CRM record (or quote-seeded values) exists
};

export type ProfileChange = {
  id: string;
  status: string; // pending | approved | rejected
  changes: Record<string, { from: string; to: string }>;
  createdAt: string;
  decidedAt?: string;
};

export type PortalData = {
  email: string;
  name: string;
  quotes: PortalQuote[];
  salesOrders: PortalSalesOrder[];
  messagesByQuote: Record<string, PortalMessage[]>;
  jobs: PortalJob[];
  stages: PipelineStage[];
  profile: CustomerProfile;
  profileChanges: ProfileChange[];
  badges: {
    quotesToReview: number; // quotes in 'sent' awaiting the client's PO
    ordersToSign: number; // SOs awaiting signature
    artworkToApprove: number; // SOs awaiting artwork approval
    inProduction: number;
    unreadMessages: number;
    profilePending: number; // pending CRM change requests
  };
};

/** The CRM fields a client may propose changes to (whitelist).
 *  Internal only — a "use server" module may export only async functions, so
 *  the client UI keeps its own copy of this list. */
const PROFILE_FIELDS = ["company", "industry", "contact", "phone", "billTo", "shipTo", "notes", "brandColors"] as const;
type ProfileField = (typeof PROFILE_FIELDS)[number];
const PROFILE_LABELS: Record<ProfileField, string> = {
  company: "Company name",
  industry: "Industry",
  contact: "Primary contact",
  phone: "Phone",
  billTo: "Billing address",
  shipTo: "Shipping address",
  notes: "Notes / instructions",
  brandColors: "Brand colors",
};

const brandColorsOf = (v: unknown): string =>
  Array.isArray(v) ? v.map((x) => String(x)).join(", ") : v ? String(v) : "";

/* ----------------------------- labels ----------------------------------- */

const QUOTE_LABELS: Record<string, string> = {
  draft: "Draft",
  approval: "In Review",
  ready: "Ready",
  sent: "Action Needed — Review & Submit PO",
  won: "PO Received",
  lost: "Closed",
  production: "In Production",
};

const SO_LABELS: Record<string, string> = {
  pending: "Awaiting Approval",
  approved: "Approved",
  sent: "Awaiting Your Signature",
  production: "In Production",
  shipped: "In production — complete (awaiting QA & shipment)",
  delivered: "Delivered",
  invoiced: "Invoiced",
  fulfilled: "Fulfilled",
  closed: "Closed",
  rejected: "Closed",
  cancelled: "Cancelled",
};

const PIPELINE: PipelineStage[] = [
  { key: "quote", label: "Quote Received" },
  { key: "po", label: "PO Submitted" },
  { key: "approved", label: "Order Approved" },
  { key: "artwork", label: "Artwork Approved" },
  { key: "production", label: "In Production" },
  { key: "shipped", label: "Production Complete" },
];

const SO_APPROVED = new Set(["approved", "sent", "production", "shipped", "delivered", "invoiced", "fulfilled", "closed"]);
const SO_PRODUCTION = new Set(["production", "shipped", "delivered", "invoiced", "fulfilled", "closed"]);
const SO_SHIPPED = new Set(["shipped", "delivered", "invoiced", "fulfilled", "closed"]);

/* ----------------------------- helpers ---------------------------------- */

async function verifyUser(idToken: string) {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (!email || !decoded.email_verified) throw new Error("UNVERIFIED_EMAIL");
  return { uid: decoded.uid, email, name: decoded.name ?? email };
}

function toIso(v: unknown): string {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (typeof v === "string") return v;
  if (typeof v === "number") return new Date(v).toISOString();
  return "";
}

function millis(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "string") { const t = Date.parse(v); return Number.isNaN(t) ? 0 : t; }
  if (typeof v === "number") return v;
  return 0;
}

function nowIso() { return new Date().toISOString(); }

/** Lightweight per-user+action rate limit (Firestore). Fails open on infra
 *  errors so legitimate users are never blocked by a hiccup. */
async function rateLimit(uid: string, action: string, max: number, windowMs: number): Promise<boolean> {
  const ref = adminDb.collection("_portalRateLimits").doc(`${uid}_${action}`);
  try {
    return await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = Date.now();
      const d = snap.data();
      if (snap.exists && d && now - Number(d.windowStart ?? 0) < windowMs) {
        if (Number(d.count ?? 0) >= max) return false;
        tx.update(ref, { count: Number(d.count ?? 0) + 1 });
      } else {
        tx.set(ref, { windowStart: now, count: 1 });
      }
      return true;
    });
  } catch {
    return true;
  }
}
const RL = "Too many requests — please wait a moment and try again.";

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function mapFiles(arr: unknown): PortalFile[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((f) => f && typeof f === "object")
    .map((f) => {
      const o = f as Record<string, unknown>;
      return {
        name: String(o.name ?? "file"),
        url: String(o.url ?? o.driveLink ?? ""),
        uploadedAt: o.uploadedAt ? toIso(o.uploadedAt) : undefined,
        uploadedBy: o.uploadedBy ? String(o.uploadedBy) : undefined,
      };
    })
    .filter((f) => f.url);
}

/** Resolve the quantity tiers for a given SKU column from pricedQtys. */
function resolveTiers(data: Record<string, unknown>, skuCol: number): QtyTier[] {
  const priced = data.pricedQtys;
  if (Array.isArray(priced)) {
    return priced.map((r) => {
      const row = r as Record<string, unknown>;
      const skus = row.skus as Record<string, unknown>[] | undefined;
      const sk = Array.isArray(skus) ? skus[skuCol] : undefined;
      if (sk) return { qty: num(sk.qty ?? row.qty), ppu: num(sk.ppu), total: num(sk.total) };
      return { qty: num(row.qty), ppu: num(row.ppu), total: num(row.total) };
    });
  }
  // legacy: qtys array of numbers or objects
  const qtys = data.qtys;
  if (Array.isArray(qtys)) {
    return qtys.map((q) => {
      if (q && typeof q === "object") {
        const o = q as Record<string, unknown>;
        return { qty: num(o.qty), ppu: num(o.ppu), total: num(o.total) };
      }
      return { qty: num(q), ppu: 0, total: 0 };
    });
  }
  return [];
}

function skuColumns(data: Record<string, unknown>): number {
  const priced = data.pricedQtys as Record<string, unknown>[] | undefined;
  if (Array.isArray(priced)) {
    let max = 1;
    for (const r of priced) {
      const skus = (r as Record<string, unknown>).skus;
      if (Array.isArray(skus)) max = Math.max(max, skus.length);
    }
    return max;
  }
  return 1;
}

function buildSpecs(f: Record<string, unknown>): string {
  const s = (k: string) => {
    const v = f[k];
    return v == null ? "" : String(v);
  };
  const parts = [
    s("sA") && s("sar") ? `${s("sA")}x${s("sar")}"` : "",
    s("shapeType"),
    s("colors") ? `${s("colors")}C` : "",
    s("jobType"),
    s("faceStock") || s("face"),
    s("lamination") || s("laminate"),
  ].filter(Boolean);
  return parts.join(" · ");
}

/* ------------------------- read: full workspace ------------------------- */

export async function getPortalData(idToken: string): Promise<PortalData> {
  const user = await verifyUser(idToken);
  const email = user.email;

  // Quotes: match on poClientEmail OR fields.custEmail (case-insensitive in the
  // OS, but stored lowercased). Two queries merged by id.
  const [byPoEmail, byCustEmail, soByEmail, custByEmail, changesByEmail] = await Promise.all([
    adminDb.collection("quotes").where("poClientEmail", "==", email).limit(50).get().catch(() => null),
    adminDb.collection("quotes").where("fields.custEmail", "==", email).limit(50).get().catch(() => null),
    adminDb.collection("salesOrders").where("email", "==", email).limit(50).get().catch(() => null),
    adminDb.collection("customers").where("email", "==", email).limit(1).get().catch(() => null),
    adminDb.collection("portalProfileChanges").where("clientEmail", "==", email).limit(20).get().catch(() => null),
  ]);

  const quoteDocs = new Map<string, Record<string, unknown>>();
  [byPoEmail, byCustEmail].forEach((snap) => {
    snap?.docs.forEach((d) => quoteDocs.set(d.id, d.data()));
  });

  const quotes: PortalQuote[] = [];
  for (const [id, data] of quoteDocs) {
    const f = (data.fields as Record<string, unknown>) ?? {};
    const skuCount = skuColumns(data);
    const selSku = Math.min(num(data.poSkuCount) || 0, Math.max(0, skuCount - 1));
    const status = String(data.status ?? "sent");
    quotes.push({
      id,
      quoteNum: String(data.quoteNum ?? id.slice(0, 6).toUpperCase()),
      rev: String(data.rev ?? ""),
      status,
      statusLabel: QUOTE_LABELS[status] ?? status,
      company: String(f.custCo ?? ""),
      attn: String(f.custAttn ?? ""),
      jobDesc: buildSpecs(f) || "Packaging Quote",
      specs: buildSpecs(f),
      payTerms: String(f.payTerms ?? "Net 30"),
      tiers: resolveTiers(data, selSku),
      skuCount,
      items: Array.from({ length: Math.max(1, skuCount) }, (_, col) => {
        const names = data.skuNames as unknown[] | undefined;
        const label = Array.isArray(names) && names[col] ? String(names[col]) : skuCount > 1 ? `Item ${col + 1}` : "Item";
        return { label, tiers: resolveTiers(data, col) };
      }),
      poNumber: data.poNumber ? String(data.poNumber) : undefined,
      poShipTo: data.poShipTo ? String(data.poShipTo) : undefined,
      poInstructions: data.poInstructions ? String(data.poInstructions) : undefined,
      poSignature: data.poSignature ? String(data.poSignature) : undefined,
      poSignedAt: data.poSignedAt ? toIso(data.poSignedAt) : undefined,
      poQtyIndex: data.poQtyIndex != null ? num(data.poQtyIndex) : undefined,
      poSkuCount: data.poSkuCount != null ? num(data.poSkuCount) : undefined,
      poSelectedQty: data.poSelectedQty != null ? num(data.poSelectedQty) : undefined,
      poSelectedTotal: data.poSelectedTotal != null ? num(data.poSelectedTotal) : undefined,
      poFiles: mapFiles(data.poFiles),
      artFiles: mapFiles(data.artFiles),
      quotePdfUrl: data.portalQuotePdfUrl
        ? String(data.portalQuotePdfUrl)
        : data.driveLink
          ? String(data.driveLink)
          : undefined,
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt ?? data.createdAt),
      canSubmitPO: status === "sent",
    });
  }
  quotes.sort((a, b) => millis(b.updatedAt) - millis(a.updatedAt));

  const salesOrders: PortalSalesOrder[] = (soByEmail?.docs ?? []).map((d) => {
    const data = d.data();
    const status = String(data.status ?? "pending");
    return {
      id: d.id,
      soNum: String(data.soNum ?? d.id),
      quoteId: String(data.quoteId ?? ""),
      quoteNum: String(data.quoteNum ?? ""),
      status,
      statusLabel: SO_LABELS[status] ?? status,
      jobDesc: String(data.jobDesc ?? "Order"),
      selectedQty: num(data.selectedQty),
      ppu: num(data.ppu),
      total: num(data.total),
      poNumber: data.poNumber ? String(data.poNumber) : undefined,
      clientSignature: data.clientSignature ? String(data.clientSignature) : undefined,
      clientSignedAt: data.clientSignedAt ? toIso(data.clientSignedAt) : undefined,
      clientApproved: Boolean(data.clientApproved),
      artworkApproved: Boolean(data.artworkApproved),
      artworkApprovedAt: data.artworkApprovedAt ? toIso(data.artworkApprovedAt) : undefined,
      artworkRevisionNote: data.artworkRevisionNote ? String(data.artworkRevisionNote) : undefined,
      signatureFlow: data.signatureFlow ? String(data.signatureFlow) : undefined,
      signingDocLink: data.signingDocLink ? String(data.signingDocLink) : undefined,
      pdfUrl: data.portalSignedPdfLink
        ? String(data.portalSignedPdfLink)
        : data.driveLink
          ? String(data.driveLink)
          : undefined,
      artFiles: mapFiles(data.artFiles),
      createdAt: toIso(data.createdAt),
    };
  });
  salesOrders.sort((a, b) => millis(b.createdAt) - millis(a.createdAt));

  const soByQuote = new Map<string, PortalSalesOrder>();
  salesOrders.forEach((so) => { if (so.quoteId) soByQuote.set(so.quoteId, so); });

  // Per-quote messages (latest few each). Best-effort.
  const messagesByQuote: Record<string, PortalMessage[]> = {};
  await Promise.all(
    quotes.slice(0, 20).map(async (q) => {
      const snap = await adminDb
        .collection("quotes").doc(q.id).collection("portalMessages")
        .limit(100).get().catch(() => null);
      if (!snap) return;
      const msgs = snap.docs
        .map((d) => {
          const data = d.data();
          const fromRaw = String(data.from ?? "staff");
          const from: PortalMessage["from"] =
            fromRaw === "client" ? "client" : fromRaw === "system" ? "system" : "staff";
          return {
            id: d.id,
            quoteId: q.id,
            from,
            name: String(data.name ?? (from === "client" ? "You" : "Microflex")),
            text: String(data.text ?? ""),
            type: data.type ? String(data.type) : undefined,
            createdAt: toIso(data.timestamp ?? data.createdAt),
          };
        })
        .sort((a, b) => millis(a.createdAt) - millis(b.createdAt));
      messagesByQuote[q.id] = msgs;
    })
  );

  // Build the pipeline job per quote.
  const jobs: PortalJob[] = quotes.map((q) => {
    const so = soByQuote.get(q.id);
    let idx = 0; // quote received
    if (q.status === "won" || q.poNumber) idx = 1;
    if (so && SO_APPROVED.has(so.status)) idx = 2;
    if (so && so.artworkApproved) idx = Math.max(idx, 3);
    if ((so && SO_PRODUCTION.has(so.status)) || q.status === "production") idx = Math.max(idx, 4);
    if (so && SO_SHIPPED.has(so.status)) idx = 5;
    return {
      quoteId: q.id,
      quoteNum: q.quoteNum,
      title: q.company ? `${q.company} — ${q.jobDesc}` : q.jobDesc,
      stageIndex: idx,
      stageLabel: PIPELINE[idx].label,
      soNum: so?.soNum,
      updatedAt: q.updatedAt,
    };
  });

  const unreadMessages = Object.values(messagesByQuote)
    .flat()
    .filter((m) => m.from !== "client").length; // best-effort (no read receipts on portalMessages)

  // CRM profile — from the customers record if found, else seeded from the
  // newest quote's fields so the client at least sees what we have on file.
  const pstr = (...vals: unknown[]): string => {
    for (const v of vals) if (v != null && String(v).trim()) return String(v);
    return "";
  };
  const custDoc = custByEmail?.docs[0];
  const cust = custDoc?.data();
  const seed = (quotes[0] && (quoteDocs.get(quotes[0].id)?.fields as Record<string, unknown> | undefined)) || undefined;
  const profile: CustomerProfile = cust
    ? {
        customerId: custDoc!.id,
        company: pstr(cust.company),
        industry: pstr(cust.industry),
        contact: pstr(cust.contact),
        phone: pstr(cust.phone),
        email,
        billTo: pstr(cust.billTo, cust.billToAddress),
        shipTo: pstr(cust.shipTo),
        notes: pstr(cust.notes),
        brandColors: brandColorsOf(cust.brandColors),
        found: true,
      }
    : {
        company: pstr(seed?.custCo),
        industry: pstr(seed?.industry),
        contact: pstr(seed?.custAttn),
        phone: pstr(seed?.custPhone),
        email,
        billTo: pstr(seed?.billTo),
        shipTo: pstr(seed?.shipTo, seed?.cityState),
        notes: "",
        brandColors: "",
        found: Boolean(seed),
      };

  const profileChanges: ProfileChange[] = (changesByEmail?.docs ?? [])
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        status: String(data.status ?? "pending"),
        changes: (data.changes ?? {}) as Record<string, { from: string; to: string }>,
        createdAt: toIso(data.createdAt),
        decidedAt: data.decidedAt ? toIso(data.decidedAt) : undefined,
      };
    })
    .sort((a, b) => millis(b.createdAt) - millis(a.createdAt));

  return {
    email,
    name: user.name,
    quotes,
    salesOrders,
    messagesByQuote,
    jobs,
    stages: PIPELINE,
    profile,
    profileChanges,
    badges: {
      quotesToReview: quotes.filter((q) => q.status === "sent").length,
      ordersToSign: salesOrders.filter((so) => so.status === "sent" && !so.clientSignature).length,
      artworkToApprove: salesOrders.filter((so) => SO_APPROVED.has(so.status) && !so.artworkApproved && so.artFiles.length > 0).length,
      inProduction: salesOrders.filter((so) => SO_PRODUCTION.has(so.status)).length,
      unreadMessages,
      profilePending: profileChanges.filter((c) => c.status === "pending").length,
    },
  };
}

/* --------------------- write: record uploaded files --------------------- */

export async function recordQuoteFiles(
  idToken: string,
  quoteId: string,
  kind: "po" | "art",
  files: PortalFile[]
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  if (!files.length) return { ok: false, error: "No files." };

  const ref = adminDb.collection("quotes").doc(quoteId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Quote not found." };
  const q = snap.data()!;
  if (!emailMatchesQuote(q, user.email)) return { ok: false, error: "Not authorized for this quote." };

  const field = kind === "po" ? "poFiles" : "artFiles";
  const stamped = files.map((f) => ({ ...f, uploadedAt: nowIso(), uploadedBy: user.email }));
  await ref.update({ [field]: FieldValue.arrayUnion(...stamped), updatedAt: nowIso() });

  await ref.collection("portalMessages").add({
    text: `📎 ${files.length} ${kind === "po" ? "PO" : "artwork"} file(s) uploaded: ${files.map((f) => f.name).join(", ")}`,
    name: user.name,
    from: "client",
    type: "folder_drop",
    folderKind: kind === "po" ? "PO" : "Art",
    fileCount: files.length,
    fileNames: files.map((f) => f.name),
    timestamp: FieldValue.serverTimestamp(),
  });

  return { ok: true };
}

function emailMatchesQuote(q: Record<string, unknown>, email: string): boolean {
  const a = String(q.poClientEmail ?? "").toLowerCase();
  const b = String((q.fields as Record<string, unknown>)?.custEmail ?? "").toLowerCase();
  return a === email || b === email;
}

/* ----------------- write: submit PO (quote → won + SO) ------------------ */

export async function submitPO(
  idToken: string,
  quoteId: string,
  input: {
    poNumber: string;
    poShipTo: string;
    poInstructions: string;
    poSignature: string;
    poQtyIndex: number;
    poSkuCount: number;
  }
): Promise<{ ok: boolean; error?: string; soNum?: string }> {
  const user = await verifyUser(idToken);

  if (!(await rateLimit(user.uid, "submitPO", 12, 60000))) return { ok: false, error: RL };
  if (!input.poNumber.trim() || !input.poSignature.trim()) {
    return { ok: false, error: "PO number and signature are required." };
  }

  const ref = adminDb.collection("quotes").doc(quoteId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Quote not found." };
  const quote = snap.data()!;
  if (!emailMatchesQuote(quote, user.email)) return { ok: false, error: "Not authorized for this quote." };
  if (quote.status !== "sent") {
    return { ok: false, error: `This quote is already ${quote.status}.` };
  }

  // Resolve selected pricing (mirror portalSubmitPO).
  const selIdx = input.poQtyIndex || 0;
  const skuCol = Math.max(0, input.poSkuCount || 0);
  const tiers = resolveTiers(quote, skuCol);
  const sel = tiers[selIdx] ?? { qty: 0, ppu: 0, total: 0 };

  // Lock the PO onto the quote and flip to 'won'.
  await ref.update({
    poNumber: input.poNumber.trim(),
    poShipTo: input.poShipTo.trim(),
    poInstructions: input.poInstructions.trim(),
    poSignature: input.poSignature.trim(),
    poSignedAt: nowIso(),
    poClientEmail: user.email,
    poQtyIndex: selIdx,
    poSkuCount: skuCol,
    poSelectedQty: sel.qty,
    poSelectedTotal: sel.total,
    status: "won",
    wonDate: nowIso(),
    closedAt: nowIso(),
    updatedAt: nowIso(),
  });

  // Auto-create the salesOrder if one doesn't already exist (mirror OS).
  let soNum: string | undefined;
  const existing = await adminDb.collection("salesOrders").where("quoteId", "==", quoteId).limit(1).get();
  if (existing.empty) {
    soNum = await adminDb.runTransaction(async (tx) => {
      const seqRef = adminDb.collection("systemCounters").doc("salesOrder");
      const seqSnap = await tx.get(seqRef);
      const now = new Date();
      const bucket = String(now.getFullYear()).slice(-2) + String(now.getMonth() + 1).padStart(2, "0");
      let seq = 1;
      const sd = seqSnap.data();
      if (seqSnap.exists && sd && sd.bucket === bucket) seq = (Number(sd.seq) || 0) + 1;
      tx.set(seqRef, { bucket, seq }, { merge: true });
      const generated = `SO${bucket}-${String(seq).padStart(3, "0")}`;

      const f = quote.fields ?? {};
      const allQtys = tiers;
      const soId = `so_${Date.now()}`;
      tx.set(adminDb.collection("salesOrders").doc(soId), {
        id: soId,
        soNum: generated,
        quoteId,
        quoteNum: quote.quoteNum ?? "",
        quoteRev: quote.rev ?? "",
        status: "pending",
        company: f.custCo ?? "",
        contact: f.custAttn ?? "",
        email: user.email,
        phone: f.custPhone ?? f.phone ?? "",
        industry: f.industry ?? "",
        cityState: f.cityState ?? "",
        shipTo: input.poShipTo.trim() || (f.shipTo as string) || (f.cityState as string) || "",
        billToAddress: f.billTo ?? "",
        poNumber: input.poNumber.trim(),
        poSignature: input.poSignature.trim(),
        poSignedAt: nowIso(),
        poInstructions: input.poInstructions.trim(),
        poFiles: quote.poFiles ?? [],
        artFiles: quote.artFiles ?? [],
        jobDesc: `${f.sA ?? "?"}x${f.sar ?? "?"}" ${f.shapeType ?? ""} - ${f.colors ?? "?"}C ${f.jobType ?? "Flexo"}`,
        sizeA: f.sA ?? "",
        sizeB: f.sar ?? "",
        shapeType: f.shapeType ?? "",
        colors: f.colors ?? "",
        jobType: f.jobType ?? "",
        faceStock: f.faceStock ?? f.face ?? "",
        lamination: f.lamination ?? f.laminate ?? "",
        face: f.face ?? f.faceStock ?? "",
        laminate: f.laminate ?? f.lamination ?? "",
        coating: f.coating ?? "",
        windDir: f.windDir ?? f.copyPos ?? "",
        selectedQtyIndex: selIdx,
        selectedQty: sel.qty,
        ppu: sel.ppu,
        total: sel.total,
        allQtys,
        terms: quote.terms ?? [],
        estimator: f.estimator ?? "",
        salesRep: f.salesRep ?? "",
        payTerms: f.payTerms ?? "Net 30",
        createdAt: nowIso(),
        createdBy: "System (Auto — Portal PO)",
        updatedAt: nowIso(),
        updatedBy: "System (Auto — Portal PO)",
        approvedBy: null,
        approvedAt: null,
        sentAt: null,
        sentTo: null,
        driveLink: null,
        notes: [{
          text: `📋 Auto-created from ${quote.quoteNum ?? quoteId} (PO# ${input.poNumber.trim()} submitted via Client Portal)`,
          by: "System", at: nowIso(),
        }],
      });
      return generated;
    });
  } else {
    soNum = String(existing.docs[0].data().soNum ?? "");
  }

  await ref.collection("portalMessages").add({
    text: `✅ PO #${input.poNumber.trim()} submitted. Selected ${sel.qty.toLocaleString()} units. Thank you!`,
    name: user.name, from: "client", type: "po_submitted",
    timestamp: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal PO submitted — ${quote.quoteNum ?? quoteId}`,
    [
      `Client: ${user.name} <${user.email}>`,
      `Quote: ${quote.quoteNum ?? quoteId}`,
      `PO #: ${input.poNumber.trim()}`,
      `Selected: ${sel.qty.toLocaleString()} units · $${sel.total.toLocaleString()}`,
      soNum ? `Sales Order created: ${soNum} (pending approval)` : "",
      `Ship to: ${input.poShipTo.trim() || "—"}`,
      `Instructions: ${input.poInstructions.trim() || "—"}`,
    ].join("\n")
  );

  return { ok: true, soNum };
}

/* ------------- write: sign sales order + approve artwork ---------------- */

export async function signSalesOrder(
  idToken: string,
  soId: string,
  signature: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  if (!signature.trim()) return { ok: false, error: "Signature required." };

  const ref = adminDb.collection("salesOrders").doc(soId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Order not found." };
  const so = snap.data()!;
  if (String(so.email ?? "").toLowerCase() !== user.email) return { ok: false, error: "Not authorized." };

  await ref.update({
    clientSignature: signature.trim(),
    clientSignedAt: nowIso(),
    clientEmail: user.email,
    clientApproved: true,
    signatureFlow: "awaiting_csr",
    updatedAt: nowIso(),
  });

  await notifyTeam(
    `Portal SO signed — ${so.soNum ?? soId}`,
    [`Client: ${user.name} <${user.email}>`, `Order: ${so.soNum ?? soId}`, `Signature: ${signature.trim()}`].join("\n")
  );
  return { ok: true };
}

export async function decideArtwork(
  idToken: string,
  soId: string,
  decision: "approve" | "revise",
  note?: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  if (decision === "revise" && !note?.trim()) return { ok: false, error: "Please describe the changes needed." };

  const ref = adminDb.collection("salesOrders").doc(soId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Order not found." };
  const so = snap.data()!;
  if (String(so.email ?? "").toLowerCase() !== user.email) return { ok: false, error: "Not authorized." };

  if (decision === "approve") {
    await ref.update({
      artworkApproved: true,
      artworkApprovedAt: nowIso(),
      artworkApprovedBy: user.name,
      updatedAt: nowIso(),
    });
  } else {
    await ref.update({
      artworkApproved: false,
      artworkRevisionRequestedAt: nowIso(),
      artworkRevisionNote: note?.trim() ?? "",
      artworkRevisionRequestedBy: user.name,
      updatedAt: nowIso(),
    });
  }

  await notifyTeam(
    `Portal artwork ${decision === "approve" ? "APPROVED" : "CHANGES REQUESTED"} — ${so.soNum ?? soId}`,
    [
      `Client: ${user.name} <${user.email}>`,
      `Order: ${so.soNum ?? soId}`,
      decision === "revise" ? `\nRequested changes:\n${note?.trim()}` : "Approved for production.",
    ].join("\n")
  );
  return { ok: true };
}

/* ----------------------- write: quote message --------------------------- */

export async function sendQuoteMessage(
  idToken: string,
  quoteId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  if (!(await rateLimit(user.uid, "sendQuoteMessage", 20, 60000))) return { ok: false, error: RL };
  if (!text.trim()) return { ok: false, error: "Empty message." };

  const ref = adminDb.collection("quotes").doc(quoteId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Quote not found." };
  if (!emailMatchesQuote(snap.data()!, user.email)) return { ok: false, error: "Not authorized." };

  await ref.collection("portalMessages").add({
    text: text.trim(), name: user.name, from: "client", type: "message",
    timestamp: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal message — ${snap.data()!.quoteNum ?? quoteId}`,
    [`Client: ${user.name} <${user.email}>`, ``, text.trim()].join("\n")
  );
  return { ok: true };
}

/* ------------------- write: quote / item request ------------------------ */

const REQUEST_LABELS: Record<string, string> = {
  question: "Question",
  change: "Change / Revision Request",
  sample: "Sample Request",
  qty: "Different Qty / SKU Request",
};

export async function submitQuoteRequest(
  idToken: string,
  quoteId: string,
  input: { type: string; item?: string; message: string }
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  if (!(await rateLimit(user.uid, "submitQuoteRequest", 20, 60000))) return { ok: false, error: RL };
  if (!input.message.trim()) return { ok: false, error: "Please add a few details." };

  const ref = adminDb.collection("quotes").doc(quoteId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Quote not found." };
  const quote = snap.data()!;
  if (!emailMatchesQuote(quote, user.email)) return { ok: false, error: "Not authorized for this quote." };

  const label = REQUEST_LABELS[input.type] ?? "Request";
  const scope = input.item ? ` · ${input.item}` : "";

  await ref.collection("portalMessages").add({
    text: `🔔 ${label}${scope}: ${input.message.trim()}`,
    name: user.name,
    from: "client",
    type: "request",
    requestType: input.type,
    item: input.item ?? null,
    timestamp: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal ${label} — ${quote.quoteNum ?? quoteId}`,
    [
      `Client: ${user.name} <${user.email}>`,
      `Quote: ${quote.quoteNum ?? quoteId}`,
      input.item ? `Item: ${input.item}` : "",
      `Type: ${label}`,
      ``,
      input.message.trim(),
    ].join("\n")
  );

  return { ok: true };
}

/* ----------------- write: CRM profile change request -------------------- */

export async function submitProfileChange(
  idToken: string,
  proposed: Partial<Record<ProfileField, string>>
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);

  if (!(await rateLimit(user.uid, "submitProfileChange", 10, 60000))) return { ok: false, error: RL };

  const custSnap = await adminDb
    .collection("customers").where("email", "==", user.email).limit(1).get()
    .catch(() => null);
  const custDoc = custSnap?.docs[0];
  const cur = (custDoc?.data() ?? {}) as Record<string, unknown>;
  const currentVal = (k: ProfileField): string => {
    if (k === "billTo") return String(cur.billTo ?? cur.billToAddress ?? "");
    if (k === "brandColors") return brandColorsOf(cur.brandColors);
    return String(cur[k] ?? "");
  };

  const changes: Record<string, { from: string; to: string }> = {};
  for (const k of PROFILE_FIELDS) {
    const next = proposed[k];
    if (next == null) continue;
    const to = String(next).trim();
    const from = currentVal(k).trim();
    if (to !== from) changes[k] = { from, to };
  }
  if (Object.keys(changes).length === 0) return { ok: false, error: "No changes to submit." };

  await adminDb.collection("portalProfileChanges").add({
    clientEmail: user.email,
    clientName: user.name,
    customerId: custDoc?.id ?? null,
    changes,
    status: "pending",
    source: "portal",
    createdAt: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal profile change request — ${user.name}`,
    [
      `Client: ${user.name} <${user.email}>`,
      custDoc ? `Customer record: ${custDoc.id}` : "No linked customer record yet (review & link).",
      ``,
      `Requested changes (review before applying to CRM):`,
      ...Object.entries(changes).map(([k, v]) => `• ${PROFILE_LABELS[k as ProfileField]}: "${v.from || "—"}" → "${v.to || "—"}"`),
    ].join("\n")
  );

  return { ok: true };
}

/* ----------------------- email notification ----------------------------- */

async function notifyTeam(subject: string, text: string) {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    if (!smtpUser || !smtpPass) return;
    const recipients = process.env.INQUIRY_NOTIFY_EMAIL ?? "randy@microflexfilm.com,info@microflexfilm.com";
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", port: 465, secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `"${process.env.INQUIRY_FROM_NAME ?? "Microflex Portal"}" <${smtpUser}>`,
      to: recipients,
      subject: `[Client Portal] ${subject}`,
      text,
    });
  } catch (err) {
    console.error("Portal notification email failed:", err);
  }
}
