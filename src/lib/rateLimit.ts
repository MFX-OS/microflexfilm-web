import { headers } from "next/headers";
import { adminDb } from "@/lib/firebase-admin";

/* IP-based rate limiting for public (unauthenticated) server actions —
   inquiry form, newsletter, and lead funnel. Fails OPEN on any infra error so
   legitimate users are never blocked by a hiccup. */

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
