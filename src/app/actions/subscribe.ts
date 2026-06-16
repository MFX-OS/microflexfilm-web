"use server";

import { FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import { adminDb } from "@/lib/firebase-admin";
import { ipRateLimit } from "@/lib/rateLimit";

/* Email capture for the newsletter / lead magnets. Stores subscribers in
   Firestore (deduped by email) and notifies the team. No external ESP needed. */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribe(
  email: string,
  source?: string
): Promise<{ ok: boolean; error?: string }> {
  const e = (email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(e)) return { ok: false, error: "Please enter a valid email address." };
  if (!(await ipRateLimit("subscribe", 10, 60000))) {
    return { ok: false, error: "Too many requests — please wait a moment and try again." };
  }

  try {
    await adminDb.collection("subscribers").doc(e).set(
      {
        email: e,
        source: source || "site",
        active: true,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    void notify(e, source || "site");
    return { ok: true };
  } catch (err) {
    console.error("subscribe error", err);
    return { ok: false, error: "Couldn't subscribe just now — please try again." };
  }
}

async function notify(email: string, source: string) {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    if (!smtpUser || !smtpPass) return;
    const recipients = process.env.INQUIRY_NOTIFY_EMAIL ?? "randy@microflexfilm.com,info@microflexfilm.com";
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `"${process.env.INQUIRY_FROM_NAME ?? "Microflex"}" <${smtpUser}>`,
      to: recipients,
      subject: `[Subscriber] ${email}`,
      text: `New subscriber: ${email}\nSource: ${source}`,
    });
  } catch (err) {
    console.error("subscribe notify failed", err);
  }
}
