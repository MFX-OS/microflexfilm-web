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

export type PortalInvoice = {
  id: string;
  invoiceNumber: string;
  orderNumber?: string;
  description: string;
  amount: number; // in dollars
  currency: string; // USD
  status: string; // unpaid | processing | paid | overdue
  statusLabel: string;
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
};

export type PortalMessage = {
  id: string;
  sender: "client" | "team";
  authorName: string;
  body: string;
  createdAt: string;
  attachmentName?: string;
  attachmentUrl?: string;
};

export type PortalDocument = {
  id: string;
  name: string;
  category: string; // artwork | spec | po | contract | invoice | sample | other
  url: string;
  contentType?: string;
  size?: number;
  uploadedBy: "client" | "team";
  createdAt: string;
};

export type PortalApproval = {
  id: string;
  title: string;
  type: string; // proof | quote | po | dieline
  description: string;
  url?: string;
  status: string; // pending | approved | changes_requested
  statusLabel: string;
  createdAt: string;
  decidedAt?: string;
  decisionNotes?: string;
};

export type PortalNotification = {
  id: string;
  kind: string; // order | invoice | message | approval | request | system
  title: string;
  body?: string;
  section?: string; // which dashboard section it points to
  read: boolean;
  createdAt: string;
};

export type PortalData = {
  email: string;
  name: string;
  active: PortalOrder[];
  history: PortalOrder[];
  requests: PortalRequest[];
  invoices: PortalInvoice[];
  messages: PortalMessage[];
  documents: PortalDocument[];
  approvals: PortalApproval[];
  notifications: PortalNotification[];
  badges: {
    activeOrders: number;
    pendingRequests: number;
    unpaidInvoices: number;
    pendingApprovals: number;
    unreadNotifications: number;
    unreadMessages: number;
  };
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

const INVOICE_LABELS: Record<string, string> = {
  unpaid: "Unpaid",
  processing: "Payment Processing",
  paid: "Paid",
  overdue: "Overdue",
};

const APPROVAL_LABELS: Record<string, string> = {
  pending: "Awaiting You",
  approved: "Approved",
  changes_requested: "Changes Requested",
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
  if (typeof v === "string") return v;
  return new Date().toISOString();
}

function tsMillis(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "string") {
    const t = Date.parse(v);
    return Number.isNaN(t) ? 0 : t;
  }
  return 0;
}

/** Fetch a client's docs in a collection, sorted newest-first in memory
 *  (avoids requiring composite Firestore indexes). */
async function clientDocs(collection: string, email: string, limit = 100) {
  const snap = await adminDb
    .collection(collection)
    .where("clientEmail", "==", email)
    .limit(limit)
    .get()
    .catch(() => null);
  if (!snap) return [];
  return snap.docs
    .map((d) => ({ id: d.id, data: d.data() }))
    .sort((a, b) => tsMillis(b.data.createdAt) - tsMillis(a.data.createdAt));
}

/* ========================================================================
   Read: full workspace data for the signed-in client
   ======================================================================== */

export async function getPortalData(idToken: string): Promise<PortalData> {
  const user = await verifyUser(idToken);
  const email = user.email;

  const [
    orderDocs,
    requestDocs,
    invoiceDocs,
    messageDocs,
    documentDocs,
    approvalDocs,
    notificationDocs,
  ] = await Promise.all([
    clientDocs("orders", email, 100),
    clientDocs("portal_requests", email, 50),
    clientDocs("invoices", email, 50),
    clientDocs("portal_messages", email, 100),
    clientDocs("portal_documents", email, 100),
    clientDocs("portal_approvals", email, 50),
    clientDocs("portal_notifications", email, 50),
  ]);

  const active: PortalOrder[] = [];
  const history: PortalOrder[] = [];

  orderDocs.forEach(({ id, data }) => {
    const status = String(data.status ?? "pending");
    const order: PortalOrder = {
      id,
      orderNumber: String(data.orderNumber ?? id.slice(0, 8).toUpperCase()),
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

  const requests: PortalRequest[] = requestDocs.map(({ id, data }) => ({
    id,
    type: String(data.type ?? "quote"),
    summary: String(data.summary ?? "Request"),
    status: String(data.status ?? "pending"),
    createdAt: toIso(data.createdAt),
    rerunMode: data.rerunMode as "exact" | "changes" | undefined,
  }));

  const invoices: PortalInvoice[] = invoiceDocs.map(({ id, data }) => {
    const status = String(data.status ?? "unpaid");
    return {
      id,
      invoiceNumber: String(data.invoiceNumber ?? id.slice(0, 8).toUpperCase()),
      orderNumber: data.orderNumber ? String(data.orderNumber) : undefined,
      description: String(data.description ?? "Invoice"),
      amount: Number(data.amount ?? 0),
      currency: String(data.currency ?? "USD"),
      status,
      statusLabel: INVOICE_LABELS[status] ?? status,
      issuedAt: toIso(data.issuedAt ?? data.createdAt),
      dueAt: data.dueAt ? toIso(data.dueAt) : undefined,
      paidAt: data.paidAt ? toIso(data.paidAt) : undefined,
    };
  });

  // messages: oldest-first for chat reading
  const messages: PortalMessage[] = messageDocs
    .map(({ id, data }) => ({
      id,
      sender: (data.sender === "team" ? "team" : "client") as "client" | "team",
      authorName: String(data.authorName ?? (data.sender === "team" ? "Microflex Team" : "You")),
      body: String(data.body ?? ""),
      createdAt: toIso(data.createdAt),
      attachmentName: data.attachmentName ? String(data.attachmentName) : undefined,
      attachmentUrl: data.attachmentUrl ? String(data.attachmentUrl) : undefined,
    }))
    .reverse();

  const documents: PortalDocument[] = documentDocs.map(({ id, data }) => ({
    id,
    name: String(data.name ?? "Document"),
    category: String(data.category ?? "other"),
    url: String(data.url ?? ""),
    contentType: data.contentType ? String(data.contentType) : undefined,
    size: data.size ? Number(data.size) : undefined,
    uploadedBy: (data.uploadedBy === "client" ? "client" : "team") as "client" | "team",
    createdAt: toIso(data.createdAt),
  }));

  const approvals: PortalApproval[] = approvalDocs.map(({ id, data }) => {
    const status = String(data.status ?? "pending");
    return {
      id,
      title: String(data.title ?? "Approval"),
      type: String(data.type ?? "proof"),
      description: String(data.description ?? ""),
      url: data.url ? String(data.url) : undefined,
      status,
      statusLabel: APPROVAL_LABELS[status] ?? status,
      createdAt: toIso(data.createdAt),
      decidedAt: data.decidedAt ? toIso(data.decidedAt) : undefined,
      decisionNotes: data.decisionNotes ? String(data.decisionNotes) : undefined,
    };
  });

  const notifications: PortalNotification[] = notificationDocs.map(({ id, data }) => ({
    id,
    kind: String(data.kind ?? "system"),
    title: String(data.title ?? "Update"),
    body: data.body ? String(data.body) : undefined,
    section: data.section ? String(data.section) : undefined,
    read: Boolean(data.read),
    createdAt: toIso(data.createdAt),
  }));

  const badges = {
    activeOrders: active.length,
    pendingRequests: requests.filter((r) => r.status !== "answered").length,
    unpaidInvoices: invoices.filter((i) => i.status === "unpaid" || i.status === "overdue").length,
    pendingApprovals: approvals.filter((a) => a.status === "pending").length,
    unreadNotifications: notifications.filter((n) => !n.read).length,
    unreadMessages: messageDocs.filter(
      ({ data }) => data.sender === "team" && !data.readByClient
    ).length,
  };

  return {
    email,
    name: user.name,
    active,
    history,
    requests,
    invoices,
    messages,
    documents,
    approvals,
    notifications,
    badges,
  };
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
   Write: send a message to the team
   ======================================================================== */

export async function sendPortalMessage(
  idToken: string,
  body: string,
  attachment?: { name: string; url: string }
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  const text = body.trim();
  if (!text && !attachment) return { ok: false, error: "Empty message." };

  await adminDb.collection("portal_messages").add({
    clientEmail: user.email,
    clientName: user.name,
    clientUid: user.uid,
    sender: "client",
    authorName: user.name,
    body: text,
    attachmentName: attachment?.name ?? null,
    attachmentUrl: attachment?.url ?? null,
    readByClient: true,
    readByTeam: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal message from ${user.name}`,
    [
      `Client: ${user.name} <${user.email}>`,
      ``,
      text || "(no text)",
      attachment ? `\nAttachment: ${attachment.name}\n${attachment.url}` : "",
    ].join("\n")
  );

  return { ok: true };
}

/* ========================================================================
   Write: submit a payment intent against an invoice ("mark as paid")
   ======================================================================== */

export async function submitInvoicePayment(
  idToken: string,
  invoiceId: string,
  input: { method: string; reference: string; note: string; proof?: { name: string; url: string } }
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);

  const ref = adminDb.collection("invoices").doc(invoiceId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Invoice not found." };
  const inv = snap.data()!;
  if (String(inv.clientEmail ?? "").toLowerCase() !== user.email) {
    return { ok: false, error: "Invoice not found." };
  }

  const invoiceNumber = String(inv.invoiceNumber ?? invoiceId.slice(0, 8).toUpperCase());

  // Flip the invoice to "processing" so the client sees it move immediately.
  await ref.update({
    status: "processing",
    paymentSubmittedAt: FieldValue.serverTimestamp(),
    paymentMethod: input.method,
    paymentReference: input.reference,
  });

  await adminDb.collection("payment_submissions").add({
    clientEmail: user.email,
    clientName: user.name,
    clientUid: user.uid,
    invoiceId,
    invoiceNumber,
    amount: inv.amount ?? 0,
    currency: inv.currency ?? "USD",
    method: input.method,
    reference: input.reference,
    note: input.note,
    proofName: input.proof?.name ?? null,
    proofUrl: input.proof?.url ?? null,
    status: "submitted",
    createdAt: FieldValue.serverTimestamp(),
  });

  await adminDb.collection("portal_notifications").add({
    clientEmail: user.email,
    kind: "invoice",
    title: `Payment submitted for ${invoiceNumber}`,
    body: "We received your payment details and are confirming receipt.",
    section: "invoices",
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal payment submitted — ${invoiceNumber}`,
    [
      `Client: ${user.name} <${user.email}>`,
      `Invoice: ${invoiceNumber}`,
      `Amount: ${inv.currency ?? "USD"} ${Number(inv.amount ?? 0).toFixed(2)}`,
      `Method: ${input.method}`,
      `Reference: ${input.reference || "—"}`,
      `Note: ${input.note || "—"}`,
      input.proof ? `\nProof: ${input.proof.name}\n${input.proof.url}` : "",
      ``,
      `>> Verify funds, then mark the invoice "paid" in the admin tool.`,
    ].join("\n")
  );

  return { ok: true };
}

/* ========================================================================
   Write: act on an approval (approve / request changes)
   ======================================================================== */

export async function actOnApproval(
  idToken: string,
  approvalId: string,
  decision: "approved" | "changes_requested",
  notes?: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);

  const ref = adminDb.collection("portal_approvals").doc(approvalId);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "Item not found." };
  const a = snap.data()!;
  if (String(a.clientEmail ?? "").toLowerCase() !== user.email) {
    return { ok: false, error: "Item not found." };
  }
  if (decision === "changes_requested" && !notes?.trim()) {
    return { ok: false, error: "Please describe the changes needed." };
  }

  await ref.update({
    status: decision,
    decidedAt: FieldValue.serverTimestamp(),
    decisionNotes: notes?.trim() ?? "",
  });

  const title = String(a.title ?? "item");
  await notifyTeam(
    `Portal approval — ${title} (${decision === "approved" ? "APPROVED" : "CHANGES REQUESTED"})`,
    [
      `Client: ${user.name} <${user.email}>`,
      `Item: ${title}`,
      `Decision: ${decision === "approved" ? "Approved" : "Changes requested"}`,
      notes?.trim() ? `\nNotes:\n${notes.trim()}` : "",
    ].join("\n")
  );

  return { ok: true };
}

/* ========================================================================
   Write: record a client-uploaded document (file lives in Storage already)
   ======================================================================== */

export async function recordPortalDocument(
  idToken: string,
  input: { name: string; url: string; category: string; contentType?: string; size?: number }
): Promise<{ ok: boolean; error?: string }> {
  const user = await verifyUser(idToken);
  if (!input.url || !input.name) return { ok: false, error: "Missing file." };

  await adminDb.collection("portal_documents").add({
    clientEmail: user.email,
    clientName: user.name,
    clientUid: user.uid,
    name: input.name,
    category: input.category || "other",
    url: input.url,
    contentType: input.contentType ?? null,
    size: input.size ?? null,
    uploadedBy: "client",
    createdAt: FieldValue.serverTimestamp(),
  });

  await notifyTeam(
    `Portal document uploaded — ${input.name}`,
    [
      `Client: ${user.name} <${user.email}>`,
      `File: ${input.name} (${input.category || "other"})`,
      input.url,
    ].join("\n")
  );

  return { ok: true };
}

/* ========================================================================
   Write: mark notifications read
   ======================================================================== */

export async function markNotificationsRead(
  idToken: string,
  ids?: string[]
): Promise<{ ok: boolean }> {
  const user = await verifyUser(idToken);

  let docs: { id: string }[] = [];
  if (ids && ids.length) {
    docs = ids.map((id) => ({ id }));
  } else {
    const snap = await adminDb
      .collection("portal_notifications")
      .where("clientEmail", "==", user.email)
      .where("read", "==", false)
      .limit(100)
      .get()
      .catch(() => null);
    docs = snap ? snap.docs.map((d) => ({ id: d.id })) : [];
  }

  if (!docs.length) return { ok: true };

  const batch = adminDb.batch();
  docs.forEach(({ id }) => {
    batch.update(adminDb.collection("portal_notifications").doc(id), { read: true });
  });
  await batch.commit().catch(() => null);

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
