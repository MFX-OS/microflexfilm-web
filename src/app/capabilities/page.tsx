import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { capabilities } from "@/data/capabilities";

export const metadata: Metadata = {
  title: "All Packaging Formats | Capabilities",
  description:
    "Explore every Microflex packaging format — stand-up pouches, flat pouches, quad-seal, rollstock, stick packs, labels, shrink sleeves, spouted, child-resistant, die-cut shapes, and display packaging.",
  alternates: { canonical: "https://microflexfilm.com/capabilities" },
};

export default function CapabilitiesHub() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Capabilities</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              Every format. One partner.
            </h1>
            <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">
              Twelve packaging formats, each with its own technical blueprint — dissected
              anatomy, honest fit guidance, and the engineering details that decide whether
              a format works for your product.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <a key={c.slug} href={`/capabilities/${c.slug}`} className="card flex flex-col">
                  <h2 className="mb-1 text-xl font-bold text-paper">{c.name}</h2>
                  <p className="mb-3 text-sm font-bold text-cyan">{c.tagline}</p>
                  <p className="mb-5 text-sm leading-relaxed text-muted">
                    {c.intro.slice(0, 120)}…
                  </p>
                  <span
                    className="mt-auto text-xs font-extrabold uppercase text-cyan"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    View Blueprint →
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
                Not sure which format fits?
              </h2>
              <p className="mx-auto mt-3 max-w-[560px] text-muted">
                Tell us about your product — we&rsquo;ll match the format to it, not the
                other way around.
              </p>
              <a href="/#quote-form" className="btn btn-primary mt-6 inline-flex">
                Book a Consultation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
