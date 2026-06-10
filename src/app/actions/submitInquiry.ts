"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import { adminDb } from "@/lib/firebase-admin";
import { runAllChecks } from "@/lib/spam-detection";
import { createHash } from "node:crypto";

/* ===================== Abuse-prevention helpers ===================== */

const RATE_LIMIT_MAX = 5; // submissions per IP per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const DEDUPE_WINDOW_MS = 10 * 60 * 1000; // identical submission within 10 min = duplicate

const ALLOWED_FILE_EXT = new Set([
  ".ai", ".pdf", ".psd", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".eps", ".zip", ".svg",
]);
const MAX_FILES = 3;
const MAX_TOTAL_FILE_BYTES = 10 * 1024 * 1024; // 10 MB across all files

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

async function clientIpHash(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for") ?? "";
    const ip = fwd.split(",")[0]?.trim() || "unknown";
    return sha256("mfx-ip-salt::" + ip);
  } catch {
    return sha256("mfx-ip-salt::unknown");
  }
}

async function userAgentMissing(): Promise<boolean> {
  try {
    const h = await headers();
    const ua = (h.get("user-agent") ?? "").trim();
    return ua.length < 8; // browsers always send a real UA
  } catch {
    return false;
  }
}

/** Returns true if this IP exceeded the submission rate limit. */
async function isRateLimited(ipHash: string): Promise<boolean> {
  const ref = adminDb.collection("rate_limits").doc(ipHash);
  try {
    let limited = false;
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = Date.now();
      if (!snap.exists) {
        tx.set(ref, { count: 1, windowStart: now });
        return;
      }
      const data = snap.data()!;
      if (now - (data.windowStart ?? 0) > RATE_LIMIT_WINDOW_MS) {
        tx.set(ref, { count: 1, windowStart: now });
        return;
      }
      const count = (data.count ?? 0) + 1;
      tx.update(ref, { count });
      if (count > RATE_LIMIT_MAX) limited = true;
    });
    return limited;
  } catch (err) {
    console.error("Rate-limit check failed (allowing):", err);
    return false;
  }
}

/** Returns true if an identical submission already arrived recently.
 *  Uses a doc-ID lock so double-clicks can never produce two emails. */
async function isDuplicate(dedupeHash: string): Promise<boolean> {
  const ref = adminDb.collection("inquiry_dedupe").doc(dedupeHash);
  try {
    const snap = await ref.get();
    const now = Date.now();
    if (snap.exists && now - (snap.data()?.at ?? 0) < DEDUPE_WINDOW_MS) {
      return true;
    }
    await ref.set({ at: now });
    return false;
  } catch (err) {
    console.error("Dedupe check failed (allowing):", err);
    return false;
  }
}

export type InquiryAttachment = { filename: string; content: Buffer };

/** Validate uploaded files: count, extension, total size. Returns attachments
 *  or an error string. */
async function collectFiles(formData: FormData): Promise<{ files: InquiryAttachment[]; error?: string }> {
  const entries = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (entries.length === 0) return { files: [] };
  if (entries.length > MAX_FILES) return { files: [], error: `too many files (max ${MAX_FILES})` };

  let total = 0;
  const files: InquiryAttachment[] = [];
  for (const f of entries) {
    const name = f.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120);
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_FILE_EXT.has(ext)) return { files: [], error: `file type not allowed: ${ext || "none"}` };
    total += f.size;
    if (total > MAX_TOTAL_FILE_BYTES) return { files: [], error: "files exceed 10 MB total" };
    files.push({ filename: name, content: Buffer.from(await f.arrayBuffer()) });
  }
  return { files };
}

/* ==================================================================== */

const DEFAULT_RECIPIENTS = ["randy@microflexfilm.com", "info@microflexfilm.com"];
const DEFAULT_FROM_NAME = "Microflex Inquiries";

export async function submitInquiry(formData: FormData) {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    requestType: String(formData.get("requestType") ?? "").trim(),
    packagingType: String(formData.get("packagingType") ?? "").trim(),
    skus: String(formData.get("skus") ?? "").trim(),
    quantity: String(formData.get("quantity") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    fileLink: String(formData.get("fileLink") ?? "").trim(),
  };

  // Anti-spam fields (hidden from humans, captured by the form)
  const honeypot = String(formData.get("website") ?? "");
  const formLoadedAtRaw = String(formData.get("formLoadedAtMs") ?? "");
  const formLoadedAtMs = formLoadedAtRaw ? parseInt(formLoadedAtRaw, 10) : null;

  if (!payload.name || !payload.email || !payload.company) {
    redirect("/contact-error?reason=missing-fields");
  }

  // === Run anti-spam checks ===
  const spamCheck = runAllChecks({
    honeypot,
    formLoadedAtMs,
    email: payload.email,
    message: payload.message,
    fileLink: payload.fileLink,
  });

  if (!spamCheck.ok) {
    // Log rejection to Firestore for audit / tuning. NEVER block the redirect —
    // we want bots to think they succeeded so they don't adapt or retry.
    await logRejection({
      ...payload,
      rejectionReason: spamCheck.reason,
      rejectionLayer: spamCheck.layer,
      honeypotValue: honeypot,
      formOpenMs: formLoadedAtMs ? Date.now() - formLoadedAtMs : null,
    }).catch((err) => {
      console.error("Failed to log spam rejection:", err);
    });

    // Silent drop: redirect to thank-you as if it worked. Bot moves on.
    redirect("/thank-you");
  }

  // === Abuse prevention: missing user-agent, per-IP rate limit, duplicate lock ===
  if (await userAgentMissing()) {
    await logRejection({
      ...payload, rejectionReason: "missing user-agent", rejectionLayer: "headers",
      honeypotValue: honeypot, formOpenMs: formLoadedAtMs ? Date.now() - formLoadedAtMs : null,
    }).catch(() => {});
    redirect("/thank-you"); // silent drop
  }

  const ipHash = await clientIpHash();
  if (await isRateLimited(ipHash)) {
    await logRejection({
      ...payload, rejectionReason: "rate limit exceeded", rejectionLayer: "rate-limit",
      honeypotValue: honeypot, formOpenMs: formLoadedAtMs ? Date.now() - formLoadedAtMs : null,
    }).catch(() => {});
    redirect("/thank-you"); // silent drop
  }

  // Duplicate submission (double-click, refresh-resubmit): one email only.
  const dedupeHash = sha256(
    [payload.email, payload.name, payload.requestType, payload.message, payload.quantity].join("|").toLowerCase()
  );
  if (await isDuplicate(dedupeHash)) {
    redirect("/thank-you"); // already processed — treat as success, send nothing
  }

  // Validate any uploaded files
  const { files, error: fileError } = await collectFiles(formData);
  if (fileError) {
    redirect("/contact-error?reason=files");
  }

  // 1. Write to Firestore (primary storage, always happens)
  try {
    await adminDb.collection("inquiries").add({
      ...payload,
      attachedFiles: files.map((f) => f.filename),
      ipHash,
      source: "microflexfilm.com",
      createdAt: FieldValue.serverTimestamp(),
      status: "new",
      // Capture timing for analytics / future tuning
      formOpenMs: formLoadedAtMs ? Date.now() - formLoadedAtMs : null,
    });
  } catch (err) {
    console.error("Failed to write inquiry to Firestore:", err);
    redirect("/contact-error?reason=server");
  }

  // 2. Send email via Gmail SMTP (best effort)
  await sendInquiryEmail(payload, files).catch((err) => {
    console.error("Inquiry email failed to send:", err);
  });

  redirect("/thank-you");
}

// Log spam rejections to a separate collection so they don't clutter inquiries
// and so we can tune detection over time.
async function logRejection(record: {
  name: string;
  company: string;
  email: string;
  phone: string;
  requestType: string;
  packagingType: string;
  skus: string;
  quantity: string;
  message: string;
  fileLink?: string;
  rejectionReason: string;
  rejectionLayer: string;
  honeypotValue: string;
  formOpenMs: number | null;
}) {
  let userAgent = "";
  try {
    const h = await headers();
    userAgent = h.get("user-agent") ?? "";
  } catch {
    // headers() may throw in some contexts; ignore
  }

  await adminDb.collection("rejected_inquiries").add({
    ...record,
    userAgent,
    source: "microflexfilm.com",
    rejectedAt: FieldValue.serverTimestamp(),
  });
}

async function sendInquiryEmail(
  payload: {
    name: string;
    company: string;
    email: string;
    phone: string;
    requestType: string;
    packagingType: string;
    skus: string;
    quantity: string;
    message: string;
    fileLink: string;
  },
  attachments: InquiryAttachment[] = []
) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpUser || !smtpPassword) {
    console.warn("SMTP_USER or SMTP_PASSWORD not set — skipping email notification.");
    return;
  }

  const recipients = (process.env.INQUIRY_NOTIFY_EMAIL ?? DEFAULT_RECIPIENTS.join(","))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const fromName = process.env.INQUIRY_FROM_NAME ?? DEFAULT_FROM_NAME;
  const from = `"${fromName}" <${smtpUser}>`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  const subject = `New inquiry — ${payload.company} (${payload.requestType || "no type"})`;

  const text = [
    `New inquiry from microflexfilm.com`,
    ``,
    `Contact:      ${payload.name}`,
    `Company:      ${payload.company}`,
    `Email:        ${payload.email}`,
    `Phone:        ${payload.phone || "—"}`,
    ``,
    `Request:      ${payload.requestType || "—"}`,
    `Packaging:    ${payload.packagingType || "—"}`,
    `SKUs:         ${payload.skus || "—"}`,
    `Quantity:     ${payload.quantity || "—"}`,
    ``,
    `File link:    ${payload.fileLink || "—"}`,
    `Attachments:  ${attachments.length ? attachments.map((a) => a.filename).join(", ") : "—"}`,
    ``,
    `Message:`,
    payload.message || "—",
    ``,
    `---`,
    `Reply to this email to respond directly to ${payload.name} <${payload.email}>.`,
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #06121d;">
      <div style="border-bottom: 3px solid #00d8f2; padding-bottom: 12px; margin-bottom: 20px;">
        <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #00a8cf; font-weight: 700;">New Inquiry • microflexfilm.com</div>
        <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em;">${escapeHtml(payload.company)} — ${escapeHtml(payload.requestType || "General")}</h1>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
        <tr><td style="padding: 6px 0; color: #536575; width: 130px;">Contact</td><td style="padding: 6px 0;"><strong>${escapeHtml(payload.name)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">Company</td><td style="padding: 6px 0;">${escapeHtml(payload.company)}</td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #00a8cf;">${escapeHtml(payload.email)}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">Phone</td><td style="padding: 6px 0;">${escapeHtml(payload.phone || "—")}</td></tr>
        <tr><td colspan="2" style="padding: 12px 0 4px;"><div style="height: 1px; background: #e1ebf2;"></div></td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">Request type</td><td style="padding: 6px 0;">${escapeHtml(payload.requestType || "—")}</td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">Packaging</td><td style="padding: 6px 0;">${escapeHtml(payload.packagingType || "—")}</td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">SKUs</td><td style="padding: 6px 0;">${escapeHtml(payload.skus || "—")}</td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">Quantity</td><td style="padding: 6px 0;">${escapeHtml(payload.quantity || "—")}</td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">File link</td><td style="padding: 6px 0;">${payload.fileLink ? `<a href="${escapeHtml(payload.fileLink)}" style="color: #00a8cf;">${escapeHtml(payload.fileLink)}</a>` : "—"}</td></tr>
        <tr><td style="padding: 6px 0; color: #536575;">Attachments</td><td style="padding: 6px 0;">${attachments.length ? escapeHtml(attachments.map((a) => a.filename).join(", ")) : "—"}</td></tr>
      </table>

      <div style="margin-top: 20px; padding: 16px; background: #f5f9fb; border-radius: 8px; border-left: 3px solid #00d8f2;">
        <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #536575; font-weight: 700; margin-bottom: 6px;">Message</div>
        <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(payload.message || "—")}</div>
      </div>

      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e1ebf2; font-size: 12px; color: #536575;">
        Reply to this email to respond directly to ${escapeHtml(payload.name)}. Inquiry is also stored in Firestore under <code>inquiries</code>.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: recipients.join(", "),
    subject,
    text,
    html,
    replyTo: payload.email ? `"${payload.name}" <${payload.email}>` : undefined,
    attachments: attachments.map((a) => ({ filename: a.filename, content: a.content })),
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
