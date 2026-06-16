import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { serviceAreas } from "@/data/serviceAreas";

export const metadata: Metadata = {
  title: "Service Areas | Flexible Packaging Across Southern California",
  description:
    "Flexible packaging for Southern California brands — coffee, supplements, and more. Made in Riverside, shipped fast across the Inland Empire, LA, Orange County, and San Diego.",
  alternates: { canonical: "https://microflexfilm.com/service-areas" },
};

export default function ServiceAreasIndex() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Service Areas</div>
            <h1 className="display mb-4 text-[clamp(34px,5vw,64px)] text-paper">
              Packaging, close to home.
            </h1>
            <p className="max-w-[700px] text-lg leading-relaxed text-muted">
              Microflex manufactures flexible packaging in Riverside, California — serving brands
              across Southern California and shipping nationwide. Explore packaging by industry and
              region.
            </p>
          </div>
        </section>
        <section className="pb-20">
          <div className="container-x">
            <div className="grid gap-5 md:grid-cols-2">
              {serviceAreas.map((s) => (
                <Link key={s.slug} href={`/service-areas/${s.slug}`} className="card !min-h-0 block transition hover:-translate-y-1">
                  <div className="kicker mb-2">{s.region}</div>
                  <h2 className="text-xl font-black text-paper">{s.industry}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.metaDesc}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-cyan">View →</span>
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
