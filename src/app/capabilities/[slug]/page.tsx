import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { capabilities, getCapability } from "@/data/capabilities";
import {
  PouchBlueprint,
  LabelBlueprint,
  RollstockBlueprint,
  BottleBlueprint,
  StickBlueprint,
  BoxBlueprint,
} from "@/components/BlueprintDiagrams";

const diagrams: Record<string, React.ComponentType> = {
  pouches: PouchBlueprint,
  labels: LabelBlueprint,
  rollstock: RollstockBlueprint,
  specialty: BottleBlueprint,
  "stick-packs": StickBlueprint,
  display: BoxBlueprint,
};

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cap = getCapability(slug);
  if (!cap) return {};
  return {
    title: `${cap.name} | Capabilities`,
    description: `${cap.tagline} ${cap.intro}`.slice(0, 160),
    alternates: { canonical: `https://microflexfilm.com/capabilities/${cap.slug}` },
  };
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cap = getCapability(slug);
  if (!cap) notFound();
  const Diagram = diagrams[cap.slug];
  const others = capabilities.filter((c) => c.slug !== cap.slug);

  return (
    <>
      <Header />
      <main id="top">
        {/* Hero */}
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Capabilities — Blueprint</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">{cap.name}</h1>
            <p className="mt-4 max-w-[720px] text-xl font-bold leading-snug text-cyan">
              {cap.tagline}
            </p>
            <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-muted">{cap.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#quote-form" className="btn btn-primary">
                Book a Consultation
              </a>
              <a href="/#sample-kit" className="btn btn-secondary">
                Request Sample Kit
              </a>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Blueprint + anatomy */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">01</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Dissected: the anatomy.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Every numbered component below is a decision point we engineer around your
                product, your filling process, and your customer.
              </p>
            </div>
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div
                className="rounded-4xl p-4 md:p-6"
                style={{
                  border: "1px solid rgba(0,216,242,0.28)",
                  background: "rgba(2,5,9,0.55)",
                }}
              >
                <Diagram />
              </div>
              <ol className="grid gap-3">
                {cap.anatomy.map((a) => (
                  <li
                    key={a.n}
                    className="flex gap-4 rounded-2xl p-4 md:p-5"
                    style={{
                      border: "1px solid rgba(0,216,242,0.16)",
                      background: "rgba(255,255,255,0.032)",
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-black text-cyan"
                      style={{ border: "1.5px solid rgba(0,216,242,0.6)" }}
                    >
                      {a.n}
                    </span>
                    <span>
                      <span className="block font-bold text-paper">{a.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{a.desc}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Features / selling points */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">02</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Why brands choose this format.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cap.features.map((f) => (
                <div key={f.title} className="card !min-h-0">
                  <h3 className="mb-2 text-lg font-bold text-paper">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* Fit guide */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="mb-8 max-w-3xl">
              <div className="kicker mb-3"><span className="font-mono">03</span></div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">
                Is this the right format for you?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                An honest fit check — and where to look if another format serves your product better.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div
                className="rounded-4xl p-6 md:p-8"
                style={{
                  border: "1px solid rgba(0,216,242,0.35)",
                  background: "rgba(0,216,242,0.06)",
                }}
              >
                <div className="kicker mb-4">✓ A strong fit if…</div>
                <ul className="grid gap-3">
                  {cap.bestFor.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted-light">
                      <span className="mt-0.5 font-black text-cyan">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-4xl p-6 md:p-8"
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className="mb-4 text-xs font-extrabold uppercase"
                  style={{ color: "#a9b9c8", letterSpacing: "0.22em" }}
                >
                  ↗ Consider another format if…
                </div>
                <ul className="grid gap-3">
                  {cap.consider.map((c) => (
                    <li key={c.text} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-0.5 text-muted-dark">→</span>
                      <span>
                        {c.text}
                        {c.link && (
                          <>
                            {" — see "}
                            <a
                              href={`/capabilities/${c.link.slug}`}
                              className="font-bold text-cyan underline underline-offset-2"
                            >
                              {c.link.label}
                            </a>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-muted">
                  Not sure?{" "}
                  <a href="/#quote-form" className="font-bold text-cyan underline underline-offset-2">
                    Book a consultation
                  </a>{" "}
                  — we&rsquo;ll match the format to your product, not the other way around.
                </p>
              </div>
            </div>

            {/* Applications */}
            <div className="mt-8">
              <div className="kicker mb-4 text-[10px]">Common applications</div>
              <div className="flex flex-wrap gap-2">
                {cap.applications.map((a) => (
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

        {/* Education */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <div
              className="rounded-4xl p-6 md:p-10"
              style={{
                border: "1px solid rgba(0,216,242,0.22)",
                background:
                  "linear-gradient(135deg, rgba(0,216,242,0.07), rgba(255,255,255,0.02))",
              }}
            >
              <div className="kicker mb-3"><span className="font-mono">04</span> — Learn</div>
              <h2 className="display mb-4 text-[clamp(26px,3vw,42px)] text-paper">
                {cap.education.title}
              </h2>
              <p className="max-w-[820px] text-lg leading-relaxed text-muted">
                {cap.education.body}
              </p>
            </div>
          </div>
        </section>

        {/* Other formats */}
        <section className="py-10 md:py-14">
          <div className="container-x">
            <div className="kicker mb-5">Explore other formats</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {others.map((o) => (
                <a
                  key={o.slug}
                  href={`/capabilities/${o.slug}`}
                  className="rounded-2xl p-4 transition hover:-translate-y-1"
                  style={{
                    border: "1px solid rgba(0,216,242,0.18)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <span className="block text-sm font-bold text-paper">{o.shortName}</span>
                  <span
                    className="mt-1 block text-[11px] font-extrabold uppercase text-cyan"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    View Blueprint →
                  </span>
                </a>
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
                background:
                  "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.14), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(30px,4vw,56px)] text-paper">
                Let&rsquo;s engineer your {cap.shortName.toLowerCase()} project.
              </h2>
              <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed text-muted">
                Tell us about your product, timeline, and goals — the Microflex team will
                review your project and walk you through structure, materials, and next steps.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/#quote-form" className="btn btn-primary">
                  Book a Consultation
                </a>
                <a href="/artwork-guidelines" className="btn btn-secondary">
                  Artwork Guidelines
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
