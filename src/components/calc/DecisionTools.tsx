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

const SEAL_WIDTHS = [
  { label: '1/4" seals', v: 0.25 },
  { label: '3/8" seals', v: 0.375 },
  { label: '1/2" seals', v: 0.5 },
];

export function DieLineGenerator() {
  const [format, setFormat] = useState<"standup" | "flat">("standup");
  const [unit, setUnit] = useState<"in" | "mm">("in");
  const [w, setW] = useState("6");
  const [h, setH] = useState("9");
  const [g, setG] = useState("3");
  const [sealW, setSealW] = useState(0.375);
  const [zipper, setZipper] = useState(true);
  const [tearNotch, setTearNotch] = useState(true);
  const [hangHole, setHangHole] = useState(false);
  const [valve, setValve] = useState(false);
  const [backPanel, setBackPanel] = useState(false);

  // Convert inputs to inches for geometry
  const toIn = (v: string) => {
    const n = parseFloat(v) || 0;
    return unit === "mm" ? n / 25.4 : n;
  };
  const W = toIn(w);
  const H = toIn(h);
  const G = format === "standup" ? toIn(g) : 0;
  const valid = W >= 2 && H >= 2 && (format === "flat" || (G >= 0.5 && G < H));

  const fmtDim = (inches: number) =>
    unit === "mm" ? `${Math.round(inches * 25.4)} mm` : `${inches}"`;

  const S = 40; // px per inch
  const bleed = 0.125;
  const safety = 0.125;
  const pad = 78;
  const legendH = 120;
  const zipH = 0.35; // zipper band height (in)
  const zipGap = 0.15; // gap between top seal and zipper
  const panelW = W * S;
  const panelGap = 44;
  const panels = backPanel ? 2 : 1;
  const svgW = pad * 2 + panelW * panels + (backPanel ? panelGap : 0);
  const svgH = pad * 2 + H * S + legendH;

  // Vertical landmarks (inches from panel top)
  const zipTop = sealW + zipGap;
  const zipBottom = zipTop + zipH;
  const safeTop = (zipper ? zipBottom : sealW) + safety;
  const safeBottom = H - (format === "standup" ? G / 2 : sealW) - safety;
  const safeLeft = sealW + safety;
  const safeRight = W - sealW - safety;

  const featureList = [
    zipper && "press-to-close zipper",
    tearNotch && "tear notches",
    hangHole && "hang hole",
    valve && "degassing valve",
  ].filter(Boolean).join(", ") || "none";

  function panelSvg(x0: number, label: string): string {
    const L = (ix: number) => x0 + ix * S; // x inches → px
    const T = (iy: number) => pad + iy * S; // y inches → px
    const parts: string[] = [];

    // Bleed
    parts.push(`<rect x="${L(-bleed)}" y="${T(-bleed)}" width="${(W + bleed * 2) * S}" height="${(H + bleed * 2) * S}" rx="10" fill="none" stroke="#00a0c0" stroke-width="1.2" stroke-dasharray="8 5"/>`);
    // Die line
    parts.push(`<rect x="${L(0)}" y="${T(0)}" width="${W * S}" height="${H * S}" rx="6" fill="#ffffff" stroke="#e6007e" stroke-width="2.2"/>`);

    // --- Seal zones (hatched) ---
    const seal = (x: number, y: number, sw: number, sh: number) =>
      parts.push(`<rect x="${x}" y="${y}" width="${sw}" height="${sh}" fill="url(#sealhatch)" stroke="#f59e0b" stroke-width="0.8" stroke-opacity="0.6"/>`);
    // top seal
    seal(L(0), T(0), W * S, sealW * S);
    // side seals
    seal(L(0), T(sealW), sealW * S, (H - sealW - (format === "standup" ? G / 2 : sealW)) * S);
    seal(L(W - sealW), T(sealW), sealW * S, (H - sealW - (format === "standup" ? G / 2 : sealW)) * S);
    // bottom: gusset zone (standup) or bottom seal (flat)
    if (format === "standup") {
      parts.push(`<rect x="${L(0)}" y="${T(H - G / 2)}" width="${W * S}" height="${(G / 2) * S}" fill="rgba(0,128,255,0.10)" stroke="none"/>`);
      parts.push(`<line x1="${L(0)}" y1="${T(H - G / 2)}" x2="${L(W)}" y2="${T(H - G / 2)}" stroke="#0080ff" stroke-width="1.6" stroke-dasharray="10 6"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${T(H - G / 4) + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#0080ff">GUSSET FOLD ZONE — NO TEXT IN THE GUSSET FOLD</text>`);
    } else {
      seal(L(0), T(H - sealW), W * S, sealW * S);
    }

    // Seal zone labels
    parts.push(`<text x="${L(W / 2)}" y="${T(sealW / 2) + 4}" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#b45309">SEAL ZONE — NO TEXT</text>`);
    parts.push(`<text x="${L(sealW / 2)}" y="${T(H / 2)}" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#b45309" transform="rotate(-90 ${L(sealW / 2)} ${T(H / 2)})">SEAL ZONE — NO TEXT</text>`);
    parts.push(`<text x="${L(W - sealW / 2)}" y="${T(H / 2)}" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#b45309" transform="rotate(90 ${L(W - sealW / 2)} ${T(H / 2)})">SEAL ZONE — NO TEXT</text>`);

    // --- Zipper ---
    if (zipper) {
      parts.push(`<rect x="${L(sealW)}" y="${T(zipTop)}" width="${(W - sealW * 2) * S}" height="${zipH * S}" fill="rgba(124,58,237,0.10)" stroke="#7c3aed" stroke-width="1.4"/>`);
      parts.push(`<line x1="${L(sealW)}" y1="${T(zipTop + zipH / 2)}" x2="${L(W - sealW)}" y2="${T(zipTop + zipH / 2)}" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3 3"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${T(zipTop) - 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#7c3aed">ZIPPER TRACK — KEEP CLEAR</text>`);
    }

    // --- Tear notches ---
    if (tearNotch) {
      const ny = zipper ? zipTop - 0.06 : sealW + 0.2;
      const notch = (xEdge: number, dir: number) =>
        parts.push(`<path d="M ${L(xEdge)} ${T(ny) - 6} l ${10 * dir} 6 l ${-10 * dir} 6 Z" fill="#16a34a"/>`);
      notch(0, 1);
      notch(W, -1);
      parts.push(`<text x="${L(0) - 8}" y="${T(ny) + 4}" text-anchor="end" font-size="9.5" font-weight="bold" fill="#16a34a">TEAR NOTCH</text>`);
    }

    // --- Hang hole ---
    if (hangHole) {
      parts.push(`<circle cx="${L(W / 2)}" cy="${T(sealW / 2)}" r="${0.125 * S}" fill="none" stroke="#16a34a" stroke-width="1.6"/>`);
      parts.push(`<text x="${L(W / 2) + 0.125 * S + 6}" y="${T(sealW / 2) + 3}" font-size="9" font-weight="bold" fill="#16a34a">HANG HOLE</text>`);
    }

    // --- Degassing valve ---
    if (valve) {
      const vx = L(W * 0.72), vy = T(safeTop + 0.6);
      parts.push(`<circle cx="${vx}" cy="${vy}" r="${0.35 * S}" fill="none" stroke="#16a34a" stroke-width="1.4" stroke-dasharray="5 4"/>`);
      parts.push(`<text x="${vx}" y="${vy + 0.35 * S + 12}" text-anchor="middle" font-size="9" font-weight="bold" fill="#16a34a">DEGASSING VALVE</text>`);
    }

    // --- Safe zone ---
    if (safeBottom > safeTop && safeRight > safeLeft) {
      parts.push(`<rect x="${L(safeLeft)}" y="${T(safeTop)}" width="${(safeRight - safeLeft) * S}" height="${(safeBottom - safeTop) * S}" fill="rgba(100,116,139,0.05)" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4 4"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${T(safeTop) + 16}" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#475569">SAFE ZONE</text>`);
      parts.push(`<text x="${L(W / 2)}" y="${T(safeTop) + 30}" text-anchor="middle" font-size="9" fill="#64748b">keep all text, logos &amp; barcodes inside this area</text>`);
    }

    // Panel label
    parts.push(`<text x="${L(W / 2)}" y="${T(-bleed) - 8}" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">${label}</text>`);

    // Dimension arrows (front panel only)
    if (label.startsWith("FRONT")) {
      const dy = T(H + bleed) + 22;
      parts.push(`<line x1="${L(0)}" y1="${dy}" x2="${L(W)}" y2="${dy}" stroke="#64748b" stroke-width="1"/>`);
      parts.push(`<line x1="${L(0)}" y1="${dy - 5}" x2="${L(0)}" y2="${dy + 5}" stroke="#64748b" stroke-width="1"/>`);
      parts.push(`<line x1="${L(W)}" y1="${dy - 5}" x2="${L(W)}" y2="${dy + 5}" stroke="#64748b" stroke-width="1"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${dy + 16}" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">${fmtDim(W)}</text>`);
      const dx = L(W + bleed) + 22;
      parts.push(`<line x1="${dx}" y1="${T(0)}" x2="${dx}" y2="${T(H)}" stroke="#64748b" stroke-width="1"/>`);
      parts.push(`<line x1="${dx - 5}" y1="${T(0)}" x2="${dx + 5}" y2="${T(0)}" stroke="#64748b" stroke-width="1"/>`);
      parts.push(`<line x1="${dx - 5}" y1="${T(H)}" x2="${dx + 5}" y2="${T(H)}" stroke="#64748b" stroke-width="1"/>`);
      parts.push(`<text x="${dx + 8}" y="${T(H / 2)}" font-size="11" font-weight="bold" fill="#334155" transform="rotate(90 ${dx + 8} ${T(H / 2)})" text-anchor="middle">${fmtDim(H)}</text>`);
    }

    return parts.join("\n  ");
  }

  const legendY = pad + H * S + 56;
  const legendItems = [
    `<g><line x1="0" y1="0" x2="26" y2="0" stroke="#e6007e" stroke-width="2.2"/><text x="32" y="4" font-size="10" fill="#334155">Die line (cut)</text></g>`,
    `<g transform="translate(140,0)"><line x1="0" y1="0" x2="26" y2="0" stroke="#00a0c0" stroke-width="1.4" stroke-dasharray="8 5"/><text x="32" y="4" font-size="10" fill="#334155">Bleed — extend art 0.125" past die line</text></g>`,
    `<g transform="translate(0,22)"><rect x="0" y="-7" width="26" height="14" fill="url(#sealhatch)" stroke="#f59e0b" stroke-width="0.8"/><text x="32" y="4" font-size="10" fill="#334155">Seal zone — no text</text></g>`,
    `<g transform="translate(140,22)"><line x1="0" y1="0" x2="26" y2="0" stroke="#0080ff" stroke-width="1.6" stroke-dasharray="10 6"/><text x="32" y="4" font-size="10" fill="#334155">Gusset fold — no text in the gusset fold</text></g>`,
    `<g transform="translate(0,44)"><rect x="0" y="-7" width="26" height="14" fill="rgba(100,116,139,0.08)" stroke="#64748b" stroke-width="1" stroke-dasharray="4 4"/><text x="32" y="4" font-size="10" fill="#334155">Safe Zone — all text, logos &amp; barcodes</text></g>`,
    `<g transform="translate(140,44)"><circle cx="13" cy="0" r="6" fill="none" stroke="#16a34a" stroke-width="1.4"/><text x="32" y="4" font-size="10" fill="#334155">Features (zipper, notch, hang hole, valve)</text></g>`,
  ].join("\n  ");

  const title = `${format === "standup" ? "Stand-Up Pouch" : "Flat 3-Side-Seal Pouch"} ${fmtDim(W)} × ${fmtDim(H)}${format === "standup" ? ` + ${fmtDim(G)} gusset` : ""} · ${SEAL_WIDTHS.find((x) => x.v === sealW)?.label ?? ""} · features: ${featureList}`;

  const svg = valid
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <pattern id="sealhatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="rgba(245,158,11,0.10)"/>
      <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(245,158,11,0.55)" stroke-width="1.4"/>
    </pattern>
  </defs>
  <rect width="${svgW}" height="${svgH}" fill="white"/>
  <text x="${pad - bleed * S}" y="26" font-size="13" font-weight="bold" fill="#0f172a">MICROFLEX PLANNING TEMPLATE — ${title}</text>
  <text x="${pad - bleed * S}" y="42" font-size="10" fill="#64748b">Planning reference only — request the production die line from your Microflex specialist before building final artwork. microflexfilm.com/artwork-guidelines</text>
  ${panelSvg(pad, "FRONT PANEL")}
  ${backPanel ? panelSvg(pad + panelW + panelGap, "BACK PANEL") : ""}
  <g transform="translate(${pad - bleed * S}, ${legendY})">
  ${legendItems}
  </g>
</svg>`
    : "";

  function download() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `microflex-dieline-${format}-${w}x${h}${format === "standup" ? `-g${g}` : ""}${unit}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const toggle = (
    label: string,
    value: boolean,
    set: (v: boolean) => void
  ) => (
    <button
      key={label}
      type="button"
      onClick={() => set(!value)}
      className="flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-bold transition"
      style={{
        border: `1px solid ${value ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
        background: value ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
        color: value ? "#34e3f5" : "#a9b9c8",
      }}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-black"
        style={{
          border: `1.5px solid ${value ? "#00d8f2" : "rgba(255,255,255,0.3)"}`,
          background: value ? "#00d8f2" : "transparent",
          color: "#001018",
        }}
      >
        {value ? "✓" : ""}
      </span>
      {label}
    </button>
  );

  return (
    <div className="grid gap-5">
      {/* Format + units */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["standup", "Stand-Up Pouch"],
            ["flat", "Flat / 3-Side-Seal"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFormat(id)}
            className="rounded-full px-4 py-2 text-xs font-extrabold transition"
            style={{
              border: `1px solid ${format === id ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
              background: format === id ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
              color: format === id ? "#34e3f5" : "#a9b9c8",
            }}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 text-muted-dark">·</span>
        {(["in", "mm"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className="rounded-full px-3 py-2 text-xs font-extrabold uppercase transition"
            style={{
              border: `1px solid ${unit === u ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
              background: unit === u ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
              color: unit === u ? "#34e3f5" : "#a9b9c8",
            }}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Dimensions */}
      <div className={`grid gap-5 ${format === "standup" ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        <Field label={`Pouch width (${unit})`}>
          <input style={inputStyle} type="number" min="0" step={unit === "mm" ? 5 : 0.25} value={w} onChange={(e) => setW(e.target.value)} />
        </Field>
        <Field label={`Pouch height (${unit})`}>
          <input style={inputStyle} type="number" min="0" step={unit === "mm" ? 5 : 0.25} value={h} onChange={(e) => setH(e.target.value)} />
        </Field>
        {format === "standup" && (
          <Field label={`Bottom gusset (${unit})`}>
            <input style={inputStyle} type="number" min="0" step={unit === "mm" ? 5 : 0.25} value={g} onChange={(e) => setG(e.target.value)} />
          </Field>
        )}
        <Field label="Seal width">
          <select style={inputStyle} value={sealW} onChange={(e) => setSealW(parseFloat(e.target.value))}>
            {SEAL_WIDTHS.map((x) => (
              <option key={x.v} value={x.v}>{x.label}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Feature toggles */}
      <div>
        <div className="kicker mb-2 text-[10px]">Pouch features</div>
        <div className="flex flex-wrap gap-2">
          {toggle("Zipper", zipper, setZipper)}
          {toggle("Tear notches", tearNotch, setTearNotch)}
          {toggle("Hang hole", hangHole, setHangHole)}
          {toggle("Degassing valve", valve, setValve)}
          {toggle("Include back panel", backPanel, setBackPanel)}
        </div>
      </div>

      {valid ? (
        <div className="overflow-x-auto rounded-2xl bg-white p-2" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      ) : (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">
          Enter a width and height of at least 2{unit === "mm" ? "50 mm" : '"'}
          {format === "standup" ? " and a gusset smaller than the pouch height" : ""} to
          generate the template.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={download} disabled={!valid} className="btn btn-primary" style={!valid ? { opacity: 0.5 } : undefined}>
          ⬇ Download SVG Template
        </button>
        <a href="/artwork-guidelines" className="btn btn-secondary">Artwork Guidelines</a>
        <a href="/#quote-form" className="btn btn-secondary">Request Production Die Line</a>
      </div>
      <Disclaimer>
        Planning template with seal zones, gusset fold, zipper track, and Safe Zone called out
        at correct proportions — so artwork accounts for every no-text area before design
        begins. Production die lines add machine-specific allowances and exact feature
        placement; request the production die line from your specialist before building final
        artwork.
      </Disclaimer>
    </div>
  );
}
