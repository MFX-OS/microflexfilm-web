import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Microflex Film is committed to making microflexfilm.com accessible and usable for everyone, working toward WCAG 2.1 AA.",
  alternates: { canonical: "https://microflexfilm.com/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x max-w-3xl">
            <div className="kicker mb-3">Accessibility</div>
            <h1 className="display mb-6 text-[clamp(34px,5vw,64px)] text-paper">
              Built to be usable by everyone.
            </h1>
            <div className="legal-prose text-muted">
              <p>
                Microflex Film Corporation is committed to making this website accessible to the
                widest possible audience, regardless of ability or technology. We aim to conform to
                the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.
              </p>
              <h2 className="mt-8 text-xl font-bold text-paper">What we do</h2>
              <ul>
                <li>Semantic HTML, descriptive page titles, and a &ldquo;skip to content&rdquo; link.</li>
                <li>Visible keyboard focus indicators and full keyboard operability.</li>
                <li>Respect for reduced-motion preferences and responsive, zoomable layouts.</li>
                <li>Descriptive alternative text on meaningful images and labeled form fields.</li>
                <li>Color and contrast chosen for readability against our dark interface.</li>
              </ul>
              <h2 className="mt-8 text-xl font-bold text-paper">Ongoing work</h2>
              <p>
                Accessibility is an ongoing effort. We continue to test with assistive technologies
                and refine the experience, including our interactive tools (the 3D studio and
                calculators) and the client portal.
              </p>
              <h2 className="mt-8 text-xl font-bold text-paper">Need help or found an issue?</h2>
              <p>
                If you encounter a barrier or need information in an alternative format, contact us
                at{" "}
                <a href="mailto:info@microflexfilm.com" className="font-bold text-cyan underline">info@microflexfilm.com</a>{" "}
                or 909.360.9066 and we will work to assist you and fix the issue.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
