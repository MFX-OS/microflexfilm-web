"use client";

import { useState } from "react";
import { Field, Result, Disclaimer, inputStyle } from "./shared";

/* ---------------- Format finder quiz ---------------- */

type FormatScore = Record<string, number>;

const QUIZ = [
  {
    q: "What are you packaging?",
    options: [
      { label: "Dry solids (snacks, coffee, kibble)", scores: { pouches: 3, "quad-seal": 2, "flat-pouches": 1, rollstock: 2 } },
      { label: "Powder or granules", scores: { pouches: 2, "stick-packs": 3, "quad-seal": 2, rollstock: 1 } },
      { label: "Liquid, gel, or sauce", scores: { "spouted-pouches": 3, "stick-packs": 2, "flat-pouches": 1 } },
      { label: "Bars or individually wrapped pieces", scores: { "fin-seal": 3, rollstock: 2, "flat-pouches": 1 } },
    ],
  },
  {
    q: "How does the customer use it?",
    options: [
      { label: "Multiple servings over days/weeks — needs reseal", scores: { pouches: 3, "quad-seal": 3 } },
      { label: "One serving, used once", scores: { "stick-packs": 3, "fin-seal": 2, "flat-pouches": 2 } },
      { label: "Poured or squeezed out", scores: { "spouted-pouches": 3 } },
      { label: "Restricted access required (safety)", scores: { "child-resistant": 4 } },
    ],
  },
  {
    q: "Where does it sell?",
    options: [
      { label: "Retail shelf — standing presence matters", scores: { pouches: 3, "quad-seal": 3 } },
      { label: "Peg hooks / checkout / impulse", scores: { "flat-pouches": 3, "die-cut": 3, "fin-seal": 1 } },
      { label: "E-commerce / DTC", scores: { "flat-pouches": 2, pouches: 2, "spouted-pouches": 1 } },
      { label: "Inside another package (multipack)", scores: { "fin-seal": 3, "stick-packs": 2 } },
    ],
  },
  {
    q: "How is it filled?",
    options: [
      { label: "By hand or simple sealer", scores: { pouches: 2, "flat-pouches": 2, "quad-seal": 2, "spouted-pouches": 1 } },
      { label: "Co-packer fills it", scores: { pouches: 2, "stick-packs": 2, "quad-seal": 1 } },
      { label: "Our own form-fill-seal / flow-wrap equipment", scores: { rollstock: 4, "fin-seal": 3 } },
      { label: "Not sure yet", scores: { pouches: 1, "flat-pouches": 1 } },
    ],
  },
  {
    q: "How heavy is one filled unit?",
    options: [
      { label: "Under 4 oz", scores: { "stick-packs": 2, "flat-pouches": 2, "fin-seal": 1 } },
      { label: "4–16 oz", scores: { pouches: 3, "flat-pouches": 1 } },
      { label: "1–5 lbs", scores: { "quad-seal": 3, pouches: 1 } },
      { label: "Over 5 lbs", scores: { "quad-seal": 4 } },
    ],
  },
];

const FORMAT_NAMES: Record<string, string> = {
  pouches: "Stand-Up Pouches",
  "flat-pouches": "Flat Pouches",
  "quad-seal": "Quad-Seal Pouches",
  "stick-packs": "Stick Packs & Sachets",
  "fin-seal": "Fin-Seal / Flow Wrap",
  "die-cut": "Die-Cut Shapes",
  "child-resistant": "Child-Resistant Pouches",
  "spouted-pouches": "Spouted Pouches",
  rollstock: "Printed Rollstock",
};

export function FormatFinder() {
  const [answers, setAnswers] = useState<number[]>(Array(QUIZ.length).fill(-1));

  const done = answers.every((a) => a >= 0);
  const scores: FormatScore = {};
  answers.forEach((a, qi) => {
    if (a < 0) return;
    Object.entries(QUIZ[qi].options[a].scores).forEach(([f, s]) => {
      scores[f] = (scores[f] ?? 0) + s;
    });
  });
  const ranked = Object.entries(scores).sort((x, y) => y[1] - x[1]);
  const top = ranked[0];
  const second = ranked[1];

  return (
    <div className="grid gap-6">
      {QUIZ.map((q, qi) => (
        <div key={q.q}>
          <div className="mb-2 text-sm font-bold text-paper">
            <span className="font-mono text-cyan">{qi + 1}.</span> {q.q}
          </div>
          <div className="flex flex-wrap gap-2">
            {q.options.map((o, oi) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setAnswers((prev) => prev.map((v, i) => (i === qi ? oi : v)))}
                className="rounded-full px-4 py-2 text-xs font-bold transition"
                style={{
                  border: `1px solid ${answers[qi] === oi ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
                  background: answers[qi] === oi ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
                  color: answers[qi] === oi ? "#34e3f5" : "#a9b9c8",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {done && top && (
        <div
          className="rounded-3xl p-6"
          style={{ border: "1px solid rgba(0,216,242,0.5)", background: "rgba(0,216,242,0.08)" }}
        >
          <div className="kicker mb-2 text-[10px]">Your match</div>
          <div className="text-2xl font-black text-paper">{FORMAT_NAMES[top[0]]}</div>
          {second && (
            <div className="mt-1 text-sm text-muted">
              Worth comparing: <span className="font-bold text-muted-light">{FORMAT_NAMES[second[0]]}</span>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/capabilities/${top[0]}`} className="btn btn-primary" style={{ minHeight: 42, fontSize: 13 }}>
              View {FORMAT_NAMES[top[0]]} Blueprint →
            </a>
            {second && (
              <a href={`/capabilities/${second[0]}`} className="btn btn-secondary" style={{ minHeight: 42, fontSize: 13 }}>
                Compare {FORMAT_NAMES[second[0]]}
              </a>
            )}
          </div>
        </div>
      )}
      {!done && (
        <p className="text-xs text-muted-dark">Answer all five questions to see your recommended format.</p>
      )}
    </div>
  );
}

/* ---------------- Barrier selector ---------------- */

const THREATS = [
  { id: "moisture", label: "Humidity / moisture (loses crunch, clumps)" },
  { id: "oxygen", label: "Oxygen (goes stale or rancid)" },
  { id: "light", label: "Light / UV (color or nutrients degrade)" },
  { id: "aroma", label: "Aroma loss or odor transfer" },
  { id: "grease", label: "Oils / grease (high-fat product)" },
  { id: "freeze", label: "Freezer storage" },
];

export function BarrierSelector() {
  const [sel, setSel] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  let rec = "";
  let detail = "";
  const has = (x: string) => sel.includes(x);

  if (sel.length === 0) {
    rec = "";
  } else if (has("light") && (has("oxygen") || has("aroma"))) {
    rec = "Foil or metallized high-barrier lamination";
    detail = "Light plus oxygen/aroma sensitivity is the classic case for foil — near-total blockage of light, oxygen, and moisture in one structure. The trade-off is no product visibility.";
  } else if (has("oxygen") && has("moisture")) {
    rec = "High-barrier clear or metallized lamination";
    detail = "Dual oxygen + moisture protection from barrier films — with clear-barrier options if you want a product window.";
  } else if (has("oxygen") || has("aroma")) {
    rec = "Oxygen/aroma barrier lamination";
    detail = "Barrier webs that slow oxidation and hold volatile aromas — the coffee, nut, and jerky standard.";
  } else if (has("moisture") && has("freeze")) {
    rec = "PE-rich freezer-grade structure";
    detail = "Cold-crack-resistant films with strong moisture barrier and seals that survive thermal cycling.";
  } else if (has("moisture")) {
    rec = "Moisture-barrier film (BOPP or PE-based)";
    detail = "Keeps humidity out (or in) — the snack and dry-goods workhorse, economical at volume.";
  } else if (has("grease")) {
    rec = "Grease-resistant sealant system";
    detail = "Sealant layers engineered to hold integrity with oily contents in the seal zone.";
  } else if (has("freeze")) {
    rec = "Freezer-grade PE structure";
    detail = "Films that stay flexible at deep-freeze temperatures with seals that bond through frost.";
  } else if (has("light")) {
    rec = "Opaque or metallized print structure";
    detail = "Blocks UV degradation while keeping print quality high.";
  }
  if (has("grease") && rec && !rec.includes("Grease")) {
    detail += " Add a grease-resistant sealant for your high-fat contents.";
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-2 sm:grid-cols-2">
        {THREATS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            className="flex items-center gap-3 rounded-2xl p-4 text-left text-sm font-semibold transition"
            style={{
              border: `1px solid ${sel.includes(t.id) ? "rgba(0,216,242,0.6)" : "rgba(255,255,255,0.12)"}`,
              background: sel.includes(t.id) ? "rgba(0,216,242,0.08)" : "rgba(255,255,255,0.03)",
              color: sel.includes(t.id) ? "#34e3f5" : "#a9b9c8",
            }}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-black"
              style={{
                border: `1.5px solid ${sel.includes(t.id) ? "#00d8f2" : "rgba(255,255,255,0.3)"}`,
                background: sel.includes(t.id) ? "#00d8f2" : "transparent",
                color: "#001018",
              }}
            >
              {sel.includes(t.id) ? "✓" : ""}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {rec && (
        <div
          className="rounded-3xl p-6"
          style={{ border: "1px solid rgba(0,216,242,0.5)", background: "rgba(0,216,242,0.08)" }}
        >
          <div className="kicker mb-2 text-[10px]">Recommended starting structure</div>
          <div className="text-xl font-black text-paper">{rec}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
          <a href="/materials" className="btn btn-secondary mt-4 inline-flex" style={{ minHeight: 40, fontSize: 13 }}>
            Explore Barrier Systems →
          </a>
        </div>
      )}
      <Disclaimer>
        A starting point, not a spec — final structures are engineered to your product chemistry
        and shelf-life target, then verified.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Format comparison ---------------- */

const COMPARE_DATA: Record<string, { name: string; stands: string; reseal: string; panels: string; barrier: string; heavy: string; equip: string; best: string }> = {
  pouches: { name: "Stand-Up Pouch", stands: "Yes — gusset base", reseal: "Zipper / slider", panels: "3 (front, back, gusset)", barrier: "Economy → foil", heavy: "Up to ~2 lb", equip: "None needed", best: "Retail shelf presence" },
  "flat-pouches": { name: "Flat Pouch", stands: "No — lays flat / pegs", reseal: "Optional zipper", panels: "2 (front, back)", barrier: "Economy → foil", heavy: "Light fills", equip: "None needed", best: "Samples, peg display" },
  "quad-seal": { name: "Quad-Seal", stands: "Yes — square base", reseal: "Zipper / tin-tie", panels: "5", barrier: "Mid → foil", heavy: "1–5+ lb", equip: "None needed", best: "Coffee, protein, pet" },
  "stick-packs": { name: "Stick Pack / Sachet", stands: "No", reseal: "No — single dose", panels: "1–2", barrier: "Mid → foil", heavy: "Single servings", equip: "Multi-lane filler", best: "Dosing & sampling" },
  "fin-seal": { name: "Fin-Seal / Flow Wrap", stands: "No — pillow", reseal: "No", panels: "Wraparound", barrier: "Economy → high", heavy: "Unit portions", equip: "Flow wrapper / VFFS", best: "Bars, candy, volume" },
  "spouted-pouches": { name: "Spouted Pouch", stands: "Yes — gusset base", reseal: "Cap", panels: "3", barrier: "Liquid-rated", heavy: "Liquids to ~2 L", equip: "Spout filler", best: "Liquids & refills" },
  "child-resistant": { name: "Child-Resistant", stands: "Yes", reseal: "CR zipper", panels: "3", barrier: "Mid → foil", heavy: "Up to ~2 lb", equip: "None needed", best: "Regulated products" },
  rollstock: { name: "Printed Rollstock", stands: "Depends on bag made", reseal: "Machine-applied", panels: "Continuous web", barrier: "Economy → foil", heavy: "Machine-dependent", equip: "FFS line required", best: "High-volume in-line fill" },
};

const COMPARE_ROWS: { key: keyof (typeof COMPARE_DATA)["pouches"]; label: string }[] = [
  { key: "stands", label: "Stands on shelf" },
  { key: "reseal", label: "Reclose" },
  { key: "panels", label: "Print panels" },
  { key: "barrier", label: "Barrier range" },
  { key: "heavy", label: "Fill weight" },
  { key: "equip", label: "Equipment needed" },
  { key: "best", label: "Best for" },
];

export function FormatComparison() {
  const [picks, setPicks] = useState<string[]>(["pouches", "quad-seal", "flat-pouches"]);

  const toggle = (id: string) =>
    setPicks((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? [...p.slice(1), id] : [...p, id]
    );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {Object.entries(COMPARE_DATA).map(([id, d]) => (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className="rounded-full px-4 py-2 text-xs font-bold transition"
            style={{
              border: `1px solid ${picks.includes(id) ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
              background: picks.includes(id) ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
              color: picks.includes(id) ? "#34e3f5" : "#a9b9c8",
            }}
          >
            {d.name}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left" style={{ borderBottom: "1px solid rgba(0,216,242,0.3)" }}></th>
              {picks.map((id) => (
                <th key={id} className="px-3 py-2 text-left font-black text-cyan" style={{ borderBottom: "1px solid rgba(0,216,242,0.3)" }}>
                  <a href={`/capabilities/${id}`} className="underline underline-offset-2">{COMPARE_DATA[id].name}</a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.key}>
                <td className="kicker px-3 py-2.5 text-[10px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{row.label}</td>
                {picks.map((id) => (
                  <td key={id} className="px-3 py-2.5 text-muted-light" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {COMPARE_DATA[id][row.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Disclaimer>Pick up to three formats — column headers link to each blueprint page.</Disclaimer>
    </div>
  );
}

/* ---------------- Finish visualizer ---------------- */

const FINISHES = [
  { id: "matte", label: "Matte", body: "#22384a", overlay: "none", text: "Soft, glare-free, premium." },
  { id: "gloss", label: "Gloss", body: "#28425a", overlay: "gloss", text: "High shine, maximum color pop." },
  { id: "soft", label: "Soft-Touch", body: "#1b2d3c", overlay: "soft", text: "Velvet feel, deep rich tone." },
  { id: "metallic", label: "Metallic", body: "metal", overlay: "gloss", text: "Foil shimmer that catches light." },
  { id: "kraft", label: "Kraft Look", body: "#5d5240", overlay: "none", text: "Natural, organic shelf language." },
];

export function FinishVisualizer() {
  const [finish, setFinish] = useState("matte");
  const f = FINISHES.find((x) => x.id === finish)!;

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[auto,1fr]">
      <svg viewBox="0 0 220 300" className="mx-auto w-[200px]" role="img" aria-label={`Pouch shown with ${f.label} finish`}>
        <defs>
          <linearGradient id="metalgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9fb4c4" />
            <stop offset="35%" stopColor="#e2edf4" />
            <stop offset="65%" stopColor="#7e95a6" />
            <stop offset="100%" stopColor="#c2d4de" />
          </linearGradient>
          <linearGradient id="glossgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path
          d="M50 30 L170 30 L180 250 Q180 272 154 272 L66 272 Q40 272 40 250 Z"
          fill={f.body === "metal" ? "url(#metalgrad)" : f.body}
          stroke="#00d8f2"
          strokeWidth="2"
        />
        {f.overlay === "gloss" && (
          <path d="M50 30 L170 30 L180 250 Q180 272 154 272 L66 272 Q40 272 40 250 Z" fill="url(#glossgrad)" />
        )}
        {f.overlay === "soft" && (
          <path d="M50 30 L170 30 L180 250 Q180 272 154 272 L66 272 Q40 272 40 250 Z" fill="rgba(0,0,0,0.18)" />
        )}
        <rect x="68" y="90" width="84" height="12" rx="2" fill={finish === "kraft" ? "#2e2820" : "#00d8f2"} opacity="0.85" />
        <rect x="68" y="112" width="60" height="5" rx="1" fill={finish === "kraft" ? "#2e2820" : "#f7fbff"} opacity="0.5" />
        <rect x="68" y="124" width="60" height="5" rx="1" fill={finish === "kraft" ? "#2e2820" : "#f7fbff"} opacity="0.5" />
        <rect x="56" y="42" width="108" height="8" rx="3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      </svg>

      <div className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          {FINISHES.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setFinish(x.id)}
              className="rounded-full px-4 py-2 text-xs font-bold transition"
              style={{
                border: `1px solid ${finish === x.id ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
                background: finish === x.id ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
                color: finish === x.id ? "#34e3f5" : "#a9b9c8",
              }}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)" }}
        >
          <div className="text-base font-black text-paper">{f.label}</div>
          <p className="mt-1 text-sm text-muted">{f.text}</p>
        </div>
        <a href="/#sample-kit" className="btn btn-secondary" style={{ minHeight: 42, fontSize: 13 }}>
          Feel Them for Real — Sample Kit →
        </a>
      </div>
    </div>
  );
}

/* ---------------- Die-line template generator ---------------- */

export function DieLineGenerator() {
  const [w, setW] = useState("6");
  const [h, setH] = useState("9");
  const [g, setG] = useState("3");

  const W = parseFloat(w) || 0;
  const H = parseFloat(h) || 0;
  const G = parseFloat(g) || 0;
  const valid = W > 0 && H > 0 && G >= 0;

  const S = 40; // px per inch
  const bleed = 0.125;
  const pad = 60;
  const svgW = W * S + pad * 2;
  const svgH = H * S + pad * 2;

  const svg = valid
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" font-family="monospace">
  <rect width="${svgW}" height="${svgH}" fill="white"/>
  <!-- BLEED (extend art to here) -->
  <rect x="${pad - bleed * S}" y="${pad - bleed * S}" width="${(W + bleed * 2) * S}" height="${(H + bleed * 2) * S}" fill="none" stroke="#00a0c0" stroke-width="1" stroke-dasharray="8 5"/>
  <!-- DIE LINE (cut) -->
  <rect x="${pad}" y="${pad}" width="${W * S}" height="${H * S}" fill="none" stroke="#e6007e" stroke-width="2"/>
  <!-- SAFETY -->
  <rect x="${pad + bleed * S}" y="${pad + bleed * S}" width="${(W - bleed * 2) * S}" height="${(H - bleed * 2) * S}" fill="none" stroke="#888" stroke-width="1" stroke-dasharray="3 4"/>
  <!-- GUSSET FOLD -->
  <line x1="${pad}" y1="${pad + (H - G / 2) * S}" x2="${pad + W * S}" y2="${pad + (H - G / 2) * S}" stroke="#0080ff" stroke-width="1.5" stroke-dasharray="10 6"/>
  <text x="${pad + 6}" y="${pad + (H - G / 2) * S - 6}" font-size="11" fill="#0080ff">GUSSET FOLD (${G}" gusset)</text>
  <text x="${pad}" y="${pad - bleed * S - 8}" font-size="11" fill="#00a0c0">BLEED — extend artwork 0.125" beyond die line</text>
  <text x="${pad}" y="${pad + H * S + bleed * S + 18}" font-size="11" fill="#e6007e">DIE LINE — ${W}" x ${H}" front panel (cut)</text>
  <text x="${pad + bleed * S + 6}" y="${pad + bleed * S + 16}" font-size="11" fill="#888">SAFETY — keep text/logos inside</text>
  <text x="${pad}" y="22" font-size="13" fill="#222" font-weight="bold">MICROFLEX PLANNING TEMPLATE — Stand-Up Pouch ${W}x${H} +${G} gusset — request production die line before final art</text>
</svg>`
    : "";

  function download() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `microflex-dieline-template-${w}x${h}-g${g}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Pouch width (in)">
          <input style={inputStyle} type="number" min="0" step="0.25" value={w} onChange={(e) => setW(e.target.value)} />
        </Field>
        <Field label="Pouch height (in)">
          <input style={inputStyle} type="number" min="0" step="0.25" value={h} onChange={(e) => setH(e.target.value)} />
        </Field>
        <Field label="Bottom gusset (in)">
          <input style={inputStyle} type="number" min="0" step="0.25" value={g} onChange={(e) => setG(e.target.value)} />
        </Field>
      </div>

      {valid && (
        <div className="overflow-hidden rounded-2xl bg-white p-2" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={download} disabled={!valid} className="btn btn-primary" style={!valid ? { opacity: 0.5 } : undefined}>
          ⬇ Download SVG Template
        </button>
        <a href="/artwork-guidelines" className="btn btn-secondary">Artwork Guidelines</a>
      </div>
      <Disclaimer>
        This is a planning template for the front panel — bleed, die line, safety margin, and
        gusset fold zone at correct proportions. Production die lines include seal areas, back
        panel, and machine-specific allowances; request the production die line from your
        specialist before building final artwork.
      </Disclaimer>
    </div>
  );
}
