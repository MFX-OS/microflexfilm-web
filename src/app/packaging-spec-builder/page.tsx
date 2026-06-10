import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpecBuilder from "@/components/SpecBuilder";

export const metadata: Metadata = {
  title: "Packaging Spec Builder | Flexible Packaging Recommendation Tool",
  description:
    "Build a quote-ready flexible packaging direction in minutes. Get recommended formats, barrier needs, finishes, print paths, artwork checks, and next steps from Microflex.",
  alternates: { canonical: "https://microflexfilm.com/packaging-spec-builder" },
};

export default function SpecBuilderPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Packaging Spec Builder</div>
            <h1 className="display max-w-[860px] text-[clamp(34px,4.8vw,64px)] text-paper">
              Build a quote-ready packaging direction in minutes.
            </h1>
            <p className="mt-5 max-w-[780px] text-lg leading-relaxed text-muted">
              Answer a few practical questions about your product, fill process, shelf goals,
              and run size. Microflex will generate a starting direction for format, barrier,
              material, finish, print method, artwork readiness, and quote submission.
            </p>
            <p className="mt-3 text-xs text-muted-dark">
              This tool creates a planning recommendation. Final structures, dimensions,
              materials, tolerances, and production requirements are confirmed by the Microflex
              team.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <SpecBuilder />

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Format Finder", d: "Match your product to the right format in five questions.", href: "/calculators#format-finder" },
                { t: "Barrier Selector", d: "Identify the protection your product may need.", href: "/calculators#barrier-selector" },
                { t: "Print Method Guide", d: "Compare digital and flexographic print paths.", href: "/printing" },
                { t: "Artwork Readiness", d: "Confirm your file is ready for prepress.", href: "/artwork-guidelines" },
              ].map((x) => (
                <a
                  key={x.t}
                  href={x.href}
                  className="rounded-2xl p-5 transition hover:-translate-y-1"
                  style={{ border: "1px solid rgba(0,216,242,0.2)", background: "rgba(255,255,255,0.035)" }}
                >
                  <span className="block text-base font-bold text-paper">{x.t}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{x.d}</span>
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
