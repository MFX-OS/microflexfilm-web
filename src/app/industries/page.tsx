import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { industryPages } from "@/data/industryPages";

export const metadata: Metadata = {
  title: "Industries Served | Flexible Packaging by Product Type",
  description:
    "Explore flexible packaging by product category. Microflex helps brands choose pouches, rollstock, labels, sleeves, sachets, stick packs, films, finishes, and barrier structures by product need.",
  alternates: { canonical: "https://microflexfilm.com/industries" },
};

const groups: { label: string; slugs: string[] }[] = [
  {
    label: "Food & Beverage",
    slugs: [
      "coffee-packaging", "tea-packaging", "mushroom-coffee-functional-beverage-packaging",
      "snack-packaging", "chip-crisp-packaging", "popcorn-packaging", "nut-seed-trail-mix-packaging",
      "dried-fruit-packaging", "freeze-dried-food-packaging", "frozen-food-packaging",
      "beef-jerky-packaging", "meat-protein-packaging", "seafood-packaging",
      "rice-grain-packaging", "pasta-dry-goods-packaging", "spice-seasoning-packaging",
      "sauce-condiment-packaging", "liquid-gel-packaging",
    ],
  },
  {
    label: "Supplements & Wellness",
    slugs: [
      "protein-powder-packaging", "nutritional-supplement-packaging", "gummy-packaging",
      "capsule-tablet-packaging", "stick-pack-supplement-packaging", "wellness-sample-packaging",
    ],
  },
  {
    label: "Pet Products",
    slugs: ["pet-treat-packaging", "pet-food-packaging", "cat-food-treat-packaging", "freeze-dried-pet-packaging"],
  },
  {
    label: "Beauty & Personal Care",
    slugs: ["health-beauty-packaging", "cosmetic-sample-packaging", "bath-salt-refill-packaging"],
  },
  {
    label: "Retail & Specialty",
    slugs: ["natural-product-packaging", "lawn-garden-seed-packaging"],
  },
  {
    label: "Regulated & Documentation-Heavy",
    slugs: ["medical-wellness-supplies-packaging", "regulated-product-packaging"],
  },
];

export default function IndustriesHub() {
  const bySlug = Object.fromEntries(industryPages.map((p) => [p.slug, p]));
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Industries</div>
            <h1 className="display max-w-[900px] text-[clamp(36px,5vw,68px)] text-paper">
              Flexible packaging by product, risk, and market.
            </h1>
            <p className="mt-5 max-w-[780px] text-lg leading-relaxed text-muted">
              Every product places different demands on packaging. Coffee loses aroma. Snacks
              lose crunch. Powders clump. Liquids expose weak seals. Frozen products stress
              films. Pet treats need aroma control and durability. Microflex helps brands match
              package format, material structure, finish, print method, and artwork setup to
              the product inside.
            </p>
            <p className="mt-4 max-w-[780px] text-lg leading-relaxed text-muted">
              Packaging should not start with a catalog — it should start with product
              behavior. Use the industry guides below to identify the formats, materials,
              finishes, and production paths most likely to fit your product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/packaging-spec-builder" className="btn btn-primary">Build My Packaging Spec</a>
              <a href="/capabilities" className="btn btn-secondary">View Packaging Formats</a>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x grid gap-12">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="kicker mb-1">{g.label}</div>
                <div className="hairline mb-5 mt-3" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {g.slugs.map((slug) => {
                    const p = bySlug[slug];
                    if (!p) return null;
                    return (
                      <a key={slug} href={`/industries/${slug}`} className="card !min-h-0 flex flex-col">
                        <h2 className="mb-2 text-lg font-bold text-paper">{p.title}</h2>
                        <p className="mb-4 text-sm leading-relaxed text-muted">{p.metaDesc.slice(0, 110)}…</p>
                        <span className="mt-auto text-xs font-extrabold uppercase text-cyan" style={{ letterSpacing: "0.08em" }}>
                          Explore →
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}

            <div
              className="rounded-4xl p-8 text-center md:p-12"
              style={{
                border: "1px solid rgba(0,216,242,0.35)",
                background: "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.12), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(26px,3.4vw,44px)] text-paper">
                Start with what your product needs to survive.
              </h2>
              <p className="mx-auto mt-3 max-w-[600px] text-muted">
                The right package depends on fill weight, product chemistry, barrier needs,
                customer use, retail environment, filling method, artwork readiness, and
                reorder strategy.
              </p>
              <a href="/packaging-spec-builder" className="btn btn-primary mt-6 inline-flex">
                Build My Packaging Spec
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
