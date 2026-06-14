"use client";

/* ============ shared status tones ============ */

export const STATUS_TONES: Record<string, { bg: string; border: string; color: string }> = {
  pending: { bg: "rgba(255,196,0,0.1)", border: "rgba(255,196,0,0.4)", color: "#ffd34d" },
  in_review: { bg: "rgba(0,216,242,0.08)", border: "rgba(0,216,242,0.35)", color: "#34e3f5" },
  in_prepress: { bg: "rgba(0,216,242,0.08)", border: "rgba(0,216,242,0.35)", color: "#34e3f5" },
  in_production: { bg: "rgba(0,216,242,0.14)", border: "rgba(0,216,242,0.55)", color: "#34e3f5" },
  shipping: { bg: "rgba(95,255,162,0.08)", border: "rgba(95,255,162,0.35)", color: "#7dffb0" },
  completed: { bg: "rgba(169,185,200,0.08)", border: "rgba(169,185,200,0.3)", color: "#bdd0dc" },
  answered: { bg: "rgba(95,255,162,0.08)", border: "rgba(95,255,162,0.35)", color: "#7dffb0" },
  // invoices
  unpaid: { bg: "rgba(255,196,0,0.1)", border: "rgba(255,196,0,0.4)", color: "#ffd34d" },
  processing: { bg: "rgba(0,216,242,0.1)", border: "rgba(0,216,242,0.4)", color: "#34e3f5" },
  paid: { bg: "rgba(95,255,162,0.08)", border: "rgba(95,255,162,0.35)", color: "#7dffb0" },
  overdue: { bg: "rgba(255,90,90,0.1)", border: "rgba(255,90,90,0.45)", color: "#ff9d9d" },
  // approvals
  approved: { bg: "rgba(95,255,162,0.08)", border: "rgba(95,255,162,0.35)", color: "#7dffb0" },
  changes_requested: { bg: "rgba(255,196,0,0.1)", border: "rgba(255,196,0,0.4)", color: "#ffd34d" },
};

export function StatusChip({ status, label }: { status: string; label?: string }) {
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

/* ============ formatting ============ */

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function fmtBytes(bytes?: number) {
  if (!bytes) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return fmtDate(iso);
}

/* ============ form primitives ============ */

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(2,5,9,0.6)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "12px 14px",
  color: "#f7fbff",
  fontSize: "14px",
};

/* ============ layout primitives ============ */

export function Panel({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        border: "1px solid rgba(0,216,242,0.18)",
        background: "rgba(255,255,255,0.035)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 className="text-lg font-black uppercase tracking-widest text-paper">{title}</h3>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-8 text-center text-sm text-muted"
      style={{ border: "1px dashed rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.02)" }}
    >
      {children}
    </div>
  );
}
