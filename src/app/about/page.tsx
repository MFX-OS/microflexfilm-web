import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Microflex | Flexible Packaging, Engineered to Perform",
  description:
    "Microflex Film Corporation is a Riverside, California flexible-packaging manufacturer — SQF certified, solar powered, made in the USA. Disciplined production, artwork control, and quality-focused execution.",
  alternates: { canonical: "https://microflexfilm.com/about" },
};

const pillars = [
  { word: "Say It.", desc: "Clear standards, clear specs, clear commitments — everyone knows exactly what's being built and when." },
  { word: "Do It.", desc: "Controlled execution against those standards: documented workflows from prepress through delivery." },
  { word: "Prove It.", desc: "Evidence over assurance — inspections, traceability, COAs, and quality records behind every run." },
  { word: "Evolve It.", desc: "Disciplined improvement: every run teaches the next one, and the system keeps getting sharper." },
];

const facts = [
  { value: "SQF", label: "Certified facility — food-safety-aligned operations" },
  { value: "USA", label: "Manufactured in Riverside, California" },
  { value: "☀", label: "Solar-powered operations" },
  { value: "1:1", label: "A dedicated specialist on every account" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">About Microflex</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              The surface layer between your product and the world.
            </h1>
            <p className="mt-4 max-w-[720px] text-xl font-bold leading-snug text-cyan">
              Flexible Packaging. Engineered to Perform.
            </p>
            <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-muted">
              Microflex Film Corporation manufactures flexible packaging in Riverside,
              California — printed film, pouches, labels, shrink sleeves, sachets, stick
              packs, and the display systems that carry them. We exist for brands that treat
              packaging as part of the product, not an afterthought.
            </p>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Facts strip */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl p-6 text-center"
                  style={{ border: "1px solid rgba(0,216,242,0.22)", background: "rgba(255,255,255,0.038)" }}
                >
                  <div className="font-mono text-3xl font-black text-cyan">{f.value}</div>
                  <div className="mt-2 text-xs leading-relaxed text-muted">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Philosophy */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3">Operating Philosophy</div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Say It. Do It. Prove It. Evolve It.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Four commitments that run through every quote, proof, production run, and
                delivery — the system that keeps quality from being a slogan.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {pillars.map((p, i) => (
                <div key={p.word} className="card !min-h-0">
                  <div className="mb-2 font-mono text-xs font-black text-cyan">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="display mb-2 text-2xl text-paper">{p.word}</h3>
                  <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* How we work */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div>
                <div className="kicker mb-3">How We Work</div>
                <h2 className="display text-[clamp(28px,3.4vw,46px)] text-paper">
                  Built to help you test, launch, and scale.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  Most packaging suppliers are built for one stage of your growth. We
                  engineered Microflex for the whole arc: digital print and short runs when
                  you&rsquo;re testing, efficient flexo as you scale, gravure-class
                  consistency when your flagship demands it — with the same specialist, the
                  same quality system, and the same brand colors at every stage.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  Every account gets a dedicated packaging specialist who knows your
                  products, your specs, and your history — so reorders take minutes and new
                  projects start from context, not from zero.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/#quote-form" className="btn btn-primary">Start a Project</a>
                  <a href="/capabilities" className="btn btn-secondary">Explore Capabilities</a>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  { t: "Structured intake", d: "Every project starts with a real conversation about your product, process, and goals — captured into specs." },
                  { t: "Artwork control", d: "Prepress discipline, die-line accuracy, and proof workflows that catch problems before press." },
                  { t: "Documented quality", d: "Inspections, traceability, and certificates that prove conformance — not just promise it." },
                  { t: "Reliable delivery", d: "Clear communication, honest lead times, and packaging that arrives ready to fill." },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl p-5"
                    style={{ border: "1px solid rgba(0,216,242,0.16)", background: "rgba(255,255,255,0.032)" }}
                  >
                    <h3 className="mb-1 font-bold text-paper">{x.t}</h3>
                    <p className="text-sm leading-relaxed text-muted">{x.d}</p>
                  </div>
                ))}
              </div>
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
                Let&rsquo;s build something worth putting your product in.
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/#quote-form" className="btn btn-primary">Start a Project</a>
                <a href="/#contact" className="btn btn-secondary">Contact the Team</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
