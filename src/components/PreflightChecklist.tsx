"use client";

import { useState } from "react";

const items = [
  {
    title: "Native .AI master file",
    detail: "Final layout saved and submitted as a native Adobe Illustrator (.AI) file.",
  },
  {
    title: "Images at 100% scale, 300 DPI minimum",
    detail:
      "All embedded or linked images built at 100% physical print size with at least 300 DPI effective resolution.",
  },
  {
    title: "All fonts converted to outlines",
    detail: "Every text layer converted via Type → Create Outlines (⌘⇧O / Ctrl+Shift+O).",
  },
  {
    title: "CMYK document + Pantone spot colors",
    detail:
      "Document color mode set to CMYK with critical brand colors mapped to Pantone Solid Coated.",
  },
  {
    title: "0.125″ bleed past the die line",
    detail:
      "Backgrounds, colors, and images extend at least 1/8″ beyond the structural die line on all sides.",
  },
];

export default function PreflightChecklist() {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const done = checked.filter(Boolean).length;
  const allDone = done === items.length;

  return (
    <div
      className="rounded-4xl p-6 md:p-10"
      style={{
        border: "1px solid rgba(0,216,242,0.28)",
        background:
          "linear-gradient(180deg, rgba(0,216,242,0.07), rgba(255,255,255,0.025))",
      }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="kicker mb-2">Final Step</div>
          <h2 className="display text-[clamp(28px,3.4vw,46px)] text-paper">
            Pre-Flight Checklist
          </h2>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-black text-cyan">
            {done}/{items.length}
          </div>
          <div className="text-xs uppercase tracking-widest text-muted">verified</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-7 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(done / items.length) * 100}%`,
            background: "linear-gradient(90deg, #00a8cf, #00d8f2)",
            boxShadow: "0 0 14px rgba(0,216,242,0.6)",
          }}
        />
      </div>

      <ul className="grid gap-3">
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() =>
                setChecked((prev) => prev.map((c, j) => (j === i ? !c : c)))
              }
              aria-pressed={checked[i]}
              className="flex w-full items-start gap-4 rounded-2xl p-4 text-left transition md:p-5"
              style={{
                border: `1px solid ${
                  checked[i] ? "rgba(0,216,242,0.55)" : "rgba(255,255,255,0.10)"
                }`,
                background: checked[i]
                  ? "rgba(0,216,242,0.08)"
                  : "rgba(255,255,255,0.03)",
              }}
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sm font-black transition"
                style={{
                  border: `1.5px solid ${
                    checked[i] ? "#00d8f2" : "rgba(255,255,255,0.3)"
                  }`,
                  background: checked[i] ? "#00d8f2" : "transparent",
                  color: "#001018",
                }}
              >
                {checked[i] ? "✓" : ""}
              </span>
              <span>
                <span
                  className={`block font-bold ${
                    checked[i] ? "text-cyan" : "text-paper"
                  }`}
                >
                  {item.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">
                  {item.detail}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={allDone ? "/#client-center" : undefined}
          aria-disabled={!allDone}
          className="btn btn-primary"
          style={
            allDone
              ? undefined
              : { opacity: 0.4, pointerEvents: "none", cursor: "not-allowed" }
          }
        >
          {allDone ? "Upload Artwork →" : "Complete all checks to submit"}
        </a>
        <a href="/#contact" className="btn btn-secondary">
          Questions? Talk to Prepress
        </a>
      </div>
    </div>
  );
}
