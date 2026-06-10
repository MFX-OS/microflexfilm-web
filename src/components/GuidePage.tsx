import FaqAccordion from "@/components/FaqAccordion";
import QuoteChecklist from "@/components/QuoteChecklist";
import type { IndustryPage } from "@/data/industryPages";

/* Map a format/category name from copy to a capability blueprint link */
export function formatHref(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("stand-up") || n.includes("stand up")) return "/capabilities/pouches";
  if (n.includes("flat-bottom") || n.includes("quad")) return "/capabilities/quad-seal";
  if (n.includes("3-side") || n.includes("flat pouch") || n.includes("flat /")) return "/capabilities/flat-pouches";
  if (n.includes("rollstock") || n.includes("roll stock")) return "/capabilities/rollstock";
  if (n.includes("label")) return "/capabilities/labels";
  if (n.includes("sleeve")) return "/capabilities/specialty";
  if (n.includes("stick")) return "/capabilities/stick-packs";
  if (n.includes("sachet")) return "/capabilities/stick-packs";
  if (n.includes("spout") || n.includes("fitment")) return "/capabilities/spouted-pouches";
  if (n.includes("child")) return "/capabilities/child-resistant";
  if (n.includes("die-cut") || n.includes("die cut")) return "/capabilities/die-cut";
  if (n.includes("fin seal") || n.includes("fin-seal") || n.includes("flow wrap")) return "/capabilities/fin-seal";
  if (n.includes("display") || n.includes("carton") || n.includes("case")) return "/capabilities/display";
  if (n.includes("valve")) return "/capabilities/pouches";
  if (n.includes("pouch")) return "/capabilities/pouches";
  return null;
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="kicker mb-2"><span className="font-mono">{n}</span></div>
      <h2 className="display mb-4 text-[clamp(26px,3.2vw,42px)] text-paper">{title}</h2>
      {children}
    </div>
  );
}

function GuidanceCard({ label, text }: { label: string; text: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(255,255,255,0.032)" }}
    >
      <div className="kicker mb-2 text-[10px]">{label}</div>
      <p className="text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

export default function GuidePage({
  page,
  related,
  relatedTitle,
  basePath,
}: {
  page: IndustryPage;
  related: { slug: string; title: string }[];
  relatedTitle: string;
  basePath: string;
}) {
  const p = page;
  const chips = p.formats.length > 0 ? p.formats : p.categories;
  const chipsTitle = p.formats.length > 0 ? "Recommended formats" : "Common product categories";

  return (
    <main id="top">
      {/* Hero */}
      <section className="grid-backdrop relative py-14 md:py-20">
        <div className="container-x">
          <div className="kicker mb-3">{p.eyebrow}</div>
          <h1 className="display max-w-[900px] text-[clamp(32px,4.4vw,60px)] text-paper">{p.h1}</h1>
          <p className="mt-5 max-w-[780px] text-lg leading-relaxed text-muted">{p.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/packaging-spec-builder" className="btn btn-primary">{p.primaryCta}</a>
            <a href="/#quote-form" className="btn btn-secondary">Request a Quote</a>
          </div>
        </div>
      </section>

      <div className="container-x"><div className="hairline" /></div>

      {/* What it solves + formats */}
      <section className="py-14 md:py-18">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <Section n="01" title="What this packaging has to solve.">
            <p className="text-lg leading-relaxed text-muted">{p.solve}</p>
          </Section>
          <div>
            <div className="kicker mb-4 text-[10px]">{chipsTitle}</div>
            <div className="grid gap-2.5">
              {chips.map((f) => {
                const href = formatHref(f);
                return href ? (
                  <a
                    key={f}
                    href={href}
                    className="flex items-center justify-between rounded-2xl p-4 transition hover:-translate-y-0.5"
                    style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)" }}
                  >
                    <span className="text-sm font-bold text-paper">{f}</span>
                    <span className="text-[11px] font-extrabold uppercase text-cyan" style={{ letterSpacing: "0.08em" }}>
                      Blueprint →
                    </span>
                  </a>
                ) : (
                  <div
                    key={f}
                    className="rounded-2xl p-4"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <span className="text-sm font-bold text-muted-light">{f}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="container-x"><div className="hairline" /></div>

      {/* Engineering direction */}
      <section className="py-14 md:py-18">
        <div className="container-x">
          <Section n="02" title="Engineering direction.">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {p.material && <GuidanceCard label="Material & barrier" text={p.material} />}
              {p.finish && <GuidanceCard label="Finish & shelf strategy" text={p.finish} />}
              {p.printPath && <GuidanceCard label="Print path" text={p.printPath} />}
              {p.evaluate && <GuidanceCard label="How to evaluate this option" text={p.evaluate} />}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/materials" className="btn btn-secondary" style={{ minHeight: 42, fontSize: 13 }}>
                Explore Materials & Barriers
              </a>
              <a href="/printing" className="btn btn-secondary" style={{ minHeight: 42, fontSize: 13 }}>
                Compare Print Paths
              </a>
              <a href="/calculators" className="btn btn-secondary" style={{ minHeight: 42, fontSize: 13 }}>
                Packaging Tools & Calculators
              </a>
            </div>
          </Section>
        </div>
      </section>

      {p.mistakes.length > 0 && (
        <>
          <div className="container-x"><div className="hairline" /></div>
          <section className="py-14 md:py-18">
            <div className="container-x">
              <Section n="03" title="Common mistakes to avoid.">
                <div className="grid gap-3 md:grid-cols-2">
                  {p.mistakes.map((m) => (
                    <div
                      key={m}
                      className="flex gap-3 rounded-2xl p-4"
                      style={{ border: "1px solid rgba(255,120,120,0.25)", background: "rgba(255,80,80,0.05)" }}
                    >
                      <span className="font-black" style={{ color: "#ff9d9d" }}>✕</span>
                      <span className="text-sm leading-relaxed text-muted-light">{m}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </section>
        </>
      )}

      <div className="container-x"><div className="hairline" /></div>

      {/* Quote checklist (interactive) */}
      <section className="py-14 md:py-18">
        <div className="container-x">
          <Section n="04" title="What to send for a faster quote.">
            <QuoteChecklist items={p.send} context={p.title} />
          </Section>
        </div>
      </section>

      {/* CTA block */}
      <section className="py-6">
        <div className="container-x">
          <div
            className="rounded-4xl p-8 text-center md:p-12"
            style={{
              border: "1px solid rgba(0,216,242,0.35)",
              background: "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.14), transparent 60%), rgba(255,255,255,0.03)",
            }}
          >
            <h2 className="display text-[clamp(26px,3.4vw,44px)] text-paper">{p.ctaHead}</h2>
            <p className="mx-auto mt-3 max-w-[640px] leading-relaxed text-muted">{p.ctaBody}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/packaging-spec-builder" className="btn btn-primary">{p.primaryCta}</a>
              <a href="/#quote-form" className="btn btn-secondary">Request a Quote</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {p.faqs.length > 0 && (
        <section className="py-14 md:py-18">
          <div className="container-x">
            <Section n="05" title="Frequently asked.">
              <div className="max-w-3xl">
                <FaqAccordion faqs={p.faqs} />
              </div>
            </Section>
          </div>
        </section>
      )}

      {/* Related */}
      <section className="pb-16 md:pb-20">
        <div className="container-x">
          <div className="kicker mb-5">{relatedTitle}</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <a
                key={r.slug}
                href={`${basePath}/${r.slug}`}
                className="rounded-2xl p-4 transition hover:-translate-y-1"
                style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(255,255,255,0.03)" }}
              >
                <span className="block text-sm font-bold text-paper">{r.title}</span>
                <span className="mt-1 block text-[11px] font-extrabold uppercase text-cyan" style={{ letterSpacing: "0.08em" }}>
                  Explore →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
