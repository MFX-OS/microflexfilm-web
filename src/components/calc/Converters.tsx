"use client";

import { useState } from "react";
import { Field, Result, Disclaimer, inputStyle } from "./shared";

/* ---------------- Universal film thickness converter ----------------
   Base unit: mil. Standard physical conversions:
   1 mil = 0.001 inch = 0.0254 mm = 25.4 micron; plastic-film gauge = mil x 100 */

const UNITS = [
  { id: "micron", label: "Micron (µm)", toMil: (v: number) => v / 25.4 },
  { id: "mil", label: "Mil", toMil: (v: number) => v },
  { id: "gauge", label: "Gauge", toMil: (v: number) => v / 100 },
  { id: "mm", label: "Millimeter", toMil: (v: number) => v / 0.0254 },
  { id: "inch", label: "Inch", toMil: (v: number) => v * 1000 },
];

export function ThicknessConverter() {
  const [value, setValue] = useState("75");
  const [unit, setUnit] = useState("micron");

  const v = parseFloat(value) || 0;
  const mil = UNITS.find((u) => u.id === unit)!.toMil(v);

  const out = {
    micron: mil * 25.4,
    mil,
    gauge: mil * 100,
    mm: mil * 0.0254,
    inch: mil / 1000,
  };

  const fmt = (n: number, d = 4) =>
    n === 0 ? "0" : n.toLocaleString("en-US", { maximumFractionDigits: d });

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Thickness value">
          <input style={inputStyle} type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="Input unit">
          <select style={inputStyle} value={unit} onChange={(e) => setUnit(e.target.value)}>
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Result label="Micron" value={fmt(out.micron, 2)} />
        <Result label="Mil" value={fmt(out.mil, 3)} />
        <Result label="Gauge" value={fmt(out.gauge, 1)} />
        <Result label="mm" value={fmt(out.mm, 4)} />
        <Result label="Inch" value={fmt(out.inch, 5)} />
      </div>
      <Disclaimer>
        Standard film conversions: 1 mil = 25.4 µm = 0.0254 mm = 0.001″; plastic-film gauge = mil × 100.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Thickness reference chart (computed) ---------------- */

const CHART_GAUGES = [20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 300, 350, 400, 450, 500, 550];

export function ThicknessChart() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            {["Gauge", "Mil", "Micron", "Millimeter", "Inch"].map((h) => (
              <th key={h} className="kicker px-3 py-2 text-[10px]" style={{ borderBottom: "1px solid rgba(0,216,242,0.3)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CHART_GAUGES.map((g) => {
            const mil = g / 100;
            return (
              <tr key={g} className="text-muted-light">
                <td className="px-3 py-2 font-mono font-bold text-cyan" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{g}</td>
                <td className="px-3 py-2 font-mono" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{mil.toFixed(2)}</td>
                <td className="px-3 py-2 font-mono" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{(mil * 25.4).toFixed(2)}</td>
                <td className="px-3 py-2 font-mono" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{(mil * 0.0254).toFixed(4)}</td>
                <td className="px-3 py-2 font-mono" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{(mil / 1000).toFixed(4)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Disclaimer>
        Typical film references: snack bags often run 2.0–3.5 mil laminations; heavy-duty pouches 4–6 mil.
        Your final gauge is engineered to product weight, barrier needs, and equipment.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Fill weight / volume converter ---------------- */

const DENSITIES = [
  { id: "water", label: "Liquid — water-like (sauces, beverages)", d: 1.0 },
  { id: "oil", label: "Liquid — oil-based", d: 0.92 },
  { id: "powder", label: "Powder (protein, drink mix)", d: 0.55 },
  { id: "flour", label: "Flour / baking mix", d: 0.6 },
  { id: "granular", label: "Granular (sugar, salt, seeds)", d: 0.75 },
  { id: "coffee-bean", label: "Whole bean coffee", d: 0.4 },
  { id: "coffee-ground", label: "Ground coffee", d: 0.45 },
  { id: "snack", label: "Light snacks (chips, puffs)", d: 0.15 },
  { id: "dense", label: "Dense pieces (candy, nuts, kibble)", d: 0.85 },
];

export function WeightVolumeConverter() {
  const [mode, setMode] = useState<"oz" | "g" | "floz" | "ml">("oz");
  const [value, setValue] = useState("12");
  const [density, setDensity] = useState("powder");

  const v = parseFloat(value) || 0;
  const d = DENSITIES.find((x) => x.id === density)!.d;

  // normalize to grams
  let grams = 0;
  if (mode === "oz") grams = v * 28.3495;
  if (mode === "g") grams = v;
  if (mode === "floz") grams = v * 29.5735 * d;
  if (mode === "ml") grams = v * d;

  const ml = grams / d;

  const fmt = (n: number) => (n > 0 ? n.toLocaleString("en-US", { maximumFractionDigits: 1 }) : "—");

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Value">
          <input style={inputStyle} type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="Input unit">
          <select style={inputStyle} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            <option value="oz">Ounces (weight)</option>
            <option value="g">Grams</option>
            <option value="floz">Fluid ounces (volume)</option>
            <option value="ml">Milliliters</option>
          </select>
        </Field>
        <Field label="Product type (density)">
          <select style={inputStyle} value={density} onChange={(e) => setDensity(e.target.value)}>
            {DENSITIES.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Result label="Ounces" value={fmt(grams / 28.3495)} unit="oz" />
        <Result label="Grams" value={fmt(grams)} unit="g" />
        <Result label="Fluid oz" value={fmt(ml / 29.5735)} unit="fl oz" />
        <Result label="Milliliters" value={fmt(ml)} unit="mL" />
      </div>
      <Disclaimer>
        Weight↔volume conversion depends on bulk density — these presets are typical values.
        Your product&apos;s actual density is confirmed with a fill test before sizing is final.
      </Disclaimer>
    </div>
  );
}

/* ---------------- Quote / cost comparison ---------------- */

export function CostComparison() {
  const [a, setA] = useState("4200");
  const [b, setB] = useState("3650");
  const [units, setUnits] = useState("25000");
  const [runs, setRuns] = useState("4");

  const ca = parseFloat(a) || 0;
  const cb = parseFloat(b) || 0;
  const u = parseInt(units) || 0;
  const r = parseInt(runs) || 0;

  const diff = ca - cb;
  const pct = ca > 0 ? (diff / ca) * 100 : 0;
  const cheaper = diff > 0 ? "Quote B" : diff < 0 ? "Quote A" : "Equal";
  const perUnit = u > 0 ? Math.abs(diff) / u : 0;
  const annual = Math.abs(diff) * r;

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-4">
        <Field label="Quote A total ($)">
          <input style={inputStyle} type="number" min="0" value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field label="Quote B total ($)">
          <input style={inputStyle} type="number" min="0" value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
        <Field label="Units per run">
          <input style={inputStyle} type="number" min="0" value={units} onChange={(e) => setUnits(e.target.value)} />
        </Field>
        <Field label="Runs per year">
          <input style={inputStyle} type="number" min="0" value={runs} onChange={(e) => setRuns(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Result label="Lower quote" value={cheaper} />
        <Result label="Difference" value={`${Math.abs(pct).toFixed(1)}%`} />
        <Result label="Savings per unit" value={perUnit > 0 ? `$${perUnit.toFixed(3)}` : "—"} />
        <Result label="Annual impact" value={annual > 0 ? `$${annual.toLocaleString()}` : "—"} />
      </div>
      <Disclaimer>
        Compare like for like: confirm both quotes cover the same material structure, print method,
        plate/tooling costs, and shipping terms. The cheapest quote with the wrong barrier is the
        most expensive packaging you can buy.
      </Disclaimer>
    </div>
  );
}
