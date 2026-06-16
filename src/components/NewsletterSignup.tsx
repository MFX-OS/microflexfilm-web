"use client";

import { useState } from "react";
import { subscribe } from "@/app/actions/subscribe";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setErr(null);
    const r = await subscribe(email, "newsletter");
    if (r.ok) setState("done");
    else { setErr(r.error ?? "Please try again."); setState("idle"); }
  }

  if (state === "done") {
    return <p className="text-sm font-bold text-cyan">✓ You&rsquo;re subscribed — thanks!</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input
        id="nl-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 rounded-xl px-4 py-2.5 text-sm text-paper"
        style={{ background: "rgba(2,5,9,0.6)", border: "1px solid rgba(255,255,255,0.14)" }}
        required
      />
      <button type="submit" disabled={state === "busy"} className="btn btn-primary" style={state === "busy" ? { opacity: 0.6, minHeight: 42 } : { minHeight: 42 }}>
        {state === "busy" ? "…" : "Subscribe"}
      </button>
      {err && <p className="text-xs text-red-300">{err}</p>}
    </form>
  );
}
