import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { industries, getIndustry } from "@/data/industries";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return {
    title: `${ind.name} | Industries`,
    description: `${ind.tagline} ${ind.intro}`.slice(0, 160),
    alternates: { canonical: `https://microflexfilm.com/industries/${ind.slug}` },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 6);

  return (
    <>
      <Header />
      <main id="top">
        {/* Hero */}
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Industries</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">{ind.name}</h1>
            <p className="mt-4 max-w-[720px] text-xl font-bold leading-snug text-cyan">
              {ind.tagline}
            </p>
            <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-muted">{ind.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#quote-form" className="btn btn-primary">Book a Consultation</a>
              <a href="/#sample-kit" className="btn btn-secondary">Request Sample Kit</a>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* What this category demands */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">01</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                What this category demands.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {ind.demands.map((d, i) => (
                <div key={d.title} className="card !min-h-0">
                  <div className="mb-3 font-mono text-sm font-black text-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-paper">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Recommended formats */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">02</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Recommended formats.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                The packaging formats this category reaches for first — each links to its full
                technical blueprint.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ind.formats.map((f) => (
                <a
                  key={f.slug}
                  href={`/capabilities/${f.slug}`}
                  className="rounded-2xl p-5 transition hover:-translate-y-1"
                  style={{
                    border: "1px solid rgba(0,216,242,0.22)",
                    background: "rgba(255,255,255,0.035)",
                  }}
                >
                  <span className="block text-base font-bold text-paper">{f.label}</span>
                  <span
                    className="mt-2 block text-[11px] font-extrabold uppercase text-cyan"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    View Blueprint →
                  </span>
                </a>
              ))}
            </div>

            <div
              className="mt-8 rounded-2xl p-6"
              style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(255,255,255,0.03)" }}
            >
              <div className="kicker mb-2 text-[10px]">Finish direction</div>
              <p className="text-sm leading-relaxed text-muted">{ind.finishes}</p>
              {ind.compliance && (
                <>
                  <div className="kicker mb-2 mt-4 text-[10px]">Compliance note</div>
                  <p className="text-sm leading-relaxed text-muted">{ind.compliance}</p>
                </>
              )}
            </div>

            <div className="mt-8">
              <div className="kicker mb-4 text-[10px]">Common applications</div>
              <div className="flex flex-wrap gap-2">
                {ind.applications.map((a) => (
                  <span
                    key={a}
                    className="rounded-full px-4 py-2 text-xs font-bold text-muted-light"
                    style={{
                      border: "1px solid rgba(0,216,242,0.25)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Why Microflex */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div
              className="rounded-4xl p-6 md:p-10"
              style={{
                border: "1px solid rgba(0,216,242,0.22)",
                background: "linear-gradient(135deg, rgba(0,216,242,0.07), rgba(255,255,255,0.02))",
              }}
            >
              <div className="kicker mb-3"><span className="font-mono">03</span> — Why Microflex</div>
              <h2 className="display mb-6 text-[clamp(26px,3vw,42px)] text-paper">
                One partner from spec to shelf.
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { t: "Engineered to your product", d: "Structures and barriers specified to your exact product chemistry, fill process, and shelf-life target." },
                  { t: "SQF-certified production", d: "Food-safety-aligned manufacturing with documented quality controls, traceability, and COAs." },
                  { t: "Made in the USA", d: "Riverside, California production — responsive lead times, domestic supply, solar-powered operations." },
                ].map((w) => (
                  <div key={w.t}>
                    <h3 className="mb-1.5 font-bold text-paper">{w.t}</h3>
                    <p className="text-sm leading-relaxed text-muted">{w.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Other industries */}
        <section className="py-10 md:py-14">
          <div className="container-x">
            <div className="kicker mb-5">Explore other industries</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <a
                  key={o.slug}
                  href={`/industries/${o.slug}`}
                  className="rounded-2xl p-4 transition hover:-translate-y-1"
                  style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(255,255,255,0.03)" }}
                >
                  <span className="block text-sm font-bold text-paper">{o.name}</span>
                  <span className="mt-1 block text-[11px] font-extrabold uppercase text-cyan" style={{ letterSpacing: "0.08em" }}>
                    Explore →
                  </span>
                </a>
              ))}
            </div>
            <a href="/industries" className="btn btn-secondary mt-6 inline-flex">
              View All Industries
            </a>
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
                Let&rsquo;s build your {ind.name.replace(" Packaging", "").toLowerCase()} packaging.
              </h2>
              <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed text-muted">
                Tell us about your product and goals — we&rsquo;ll engineer the structure,
                format, and finish around your category&rsquo;s demands.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/#quote-form" className="btn btn-primary">Book a Consultation</a>
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
