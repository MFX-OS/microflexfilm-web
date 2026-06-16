import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { glossaryTerms } from "@/data/glossary";

export const metadata: Metadata = {
  title: "Flexible Packaging Glossary | Terms & Definitions",
  description:
    "A clear glossary of flexible packaging terms — rollstock, lamination, barrier films, BOPP, PET, foil, mono-material, MOQ, degassing valves, and more — defined in plain language.",
  alternates: { canonical: "https://microflexfilm.com/glossary" },
};

export default function GlossaryPage() {
  const sorted = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Flexible Packaging Glossary",
    url: "https://microflexfilm.com/glossary",
    hasDefinedTerm: sorted.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.def })),
  };

  return (
    <>
      <Header />
      <BreadcrumbsJsonLd items={[
        { name: "Home", url: "https://microflexfilm.com" },
        { name: "Glossary", url: "https://microflexfilm.com/glossary" },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Reference</div>
            <h1 className="display mb-4 text-[clamp(34px,5vw,64px)] text-paper">
              Flexible Packaging Glossary
            </h1>
            <p className="max-w-[720px] text-lg leading-relaxed text-muted">
              Plain-language definitions of the formats, materials, and methods behind flexible
              packaging — so you can speak the language and spec with confidence.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="container-x">
            <dl className="grid gap-4 md:grid-cols-2">
              {sorted.map((t) => (
                <div
                  key={t.term}
                  id={t.term.toLowerCase().replace(/[^\w]+/g, "-")}
                  className="rounded-2xl p-5"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
                >
                  <dt className="text-base font-bold text-paper">{t.term}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">{t.def}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="/configurator" className="btn btn-primary">Design your package in 3D</a>
              <a href="/#quote-form" className="btn btn-secondary">Start a Project</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
