"use client";

import { useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  submitPO,
  signSalesOrder,
  decideArtwork,
  sendQuoteMessage,
  recordQuoteFiles,
  submitProfileChange,
  type PortalData,
  type PortalQuote,
  type PortalSalesOrder,
  type PortalFile,
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
  timeAgo,
} from "./ui";
import { uploadPortalFile, isStorageConfigured } from "./upload";

export type SectionKey = "overview" | "quotes" | "orders" | "status" | "messages" | "documents" | "account";

const dim = (on: boolean) => (on ? { opacity: 0.55 } : undefined);

/* ============================ OVERVIEW ============================ */

export function Overview({ data, go }: { data: PortalData; go: (s: SectionKey) => void }) {
  const b = data.badges;
  const cards = [
    { label: "Quotes to Review", value: b.quotesToReview, tone: "#ffd34d", to: "quotes" as SectionKey },
    { label: "Orders to Sign", value: b.ordersToSign + b.artworkToApprove, tone: "#34e3f5", to: "orders" as SectionKey },
    { label: "In Production", value: b.inProduction, tone: "#7dffb0", to: "status" as SectionKey },
    { label: "Active Jobs", value: data.jobs.length, tone: "#34e3f5", to: "status" as SectionKey },
  ];

  return (
    <div className="grid gap-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => go(c.to)}
            className="rounded-2xl p-5 text-left transition hover:-translate-y-1"
            style={{ border: `1px solid ${c.tone}33`, background: "rgba(255,255,255,0.035)" }}
          >
            <div className="text-4xl font-black" style={{ color: c.tone }}>{c.value}</div>
            <div className="mt-1 text-xs font-extrabold uppercase tracking-widest text-muted">{c.label}</div>
          </button>
        ))}
      </div>

      {/* Action items */}
      <div>
        <SectionHeading title="Needs Your Attention" />
        <ActionItems data={data} go={go} />
      </div>

      {/* Pipeline snapshot */}
      <div>
        <SectionHeading
          title="Your Jobs"
          action={data.jobs.length > 0 ? (
            <button type="button" onClick={() => go("status")} className="text-sm font-bold text-cyan underline">
              Full status →
            </button>
          ) : undefined}
        />
        {data.jobs.length === 0 ? (
          <EmptyState>No active jobs yet. Quotes we send you will appear here and walk through to delivery.</EmptyState>
        ) : (
          <div className="grid gap-3">
            {data.jobs.slice(0, 4).map((j) => (
              <Panel key={j.quoteId}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-paper">{j.title}</span>
                  <span className="font-mono text-xs text-cyan">{j.soNum ?? j.quoteNum}</span>
                </div>
                <MiniTracker stages={data.stages.map((s) => s.label)} current={j.stageIndex} />
              </Panel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionItems({ data, go }: { data: PortalData; go: (s: SectionKey) => void }) {
  const items: { text: string; cta: string; to: SectionKey }[] = [];
  data.quotes.filter((q) => q.status === "sent").forEach((q) =>
    items.push({ text: `Quote ${q.quoteNum} is ready — review pricing and submit your PO.`, cta: "Review quote", to: "quotes" })
  );
  data.salesOrders.filter((so) => so.status === "sent" && !so.clientSignature).forEach((so) =>
    items.push({ text: `Order ${so.soNum} is awaiting your signature.`, cta: "Sign order", to: "orders" })
  );
  data.salesOrders.filter((so) => !so.artworkApproved && so.artFiles.length > 0 && so.status !== "pending").forEach((so) =>
    items.push({ text: `Artwork proof for ${so.soNum} needs your approval.`, cta: "Review proof", to: "orders" })
  );

  if (items.length === 0) return <EmptyState>You&apos;re all caught up. 🎉</EmptyState>;
  return (
    <div className="grid gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
          style={{ border: "1px solid rgba(0,216,242,0.35)", background: "rgba(0,216,242,0.05)" }}>
          <span className="text-sm font-semibold text-paper">{it.text}</span>
          <button type="button" onClick={() => go(it.to)} className="btn btn-primary" style={{ minHeight: 36, fontSize: 13 }}>
            {it.cta}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ============================ TRACKERS ============================ */

function MiniTracker({ stages, current }: { stages: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {stages.map((s, i) => (
        <div key={s} className="flex flex-1 flex-col items-center gap-1">
          <div className="h-1.5 w-full rounded-full" style={{ background: i <= current ? "#00d8f2" : "rgba(255,255,255,0.12)" }} />
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: i === current ? "#34e3f5" : i < current ? "#7dffb0" : "#536575" }}>
            {s.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

function FullTracker({ stages, current }: { stages: string[]; current: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <div key={s} className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              border: `1px solid ${active ? "rgba(0,216,242,0.7)" : done ? "rgba(95,255,162,0.4)" : "rgba(255,255,255,0.12)"}`,
              background: active ? "rgba(0,216,242,0.12)" : done ? "rgba(95,255,162,0.06)" : "transparent",
            }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black"
              style={{ background: done ? "#7dffb0" : active ? "#00d8f2" : "rgba(255,255,255,0.12)", color: done || active ? "#001018" : "#a9b9c8" }}>
              {done ? "✓" : i + 1}
            </span>
            <span className="text-xs font-bold" style={{ color: active ? "#34e3f5" : done ? "#7dffb0" : "#a9b9c8" }}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================ STATUS ============================ */

export function Status({ data }: { data: PortalData }) {
  const labels = data.stages.map((s) => s.label);
  return (
    <div>
      <SectionHeading title="Order Status" hint="Every job, from quote to delivery." />
      {data.jobs.length === 0 ? (
        <EmptyState>No jobs in progress. Once we send you a quote, you can track it here end-to-end.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {data.jobs.map((j) => (
            <Panel key={j.quoteId}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="block text-sm font-bold text-paper">{j.title}</span>
                  <span className="font-mono text-xs text-muted">
                    {j.quoteNum}{j.soNum ? ` · ${j.soNum}` : ""}
                  </span>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "#34e3f5" }}>
                  {j.stageLabel}
                </span>
              </div>
              <FullTracker stages={labels} current={j.stageIndex} />
              <p className="mt-3 text-xs text-muted-dark">Updated {timeAgo(j.updatedAt)}</p>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================ QUOTES ============================ */

export function Quotes({ data, user, refresh }: { data: PortalData; user: User; refresh: () => void }) {
  return (
    <div>
      <SectionHeading title="Quotes" hint="Review pricing, pick your quantity, and submit a PO." />
      {data.quotes.length === 0 ? (
        <EmptyState>No quotes yet. When our team sends you a quote, it lands here for review and one-click PO submission.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {data.quotes.map((q) => <QuoteCard key={q.id} quote={q} user={user} refresh={refresh} />)}
        </div>
      )}
    </div>
  );
}

function QuoteCard({ quote, user, refresh }: { quote: PortalQuote; user: User; refresh: () => void }) {
  const [open, setOpen] = useState(quote.canSubmitPO);
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan">{quote.quoteNum}{quote.rev ? `-${quote.rev}` : ""}</span>
            <span className="text-base font-bold text-paper">{quote.company || quote.jobDesc}</span>
          </div>
          {quote.specs && <p className="mt-1 text-xs text-muted">{quote.specs}</p>}
          <p className="mt-0.5 text-xs text-muted-dark">Terms {quote.payTerms} · Updated {fmtDate(quote.updatedAt)}</p>
        </div>
        <StatusChip status={quote.status} label={quote.statusLabel} />
      </div>

      {quote.canSubmitPO ? (
        <>
          <button type="button" onClick={() => setOpen(!open)} className="mt-4 text-sm font-bold text-cyan underline">
            {open ? "Hide PO form" : "Review & submit PO →"}
          </button>
          {open && <POForm quote={quote} user={user} refresh={refresh} />}
        </>
      ) : (
        <div className="mt-4 rounded-xl p-3 text-xs text-muted" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {quote.poNumber ? (
            <>PO <span className="font-bold text-paper">#{quote.poNumber}</span> submitted
            {quote.poSelectedQty ? ` · ${quote.poSelectedQty.toLocaleString()} units` : ""}
            {quote.poSelectedTotal ? ` · ${fmtMoney(quote.poSelectedTotal)}` : ""}. We&apos;ll take it from here.</>
          ) : (
            <>This quote is {quote.statusLabel.toLowerCase()}.</>
          )}
        </div>
      )}
    </Panel>
  );
}

function POForm({ quote, user, refresh }: { quote: PortalQuote; user: User; refresh: () => void }) {
  const skuOptions = Array.from({ length: Math.max(1, quote.skuCount) }, (_, i) => i);
  const [skuCol, setSkuCol] = useState(quote.poSkuCount ?? 0);
  const [tierIdx, setTierIdx] = useState(quote.poQtyIndex ?? 0);
  const [poNumber, setPoNumber] = useState(quote.poNumber ?? "");
  const [shipTo, setShipTo] = useState(quote.poShipTo ?? "");
  const [instructions, setInstructions] = useState(quote.poInstructions ?? "");
  const [signature, setSignature] = useState(quote.poSignature ?? "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"po" | "art" | null>(null);

  const tier = quote.tiers[tierIdx];

  async function upload(kind: "po" | "art", files: FileList | null) {
    if (!files || !files.length) return;
    if (!isStorageConfigured()) { setErr("File storage isn't enabled yet."); return; }
    setUploading(kind);
    setErr(null);
    try {
      const uploaded: PortalFile[] = [];
      for (const file of Array.from(files)) {
        const up = await uploadPortalFile(quote.id, kind, file);
        uploaded.push({ name: up.name, url: up.url });
      }
      const token = await user.getIdToken();
      const res = await recordQuoteFiles(token, quote.id, kind, uploaded);
      if (!res.ok) { setErr(res.error ?? "Upload failed."); return; }
      refresh();
    } catch {
      setErr("Upload failed — please try again.");
    } finally {
      setUploading(null);
    }
  }

  async function submit() {
    if (!poNumber.trim() || !signature.trim()) { setErr("PO number and signature are required."); return; }
    setBusy(true); setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await submitPO(token, quote.id, {
        poNumber, poShipTo: shipTo, poInstructions: instructions, poSignature: signature,
        poQtyIndex: tierIdx, poSkuCount: skuCol,
      });
      if (!res.ok) { setErr(res.error ?? "Could not submit PO."); return; }
      setDone(true);
      setTimeout(refresh, 1400);
    } catch {
      setErr("Could not submit — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mt-4 rounded-2xl p-6 text-center" style={{ border: "1px solid rgba(95,255,162,0.4)", background: "rgba(95,255,162,0.06)" }}>
        <div className="mb-1 text-3xl">✓</div>
        <p className="text-sm font-bold text-paper">PO submitted — your order is being created.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-5 rounded-2xl p-4" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}>
      {/* SKU selector */}
      {quote.skuCount > 1 && (
        <Field label="SKU variant">
          <select style={inputStyle} value={skuCol} onChange={(e) => setSkuCol(Number(e.target.value))}>
            {skuOptions.map((i) => <option key={i} value={i}>SKU set {i + 1}</option>)}
          </select>
        </Field>
      )}

      {/* Pricing tiers */}
      <div>
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Choose quantity</span>
        <div className="grid gap-2">
          {quote.tiers.length === 0 ? (
            <p className="text-xs text-muted">Pricing will appear here once finalized.</p>
          ) : quote.tiers.map((t, i) => (
            <button key={i} type="button" onClick={() => setTierIdx(i)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left transition"
              style={{
                border: `1px solid ${tierIdx === i ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.12)"}`,
                background: tierIdx === i ? "rgba(0,216,242,0.1)" : "rgba(255,255,255,0.02)",
              }}>
              <span className="text-sm font-bold text-paper">{t.qty.toLocaleString()} units</span>
              <span className="text-sm text-muted">
                {t.ppu ? `${fmtMoney(t.ppu)}/unit · ` : ""}<span className="font-bold text-cyan">{t.total ? fmtMoney(t.total) : "—"}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your PO number"><input style={inputStyle} value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="e.g. PO-10482" /></Field>
        <Field label="Ship to"><input style={inputStyle} value={shipTo} onChange={(e) => setShipTo(e.target.value)} placeholder="Shipping address" /></Field>
      </div>
      <Field label="Special instructions (optional)">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </Field>

      {/* File uploads */}
      {isStorageConfigured() && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">PO document</span>
            <input type="file" multiple onChange={(e) => void upload("po", e.target.files)} className="text-sm text-muted" />
            {uploading === "po" && <p className="mt-1 text-xs text-cyan">Uploading…</p>}
            {quote.poFiles.length > 0 && <p className="mt-1 text-xs text-muted">{quote.poFiles.length} file(s) attached</p>}
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Artwork</span>
            <input type="file" multiple onChange={(e) => void upload("art", e.target.files)} className="text-sm text-muted" />
            {uploading === "art" && <p className="mt-1 text-xs text-cyan">Uploading…</p>}
            {quote.artFiles.length > 0 && <p className="mt-1 text-xs text-muted">{quote.artFiles.length} file(s) attached</p>}
          </div>
        </div>
      )}

      <Field label="Type your full name to sign">
        <input style={inputStyle} value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Full name" />
      </Field>

      {tier && (
        <p className="text-xs text-muted">
          Submitting authorizes production of <span className="font-bold text-paper">{tier.qty.toLocaleString()} units</span>
          {tier.total ? <> at <span className="font-bold text-paper">{fmtMoney(tier.total)}</span></> : null}.
        </p>
      )}
      {err && <p className="text-sm text-red-300">{err}</p>}
      <button type="button" disabled={busy} onClick={() => void submit()} className="btn btn-primary" style={dim(busy)}>
        {busy ? "Submitting…" : "Submit PO & Authorize Order"}
      </button>
    </div>
  );
}

/* ============================ ORDERS (SO) ============================ */

export function Orders({ data, user, refresh }: { data: PortalData; user: User; refresh: () => void }) {
  return (
    <div>
      <SectionHeading title="Orders" hint="Sign your sales orders and approve artwork proofs." />
      {data.salesOrders.length === 0 ? (
        <EmptyState>No orders yet. Once you submit a PO on a quote, your sales order shows up here to sign.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {data.salesOrders.map((so) => <OrderCard key={so.id} so={so} user={user} refresh={refresh} />)}
        </div>
      )}
    </div>
  );
}

function OrderCard({ so, user, refresh }: { so: PortalSalesOrder; user: User; refresh: () => void }) {
  const [signature, setSignature] = useState("");
  const [reviseOpen, setReviseOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const needsSignature = so.status === "sent" && !so.clientSignature;
  const needsArtwork = !so.artworkApproved && so.artFiles.length > 0 && so.status !== "pending";

  async function sign() {
    if (!signature.trim()) { setErr("Please type your name to sign."); return; }
    setBusy(true); setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await signSalesOrder(token, so.id, signature);
      if (!res.ok) { setErr(res.error ?? "Could not sign."); return; }
      refresh();
    } catch { setErr("Could not sign — please try again."); } finally { setBusy(false); }
  }

  async function artwork(decision: "approve" | "revise") {
    if (decision === "revise" && !note.trim()) { setErr("Describe the changes needed."); return; }
    setBusy(true); setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await decideArtwork(token, so.id, decision, note);
      if (!res.ok) { setErr(res.error ?? "Could not submit."); return; }
      setReviseOpen(false); setNote("");
      refresh();
    } catch { setErr("Could not submit — please try again."); } finally { setBusy(false); }
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan">{so.soNum}</span>
            <span className="text-base font-bold text-paper">{so.jobDesc}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {so.selectedQty ? `${so.selectedQty.toLocaleString()} units · ` : ""}
            {so.total ? fmtMoney(so.total) : ""}{so.poNumber ? ` · PO #${so.poNumber}` : ""}
          </p>
        </div>
        <StatusChip status={so.status} label={so.statusLabel} />
      </div>

      {/* signing doc link */}
      {so.signingDocLink && (
        <a href={so.signingDocLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-cyan underline">
          📄 Open signing document
        </a>
      )}

      {/* signature */}
      {needsSignature ? (
        <div className="mt-4 rounded-2xl p-4" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}>
          <Field label="Sign this order — type your full name">
            <input style={inputStyle} value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Full name" />
          </Field>
          <button type="button" disabled={busy} onClick={() => void sign()} className="btn btn-primary mt-3" style={{ minHeight: 40, fontSize: 13, ...dim(busy) }}>
            {busy ? "Signing…" : "Sign Order"}
          </button>
        </div>
      ) : so.clientSignature ? (
        <p className="mt-3 text-xs" style={{ color: "#7dffb0" }}>✓ Signed by {so.clientSignature}{so.clientSignedAt ? ` on ${fmtDate(so.clientSignedAt)}` : ""}</p>
      ) : null}

      {/* artwork approval */}
      {so.artFiles.length > 0 && (
        <div className="mt-4">
          <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Artwork proof</span>
          <div className="grid gap-1">
            {so.artFiles.map((f, i) => (
              <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan underline">📎 {f.name}</a>
            ))}
          </div>
          {needsArtwork ? (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled={busy} onClick={() => void artwork("approve")} className="btn btn-primary" style={{ minHeight: 38, fontSize: 13, ...dim(busy) }}>✓ Approve Artwork</button>
                <button type="button" disabled={busy} onClick={() => setReviseOpen(!reviseOpen)} className="btn btn-secondary" style={{ minHeight: 38, fontSize: 13 }}>✎ Request Changes</button>
              </div>
              {reviseOpen && (
                <div className="mt-3 rounded-2xl p-4" style={{ border: "1px solid rgba(255,196,0,0.35)", background: "rgba(255,196,0,0.06)" }}>
                  <Field label="What needs to change?">
                    <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={note} onChange={(e) => setNote(e.target.value)} autoFocus />
                  </Field>
                  <button type="button" disabled={busy || !note.trim()} onClick={() => void artwork("revise")} className="btn btn-primary mt-3" style={{ minHeight: 38, fontSize: 13, ...dim(busy || !note.trim()) }}>Send Change Request</button>
                </div>
              )}
            </>
          ) : so.artworkApproved ? (
            <p className="mt-2 text-xs" style={{ color: "#7dffb0" }}>✓ Artwork approved{so.artworkApprovedAt ? ` on ${fmtDate(so.artworkApprovedAt)}` : ""}</p>
          ) : so.artworkRevisionNote ? (
            <p className="mt-2 text-xs text-muted">Changes requested: {so.artworkRevisionNote}</p>
          ) : null}
        </div>
      )}
      {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
    </Panel>
  );
}

/* ============================ MESSAGES ============================ */

export function Messages({ data, user, refresh }: { data: PortalData; user: User; refresh: () => void }) {
  const quoteIds = data.quotes.map((q) => q.id);
  const [active, setActive] = useState<string>(quoteIds[0] ?? "");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const activeQuote = useMemo(() => data.quotes.find((q) => q.id === active), [data.quotes, active]);
  const thread = data.messagesByQuote[active] ?? [];

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !active) return;
    setBusy(true); setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await sendQuoteMessage(token, active, body);
      if (!res.ok) { setErr(res.error ?? "Could not send."); return; }
      setBody("");
      refresh();
    } catch { setErr("Could not send — please try again."); } finally { setBusy(false); }
  }

  if (data.quotes.length === 0) {
    return (
      <div>
        <SectionHeading title="Messages" hint="A direct line to your account team." />
        <EmptyState>Messaging opens up once you have a quote. Each quote gets its own thread.</EmptyState>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading title="Messages" hint="Per-quote thread with your Microflex team." />
      {data.quotes.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {data.quotes.map((q) => (
            <button key={q.id} type="button" onClick={() => setActive(q.id)}
              className="rounded-full px-3 py-1.5 text-xs font-extrabold transition"
              style={{
                border: `1px solid ${active === q.id ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
                background: active === q.id ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
                color: active === q.id ? "#34e3f5" : "#a9b9c8",
              }}>
              {q.quoteNum}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 grid gap-3 rounded-2xl p-4" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2,5,9,0.35)", maxHeight: 420, overflowY: "auto" }}>
        {thread.length === 0 ? (
          <EmptyState>No messages on {activeQuote?.quoteNum ?? "this quote"} yet. Say hello.</EmptyState>
        ) : thread.map((m) => {
          const mine = m.from === "client";
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[78%] rounded-2xl px-4 py-2.5"
                style={{
                  background: mine ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${mine ? "rgba(0,216,242,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}>
                <div className="mb-0.5 text-[11px] font-bold text-muted">{m.name} · {m.createdAt ? fmtDateTime(m.createdAt) : ""}</div>
                <p className="whitespace-pre-wrap text-sm text-paper">{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} className="grid gap-3">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Message about ${activeQuote?.quoteNum ?? "this quote"}…`} />
        {err && <p className="text-sm text-red-300">{err}</p>}
        <button type="submit" disabled={busy || !body.trim()} className="btn btn-primary ml-auto" style={dim(busy || !body.trim())}>
          {busy ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}

/* ============================ ACCOUNT (CRM) ============================ */

const EDIT_FIELDS: { key: "company" | "industry" | "contact" | "phone" | "billTo" | "shipTo" | "notes"; label: string; multiline?: boolean }[] = [
  { key: "company", label: "Company name" },
  { key: "industry", label: "Industry" },
  { key: "contact", label: "Primary contact" },
  { key: "phone", label: "Phone" },
  { key: "billTo", label: "Billing address", multiline: true },
  { key: "shipTo", label: "Shipping address", multiline: true },
  { key: "notes", label: "Notes / special instructions", multiline: true },
];

export function Account({ data, user, refresh }: { data: PortalData; user: User; refresh: () => void }) {
  const p = data.profile;
  const blank = () => ({
    company: p.company, industry: p.industry, contact: p.contact, phone: p.phone,
    billTo: p.billTo, shipTo: p.shipTo, notes: p.notes,
  });
  const [form, setForm] = useState<Record<string, string>>(blank);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const dirty = EDIT_FIELDS.some((f) => (form[f.key] ?? "").trim() !== ((p[f.key] as string) ?? "").trim());

  async function save() {
    if (!dirty) { setErr("Nothing changed."); return; }
    setBusy(true); setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await submitProfileChange(token, form);
      if (!res.ok) { setErr(res.error ?? "Could not submit."); return; }
      setDone(true);
      setEditing(false);
      refresh();
      setTimeout(() => setDone(false), 4000);
    } catch { setErr("Could not submit — please try again."); } finally { setBusy(false); }
  }

  const pending = data.profileChanges.filter((c) => c.status === "pending");
  const decided = data.profileChanges.filter((c) => c.status !== "pending");

  return (
    <div className="grid gap-8">
      <div>
        <SectionHeading
          title="Company & Account"
          hint="Keep your details current. Changes are reviewed by our team before they update your record."
          action={!editing ? (
            <button type="button" onClick={() => setEditing(true)} className="btn btn-secondary" style={{ minHeight: 38, fontSize: 13 }}>
              ✎ Edit details
            </button>
          ) : undefined}
        />

        {done && (
          <p className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ border: "1px solid rgba(95,255,162,0.4)", background: "rgba(95,255,162,0.06)", color: "#7dffb0" }}>
            ✓ Submitted for review — we&apos;ll apply it once confirmed.
          </p>
        )}

        {!editing ? (
          <Panel>
            <dl className="grid gap-4 sm:grid-cols-2">
              <ProfileRow label="Company" value={p.company} />
              <ProfileRow label="Industry" value={p.industry} />
              <ProfileRow label="Primary contact" value={p.contact} />
              <ProfileRow label="Phone" value={p.phone} />
              <ProfileRow label="Login email" value={p.email} />
              <ProfileRow label="Billing address" value={p.billTo} />
              <ProfileRow label="Shipping address" value={p.shipTo} />
              <ProfileRow label="Notes" value={p.notes} />
            </dl>
            {!p.found && <p className="mt-4 text-xs text-muted">We don&apos;t have a record on file yet — fill this in and our team will set it up.</p>}
          </Panel>
        ) : (
          <div className="grid gap-5 rounded-2xl p-4" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}>
            <div className="grid gap-5 sm:grid-cols-2">
              {EDIT_FIELDS.map((f) => (
                <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
                  <Field label={f.label}>
                    {f.multiline ? (
                      <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                    ) : (
                      <input style={inputStyle} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                    )}
                  </Field>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">Your login email ({p.email}) can&apos;t be changed here — contact us if it needs updating.</p>
            {err && <p className="text-sm text-red-300">{err}</p>}
            <div className="flex gap-2">
              <button type="button" disabled={busy || !dirty} onClick={() => void save()} className="btn btn-primary" style={dim(busy || !dirty)}>
                {busy ? "Submitting…" : "Submit for Review"}
              </button>
              <button type="button" onClick={() => { setEditing(false); setForm(blank()); setErr(null); }} className="btn btn-dark">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {(pending.length > 0 || decided.length > 0) && (
        <div>
          <SectionHeading title="Change Requests" />
          <div className="grid gap-3">
            {[...pending, ...decided].map((c) => (
              <Panel key={c.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">Submitted {fmtDate(c.createdAt)}</span>
                  <StatusChip
                    status={c.status === "approved" ? "approved" : c.status === "pending" ? "pending" : "rejected"}
                    label={c.status === "pending" ? "Awaiting Review" : c.status === "approved" ? "Applied" : "Declined"}
                  />
                </div>
                <div className="grid gap-1.5">
                  {Object.entries(c.changes).map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <span className="font-bold text-paper">{k}</span>:{" "}
                      <span className="text-muted line-through">{v.from || "—"}</span>{" → "}
                      <span className="text-cyan">{v.to || "—"}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-extrabold uppercase tracking-widest text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-paper">{value || <span className="text-muted-dark">—</span>}</dd>
    </div>
  );
}

/* ============================ DOCUMENTS ============================ */

export function Documents({ data }: { data: PortalData }) {
  const docs: { name: string; url: string; tag: string; ctx: string; at?: string }[] = [];
  data.quotes.forEach((q) => {
    q.poFiles.forEach((f) => docs.push({ name: f.name, url: f.url, tag: "PO", ctx: q.quoteNum, at: f.uploadedAt }));
    q.artFiles.forEach((f) => docs.push({ name: f.name, url: f.url, tag: "Artwork", ctx: q.quoteNum, at: f.uploadedAt }));
  });
  data.salesOrders.forEach((so) => {
    so.artFiles.forEach((f) => docs.push({ name: f.name, url: f.url, tag: "Proof", ctx: so.soNum, at: f.uploadedAt }));
  });

  return (
    <div>
      <SectionHeading title="Documents & Files" hint="POs, artwork, and proofs across your jobs." />
      {docs.length === 0 ? (
        <EmptyState>Files you upload with a PO — and proofs we share — collect here.</EmptyState>
      ) : (
        <div className="grid gap-2">
          {docs.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <span className="block text-sm font-bold text-paper">{d.name}</span>
                  <span className="block text-xs text-muted">{d.tag} · {d.ctx}{d.at ? ` · ${fmtDate(d.at)}` : ""}</span>
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
