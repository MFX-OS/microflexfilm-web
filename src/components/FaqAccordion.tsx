"use client";

import { useState } from "react";

export type Faq = { q: string; a: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid gap-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className="overflow-hidden rounded-2xl transition"
            style={{
              border: `1px solid ${isOpen ? "rgba(0,216,242,0.45)" : "rgba(255,255,255,0.12)"}`,
              background: isOpen ? "rgba(0,216,242,0.05)" : "rgba(255,255,255,0.03)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className={`text-base font-bold ${isOpen ? "text-cyan" : "text-paper"}`}>
                {f.q}
              </span>
              <span
                className="shrink-0 font-mono text-xl font-black text-cyan transition-transform"
                style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <p className="text-sm leading-relaxed text-muted">{f.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
