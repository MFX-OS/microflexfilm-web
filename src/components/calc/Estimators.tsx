"use client";

import { useState } from "react";
import { Field, Result, Disclaimer, inputStyle } from "./shared";

/* ---------------- Pouch size estimator ---------------- */

const POUCH_DENSITIES: Record<string, { d: number; label: string }> = {
  powder: { d: 0.55, label: "Powder (protein, drink mix)" },
  granular: { d: 0.75, label: "Granular (sugar, salt, seeds)" },
  coffee: { d: 0.4, label: "Whole bean coffee" },
  ground: { d: 0.45, label: "Ground coffee" },
  snacks: { d: 0.15, label: "Light snacks (chips, puffs)" },
  dense: { d: 0.85, label: "Dense pieces (candy, nuts, kibble)" },
  liquid: { d: 1.0, label: "Liquid / sauce" },
};

const POUCH_SIZES = [
  { name: '5×8 + 2.5" gusset', vol: 5 * 8 * 1.25 * 16.4 * 0.55 },
  { name: '6×9 + 3" gusset', vol: 6 * 9 * 1.5 * 16.4 * 0.55 },
  { name: '7×10 + 3.5" gusset', vol: 7 * 10 * 1.75 * 16.4 * 0.55 },
  { name: '8×12 + 4" gusset', vol: 8 * 12 * 2 * 16.4 * 0.55 },
  { name: '10×14 + 5" gusset', vol: 10 * 14 * 2.5 * 16.4 * 0.55 },
  { name: '12×16 + 6" gusset', vol: 12 * 16 * 3 * 16.4 * 0.55 },
];

export function PouchSizeCalc() {
  const [product, setProduct] = useState("powder");
  const [weightOz, setWeightOz] = useState("12");

  const oz = parseFloat(weightOz) || 0;
  const grams = oz * 28.35;
  const volumeMl = grams / POUCH_DENSITIES[product].d;
  const fit = POUCH_SIZES.find((s) => s.vol >= volumeMl);

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Product type">
          <select style={inputStyle} value={product} onChange={(e) => setProduct(e.target.value)}>
            {Object.entries(POUCH_DENSITIES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Fill weight (oz)">
          <input style={inputStyle} type="number" min="0" value={weightOz} onChange={(e) => setWeightOz(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="Estimated fill volume" value={volumeMl > 0 ? Math.round(volumeMl).toLocaleString() : "—"} unit="mL" />
        <Result label="Suggested stand-up pouch" value={fit ? fit.name : volumeMl > 0 ? "Custom size" : "—"} />
      </div>
      <Disclaimer>
        Estimates use typical bulk densities and standard fill efficiency. We confirm sizing with
        a physical fill test before production — always.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Rollstock estimator ---------------- */

export function RollstockCalc() {
  const [bagW, setBagW] = useState("6");
  const [bagH, setBagH] = useState("9");
  const [units, setUnits] = useState("50000");

  const w = parseFloat(bagW) || 0;
  const h = parseFloat(bagH) || 0;
  const n = parseInt(units) || 0;

  const webWidth = w > 0 ? 2 * w + 1 : 0;
  const repeat = h > 0 ? h + 0.75 : 0;
  const linealFeet = (repeat * n) / 12;
  const msi = (webWidth * repeat * n) / 1000;

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
      <Disclaimer>
        Pillow-bag (VFFS) layout with typical seal allowances — gusseted and quad formats differ.
        Final web specs ({msi > 0 ? `≈${Math.round(msi).toLocaleString()} MSI` : "—"}) are engineered
        to your exact machine.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Case & pallet ---------------- */

export function CaseCalc() {
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
  const pallets = unitsPerPallet > 0 ? tu / unitsPerPallet : 0;

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
      <Disclaimer>
        Quick logistics math for storage and freight planning. We can also design the case and
        pallet pattern itself — see Display &amp; Shipping Packaging.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Label & sleeve size ---------------- */

export function LabelSleeveCalc() {
  const [dia, setDia] = useState("2.5");
  const [height, setHeight] = useState("4");
  const [type, setType] = useState<"label" | "sleeve">("label");

  const d = parseFloat(dia) || 0;
  const h = parseFloat(height) || 0;
  const circ = Math.PI * d;

  // Wrap label: circumference + 0.25" overlap; height = straight wall height
  const labelW = circ + 0.25;
  // Shrink sleeve: layflat = half circumference + seam allowance; add ~5% shrink allowance on width
  const sleeveLayflat = (circ / 2) * 1.05 + 0.375;
  const sleeveCut = h + 0.5;

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="What are you sizing?">
          <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="label">Wrap label</option>
            <option value="sleeve">Shrink sleeve</option>
          </select>
        </Field>
        <Field label="Container diameter (in)">
          <input style={inputStyle} type="number" min="0" step="0.125" value={dia} onChange={(e) => setDia(e.target.value)} />
        </Field>
        <Field label={type === "label" ? "Straight-wall height (in)" : "Coverage height (in)"}>
          <input style={inputStyle} type="number" min="0" step="0.125" value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
      </div>
      {type === "label" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Result label="Label width (with overlap)" value={d > 0 ? labelW.toFixed(2) : "—"} unit="in" />
          <Result label="Max label height" value={h > 0 ? h.toFixed(2) : "—"} unit="in" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Result label="Sleeve layflat width" value={d > 0 ? sleeveLayflat.toFixed(2) : "—"} unit="in" />
          <Result label="Sleeve cut length" value={h > 0 ? sleeveCut.toFixed(2) : "—"} unit="in" />
        </div>
      )}
      <Disclaimer>
        Labels: width = circumference + 0.25″ overlap; keep height inside the straight wall.
        Sleeves: layflat ≈ half circumference + seam and shrink allowances — contoured containers
        and full-shrink applications are confirmed by our prepress team against your actual container.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Digital vs flexo break-even ---------------- */

export function BreakEvenCalc() {
  const [qty, setQty] = useState("25000");
  const [digitalCpu, setDigitalCpu] = useState("0.45");
  const [flexoCpu, setFlexoCpu] = useState("0.18");
  const [plates, setPlates] = useState("1800");

  const q = parseInt(qty) || 0;
  const dc = parseFloat(digitalCpu) || 0;
  const fc = parseFloat(flexoCpu) || 0;
  const p = parseFloat(plates) || 0;

  const digitalTotal = q * dc;
  const flexoTotal = q * fc + p;
  const crossover = dc > fc ? Math.ceil(p / (dc - fc)) : 0;
  const winner = q === 0 ? "—" : digitalTotal < flexoTotal ? "Digital" : digitalTotal > flexoTotal ? "Flexo" : "Tie";

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-4">
        <Field label="Run quantity">
          <input style={inputStyle} type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} />
        </Field>
        <Field label="Digital cost/unit ($)">
          <input style={inputStyle} type="number" min="0" step="0.01" value={digitalCpu} onChange={(e) => setDigitalCpu(e.target.value)} />
        </Field>
        <Field label="Flexo cost/unit ($)">
          <input style={inputStyle} type="number" min="0" step="0.01" value={flexoCpu} onChange={(e) => setFlexoCpu(e.target.value)} />
        </Field>
        <Field label="Plate cost ($)">
          <input style={inputStyle} type="number" min="0" value={plates} onChange={(e) => setPlates(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Result label="Digital total" value={q > 0 ? `$${Math.round(digitalTotal).toLocaleString()}` : "—"} />
        <Result label="Flexo total (incl. plates)" value={q > 0 ? `$${Math.round(flexoTotal).toLocaleString()}` : "—"} />
        <Result label="Break-even quantity" value={crossover > 0 ? crossover.toLocaleString() : "—"} unit="units" />
        <Result label="Cheaper at this qty" value={winner} />
      </div>
      <Disclaimer>
        Default numbers are illustrative — real pricing depends on size, structure, and colors.
        Edit any field with your actual quotes. The principle holds: digital wins below the
        break-even point, flexo wins above it. We&apos;ll quote both paths when your volume is near
        the line.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Sustainability savings ---------------- */

export function SustainabilityCalc() {
  const [unitsYear, setUnitsYear] = useState("100000");
  const [rigidG, setRigidG] = useState("30");
  const [pouchG, setPouchG] = useState("8");

  const u = parseInt(unitsYear) || 0;
  const r = parseFloat(rigidG) || 0;
  const p = parseFloat(pouchG) || 0;

  const savedKg = (u * Math.max(r - p, 0)) / 1000;
  const pct = r > 0 ? ((r - p) / r) * 100 : 0;
  const truckEquiv = savedKg / 9000; // rough: ~9 metric tons of packaging per truckload

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Units per year">
          <input style={inputStyle} type="number" min="0" value={unitsYear} onChange={(e) => setUnitsYear(e.target.value)} />
        </Field>
        <Field label="Current package weight (g)">
          <input style={inputStyle} type="number" min="0" value={rigidG} onChange={(e) => setRigidG(e.target.value)} />
        </Field>
        <Field label="Pouch weight (g)">
          <input style={inputStyle} type="number" min="0" value={pouchG} onChange={(e) => setPouchG(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Material saved / year" value={savedKg > 0 ? Math.round(savedKg).toLocaleString() : "—"} unit="kg" />
        <Result label="Package weight reduction" value={pct > 0 ? `${pct.toFixed(0)}%` : "—"} />
        <Result label="Freight equivalent" value={truckEquiv >= 0.1 ? `≈${truckEquiv.toFixed(1)} truckloads` : "—"} />
      </div>
      <Disclaimer>
        Typical reference points: a rigid plastic jar runs 25–60 g; an equivalent stand-up pouch
        6–15 g. Weigh your current package and a comparable pouch for real numbers — we&apos;ll provide
        pouch weights with your quote. Material reduction also compounds into freight, storage, and
        shelf-space savings not shown here.
      </Disclaimer>
    </div>
  );
}
