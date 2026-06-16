import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-24 md:py-32">
          <div className="container-x text-center">
            <div className="kicker mb-3">404</div>
            <h1 className="display mb-4 text-[clamp(40px,7vw,84px)] text-paper">
              This page took a different run.
            </h1>
            <p className="mx-auto mb-8 max-w-[560px] text-lg leading-relaxed text-muted">
              The page you&rsquo;re after moved or never existed. Let&rsquo;s get you back to
              something useful.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/" className="btn btn-primary">Back to Home</a>
              <a href="/capabilities" className="btn btn-secondary">Explore Capabilities</a>
              <a href="/configurator" className="btn btn-secondary">3D Studio</a>
              <a href="/#quote-form" className="btn btn-secondary">Start a Project</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
