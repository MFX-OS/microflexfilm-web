import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortalApp from "@/components/portal/PortalApp";

export const metadata: Metadata = {
  title: "Client Portal",
  description:
    "Microflex client workspace — sign in to view current and pending orders, submit requests, and reorder previous runs with one click.",
  alternates: { canonical: "https://microflexfilm.com/portal" },
  robots: { index: false },
};

export default function PortalPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Client Center</div>
            <h1 className="display mb-8 text-[clamp(36px,5vw,68px)] text-paper">
              Client Portal
            </h1>
            <PortalApp />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
