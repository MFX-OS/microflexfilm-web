import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MaterialExplorer from "@/components/MaterialExplorer";

export const metadata: Metadata = {
  title: "Materials & Features | Finishes, Barriers & Structures",
  description:
    "Explore Microflex packaging materials: matte, gloss, soft-touch, metallic, and clear finishes; moisture, oxygen, light, and aroma barriers; film structures; sustainability options; and quality documentation including COAs.",
  alternates: { canonical: "https://microflexfilm.com/materials" },
};

const sellingPoints = [
  {
    title: "Engineered, not picked from a catalog",
    desc: "Material structures are specified around your product's sensitivity, fill process, and shelf-life target — not pulled off a shelf.",
  },
  {
    title: "Finish drives perception",
    desc: "Matte, gloss, soft-touch, and metallic finishes change how customers value your product before they read a word. We help you choose deliberately.",
  },
  {
    title: "Barrier where it counts",
    desc: "Pay for the protection your product actually needs — moisture, oxygen, light, aroma — and skip the over-engineering that inflates cost.",
  },
  {
    title: "Sustainability without compromise",
    desc: "Recycle-ready mono-materials, PCR content, and lightweighting paths matched to your barrier requirements and brand commitments.",
  },
  {
    title: "Consistency run after run",
    desc: "Controlled specifications and documented quality checks mean roll 50 looks and performs like roll 1.",
  },
  {
    title: "One partner, full stack",
    desc: "Film, finish, barrier, format, and documentation handled in one program — fewer handoffs, fewer surprises.",
  },
];

const useCases = [
  {
    product: "Coffee & Tea",
    needs: "Aroma + oxygen barrier, degassing options",
    pick: "Foil or high-barrier lamination · matte or soft-touch finish",
  },
  {
    product: "Snacks & Chips",
    needs: "Moisture barrier, high-speed sealing",
    pick: "BOPP structures · gloss finish for color pop",
  },
  {
    product: "Supplements & Powders",
    needs: "Moisture + light protection, compliance print",
    pick: "Barrier lamination · matte with metallic accents",
  },
  {
    product: "Pet Food & Treats",
    needs: "Aroma containment, puncture resistance",
    pick: "Heavy-duty lamination · gloss or clear window",
  },
  {
    product: "Frozen Foods",
    needs: "Cold-crack resistance, moisture barrier",
    pick: "PE-rich structures · gloss finish",
  },
  {
    product: "Natural & Organic",
    needs: "Natural shelf cue with real protection",
    pick: "Kraft-look or paper-based · lined barrier",
  },
  {
    product: "Liquids & Sauces",
    needs: "Seal integrity, flex-crack resistance",
    pick: "PE sealant systems · sachet or pouch formats",
  },
  {
    product: "Cosmetics & Personal Care",
    needs: "Premium feel, chemical resistance",
    pick: "Soft-touch or metallic · specialty sealants",
  },
];

const docs = [
  {
    title: "Certificate of Analysis (COA)",
    desc: "Lot-specific quality documentation covering the tests and specifications your order was verified against — available with production runs.",
  },
  {
    title: "Material Specification Sheets",
    desc: "Structure, gauge, and performance specifications for your packaging material, documented for your quality and regulatory files.",
  },
  {
    title: "Food-Contact Compliance",
    desc: "Documentation supporting food-contact suitability of materials used in your application, aligned to applicable FDA requirements.",
  },
  {
    title: "SQF-Certified Production",
    desc: "Packaging produced in an SQF-certified facility with documented food-safety-aligned processes, traceability, and controlled workflows.",
  },
];

export default function MaterialsPage() {
  return (
    <>
      <Header />
      <main id="top">
        {/* Hero */}
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Materials &amp; Features</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              The material is half the product.
            </h1>
            <p className="mt-4 max-w-[720px] text-xl font-bold leading-snug text-cyan">
              Finishes, barriers, structures, and sustainability paths — explored interactively,
              engineered precisely.
            </p>
            <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-muted">
              Every Microflex package is a stack of deliberate material decisions: the finish your
              customer touches, the barrier that protects what&rsquo;s inside, the structure that
              runs on your filling line, and the documentation that proves it all. Explore the
              options below, then let us engineer the exact spec for your product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#quote-form" className="btn btn-primary">
                Book a Consultation
              </a>
              <a href="/#sample-kit" className="btn btn-secondary">
                Feel Them Yourself — Sample Kit
              </a>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Explorer */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">01</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Explore the material library.
              </h2>
            </div>
            <MaterialExplorer />
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Selling points */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">02</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Why material choice makes or breaks packaging.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sellingPoints.map((s) => (
                <div key={s.title} className="card !min-h-0">
                  <h3 className="mb-2 text-lg font-bold text-paper">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Use cases */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">03</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Matched to your product.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Typical starting points by product category — your final specification is
                engineered to your exact product, process, and shelf-life target.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {useCases.map((u) => (
                <div
                  key={u.product}
                  className="rounded-2xl p-5"
                  style={{
                    border: "1px solid rgba(0,216,242,0.16)",
                    background: "rgba(255,255,255,0.032)",
                  }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-paper">{u.product}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                      Typical spec
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    <span className="font-bold text-muted-light">Needs:</span> {u.needs}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    <span className="font-bold text-cyan">Start with:</span> {u.pick}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* COA & quality documentation */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div
              className="rounded-4xl p-6 md:p-10"
              style={{
                border: "1px solid rgba(0,216,242,0.28)",
                background:
                  "linear-gradient(135deg, rgba(0,216,242,0.07), rgba(255,255,255,0.02))",
              }}
            >
              <div className="mb-8 max-w-3xl">
                <div className="kicker mb-3"><span className="font-mono">04</span> — Quality &amp; Documentation</div>
                <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                  Proven on paper, not just promised.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  Material claims mean nothing without documentation behind them. Microflex
                  supports your quality, regulatory, and retailer requirements with the
                  paperwork your team actually needs.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {docs.map((d) => (
                  <div
                    key={d.title}
                    className="flex gap-4 rounded-2xl p-5"
                    style={{
                      border: "1px solid rgba(0,216,242,0.2)",
                      background: "rgba(2,5,9,0.45)",
                    }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                      style={{
                        border: "1px solid rgba(0,216,242,0.45)",
                        background: "rgba(0,216,242,0.08)",
                      }}
                    >
                      📋
                    </span>
                    <span>
                      <span className="block font-bold text-paper">{d.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{d.desc}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                Need specific documentation for a retailer, auditor, or regulatory submission?{" "}
                <a href="/#contact" className="font-bold text-cyan underline underline-offset-2">
                  Ask the team
                </a>{" "}
                — we&rsquo;ll confirm exactly what&rsquo;s available for your program.
              </p>
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
                background:
                  "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.14), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(30px,4vw,56px)] text-paper">
                Let&rsquo;s spec the right material for your product.
              </h2>
              <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed text-muted">
                Tell us what you&rsquo;re packaging, how it&rsquo;s filled, and how long it needs
                to stay perfect — we&rsquo;ll engineer the structure, finish, and documentation
                around it.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/#quote-form" className="btn btn-primary">
                  Book a Consultation
                </a>
                <a href="/#sample-kit" className="btn btn-secondary">
                  Request Sample Kit
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
