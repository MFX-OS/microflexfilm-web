import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Printing Options | Digital & Flexographic",
  description:
    "Compare packaging print technologies — digital for trials and short runs, flexographic for production-scale efficiency. Microflex matches the press to your project.",
  alternates: { canonical: "https://microflexfilm.com/printing" },
};

const methods = [
  {
    name: "Digital Printing",
    mono: "DIGITAL",
    tagline: "Zero plates. Fast turns. Perfect for testing.",
    desc: "Digital presses print straight from your file — no plates, no cylinders, no tooling lead time. That makes digital the fastest path from approved art to printed packaging, and the only economical path for small runs and multi-SKU variety.",
    strengths: [
      "No plate or cylinder costs — ideal for short runs",
      "Fastest turnaround from art approval to print",
      "Every package can be different — versioning, regional editions, personalization",
      "Test designs in-market before committing to volume tooling",
    ],
    bestWhen: "Launching, testing, or running many SKUs at lower volumes.",
    tradeoff: "Cost per unit stays flat as volume grows — at scale, plate-based methods win on unit price.",
  },
  {
    name: "Flexographic Printing",
    mono: "FLEXO",
    tagline: "The mid-volume workhorse of packaging print.",
    desc: "Flexo uses flexible relief plates to lay fast, consistent color on film at production speed. Once plates are made, unit costs drop well below digital — making flexo the natural home for established SKUs at moderate-to-high volume.",
    strengths: [
      "Strong unit economics at mid-to-high volumes",
      "Fast production speeds on web-fed film",
      "Excellent for solid colors, line work, and brand-color consistency",
      "Plates are durable and reusable across reorders",
    ],
    bestWhen: "Established products with steady volume and consistent artwork.",
    tradeoff: "Plate costs front-load the investment; artwork changes mean new plates.",
  },
];

export default function PrintingPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Printing Options</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              The right press for the right run.
            </h1>
            <p className="mt-4 max-w-[720px] text-xl font-bold leading-snug text-cyan">
              Digital to test. Flexo to scale.
            </p>
            <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-muted">
              Print technology is an economics decision as much as a quality one. We
              don&rsquo;t push one press — we match the method to your volume, artwork, and
              growth stage, and re-match it as you scale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#quote-form" className="btn btn-primary">Get a Print Recommendation</a>
              <a href="/artwork-guidelines" className="btn btn-secondary">Artwork Guidelines</a>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="grid gap-6">
              {methods.map((m, i) => (
                <div
                  key={m.name}
                  className="rounded-4xl p-6 md:p-10"
                  style={{
                    border: "1px solid rgba(0,216,242,0.22)",
                    background: "linear-gradient(135deg, rgba(0,216,242,0.05), rgba(255,255,255,0.02))",
                  }}
                >
                  <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
                    <div>
                      <div className="kicker mb-3">
                        <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> — {m.mono}
                      </div>
                      <h2 className="display text-[clamp(28px,3.4vw,46px)] text-paper">{m.name}</h2>
                      <p className="mt-3 text-lg font-bold text-cyan">{m.tagline}</p>
                      <p className="mt-4 text-base leading-relaxed text-muted">{m.desc}</p>
                    </div>
                    <div className="grid content-start gap-3">
                      {m.strengths.map((s) => (
                        <div key={s} className="flex gap-3 text-sm leading-relaxed text-muted-light">
                          <span className="mt-0.5 font-black text-cyan">✓</span>
                          {s}
                        </div>
                      ))}
                      <div
                        className="mt-2 rounded-2xl p-4"
                        style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.06)" }}
                      >
                        <span className="block text-xs font-extrabold uppercase tracking-widest text-cyan">Best when</span>
                        <span className="mt-1 block text-sm text-muted-light">{m.bestWhen}</span>
                      </div>
                      <div
                        className="rounded-2xl p-4"
                        style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}
                      >
                        <span className="block text-xs font-extrabold uppercase tracking-widest text-muted">Trade-off</span>
                        <span className="mt-1 block text-sm text-muted">{m.tradeoff}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Test → Launch → Scale */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3">The Microflex Path</div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Test. Launch. Scale. Same partner.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Start digital to validate your design in-market. Move to flexo as volume
                builds. Because we support both paths, you never outgrow your packaging
                partner — and your brand colors stay consistent through every transition.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { step: "TEST", method: "Digital", desc: "Small runs, fast turns, zero tooling. Validate the design, the shelf, and the customer." },
                { step: "LAUNCH", method: "Flexo", desc: "Volume builds — plates pay for themselves and unit costs drop into retail-ready territory." },
                { step: "SCALE", method: "Flexo at Volume", desc: "Durable plates, fast webs, and locked-in color standards carry your flagship SKUs at production scale." },
              ].map((s) => (
                <div key={s.step} className="card !min-h-0">
                  <div className="mb-2 font-mono text-xs font-black tracking-widest text-cyan">{s.step}</div>
                  <h3 className="mb-2 text-lg font-bold text-paper">{s.method}</h3>
                  <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <div
              className="rounded-5xl p-8 text-center md:p-14"
              style={{
                border: "1px solid rgba(0,216,242,0.35)",
                background: "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.14), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(30px,4vw,56px)] text-paper">
                Not sure which press fits your project?
              </h2>
              <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed text-muted">
                Send us your artwork, volumes, and timeline — we&rsquo;ll recommend the
                method (and often quote more than one) so you can decide with real numbers.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/#quote-form" className="btn btn-primary">Request Quotes</a>
                <a href="/materials" className="btn btn-secondary">Explore Materials</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
