"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

/* ========================================================================
   Types shared with the portal UI
   ======================================================================== */

export type PortalOrder = {
  id: string;
  orderNumber: string;
  title: string;
  packagingType: string;
  quantity: string;
  status: string; // pending | in_review | in_prepress | in_production | shipping | completed
  statusLabel: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes?: string;
  reorderable: boolean;
};

export type PortalRequest = {
  id: string;
  type: string; // quote | artwork | po | reorder | support
  summary: string;
  status: string; // pending | in_review | answered
  createdAt: string;
  rerunMode?: "exact" | "changes";
};

export type PortalData = {
  email: string;
  name: string;
  active: PortalOrder[];
  history: PortalOrder[];
  requests: PortalRequest[];
};

const ACTIVE_STATUSES = new Set([
  "pending",
  "in_review",
  "in_prepress",
  "in_production",
  "shipping",
]);

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_review: "In Review",
  in_prepress: "In Prepress",
  in_production: "In Production",
  shipping: "Shipping",
  completed: "Completed",
};

/* ========================================================================
   Auth helper — verify the Firebase ID token sent from the client
   ======================================================================== */

async function verifyUser(idToken: string) {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (!email || !decoded.email_verified) {
    throw new Error("UNVERIFIED_EMAIL");
  }
  return { uid: decoded.uid, email, name: decoded.name ?? email };
}

function toIso(v: unknown): string {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  return new Date().toISOString();
}

/* ========================================================================
   Read: workspace data (orders + requests for the signed-in client)
   ======================================================================== */

export async function getPortalData(idToken: string): Promise<PortalData> {
  const user = await verifyUser(idToken);

  const [ordersSnap, requestsSnap] = await Promise.all([
    adminDb
      .collection("orders")
      .where("clientEmail", "==", user.email)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get()
      .catch(() => null),
    adminDb
      .collection("portal_requests")
      .where("clientEmail", "==", user.email)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get()
      .catch(() => null),
  ]);

  const active: PortalOrder[] = [];
  const history: PortalOrder[] = [];

  ordersSnap?.docs.forEach((d) => {
    const data = d.data();
    const status = String(data.status ?? "pending");
    const order: PortalOrder = {
      id: d.id,
      orderNumber: String(data.orderNumber ?? d.id.slice(0, 8).toUpperCase()),
      title: String(data.title ?? data.packagingType ?? "Packaging Order"),
      packagingType: String(data.packagingType ?? "—"),
      quantity: String(data.quantity ?? "—"),
      status,
      statusLabel: STATUS_LABELS[status] ?? status,
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt ?? data.createdAt),
      notes: data.clientNotes ? String(data.clientNotes) : undefined,
      reorderable: status === "completed",
    };
    (ACTIVE_STATUSES.has(status) ? active : history).push(order);
  });

  const requests: PortalRequest[] =
    requestsSnap?.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type: String(data.type ?? "quote"),
        summary: String(data.summary ?? "Request"),
        status: String(data.status ?? "pending"),
        createdAt: toIso(data.createdAt),
        rerunMode: data.rerunMode as "exact" | "changes" | undefined,
      };
    }) ?? [];

  return { email: user.email, name: user.name, active, history, requests };
}

/* ========================================================================
   Write: new request from the portal form
   ======================================================================== */

export async function submitPortalRequest(
  idToken: string,
  input: {
    type: string;
    packagingType: string;
    quantity: string;
    timeline: string;
    skus: string;
    message: string;
  }
): Promise<{ ok: boolean }> {
  const user = await verifyUser(idToken);

  const summaryParts = [input.type, input.packagingType, input.quantity].filter(
    (s) => s && s !== "—"
  );

  await adminDb.collection("portal_requests").add({
    clientEmail: user.email,
    clientName: user.name,
    clientUid: user.uid,
    source: "portal",
    type: input.type,
    packagingType: input.packagingType,
    quantity: input.quantity,
    timeline: input.timeline,
    skus: input.skus,
    message: input.message,
    summary: summaryParts.join(" · ") || "Portal request",
    status: "pending",
    createdAt: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal request — ${input.type}`,
    [
      `Client: ${user.name} <${user.email}>`,
      `Request type: ${input.type}`,
      `Packaging type: ${input.packagingType}`,
      `Quantity: ${input.quantity}`,
      `Timeline: ${input.timeline}`,
      `SKUs: ${input.skus || "—"}`,
      ``,
      `Message:`,
      input.message || "—",
    ].join("\n")
  );

  return { ok: true };
}

/* ========================================================================
   Write: one-click reorder (rerun exact / rerun with changes)
   ======================================================================== */

export async function reorderOrder(
  idToken: string,
  orderId: string,
  mode: "exact" | "changes",
  changeNotes?: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);

  const orderRef = adminDb.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) return { ok: false, error: "Order not found." };

  const order = orderSnap.data()!;
  if (String(order.clientEmail ?? "").toLowerCase() !== user.email) {
    return { ok: false, error: "Order not found." };
  }

  const orderNumber = String(order.orderNumber ?? orderId.slice(0, 8).toUpperCase());

  await adminDb.collection("portal_requests").add({
    clientEmail: user.email,
    clientName: user.name,
    clientUid: user.uid,
    source: "portal",
    type: "reorder",
    rerunMode: mode,
    sourceOrderId: orderId,
    sourceOrderNumber: orderNumber,
    packagingType: order.packagingType ?? "—",
    quantity: order.quantity ?? "—",
    changeNotes: mode === "changes" ? (changeNotes ?? "") : "",
    summary:
      mode === "exact"
        ? `Rerun ${orderNumber} — no changes`
        : `Rerun ${orderNumber} — with changes`,
    status: "pending",
    createdAt: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal reorder — ${orderNumber} (${mode === "exact" ? "no changes" : "WITH CHANGES"})`,
    [
      `Client: ${user.name} <${user.email}>`,
      `Source order: ${orderNumber} (${orderId})`,
      `Packaging type: ${order.packagingType ?? "—"}`,
      `Quantity: ${order.quantity ?? "—"}`,
      `Mode: ${mode === "exact" ? "Rerun exactly as before" : "Rerun with changes"}`,
      ``,
      mode === "changes" ? `Requested changes:\n${changeNotes || "—"}` : "",
    ].join("\n")
  );

  return { ok: true };
}

/* ========================================================================
   Email notification (best-effort, mirrors inquiry notifications)
   ======================================================================== */

async function notifyTeam(subject: string, text: string) {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    if (!smtpUser || !smtpPass) return;

    const recipients =
      process.env.INQUIRY_NOTIFY_EMAIL ??
      "randy@microflexfilm.com,info@microflexfilm.com";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
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
