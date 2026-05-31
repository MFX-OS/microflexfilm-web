"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import { adminDb } from "@/lib/firebase-admin";
import { runAllChecks } from "@/lib/spam-detection";

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

  // 1. Write to Firestore (primary storage, always happens)
  try {
    await adminDb.collection("inquiries").add({
      ...payload,
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
  await sendInquiryEmail(payload).catch((err) => {
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

async function sendInquiryEmail(payload: {
  name: string;
  company: string;
  email: string;
  phone: string;
  requestType: string;
  packagingType: string;
  skus: string;
  quantity: string;
  message: string;
}) {
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
