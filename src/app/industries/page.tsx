import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { industries } from "@/data/industries";

export const metadata: Metadata = {
  title: "Industries We Serve | Flexible Packaging by Market",
  description:
    "Microflex builds flexible packaging engineered for your category — coffee, snacks, supplements, pet, frozen, sauces, beauty, and more. Explore industry-specific packaging solutions.",
  alternates: { canonical: "https://microflexfilm.com/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Industries</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              Engineered for your category.
            </h1>
            <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">
              Every product category punishes packaging differently — coffee loses aroma,
              snacks lose crunch, liquids find weak seals. Microflex engineers structures,
              barriers, and formats around the specific demands of your market.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind) => (
                <a key={ind.slug} href={`/industries/${ind.slug}`} className="card flex flex-col">
                  <h2 className="mb-1 text-xl font-bold text-paper">{ind.name}</h2>
                  <p className="mb-3 text-sm font-bold text-cyan">{ind.tagline}</p>
                  <p className="mb-5 text-sm leading-relaxed text-muted">
                    {ind.intro.slice(0, 130)}…
                  </p>
                  <span
                    className="mt-auto text-xs font-extrabold uppercase text-cyan"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    Explore {ind.name.replace(" Packaging", "")} →
                  </span>
                </a>
              ))}
            </div>

            <div
              className="mt-10 rounded-4xl p-8 text-center md:p-12"
              style={{
                border: "1px solid rgba(0,216,242,0.35)",
                background:
                  "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.12), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(26px,3.4vw,44px)] text-paper">
                Don&rsquo;t see your category?
              </h2>
              <p className="mx-auto mt-3 max-w-[560px] text-muted">
                These are starting points, not limits. If your product needs flexible
                packaging, we can engineer for it.
              </p>
              <a href="/#quote-form" className="btn btn-primary mt-6 inline-flex">
                Talk to the Team
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
