"use client";

import { useRef, useState } from "react";
import { submitLead } from "@/app/actions/submitLead";

/* "Mad Libs" conversational lead funnel — a sentence with inline dropdowns.
   Fully async, mobile-responsive, honeypot + timing protected. Submits via the
   submitLead server action (Firestore + private webhook). */

const FIELDS = {
  role: { label: "I'm a", options: ["brand owner", "marketing lead", "operations lead", "co-packer", "buyer / procurement"] },
  product: { label: "launching", options: ["coffee", "supplements", "snacks", "pet food", "beverages", "cosmetics", "a new product"] },
  format: { label: "and I need", options: ["stand-up pouches", "printed rollstock", "stick packs", "spouted pouches", "shrink sleeves", "labels", "help choosing a format"] },
  quantity: { label: "in", options: ["under 5,000", "5,000–25,000", "25,000–100,000", "100,000+", "a quantity TBD"] },
  timeline: { label: "needed", options: ["ASAP / rush", "within 30 days", "in 1–3 months", "— just exploring"] },
} as const;

type FieldKey = keyof typeof FIELDS;
const ORDER: FieldKey[] = ["role", "product", "format", "quantity", "timeline"];

function InlineSelect({ value, options, onChange, label }: { value: string; options: readonly string[]; onChange: (v: string) => void; label: string }) {
  return (
    <span className="inline-flex items-baseline">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mx-1 cursor-pointer rounded-md font-extrabold text-cyan"
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: "rgba(0,216,242,0.08)",
          border: "1px solid rgba(0,216,242,0.4)",
          padding: "2px 28px 2px 10px",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2334e3f5' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ color: "#001018" }}>{o}</option>
        ))}
      </select>
    </span>
  );
}

export default function LeadFunnel() {
  const [answers, setAnswers] = useState<Record<FieldKey, string>>({
    role: FIELDS.role.options[0],
    product: FIELDS.product.options[0],
    format: FIELDS.format.options[0],
    quantity: FIELDS.quantity.options[0],
    timeline: FIELDS.timeline.options[0],
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState("");
  const loadedAt = useRef(Date.now());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set(k: FieldKey, v: string) { setAnswers((a) => ({ ...a, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr("Please enter a valid email so we can send your options."); return; }
    setBusy(true);
    setErr(null);
    try {
      const res = await submitLead({ answers, email, name, company, phone, hp, loadedAt: loadedAt.current });
      if (res.ok) {
        setDone(true);
        const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
        gtag?.("event", "generate_lead", { source: "homepage-funnel", format: answers.format, timeline: answers.timeline });
      } else {
        setErr(res.error ?? "Something went wrong — please try again.");
      }
    } catch {
      setErr("Something went wrong — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container-x">
        <div
          className="rounded-4xl p-7 md:p-10"
          style={{
            border: "1px solid rgba(0,216,242,0.35)",
            background: "radial-gradient(circle at 88% 8%, rgba(0,216,242,0.16), transparent 45%), linear-gradient(160deg, rgba(0,216,242,0.07), rgba(255,255,255,0.02))",
          }}
        >
          <div className="kicker mb-3">Get matched in 20 seconds</div>

          {done ? (
            <div className="py-6">
              <div className="mb-2 text-3xl">✓</div>
              <h2 className="text-2xl font-black text-paper md:text-3xl">Got it — we&rsquo;re on it.</h2>
              <p className="mt-2 max-w-xl text-muted">
                Our team will reach out with packaging options tailored to what you told us. Want to
                get a head start? Visualize your package in the 3D studio.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/configurator" className="btn btn-primary">Open the 3D Studio</a>
                <a href="/#quote-form" className="btn btn-secondary">Add more detail</a>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              {/* The Mad Libs sentence */}
              <p className="flex flex-wrap items-baseline gap-y-3 text-xl font-bold leading-relaxed text-paper md:text-3xl md:leading-relaxed">
                {ORDER.map((k) => (
                  <span key={k} className="inline-flex items-baseline">
                    <span className="text-muted">{FIELDS[k].label}</span>
                    <InlineSelect value={answers[k]} options={FIELDS[k].options} onChange={(v) => set(k, v)} label={FIELDS[k].label} />
                  </span>
                ))}
                <span className="text-muted">.</span>
              </p>

              {/* Contact */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" className="rounded-xl px-4 py-3 text-sm text-paper" style={inputStyle} />
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" aria-label="Company" className="rounded-xl px-4 py-3 text-sm text-paper" style={inputStyle} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Work email *" aria-label="Work email" className="rounded-xl px-4 py-3 text-sm text-paper" style={inputStyle} />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" aria-label="Phone" className="rounded-xl px-4 py-3 text-sm text-paper" style={inputStyle} />
              </div>

              {/* Honeypot — hidden from humans */}
              <div aria-hidden style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
                <label htmlFor="lf-company-url">Company URL</label>
                <input id="lf-company-url" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
              </div>

              {err && <p className="mt-3 text-sm text-red-300">{err}</p>}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="submit" disabled={busy} className="btn btn-primary" style={busy ? { opacity: 0.6 } : undefined}>
                  {busy ? "Sending…" : "Get my packaging options →"}
                </button>
                <span className="text-xs text-muted-dark">No spam. A specialist follows up with real options.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(2,5,9,0.55)",
  border: "1px solid rgba(255,255,255,0.14)",
};
