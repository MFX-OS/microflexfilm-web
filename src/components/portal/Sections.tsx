"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import {
  submitPortalRequest,
  reorderOrder,
  sendPortalMessage,
  submitInvoicePayment,
  actOnApproval,
  recordPortalDocument,
  markNotificationsRead,
  type PortalData,
  type PortalOrder,
  type PortalInvoice,
  type PortalApproval,
} from "@/app/actions/portal";
import {
  StatusChip,
  Field,
  inputStyle,
  Panel,
  SectionHeading,
  EmptyState,
  fmtDate,
  fmtDateTime,
  fmtMoney,
  fmtBytes,
  timeAgo,
} from "./ui";
import { uploadPortalFile, isStorageConfigured } from "./upload";

export type SectionKey =
  | "overview"
  | "orders"
  | "invoices"
  | "requests"
  | "messages"
  | "documents"
  | "approvals"
  | "notifications"
  | "history";

const dim = (on: boolean) => (on ? { opacity: 0.55 } : undefined);

/* ============ order row (shared) ============ */

function OrderRow({ order, children }: { order: PortalOrder; children?: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(255,255,255,0.035)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan">#{order.orderNumber}</span>
            <span className="text-base font-bold text-paper">{order.title}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {order.packagingType} · Qty {order.quantity} · Updated {fmtDate(order.updatedAt)}
          </p>
        </div>
        <StatusChip status={order.status} label={order.statusLabel} />
      </div>
      {children}
    </div>
  );
}

/* ============ OVERVIEW ============ */

export function Overview({ data, go }: { data: PortalData; go: (s: SectionKey) => void }) {
  const b = data.badges;
  const cards: { label: string; value: number; tone: string; to: SectionKey }[] = [
    { label: "Active Orders", value: b.activeOrders, tone: "#34e3f5", to: "orders" },
    { label: "Open Requests", value: b.pendingRequests, tone: "#ffd34d", to: "requests" },
    { label: "Unpaid Invoices", value: b.unpaidInvoices, tone: "#ff9d9d", to: "invoices" },
    { label: "Approvals Waiting", value: b.pendingApprovals, tone: "#34e3f5", to: "approvals" },
  ];

  const recent = data.notifications.slice(0, 5);

  return (
    <div className="grid gap-8">
      {/* KPI cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => go(c.to)}
            className="rounded-2xl p-5 text-left transition hover:-translate-y-1"
            style={{ border: `1px solid ${c.tone}33`, background: "rgba(255,255,255,0.035)" }}
          >
            <div className="text-4xl font-black" style={{ color: c.tone }}>
              {c.value}
            </div>
            <div className="mt-1 text-xs font-extrabold uppercase tracking-widest text-muted">
              {c.label}
            </div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <SectionHeading title="Quick Actions" />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => go("requests")} className="btn btn-primary">
            + New Request
          </button>
          <button type="button" onClick={() => go("history")} className="btn btn-secondary">
            ⟳ Reorder
          </button>
          <button type="button" onClick={() => go("invoices")} className="btn btn-secondary">
            💳 Pay an Invoice
          </button>
          <button type="button" onClick={() => go("messages")} className="btn btn-secondary">
            💬 Message Team
          </button>
          <button type="button" onClick={() => go("documents")} className="btn btn-secondary">
            📁 Upload File
          </button>
        </div>
      </div>

      {/* Active orders preview */}
      <div>
        <SectionHeading
          title="Current Orders"
          action={
            data.active.length > 0 ? (
              <button type="button" onClick={() => go("orders")} className="text-sm font-bold text-cyan underline">
                View all →
              </button>
            ) : undefined
          }
        />
        {data.active.length === 0 ? (
          <EmptyState>
            No active orders right now.{" "}
            <button type="button" onClick={() => go("requests")} className="font-bold text-cyan underline">
              Start a new request →
            </button>
          </EmptyState>
        ) : (
          <div className="grid gap-3">
            {data.active.slice(0, 3).map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div>
        <SectionHeading title="Recent Activity" />
        {recent.length === 0 ? (
          <EmptyState>Updates about your orders, invoices, and approvals will show here.</EmptyState>
        ) : (
          <div className="grid gap-2">
            {recent.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => n.section && go(n.section as SectionKey)}
                className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  {!n.read && <span className="h-2 w-2 rounded-full" style={{ background: "#34e3f5" }} />}
                  <div>
                    <span className="block text-sm font-bold text-paper">{n.title}</span>
                    {n.body && <span className="block text-xs text-muted">{n.body}</span>}
                  </div>
                </div>
                <span className="whitespace-nowrap text-xs text-muted-dark">{timeAgo(n.createdAt)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ ORDERS (current & pending) ============ */

export function Orders({ data, go }: { data: PortalData; go: (s: SectionKey) => void }) {
  const pendingRequests = data.requests.filter((r) => r.status !== "answered");
  return (
    <div className="grid gap-8">
      <div>
        <SectionHeading title="Current & Pending Orders" hint="Everything currently in motion." />
        {data.active.length === 0 ? (
          <EmptyState>
            No active orders.{" "}
            <button type="button" onClick={() => go("requests")} className="font-bold text-cyan underline">
              Start a new request →
            </button>
          </EmptyState>
        ) : (
          <div className="grid gap-3">
            {data.active.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeading title="Pending Requests" />
        {pendingRequests.length === 0 ? (
          <EmptyState>No open requests.</EmptyState>
        ) : (
          <div className="grid gap-3">
            {pendingRequests.map((r) => (
              <Panel key={r.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="block text-sm font-bold text-paper">{r.summary}</span>
                  <span className="mt-0.5 block text-xs text-muted">Submitted {fmtDate(r.createdAt)}</span>
                </div>
                <StatusChip status={r.status} />
              </Panel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ HISTORY + REORDER ============ */

export function History({
  data,
  user,
  refresh,
}: {
  data: PortalData;
  user: User;
  refresh: () => void;
}) {
  const [changeFor, setChangeFor] = useState<PortalOrder | null>(null);
  const [changeNotes, setChangeNotes] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function rerun(order: PortalOrder, mode: "exact" | "changes", notes?: string) {
    setBusyId(order.id);
    setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await reorderOrder(token, order.id, mode, notes);
      if (!res.ok) { setErr(res.error ?? "Could not submit reorder."); return; }
      setConfirmed(order.id);
      setChangeFor(null);
      setChangeNotes("");
      refresh();
      setTimeout(() => setConfirmed(null), 3000);
    } catch {
      setErr("Could not submit reorder — please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <SectionHeading title="Order History & Reorder" hint="Rerun a finished job in two clicks." />
      {err && <p className="mb-4 text-sm text-red-300">{err}</p>}
      {data.history.length === 0 ? (
        <EmptyState>
          Completed orders will appear here with one-click reorder. Once your first production run
          finishes, rerunning it takes exactly two clicks.
        </EmptyState>
      ) : (
        <div className="grid gap-3">
          {data.history.map((o) => (
            <OrderRow key={o.id} order={o}>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={busyId === o.id}
                  onClick={() => void rerun(o, "exact")}
                  className="btn btn-primary"
                  style={{ minHeight: 40, fontSize: 13, ...dim(busyId === o.id) }}
                >
                  ⟳ Rerun — No Changes
                </button>
                <button
                  type="button"
                  disabled={busyId === o.id}
                  onClick={() => setChangeFor(changeFor?.id === o.id ? null : o)}
                  className="btn btn-secondary"
                  style={{ minHeight: 40, fontSize: 13 }}
                >
                  ✎ Rerun — With Changes
                </button>
                {confirmed === o.id && (
                  <span className="text-sm font-bold" style={{ color: "#7dffb0" }}>
                    ✓ Reorder submitted
                  </span>
                )}
              </div>
              {changeFor?.id === o.id && (
                <div
                  className="mt-4 rounded-2xl p-4"
                  style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}
                >
                  <Field label="What should change on this rerun?">
                    <textarea
                      style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                      value={changeNotes}
                      onChange={(e) => setChangeNotes(e.target.value)}
                      placeholder="e.g. Update flavor text to 'New Recipe', bump quantity to 50,000, switch finish to matte."
                      autoFocus
                    />
                  </Field>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busyId === o.id || !changeNotes.trim()}
                      onClick={() => void rerun(o, "changes", changeNotes.trim())}
                      className="btn btn-primary"
                      style={{ minHeight: 40, fontSize: 13, ...dim(busyId === o.id || !changeNotes.trim()) }}
                    >
                      Submit Rerun With Changes
                    </button>
                    <button type="button" onClick={() => setChangeFor(null)} className="btn btn-dark" style={{ minHeight: 40, fontSize: 13 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </OrderRow>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ INVOICES + PAYMENT ============ */

const PAY_METHODS = ["ACH / Bank Transfer", "Wire", "Check", "Credit Card (call me)", "Other"];

export function Invoices({
  data,
  user,
  refresh,
}: {
  data: PortalData;
  user: User;
  refresh: () => void;
}) {
  const [payFor, setPayFor] = useState<PortalInvoice | null>(null);

  const outstanding = data.invoices.filter((i) => i.status === "unpaid" || i.status === "overdue");
  const totalDue = outstanding.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <SectionHeading
        title="Invoices & Payments"
        hint={
          outstanding.length
            ? `${outstanding.length} invoice${outstanding.length > 1 ? "s" : ""} outstanding · ${fmtMoney(totalDue)} due`
            : "All settled — nothing outstanding."
        }
      />
      {data.invoices.length === 0 ? (
        <EmptyState>Invoices issued by Microflex will appear here, with a one-tap way to submit payment.</EmptyState>
      ) : (
        <div className="grid gap-3">
          {data.invoices.map((inv) => (
            <Panel key={inv.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan">{inv.invoiceNumber}</span>
                    <span className="text-base font-bold text-paper">{fmtMoney(inv.amount, inv.currency)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {inv.description}
                    {inv.orderNumber ? ` · Order #${inv.orderNumber}` : ""} · Issued {fmtDate(inv.issuedAt)}
                    {inv.dueAt ? ` · Due ${fmtDate(inv.dueAt)}` : ""}
                  </p>
                </div>
                <StatusChip status={inv.status} label={inv.statusLabel} />
              </div>
              {(inv.status === "unpaid" || inv.status === "overdue") && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setPayFor(payFor?.id === inv.id ? null : inv)}
                    className="btn btn-primary"
                    style={{ minHeight: 40, fontSize: 13 }}
                  >
                    💳 Pay / Submit Payment
                  </button>
                </div>
              )}
              {inv.status === "processing" && (
                <p className="mt-3 text-xs" style={{ color: "#34e3f5" }}>
                  Payment submitted — we&apos;re confirming receipt.
                </p>
              )}
              {payFor?.id === inv.id && (
                <PaymentForm invoice={inv} user={user} onDone={() => { setPayFor(null); refresh(); }} onCancel={() => setPayFor(null)} />
              )}
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentForm({
  invoice,
  user,
  onDone,
  onCancel,
}: {
  invoice: PortalInvoice;
  user: User;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [method, setMethod] = useState(PAY_METHODS[0]);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const token = await user.getIdToken();
      let proof: { name: string; url: string } | undefined;
      if (file && isStorageConfigured()) {
        const up = await uploadPortalFile(user.uid, "payment-proof", file);
        proof = { name: up.name, url: up.url };
      }
      const res = await submitInvoicePayment(token, invoice.id, { method, reference, note, proof });
      if (!res.ok) { setErr(res.error ?? "Could not submit payment."); return; }
      onDone();
    } catch {
      setErr("Could not submit payment — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-2xl p-4" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}>
      <p className="mb-3 text-sm text-muted">
        Submitting payment details for <span className="font-bold text-paper">{invoice.invoiceNumber}</span> ·{" "}
        {fmtMoney(invoice.amount, invoice.currency)}. Our team confirms receipt and marks it paid.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Payment method">
          <select style={inputStyle} value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAY_METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Reference / confirmation #">
          <input style={inputStyle} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. ACH trace, check #" />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Note (optional)">
          <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything we should know about this payment." />
        </Field>
      </div>
      {isStorageConfigured() && (
        <div className="mt-4">
          <Field label="Attach proof (optional)">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm text-muted" />
          </Field>
        </div>
      )}
      {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
      <div className="mt-4 flex gap-2">
        <button type="button" disabled={busy} onClick={() => void submit()} className="btn btn-primary" style={{ minHeight: 40, fontSize: 13, ...dim(busy) }}>
          {busy ? "Submitting…" : "Submit Payment"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-dark" style={{ minHeight: 40, fontSize: 13 }}>Cancel</button>
      </div>
    </div>
  );
}

/* ============ NEW REQUEST FORM ============ */

const REQUEST_TYPES = ["Request a Quote", "Upload Artwork", "Submit Purchase Order", "Request Sample Kit", "Project Support", "Invoice / Billing Question"];
const PACKAGING_TYPES = ["Printed Film / Rollstock", "Stand-Up Pouch", "Lay-Flat Pouch", "Labels & Stickers", "Shrink Sleeves", "Sachets / Stick Packs", "Display & Shipping", "Custom / Not Sure"];
const QUANTITIES = ["Under 5,000", "5,000 – 25,000", "25,000 – 100,000", "100,000 – 500,000", "500,000+", "Not sure yet"];
const TIMELINES = ["ASAP / Rush", "Within 30 days", "1 – 3 months", "3 – 6 months", "Exploring options"];

export function RequestForm({ user, onDone }: { user: User; onDone: () => void }) {
  const [form, setForm] = useState({
    type: REQUEST_TYPES[0],
    packagingType: PACKAGING_TYPES[0],
    quantity: QUANTITIES[0],
    timeline: TIMELINES[1],
    skus: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const token = await user.getIdToken();
      await submitPortalRequest(token, form);
      setDone(true);
      setTimeout(onDone, 1600);
    } catch {
      setErr("Something went wrong — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl p-8 text-center" style={{ border: "1px solid rgba(95,255,162,0.35)", background: "rgba(95,255,162,0.06)" }}>
        <div className="mb-2 text-3xl">✓</div>
        <h3 className="mb-1 text-lg font-bold text-paper">Request received</h3>
        <p className="text-sm text-muted">The Microflex team has been notified — it now shows under Pending Requests.</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading title="New Request" hint="Tell us what you need — we route it to your account team." />
      <form onSubmit={submit} className="grid max-w-2xl gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="What do you need?">
            <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Packaging type">
            <select style={inputStyle} value={form.packagingType} onChange={(e) => setForm({ ...form, packagingType: e.target.value })}>
              {PACKAGING_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Quantity">
            <select style={inputStyle} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}>
              {QUANTITIES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Timeline">
            <select style={inputStyle} value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
              {TIMELINES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="SKU names / product names (optional)">
          <input style={inputStyle} value={form.skus} onChange={(e) => setForm({ ...form, skus: e.target.value })} placeholder="e.g. Vanilla 12oz, Mocha 12oz" />
        </Field>
        <Field label="Project details">
          <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about the project, artwork status, materials, finishes, or questions." />
        </Field>
        {err && <p className="text-sm text-red-300">{err}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary" style={dim(busy)}>
          {busy ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

/* ============ MESSAGES ============ */

export function Messages({
  data,
  user,
  refresh,
}: {
  data: PortalData;
  user: User;
  refresh: () => void;
}) {
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && !file) return;
    setBusy(true);
    setErr(null);
    try {
      const token = await user.getIdToken();
      let attachment: { name: string; url: string } | undefined;
      if (file && isStorageConfigured()) {
        const up = await uploadPortalFile(user.uid, "messages", file);
        attachment = { name: up.name, url: up.url };
      }
      const res = await sendPortalMessage(token, body, attachment);
      if (!res.ok) { setErr(res.error ?? "Could not send."); return; }
      setBody("");
      setFile(null);
      refresh();
    } catch {
      setErr("Could not send — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <SectionHeading title="Messages" hint="A direct line to your Microflex account team." />
      <div
        className="mb-4 grid gap-3 rounded-2xl p-4"
        style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2,5,9,0.35)", maxHeight: 460, overflowY: "auto" }}
      >
        {data.messages.length === 0 ? (
          <EmptyState>No messages yet. Say hello — we usually reply within one business day.</EmptyState>
        ) : (
          data.messages.map((m) => {
            const mine = m.sender === "client";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[78%] rounded-2xl px-4 py-2.5"
                  style={{
                    background: mine ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${mine ? "rgba(0,216,242,0.4)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div className="mb-0.5 text-[11px] font-bold text-muted">
                    {m.authorName} · {fmtDateTime(m.createdAt)}
                  </div>
                  {m.body && <p className="whitespace-pre-wrap text-sm text-paper">{m.body}</p>}
                  {m.attachmentUrl && (
                    <a href={m.attachmentUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-bold text-cyan underline">
                      📎 {m.attachmentName ?? "Attachment"}
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={send} className="grid gap-3">
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message to the Microflex team…"
        />
        <div className="flex flex-wrap items-center gap-3">
          {isStorageConfigured() && (
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm text-muted" />
          )}
          <button type="submit" disabled={busy || (!body.trim() && !file)} className="btn btn-primary ml-auto" style={dim(busy || (!body.trim() && !file))}>
            {busy ? "Sending…" : "Send"}
          </button>
        </div>
        {err && <p className="text-sm text-red-300">{err}</p>}
      </form>
    </div>
  );
}

/* ============ DOCUMENTS ============ */

const DOC_CATEGORIES = ["artwork", "spec", "po", "contract", "sample", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  artwork: "Artwork", spec: "Spec", po: "Purchase Order", contract: "Contract",
  invoice: "Invoice", sample: "Sample", other: "Other",
};

export function Documents({
  data,
  user,
  refresh,
}: {
  data: PortalData;
  user: User;
  refresh: () => void;
}) {
  const [category, setCategory] = useState(DOC_CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      if (!isStorageConfigured()) throw new Error("storage");
      const up = await uploadPortalFile(user.uid, "documents", file);
      const token = await user.getIdToken();
      const res = await recordPortalDocument(token, {
        name: up.name, url: up.url, category, contentType: up.contentType, size: up.size,
      });
      if (!res.ok) { setErr(res.error ?? "Upload failed."); return; }
      setFile(null);
      refresh();
    } catch {
      setErr("Upload failed — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <SectionHeading title="Documents & Files" hint="Your shared library — artwork, specs, POs, contracts, and more." />

      {isStorageConfigured() ? (
        <Panel className="mb-6" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}>
          <div className="grid gap-4 sm:grid-cols-[1fr,auto] sm:items-end">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </Field>
              <Field label="File">
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm text-muted" />
              </Field>
            </div>
            <button type="button" disabled={busy || !file} onClick={() => void upload()} className="btn btn-primary" style={dim(busy || !file)}>
              {busy ? "Uploading…" : "↑ Upload"}
            </button>
          </div>
          {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
        </Panel>
      ) : (
        <EmptyState>
          File uploads come online once cloud storage is configured (set
          <span className="text-paper"> NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</span>). Documents shared by our team still appear below.
        </EmptyState>
      )}

      {data.documents.length === 0 ? (
        <EmptyState>No documents yet. Files you upload — and files we share with you — will live here.</EmptyState>
      ) : (
        <div className="grid gap-2">
          {data.documents.map((d) => (
            <a
              key={d.id}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <span className="block text-sm font-bold text-paper">{d.name}</span>
                  <span className="block text-xs text-muted">
                    {CATEGORY_LABELS[d.category] ?? d.category} · {d.uploadedBy === "team" ? "Microflex" : "You"} · {fmtDate(d.createdAt)}
                    {d.size ? ` · ${fmtBytes(d.size)}` : ""}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan">Open ↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ APPROVALS ============ */

export function Approvals({
  data,
  user,
  refresh,
}: {
  data: PortalData;
  user: User;
  refresh: () => void;
}) {
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const pending = data.approvals.filter((a) => a.status === "pending");
  const decided = data.approvals.filter((a) => a.status !== "pending");

  async function act(a: PortalApproval, decision: "approved" | "changes_requested", n?: string) {
    setBusyId(a.id);
    setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await actOnApproval(token, a.id, decision, n);
      if (!res.ok) { setErr(res.error ?? "Could not submit."); return; }
      setOpenFor(null);
      setNotes("");
      refresh();
    } catch {
      setErr("Could not submit — please try again.");
    } finally {
      setBusyId(null);
    }
  }

  function Card({ a }: { a: PortalApproval }) {
    return (
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="block text-base font-bold text-paper">{a.title}</span>
            {a.description && <p className="mt-1 text-sm text-muted">{a.description}</p>}
            <p className="mt-1 text-xs text-muted-dark">Sent {fmtDate(a.createdAt)}</p>
          </div>
          <StatusChip status={a.status} label={a.statusLabel} />
        </div>
        {a.url && (
          <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-bold text-cyan underline">
            📎 View file
          </a>
        )}
        {a.status === "pending" ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={busyId === a.id} onClick={() => void act(a, "approved")} className="btn btn-primary" style={{ minHeight: 40, fontSize: 13, ...dim(busyId === a.id) }}>
                ✓ Approve
              </button>
              <button type="button" disabled={busyId === a.id} onClick={() => setOpenFor(openFor === a.id ? null : a.id)} className="btn btn-secondary" style={{ minHeight: 40, fontSize: 13 }}>
                ✎ Request Changes
              </button>
            </div>
            {openFor === a.id && (
              <div className="mt-4 rounded-2xl p-4" style={{ border: "1px solid rgba(255,196,0,0.35)", background: "rgba(255,196,0,0.06)" }}>
                <Field label="What needs to change?">
                  <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the revisions you need." autoFocus />
                </Field>
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={busyId === a.id || !notes.trim()} onClick={() => void act(a, "changes_requested", notes.trim())} className="btn btn-primary" style={{ minHeight: 40, fontSize: 13, ...dim(busyId === a.id || !notes.trim()) }}>
                    Send Change Request
                  </button>
                  <button type="button" onClick={() => setOpenFor(null)} className="btn btn-dark" style={{ minHeight: 40, fontSize: 13 }}>Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          a.decisionNotes && <p className="mt-3 text-xs text-muted">Your note: {a.decisionNotes}</p>
        )}
      </Panel>
    );
  }

  return (
    <div className="grid gap-8">
      {err && <p className="text-sm text-red-300">{err}</p>}
      <div>
        <SectionHeading title="Awaiting Your Approval" hint="Proofs, quotes, and POs that need your sign-off." />
        {pending.length === 0 ? (
          <EmptyState>Nothing waiting on you right now. 🎉</EmptyState>
        ) : (
          <div className="grid gap-3">{pending.map((a) => <Card key={a.id} a={a} />)}</div>
        )}
      </div>
      {decided.length > 0 && (
        <div>
          <SectionHeading title="Decided" />
          <div className="grid gap-3">{decided.map((a) => <Card key={a.id} a={a} />)}</div>
        </div>
      )}
    </div>
  );
}

/* ============ NOTIFICATIONS ============ */

export function Notifications({
  data,
  user,
  refresh,
  go,
}: {
  data: PortalData;
  user: User;
  refresh: () => void;
  go: (s: SectionKey) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function markAll() {
    setBusy(true);
    try {
      const token = await user.getIdToken();
      await markNotificationsRead(token);
      refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <SectionHeading
        title="Notifications"
        action={
          data.badges.unreadNotifications > 0 ? (
            <button type="button" disabled={busy} onClick={() => void markAll()} className="btn btn-secondary" style={{ minHeight: 38, fontSize: 13, ...dim(busy) }}>
              Mark all read
            </button>
          ) : undefined
        }
      />
      {data.notifications.length === 0 ? (
        <EmptyState>You&apos;re all caught up. Updates about orders, invoices, and approvals will appear here.</EmptyState>
      ) : (
        <div className="grid gap-2">
          {data.notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => n.section && go(n.section as SectionKey)}
              className="flex items-start justify-between gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
              style={{ border: `1px solid ${n.read ? "rgba(255,255,255,0.08)" : "rgba(0,216,242,0.35)"}`, background: n.read ? "transparent" : "rgba(0,216,242,0.04)" }}
            >
              <div className="flex items-start gap-3">
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "#34e3f5" }} />}
                <div>
                  <span className="block text-sm font-bold text-paper">{n.title}</span>
                  {n.body && <span className="mt-0.5 block text-xs text-muted">{n.body}</span>}
                </div>
              </div>
              <span className="whitespace-nowrap text-xs text-muted-dark">{timeAgo(n.createdAt)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
