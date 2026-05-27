import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Thanks — we'll be in touch",
};

export default function ThankYou() {
  return (
    <>
      <Header />
      <main id="top" className="flex min-h-[70vh] items-center">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="kicker mb-5">Inquiry received</div>
            <h1 className="display text-[clamp(36px,5vw,64px)] text-paper">
              Thanks — your inquiry is on the floor.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              A member of the Microflex Film team will follow up within one business day with
              specs, lead times, and a quote.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn btn-primary">
                Back home
              </Link>
              <Link href="/#capabilities" className="btn btn-secondary">
                See capabilities
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
