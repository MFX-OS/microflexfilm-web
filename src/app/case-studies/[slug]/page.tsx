import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { caseStudies } from "@/data/caseStudies";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) return { title: "Case Study" };
  return {
    title: `${c.title} | Case Study`,
    description: c.summary,
    alternates: { canonical: `https://microflexfilm.com/case-studies/${c.slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.summary,
    about: c.industry,
    publisher: { "@type": "Organization", name: "Microflex Film Corporation" },
  };

  return (
    <>
      <Header />
      <main id="top">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x max-w-3xl">
            <a href="/case-studies" className="text-sm font-bold text-cyan">← All case studies</a>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.06)", color: "#34e3f5" }}>{c.industry}</span>
              {c.representative && (
                <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider" style={{ border: "1px solid rgba(169,185,200,0.3)", color: "#a9b9c8" }}>Representative example</span>
              )}
            </div>
            <h1 className="display mt-4 text-[clamp(32px,4.5vw,60px)] text-paper">{c.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{c.summary}</p>
            <p className="mt-3 text-sm font-bold text-cyan">{c.client} · {c.format}</p>
          </div>
        </section>

        <section className="pb-12">
          <div className="container-x max-w-3xl">
            {/* metrics */}
            <div className="mb-10 grid grid-cols-3 gap-3">
              {c.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl p-4 text-center" style={{ border: "1px solid rgba(0,216,242,0.2)", background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-lg font-black text-cyan md:text-2xl">{m.value}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="legal-prose text-muted">
              <h2 className="text-xl font-bold text-paper">The challenge</h2>
              <p>{c.challenge}</p>
              <h2 className="mt-8 text-xl font-bold text-paper">Our approach</h2>
              <p>{c.approach}</p>
              <h2 className="mt-8 text-xl font-bold text-paper">The result</h2>
              <p>{c.result}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="/#quote-form" className="btn btn-primary">Start your project</a>
              <a href="/configurator" className="btn btn-secondary">Design it in 3D</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
