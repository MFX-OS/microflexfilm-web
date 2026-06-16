"use client";

import { useState } from "react";
import { subscribe } from "@/app/actions/subscribe";

const FILE = "/downloads/microflex-quote-checklist.pdf";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const r = await subscribe(email, "lead-checklist");
    if (r.ok) setUnlocked(true);
    else setErr(r.error ?? "Please try again.");
    setBusy(false);
  }

  return (
    <section className="py-14 md:py-18">
      <div className="container-x">
        <div
          className="grid items-center gap-8 rounded-4xl p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12"
          style={{ border: "1px solid rgba(0,216,242,0.3)", background: "radial-gradient(circle at 85% 15%, rgba(0,216,242,0.16), transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))" }}
        >
          <div>
            <div className="kicker mb-3">Free Download</div>
            <h2 className="display text-[clamp(28px,3.6vw,48px)] text-paper">
              Quote-Ready Packaging Checklist.
            </h2>
            <p className="mt-4 max-w-[520px] text-base leading-relaxed text-muted md:text-lg">
              The exact details to gather before requesting a quote — so you get accurate options,
              faster. A one-page PDF you can fill in.
            </p>
          </div>

          <div className="rounded-3xl p-6" style={{ border: "1px solid rgba(0,216,242,0.2)", background: "rgba(2,5,9,0.4)" }}>
            {unlocked ? (
              <div className="text-center">
                <div className="mb-2 text-3xl">📄</div>
                <p className="mb-4 text-sm font-bold text-paper">You&rsquo;re in — here&rsquo;s your checklist.</p>
                <a href={FILE} target="_blank" rel="noopener noreferrer" download className="btn btn-primary w-full">
                  Download the PDF →
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-3">
                <label htmlFor="lm-email" className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  Get the checklist
                </label>
                <input
                  id="lm-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="rounded-xl px-4 py-3 text-sm text-paper"
                  style={{ background: "rgba(2,5,9,0.6)", border: "1px solid rgba(255,255,255,0.14)" }}
                  required
                />
                {err && <p className="text-xs text-red-300">{err}</p>}
                <button type="submit" disabled={busy} className="btn btn-primary" style={busy ? { opacity: 0.6 } : undefined}>
                  {busy ? "…" : "Email me the checklist"}
                </button>
                <p className="text-[11px] leading-relaxed text-muted-dark">
                  We&rsquo;ll send occasional packaging tips. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
