"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <main id="top" style={{ minHeight: "70vh" }}>
      <section className="grid-backdrop relative py-24 md:py-32">
        <div className="container-x text-center">
          <div className="kicker mb-3">Something went wrong</div>
          <h1 className="display mb-4 text-[clamp(34px,6vw,72px)] text-paper">
            We hit a snag.
          </h1>
          <p className="mx-auto mb-8 max-w-[540px] text-lg leading-relaxed text-muted">
            Sorry about that. Try again, or head back home — your work and our team are still here.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => reset()} className="btn btn-primary">Try again</button>
            <a href="/" className="btn btn-secondary">Back to Home</a>
            <a href="/#quote-form" className="btn btn-secondary">Contact Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
