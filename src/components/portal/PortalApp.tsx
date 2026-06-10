"use client";

import { useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase-client";
import {
  getPortalData,
  submitPortalRequest,
  reorderOrder,
  type PortalData,
  type PortalOrder,
} from "@/app/actions/portal";

/* ============ status chip ============ */

const STATUS_TONES: Record<string, { bg: string; border: string; color: string }> = {
  pending: { bg: "rgba(255,196,0,0.1)", border: "rgba(255,196,0,0.4)", color: "#ffd34d" },
  in_review: { bg: "rgba(0,216,242,0.08)", border: "rgba(0,216,242,0.35)", color: "#34e3f5" },
  in_prepress: { bg: "rgba(0,216,242,0.08)", border: "rgba(0,216,242,0.35)", color: "#34e3f5" },
  in_production: { bg: "rgba(0,216,242,0.14)", border: "rgba(0,216,242,0.55)", color: "#34e3f5" },
  shipping: { bg: "rgba(95,255,162,0.08)", border: "rgba(95,255,162,0.35)", color: "#7dffb0" },
  completed: { bg: "rgba(169,185,200,0.08)", border: "rgba(169,185,200,0.3)", color: "#bdd0dc" },
  answered: { bg: "rgba(95,255,162,0.08)", border: "rgba(95,255,162,0.35)", color: "#7dffb0" },
};

function StatusChip({ status, label }: { status: string; label?: string }) {
  const tone = STATUS_TONES[status] ?? STATUS_TONES.pending;
  return (
    <span
      className="rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider"
      style={{ background: tone.bg, border: `1px solid ${tone.border}`, color: tone.color }}
    >
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ============ main app ============ */

type Tab = "overview" | "request" | "history";

export default function PortalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState<string | null>(null);

  const auth = getFirebaseAuth();

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, [auth]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      setData(await getPortalData(token));
    } catch {
      setError("Could not load your workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) void refresh();
  }, [user, refresh]);

  if (!isFirebaseConfigured()) {
    return (
      <Shell>
        <div className="card !min-h-0 mx-auto max-w-xl text-center">
          <h2 className="mb-2 text-xl font-bold text-paper">Client portal coming online</h2>
          <p className="text-sm leading-relaxed text-muted">
            Secure client sign-in is being activated. In the meantime, use the{" "}
            <a href="/#quote-form" className="font-bold text-cyan underline">project form</a>{" "}
            or email <span className="text-paper">info@microflexfilm.com</span>.
          </p>
        </div>
      </Shell>
    );
  }

  if (!authReady) {
    return (
      <Shell>
        <p className="text-center text-muted">Loading…</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <SignIn />
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Workspace header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="kicker mb-1">Client Workspace</div>
          <h2 className="text-2xl font-black text-paper md:text-3xl">
            Welcome back{user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}.
          </h2>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void refresh()} className="btn btn-secondary">
            ↻ Refresh
          </button>
          <button
            type="button"
            onClick={() => auth && void signOut(auth)}
            className="btn btn-dark"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {(
          [
            ["overview", "Current & Pending"],
            ["request", "New Request"],
            ["history", "Order History & Reorder"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className="rounded-full px-5 py-2.5 text-sm font-extrabold transition"
            style={{
              border: `1px solid ${tab === id ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
              background:
                tab === id
                  ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))"
                  : "rgba(255,255,255,0.03)",
              color: tab === id ? "#34e3f5" : "#a9b9c8",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {tab === "overview" && <Overview data={data} loading={loading} onNewRequest={() => setTab("request")} />}
      {tab === "request" && <RequestForm user={user} onDone={() => { setTab("overview"); void refresh(); }} />}
      {tab === "history" && <History data={data} loading={loading} user={user} onDone={() => void refresh()} />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-4xl p-6 md:p-10"
      style={{
        border: "1px solid rgba(0,216,242,0.25)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
      }}
    >
      {children}
    </div>
  );
}

/* ============ sign-in ============ */

function SignIn() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    setBusy(true);
    setErr(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setErr("Sign-in didn't complete. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <div className="kicker mb-3">Client Login</div>
      <h2 className="display mb-3 text-[clamp(28px,3.4vw,44px)] text-paper">
        Your packaging workspace.
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-muted">
        Sign in to view current and pending orders, submit requests, and reorder
        previous runs with one click.
      </p>
      <button
        type="button"
        onClick={() => void go()}
        disabled={busy}
        className="btn btn-primary w-full"
        style={busy ? { opacity: 0.6 } : undefined}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" className="mr-2" aria-hidden>
          <path fill="#001018" d="M21.35 11.1H12v2.9h5.35c-.5 2.5-2.6 4.3-5.35 4.3a5.8 5.8 0 1 1 0-11.6c1.5 0 2.85.55 3.9 1.45l2.15-2.15A8.86 8.86 0 0 0 12 3.5a8.5 8.5 0 1 0 0 17c4.9 0 8.6-3.45 8.6-8.5 0-.3-.1-.6-.25-.9Z" />
        </svg>
        {busy ? "Opening Google…" : "Continue with Google"}
      </button>
      {err && <p className="mt-4 text-sm text-red-300">{err}</p>}
      <p className="mt-6 text-xs leading-relaxed text-muted-dark">
        New to Microflex? Sign in with your work Google account — your workspace is
        created automatically and our team links your orders to it.
      </p>
    </div>
  );
}

/* ============ overview ============ */

function Overview({
  data,
  loading,
  onNewRequest,
}: {
  data: PortalData | null;
  loading: boolean;
  onNewRequest: () => void;
}) {
  if (loading && !data) return <p className="text-muted">Loading your workspace…</p>;

  const active = data?.active ?? [];
  const pendingRequests = (data?.requests ?? []).filter((r) => r.status !== "answered");

  return (
    <div className="grid gap-8">
      {/* Active orders */}
      <div>
        <h3 className="mb-4 text-lg font-black uppercase tracking-widest text-paper">
          Current Orders
        </h3>
        {active.length === 0 ? (
          <div className="card !min-h-0 text-center">
            <p className="text-sm text-muted">
              No active orders right now.{" "}
              <button type="button" onClick={onNewRequest} className="font-bold text-cyan underline">
                Start a new request →
              </button>
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {active.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>

      {/* Pending requests */}
      <div>
        <h3 className="mb-4 text-lg font-black uppercase tracking-widest text-paper">
          Pending Requests
        </h3>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted">No open requests.</p>
        ) : (
          <div className="grid gap-3">
            {pendingRequests.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4"
                style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
              >
                <div>
                  <span className="block text-sm font-bold text-paper">{r.summary}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    Submitted {fmtDate(r.createdAt)}
                  </span>
                </div>
                <StatusChip status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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

/* ============ new request form ============ */

const REQUEST_TYPES = [
  "Request a Quote",
  "Upload Artwork",
  "Submit Purchase Order",
  "Request Sample Kit",
  "Project Support",
  "Invoice / Billing Question",
];

const PACKAGING_TYPES = [
  "Printed Film / Rollstock",
  "Stand-Up Pouch",
  "Lay-Flat Pouch",
  "Labels & Stickers",
  "Shrink Sleeves",
  "Sachets / Stick Packs",
  "Display & Shipping",
  "Custom / Not Sure",
];

const QUANTITIES = [
  "Under 5,000",
  "5,000 – 25,000",
  "25,000 – 100,000",
  "100,000 – 500,000",
  "500,000+",
  "Not sure yet",
];

const TIMELINES = [
  "ASAP / Rush",
  "Within 30 days",
  "1 – 3 months",
  "3 – 6 months",
  "Exploring options",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(2,5,9,0.6)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "12px 14px",
  color: "#f7fbff",
  fontSize: "14px",
};

function RequestForm({ user, onDone }: { user: User; onDone: () => void }) {
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
      <div className="card !min-h-0 mx-auto max-w-lg text-center">
        <div className="mb-2 text-3xl">✓</div>
        <h3 className="mb-1 text-lg font-bold text-paper">Request received</h3>
        <p className="text-sm text-muted">
          The Microflex team has been notified and it now shows under Pending Requests.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-2xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What do you need?">
          <select
            style={inputStyle}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Packaging type">
          <select
            style={inputStyle}
            value={form.packagingType}
            onChange={(e) => setForm({ ...form, packagingType: e.target.value })}
          >
            {PACKAGING_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Quantity">
          <select
            style={inputStyle}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          >
            {QUANTITIES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Timeline">
          <select
            style={inputStyle}
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          >
            {TIMELINES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="SKU names / product names (optional)">
        <input
          style={inputStyle}
          value={form.skus}
          onChange={(e) => setForm({ ...form, skus: e.target.value })}
          placeholder="e.g. Vanilla 12oz, Mocha 12oz"
        />
      </Field>
      <Field label="Project details">
        <textarea
          style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us about the project, artwork status, materials, finishes, or questions."
        />
      </Field>
      {err && <p className="text-sm text-red-300">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="btn btn-primary"
        style={busy ? { opacity: 0.6 } : undefined}
      >
        {busy ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}

/* ============ history + reorder ============ */

function History({
  data,
  loading,
  user,
  onDone,
}: {
  data: PortalData | null;
  loading: boolean;
  user: User;
  onDone: () => void;
}) {
  const [changeFor, setChangeFor] = useState<PortalOrder | null>(null);
  const [changeNotes, setChangeNotes] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const history = data?.history ?? [];

  async function rerun(order: PortalOrder, mode: "exact" | "changes", notes?: string) {
    setBusyId(order.id);
    setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await reorderOrder(token, order.id, mode, notes);
      if (!res.ok) {
        setErr(res.error ?? "Could not submit reorder.");
        return;
      }
      setConfirmed(order.id);
      setChangeFor(null);
      setChangeNotes("");
      onDone();
      setTimeout(() => setConfirmed(null), 3000);
    } catch {
      setErr("Could not submit reorder — please try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading && !data) return <p className="text-muted">Loading order history…</p>;

  if (history.length === 0) {
    return (
      <div className="card !min-h-0 text-center">
        <p className="text-sm text-muted">
          Completed orders will appear here with one-click reorder. Once your first
          production run finishes, rerunning it takes exactly two clicks.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {err && <p className="text-sm text-red-300">{err}</p>}
      {history.map((o) => (
        <OrderRow key={o.id} order={o}>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busyId === o.id}
              onClick={() => void rerun(o, "exact")}
              className="btn btn-primary"
              style={{ minHeight: 40, fontSize: 13, ...(busyId === o.id ? { opacity: 0.6 } : {}) }}
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
                ✓ Reorder submitted — now in Pending Requests
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
                  style={{
                    minHeight: 40,
                    fontSize: 13,
                    ...(busyId === o.id || !changeNotes.trim() ? { opacity: 0.5 } : {}),
                  }}
                >
                  Submit Rerun With Changes
                </button>
                <button
                  type="button"
                  onClick={() => setChangeFor(null)}
                  className="btn btn-dark"
                  style={{ minHeight: 40, fontSize: 13 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </OrderRow>
      ))}
    </div>
  );
}
