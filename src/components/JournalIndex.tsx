"use client";

import { useState } from "react";
import { journalBriefs } from "@/data/journal";

const cats = ["All", ...Array.from(new Set(journalBriefs.map((a) => a.cat)))];

export default function JournalIndex() {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? journalBriefs : journalBriefs.filter((a) => a.cat === cat);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className="rounded-full px-4 py-2 text-xs font-bold transition"
            style={{
              border: `1px solid ${cat === c ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`,
              background: cat === c ? "rgba(0,216,242,0.12)" : "rgba(255,255,255,0.03)",
              color: cat === c ? "#34e3f5" : "#a9b9c8",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mb-5 text-sm text-muted">
        {list.length} guide{list.length === 1 ? "" : "s"} in the publishing program — new
        articles publish weekly. Want one prioritized?{" "}
        <a href="/#contact" className="font-bold text-cyan underline">Tell us which.</a>
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((a) => (
          <div
            key={a.n}
            className="rounded-2xl p-5"
            style={{ border: "1px solid rgba(0,216,242,0.16)", background: "rgba(255,255,255,0.032)" }}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}>
                {a.cat}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-dark">Coming soon</span>
            </div>
            <h3 className="text-base font-bold text-paper">{a.title}</h3>
            {a.intro && <p className="mt-2 text-sm leading-relaxed text-muted">{a.intro.slice(0, 160)}…</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
