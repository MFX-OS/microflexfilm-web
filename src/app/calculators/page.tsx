import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackagingCalculators from "@/components/PackagingCalculators";

export const metadata: Metadata = {
  title: "Packaging Calculators | Size, Rollstock & Pallet Estimators",
  description:
    "Free interactive packaging calculators — estimate pouch size from fill weight, rollstock film requirements for your run, and case/pallet counts for logistics planning.",
  alternates: { canonical: "https://microflexfilm.com/calculators" },
};

export default function CalculatorsPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Packaging Calculators</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              Ballpark it before you quote it.
            </h1>
            <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">
              Quick interactive estimators for the numbers every packaging project starts
              with — what size pouch your product needs, how much film a run consumes, and
              how the finished order palletizes. Estimates, not quotes — but they&rsquo;ll get
              your planning into the right zip code.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <PackagingCalculators />

            <div
              className="mt-10 rounded-4xl p-8 text-center md:p-12"
              style={{
                border: "1px solid rgba(0,216,242,0.35)",
                background:
                  "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.12), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(26px,3.4vw,44px)] text-paper">
                Ready for real numbers?
              </h2>
              <p className="mx-auto mt-3 max-w-[560px] text-muted">
                A quote turns estimates into engineered specs and firm pricing — usually
                with more than one option to compare.
              </p>
              <a href="/#quote-form" className="btn btn-primary mt-6 inline-flex">
                Request a Quote
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
