"use client";

import { useRef, useState } from "react";
import { askAssistant, type ChatMsg } from "@/app/actions/assistant";

const STARTERS = [
  "What structure for whole-bean coffee with a 12-month shelf life?",
  "Rollstock vs. pre-made pouches — which is right for me?",
  "What finish makes a supplement pouch look premium?",
  "How do I make my packaging recycle-ready?",
];

export default function PackagingAssistant() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setErr(null);
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await askAssistant(next);
      if (!res.ok) {
        setErr(
          res.error === "NOT_CONFIGURED"
            ? "The assistant isn't switched on yet. Meanwhile, start a project or try the 3D Studio below."
            : "Sorry — I couldn't answer just now. Please try again, or start a project."
        );
      } else {
        setMsgs([...next, { role: "assistant", content: res.reply! }]);
      }
    } catch {
      setErr("Sorry — something went wrong. Please try again.");
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 60);
    }
  }

  return (
    <div
      className="rounded-4xl p-6 md:p-8"
      style={{ border: "1px solid rgba(0,216,242,0.25)", background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))" }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <div className="kicker">Ask the packaging expert</div>
      </div>
      <h3 className="mb-4 text-xl font-black text-paper md:text-2xl">
        Not sure what you need? Just ask.
      </h3>

      {/* thread */}
      <div
        ref={scrollRef}
        className="mb-3 grid gap-3 rounded-2xl p-4"
        style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2,5,9,0.35)", maxHeight: 360, overflowY: "auto" }}
      >
        {msgs.length === 0 ? (
          <div className="text-sm text-muted">
            Ask about formats, finishes, barriers, materials, or what fits your product — I&rsquo;ll point you to the right spec and next step.
          </div>
        ) : (
          msgs.map((m, i) => {
            const mine = m.role === "user";
            return (
              <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm"
                  style={{
                    background: mine ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${mine ? "rgba(0,216,242,0.4)" : "rgba(255,255,255,0.1)"}`,
                    color: "#f7fbff",
                  }}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        {busy && <div className="text-xs text-muted">Thinking…</div>}
      </div>

      {/* starters */}
      {msgs.length === 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              className="rounded-full px-3 py-1.5 text-left text-xs font-semibold transition hover:-translate-y-0.5"
              style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)", color: "#bdd0dc" }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {err && <p className="mb-3 text-sm text-red-300">{err}</p>}

      <form
        onSubmit={(e) => { e.preventDefault(); void send(input); }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your packaging…"
          className="flex-1 rounded-xl px-4 py-3 text-sm text-paper"
          style={{ background: "rgba(2,5,9,0.6)", border: "1px solid rgba(255,255,255,0.14)" }}
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn btn-primary" style={busy || !input.trim() ? { opacity: 0.5 } : undefined}>
          Send
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href="/#quote-form" className="btn btn-secondary" style={{ minHeight: 38, fontSize: 13 }}>Start a Project</a>
        <a href="/configurator" className="btn btn-secondary" style={{ minHeight: 38, fontSize: 13 }}>Open 3D Studio</a>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-dark">
        AI guidance for general direction — not a quote. For exact pricing, lead time, and specs, start a project and our team will confirm.
      </p>
    </div>
  );
}
