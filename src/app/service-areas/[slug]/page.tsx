import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { serviceAreas, getServiceArea } from "@/data/serviceAreas";

export function generateStaticParams() {
  return serviceAreas.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getServiceArea(slug);
  if (!s) return { title: "Service Area" };
  return {
    title: s.seoTitle,
    description: s.metaDesc,
    alternates: { canonical: `https://microflexfilm.com/service-areas/${s.slug}` },
  };
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getServiceArea(slug);
  if (!s) notFound();

  const url = `https://microflexfilm.com/service-areas/${s.slug}`;
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${s.industry} — ${s.region}`,
    serviceType: s.industry,
    areaServed: s.region,
    provider: { "@type": "Organization", name: "Microflex Film Corporation", url: "https://microflexfilm.com" },
    description: s.metaDesc,
    url,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <Header />
      <BreadcrumbsJsonLd items={[
        { name: "Home", url: "https://microflexfilm.com" },
        { name: "Service Areas", url: "https://microflexfilm.com/service-areas" },
        { name: `${s.industry} · ${s.region}`, url },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">{s.region}</div>
            <h1 className="display max-w-[900px] text-[clamp(34px,5vw,64px)] text-paper">{s.h1}</h1>
            <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">{s.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#quote-form" className="btn btn-primary">Get a Quote</a>
              <a href="/configurator" className="btn btn-secondary">Design it in 3D</a>
              <a href="/#sample-kit" className="btn btn-secondary">Request Samples</a>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        <section className="py-14 md:py-18">
          <div className="container-x">
            <div className="grid gap-4 md:grid-cols-3">
              {s.challenges.map((c) => (
                <div key={c.title} className="card !min-h-0">
                  <h2 className="mb-2 text-lg font-bold text-paper">{c.title}</h2>
                  <p className="text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-6">
          <div className="container-x">
            <div className="kicker mb-3">Recommended formats &amp; options</div>
            <div className="flex flex-wrap gap-2">
              {s.formats.map((f) => (
                <span key={f} className="rounded-full px-4 py-2 text-sm font-bold" style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)", color: "#bdd0dc" }}>{f}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-18">
          <div className="container-x max-w-3xl">
            <div className="rounded-4xl p-7 md:p-9" style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(255,255,255,0.03)" }}>
              <div className="kicker mb-2">Why local matters</div>
              <p className="text-base leading-relaxed text-paper md:text-lg">{s.localAngle}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.related.map((r) => (
                  <a key={r.href} href={r.href} className="text-sm font-bold text-cyan underline">{r.label} →</a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container-x max-w-3xl">
            <h2 className="display mb-6 text-[clamp(26px,3.4vw,44px)] text-paper">Common questions</h2>
            <div className="grid gap-3">
              {s.faq.map((f) => (
                <div key={f.q} className="rounded-2xl p-5" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                  <h3 className="mb-2 text-base font-bold text-paper">{f.q}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <a href="/#quote-form" className="btn btn-primary">Start your project</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
