"use client";

import { useState } from "react";
import { Field, Result, Disclaimer, inputStyle } from "./shared";
import { MFX_LOGO_WHITE, MFX_LOGO_ASPECT } from "@/lib/brandLogoData";

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

type DielineType = {
  id: string;
  name: string;
  use: string;
  base: "panel" | "sleeve" | "web" | "lid";
  sealTop?: boolean;
  sealBottom?: boolean;
  sealSides?: boolean;
  bottomGusset?: boolean;
  sideGusset?: boolean;
  fin?: "fin" | "lap";
  header?: boolean;
  spoutDefault?: boolean;
  spoutOk?: boolean;
  cornerSeals?: boolean;
  zipperOk?: boolean;
  zipperDefault?: boolean;
  valveOk?: boolean;
  defaults: { w: number; h: number; g?: number };
  note?: string;
};

const DIELINE_TYPES: DielineType[] = [
  { id: "flat-pillow", name: "1 · Flat Pouch / Pillow Pouch", use: "Snacks, powders, single-use items", base: "panel", sealTop: true, sealBottom: true, fin: "fin", defaults: { w: 5, h: 7 } },
  { id: "three-side", name: "2 · 3-Side Seal Pouch", use: "Medical, food, powders, small parts", base: "panel", sealTop: true, sealSides: true, zipperOk: true, defaults: { w: 5, h: 7 } },
  { id: "four-side", name: "3 · 4-Side Seal Pouch", use: "Sachets, wipes, samples, medical packs", base: "panel", sealTop: true, sealBottom: true, sealSides: true, defaults: { w: 4, h: 5 } },
  { id: "fin-seal", name: "4 · Center Seal / Fin Seal Bag", use: "Flow-wrap snacks, bars, bakery items", base: "panel", sealTop: true, sealBottom: true, fin: "fin", defaults: { w: 5, h: 8 } },
  { id: "lap-seal", name: "5 · Lap Seal Bag", use: "Flow-wrap where the back seal overlaps", base: "panel", sealTop: true, sealBottom: true, fin: "lap", defaults: { w: 5, h: 8 } },
  { id: "standup", name: "6 · Stand-Up Pouch / Doypack", use: "Coffee, pet food, snacks, supplements", base: "panel", sealTop: true, sealSides: true, bottomGusset: true, zipperOk: true, valveOk: true, spoutOk: true, defaults: { w: 6, h: 9, g: 3 } },
  { id: "standup-zip", name: "7 · Stand-Up Pouch with Zipper", use: "Resealable food, powders, gummies", base: "panel", sealTop: true, sealSides: true, bottomGusset: true, zipperOk: true, zipperDefault: true, valveOk: true, spoutOk: true, defaults: { w: 6, h: 9, g: 3 } },
  { id: "standup-spout", name: "8 · Stand-Up Pouch with Spout", use: "Liquids, sauces, baby food, cleaners", base: "panel", sealTop: true, sealSides: true, bottomGusset: true, spoutOk: true, spoutDefault: true, defaults: { w: 5, h: 8, g: 2.5 } },
  { id: "bottom-gusset", name: "9 · Bottom Gusset Pouch", use: "Stand-up pouches with expanding base", base: "panel", sealTop: true, sealSides: true, bottomGusset: true, zipperOk: true, spoutOk: true, defaults: { w: 6, h: 9, g: 3 } },
  { id: "side-gusset", name: "10 · Side Gusset Bag", use: "Coffee, dry goods, bulk powders", base: "panel", sealTop: true, sealBottom: true, sideGusset: true, valveOk: true, defaults: { w: 5, h: 11, g: 3 } },
  { id: "quad-seal", name: "11 · Quad Seal Bag", use: "Premium coffee, pet food, protein powders", base: "panel", sealTop: true, sealSides: true, cornerSeals: true, bottomGusset: true, zipperOk: true, valveOk: true, defaults: { w: 6, h: 11, g: 3.5 } },
  { id: "flat-bottom", name: "12 · Flat Bottom / Box Pouch", use: "High-end coffee, snacks, pet food", base: "panel", sealTop: true, sealSides: true, cornerSeals: true, bottomGusset: true, zipperOk: true, zipperDefault: true, valveOk: true, defaults: { w: 6, h: 10, g: 3.5 } },
  { id: "stick-pack", name: "13 · Stick Pack", use: "Drink powders, supplements, sugar, electrolytes", base: "panel", sealTop: true, sealBottom: true, fin: "fin", defaults: { w: 1, h: 5.5 } },
  { id: "sachet", name: "14 · Sachet", use: "Single-dose powder or liquid samples", base: "panel", sealTop: true, sealBottom: true, sealSides: true, defaults: { w: 3, h: 4 } },
  { id: "shrink-sleeve", name: "15 · Shrink Sleeve Dieline", use: "Bottles, jars, cans, supplements", base: "sleeve", defaults: { w: 4.5, h: 6 } },
  { id: "rollstock", name: "16 · Rollstock / Form-Fill-Seal Film", use: "Automated packing machines", base: "web", defaults: { w: 13, h: 9.75 } },
  { id: "lidstock", name: "17 · Lidstock / Lidding Film", use: "Trays, cups, thermoformed packs", base: "lid", defaults: { w: 4, h: 4 } },
  { id: "flow-wrap", name: "18 · Flow Wrap Dieline", use: "Bars, baked goods, candies, wipes", base: "panel", sealTop: true, sealBottom: true, fin: "fin", defaults: { w: 3, h: 7 } },
  { id: "header-bag", name: "19 · Header Bag / Hang Hole Bag", use: "Retail peg display packaging", base: "panel", sealTop: true, sealBottom: true, sealSides: true, header: true, defaults: { w: 5, h: 8 } },
  { id: "die-cut", name: "20 · Custom Die-Cut Pouch", use: "Shaped pouches, promotional packaging", base: "panel", sealTop: true, sealSides: true, zipperOk: true, defaults: { w: 5, h: 8 }, note: "Custom shapes are engineered case by case — this rectangular planning canvas marks the zones; your specialist supplies the shaped production die line." },
];

const UNWINDS = ["Printed side out — top leads", "Printed side out — bottom leads", "Printed side in — top leads", "Printed side in — bottom leads"];

export function DieLineGenerator() {
  /* ===== Level 1 — core format ===== */
  const [typeId, setTypeId] = useState("standup-zip");
  const T = DIELINE_TYPES.find((t) => t.id === typeId)!;

  /* ===== Level 2 — structural variation ===== */
  const [zipperType, setZipperType] = useState<"none" | "standard" | "cr">("standard");
  const [tearNotch, setTearNotch] = useState(true);
  const [hangType, setHangType] = useState<"none" | "round" | "euro">("none");
  const [roundCorners, setRoundCorners] = useState(false);
  const [valve, setValve] = useState(false);
  const [spout, setSpout] = useState(false);
  const [windowType, setWindowType] = useState<"none" | "window" | "clear-panel">("none");
  const [laserScore, setLaserScore] = useState(false);
  const [easyPeel, setEasyPeel] = useState(false);
  const [tamper, setTamper] = useState(false);
  const [spotVarnish, setSpotVarnish] = useState(false);
  const [foil, setFoil] = useState(false);

  /* ===== Level 3 — production-specific ===== */
  const [unit, setUnit] = useState<"in" | "mm">("in");
  const [w, setW] = useState("6");
  const [h, setH] = useState("9");
  const [g, setG] = useState("3");
  const [sealW, setSealW] = useState(0.375);
  const [bleedIn, setBleedIn] = useState("0.125");
  const [safetyIn, setSafetyIn] = useState("0.125");
  const [fillDir, setFillDir] = useState<"top" | "bottom">("top");
  const [unwind, setUnwind] = useState(UNWINDS[0]);
  const [eyeMarkPos, setEyeMarkPos] = useState<"left" | "right">("left");
  const [artOrient, setArtOrient] = useState<"standard" | "back-inverted">("standard");
  const [outMode, setOutMode] = useState<"plan" | "approval">("plan");

  function pickType(id: string) {
    const t = DIELINE_TYPES.find((x) => x.id === id)!;
    setTypeId(id);
    const f = unit === "mm" ? 25.4 : 1;
    const r = (n: number) => (unit === "mm" ? String(Math.round(n * f)) : String(n));
    setW(r(t.defaults.w));
    setH(r(t.defaults.h));
    if (t.defaults.g) setG(r(t.defaults.g));
    setZipperType(t.zipperDefault ? "standard" : "none");
    setSpout(Boolean(t.spoutDefault));
    setValve(false);
    setHangType(t.header ? "round" : "none");
    setWindowType("none");
    setLaserScore(false);
    setEasyPeel(false);
    setTamper(false);
  }

  const toIn = (v: string) => {
    const n = parseFloat(v) || 0;
    return unit === "mm" ? n / 25.4 : n;
  };
  const W = toIn(w);
  const H = toIn(h);
  const needsG = T.bottomGusset || T.sideGusset;
  const G = needsG ? toIn(g) : 0;
  const bleed = Math.min(Math.max(parseFloat(bleedIn) || 0.125, 0.0625), 0.5);
  const safety = Math.min(Math.max(parseFloat(safetyIn) || 0.125, 0.0625), 0.5);
  const minDim = T.id === "stick-pack" ? 0.5 : 1.5;
  const valid = W >= minDim && H >= minDim && (!needsG || (G >= 0.5 && G < (T.sideGusset ? W * 2 : H)));

  const fmtDim = (inches: number) =>
    unit === "mm" ? `${Math.round(inches * 25.4)} mm` : `${inches}"`;

  const S = T.id === "stick-pack" ? 60 : 40;
  const pad = 64;
  const zipH = 0.35;
  const zipGap = 0.15;
  const headerH = 1.0;
  const titleH = 64 + 44; // brand band + spec line

  const zipOn = Boolean(T.zipperOk) && zipperType !== "none";
  const valveOn = Boolean(T.valveOk) && valve;
  const spoutOn = Boolean(T.spoutOk) && (spout || Boolean(T.spoutDefault));
  const hangOn = T.header || hangType !== "none";
  const isPanel = T.base === "panel";

  const bodyTop = T.header ? headerH : 0;
  const zipTop = bodyTop + sealW + zipGap + (tamper ? 0.18 : 0);
  const zipBottom = zipTop + zipH;
  const spoutClear = spoutOn ? 0.45 : 0;
  const scoreClear = laserScore ? 0.22 : 0;
  const safeTop = (zipOn ? zipBottom : bodyTop + (T.sealTop ? sealW : 0) + spoutClear + (tamper && !zipOn ? 0.18 : 0)) + scoreClear + safety;
  const gussetH = T.bottomGusset ? G / 2 : 0;
  const safeBottom = H - (T.bottomGusset ? gussetH : T.sealBottom ? sealW : 0) - safety;
  const sideInset = T.sideGusset ? G / 2 : T.sealSides ? sealW : 0;
  const safeLeft = sideInset + safety;
  const safeRight = W - sideInset - safety;

  /* ---- numbered legend ---- */
  const legendRows: { n: number; swatch: string; text: string }[] = [];
  const add = (swatch: string, text: string) =>
    legendRows.push({ n: legendRows.length + 1, swatch, text });
  if (T.base === "sleeve") {
    add("die", "Sleeve layflat cut size");
    add("seal", "Seam zone — no critical art across the seam");
    add("fold", "High-distortion bands — artwork stretches here when shrunk");
    add("safe", "Safe Zone — logos, text & barcodes in the low-distortion band");
  } else if (T.base === "web") {
    add("die", "Print repeat — one package per repeat");
    add("bleed", "Repeat boundaries — art tiles continuously");
    add("seal", `Eye mark (${eyeMarkPos} edge) — registration target, keep area clear`);
    add("safe", "Safe Zone — keep critical art inside the repeat");
  } else if (T.base === "lid") {
    add("die", "Lid die-cut edge");
    add("bleed", `Bleed — extend art ${fmtDim(bleed)} past the cut`);
    add("seal", easyPeel ? "Easy-peel flange seal ring — no text in the seal zone" : "Flange seal ring — no text in the seal zone");
    add("safe", "Safe Zone — keep all text, logos & barcodes inside");
  } else {
    add("die", roundCorners ? "Die line (cut edge, rounded corners)" : "Die line (cut edge)");
    add("bleed", `Bleed — extend background art ${fmtDim(bleed)} past the die line`);
    if (T.sealTop || T.sealBottom || T.sealSides || T.cornerSeals)
      add("seal", `${easyPeel ? "Easy-peel top seal · " : ""}${T.cornerSeals ? "Seal zones incl. corner seals" : "Seal zone"} — no text in the seal zone`);
    if (T.fin) add("fin", T.fin === "lap" ? "Lap seal on reverse — back overlap zone, plan wraparound art" : "Back fin seal on reverse — plan wraparound art");
    if (T.header) add("fold", "Header zone with perforation — peg display area");
    if (tamper) add("tamper", "Tamper-evident seal band");
    if (zipOn) add("zip", zipperType === "cr" ? "Child-resistant zipper — keep this band clear" : "Zipper track — keep this band clear");
    if (tearNotch && isPanel) add("feat", "Tear notches");
    if (laserScore) add("score", "Laser score — easy-open line, keep clear above Safe Zone");
    if (T.bottomGusset) add("fold", T.id === "flat-bottom" ? "Flat-bottom fold zone — no text in the gusset fold" : `Gusset fold (${fmtDim(G)} gusset) — no text in the gusset fold`);
    if (T.sideGusset) add("fold", `Side gusset folds (${fmtDim(G)} total) — no text across the folds`);
    if (spoutOn) add("feat", "Spout & cap location — keep area clear");
    if (windowType === "window") add("win", `Window — keep ${fmtDim(safety)} clearance inside the window edge`);
    if (windowType === "clear-panel") add("win", "Clear panel — unprinted band, plan art around it");
    add("safe", "Safe Zone — keep all text, logos & barcodes inside");
    if (hangOn && !T.header) add("feat", hangType === "euro" ? "Euro slot hang hole" : "Hang hole");
    if (valveOn) add("feat", "Degassing valve location");
    add("fill", `Fill direction — ${fillDir === "top" ? "top fill" : "bottom fill"}`);
  }
  const nFor = (sw: string) => legendRows.find((r) => r.swatch === sw)?.n ?? 0;
  const nForText = (txt: string) => legendRows.find((r) => r.text.includes(txt))?.n ?? 0;

  /* finish + production spec lines (don't draw, but ship with the template) */
  const finishNotes = [
    spotVarnish && "Spot varnish — supply varnish shapes as a separate named art layer",
    foil && "Foil / metalized layer — affects window clarity; confirm with materials team",
    artOrient === "back-inverted" && "Back panel artwork inverted (bottom-fill orientation)",
    T.base === "web" && `Unwind: ${unwind}`,
  ].filter(Boolean) as string[];

  const legendH = legendRows.length * 19 + finishNotes.length * 16 + 34;
  const svgW = Math.max(580, pad * 2 + W * S + 56);
  const svgH = titleH + pad + H * S + pad + legendH;

  function buildSvgBody(): string {
    const L = (ix: number) => pad + ix * S;
    const Tp = (iy: number) => titleH + pad + iy * S;
    const parts: string[] = [];
    const mark = (cx: number, cy: number, n: number) => {
      if (!n) return;
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="9" fill="white" stroke="#334155" stroke-width="1.3"/>` +
          `<text x="${cx}" y="${cy + 3.5}" text-anchor="middle" font-size="10" font-weight="bold" fill="#334155">${n}</text>`
      );
    };
    const seal = (x: number, y: number, sw: number, sh: number) =>
      parts.push(`<rect x="${x}" y="${y}" width="${sw}" height="${sh}" fill="url(#sealhatch)" stroke="#f59e0b" stroke-width="0.7" stroke-opacity="0.55"/>`);

    if (T.base === "sleeve") {
      const distH = H * 0.16;
      parts.push(`<rect x="${L(0)}" y="${Tp(0)}" width="${W * S}" height="${H * S}" fill="#ffffff" stroke="#e6007e" stroke-width="2.2"/>`);
      parts.push(`<rect x="${L(W - 0.375)}" y="${Tp(0)}" width="${0.375 * S}" height="${H * S}" fill="url(#sealhatch)" stroke="#f59e0b" stroke-width="0.7"/>`);
      parts.push(`<rect x="${L(0)}" y="${Tp(0)}" width="${W * S}" height="${distH * S}" fill="rgba(0,128,255,0.08)"/>`);
      parts.push(`<rect x="${L(0)}" y="${Tp(H - distH)}" width="${W * S}" height="${distH * S}" fill="rgba(0,128,255,0.08)"/>`);
      parts.push(`<rect x="${L(0.25)}" y="${Tp(distH + 0.15)}" width="${(W - 0.375 - 0.5) * S}" height="${(H - distH * 2 - 0.3) * S}" fill="rgba(100,116,139,0.045)" stroke="#64748b" stroke-width="1.1" stroke-dasharray="4 4"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${Tp(H / 2) + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="#94a3b8" letter-spacing="2">SAFE ZONE</text>`);
      mark(L(0), Tp(H * 0.5), nFor("die"));
      mark(L(W - 0.19), Tp(H * 0.3), nFor("seal"));
      mark(L(W * 0.5), Tp(distH / 2), nFor("fold"));
      mark(L(0.25) + 16, Tp(distH + 0.15) + 16, nFor("safe"));
    } else if (T.base === "web") {
      parts.push(`<rect x="${L(0)}" y="${Tp(0)}" width="${W * S}" height="${H * S}" fill="#ffffff" stroke="#e6007e" stroke-width="2"/>`);
      parts.push(`<line x1="${L(0)}" y1="${Tp(0)}" x2="${L(W)}" y2="${Tp(0)}" stroke="#00a0c0" stroke-width="1.4" stroke-dasharray="8 5"/>`);
      parts.push(`<line x1="${L(0)}" y1="${Tp(H)}" x2="${L(W)}" y2="${Tp(H)}" stroke="#00a0c0" stroke-width="1.4" stroke-dasharray="8 5"/>`);
      const emx = eyeMarkPos === "left" ? 0.15 : W - 0.65;
      parts.push(`<rect x="${L(emx)}" y="${Tp(H - 0.45)}" width="${0.5 * S}" height="${0.3 * S}" fill="#1f2937"/>`);
      parts.push(`<rect x="${L(0.5)}" y="${Tp(0.5)}" width="${(W - 1) * S}" height="${(H - 1.2) * S}" fill="rgba(100,116,139,0.045)" stroke="#64748b" stroke-width="1.1" stroke-dasharray="4 4"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${Tp(H / 2) + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="#94a3b8" letter-spacing="2">SAFE ZONE</text>`);
      mark(L(W * 0.5), Tp(0), nFor("bleed"));
      mark(L(W - 0.3), Tp(H * 0.5), nFor("die"));
      mark(L(emx) + (eyeMarkPos === "left" ? 42 : -22), Tp(H - 0.3), nFor("seal"));
      mark(L(0.5) + 16, Tp(0.5) + 16, nFor("safe"));
    } else if (T.base === "lid") {
      const r = 14;
      parts.push(`<rect x="${L(-bleed)}" y="${Tp(-bleed)}" width="${(W + bleed * 2) * S}" height="${(H + bleed * 2) * S}" rx="${r + 6}" fill="none" stroke="#00a0c0" stroke-width="1.2" stroke-dasharray="8 5"/>`);
      parts.push(`<rect x="${L(0)}" y="${Tp(0)}" width="${W * S}" height="${H * S}" rx="${r}" fill="#ffffff" stroke="#e6007e" stroke-width="2.2"/>`);
      parts.push(`<rect x="${L(0)}" y="${Tp(0)}" width="${W * S}" height="${H * S}" rx="${r}" fill="none" stroke="#f59e0b" stroke-width="${sealW * S}" stroke-opacity="0.35"/>`);
      const inset = sealW + safety;
      parts.push(`<rect x="${L(inset)}" y="${Tp(inset)}" width="${(W - inset * 2) * S}" height="${(H - inset * 2) * S}" rx="8" fill="rgba(100,116,139,0.045)" stroke="#64748b" stroke-width="1.1" stroke-dasharray="4 4"/>`);
      parts.push(`<text x="${L(W / 2)}" y="${Tp(H / 2) + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="#94a3b8" letter-spacing="2">SAFE ZONE</text>`);
      mark(L(W * 0.5), Tp(0), nFor("die"));
      mark(L(-bleed), Tp(H * 0.2), nFor("bleed"));
      mark(L(sealW / 2) + 4, Tp(H * 0.5), nFor("seal"));
      mark(L(inset) + 16, Tp(inset) + 16, nFor("safe"));
    } else {
      /* ---------- panel renderer ---------- */
      const rx = roundCorners ? 0.3 * S : 6;
      parts.push(`<rect x="${L(-bleed)}" y="${Tp(-bleed)}" width="${(W + bleed * 2) * S}" height="${(H + bleed * 2) * S}" rx="${rx + 5}" fill="none" stroke="#00a0c0" stroke-width="1.2" stroke-dasharray="8 5"/>`);
      parts.push(`<rect x="${L(0)}" y="${Tp(0)}" width="${W * S}" height="${H * S}" rx="${rx}" fill="#ffffff" stroke="#e6007e" stroke-width="2.2"/>`);

      if (T.header) {
        parts.push(`<rect x="${L(0)}" y="${Tp(0)}" width="${W * S}" height="${headerH * S}" fill="rgba(0,128,255,0.07)"/>`);
        parts.push(`<line x1="${L(0)}" y1="${Tp(headerH)}" x2="${L(W)}" y2="${Tp(headerH)}" stroke="#0080ff" stroke-width="1.4" stroke-dasharray="3 4"/>`);
      }

      const topSealY = bodyTop;
      if (T.sealTop && !spoutOn) seal(L(0), Tp(topSealY), W * S, sealW * S);
      if (spoutOn) {
        const sw2 = (W - 1.1) / 2;
        seal(L(0), Tp(topSealY), sw2 * S, sealW * S);
        seal(L(W - sw2), Tp(topSealY), sw2 * S, sealW * S);
        parts.push(`<rect x="${L(W / 2 - 0.25)}" y="${Tp(topSealY - 0.35)}" width="${0.5 * S}" height="${0.35 * S}" fill="none" stroke="#16a34a" stroke-width="1.5"/>`);
        parts.push(`<rect x="${L(W / 2 - 0.4)}" y="${Tp(topSealY)}" width="${0.8 * S}" height="${0.45 * S}" fill="rgba(22,163,74,0.08)" stroke="#16a34a" stroke-width="1.3" stroke-dasharray="4 3"/>`);
      }
      const bottomEdge = T.bottomGusset ? H - gussetH : H;
      if (T.sealBottom && !T.bottomGusset) seal(L(0), Tp(H - sealW), W * S, sealW * S);
      if (T.sealSides) {
        const sy = topSealY + (T.sealTop ? sealW : 0);
        const sh = bottomEdge - (T.sealBottom && !T.bottomGusset ? sealW : 0) - sy;
        seal(L(0), Tp(sy), sealW * S, sh * S);
        seal(L(W - sealW), Tp(sy), sealW * S, sh * S);
      }
      if (T.cornerSeals) {
        parts.push(`<line x1="${L(sealW)}" y1="${Tp(bodyTop)}" x2="${L(sealW)}" y2="${Tp(bottomEdge)}" stroke="#f59e0b" stroke-width="1.6"/>`);
        parts.push(`<line x1="${L(W - sealW)}" y1="${Tp(bodyTop)}" x2="${L(W - sealW)}" y2="${Tp(bottomEdge)}" stroke="#f59e0b" stroke-width="1.6"/>`);
      }
      if (T.sideGusset) {
        const gw = G / 2;
        parts.push(`<rect x="${L(0)}" y="${Tp(bodyTop)}" width="${gw * S}" height="${(bottomEdge - bodyTop) * S}" fill="rgba(0,128,255,0.07)"/>`);
        parts.push(`<rect x="${L(W - gw)}" y="${Tp(bodyTop)}" width="${gw * S}" height="${(bottomEdge - bodyTop) * S}" fill="rgba(0,128,255,0.07)"/>`);
        parts.push(`<line x1="${L(gw)}" y1="${Tp(bodyTop)}" x2="${L(gw)}" y2="${Tp(bottomEdge)}" stroke="#0080ff" stroke-width="1.4" stroke-dasharray="10 6"/>`);
        parts.push(`<line x1="${L(W - gw)}" y1="${Tp(bodyTop)}" x2="${L(W - gw)}" y2="${Tp(bottomEdge)}" stroke="#0080ff" stroke-width="1.4" stroke-dasharray="10 6"/>`);
      }
      if (T.bottomGusset) {
        parts.push(`<rect x="${L(0)}" y="${Tp(H - gussetH)}" width="${W * S}" height="${gussetH * S}" fill="rgba(0,128,255,0.08)"/>`);
        parts.push(`<line x1="${L(0)}" y1="${Tp(H - gussetH)}" x2="${L(W)}" y2="${Tp(H - gussetH)}" stroke="#0080ff" stroke-width="1.5" stroke-dasharray="10 6"/>`);
      }
      if (T.fin) {
        parts.push(`<line x1="${L(W / 2)}" y1="${Tp(bodyTop + (T.sealTop ? sealW : 0))}" x2="${L(W / 2)}" y2="${Tp(bottomEdge - (T.sealBottom ? sealW : 0))}" stroke="#9333ea" stroke-width="1.3" stroke-dasharray="${T.fin === "lap" ? "12 4" : "5 5"}"/>`);
      }

      // tamper-evident band
      if (tamper) {
        parts.push(`<rect x="${L(sideInset)}" y="${Tp(bodyTop + sealW + 0.02)}" width="${(W - sideInset * 2) * S}" height="${0.14 * S}" fill="rgba(220,38,38,0.12)" stroke="#dc2626" stroke-width="1"/>`);
      }

      // zipper
      if (zipOn) {
        const zStroke = zipperType === "cr" ? 2.2 : 1.3;
        parts.push(`<rect x="${L(sideInset)}" y="${Tp(zipTop)}" width="${(W - sideInset * 2) * S}" height="${zipH * S}" fill="rgba(124,58,237,0.10)" stroke="#7c3aed" stroke-width="${zStroke}"/>`);
        parts.push(`<line x1="${L(sideInset)}" y1="${Tp(zipTop + zipH / 2)}" x2="${L(W - sideInset)}" y2="${Tp(zipTop + zipH / 2)}" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3 3"/>`);
        if (zipperType === "cr")
          parts.push(`<text x="${L(W / 2)}" y="${Tp(zipTop + zipH / 2) + 3.5}" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#7c3aed">CR</text>`);
      }

      // laser score
      if (laserScore) {
        const scoreY = zipOn ? zipBottom + 0.12 : bodyTop + sealW + (tamper ? 0.2 : 0) + 0.18;
        parts.push(`<line x1="${L(sideInset)}" y1="${Tp(scoreY)}" x2="${L(W - sideInset)}" y2="${Tp(scoreY)}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="2 3"/>`);
      }

      // tear notches
      const notchY = zipOn ? zipTop - 0.06 : bodyTop + sealW + 0.2;
      if (tearNotch) {
        parts.push(`<path d="M ${L(0)} ${Tp(notchY) - 6} l 10 6 l -10 6 Z" fill="#16a34a"/>`);
        parts.push(`<path d="M ${L(W)} ${Tp(notchY) - 6} l -10 6 l 10 6 Z" fill="#16a34a"/>`);
      }

      // hang hole / euro slot
      const hangCy = T.header ? headerH / 2 : bodyTop + sealW / 2;
      if (hangOn) {
        if (hangType === "euro") {
          parts.push(`<rect x="${L(W / 2 - 0.45)}" y="${Tp(hangCy) - 0.09 * S}" width="${0.9 * S}" height="${0.18 * S}" rx="${0.09 * S}" fill="none" stroke="#16a34a" stroke-width="1.5"/>`);
        } else {
          parts.push(`<circle cx="${L(W / 2)}" cy="${Tp(hangCy)}" r="${0.125 * S}" fill="none" stroke="#16a34a" stroke-width="1.5"/>`);
        }
      }

      // valve
      const vx = L(W * 0.72), vy = Tp(safeTop + 0.5);
      if (valveOn) parts.push(`<circle cx="${vx}" cy="${vy}" r="${0.3 * S}" fill="none" stroke="#16a34a" stroke-width="1.3" stroke-dasharray="5 4"/>`);

      // window / clear panel
      if (windowType === "window" && safeBottom > safeTop + 1.2) {
        const ww = Math.min(1.6, (safeRight - safeLeft) * 0.5);
        const wh = Math.min(2.2, (safeBottom - safeTop) * 0.45);
        const wx = safeLeft + (safeRight - safeLeft - ww) / 2;
        const wy = safeTop + (safeBottom - safeTop) * 0.32;
        parts.push(`<rect x="${L(wx)}" y="${Tp(wy)}" width="${ww * S}" height="${wh * S}" rx="8" fill="rgba(56,189,248,0.10)" stroke="#0284c7" stroke-width="1.4" stroke-dasharray="6 4"/>`);
        mark(L(wx + ww / 2), Tp(wy), nFor("win"));
      }
      if (windowType === "clear-panel" && safeBottom > safeTop + 1) {
        const cy0 = safeTop + (safeBottom - safeTop) * 0.4;
        const ch = Math.min(1.4, (safeBottom - safeTop) * 0.3);
        parts.push(`<rect x="${L(0)}" y="${Tp(cy0)}" width="${W * S}" height="${ch * S}" fill="rgba(56,189,248,0.10)" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="6 4"/>`);
        mark(L(W * 0.85), Tp(cy0 + ch / 2), nFor("win"));
      }

      // safe zone
      if (safeBottom > safeTop && safeRight > safeLeft) {
        parts.push(`<rect x="${L(safeLeft)}" y="${Tp(safeTop)}" width="${(safeRight - safeLeft) * S}" height="${(safeBottom - safeTop) * S}" fill="rgba(100,116,139,0.045)" stroke="#64748b" stroke-width="1.1" stroke-dasharray="4 4"/>`);
        if ((safeRight - safeLeft) * S > 70)
          parts.push(`<text x="${L((safeLeft + safeRight) / 2)}" y="${Tp(safeTop) + 14}" text-anchor="middle" font-size="11" font-weight="bold" fill="#94a3b8" letter-spacing="2">SAFE ZONE</text>`);
      }

      // fill direction arrow
      const fy1 = fillDir === "top" ? Tp(-bleed) - 26 : Tp(H + bleed) + 34;
      const fy2 = fillDir === "top" ? Tp(-bleed) - 8 : Tp(H + bleed) + 16;
      parts.push(`<line x1="${L(W * 0.12)}" y1="${fy1}" x2="${L(W * 0.12)}" y2="${fy2}" stroke="#16a34a" stroke-width="1.6"/>`);
      const ah = fillDir === "top" ? fy2 : fy2;
      parts.push(`<path d="M ${L(W * 0.12) - 5} ${ah - (fillDir === "top" ? 7 : -7) * -1} l 5 ${fillDir === "top" ? 7 : -7} l 5 ${fillDir === "top" ? -7 : 7}" fill="none" stroke="#16a34a" stroke-width="1.6"/>`);
      mark(L(W * 0.12) + 18, (fy1 + fy2) / 2, nFor("fill"));

      // markers
      mark(L(W * 0.5) + (hangOn && !T.header ? 30 : 0), Tp(bodyTop), nFor("die"));
      mark(L(-bleed), Tp(H * 0.12), nFor("bleed"));
      if (T.sealSides) mark(L(W - sealW / 2), Tp(H * 0.42), nFor("seal"));
      else if (T.sealTop && !spoutOn) mark(L(W * 0.82), Tp(bodyTop + sealW / 2), nFor("seal"));
      if (T.fin) mark(L(W / 2), Tp(H * 0.62), nFor("fin"));
      if (T.header) mark(L(W * 0.82), Tp(headerH / 2), nFor("Header") || nForText("Header"));
      if (tamper) mark(L(W * 0.18), Tp(bodyTop + sealW + 0.09), nForText("Tamper"));
      if (zipOn) mark(L(W * 0.32), Tp(zipTop + zipH / 2), nFor("zip"));
      if (tearNotch) mark(L(0) - 18, Tp(notchY), nForText("Tear"));
      if (laserScore) mark(L(W * 0.68), Tp(zipOn ? zipBottom + 0.12 : bodyTop + sealW + 0.38), nFor("score"));
      if (T.bottomGusset) mark(L(W * 0.5), Tp(H - gussetH / 2), nForText("fold zone") || nForText("Gusset fold"));
      if (T.sideGusset) mark(L(G / 4), Tp(H * 0.5), nForText("Side gusset"));
      if (spoutOn) mark(L(W / 2) + 28, Tp(bodyTop + 0.2), nForText("Spout"));
      if (safeBottom > safeTop) mark(L(safeLeft) + 16, Tp(safeBottom) - 16, nFor("safe"));
      if (hangOn && !T.header) mark(L(W / 2) - 28, Tp(hangCy), nForText(hangType === "euro" ? "Euro" : "Hang"));
      if (valveOn) mark(vx, vy, nForText("Degassing"));
    }

    // dimensions
    const dy = Tp(H + bleed) + 20;
    parts.push(`<line x1="${L(0)}" y1="${dy}" x2="${L(W)}" y2="${dy}" stroke="#94a3b8" stroke-width="1"/>`);
    parts.push(`<line x1="${L(0)}" y1="${dy - 5}" x2="${L(0)}" y2="${dy + 5}" stroke="#94a3b8" stroke-width="1"/>`);
    parts.push(`<line x1="${L(W)}" y1="${dy - 5}" x2="${L(W)}" y2="${dy + 5}" stroke="#94a3b8" stroke-width="1"/>`);
    parts.push(`<text x="${L(W / 2)}" y="${dy + 15}" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">${T.base === "web" ? "web width " : ""}${fmtDim(W)}</text>`);
    const dx = L(W + bleed) + 20;
    parts.push(`<line x1="${dx}" y1="${Tp(0)}" x2="${dx}" y2="${Tp(H)}" stroke="#94a3b8" stroke-width="1"/>`);
    parts.push(`<line x1="${dx - 5}" y1="${Tp(0)}" x2="${dx + 5}" y2="${Tp(0)}" stroke="#94a3b8" stroke-width="1"/>`);
    parts.push(`<line x1="${dx - 5}" y1="${Tp(H)}" x2="${dx + 5}" y2="${Tp(H)}" stroke="#94a3b8" stroke-width="1"/>`);
    parts.push(`<text x="${dx + 14}" y="${Tp(H / 2)}" font-size="11" font-weight="bold" fill="#334155" transform="rotate(90 ${dx + 14} ${Tp(H / 2)})" text-anchor="middle">${T.base === "web" ? "repeat " : ""}${fmtDim(H)}</text>`);

    return parts.join("\n  ");
  }

  const swatchFor = (row: { swatch: string }) => {
    switch (row.swatch) {
      case "die": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#e6007e" stroke-width="2.2"/>`;
      case "bleed": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#00a0c0" stroke-width="1.4" stroke-dasharray="7 4"/>`;
      case "seal": return `<rect x="0" y="-6" width="24" height="12" fill="url(#sealhatch)" stroke="#f59e0b" stroke-width="0.7"/>`;
      case "zip": return `<rect x="0" y="-6" width="24" height="12" fill="rgba(124,58,237,0.12)" stroke="#7c3aed" stroke-width="1.2"/>`;
      case "fin": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#9333ea" stroke-width="1.4" stroke-dasharray="5 4"/>`;
      case "fold": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#0080ff" stroke-width="1.5" stroke-dasharray="8 5"/>`;
      case "safe": return `<rect x="0" y="-6" width="24" height="12" fill="rgba(100,116,139,0.06)" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3"/>`;
      case "win": return `<rect x="0" y="-6" width="24" height="12" rx="3" fill="rgba(56,189,248,0.12)" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      case "score": return `<line x1="0" y1="0" x2="24" y2="0" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="2 3"/>`;
      case "tamper": return `<rect x="0" y="-5" width="24" height="10" fill="rgba(220,38,38,0.12)" stroke="#dc2626" stroke-width="1"/>`;
      case "fill": return `<path d="M 8 -6 l 0 12 M 3 1 l 5 5 l 5 -5" fill="none" stroke="#16a34a" stroke-width="1.5"/>`;
      default: return `<circle cx="12" cy="0" r="5.5" fill="none" stroke="#16a34a" stroke-width="1.4"/>`;
    }
  };
  // Layout: put the legend beside narrow drawings (stick packs etc.) to use the space
  const sideLegend = W * S <= 300 && T.base !== "web";
  const legendContentH = legendRows.length * 19 + finishNotes.length * 16 + 10;
  const LEGEND_W = 380;
  const bandH = 64;
  const footH = 46;
  const specY = bandH + 24;
  const drawTop = bandH + 44; // replaces titleH spacing inside builders via titleH constant
  const planW = sideLegend
    ? Math.max(660, pad + W * S + 70 + LEGEND_W + 40)
    : Math.max(620, pad * 2 + W * S + 56);
  const planH = sideLegend
    ? drawTop + Math.max(pad + H * S + pad + 40, legendContentH + 60) + footH
    : drawTop + pad + H * S + pad + legendContentH + 26 + footH;
  const legendX = sideLegend ? pad + W * S + 86 : pad - bleed * S;
  const legendYpos = sideLegend ? drawTop + 24 : drawTop + pad + H * S + pad - 8;

  const brandBand = `
  <rect width="${planW}" height="${bandH}" fill="#061421"/>
  <rect x="0" y="${bandH - 3}" width="${planW}" height="3" fill="#00d8f2"/>
  <image href="${MFX_LOGO_WHITE}" x="${pad - bleed * S}" y="${(bandH - 40) / 2}" height="40" width="${40 * MFX_LOGO_ASPECT}" preserveAspectRatio="xMinYMid meet"/>
  <text x="${planW - 28}" y="${bandH / 2 + 1}" text-anchor="end" font-size="12" font-weight="bold" fill="#00d8f2" letter-spacing="3">DIELINE PLANNING TEMPLATE</text>
  <text x="${planW - 28}" y="${bandH / 2 + 17}" text-anchor="end" font-size="8.5" fill="#7fa6bd" letter-spacing="1.5">GENERATED AT MICROFLEXFILM.COM/CALCULATORS</text>`;

  const brandFoot = `
  <line x1="${pad - bleed * S}" y1="${planH - footH + 6}" x2="${planW - 28}" y2="${planH - footH + 6}" stroke="#00d8f2" stroke-width="1.4"/>
  <text x="${pad - bleed * S}" y="${planH - footH + 24}" font-size="10" font-weight="bold" fill="#06121d">microflexfilm.com · info@microflexfilm.com · 909.360.9066</text>
  <text x="${planW - 28}" y="${planH - footH + 24}" text-anchor="end" font-size="10" font-style="italic" fill="#0087a8">Flexible Packaging. Engineered to Perform.</text>
  <text x="${pad - bleed * S}" y="${planH - footH + 38}" font-size="8.5" fill="#94a3b8">Planning reference only — request the production die line from your Microflex specialist before final artwork.</text>`;

  const legendSvg = legendRows
    .map(
      (row, i) =>
        `<g transform="translate(0, ${i * 19})">` +
        `<circle cx="8" cy="0" r="8" fill="white" stroke="#334155" stroke-width="1.1"/>` +
        `<text x="8" y="3" text-anchor="middle" font-size="9" font-weight="bold" fill="#334155">${row.n}</text>` +
        `<g transform="translate(26, 0)">${swatchFor(row)}</g>` +
        `<text x="60" y="3.5" font-size="10.5" fill="#334155">${row.text}</text></g>`
    )
    .join("\n  ") +
    finishNotes
      .map(
        (t, i) =>
          `<g transform="translate(0, ${legendRows.length * 19 + 8 + i * 16})"><text x="0" y="3.5" font-size="9.5" font-style="italic" fill="#64748b">• ${t}</text></g>`
      )
      .join("\n  ");

  const specLine = `${T.name.split("·")[1]?.trim() ?? T.name} · ${fmtDim(W)} × ${fmtDim(H)}${needsG ? ` + ${fmtDim(G)} gusset` : ""}${isPanel || T.base === "lid" ? ` · ${SEAL_WIDTHS.find((x) => x.v === sealW)?.label ?? ""}` : ""} · bleed ${fmtDim(bleed)} · safe ${fmtDim(safety)}`;


  /* ===== Final Approval Sheet (production-style download) ===== */
  const TYPE_CODES: Record<string, string> = {
    "flat-pillow": "PIL", "three-side": "3SS", "four-side": "4SS", "fin-seal": "FIN",
    "lap-seal": "LAP", standup: "SUP", "standup-zip": "SUP", "standup-spout": "SUP",
    "bottom-gusset": "BGP", "side-gusset": "SGB", "quad-seal": "QSB", "flat-bottom": "FBP",
    "stick-pack": "STK", sachet: "SCH", "shrink-sleeve": "SLV", rollstock: "RST",
    lidstock: "LID", "flow-wrap": "FLW", "header-bag": "HDR", "die-cut": "DCT",
  };
  const trim0 = (n: number) => String(parseFloat(n.toFixed(3)));
  const dielineId = `MFX-${TYPE_CODES[T.id] ?? "PKG"}-${trim0(W)}x${trim0(H)}${needsG ? `-G${trim0(G)}` : ""}${zipOn ? (zipperType === "cr" ? "-CRZ" : "-ZIP") : ""}${spoutOn ? "-SPT" : ""}-v001`;
  const fmtA = (inches: number) => (unit === "mm" ? `${Math.round(inches * 25.4)} mm` : `${inches.toFixed(3)}"`);

  function buildApprovalSheet(): string {
    // Aspect-aware scale: narrow formats (stick packs) get a larger px/in so
    // panels stay readable; wide/tall formats are capped to fit the sheet.
    let AS = Math.max(46, 200 / Math.max(W, 0.5));
    AS = Math.min(AS, 480 / Math.max(W, 0.5), 760 / Math.max(H, 1));
    AS = Math.max(AS, 20);
    const panelPx = W * AS;
    const narrow = panelPx < 185;
    const PY = 150;
    const FX = 120;
    const BX = FX + panelPx + 170;
    const RX = BX + panelPx + 170;
    const colW = 400;
    const panelBottom = PY + H * AS;
    const AW = Math.max(RX + colW + 60, 1380);
    const AH = Math.max(panelBottom + 300, PY + 760);
    const p: string[] = [];

    const sealFill = "rgba(248,180,180,0.55)";
    const sealFillDark = "rgba(240,140,140,0.65)";

    function panel(x0: number, label: string, isBack: boolean) {
      const L = (ix: number) => x0 + ix * AS;
      const Ty = (iy: number) => PY + iy * AS;
      // bleed
      p.push(`<rect x="${L(-bleed)}" y="${Ty(-bleed)}" width="${(W + bleed * 2) * AS}" height="${(H + bleed * 2) * AS}" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="10 6"/>`);
      // cut
      p.push(`<rect x="${L(0)}" y="${Ty(0)}" width="${W * AS}" height="${H * AS}" fill="white" stroke="#111111" stroke-width="2.6"/>`);
      // seals — top, sides; corners darker
      p.push(`<rect x="${L(0)}" y="${Ty(0)}" width="${W * AS}" height="${sealW * AS}" fill="${sealFill}"/>`);
      const sideH = (T.bottomGusset ? H - gussetH : H) - sealW;
      if (T.sealSides) {
        p.push(`<rect x="${L(0)}" y="${Ty(sealW)}" width="${sealW * AS}" height="${sideH * AS}" fill="${sealFill}"/>`);
        p.push(`<rect x="${L(W - sealW)}" y="${Ty(sealW)}" width="${sealW * AS}" height="${sideH * AS}" fill="${sealFill}"/>`);
        p.push(`<rect x="${L(0)}" y="${Ty(0)}" width="${sealW * AS}" height="${sealW * AS}" fill="${sealFillDark}"/>`);
        p.push(`<rect x="${L(W - sealW)}" y="${Ty(0)}" width="${sealW * AS}" height="${sealW * AS}" fill="${sealFillDark}"/>`);
      }
      if (T.sealBottom && !T.bottomGusset) p.push(`<rect x="${L(0)}" y="${Ty(H - sealW)}" width="${W * AS}" height="${sealW * AS}" fill="${sealFill}"/>`);
      // gusset zone
      if (T.bottomGusset) {
        p.push(`<rect x="${L(0)}" y="${Ty(H - gussetH)}" width="${W * AS}" height="${gussetH * AS}" fill="${sealFill}"/>`);
        p.push(`<line x1="${L(0)}" y1="${Ty(H - gussetH)}" x2="${L(W)}" y2="${Ty(H - gussetH)}" stroke="#9333ea" stroke-width="2" stroke-dasharray="12 7"/>`);
        if (panelPx >= 280) p.push(`<text x="${L(W / 2)}" y="${Ty(H - gussetH) - 6}" text-anchor="middle" font-size="11" fill="#16a34a" letter-spacing="1">··· BOTTOM GUSSET FOLD / HALF GUSSET AREA — ${fmtA(gussetH)} ···</text>`);
      }
      // hang slot (optional)
      if (hangOn) {
        p.push(`<rect x="${L(W / 2 - 0.45)}" y="${Ty(sealW * 0.18)}" width="${0.9 * AS}" height="${0.16 * AS}" rx="${0.08 * AS}" fill="none" stroke="#6b7280" stroke-width="1.4"/>`);
        if (!narrow) p.push(`<text x="${L(W / 2)}" y="${Ty(sealW * 0.18) - 5}" text-anchor="middle" font-size="10" fill="#6b7280" letter-spacing="1">OPTIONAL HANG SLOT</text>`);
      }
      // top seal callout — pill inside when it fits, leader label above when narrow
      if (!narrow) {
        p.push(`<rect x="${L(W / 2) - 64}" y="${Ty(sealW / 2) - 1}" width="128" height="20" rx="9" fill="white" stroke="#111" stroke-width="1.2"/>`);
        p.push(`<text x="${L(W / 2)}" y="${Ty(sealW / 2) + 13}" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#111">TOP SEAL ${fmtA(sealW)}</text>`);
      } else {
        p.push(`<text x="${L(W / 2)}" y="${Ty(-bleed) - 26}" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#111">TOP SEAL ${fmtA(sealW)}</text>`);
        p.push(`<line x1="${L(W / 2)}" y1="${Ty(-bleed) - 20}" x2="${L(W / 2)}" y2="${Ty(sealW / 2)}" stroke="#111" stroke-width="1"/>`);
      }
      // tear notches
      if (tearNotch) {
        p.push(`<path d="M ${L(0)} ${Ty(notchPosA) - 8} l 13 8 l -13 8 Z" fill="#dc2626"/>`);
        p.push(`<path d="M ${L(W)} ${Ty(notchPosA) - 8} l -13 8 l 13 8 Z" fill="#dc2626"/>`);
        if (!narrow) p.push(`<text x="${L(W / 2)}" y="${Ty(notchPosA) - 12}" text-anchor="middle" font-size="11" font-weight="bold" fill="#dc2626" letter-spacing="1">TEAR NOTCHES</text>`);
      }
      // zipper
      if (zipOn) {
        p.push(`<rect x="${L(sealW + 0.1)}" y="${Ty(zipTop)}" width="${(W - (sealW + 0.1) * 2) * AS}" height="${zipH * AS}" fill="none" stroke="#f59e0b" stroke-width="2.4"/>`);
        if (!narrow) p.push(`<text x="${L(W / 2)}" y="${Ty(zipTop + zipH / 2) + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="#f59e0b" letter-spacing="2">ZIPPER AREA${zipperType === "cr" ? " (CHILD-RESISTANT)" : ""}</text>`);
      }
      // safe zone
      const sB = T.bottomGusset ? H - gussetH - safety : safeBottom;
      p.push(`<rect x="${L(safeLeft)}" y="${Ty(safeTop)}" width="${(safeRight - safeLeft) * AS}" height="${(sB - safeTop) * AS}" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="2 5"/>`);
      // panel center text — rotated single line on narrow formats
      const cy = Ty((safeTop + sB) / 2);
      if (narrow) {
        p.push(`<text x="${L(W / 2) + 5}" y="${cy}" text-anchor="middle" font-size="13" font-weight="bold" fill="#1f2937" letter-spacing="1.5" transform="rotate(-90 ${L(W / 2) + 5} ${cy})">${label} — ${fmtA(W)} W × ${fmtA(H)} H</text>`);
      } else {
        p.push(`<text x="${L(W / 2)}" y="${cy - 26}" text-anchor="middle" font-size="24" font-weight="bold" fill="#1f2937" letter-spacing="2">${label}</text>`);
        p.push(`<text x="${L(W / 2)}" y="${cy + 6}" text-anchor="middle" font-size="13" fill="#374151" letter-spacing="1">FINISHED PANEL</text>`);
        p.push(`<text x="${L(W / 2)}" y="${cy + 26}" text-anchor="middle" font-size="13" fill="#374151">${fmtA(W)} W × ${fmtA(H)} H</text>`);
      }
      // side seal labels
      if (T.sealSides && sealW * AS >= 13 && H * AS >= 200) {
        const sy = Ty(H * 0.55);
        p.push(`<text x="${L(sealW / 2)}" y="${sy}" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#7f1d1d" transform="rotate(-90 ${L(sealW / 2)} ${sy})">SIDE SEAL ${fmtA(sealW)}</text>`);
        p.push(`<text x="${L(W - sealW / 2)}" y="${sy}" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#7f1d1d" transform="rotate(-90 ${L(W - sealW / 2)} ${sy})">SIDE SEAL ${fmtA(sealW)}</text>`);
      }
      // width dim
      const dyy = panelBottom + 34;
      p.push(`<line x1="${L(0)}" y1="${dyy}" x2="${L(W)}" y2="${dyy}" stroke="#111" stroke-width="1.4" marker-start="url(#arrL)" marker-end="url(#arrR)"/>`);
      p.push(`<text x="${L(W / 2)}" y="${dyy + 18}" text-anchor="middle" font-size="12" font-weight="bold" fill="#111">FINISHED WIDTH ${fmtA(W)}</text>`);
      // height dim
      const dxx = x0 - 36;
      p.push(`<line x1="${dxx}" y1="${Ty(0)}" x2="${dxx}" y2="${Ty(H)}" stroke="#111" stroke-width="1.4" marker-start="url(#arrU)" marker-end="url(#arrD)"/>`);
      p.push(`<text x="${dxx - 8}" y="${Ty(H / 2)}" text-anchor="middle" font-size="11" font-weight="bold" fill="#111" transform="rotate(-90 ${dxx - 8} ${Ty(H / 2)})">FINISHED HEIGHT ${fmtA(H)}</text>`);
      // eye mark on back
      if (isBack) {
        p.push(`<rect x="${L(W) + 10}" y="${Ty(H * 0.62)}" width="20" height="56" fill="#111"/>`);
        p.push(`<line x1="${L(W)}" y1="${Ty(H * 0.62) + 28}" x2="${L(W) + 10}" y2="${Ty(H * 0.62) + 28}" stroke="#111" stroke-width="1.4"/>`);
        p.push(`<text x="${L(W) + 38}" y="${Ty(H * 0.62) + 24}" font-size="11" font-weight="bold" fill="#111">EYE MARK /</text>`);
        p.push(`<text x="${L(W) + 38}" y="${Ty(H * 0.62) + 38}" font-size="11" font-weight="bold" fill="#111">REGISTRATION</text>`);
      }
    }
    const notchPosA = zipOn ? zipTop - 0.12 : sealW + 0.22;

    panel(FX, "FRONT PANEL", false);
    panel(BX, "BACK PANEL", true);

    /* right column */
    let ry = PY + 10;
    if (T.bottomGusset) {
      p.push(`<text x="${RX}" y="${ry}" font-size="17" font-weight="bold" fill="#111">BOTTOM GUSSET DETAIL</text>`);
      ry += 22;
      const gh = 110;
      p.push(`<rect x="${RX - 8}" y="${ry - 8}" width="${colW + 16}" height="${gh + 16}" fill="none" stroke="#2563eb" stroke-width="1.6" stroke-dasharray="9 6"/>`);
      p.push(`<rect x="${RX}" y="${ry}" width="${colW}" height="${gh}" fill="white" stroke="#111" stroke-width="2.2"/>`);
      p.push(`<line x1="${RX}" y1="${ry + gh / 2 - 8}" x2="${RX + colW}" y2="${ry + gh / 2 - 8}" stroke="#9333ea" stroke-width="2" stroke-dasharray="12 7"/>`);
      p.push(`<text x="${RX + colW / 2}" y="${ry + gh / 2 - 16}" text-anchor="middle" font-size="11" fill="#9333ea" letter-spacing="2">CENTER FOLD</text>`);
      p.push(`<text x="${RX + colW / 2}" y="${ry + gh / 2 + 22}" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#111">TOTAL GUSSET DEPTH ${fmtA(G)}</text>`);
      p.push(`<text x="${RX + colW / 2}" y="${ry + gh / 2 + 40}" text-anchor="middle" font-size="11" fill="#374151">${fmtA(G / 2)} FRONT HALF + ${fmtA(G / 2)} BACK HALF</text>`);
      const gdy = ry + gh + 30;
      p.push(`<line x1="${RX}" y1="${gdy}" x2="${RX + colW}" y2="${gdy}" stroke="#111" stroke-width="1.4" marker-start="url(#arrL)" marker-end="url(#arrR)"/>`);
      p.push(`<text x="${RX + colW / 2}" y="${gdy + 18}" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#111">GUSSET DEPTH ${fmtA(G)}</text>`);
      ry = gdy + 50;
    }
    /* layer legend */
    p.push(`<text x="${RX}" y="${ry}" font-size="17" font-weight="bold" fill="#111">LAYER LEGEND</text>`);
    ry += 26;
    const lg: [string, string][] = [
      [`<line x1="0" y1="0" x2="34" y2="0" stroke="#111" stroke-width="2.6"/>`, "CUT LINE / TRIM"],
      [`<line x1="0" y1="0" x2="34" y2="0" stroke="#2563eb" stroke-width="2" stroke-dasharray="9 5"/>`, `BLEED ${fmtA(bleed)}`],
      [`<line x1="0" y1="0" x2="34" y2="0" stroke="#16a34a" stroke-width="2" stroke-dasharray="2 5"/>`, `SAFE ZONE ${fmtA(safety)}`],
      [`<rect x="0" y="-7" width="34" height="14" fill="${sealFill}"/>`, "SEAL AREA — no critical text"],
      [`<line x1="0" y1="0" x2="34" y2="0" stroke="#9333ea" stroke-width="2" stroke-dasharray="12 7"/>`, "FOLD / GUSSET LINE"],
    ];
    if (zipOn) lg.push([`<line x1="0" y1="0" x2="34" y2="0" stroke="#f59e0b" stroke-width="2.6"/>`, "ZIPPER AREA"]);
    if (tearNotch) lg.push([`<line x1="0" y1="0" x2="34" y2="0" stroke="#dc2626" stroke-width="2.6"/>`, "TEAR NOTCH"]);
    lg.push([`<rect x="10" y="-7" width="12" height="14" fill="#111"/>`, "EYE MARK / REGISTRATION"]);
    lg.forEach(([sw, label], i) => {
      p.push(`<g transform="translate(${RX}, ${ry + i * 27})">${sw}<text x="48" y="4" font-size="12" fill="#111" letter-spacing="0.5">${label}</text></g>`);
    });
    ry += lg.length * 27 + 36;
    /* approval notes */
    const notesH = 96;
    p.push(`<rect x="${RX - 8}" y="${ry}" width="${colW + 16}" height="${notesH}" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.4"/>`);
    p.push(`<text x="${RX + 8}" y="${ry + 24}" font-size="13" font-weight="bold" fill="#111">FINAL APPROVAL NOTES</text>`);
    p.push(`<text x="${RX + 8}" y="${ry + 44}" font-size="10.5" fill="#334155">APPROVAL CHECK: confirm finished size, zipper, notch location,</text>`);
    p.push(`<text x="${RX + 8}" y="${ry + 59}" font-size="10.5" fill="#334155">seal zones, gusset, bleed, safe zone, eye mark need, and</text>`);
    p.push(`<text x="${RX + 8}" y="${ry + 74}" font-size="10.5" fill="#334155">artwork placement before release.</text>`);

    /* approval block (bottom left) */
    let ay = panelBottom + 86;
    p.push(`<text x="${FX - 40}" y="${ay}" font-size="16" font-weight="bold" fill="#111">APPROVAL BLOCK</text>`);
    ay += 14;
    ["Customer / Brand:", "SKU / Product:", "Approved By:", "Date:", "Version:"].forEach((label, i) => {
      const yy = ay + i * 27 + 14;
      p.push(`<text x="${FX - 40}" y="${yy}" font-size="12" fill="#111">${label}</text>`);
      p.push(`<line x1="${FX + 90}" y1="${yy + 3}" x2="${FX + 470}" y2="${yy + 3}" stroke="#94a3b8" stroke-width="1"/>`);
    });

    /* header + id + footer */
    const head = `
  <text x="${FX - 40}" y="56" font-size="${AW < 1500 ? 24 : 30}" font-weight="bold" fill="#111" letter-spacing="0.5">FINAL APPROVAL DIELINE — ${(T.name.split("·")[1] ?? T.name).trim().toUpperCase()}</text>
  <text x="${FX - 40}" y="82" font-size="13" fill="#374151">Production-ready approval layout: ${fmtA(W)} W × ${fmtA(H)} H${needsG ? `, ${fmtA(G)} bottom gusset` : ""}${zipOn ? ", zipper" : ""}${tearNotch ? ", tear notches" : ""}, bleed, safe zone, seal areas</text>
  <rect x="${AW - 330}" y="34" width="280" height="46" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.4"/>
  <text x="${AW - 318}" y="53" font-size="11" font-weight="bold" fill="#111">MFX DIELINE ID</text>
  <text x="${AW - 318}" y="70" font-size="12" font-family="monospace" fill="#111">${dielineId}</text>`;
    const footer = `<text x="${FX - 40}" y="${AH - 18}" font-size="11.5" fill="#111">Production rule: all critical artwork must remain inside the safe zone and outside seal/fold/zipper/notch areas. Dieline layers should remain vector, named, and locked before customer proofing.</text>`;

    const TOPB = 48;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${AW} ${AH + TOPB}" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <marker id="arrL" markerWidth="10" markerHeight="10" refX="2" refY="3" orient="auto"><path d="M8 0 L2 3 L8 6" fill="none" stroke="#111" stroke-width="1.4"/></marker>
    <marker id="arrR" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#111" stroke-width="1.4"/></marker>
    <marker id="arrU" markerWidth="10" markerHeight="10" refX="3" refY="2" orient="auto"><path d="M0 8 L3 2 L6 8" fill="none" stroke="#111" stroke-width="1.4"/></marker>
    <marker id="arrD" markerWidth="10" markerHeight="10" refX="3" refY="6" orient="auto"><path d="M0 0 L3 6 L6 0" fill="none" stroke="#111" stroke-width="1.4"/></marker>
  </defs>
  <rect width="${AW}" height="${AH + TOPB}" fill="white"/>
  <rect width="${AW}" height="${TOPB}" fill="#061421"/>
  <rect y="${TOPB - 3}" width="${AW}" height="3" fill="#00d8f2"/>
  <image href="${MFX_LOGO_WHITE}" x="${FX - 40}" y="${(TOPB - 32) / 2}" height="32" width="${32 * MFX_LOGO_ASPECT}" preserveAspectRatio="xMinYMid meet"/>
  <text x="${AW - 40}" y="${TOPB / 2 + 5}" text-anchor="end" font-size="10" font-weight="bold" fill="#00d8f2" letter-spacing="2">MICROFLEXFILM.COM · 909.360.9066</text>
  <g transform="translate(0, ${TOPB})">${head}
  ${p.join("\n  ")}
  ${footer}
  </g>
</svg>`;
  }

  
  const planningSvg = valid
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${planW} ${planH}" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <pattern id="sealhatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="rgba(245,158,11,0.09)"/>
      <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(245,158,11,0.5)" stroke-width="1.3"/>
    </pattern>
  </defs>
  <rect width="${planW}" height="${planH}" fill="white"/>${brandBand}
  <text x="${pad - bleed * S}" y="${specY}" font-size="11.5" font-weight="bold" fill="#06121d">${specLine}</text>
  ${buildSvgBody()}
  <g transform="translate(${legendX}, ${legendYpos})">
  ${sideLegend ? `<text x="0" y="-6" font-size="10" font-weight="bold" fill="#0087a8" letter-spacing="2">LEGEND</text><g transform="translate(0, 14)">${legendSvg}</g>` : legendSvg}
  </g>${brandFoot}
</svg>`
    : "";

  const approvalAvailable = isPanel;
  const svg = outMode === "approval" && approvalAvailable && valid ? buildApprovalSheet() : planningSvg;

  function download() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      outMode === "approval" && approvalAvailable
        ? `${dielineId}-approval.svg`
        : `microflex-dieline-${T.id}-${w}x${h}${unit}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const toggle = (label: string, value: boolean, set: (v: boolean) => void, enabled = true) =>
    enabled ? (
      <button
        key={label}
        type="button"
        onClick={() => set(!value)}
        className="flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition"
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
    ) : null;

  const LevelHead = ({ n, title, hint }: { n: string; title: string; hint: string }) => (
    <div className="flex flex-wrap items-baseline gap-3">
      <span className="kicker text-[10px]">Level {n}</span>
      <span className="text-sm font-black text-paper">{title}</span>
      <span className="text-xs text-muted-dark">{hint}</span>
    </div>
  );

  return (
    <div className="grid gap-6">
      {/* ===== LEVEL 1 ===== */}
      <div className="grid gap-3">
        <LevelHead n="1" title="Core Package Format" hint="the dieline family" />
        <div className="grid gap-4 sm:grid-cols-[1.4fr,1fr]">
          <select style={inputStyle} value={typeId} onChange={(e) => pickType(e.target.value)}>
            {DIELINE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <div
            className="rounded-2xl px-4 py-3"
            style={{ border: "1px solid rgba(0,216,242,0.2)", background: "rgba(0,216,242,0.04)" }}
          >
            <span className="kicker mr-2 text-[10px]">Common use</span>
            <span className="text-sm text-muted-light">{T.use}</span>
          </div>
        </div>
        {T.note && (
          <p className="rounded-xl p-3 text-xs leading-relaxed text-muted" style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(255,255,255,0.03)" }}>
            {T.note}
          </p>
        )}
      </div>

      {/* ===== LEVEL 2 ===== */}
      {isPanel && (
        <div className="grid gap-3">
          <LevelHead n="2" title="Structural Variation" hint="features that create dieline versions" />
          <div className="flex flex-wrap items-center gap-2">
            {T.zipperOk && (
              <select
                style={{ ...inputStyle, width: "auto", padding: "8px 12px", fontSize: 12 }}
                value={zipperType}
                onChange={(e) => setZipperType(e.target.value as typeof zipperType)}
              >
                <option value="none">No zipper</option>
                <option value="standard">Zipper</option>
                <option value="cr">Child-resistant zipper</option>
              </select>
            )}
            {!T.header && (
              <select
                style={{ ...inputStyle, width: "auto", padding: "8px 12px", fontSize: 12 }}
                value={hangType}
                onChange={(e) => setHangType(e.target.value as typeof hangType)}
              >
                <option value="none">No hang hole</option>
                <option value="round">Round hang hole</option>
                <option value="euro">Euro slot</option>
              </select>
            )}
            <select
              style={{ ...inputStyle, width: "auto", padding: "8px 12px", fontSize: 12 }}
              value={windowType}
              onChange={(e) => setWindowType(e.target.value as typeof windowType)}
            >
              <option value="none">No window</option>
              <option value="window">Registered window</option>
              <option value="clear-panel">Clear panel</option>
            </select>
            {toggle("Tear notches", tearNotch, setTearNotch)}
            {toggle("Round corners", roundCorners, setRoundCorners)}
            {toggle("Spout", spout || Boolean(T.spoutDefault), setSpout, Boolean(T.spoutOk) && !T.spoutDefault)}
            {toggle("Valve", valve, setValve, Boolean(T.valveOk))}
            {toggle("Laser score", laserScore, setLaserScore)}
            {toggle("Easy-peel seal", easyPeel, setEasyPeel)}
            {toggle("Tamper-evident", tamper, setTamper)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-dark">Material flags:</span>
            {toggle("Spot varnish", spotVarnish, setSpotVarnish)}
            {toggle("Foil / metalized", foil, setFoil)}
          </div>
        </div>
      )}

      {/* ===== LEVEL 3 ===== */}
      <div className="grid gap-3">
        <LevelHead n="3" title="Production-Specific Version" hint="exact dimensions & press details" />
        <div className="flex flex-wrap items-center gap-2">
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
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Field label={`${T.base === "web" ? "Web width" : T.base === "sleeve" ? "Layflat width" : "Width"} (${unit})`}>
            <input style={inputStyle} type="number" min="0" step={unit === "mm" ? 5 : 0.25} value={w} onChange={(e) => setW(e.target.value)} />
          </Field>
          <Field label={`${T.base === "web" ? "Repeat" : T.base === "sleeve" ? "Cut length" : "Height"} (${unit})`}>
            <input style={inputStyle} type="number" min="0" step={unit === "mm" ? 5 : 0.25} value={h} onChange={(e) => setH(e.target.value)} />
          </Field>
          {needsG && (
            <Field label={`${T.sideGusset ? "Side gusset" : "Gusset depth"} (${unit})`}>
              <input style={inputStyle} type="number" min="0" step={unit === "mm" ? 5 : 0.25} value={g} onChange={(e) => setG(e.target.value)} />
            </Field>
          )}
          {(isPanel || T.base === "lid") && (
            <Field label="Seal size">
              <select style={inputStyle} value={sealW} onChange={(e) => setSealW(parseFloat(e.target.value))}>
                {SEAL_WIDTHS.map((x) => (
                  <option key={x.v} value={x.v}>{x.label}</option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Bleed (in)">
            <input style={inputStyle} type="number" min="0.0625" max="0.5" step="0.0625" value={bleedIn} onChange={(e) => setBleedIn(e.target.value)} />
          </Field>
          <Field label="Safe zone inset (in)">
            <input style={inputStyle} type="number" min="0.0625" max="0.5" step="0.0625" value={safetyIn} onChange={(e) => setSafetyIn(e.target.value)} />
          </Field>
          {isPanel && (
            <Field label="Machine fill direction">
              <select style={inputStyle} value={fillDir} onChange={(e) => setFillDir(e.target.value as typeof fillDir)}>
                <option value="top">Top fill</option>
                <option value="bottom">Bottom fill</option>
              </select>
            </Field>
          )}
          {isPanel && (
            <Field label="Front/back art orientation">
              <select style={inputStyle} value={artOrient} onChange={(e) => setArtOrient(e.target.value as typeof artOrient)}>
                <option value="standard">Same orientation</option>
                <option value="back-inverted">Back inverted</option>
              </select>
            </Field>
          )}
          {T.base === "web" && (
            <>
              <Field label="Unwind direction">
                <select style={inputStyle} value={unwind} onChange={(e) => setUnwind(e.target.value)}>
                  {UNWINDS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </Field>
              <Field label="Eye mark location">
                <select style={inputStyle} value={eyeMarkPos} onChange={(e) => setEyeMarkPos(e.target.value as typeof eyeMarkPos)}>
                  <option value="left">Left edge</option>
                  <option value="right">Right edge</option>
                </select>
              </Field>
            </>
          )}
        </div>
      </div>

      {/* Output mode */}
      {approvalAvailable && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-dark">Output:</span>
          {(
            [
              ["plan", "Planning Template"],
              ["approval", "Final Approval Sheet"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setOutMode(id)}
              className="rounded-full px-4 py-2 text-xs font-extrabold transition"
              style={{
                border: `1px solid ${outMode === id ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
                background: outMode === id ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
                color: outMode === id ? "#34e3f5" : "#a9b9c8",
              }}
            >
              {label}
            </button>
          ))}
          {outMode === "approval" && (
            <span className="font-mono text-[11px] text-muted">ID: {dielineId}</span>
          )}
        </div>
      )}

      {valid ? (
        <div className="overflow-x-auto rounded-2xl bg-white p-2" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      ) : (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">
          Enter valid dimensions{needsG ? " (gusset must be smaller than the pouch)" : ""} to
          generate the template.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={download} disabled={!valid} className="btn btn-primary" style={!valid ? { opacity: 0.5 } : undefined}>
          ⬇ {outMode === "approval" && approvalAvailable ? "Download Approval Sheet" : "Download SVG Template"}
        </button>
        <a href="/artwork-guidelines" className="btn btn-secondary">Artwork Guidelines</a>
        <a href="/#quote-form" className="btn btn-secondary">Request Production Die Line</a>
      </div>
      <Disclaimer>
        One core format multiplies into many dieline versions — Level 1 picks the family,
        Level 2 adds the structural features (zipper, notch, window, spout, score, and more),
        and Level 3 pins the production-specific numbers: exact size, seal width, bleed, Safe
        Zone, fill direction, unwind, and registration. Production die lines confirm machine
        compatibility — request one from your specialist before final artwork.
      </Disclaimer>
    </div>
  );
}
