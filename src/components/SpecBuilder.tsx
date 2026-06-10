"use client";

import { useMemo, useState } from "react";

/* ============ option data (from Microflex master copy) ============ */

const PRODUCTS = [
  "Dry snack or chip", "Coffee or tea", "Nut, seed, or dried fruit", "Powder or granule",
  "Protein or supplement", "Gummy or confection", "Liquid, gel, puree, or sauce",
  "Frozen or refrigerated food", "Pet food or treat", "Cosmetic or personal care",
  "Medical, wellness, or regulated product", "Hardware, parts, or non-food goods", "Other or custom product",
];

const PRIORITIES = [
  "Keep it fresh", "Keep it dry", "Keep aroma in", "Keep oxygen out", "Prevent leaking",
  "Prevent punctures", "Premium shelf presence", "High-speed filling", "Reduce packaging weight",
  "Prepare for retailer review", "Not sure yet",
];

const THREATS = [
  "Moisture or humidity", "Oxygen exposure", "Light or UV exposure", "Aroma loss", "Odor transfer",
  "Grease or oil", "Freezer exposure", "Puncture or abrasion", "Flex-cracking", "Weak seals",
  "Product clumping", "Regulatory or compliance print requirements", "Not sure",
];

const FILL_METHODS = ["By hand or simple sealer", "Co-packer", "Our own FFS / flow-wrap equipment", "Not sure yet"];

const QUANTITIES = ["Under 5,000", "5,000 – 25,000", "25,000 – 100,000", "100,000+", "Not sure yet"];

const FINISHES = [
  { name: "Matte", desc: "Soft, glare-free, modern, and premium." },
  { name: "Gloss", desc: "Bright, high-contrast, and color-forward." },
  { name: "Soft-touch", desc: "Tactile and premium." },
  { name: "Metallic", desc: "Reflective shelf impact." },
  { name: "Kraft look", desc: "Natural shelf cue with engineered barrier behind it." },
  { name: "Clear window", desc: "Lets the product sell itself." },
];

const ARTWORK_CHECKS = [
  "Native Adobe Illustrator file", "300 DPI images at 100% scale", "CMYK document color mode",
  "Pantone Solid Coated where needed", "Fonts converted to outlines", "Die line on separate top layer",
  "Die line set as spot color and overprint", "0.125 inch bleed", "0.125 inch safety margin", "Barcode checked",
];

/* ============ recommendation logic ============ */

function recommendFormat(product: string, fill: string): { name: string; href: string; why: string } {
  if (fill === "Our own FFS / flow-wrap equipment")
    return { name: "Printed Rollstock", href: "/capabilities/rollstock", why: "Your equipment forms, fills, and seals the package — printed rollstock is engineered to run on it at volume." };
  if (product.startsWith("Liquid"))
    return { name: "Spouted Pouch", href: "/capabilities/spouted-pouches", why: "Liquids need controlled dispensing, reclose, and flex-crack-resistant films — the spouted pouch's home territory." };
  if (product.startsWith("Medical") )
    return { name: "Flat / 3-Side-Seal Pouch", href: "/capabilities/flat-pouches", why: "Clean, documented, seal-reliable format common in medical-adjacent and regulated programs." };
  if (product.startsWith("Powder") || product.startsWith("Protein"))
    return { name: "Stand-Up Pouch (or Stick Packs for dosing)", href: "/capabilities/pouches", why: "Resealable stand-up pouches carry multi-serving powders; stick packs cover single-dose lines." };
  if (product.startsWith("Cosmetic"))
    return { name: "Sachets & Stick Packs", href: "/capabilities/stick-packs", why: "Sampling and single-use dominate personal care — small-format sachets are the efficient entry." };
  if (product.startsWith("Hardware"))
    return { name: "Flat / 3-Side-Seal Pouch", href: "/capabilities/flat-pouches", why: "Maximum print area and material efficiency for non-food goods that don't need to stand on shelf." };
  return { name: "Stand-Up Pouch", href: "/capabilities/pouches", why: "Best when shelf presence, resealability, lightweight shipping, and multi-use customer experience matter." };
}

function barrierFocus(threats: string[]): string {
  const has = (s: string) => threats.some((t) => t.toLowerCase().includes(s));
  const parts: string[] = [];
  if (has("moisture") || has("clumping")) parts.push("moisture control");
  if (has("oxygen")) parts.push("oxygen resistance");
  if (has("aroma") || has("odor")) parts.push("aroma retention");
  if (has("light")) parts.push("light/UV protection");
  if (has("grease")) parts.push("grease-resistant sealants");
  if (has("freezer") || has("flex")) parts.push("freezer-grade flex-crack resistance");
  if (has("puncture")) parts.push("puncture resistance");
  if (has("seal")) parts.push("seal integrity");
  if (parts.length === 0) return "To be confirmed with the Microflex team based on product review.";
  return parts.join(", ") + " — confirmed against your product, shelf-life target, and filling process.";
}

function printPath(qty: string): { name: string; copy: string } {
  if (qty === "Under 5,000" || qty === "5,000 – 25,000")
    return { name: "Digital", copy: "Digital is usually the best fit when speed, short runs, versioning, and test-market flexibility matter more than the lowest possible unit cost." };
  if (qty === "100,000+")
    return { name: "Flexographic", copy: "Flexo is usually the stronger fit when volume is steady, artwork is stable, and reusable plates can reduce unit cost over repeated production." };
  return { name: "Compare both", copy: "Your quantity sits near the decision zone. Microflex can quote more than one production path so you can compare setup cost, unit cost, timing, and reorder economics." };
}

/* ============ UI ============ */

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(2,5,9,0.6)", border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px", padding: "12px 14px", color: "#f7fbff", fontSize: "14px",
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-4 py-2 text-xs font-bold transition"
      style={{
        border: `1px solid ${active ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
        background: active ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
        color: active ? "#34e3f5" : "#a9b9c8",
      }}
    >
      {children}
    </button>
  );
}

const STEPS = ["Product", "Threats", "Format", "Size & Fill", "Finish", "Print Path", "Artwork", "Summary"];

export default function SpecBuilder() {
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState("");
  const [priority, setPriority] = useState("");
  const [threats, setThreats] = useState<string[]>([]);
  const [fillWeight, setFillWeight] = useState("");
  const [fillMethod, setFillMethod] = useState("");
  const [qty, setQty] = useState("");
  const [skus, setSkus] = useState("1");
  const [finish, setFinish] = useState("");
  const [artwork, setArtwork] = useState<boolean[]>(ARTWORK_CHECKS.map(() => false));
  const [copied, setCopied] = useState(false);

  const fmt = useMemo(() => (product ? recommendFormat(product, fillMethod) : null), [product, fillMethod]);
  const barrier = useMemo(() => barrierFocus(threats), [threats]);
  const print = useMemo(() => (qty ? printPath(qty) : null), [qty]);
  const artReady = artwork.filter(Boolean).length;
  const artStatus =
    artReady === ARTWORK_CHECKS.length ? "Production-ready" : artReady >= 6 ? "Nearly ready — minor prepress items open" : artReady > 0 ? "In progress — prepress review recommended" : "Not started — request a die line first";

  const canNext = [
    Boolean(product), true, true, Boolean(qty || fillWeight || fillMethod), true, Boolean(qty), true, true,
  ][step];

  const summary = useMemo(() => {
    return [
      "MICROFLEX PACKAGING SPEC — planning summary",
      `Product: ${product || "—"}${priority ? ` (priority: ${priority})` : ""}`,
      `Product threats: ${threats.length ? threats.join("; ") : "—"}`,
      `Recommended format: ${fmt?.name ?? "—"}`,
      `Likely barrier focus: ${barrier}`,
      `Fill weight/volume: ${fillWeight || "—"} · Filling method: ${fillMethod || "—"}`,
      `Quantity: ${qty || "—"} · SKUs: ${skus || "—"}`,
      `Preferred finish: ${finish || "—"}`,
      `Recommended print path: ${print?.name ?? "—"}`,
      `Artwork readiness: ${artStatus} (${artReady}/${ARTWORK_CHECKS.length} checks)`,
      "",
      "Note: planning recommendation — final structures, dimensions, materials, tolerances, and production requirements are confirmed by the Microflex team.",
      "Built with microflexfilm.com/packaging-spec-builder",
    ].join("\n");
  }, [product, priority, threats, fmt, barrier, fillWeight, fillMethod, qty, skus, finish, print, artStatus, artReady]);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* noop */ }
  }

  const mailHref = `mailto:info@microflexfilm.com?subject=${encodeURIComponent("Packaging Spec — " + (product || "New Project"))}&body=${encodeURIComponent(summary)}`;

  return (
    <div
      className="rounded-4xl p-5 md:p-9"
      style={{ border: "1px solid rgba(0,216,242,0.28)", background: "linear-gradient(180deg, rgba(0,216,242,0.06), rgba(255,255,255,0.02))" }}
    >
      {/* Progress */}
      <div className="mb-7 flex flex-wrap items-center gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => i <= step && setStep(i)}
            className="rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition"
            style={{
              border: `1px solid ${i === step ? "rgba(0,216,242,0.7)" : i < step ? "rgba(0,216,242,0.35)" : "rgba(255,255,255,0.1)"}`,
              background: i === step ? "rgba(0,216,242,0.15)" : "transparent",
              color: i === step ? "#34e3f5" : i < step ? "#7fc9d8" : "#536575",
              cursor: i <= step ? "pointer" : "default",
            }}
          >
            {i < step ? "✓ " : `${i + 1}. `}{s}
          </button>
        ))}
      </div>

      {/* Step 1 — product */}
      {step === 0 && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">What are you packaging?</h3>
            <p className="mt-1 text-sm text-muted">Packaging starts with product behavior. Select the closest match.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p) => (
              <Chip key={p} active={product === p} onClick={() => setProduct(p)}>{p}</Chip>
            ))}
          </div>
          {product && (
            <div>
              <p className="mb-2 text-sm font-bold text-paper">What matters most?</p>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => (
                  <Chip key={p} active={priority === p} onClick={() => setPriority(p)}>{p}</Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2 — threats */}
      {step === 1 && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">What can damage the product?</h3>
            <p className="mt-1 text-sm text-muted">
              Select every risk that applies. Barrier is where many packaging budgets are either protected or wasted.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {THREATS.map((t) => (
              <Chip
                key={t}
                active={threats.includes(t)}
                onClick={() => setThreats((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))}
              >
                {t}
              </Chip>
            ))}
          </div>
          {threats.length > 0 && (
            <p className="rounded-2xl p-4 text-sm leading-relaxed text-muted" style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)" }}>
              Based on your selections, your structure direction points to{" "}
              <span className="font-bold text-cyan">{barrier}</span>
            </p>
          )}
        </div>
      )}

      {/* Step 3 — format */}
      {step === 2 && fmt && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">Which package format fits the job?</h3>
            <p className="mt-1 text-sm text-muted">
              Format decides how the product stands, ships, reseals, dispenses, and runs through production.
            </p>
          </div>
          <div className="rounded-3xl p-6" style={{ border: "1px solid rgba(0,216,242,0.5)", background: "rgba(0,216,242,0.08)" }}>
            <div className="kicker mb-2 text-[10px]">Recommended for your answers</div>
            <div className="text-2xl font-black text-paper">{fmt.name}</div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{fmt.why}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={fmt.href} className="btn btn-secondary" style={{ minHeight: 40, fontSize: 13 }}>View Technical Blueprint →</a>
              <a href="/calculators#format-comparison" className="btn btn-secondary" style={{ minHeight: 40, fontSize: 13 }}>Compare Formats</a>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — size & fill */}
      {step === 3 && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">How much product goes inside?</h3>
            <p className="mt-1 text-sm text-muted">
              Fill weight and product density affect pouch size, gusset depth, seal area, structure, and carton planning.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Target fill weight / volume</span>
              <input style={inputStyle} value={fillWeight} onChange={(e) => setFillWeight(e.target.value)} placeholder="e.g. 12 oz" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Filling method</span>
              <select style={inputStyle} value={fillMethod} onChange={(e) => setFillMethod(e.target.value)}>
                <option value="">Select…</option>
                {FILL_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Quantity</span>
              <select style={inputStyle} value={qty} onChange={(e) => setQty(e.target.value)}>
                <option value="">Select…</option>
                {QUANTITIES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Your fill weight, product density, and filling method determine the real package size.
            Microflex can estimate a starting dimension, then confirm with fill testing, production
            die lines, and machine requirements. Want a quick start?{" "}
            <a href="/calculators#pouch-size" className="font-bold text-cyan underline">Try the pouch size estimator →</a>
          </p>
        </div>
      )}

      {/* Step 5 — finish */}
      {step === 4 && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">What should the package feel like on shelf?</h3>
            <p className="mt-1 text-sm text-muted">Finish changes perceived value before the customer reads a word.</p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {FINISHES.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setFinish(f.name)}
                className="rounded-2xl p-4 text-left transition"
                style={{
                  border: `1px solid ${finish === f.name ? "rgba(0,216,242,0.6)" : "rgba(255,255,255,0.12)"}`,
                  background: finish === f.name ? "rgba(0,216,242,0.08)" : "rgba(255,255,255,0.03)",
                }}
              >
                <span className={`block text-base font-black ${finish === f.name ? "text-cyan" : "text-paper"}`}>{f.name}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">{f.desc}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">
            Want to see them? <a href="/calculators#finish-visualizer" className="font-bold text-cyan underline">Open the finish visualizer →</a>
          </p>
        </div>
      )}

      {/* Step 6 — print path */}
      {step === 5 && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">What print path fits the run?</h3>
            <p className="mt-1 text-sm text-muted">
              Print technology is an economics decision. Quantity, SKU count, artwork stability, and reorder frequency all matter.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Quantity</span>
              <select style={inputStyle} value={qty} onChange={(e) => setQty(e.target.value)}>
                <option value="">Select…</option>
                {QUANTITIES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">Number of SKUs</span>
              <input style={inputStyle} value={skus} onChange={(e) => setSkus(e.target.value)} placeholder="e.g. 3" />
            </label>
          </div>
          {print && (
            <div className="rounded-3xl p-6" style={{ border: "1px solid rgba(0,216,242,0.5)", background: "rgba(0,216,242,0.08)" }}>
              <div className="kicker mb-2 text-[10px]">Recommended path</div>
              <div className="text-2xl font-black text-paper">{print.name}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{print.copy}</p>
              <a href="/printing" className="btn btn-secondary mt-4 inline-flex" style={{ minHeight: 40, fontSize: 13 }}>
                Compare Print Paths →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Step 7 — artwork */}
      {step === 6 && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">Is your artwork production-ready?</h3>
            <p className="mt-1 text-sm text-muted">
              A file can look finished and still fail prepress. Check the essentials before submitting.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {ARTWORK_CHECKS.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => setArtwork((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                className="flex items-start gap-3 rounded-xl p-3 text-left transition"
                style={{
                  border: `1px solid ${artwork[i] ? "rgba(0,216,242,0.5)" : "rgba(255,255,255,0.1)"}`,
                  background: artwork[i] ? "rgba(0,216,242,0.07)" : "rgba(255,255,255,0.02)",
                }}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-black"
                  style={{
                    border: `1.5px solid ${artwork[i] ? "#00d8f2" : "rgba(255,255,255,0.3)"}`,
                    background: artwork[i] ? "#00d8f2" : "transparent",
                    color: "#001018",
                  }}
                >
                  {artwork[i] ? "✓" : ""}
                </span>
                <span className={`text-sm ${artwork[i] ? "text-cyan" : "text-muted-light"}`}>{c}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">
            Full requirements with visuals: <a href="/artwork-guidelines" className="font-bold text-cyan underline">Artwork Guidelines →</a>
          </p>
        </div>
      )}

      {/* Step 8 — summary */}
      {step === 7 && (
        <div className="grid gap-5">
          <div>
            <h3 className="text-xl font-black text-paper">Your starting packaging direction</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              This is a planning summary based on your product, risks, fill method, quantity,
              finish preference, and artwork status. Microflex will confirm the final
              specification after reviewing your product requirements, files, dimensions,
              materials, and timeline.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Recommended format", fmt?.name ?? "—"],
              ["Likely barrier focus", threats.length ? barrierFocus(threats).split(" — ")[0] : "—"],
              ["Preferred finish", finish || "—"],
              ["Recommended print path", print?.name ?? "—"],
              ["Artwork readiness", artStatus],
              ["Quote readiness", product && qty ? "Ready to submit" : "Add product + quantity"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl p-4" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.06)" }}>
                <div className="kicker mb-1 text-[10px]">{k}</div>
                <div className="text-sm font-black text-paper">{v}</div>
              </div>
            ))}
          </div>
          <pre
            className="overflow-x-auto whitespace-pre-wrap rounded-2xl p-4 font-mono text-xs leading-relaxed text-muted-light"
            style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(2,5,9,0.6)" }}
          >
            {summary}
          </pre>
          <div className="flex flex-wrap gap-3">
            <a href={mailHref} className="btn btn-primary">Send This Spec to Microflex</a>
            <button type="button" onClick={() => void copySummary()} className="btn btn-secondary">
              {copied ? "✓ Copied" : "Copy Summary"}
            </button>
            <a href="/#sample-kit" className="btn btn-secondary">Request Sample Kit Based on This Spec</a>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="btn btn-dark"
          style={{ visibility: step === 0 ? "hidden" : "visible", minHeight: 42, fontSize: 13 }}
        >
          ← Back
        </button>
        {step < STEPS.length - 1 && (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="btn btn-primary"
            style={!canNext ? { opacity: 0.45 } : undefined}
          >
            {step === STEPS.length - 2 ? "Build My Summary →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}
