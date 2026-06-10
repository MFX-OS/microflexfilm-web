import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion, { type Faq } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs | Flexible Packaging Questions Answered",
  description:
    "Answers to common flexible-packaging questions — minimums, lead times, artwork requirements, materials, printing methods, samples, and how to start a project with Microflex.",
  alternates: { canonical: "https://microflexfilm.com/faq" },
};

const faqs: Faq[] = [
  {
    q: "How do I get a quote?",
    a: "Use the Start a Project form on the homepage or book a consultation from any page. Tell us your packaging type, estimated quantity, sizes if you know them, and timeline. Your dedicated specialist reviews it and comes back with options — often more than one print or structure path so you can compare real numbers.",
  },
  {
    q: "What quantities can you produce?",
    a: "From short digital runs for testing and launches to large-scale production programs. Because we support both digital and flexographic print paths, minimums vary by format and method — tell us your target volume and we'll match the most economical path to it rather than forcing your project into one press.",
  },
  {
    q: "How long does production take?",
    a: "It depends on format, print method, and current scheduling — but you'll get an honest lead time with your quote, not a guess. Prepress items like die lines and digital proofs typically move within days. Once artwork is approved, production scheduling is locked in and we keep you updated through delivery.",
  },
  {
    q: "What file format do you need for artwork?",
    a: "Native Adobe Illustrator (.AI) files with vector die lines, text converted to outlines, CMYK color mode with Pantone spot colors for brand-critical hues, embedded images at 300+ DPI, and 0.125-inch bleed. Our full Artwork Guidelines page walks through every requirement with visuals — and our prepress team is happy to review files before you finalize.",
  },
  {
    q: "Can you help with packaging design or die lines?",
    a: "Yes. We supply dimensioned die-line templates for your chosen format and size so your designer builds on an accurate foundation. Our prepress team also reviews submitted artwork for production issues — resolution, bleed, color setup — before anything reaches press.",
  },
  {
    q: "Which pouch format is right for my product?",
    a: "It depends on your product's weight, how customers use it, where it sells, and how it's filled. Every format page on this site includes an honest fit guide — and if you'd rather just ask, a specialist will match the format to your product in a single conversation. Start at the Capabilities page to compare blueprints.",
  },
  {
    q: "What barrier protection does my product need?",
    a: "Match the barrier to what degrades your product: moisture barriers keep crunchy things crunchy, oxygen barriers protect fats and roasted products from staleness, light barriers protect actives and colors, and aroma barriers keep coffee smelling like coffee. Our Materials page breaks down each system — and we spec the exact structure to your product and shelf-life target.",
  },
  {
    q: "Do you offer sustainable packaging options?",
    a: "Yes — recycle-ready mono-material structures, post-consumer recycled (PCR) content, down-gauged lightweight constructions, and paper-based looks with functional barriers. The right path depends on your product's barrier needs; we'll walk you through the trade-offs honestly.",
  },
  {
    q: "Can I see and feel materials before ordering?",
    a: "Absolutely — request a sample kit. It includes formats, finishes, and material references so you can feel matte versus soft-touch and see print quality firsthand before committing to a direction.",
  },
  {
    q: "Do you provide quality documentation like COAs?",
    a: "Yes. We're an SQF-certified facility and support programs with certificates of analysis, material specification sheets, and food-contact compliance documentation. Tell us what your quality, retailer, or regulatory process requires and we'll confirm what's available for your program.",
  },
  {
    q: "Can you print digitally for a test run and then scale up later?",
    a: "That's exactly the path we're built for. Start digital with no plate costs to validate your design in-market, then move to flexographic printing as volume grows — same partner, same specialist, consistent brand colors at every stage.",
  },
  {
    q: "How do reorders work?",
    a: "Fast. Your specs, artwork, and production history stay on file with your dedicated specialist. Clients with portal access can rerun a previous order in two clicks — exactly as before, or with noted changes — from the Client Portal. Otherwise, one email starts the rerun.",
  },
  {
    q: "Where are you located and where do you ship?",
    a: "We manufacture in Riverside, California — solar-powered, made in the USA — and ship nationwide. Domestic production means responsive lead times, easier communication, and no overseas supply-chain surprises.",
  },
  {
    q: "What industries do you serve?",
    a: "Food and beverage leads — coffee, snacks, confection, frozen, sauces — alongside supplements, pet products, health and beauty, lawn and garden, medical-adjacent, and more. Browse the Industries section for category-specific guidance, or just ask: if it needs flexible packaging, we can likely engineer for it.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">FAQs</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              Questions, answered straight.
            </h1>
            <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">
              The questions every packaging buyer asks, answered without the runaround. Don&rsquo;t
              see yours? The team answers the phone — 909.360.9066.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <FaqAccordion faqs={faqs} />
            </div>

            <div
              className="mx-auto mt-10 max-w-3xl rounded-4xl p-8 text-center md:p-12"
              style={{
                border: "1px solid rgba(0,216,242,0.35)",
                background: "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.12), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(26px,3.4vw,44px)] text-paper">
                Still have questions?
              </h2>
              <p className="mx-auto mt-3 max-w-[480px] text-muted">
                A packaging specialist can answer most questions in one conversation.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/#quote-form" className="btn btn-primary">Book a Consultation</a>
                <a href="/#contact" className="btn btn-secondary">Contact Us</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
