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

  const S = 40;
  const bleed = 0.125;
  const safety = 0.125;
  const pad = 64;
  const zipH = 0.35;
  const zipGap = 0.15;
  const panelW = W * S;
  const panelGap = 44;
  const titleH = 54;

  const zipTop = sealW + zipGap;
  const zipBottom = zipTop + zipH;
  const safeTop = (zipper ? zipBottom : sealW) + safety;
  const safeBottom = H - (format === "standup" ? G / 2 : sealW) - safety;
  const safeLeft = sealW + safety;
  const safeRight = W - sealW - safety;

  /* Numbered legend — words live here, not on the drawing */
  const legendRows: { n: number; swatch: string; text: string }[] = [];
  let nCount = 0;
  const add = (swatch: string, text: string) => {
    nCount += 1;
    legendRows.push({ n: nCount, swatch, text });
  };
  add("die", "Die line (cut edge)");
  add("bleed", 'Bleed — extend background art 0.125" past the die line');
  add("seal", "Seal zone — no text in the seal zone");
  if (zipper) add("zip", "Zipper track — keep this band clear");
  if (tearNotch) add("feat", "Tear notches");
  if (format === "standup") add("fold", "Gusset fold — no text in the gusset fold");
  add("safe", "Safe Zone — keep all text, logos & barcodes inside");
  if (hangHole) add("feat", "Hang hole");
  if (valve) add("feat", "Degassing valve location");

  const nFor = (swatch: string) => legendRows.find((r) => r.swatch === swatch)?.n ?? 0;

  const legendH = legendRows.length * 19 + 26;
  const panels = backPanel ? 2 : 1;
  const svgW = Math.max(560, pad * 2 + panelW * panels + (backPanel ? panelGap : 0) + 56);
  const svgH = titleH + pad + H * S + pad + legendH;

  function panelSvg(x0: number, label: string, withDims: boolean): string {
    const L = (ix: number) => x0 + ix * S;
    const T = (iy: number) => titleH + pad + iy * S;
    const parts: string[] = [];

    const mark = (cx: number, cy: number, n: number) =>
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="9" fill="white" stroke="#334155" stroke-width="1.3"/>` +
        `<text x="${cx}" y="${cy + 3.5}" text-anchor="middle" font-size="10" font-weight="bold" fill="#334155">${n}</text>`
      );

    // Bleed
    parts.push(`<rect x="${L(-bleed)}" y="${T(-bleed)}" width="${(W + bleed * 2) * S}" height="${(H + bleed * 2) * S}" rx="10" fill="none" stroke="#00a0c0" stroke-width="1.2" stroke-dasharray="8 5"/>`);
    // Die line
    parts.push(`<rect x="${L(0)}" y="${T(0)}" width="${W * S}" height="${H * S}" rx="6" fill="#ffffff" stroke="#e6007e" stroke-width="2.2"/>`);

    // Seal zones (hatch only — words in legend)
    const seal = (x: number, y: number, sw: number, sh: number) =>
      parts.push(`<rect x="${x}" y="${y}" width="${sw}" height="${sh}" fill="url(#sealhatch)" stroke="#f59e0b" stroke-width="0.7" stroke-opacity="0.55"/>`);
    seal(L(0), T(0), W * S, sealW * S);
    const sideSealH = (H - sealW - (format === "standup" ? G / 2 : sealW)) * S;
    seal(L(0), T(sealW), sealW * S, sideSealH);
    seal(L(W - sealW), T(sealW), sealW * S, sideSealH);
    if (format === "flat") seal(L(0), T(H - sealW), W * S, sealW * S);

    // Gusset fold zone
    if (format === "standup") {
      parts.push(`<rect x="${L(0)}" y="${T(H - G / 2)}" width="${W * S}" height="${(G / 2) * S}" fill="rgba(0,128,255,0.08)"/>`);
      parts.push(`<line x1="${L(0)}" y1="${T(H - G / 2)}" x2="${L(W)}" y2="${T(H - G / 2)}" stroke="#0080ff" stroke-width="1.5" stroke-dasharray="10 6"/>`);
    }

    // Zipper
    if (zipper) {
      parts.push(`<rect x="${L(sealW)}" y="${T(zipTop)}" width="${(W - sealW * 2) * S}" height="${zipH * S}" fill="rgba(124,58,237,0.10)" stroke="#7c3aed" stroke-width="1.3"/>`);
      parts.push(`<line x1="${L(sealW)}" y1="${T(zipTop + zipH / 2)}" x2="${L(W - sealW)}" y2="${T(zipTop + zipH / 2)}" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3 3"/>`);
    }

    // Tear notches
    const notchY = zipper ? zipTop - 0.06 : sealW + 0.2;
    if (tearNotch) {
      parts.push(`<path d="M ${L(0)} ${T(notchY) - 6} l 10 6 l -10 6 Z" fill="#16a34a"/>`);
      parts.push(`<path d="M ${L(W)} ${T(notchY) - 6} l -10 6 l 10 6 Z" fill="#16a34a"/>`);
    }

    // Hang hole
    if (hangHole) {
      parts.push(`<circle cx="${L(W / 2)}" cy="${T(sealW / 2)}" r="${0.125 * S}" fill="none" stroke="#16a34a" stroke-width="1.5"/>`);
    }

    // Valve
    const vx = L(W * 0.74), vy = T(safeTop + 0.55);
    if (valve) {
      parts.push(`<circle cx="${vx}" cy="${vy}" r="${0.32 * S}" fill="none" stroke="#16a34a" stroke-width="1.3" stroke-dasharray="5 4"/>`);
    }

    // Safe Zone — single quiet label
    if (safeBottom > safeTop && safeRight > safeLeft) {
      parts.push(`<rect x="${L(safeLeft)}" y="${T(safeTop)}" width="${(safeRight - safeLeft) * S}" height="${(safeBottom - safeTop) * S}" fill="rgba(100,116,139,0.045)" stroke="#64748b" stroke-width="1.1" stroke-dasharray="4 4"/>`);
      parts.push(`<text x="${L((safeLeft + safeRight) / 2)}" y="${T((safeTop + safeBottom) / 2) + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="#94a3b8" letter-spacing="2">SAFE ZONE</text>`);
    }

    // Numbered markers (drawing references → legend)
    mark(L(W * 0.5) + (hangHole ? 26 : 0), T(0), nFor("die"));
    mark(L(-bleed), T(H * 0.12), nFor("bleed"));
    mark(L(W - sealW / 2), T(H * 0.4), nFor("seal"));
    if (zipper) mark(L(W * 0.5), T(zipTop + zipH / 2), nFor("zip"));
    if (tearNotch) mark(L(0) - 18, T(notchY), nFor("feat"));
    if (format === "standup") mark(L(W * 0.5), T(H - G / 4), nFor("fold"));
    if (safeBottom > safeTop) mark(L(safeLeft) + 16, T(safeTop) + 16, nFor("safe"));
    if (hangHole) mark(L(W / 2) - 24, T(sealW / 2), legendRows.find((r) => r.text === "Hang hole")?.n ?? 0);
    if (valve) mark(vx, vy, legendRows.find((r) => r.text === "Degassing valve location")?.n ?? 0);

    // Panel label
    parts.push(`<text x="${L(W / 2)}" y="${T(-bleed) - 10}" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155" letter-spacing="1.5">${label}</text>`);

    // Dimensions
    if (withDims) {
      const dy = T(H + bleed) + 20;
      parts.push(`<line x1="${L(0)}" y1="${dy}" x2="${L(W)}" y2="${dy}" stroke="#94a3b8" stroke-width="1"/>`);
      parts.push(`<line x1="${L(0)}" y1="${dy - 5}" x2="${L(0)}" y2="${dy + 5}" stroke="#94a3b8" stroke-width="1"/>`);
      parts.push(`<line x1="${L(W)}" y1="${dy - 5}" x2="${L(W)}" y2="${dy + 5}" stroke="#94a3b8" stroke-width="1"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${dy + 15}" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">${fmtDim(W)}</text>`);
      const dx = L(W + bleed) + 20;
      parts.push(`<line x1="${dx}" y1="${T(0)}" x2="${dx}" y2="${T(H)}" stroke="#94a3b8" stroke-width="1"/>`);
      parts.push(`<line x1="${dx - 5}" y1="${T(0)}" x2="${dx + 5}" y2="${T(0)}" stroke="#94a3b8" stroke-width="1"/>`);
      parts.push(`<line x1="${dx - 5}" y1="${T(H)}" x2="${dx + 5}" y2="${T(H)}" stroke="#94a3b8" stroke-width="1"/>`);
      parts.push(`<text x="${dx + 14}" y="${T(H / 2)}" font-size="11" font-weight="bold" fill="#334155" transform="rotate(90 ${dx + 14} ${T(H / 2)})" text-anchor="middle">${fmtDim(H)}</text>`);
    }

    return parts.join("\n  ");
  }

  // Legend (single clean column, numbered)
  const swatchFor = (row: { swatch: string }) => {
    switch (row.swatch) {
      case "die": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#e6007e" stroke-width="2.2"/>`;
      case "bleed": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#00a0c0" stroke-width="1.4" stroke-dasharray="7 4"/>`;
      case "seal": return `<rect x="0" y="-6" width="24" height="12" fill="url(#sealhatch)" stroke="#f59e0b" stroke-width="0.7"/>`;
      case "zip": return `<rect x="0" y="-6" width="24" height="12" fill="rgba(124,58,237,0.12)" stroke="#7c3aed" stroke-width="1.2"/>`;
      case "fold": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#0080ff" stroke-width="1.5" stroke-dasharray="8 5"/>`;
      case "safe": return `<rect x="0" y="-6" width="24" height="12" fill="rgba(100,116,139,0.06)" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3"/>`;
      default: return `<circle cx="12" cy="0" r="5.5" fill="none" stroke="#16a34a" stroke-width="1.4"/>`;
    }
  };
  const legendY = titleH + pad + H * S + pad - 8;
  const legendSvg = legendRows
    .map(
      (row, i) =>
        `<g transform="translate(0, ${i * 19})">` +
        `<circle cx="8" cy="0" r="8" fill="white" stroke="#334155" stroke-width="1.1"/>` +
        `<text x="8" y="3" text-anchor="middle" font-size="9" font-weight="bold" fill="#334155">${row.n}</text>` +
        `<g transform="translate(26, 0)">${swatchFor(row)}</g>` +
        `<text x="60" y="3.5" font-size="10.5" fill="#334155">${row.text}</text></g>`
    )
    .join("\n  ");

  const specLine = `${format === "standup" ? "Stand-Up Pouch" : "Flat 3-Side-Seal Pouch"} · ${fmtDim(W)} × ${fmtDim(H)}${format === "standup" ? ` + ${fmtDim(G)} gusset` : ""} · ${SEAL_WIDTHS.find((x) => x.v === sealW)?.label ?? ""}`;

  const svg = valid
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <pattern id="sealhatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="rgba(245,158,11,0.09)"/>
      <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(245,158,11,0.5)" stroke-width="1.3"/>
    </pattern>
  </defs>
  <rect width="${svgW}" height="${svgH}" fill="white"/>
  <text x="${svgW / 2}" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">MICROFLEX PLANNING TEMPLATE</text>
  <text x="${svgW / 2}" y="41" text-anchor="middle" font-size="10.5" fill="#475569">${specLine}</text>
  ${panelSvg(pad, "FRONT PANEL", true)}
  ${backPanel ? panelSvg(pad + panelW + panelGap + 40, "BACK PANEL", false) : ""}
  <g transform="translate(${pad - bleed * S}, ${legendY})">
  ${legendSvg}
  </g>
  <text x="${svgW / 2}" y="${svgH - 8}" text-anchor="middle" font-size="9" fill="#94a3b8">Planning reference only — request the production die line before final artwork · microflexfilm.com/artwork-guidelines</text>
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

  const toggle = (label: string, value: boolean, set: (v: boolean) => void) => (
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
        Numbered callouts keep the drawing clean — every zone is explained in the legend
        below it. Seal zones and the gusset fold are no-text areas; the Safe Zone holds all
        text, logos, and barcodes. Production die lines add machine-specific allowances and
        exact feature placement — request one from your specialist before final artwork.
      </Disclaimer>
    </div>
  );
}
