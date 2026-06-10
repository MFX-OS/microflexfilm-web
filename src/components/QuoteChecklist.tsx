"use client";

import { useState } from "react";

/** Interactive quote-prep checklist: check items off, then copy a
 *  formatted summary to paste into the quote form or an email. */
export default function QuoteChecklist({ items, context }: { items: string[]; context: string }) {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const [copied, setCopied] = useState(false);
  const done = checked.filter(Boolean).length;

  async function copy() {
    const text = [
      `Quote request prep — ${context}`,
      ...items.map((it, i) => `${checked[i] ? "[x]" : "[ ]"} ${it}`),
      "",
      "Prepared with microflexfilm.com",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      className="rounded-3xl p-5 md:p-7"
      style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(255,255,255,0.035)" }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          The more of this you send, the faster and sharper your quote comes back.
        </p>
        <span className="font-mono text-sm font-black text-cyan">{done}/{items.length} ready</span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((it, i) => (
          <button
            key={it}
            type="button"
            onClick={() => setChecked((prev) => prev.map((c, j) => (j === i ? !c : c)))}
            className="flex items-start gap-3 rounded-xl p-3 text-left transition"
            style={{
              border: `1px solid ${checked[i] ? "rgba(0,216,242,0.5)" : "rgba(255,255,255,0.1)"}`,
              background: checked[i] ? "rgba(0,216,242,0.07)" : "rgba(255,255,255,0.02)",
            }}
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-black"
              style={{
                border: `1.5px solid ${checked[i] ? "#00d8f2" : "rgba(255,255,255,0.3)"}`,
                background: checked[i] ? "#00d8f2" : "transparent",
                color: "#001018",
              }}
            >
              {checked[i] ? "✓" : ""}
            </span>
            <span className={`text-sm ${checked[i] ? "text-cyan" : "text-muted-light"}`}>{it}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => void copy()} className="btn btn-secondary" style={{ minHeight: 42, fontSize: 13 }}>
          {copied ? "✓ Copied" : "Copy Checklist"}
        </button>
        <a href="/#quote-form" className="btn btn-primary" style={{ minHeight: 42, fontSize: 13 }}>
          Take It to the Quote Form →
        </a>
      </div>
    </div>
  );
}
