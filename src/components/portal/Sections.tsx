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
  submitQuoteRequest,
  type PortalData,
  type PortalQuote,
  type PortalSalesOrder,
  type PortalJob,
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

/* ---- document preview helpers ---- */

function drivePreview(url: string): string {
  // Convert a Google Drive file link into its embeddable /preview form.
  const m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}
const isPdfName = (s: string) => /\.pdf($|\?)/i.test(s);
const isImageName = (s: string) => /\.(png|jpe?g|gif|webp|svg)($|\?)/i.test(s);
const isDriveUrl = (s: string) => /drive\.google\.com/.test(s);

function PdfFrame({ url, title }: { url: string; title: string }) {
  const src = isDriveUrl(url) ? drivePreview(url) : url;
  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
        <span className="text-xs font-bold text-paper">{title}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan underline">Open ↗</a>
      </div>
      <iframe src={src} title={title} className="w-full" style={{ height: 460, border: 0, background: "#fff" }} />
    </div>
  );
}

function FilePreview({ file, label }: { file: PortalFile; label: string }) {
  const heading = (
    <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
      <span className="text-xs font-bold text-paper">{label}: {file.name}</span>
      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan underline">Open ↗</a>
    </div>
  );
  if (isImageName(file.name)) {
    return (
      <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
        {heading}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.url} alt={file.name} className="w-full" style={{ maxHeight: 460, objectFit: "contain", background: "#0a1622" }} />
      </div>
    );
  }
  if (isPdfName(file.name) || isDriveUrl(file.url)) {
    return <PdfFrame url={file.url} title={`${label}: ${file.name}`} />;
  }
  return <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan underline">📎 {label}: {file.name}</a>;
}

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

export function Status({ data, go }: { data: PortalData; go: (s: SectionKey) => void }) {
  const labels = data.stages.map((s) => s.label);
  const [openId, setOpenId] = useState<string | null>(null);
  const openJob = data.jobs.find((j) => j.quoteId === openId) ?? null;
  const openQuote = openJob ? data.quotes.find((q) => q.id === openJob.quoteId) : undefined;
  const openSo = openJob ? data.salesOrders.find((s) => s.quoteId === openJob.quoteId) : undefined;

  return (
    <div>
      <SectionHeading title="Order Status" hint="Click any job for full details, documents, and next steps." />
      {data.jobs.length === 0 ? (
        <EmptyState>No jobs in progress. Once we send you a quote, you can track it here end-to-end.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {data.jobs.map((j) => (
            <button key={j.quoteId} type="button" onClick={() => setOpenId(j.quoteId)} className="block w-full text-left transition hover:-translate-y-0.5">
              <Panel>
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
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-dark">Updated {timeAgo(j.updatedAt)}</span>
                  <span className="text-xs font-bold text-cyan">Open job →</span>
                </div>
              </Panel>
            </button>
          ))}
        </div>
      )}
      {openJob && (
        <JobDetailModal
          job={openJob}
          quote={openQuote}
          so={openSo}
          stages={labels}
          go={(s) => { setOpenId(null); go(s); }}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

function JobDetailModal({
  job, quote, so, stages, go, onClose,
}: {
  job: PortalJob;
  quote?: PortalQuote;
  so?: PortalSalesOrder;
  stages: string[];
  go: (s: SectionKey) => void;
  onClose: () => void;
}) {
  const needsPO = quote?.canSubmitPO;
  const needsSign = so && so.status === "sent" && !so.clientSignature;
  const needsArtwork = so && !so.artworkApproved && so.artFiles.length > 0 && so.status !== "pending";

  const facts: [string, string][] = [];
  if (quote?.company) facts.push(["Company", quote.company]);
  if (quote?.specs) facts.push(["Spec", quote.specs]);
  if (so?.selectedQty) facts.push(["Quantity", `${so.selectedQty.toLocaleString()} units`]);
  if (so?.total) facts.push(["Order value", fmtMoney(so.total)]);
  if (so?.poNumber || quote?.poNumber) facts.push(["PO #", String(so?.poNumber || quote?.poNumber)]);
  if (quote?.payTerms) facts.push(["Terms", quote.payTerms]);

  return (
    <Modal title={`${job.soNum || job.quoteNum} — ${job.stageLabel}`} onClose={onClose}>
      <div className="grid gap-6">
        <div>
          <span className="text-lg font-bold text-paper">{job.title}</span>
          <p className="font-mono text-xs text-muted">{job.quoteNum}{job.soNum ? ` · ${job.soNum}` : ""}</p>
        </div>

        <FullTracker stages={stages} current={job.stageIndex} />

        {facts.length > 0 && (
          <dl className="grid gap-4 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-extrabold uppercase tracking-widest text-muted">{k}</dt>
                <dd className="mt-0.5 text-sm text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* documents */}
        <div>
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-muted">Documents</span>
          <div className="grid gap-3">
            {quote?.quotePdfUrl && <PdfFrame url={quote.quotePdfUrl} title="Microflex Quote (PDF)" />}
            {so?.pdfUrl && <PdfFrame url={so.pdfUrl} title="Sales Order (PDF)" />}
            {(quote?.poFiles ?? []).map((f, i) => <FilePreview key={`po${i}`} file={f} label="PO" />)}
            {(so?.artFiles ?? quote?.artFiles ?? []).map((f, i) => <FilePreview key={`art${i}`} file={f} label={so ? "Proof" : "Artwork"} />)}
            {!quote?.quotePdfUrl && !so?.pdfUrl && (quote?.poFiles ?? []).length === 0 && (so?.artFiles ?? []).length === 0 && (
              <p className="text-xs text-muted">Documents for this job will appear here as they&apos;re added.</p>
            )}
          </div>
        </div>

        {/* contextual next steps */}
        <div className="flex flex-wrap gap-2 border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {needsPO && <button type="button" onClick={() => go("quotes")} className="btn btn-primary" style={{ minHeight: 40, fontSize: 13 }}>Review &amp; submit PO</button>}
          {needsSign && <button type="button" onClick={() => go("orders")} className="btn btn-primary" style={{ minHeight: 40, fontSize: 13 }}>Sign order</button>}
          {needsArtwork && <button type="button" onClick={() => go("orders")} className="btn btn-primary" style={{ minHeight: 40, fontSize: 13 }}>Approve artwork</button>}
          <button type="button" onClick={() => go("quotes")} className="btn btn-secondary" style={{ minHeight: 40, fontSize: 13 }}>Open quote</button>
          {so && <button type="button" onClick={() => go("orders")} className="btn btn-secondary" style={{ minHeight: 40, fontSize: 13 }}>Open order</button>}
          <button type="button" onClick={() => go("messages")} className="btn btn-secondary" style={{ minHeight: 40, fontSize: 13 }}>Message team</button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================ QUOTES ============================ */

export function Quotes({ data, user, refresh }: { data: PortalData; user: User; refresh: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openQuote = data.quotes.find((q) => q.id === openId) ?? null;
  return (
    <div>
      <SectionHeading title="Quotes" hint="Click a quote for full details, item pricing, and to submit a PO or request a change." />
      {data.quotes.length === 0 ? (
        <EmptyState>No quotes yet. When our team sends you a quote, it lands here for review.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {data.quotes.map((q) => <QuoteCard key={q.id} quote={q} onOpen={() => setOpenId(q.id)} />)}
        </div>
      )}
      {openQuote && <QuoteDetailModal quote={openQuote} user={user} refresh={refresh} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function QuoteCard({ quote, onOpen }: { quote: PortalQuote; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="block w-full text-left transition hover:-translate-y-0.5">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs font-bold text-cyan">{quote.quoteNum}{quote.rev ? `-${quote.rev}` : ""}</span>
              <span className="text-base font-bold text-paper">{quote.company || quote.jobDesc}</span>
            </div>
            {quote.specs && <p className="mt-1 text-xs text-muted">{quote.specs}</p>}
            <p className="mt-0.5 text-xs text-muted-dark">
              {quote.items.length > 1 ? `${quote.items.length} items · ` : ""}Terms {quote.payTerms} · Updated {fmtDate(quote.updatedAt)}
            </p>
          </div>
          <StatusChip status={quote.status} label={quote.statusLabel} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-cyan">View details &amp; request →</span>
          {quote.canSubmitPO && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider" style={{ background: "rgba(255,196,0,0.12)", border: "1px solid rgba(255,196,0,0.4)", color: "#ffd34d" }}>
              Action needed
            </span>
          )}
        </div>
      </Panel>
    </button>
  );
}

/* ----- modal shell ----- */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      style={{ background: "rgba(2,5,9,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="relative w-full max-w-3xl rounded-4xl p-6 md:p-8"
        style={{ border: "1px solid rgba(0,216,242,0.35)", background: "linear-gradient(180deg, #0a1622, #061018)", boxShadow: "0 34px 90px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-black text-paper">{title}</h2>
          <button type="button" onClick={onClose} className="btn btn-dark" style={{ minHeight: 36, fontSize: 13 }}>✕ Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ----- quote detail modal ----- */

const REQ_TYPES: { key: string; label: string }[] = [
  { key: "question", label: "Ask a question" },
  { key: "change", label: "Request a change / revision" },
  { key: "sample", label: "Request a sample" },
  { key: "qty", label: "Request different qty / SKU" },
];

function QuoteDetailModal({ quote, user, refresh, onClose }: { quote: PortalQuote; user: User; refresh: () => void; onClose: () => void }) {
  const [showPO, setShowPO] = useState(false);
  const [reqItem, setReqItem] = useState<string | null>(null); // item label, "" = quote-level, null = closed

  return (
    <Modal title={`${quote.quoteNum}${quote.rev ? `-${quote.rev}` : ""}`} onClose={onClose}>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-lg font-bold text-paper">{quote.company || quote.jobDesc}</span>
            {quote.attn && <p className="text-sm text-muted">Attn: {quote.attn}</p>}
          </div>
          <StatusChip status={quote.status} label={quote.statusLabel} />
        </div>

        {quote.specs && (
          <div>
            <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Specification</span>
            <p className="text-sm text-paper">{quote.specs}</p>
            <p className="mt-1 text-xs text-muted-dark">Payment terms: {quote.payTerms}</p>
          </div>
        )}

        {/* The Microflex quote PDF — the official quote document */}
        <div>
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-muted">Your Microflex Quote</span>
          {quote.quotePdfUrl ? (
            <PdfFrame url={quote.quotePdfUrl} title="Microflex Quote (PDF)" />
          ) : (
            <p className="rounded-xl p-3 text-xs text-muted" style={{ border: "1px dashed rgba(255,255,255,0.14)" }}>
              The quote PDF will appear here once our team issues it.
            </p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-muted">Items &amp; pricing</span>
          <div className="grid gap-3">
            {quote.items.map((it, idx) => (
              <div key={idx} className="rounded-2xl p-4" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-paper">{it.label}</span>
                  <button type="button" onClick={() => setReqItem(reqItem === it.label ? null : it.label)} className="text-xs font-bold text-cyan underline">
                    Request on this item
                  </button>
                </div>
                {it.tiers.length === 0 ? (
                  <p className="text-xs text-muted">Pricing pending.</p>
                ) : (
                  <div className="grid gap-1">
                    {it.tiers.map((t, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-paper">{t.qty.toLocaleString()} units</span>
                        <span className="text-muted">{t.ppu ? `${fmtMoney(t.ppu)}/unit · ` : ""}<span className="font-bold text-cyan">{t.total ? fmtMoney(t.total) : "—"}</span></span>
                      </div>
                    ))}
                  </div>
                )}
                {reqItem === it.label && (
                  <QuoteRequestForm quote={quote} user={user} item={it.label} onDone={() => { setReqItem(null); refresh(); }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {(quote.poFiles.length > 0 || quote.artFiles.length > 0) && (
          <div>
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-muted">PO &amp; Artwork</span>
            <div className="grid gap-3">
              {quote.poFiles.map((f, i) => <FilePreview key={`po${i}`} file={f} label="PO" />)}
              {quote.artFiles.map((f, i) => <FilePreview key={`art${i}`} file={f} label="Artwork" />)}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {quote.canSubmitPO && (
            <button type="button" onClick={() => setShowPO(!showPO)} className="btn btn-primary" style={{ minHeight: 40, fontSize: 13 }}>
              {showPO ? "Hide PO form" : "Submit PO →"}
            </button>
          )}
          <button type="button" onClick={() => setReqItem(reqItem === "" ? null : "")} className="btn btn-secondary" style={{ minHeight: 40, fontSize: 13 }}>
            Ask / request about this quote
          </button>
        </div>

        {reqItem === "" && <QuoteRequestForm quote={quote} user={user} onDone={() => { setReqItem(null); refresh(); }} />}

        {!quote.canSubmitPO && quote.poNumber && (
          <p className="text-xs text-muted">PO #{quote.poNumber} submitted{quote.poSelectedQty ? ` · ${quote.poSelectedQty.toLocaleString()} units` : ""}{quote.poSelectedTotal ? ` · ${fmtMoney(quote.poSelectedTotal)}` : ""}.</p>
        )}

        {showPO && quote.canSubmitPO && <POForm quote={quote} user={user} refresh={refresh} />}
      </div>
    </Modal>
  );
}

function QuoteRequestForm({ quote, user, item, onDone }: { quote: PortalQuote; user: User; item?: string; onDone: () => void }) {
  const [type, setType] = useState(REQ_TYPES[0].key);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    if (!message.trim()) { setErr("Please add a few details."); return; }
    setBusy(true); setErr(null);
    try {
      const token = await user.getIdToken();
      const res = await submitQuoteRequest(token, quote.id, { type, item, message });
      if (!res.ok) { setErr(res.error ?? "Could not send."); return; }
      setDone(true);
      setTimeout(onDone, 1200);
    } catch { setErr("Could not send — please try again."); } finally { setBusy(false); }
  }

  if (done) return <p className="mt-3 text-sm font-bold" style={{ color: "#7dffb0" }}>✓ Sent — our team will follow up.</p>;

  return (
    <div className="mt-3 grid gap-3 rounded-2xl p-4" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}>
      {item && <p className="text-xs font-bold text-cyan">Request on {item}</p>}
      <Field label="Type">
        <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
          {REQ_TYPES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </Field>
      <Field label="Details">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What would you like?" autoFocus />
      </Field>
      {err && <p className="text-sm text-red-300">{err}</p>}
      <button type="button" disabled={busy} onClick={() => void send()} className="btn btn-primary" style={{ minHeight: 38, fontSize: 13, ...dim(busy) }}>
        {busy ? "Sending…" : "Send Request"}
      </button>
    </div>
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

      {/* signed sales-order PDF */}
      {so.pdfUrl && (
        <div className="mt-3">
          <PdfFrame url={so.pdfUrl} title="Sales Order PDF" />
        </div>
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
          <div className="grid gap-3">
            {so.artFiles.map((f, i) => <FilePreview key={i} file={f} label="Proof" />)}
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

const EDIT_FIELDS: { key: "company" | "industry" | "contact" | "phone" | "billTo" | "shipTo" | "notes" | "brandColors"; label: string; multiline?: boolean }[] = [
  { key: "company", label: "Company name" },
  { key: "industry", label: "Industry" },
  { key: "contact", label: "Primary contact" },
  { key: "phone", label: "Phone" },
  { key: "billTo", label: "Billing address", multiline: true },
  { key: "shipTo", label: "Shipping address", multiline: true },
  { key: "brandColors", label: "Brand colors (comma-separated hex, e.g. #00d8f2, #06121d)" },
  { key: "notes", label: "Notes / special instructions", multiline: true },
];

export function Account({ data, user, refresh }: { data: PortalData; user: User; refresh: () => void }) {
  const p = data.profile;
  const blank = () => ({
    company: p.company, industry: p.industry, contact: p.contact, phone: p.phone,
    billTo: p.billTo, shipTo: p.shipTo, notes: p.notes, brandColors: p.brandColors,
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

  // Brand colors → swatches
  const colors = (p.brandColors || "").split(/[,\s]+/).map((c) => c.trim()).filter(Boolean);

  // Financial snapshot (derived from sales orders)
  const sos = data.salesOrders;
  const lifetime = sos.reduce((s, o) => s + (o.total || 0), 0);
  const activeVal = sos.filter((o) => !["closed", "cancelled", "rejected"].includes(o.status)).reduce((s, o) => s + (o.total || 0), 0);
  const terms = data.quotes[0]?.payTerms || "Net 30";

  // History timeline (quotes + orders)
  const history: { when: string; ref: string; label: string }[] = [
    ...data.quotes.map((q) => ({ when: q.updatedAt, ref: `${q.quoteNum}${q.rev ? `-${q.rev}` : ""}`, label: `Quote · ${q.statusLabel}` })),
    ...sos.map((o) => ({ when: o.createdAt, ref: o.soNum, label: `Order · ${o.statusLabel}` })),
  ].sort((a, b) => new Date(b.when || 0).getTime() - new Date(a.when || 0).getTime());

  // Key files
  const files: { name: string; url: string; tag: string }[] = [];
  data.quotes.forEach((q) => {
    if (q.quotePdfUrl) files.push({ name: `Quote ${q.quoteNum} (PDF)`, url: q.quotePdfUrl, tag: "Quote" });
    q.poFiles.forEach((f) => files.push({ name: f.name, url: f.url, tag: "PO" }));
    q.artFiles.forEach((f) => files.push({ name: f.name, url: f.url, tag: "Artwork" }));
  });
  sos.forEach((o) => {
    if (o.pdfUrl) files.push({ name: `Sales Order ${o.soNum} (PDF)`, url: o.pdfUrl, tag: "Order" });
    o.artFiles.forEach((f) => files.push({ name: f.name, url: f.url, tag: "Proof" }));
  });

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

      {/* Brand colors */}
      <div>
        <SectionHeading title="Brand Colors" hint="So your packaging stays on-brand. Add yours via Edit details." />
        {colors.length === 0 ? (
          <EmptyState>No brand colors on file yet. Add them in “Edit details” as comma-separated hex (e.g. #00d8f2, #06121d).</EmptyState>
        ) : (
          <div className="flex flex-wrap gap-3">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="h-7 w-7 rounded-md" style={{ background: c, border: "1px solid rgba(255,255,255,0.25)" }} />
                <span className="font-mono text-xs text-paper">{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial snapshot */}
      <div>
        <SectionHeading title="Financial Snapshot" hint="Based on your orders with Microflex." />
        <div className="grid gap-3 sm:grid-cols-3">
          <Panel><div className="text-2xl font-black text-paper">{fmtMoney(lifetime)}</div><div className="mt-1 text-xs font-extrabold uppercase tracking-widest text-muted">Lifetime Orders</div></Panel>
          <Panel><div className="text-2xl font-black text-cyan">{fmtMoney(activeVal)}</div><div className="mt-1 text-xs font-extrabold uppercase tracking-widest text-muted">Active Order Value</div></Panel>
          <Panel><div className="text-2xl font-black text-paper">{terms}</div><div className="mt-1 text-xs font-extrabold uppercase tracking-widest text-muted">Payment Terms</div></Panel>
        </div>
      </div>

      {/* History */}
      <div>
        <SectionHeading title="History" hint="Your quotes and orders over time." />
        {history.length === 0 ? (
          <EmptyState>No activity yet — your quotes and orders will appear here.</EmptyState>
        ) : (
          <div className="grid gap-2">
            {history.slice(0, 15).map((h, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan">{h.ref}</span>
                  <span className="text-sm text-paper">{h.label}</span>
                </div>
                <span className="text-xs text-muted-dark">{h.when ? timeAgo(h.when) : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key files */}
      <div>
        <SectionHeading title="Key Files" hint="Quotes, POs, artwork, and proofs in one place." />
        {files.length === 0 ? (
          <EmptyState>Files from your quotes and orders will collect here.</EmptyState>
        ) : (
          <div className="grid gap-2">
            {files.map((f, i) => (
              <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="flex items-center gap-3"><span className="text-lg">📄</span><span className="text-sm font-bold text-paper">{f.name}</span></span>
                <span className="whitespace-nowrap text-xs font-bold text-cyan">{f.tag} · Open ↗</span>
              </a>
            ))}
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
