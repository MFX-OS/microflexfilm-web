import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfiguratorMount from "@/components/configurator/ConfiguratorMount";

export const metadata: Metadata = {
  title: "3D Packaging Configurator | Microflex Film",
  description:
    "Design your flexible packaging in 3D — choose format, finish, color, and size, drop in your artwork, see a live mockup, and get an instant estimate. Stand-up pouches, rollstock, shrink sleeves, labels and more.",
  alternates: { canonical: "https://microflexfilm.com/configurator" },
};

export default function ConfiguratorPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-12 md:py-16">
          <div className="container-x">
            <div className="kicker mb-3">Build My Spec</div>
            <h1 className="display mb-3 text-[clamp(34px,5vw,64px)] text-paper">3D Packaging Studio</h1>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Configure your package live — format, finish, color, and size — drop in your artwork,
              and see a real-time 3D mockup with an instant estimate. Lock the spec to start a quote.
            </p>
            <ConfiguratorMount />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
