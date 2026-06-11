"use server";

import { FieldValue } from "firebase-admin/firestore";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { createHash } from "node:crypto";
import { adminDb } from "@/lib/firebase-admin";
import { checkEmail } from "@/lib/spam-detection";

/* ============================================================
   Master Dieline Generation Registry
   - Every gated download creates a numbered registry row
   - File copies stored alongside for Microflex lookup
   - Files emailed to the requester as attachments
   ============================================================ */

const MAX_SVG_BYTES = 400 * 1024; // per file
const RATE_LIMIT_MAX = 10; // gated downloads per IP per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export type DielineRegistration = {
  customer: string;
  sku: string;
  email: string;
  notes: string;
  dielineId: string;
  specSummary: string;
  meta: Record<string, string | number | boolean>;
  files: { planning?: string; approval?: string };
  sendEmail: boolean;
};

function sha256(v: string) {
  return createHash("sha256").update(v).digest("hex");
}

function svgIsSafe(svg: string): boolean {
  if (Buffer.byteLength(svg, "utf8") > MAX_SVG_BYTES) return false;
  const lower = svg.toLowerCase();
  if (!lower.trimStart().startsWith("<svg")) return false;
  return !["<script", "javascript:", "onload=", "onerror=", "<foreignobject", "<iframe"].some((bad) =>
    lower.includes(bad)
  );
}

async function ipHash(): Promise<string> {
  try {
    const h = await headers();
    const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
    return sha256("mfx-ip-salt::" + ip);
  } catch {
    return sha256("mfx-ip-salt::unknown");
  }
}

async function rateLimited(hash: string): Promise<boolean> {
  const ref = adminDb.collection("rate_limits").doc("dieline:" + hash);
  try {
    let limited = false;
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = Date.now();
      if (!snap.exists || now - (snap.data()?.windowStart ?? 0) > RATE_LIMIT_WINDOW_MS) {
        tx.set(ref, { count: 1, windowStart: now });
        return;
      }
      const count = (snap.data()?.count ?? 0) + 1;
      tx.update(ref, { count });
      if (count > RATE_LIMIT_MAX) limited = true;
    });
    return limited;
  } catch {
    return false;
  }
}

export async function registerDielineDownload(
  input: DielineRegistration
): Promise<{ ok: boolean; registryNo?: string; error?: string }> {
  const customer = input.customer.trim().slice(0, 120);
  const sku = input.sku.trim().slice(0, 120);
  const email = input.email.trim().toLowerCase().slice(0, 160);
  const notes = input.notes.trim().slice(0, 1000);

  if (!customer || !sku || !email) return { ok: false, error: "Customer, SKU, and email are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: "Please enter a valid email." };
  const emailCheck = checkEmail(email);
  if (!emailCheck.ok) return { ok: false, error: "Please use a business or personal email address." };

  const hash = await ipHash();
  if (await rateLimited(hash)) {
    return { ok: false, error: "Download limit reached — try again later or contact info@microflexfilm.com." };
  }

  // Duplicate-click lock: identical registration within 10 minutes returns the
  // original registry number — one row, one email, no matter how many clicks.
  const DEDUPE_WINDOW_MS = 10 * 60 * 1000;
  const dedupeKey = sha256([email, input.dielineId, customer, sku, String(input.sendEmail)].join("|"));
  const dedupeRef = adminDb.collection("dieline_dedupe").doc(dedupeKey);
  try {
    const existing = await dedupeRef.get();
    const data = existing.data();
    if (existing.exists && Date.now() - (data?.at ?? 0) < DEDUPE_WINDOW_MS && data?.registryNo) {
      return { ok: true, registryNo: data.registryNo as string };
    }
    // Claim the lock immediately so a racing second click waits on this one
    await dedupeRef.set({ at: Date.now(), registryNo: null });
  } catch (err) {
    console.error("Dieline dedupe check failed (continuing):", err);
  }

  const files: { planning?: string; approval?: string } = {};
  if (input.files.planning && svgIsSafe(input.files.planning)) files.planning = input.files.planning;
  if (input.files.approval && svgIsSafe(input.files.approval)) files.approval = input.files.approval;
  if (!files.planning && !files.approval) return { ok: false, error: "No valid files to register." };

  // Numbered registry row (MDR-000001 …) via transactional counter
  const counterRef = adminDb.collection("counters").doc("dieline_registry");
  let registryNo = "";
  try {
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(counterRef);
      const next = ((snap.data()?.value as number) ?? 0) + 1;
      tx.set(counterRef, { value: next }, { merge: true });
      registryNo = `MDR-${String(next).padStart(6, "0")}`;
    });
  } catch (err) {
    console.error("Registry counter failed:", err);
    registryNo = `MDR-T${Date.now()}`;
  }

  // Master registry row + file copies
  try {
    const row = await adminDb.collection("dieline_registry").add({
      registryNo,
      dielineId: input.dielineId.slice(0, 80),
      customer,
      sku,
      email,
      notes,
      specSummary: input.specSummary.slice(0, 500),
      meta: input.meta,
      filesIncluded: Object.keys(files),
      emailSent: input.sendEmail,
      ipHash: hash,
      source: "microflexfilm.com/calculators",
      createdAt: FieldValue.serverTimestamp(),
    });
    await adminDb.collection("dieline_files").doc(row.id).set({
      registryNo,
      dielineId: input.dielineId.slice(0, 80),
      ...files,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Registry write failed:", err);
    return { ok: false, error: "Could not save your request — please try again." };
  }

  // Complete the dedupe lock with the issued registry number
  await dedupeRef.set({ at: Date.now(), registryNo }).catch(() => {});

  // Email files to the requester (best effort) + lead alert to the team
  if (input.sendEmail) {
    await sendFilesEmail({ customer, sku, email, notes, registryNo, dielineId: input.dielineId, specSummary: input.specSummary, files }).catch(
      (err) => console.error("Dieline email failed:", err)
    );
  }
  await notifyTeam({ customer, sku, email, notes, registryNo, dielineId: input.dielineId, specSummary: input.specSummary }).catch(() => {});

  return { ok: true, registryNo };
}

async function transporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
}

async function sendFilesEmail(p: {
  customer: string; sku: string; email: string; notes: string;
  registryNo: string; dielineId: string; specSummary: string;
  files: { planning?: string; approval?: string };
}) {
  const t = await transporter();
  if (!t) return;
  const attachments = [];
  if (p.files.planning) attachments.push({ filename: `${p.dielineId}-planning.svg`, content: p.files.planning, contentType: "image/svg+xml" });
  if (p.files.approval) attachments.push({ filename: `${p.dielineId}-approval.svg`, content: p.files.approval, contentType: "image/svg+xml" });

  await t.sendMail({
    from: `"Microflex Dieline Tools" <${process.env.SMTP_USER}>`,
    to: p.email,
    subject: `Your Microflex dieline files — ${p.dielineId}`,
    text: [
      `Hi ${p.customer},`,
      ``,
      `Your dieline files are attached.`,
      ``,
      `Registry no:  ${p.registryNo}`,
      `Dieline ID:   ${p.dielineId}`,
      `SKU/Product:  ${p.sku}`,
      `Spec:         ${p.specSummary}`,
      ``,
      `These are planning references — request the production die line from your Microflex specialist before building final artwork.`,
      ``,
      `Ready to quote this packaging? Reply to this email or visit microflexfilm.com.`,
      ``,
      `Microflex Film Corporation`,
      `microflexfilm.com · info@microflexfilm.com · 909.360.9066`,
    ].join("\n"),
    html: `
      <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;color:#06121d;">
        <div style="background:#061421;border-bottom:3px solid #00d8f2;padding:18px 24px;">
          <span style="color:#fff;font-weight:900;letter-spacing:3px;font-size:18px;">MICROFLEX<span style="color:#00d8f2;">.</span></span>
          <span style="float:right;color:#00d8f2;font-size:11px;letter-spacing:2px;font-weight:700;">DIELINE FILES</span>
        </div>
        <div style="padding:24px;">
          <p>Hi ${esc(p.customer)},</p>
          <p>Your dieline files are attached to this email.</p>
          <table style="font-size:14px;line-height:1.7;">
            <tr><td style="color:#536575;padding-right:16px;">Registry no</td><td><strong>${esc(p.registryNo)}</strong></td></tr>
            <tr><td style="color:#536575;padding-right:16px;">Dieline ID</td><td><code>${esc(p.dielineId)}</code></td></tr>
            <tr><td style="color:#536575;padding-right:16px;">SKU / Product</td><td>${esc(p.sku)}</td></tr>
            <tr><td style="color:#536575;padding-right:16px;">Spec</td><td>${esc(p.specSummary)}</td></tr>
          </table>
          <p style="font-size:13px;color:#536575;">These are planning references — request the production die line from your Microflex specialist before building final artwork.</p>
          <p><a href="https://microflexfilm.com/#quote-form" style="display:inline-block;background:#00d8f2;color:#001018;font-weight:800;padding:10px 18px;border-radius:24px;text-decoration:none;">Quote This Packaging →</a></p>
          <p style="font-size:12px;color:#536575;border-top:1px solid #e1ebf2;padding-top:12px;">Microflex Film Corporation · microflexfilm.com · info@microflexfilm.com · 909.360.9066<br/><em>Flexible Packaging. Engineered to Perform.</em></p>
        </div>
      </div>`,
    attachments,
  });
}

async function notifyTeam(p: {
  customer: string; sku: string; email: string; notes: string;
  registryNo: string; dielineId: string; specSummary: string;
}) {
  const t = await transporter();
  if (!t) return;
  const to = process.env.INQUIRY_NOTIFY_EMAIL ?? "randy@microflexfilm.com,info@microflexfilm.com";
  await t.sendMail({
    from: `"Microflex Dieline Registry" <${process.env.SMTP_USER}>`,
    to,
    subject: `[Dieline Registry] ${p.registryNo} — ${p.customer} (${p.dielineId})`,
    text: [
      `New dieline generated & downloaded`,
      ``,
      `Registry no:  ${p.registryNo}`,
      `Customer:     ${p.customer}`,
      `SKU/Product:  ${p.sku}`,
      `Email:        ${p.email}`,
      `Dieline ID:   ${p.dielineId}`,
      `Spec:         ${p.specSummary}`,
      `Notes:        ${p.notes || "—"}`,
      ``,
      `Files stored in Firestore: dieline_registry / dieline_files.`,
    ].join("\n"),
    replyTo: p.email,
  });
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
