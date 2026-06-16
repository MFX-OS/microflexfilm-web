import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { adminDb } from "@/lib/firebase-admin";

/* IP-based rate limiting for public (unauthenticated) server actions —
   inquiry form, newsletter, and lead funnel. Fails OPEN on any infra error so
   legitimate users are never blocked by a hiccup.

   Includes lightweight abuse alerting: when an endpoint hits a spike of blocked
   attempts within an hour, it emails the team once per hour per endpoint. */

const ALERT_THRESHOLD = 40; // blocked attempts in one hourly bucket → one alert

export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export async function ipRateLimit(action: string, max: number, windowMs: number): Promise<boolean> {
  try {
    const ip = (await clientIp()).replace(/[^\w.:-]+/g, "_").slice(0, 80);
    const ref = adminDb.collection("_ipRateLimits").doc(`${action}_${ip}`);
    const allowed = await adminDb.runTransaction(async (tx) => {
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
    if (!allowed) void recordAbuse(action);
    return allowed;
  } catch {
    return true;
  }
}

/** Counts blocked attempts per endpoint per hour; emails the team once when a
 *  spike crosses the threshold. Best-effort and never throws. */
async function recordAbuse(action: string) {
  try {
    const hourKey = `${action}_${new Date().toISOString().slice(0, 13)}`; // YYYY-MM-DDTHH
    const ref = adminDb.collection("_abuseStats").doc(hourKey);
    const shouldAlert = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const d = snap.data();
      const count = (snap.exists && d ? Number(d.count ?? 0) : 0) + 1;
      const alerted = Boolean(snap.exists && d && d.alerted);
      const crossing = count >= ALERT_THRESHOLD && !alerted;
      tx.set(ref, { action, count, alerted: alerted || crossing, updatedAt: Date.now() }, { merge: true });
      return crossing;
    });
    if (shouldAlert) void sendAbuseAlert(action);
  } catch {
    /* never block on alerting */
  }
}

async function sendAbuseAlert(action: string) {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    if (!smtpUser || !smtpPass) return;
    const recipients =
      process.env.SECURITY_NOTIFY_EMAIL ?? process.env.INQUIRY_NOTIFY_EMAIL ?? "randy@microflexfilm.com";
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `"Microflex Security" <${smtpUser}>`,
      to: recipients,
      subject: `[Security] Abuse spike on "${action}"`,
      text:
        `Heads up — the "${action}" endpoint on microflexfilm.com hit ${ALERT_THRESHOLD}+ blocked ` +
        `(rate-limited) attempts within the past hour. This may be spam or an attack.\n\n` +
        `What this means: requests were automatically throttled, so the site kept working — but the volume is unusual.\n\n` +
        `Where to look: the "_abuseStats" and "_ipRateLimits" collections in Firestore (project mfx-2026) show counts and the offending IPs.\n\n` +
        `If this keeps happening, consider enabling Google Cloud Armor (WAF) or reCAPTCHA on the affected form.`,
    });
  } catch {
    /* best-effort */
  }
}
