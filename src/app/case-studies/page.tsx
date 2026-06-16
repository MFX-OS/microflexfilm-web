import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { caseStudies } from "@/data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies | Real Packaging Outcomes",
  description:
    "How brands solved real packaging problems with Microflex — formats, finishes, and barriers engineered to product, process, and shelf-life targets.",
  alternates: { canonical: "https://microflexfilm.com/case-studies" },
};

export default function CaseStudiesIndex() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Case Studies</div>
            <h1 className="display mb-4 text-[clamp(36px,5vw,68px)] text-paper">
              Packaging that performed.
            </h1>
            <p className="max-w-[680px] text-lg leading-relaxed text-muted">
              Real problems, engineered solutions. Here&rsquo;s how brands moved from generic
              packaging to specs built around their product, process, and shelf-life target.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="container-x">
            <div className="grid gap-5 md:grid-cols-2">
              {caseStudies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className="card !min-h-0 block transition hover:-translate-y-1"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider" style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.06)", color: "#34e3f5" }}>
                      {c.industry}
                    </span>
                    {c.representative && (
                      <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider" style={{ border: "1px solid rgba(169,185,200,0.3)", color: "#a9b9c8" }}>
                        Representative
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-paper">{c.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.summary}</p>
                  <p className="mt-3 text-xs font-bold text-cyan">{c.format}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-cyan">Read the story →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
