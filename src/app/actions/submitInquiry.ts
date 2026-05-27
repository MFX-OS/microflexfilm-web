"use server";

import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebase-admin";

// Where inquiry notifications go (comma-separated supported via env override).
const DEFAULT_RECIPIENTS = ["randy@microflexfilm.com", "info@microflexfilm.com"];

// From address — must be on a verified Resend domain. Defaults to onboarding sender
// (works immediately, sender shows as "Resend <onboarding@resend.dev>"). Once you
// verify microflexfilm.com in Resend, set INQUIRY_FROM_EMAIL=inquiries@microflexfilm.com.
const DEFAULT_FROM = "Microflex Inquiries <onboarding@resend.dev>";

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

  if (!payload.name || !payload.email || !payload.company) {
    redirect("/contact-error?reason=missing-fields");
  }

  // 1. Write to Firestore (primary storage, always happens)
  try {
    await adminDb.collection("inquiries").add({
      ...payload,
      source: "microflexfilm.com",
      createdAt: FieldValue.serverTimestamp(),
      status: "new",
    });
  } catch (err) {
    console.error("Failed to write inquiry to Firestore:", err);
    redirect("/contact-error?reason=server");
  }

  // 2. Send email notification (best effort — Firestore write is the source of truth)
  await sendInquiryEmail(payload).catch((err) => {
    // Don't fail the user submission if email fails — they already saw success.
    // Inquiry is safely in Firestore; we can re-send notifications from there.
    console.error("Inquiry email failed to send:", err);
  });

  redirect("/thank-you");
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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email notification.");
    return;
  }

  const recipients = (process.env.INQUIRY_NOTIFY_EMAIL ?? DEFAULT_RECIPIENTS.join(","))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const from = process.env.INQUIRY_FROM_EMAIL ?? DEFAULT_FROM;
  const resend = new Resend(apiKey);

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

  await resend.emails.send({
    from,
    to: recipients,
    subject,
    text,
    html,
    replyTo: payload.email ? `${payload.name} <${payload.email}>` : undefined,
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
