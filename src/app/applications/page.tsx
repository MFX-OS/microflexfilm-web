import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { applicationPages } from "@/data/applicationPages";

export const metadata: Metadata = {
  title: "Flexible Packaging Applications | Barriers, Formats & Features",
  description:
    "Explore flexible packaging applications by function: high barrier, moisture control, oxygen protection, resealable pouches, clear windows, rollstock, sachets, labels, sleeves, and more.",
  alternates: { canonical: "https://microflexfilm.com/applications" },
};

export default function ApplicationsHub() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Applications</div>
            <h1 className="display max-w-[900px] text-[clamp(36px,5vw,68px)] text-paper">
              Flexible packaging applications by performance need.
            </h1>
            <p className="mt-5 max-w-[780px] text-lg leading-relaxed text-muted">
              Some buyers know their product category. Others know the problem they need
              packaging to solve. Use these application guides to compare barrier needs, pouch
              features, finishes, rollstock paths, labels, sleeves, sample formats, and
              quote-ready packaging specifications.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/packaging-spec-builder" className="btn btn-primary">Build My Spec</a>
              <a href="/industries" className="btn btn-secondary">Browse by Industry Instead</a>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {applicationPages.map((p) => (
                <a key={p.slug} href={`/applications/${p.slug}`} className="card !min-h-0 flex flex-col">
                  <h2 className="mb-2 text-lg font-bold text-paper">{p.title}</h2>
                  <p className="mb-4 text-sm leading-relaxed text-muted">{p.metaDesc.slice(0, 110)}…</p>
                  <span className="mt-auto text-xs font-extrabold uppercase text-cyan" style={{ letterSpacing: "0.08em" }}>
                    Explore →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
