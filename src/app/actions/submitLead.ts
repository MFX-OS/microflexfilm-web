"use server";

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

/* High-intent "Mad Libs" funnel lead. Stores every lead in Firestore (so none
   are lost) and forwards to the sales webhook. The webhook URL stays server-side
   (env LEAD_WEBHOOK_URL) — never exposed to the browser. */

export type LeadInput = {
  answers: Record<string, string>; // the dropdown/sentence selections
  email?: string;
  name?: string;
  company?: string;
  phone?: string;
  hp?: string; // honeypot — bots fill this; real users never see it
  loadedAt?: number; // client form-load timestamp (anti-bot timing check)
};

export async function submitLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  // Honeypot + timing: silently accept (don't tip off bots), but drop.
  const looksLikeBot =
    Boolean(input.hp && input.hp.trim()) ||
    (typeof input.loadedAt === "number" && Date.now() - input.loadedAt < 1500);

  const answers = input.answers || {};
  if (!looksLikeBot && Object.keys(answers).length === 0) {
    return { ok: false, error: "Please complete the form." };
  }

  const lead = {
    answers,
    email: (input.email || "").trim().toLowerCase() || null,
    name: (input.name || "").trim() || null,
    company: (input.company || "").trim() || null,
    phone: (input.phone || "").trim() || null,
    source: "homepage-funnel",
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
  };

  // 1) Persist first so a webhook outage never loses a lead.
  if (!looksLikeBot) {
    try {
      await adminDb.collection("leads").add(lead);
    } catch (err) {
      console.error("lead store failed", err);
      // continue — still try the webhook
    }
  }

  // 2) Forward to the sales webhook (best-effort).
  if (!looksLikeBot) {
    const url = process.env.LEAD_WEBHOOK_URL;
    if (url) {
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...lead,
            createdAt: new Date().toISOString(),
            site: "microflexfilm.com",
          }),
        });
      } catch (err) {
        console.error("lead webhook failed", err);
      }
    }
  }

  // Always return ok to bots (don't reveal the honeypot); real submissions stored.
  return { ok: true };
}
