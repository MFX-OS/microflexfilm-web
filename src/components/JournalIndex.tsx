"use client";

import { useState } from "react";
import { journalArticles } from "@/data/journalArticles";

const cats = ["All", ...Array.from(new Set(journalArticles.map((a) => a.cat)))];

export default function JournalIndex() {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? journalArticles : journalArticles.filter((a) => a.cat === cat);

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
        {list.length} guide{list.length === 1 ? "" : "s"} published — practical answers for
        every stage of a flexible packaging project.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((a) => (
          <a
            key={a.n}
            href={`/journal/${a.slug}`}
            className="card !min-h-0 flex flex-col"
          >
            <div className="mb-2">
              <span
                className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan"
                style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}
              >
                {a.cat}
              </span>
            </div>
            <h3 className="text-base font-bold text-paper">{a.title}</h3>
            <p className="mb-3 mt-2 text-sm leading-relaxed text-muted">{a.intro.slice(0, 150)}…</p>
            <span className="mt-auto text-xs font-extrabold uppercase text-cyan" style={{ letterSpacing: "0.08em" }}>
              Read the guide →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
