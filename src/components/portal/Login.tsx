"use client";

import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import {
  getFirebaseAuth,
  googleProvider,
  sendPortalSignInLink,
  isReturningEmailLink,
  completeEmailLinkSignIn,
  cachedSignInEmail,
} from "@/lib/firebase-client";

type Mode = "choose" | "email" | "sent" | "completing" | "need-email";

export default function Login() {
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // On mount, detect a returning magic link and finish sign-in automatically.
  useEffect(() => {
    if (!isReturningEmailLink()) return;
    const cached = cachedSignInEmail();
    if (cached) {
      setMode("completing");
      completeEmailLinkSignIn(cached).catch(() => {
        setErr("That sign-in link expired or was already used. Please request a new one.");
        setMode("choose");
      });
    } else {
      // Opened on a different device — ask for the email to confirm.
      setMode("need-email");
    }
  }, []);

  async function google() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    setBusy(true);
    setErr(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setErr("Sign-in didn't complete. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await sendPortalSignInLink(email.trim().toLowerCase());
      setMode("sent");
    } catch {
      setErr("Couldn't send the link. Check the address and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await completeEmailLinkSignIn(email.trim().toLowerCase());
    } catch {
      setErr("Couldn't verify that link. Please request a new one.");
      setMode("choose");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* animated aura */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="login-orb login-orb-a" />
        <div className="login-orb login-orb-b" />
      </div>

      <div className="relative mx-auto grid max-w-5xl items-center gap-10 py-6 md:grid-cols-[1.1fr,1fr] md:py-10">
        {/* left: pitch */}
        <div className="animate-fade-up">
          <div className="kicker mb-3">Client Center</div>
          <h2 className="display mb-4 text-[clamp(30px,4vw,52px)] text-paper">
            Your packaging
            <br />
            command center.
          </h2>
          <p className="mb-7 max-w-md text-sm leading-relaxed text-muted">
            One secure workspace for everything Microflex: track current and pending
            runs, approve proofs, settle invoices, reorder in two clicks, and message
            the team — all in one place.
          </p>
          <ul className="grid max-w-md gap-2.5">
            {[
              ["📦", "Live order & production status"],
              ["💳", "Invoices and payments"],
              ["✓", "Proof & artwork approvals"],
              ["📁", "Shared document library"],
              ["💬", "Direct line to your account team"],
            ].map(([icon, label]) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}
              >
                <span className="text-base">{icon}</span>
                <span className="text-sm font-semibold text-paper">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* right: auth card */}
        <div
          className="animate-fade-up rounded-4xl p-7 md:p-9"
          style={{
            border: "1px solid rgba(0,216,242,0.3)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            boxShadow: "0 24px 70px rgba(2,12,24,0.45)",
            animationDelay: "0.08s",
          }}
        >
          {mode === "completing" ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
              <p className="text-sm text-muted">Signing you in…</p>
            </div>
          ) : mode === "sent" ? (
            <div className="py-6 text-center">
              <div className="mb-3 text-4xl">✉️</div>
              <h3 className="mb-2 text-xl font-black text-paper">Check your inbox</h3>
              <p className="mx-auto mb-5 max-w-xs text-sm leading-relaxed text-muted">
                We sent a secure sign-in link to{" "}
                <span className="font-bold text-paper">{email}</span>. Open it on this
                device to enter your workspace. The link expires shortly.
              </p>
              <button
                type="button"
                onClick={() => setMode("choose")}
                className="text-sm font-bold text-cyan underline"
              >
                Use a different method
              </button>
            </div>
          ) : mode === "need-email" ? (
            <form onSubmit={confirmEmail} className="grid gap-4">
              <div>
                <div className="kicker mb-2">Confirm it&apos;s you</div>
                <h3 className="text-xl font-black text-paper">Enter your email</h3>
                <p className="mt-1 text-sm text-muted">
                  Confirm the email this sign-in link was sent to.
                </p>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={inputCss}
                autoFocus
              />
              {err && <p className="text-sm text-red-300">{err}</p>}
              <button type="submit" disabled={busy} className="btn btn-primary w-full" style={busy ? dim : undefined}>
                {busy ? "Verifying…" : "Continue"}
              </button>
            </form>
          ) : mode === "email" ? (
            <form onSubmit={sendLink} className="grid gap-4">
              <div>
                <div className="kicker mb-2">Email sign-in</div>
                <h3 className="text-xl font-black text-paper">Sign in with a link</h3>
                <p className="mt-1 text-sm text-muted">
                  No password needed — we&apos;ll email you a secure one-time link.
                </p>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={inputCss}
                autoFocus
              />
              {err && <p className="text-sm text-red-300">{err}</p>}
              <button type="submit" disabled={busy} className="btn btn-primary w-full" style={busy ? dim : undefined}>
                {busy ? "Sending…" : "Email me a sign-in link"}
              </button>
              <button
                type="button"
                onClick={() => { setMode("choose"); setErr(null); }}
                className="text-center text-sm font-bold text-muted hover:text-paper"
              >
                ← Back
              </button>
            </form>
          ) : (
            <div className="grid gap-4">
              <div>
                <div className="kicker mb-2">Client Login</div>
                <h3 className="text-xl font-black text-paper">Welcome back</h3>
                <p className="mt-1 text-sm text-muted">
                  Sign in to open your Microflex workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void google()}
                disabled={busy}
                className="btn btn-primary w-full"
                style={busy ? dim : undefined}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" className="mr-2" aria-hidden>
                  <path
                    fill="#001018"
                    d="M21.35 11.1H12v2.9h5.35c-.5 2.5-2.6 4.3-5.35 4.3a5.8 5.8 0 1 1 0-11.6c1.5 0 2.85.55 3.9 1.45l2.15-2.15A8.86 8.86 0 0 0 12 3.5a8.5 8.5 0 1 0 0 17c4.9 0 8.6-3.45 8.6-8.5 0-.3-.1-.6-.25-.9Z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-xs text-muted-dark">
                <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
                or
                <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
              </div>

              <button
                type="button"
                onClick={() => { setMode("email"); setErr(null); }}
                className="btn btn-secondary w-full"
              >
                ✉️ Sign in with email link
              </button>

              {err && <p className="text-sm text-red-300">{err}</p>}

              <p className="mt-1 text-xs leading-relaxed text-muted-dark">
                New to Microflex? Sign in with your work email — your workspace is created
                automatically and our team links your orders to it.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .login-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(60px);
          opacity: 0.5;
        }
        .login-orb-a {
          top: -60px;
          right: -40px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(0, 216, 242, 0.5), transparent 70%);
          animation: floatA 14s ease-in-out infinite;
        }
        .login-orb-b {
          bottom: -80px;
          left: -60px;
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(0, 168, 207, 0.4), transparent 70%);
          animation: floatB 18s ease-in-out infinite;
        }
        @keyframes floatA {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -20px); }
        }
      `}</style>
    </div>
  );
}

const inputCss: React.CSSProperties = {
  width: "100%",
  background: "rgba(2,5,9,0.6)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "13px 14px",
  color: "#f7fbff",
  fontSize: "14px",
};

const dim: React.CSSProperties = { opacity: 0.6 };
