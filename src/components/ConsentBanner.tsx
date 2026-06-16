"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/* Cookie-consent banner wired to Google Consent Mode v2.
   Analytics stay denied (set in layout) until the visitor accepts. */
export default function ConsentBanner({ clarityId }: { clarityId?: string }) {
  const [show, setShow] = useState(false);

  function loadClarity() {
    if (!clarityId || document.getElementById("clarity")) return;
    const s = document.createElement("script");
    s.id = "clarity";
    s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`;
    document.head.appendChild(s);
  }

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("mfx_consent"); } catch {}
    if (stored === "granted") {
      window.gtag?.("consent", "update", { analytics_storage: "granted" });
      loadClarity();
    } else if (!stored) {
      setShow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function decide(granted: boolean) {
    try { localStorage.setItem("mfx_consent", granted ? "granted" : "denied"); } catch {}
    if (granted) {
      window.gtag?.("consent", "update", { analytics_storage: "granted" });
      loadClarity();
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-2xl rounded-2xl p-4 md:p-5"
      style={{
        border: "1px solid rgba(0,216,242,0.35)",
        background: "rgba(6,18,29,0.96)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          We use privacy-friendly analytics to improve the site. Accept analytics cookies?{" "}
          <a href="/terms#cookies" className="font-bold text-cyan underline">Cookie policy</a>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => decide(false)} className="btn btn-dark" style={{ minHeight: 38, fontSize: 13 }}>
            Decline
          </button>
          <button type="button" onClick={() => decide(true)} className="btn btn-primary" style={{ minHeight: 38, fontSize: 13 }}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
