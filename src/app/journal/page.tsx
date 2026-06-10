import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JournalIndex from "@/components/JournalIndex";

export const metadata: Metadata = {
  title: "Packaging Engineering Journal | Flexible Packaging Guides",
  description:
    "Practical flexible packaging articles on formats, films, barriers, finishes, print methods, artwork, quote strategy, sustainability, production readiness, and packaging cost.",
  alternates: { canonical: "https://microflexfilm.com/journal" },
};

export default function JournalPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Packaging Engineering Journal</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              Packaging Engineering Journal
            </h1>
            <p className="mt-5 max-w-[780px] text-lg leading-relaxed text-muted">
              Practical packaging guidance for brands that need to test, launch, and scale.
              Learn how to choose formats, materials, barriers, finishes, print paths, artwork
              setup, quote inputs, and production workflows before your next flexible packaging
              project.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/packaging-spec-builder" className="btn btn-primary">Build My Packaging Spec</a>
              <a href="/#quote-form" className="btn btn-secondary">Request a Quote</a>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="container-x">
            <JournalIndex />
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <div
              className="rounded-4xl p-8 text-center md:p-12"
              style={{
                border: "1px solid rgba(0,216,242,0.35)",
                background: "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.12), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(26px,3.4vw,44px)] text-paper">
                Need help applying this to your product?
              </h2>
              <p className="mx-auto mt-3 max-w-[640px] text-muted">
                Microflex can review your product type, fill weight, barrier concerns, format
                options, artwork status, quantity, SKU count, and timeline to help identify a
                practical packaging direction.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/packaging-spec-builder" className="btn btn-primary">Build My Packaging Spec</a>
                <a href="/#quote-form" className="btn btn-secondary">Request a Quote</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
