"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(2,5,9,0.6)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "12px 14px",
  color: "#f7fbff",
  fontSize: "14px",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Result({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{ border: "1px solid rgba(0,216,242,0.4)", background: "rgba(0,216,242,0.07)" }}
    >
      <div className="font-mono text-2xl font-black text-cyan md:text-3xl">
        {value}
        {unit && <span className="ml-1 text-base font-bold text-muted-light">{unit}</span>}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted">{label}</div>
    </div>
  );
}

/* ---------- Pouch size estimator ---------- */

function PouchSizeCalc() {
  const [product, setProduct] = useState("powder");
  const [weightOz, setWeightOz] = useState("12");

  // Approximate bulk densities (g/mL) by product type — estimation only.
  const densities: Record<string, { d: number; label: string }> = {
    powder: { d: 0.55, label: "Powder (protein, drink mix)" },
    granular: { d: 0.75, label: "Granular (sugar, salt, seeds)" },
    coffee: { d: 0.4, label: "Whole bean coffee" },
    ground: { d: 0.45, label: "Ground coffee" },
    snacks: { d: 0.15, label: "Light snacks (chips, puffs)" },
    dense: { d: 0.85, label: "Dense pieces (candy, nuts, kibble)" },
    liquid: { d: 1.0, label: "Liquid / sauce" },
  };

  const oz = parseFloat(weightOz) || 0;
  const grams = oz * 28.35;
  const volumeMl = grams / densities[product].d;
  // Usable pouch volume heuristic: W × H × (gusset/2) × fill efficiency ~0.55
  // Estimate a standup pouch: pick from common sizes.
  const sizes = [
    { name: '5×8 + 2.5" gusset', vol: 5 * 8 * 1.25 * 16.4 * 0.55 },
    { name: '6×9 + 3" gusset', vol: 6 * 9 * 1.5 * 16.4 * 0.55 },
    { name: '7×10 + 3.5" gusset', vol: 7 * 10 * 1.75 * 16.4 * 0.55 },
    { name: '8×12 + 4" gusset', vol: 8 * 12 * 2 * 16.4 * 0.55 },
    { name: '10×14 + 5" gusset', vol: 10 * 14 * 2.5 * 16.4 * 0.55 },
    { name: '12×16 + 6" gusset', vol: 12 * 16 * 3 * 16.4 * 0.55 },
  ];
  const fit = sizes.find((s) => s.vol >= volumeMl);

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Product type">
          <select style={inputStyle} value={product} onChange={(e) => setProduct(e.target.value)}>
            {Object.entries(densities).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Fill weight (oz)">
          <input
            style={inputStyle}
            type="number"
            min="0"
            value={weightOz}
            onChange={(e) => setWeightOz(e.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Estimated fill volume" value={volumeMl > 0 ? Math.round(volumeMl).toLocaleString() : "—"} unit="mL" />
        <Result label="Suggested stand-up pouch" value={fit ? fit.name : volumeMl > 0 ? "Custom size" : "—"} />
      </div>
      <p className="text-xs leading-relaxed text-muted-dark">
        Estimates use typical bulk densities and a standard fill efficiency — your product
        will vary. We always confirm sizing with a physical fill test before production.
      </p>
    </div>
  );
}

/* ---------- Rollstock estimator ---------- */

function RollstockCalc() {
  const [bagW, setBagW] = useState("6");
  const [bagH, setBagH] = useState("9");
  const [units, setUnits] = useState("50000");

  const w = parseFloat(bagW) || 0;
  const h = parseFloat(bagH) || 0;
  const n = parseInt(units) || 0;

  // Pillow bag on VFFS: web width ≈ 2×W + 1" overlap; repeat = H + ~0.75" seals
  const webWidth = w > 0 ? 2 * w + 1 : 0;
  const repeat = h > 0 ? h + 0.75 : 0;
  const linealFeet = (repeat * n) / 12;
  const msi = (webWidth * repeat * n) / 1000; // square inches / 1000

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Finished bag width (in)">
          <input style={inputStyle} type="number" min="0" value={bagW} onChange={(e) => setBagW(e.target.value)} />
        </Field>
        <Field label="Finished bag height (in)">
          <input style={inputStyle} type="number" min="0" value={bagH} onChange={(e) => setBagH(e.target.value)} />
        </Field>
        <Field label="Units needed">
          <input style={inputStyle} type="number" min="0" value={units} onChange={(e) => setUnits(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Approx. web width" value={webWidth > 0 ? webWidth.toFixed(2) : "—"} unit="in" />
        <Result label="Print repeat" value={repeat > 0 ? repeat.toFixed(2) : "—"} unit="in" />
        <Result label="Film required" value={linealFeet > 0 ? Math.round(linealFeet).toLocaleString() : "—"} unit="lineal ft" />
      </div>
      <p className="text-xs leading-relaxed text-muted-dark">
        Based on a standard pillow-bag layout (VFFS) with typical seal allowances — gusseted
        and quad formats differ. Final web specs are engineered to your exact machine; this
        estimate ({msi > 0 ? `≈${Math.round(msi).toLocaleString()} MSI` : "—"}) helps you
        ballpark material needs for quoting.
      </p>
    </div>
  );
}

/* ---------- Case / pallet estimator ---------- */

function CaseCalc() {
  const [unitsPerCase, setUnitsPerCase] = useState("24");
  const [casesPerLayer, setCasesPerLayer] = useState("10");
  const [layers, setLayers] = useState("5");
  const [totalUnits, setTotalUnits] = useState("50000");

  const upc = parseInt(unitsPerCase) || 0;
  const cpl = parseInt(casesPerLayer) || 0;
  const lyr = parseInt(layers) || 0;
  const tu = parseInt(totalUnits) || 0;

  const unitsPerPallet = upc * cpl * lyr;
  const cases = upc > 0 ? Math.ceil(tu / upc) : 0;
  const pallets = unitsPerPallet > 0 ? (tu / unitsPerPallet) : 0;

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-4">
        <Field label="Units per case">
          <input style={inputStyle} type="number" min="0" value={unitsPerCase} onChange={(e) => setUnitsPerCase(e.target.value)} />
        </Field>
        <Field label="Cases per layer">
          <input style={inputStyle} type="number" min="0" value={casesPerLayer} onChange={(e) => setCasesPerLayer(e.target.value)} />
        </Field>
        <Field label="Layers per pallet">
          <input style={inputStyle} type="number" min="0" value={layers} onChange={(e) => setLayers(e.target.value)} />
        </Field>
        <Field label="Total units">
          <input style={inputStyle} type="number" min="0" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Cases needed" value={cases > 0 ? cases.toLocaleString() : "—"} />
        <Result label="Units per pallet" value={unitsPerPallet > 0 ? unitsPerPallet.toLocaleString() : "—"} />
        <Result label="Pallets" value={pallets > 0 ? pallets.toFixed(1) : "—"} />
      </div>
      <p className="text-xs leading-relaxed text-muted-dark">
        Quick logistics math for planning storage and freight. We can also design the case
        and pallet pattern itself — see Display &amp; Shipping Packaging.
      </p>
    </div>
  );
}

/* ---------- Tabs wrapper ---------- */

const tabs = [
  { id: "pouch", label: "Pouch Size Estimator", comp: PouchSizeCalc },
  { id: "rollstock", label: "Rollstock Estimator", comp: RollstockCalc },
  { id: "pallet", label: "Case & Pallet Calculator", comp: CaseCalc },
];

export default function PackagingCalculators() {
  const [active, setActive] = useState("pouch");
  const ActiveComp = tabs.find((t) => t.id === active)!.comp;

  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className="rounded-full px-5 py-2.5 text-sm font-extrabold transition"
            style={{
              border: `1px solid ${t.id === active ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
              background:
                t.id === active
                  ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))"
                  : "rgba(255,255,255,0.03)",
              color: t.id === active ? "#34e3f5" : "#a9b9c8",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        className="rounded-4xl p-6 md:p-8"
        style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(255,255,255,0.035)" }}
      >
        <ActiveComp />
      </div>
    </div>
  );
}
