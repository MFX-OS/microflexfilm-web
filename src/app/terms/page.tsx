import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Legal",
  description:
    "Microflex Film Corporation Terms of Use, Terms of Sale, Privacy, Intellectual Property, Warranties, and Governing Law.",
  alternates: { canonical: "https://microflexfilm.com/terms" },
};

const LAST_UPDATED = "May 30, 2026";

const sections = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "use", label: "2. Website Terms of Use" },
  { id: "sale", label: "3. Terms of Sale" },
  { id: "tolerances", label: "4. Production Tolerances" },
  { id: "ip", label: "5. Artwork & Intellectual Property" },
  { id: "confidentiality", label: "6. Confidentiality" },
  { id: "payment", label: "7. Payment Terms" },
  { id: "delivery", label: "8. Delivery, Title & Risk of Loss" },
  { id: "warranty", label: "9. Limited Warranty" },
  { id: "liability", label: "10. Limitation of Liability" },
  { id: "indemnification", label: "11. Indemnification" },
  { id: "force-majeure", label: "12. Force Majeure" },
  { id: "privacy", label: "13. Privacy" },
  { id: "cookies", label: "14. Cookies & Analytics" },
  { id: "children", label: "15. Children's Privacy" },
  { id: "california", label: "16. California Resident Rights" },
  { id: "governing-law", label: "17. Governing Law & Venue" },
  { id: "disputes", label: "18. Dispute Resolution" },
  { id: "changes", label: "19. Changes to These Terms" },
  { id: "contact", label: "20. Contact" },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Legal</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              Terms &amp; Legal
            </h1>
            <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">
              These Terms govern your use of microflexfilm.com and any commercial relationship
              with Microflex Film Corporation (&ldquo;Microflex,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;). They cover website use, sales orders,
              production, artwork, payment, warranties, privacy, and the law that applies if
              a dispute arises.
            </p>
            <p className="mt-3 text-sm text-muted-dark">
              Last updated: {LAST_UPDATED}
            </p>

            {/* Table of contents */}
            <div
              className="mt-10 rounded-2xl p-6 md:p-7"
              style={{
                border: "1px solid rgba(0,216,242,0.22)",
                background: "rgba(255,255,255,0.038)",
              }}
            >
              <h2 className="kicker mb-4 text-paper">On This Page</h2>
              <ol className="grid gap-x-8 gap-y-2 text-sm text-muted sm:grid-cols-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a className="hover:text-cyan transition" href={`#${s.id}`}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Body */}
            <article className="legal-prose mt-12">
              <Section id="acceptance" title="1. Acceptance of Terms">
                <p>
                  By accessing microflexfilm.com (the &ldquo;Site&rdquo;), requesting a quote,
                  submitting artwork, issuing a purchase order, or otherwise transacting with
                  Microflex, you agree to these Terms. If you are accepting on behalf of a
                  company, you represent that you have authority to bind that company.
                </p>
                <p>
                  If you do not agree to these Terms, do not use the Site or submit orders.
                </p>
              </Section>

              <Section id="use" title="2. Website Terms of Use">
                <p>
                  The Site and its content (text, graphics, logos, photos, code, the
                  Microflex marks, the cyan splash device, and product imagery) are owned by
                  or licensed to Microflex and are protected by U.S. and international
                  intellectual-property laws.
                </p>
                <p>You may not:</p>
                <ul>
                  <li>copy, scrape, mirror, frame, or redistribute Site content for commercial use;</li>
                  <li>reverse-engineer, decompile, or interfere with the Site or its security;</li>
                  <li>upload malware, fraudulent submissions, or false PO data;</li>
                  <li>use the Site in violation of any law, export control, or sanctions program; or</li>
                  <li>use Microflex marks without our written permission.</li>
                </ul>
                <p>
                  We may suspend or terminate access at any time, for any reason, without
                  notice.
                </p>
              </Section>

              <Section id="sale" title="3. Terms of Sale">
                <p>
                  All sales of printed film, pouches, labels, shrink sleeves, sachets, stick
                  packs, rollstock, sample kits, and any other Microflex product or service
                  (&ldquo;Products&rdquo;) are governed by these Terms unless superseded by a
                  signed master supply agreement.
                </p>
                <p>
                  <strong className="text-paper">Quotes.</strong> Microflex quotes are valid for
                  thirty (30) days from the date issued, unless stated otherwise. Quotes are
                  estimates based on the artwork, specifications, materials, run length, and
                  ship-by date the customer provides at quoting. Changes to any of those
                  inputs (including artwork revisions, material substitutions, finish changes,
                  quantity changes, or expedited timelines) may trigger a requote.
                </p>
                <p>
                  <strong className="text-paper">Orders.</strong> A binding order is formed when
                  Microflex issues an order acknowledgement against the customer&rsquo;s
                  purchase order or signed quote. The customer&rsquo;s pre-printed terms on any
                  PO are expressly rejected. Microflex&rsquo;s terms control.
                </p>
                <p>
                  <strong className="text-paper">Cancellations &amp; changes.</strong> Once
                  artwork is released to plate/cylinder, prepress, or production scheduling,
                  cancellations and material changes are subject to costs incurred up to the
                  cancellation date, including but not limited to plates, cylinders, dies,
                  prepress labor, raw material commitments, and a reasonable restocking fee.
                </p>
                <p>
                  <strong className="text-paper">Sample kits.</strong> Sample kits are provided
                  for evaluation only. Quantities, finishes, and materials shown in sample
                  kits are representative and are not a guarantee of production-run
                  appearance.
                </p>
              </Section>

              <Section id="tolerances" title="4. Production Tolerances">
                <p>
                  Flexible packaging is a manufactured product subject to standard industry
                  tolerances. By placing an order, customer accepts the following as
                  conforming product:
                </p>
                <ul>
                  <li>
                    <strong className="text-paper">Quantity variance:</strong> over-runs and
                    under-runs of up to ten percent (10%) of ordered quantity, billed at unit
                    price. Tighter tolerances available upon written request and may increase
                    pricing.
                  </li>
                  <li>
                    <strong className="text-paper">Color &amp; registration:</strong> color
                    matching to within commercially reasonable Delta E targets against an
                    approved color standard or approved press proof; minor registration shift
                    is normal.
                  </li>
                  <li>
                    <strong className="text-paper">Material gauge &amp; web width:</strong>{" "}
                    within published mil and width tolerances for the selected substrate.
                  </li>
                  <li>
                    <strong className="text-paper">Splices:</strong> roll splices are normal
                    and not a defect.
                  </li>
                  <li>
                    <strong className="text-paper">Seal &amp; pouch dimensions:</strong> within
                    standard converting tolerances.
                  </li>
                </ul>
                <p>
                  Tighter or custom tolerances must be agreed in writing and may affect
                  pricing, lead time, and yield.
                </p>
              </Section>

              <Section id="ip" title="5. Artwork & Intellectual Property">
                <p>
                  <strong className="text-paper">Customer artwork.</strong> Customer
                  represents and warrants that it owns, or has all necessary licenses,
                  permissions, and rights to use and reproduce all artwork, trademarks,
                  copyrights, photography, fonts, barcodes, claims, regulatory text, nutrition
                  facts, and other content submitted to Microflex (collectively,
                  &ldquo;Customer Content&rdquo;).
                </p>
                <p>
                  Customer grants Microflex a non-exclusive license to use Customer Content
                  solely to prepare prepress, proofs, plates, cylinders, dies, and to produce
                  and deliver the Products ordered.
                </p>
                <p>
                  <strong className="text-paper">Tooling.</strong> Plates, cylinders, dies,
                  fixtures, and other tooling produced by Microflex remain the property of
                  Microflex unless purchased outright in writing. Microflex may retire,
                  recycle, or destroy unused tooling after twenty-four (24) months of
                  inactivity.
                </p>
                <p>
                  <strong className="text-paper">Press proofs &amp; samples.</strong>{" "}
                  Production samples and press proofs may be retained by Microflex for
                  quality records, internal training, and portfolio reference unless the
                  customer requests confidential treatment in writing.
                </p>
                <p>
                  <strong className="text-paper">Microflex IP.</strong> The Microflex name, the
                  Microflex word mark, the cyan splash device, and all Site design elements
                  remain the exclusive property of Microflex Film Corporation.
                </p>
              </Section>

              <Section id="confidentiality" title="6. Confidentiality">
                <p>
                  Each party will protect the other party&rsquo;s non-public business and
                  technical information disclosed in connection with a quote or order with at
                  least the same care it uses to protect its own confidential information,
                  and will not disclose it to third parties except as needed to perform the
                  order or as required by law. This obligation survives termination for three
                  (3) years.
                </p>
              </Section>

              <Section id="payment" title="7. Payment Terms">
                <p>
                  <strong className="text-paper">Standard terms.</strong> Net thirty (30) days
                  from invoice date for approved-credit accounts. First orders, custom
                  tooling orders, and accounts without approved credit are payable by deposit
                  and balance prior to shipment, or by terms stated on the order
                  acknowledgement.
                </p>
                <p>
                  <strong className="text-paper">Late payments.</strong> Past-due balances
                  accrue interest at the lesser of one and one-half percent (1.5%) per month
                  or the maximum rate permitted by law, plus reasonable collection costs
                  including attorneys&rsquo; fees.
                </p>
                <p>
                  <strong className="text-paper">Taxes.</strong> Prices are exclusive of sales,
                  use, VAT, GST, excise, or similar taxes. Tax-exempt customers must provide
                  a valid resale or exemption certificate.
                </p>
                <p>
                  <strong className="text-paper">Currency.</strong> All invoices are in U.S.
                  Dollars unless otherwise stated.
                </p>
              </Section>

              <Section id="delivery" title="8. Delivery, Title & Risk of Loss">
                <p>
                  Unless otherwise stated on the order acknowledgement, shipment is FOB
                  Origin, Microflex&rsquo;s Riverside, California facility. Title and risk of
                  loss pass to customer when product is tendered to the carrier. Delivery
                  dates are estimates and are not guaranteed. Microflex is not liable for
                  delays caused by carriers, raw-material suppliers, customs, or events
                  outside its reasonable control.
                </p>
                <p>
                  Customer must inspect product within ten (10) business days of receipt and
                  give written notice of any non-conforming product within that period.
                  Failure to give timely notice is acceptance.
                </p>
              </Section>

              <Section id="warranty" title="9. Limited Warranty">
                <p>
                  Microflex warrants that Products will, at the time of delivery, materially
                  conform to the specifications agreed in the order acknowledgement and will
                  be free from defects in materials and workmanship under normal use.
                </p>
                <p>
                  <strong className="text-paper">Sole remedy.</strong> Customer&rsquo;s sole and
                  exclusive remedy for a breach of this warranty, and Microflex&rsquo;s sole
                  and exclusive obligation, is, at Microflex&rsquo;s option, (a) replacement
                  of the non-conforming Product, (b) re-running the order, or (c) refund of
                  the price paid for the non-conforming Product.
                </p>
                <p>
                  <strong className="text-paper">Exclusions.</strong> This warranty does not
                  cover: (i) Products that have been modified, mishandled, contaminated, or
                  stored outside recommended conditions; (ii) defects caused by Customer
                  Content, materials, or specifications; (iii) cosmetic variation within
                  industry tolerance; or (iv) issues caused by downstream filling, sealing,
                  decoration, or shipping by third parties.
                </p>
                <p>
                  <strong className="text-paper">Disclaimer.</strong> EXCEPT AS EXPRESSLY SET
                  FORTH IN THESE TERMS, MICROFLEX MAKES NO WARRANTIES, EXPRESS OR IMPLIED, AND
                  SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR
                  A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. CUSTOMER IS RESPONSIBLE FOR
                  DETERMINING SUITABILITY OF PRODUCT FOR ITS INTENDED USE, INCLUDING ANY
                  REGULATORY OR FOOD-CONTACT REQUIREMENTS APPLICABLE TO ITS FINISHED GOODS.
                </p>
              </Section>

              <Section id="liability" title="10. Limitation of Liability">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, MICROFLEX&rsquo;S AGGREGATE
                  LIABILITY ARISING OUT OF OR RELATED TO ANY ORDER, THE PRODUCTS, OR USE OF
                  THE SITE WILL NOT EXCEED THE AMOUNT ACTUALLY PAID BY CUSTOMER TO MICROFLEX
                  FOR THE SPECIFIC ORDER GIVING RISE TO THE CLAIM. IN NO EVENT WILL MICROFLEX
                  BE LIABLE FOR LOST PROFITS, LOST REVENUE, LOSS OF USE, COST OF COVER, OR ANY
                  INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE
                  DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY.
                </p>
              </Section>

              <Section id="indemnification" title="11. Indemnification">
                <p>
                  Customer will defend, indemnify, and hold harmless Microflex, its officers,
                  employees, and affiliates from and against any third-party claim, demand,
                  loss, or expense (including reasonable attorneys&rsquo; fees) arising out
                  of: (a) Customer Content, including any claim of intellectual-property
                  infringement, false advertising, defamation, or regulatory violation; (b)
                  customer&rsquo;s use, distribution, sale, or labeling of finished goods
                  incorporating the Products; and (c) customer&rsquo;s breach of these Terms.
                </p>
              </Section>

              <Section id="force-majeure" title="12. Force Majeure">
                <p>
                  Microflex is not liable for any delay or failure to perform caused by events
                  beyond its reasonable control, including but not limited to acts of God,
                  fire, flood, earthquake, pandemic, war, terrorism, civil disturbance,
                  strike, supplier failure, raw-material shortage, utility or internet
                  outage, cyberattack, or government action. Performance is suspended for the
                  duration of the event, and timelines are equitably extended.
                </p>
              </Section>

              <Section id="privacy" title="13. Privacy">
                <p>
                  <strong className="text-paper">What we collect.</strong> When you submit the
                  Site inquiry form, we collect the information you provide (name, company,
                  email, phone, request type, packaging type, SKUs, quantity, project notes).
                  We also receive standard server logs (IP address, user agent, timestamp)
                  for security and abuse prevention.
                </p>
                <p>
                  <strong className="text-paper">How we use it.</strong> We use submission data
                  solely to respond to your inquiry, prepare quotes, schedule production,
                  fulfill orders, and meet legal and accounting obligations. We do not sell
                  your information.
                </p>
                <p>
                  <strong className="text-paper">Where it is stored.</strong> Inquiry data is
                  stored in Google Cloud Firestore (United States). Email notifications are
                  routed through Google Workspace. Both are subject to Google&rsquo;s security
                  controls.
                </p>
                <p>
                  <strong className="text-paper">Retention.</strong> We retain inquiry and
                  order records for the period required for tax, audit, and warranty
                  purposes, typically seven (7) years.
                </p>
                <p>
                  <strong className="text-paper">Your choices.</strong> To request access,
                  correction, or deletion of personal information you have provided, contact{" "}
                  <a href="mailto:info@microflexfilm.com" className="text-cyan">
                    info@microflexfilm.com
                  </a>
                  .
                </p>
              </Section>

              <Section id="cookies" title="14. Cookies & Analytics">
                <p>
                  The Site uses only the cookies strictly necessary for the Site to function.
                  We do not currently run third-party advertising trackers. If we add
                  analytics or marketing cookies in the future, we will update this section
                  and, where required, present a consent banner before any non-essential
                  cookies are set.
                </p>
              </Section>

              <Section id="children" title="15. Children's Privacy">
                <p>
                  The Site is intended for business users and is not directed to children
                  under the age of thirteen (13). We do not knowingly collect personal
                  information from children. If you believe a child has submitted information
                  to us, contact us and we will delete it.
                </p>
              </Section>

              <Section id="california" title="16. California Resident Rights">
                <p>
                  California residents may have rights under the California Consumer Privacy
                  Act (CCPA) and the California Privacy Rights Act (CPRA), including the right
                  to know, the right to delete, the right to correct, and the right to
                  non-discrimination for exercising those rights. To exercise any of these
                  rights, contact{" "}
                  <a href="mailto:info@microflexfilm.com" className="text-cyan">
                    info@microflexfilm.com
                  </a>
                  . We do not sell or share personal information for cross-context behavioral
                  advertising as those terms are defined under California law.
                </p>
              </Section>

              <Section id="governing-law" title="17. Governing Law & Venue">
                <p>
                  These Terms, and any order, quote, or relationship arising from them, are
                  governed by the laws of the State of California, without regard to its
                  conflict-of-laws principles. The United Nations Convention on Contracts for
                  the International Sale of Goods does not apply. The exclusive venue for any
                  action permitted to be filed in court is the state and federal courts
                  located in Riverside County, California, and the parties consent to personal
                  jurisdiction there.
                </p>
              </Section>

              <Section id="disputes" title="18. Dispute Resolution">
                <p>
                  Before filing any action, the parties will attempt in good faith to resolve
                  the dispute by direct discussion at the senior-management level for at
                  least thirty (30) days. If unresolved, the parties may proceed to court as
                  set forth in Section 17, or, if both parties agree in writing, submit the
                  dispute to binding arbitration administered by JAMS in Riverside, California
                  under its commercial rules. Each party waives any right to a jury trial and
                  to participate in any class action.
                </p>
              </Section>

              <Section id="changes" title="19. Changes to These Terms">
                <p>
                  Microflex may update these Terms from time to time. The &ldquo;Last
                  updated&rdquo; date at the top of this page reflects the most recent
                  revision. Material changes apply prospectively to new orders placed after
                  the effective date. Continued use of the Site after an update means you
                  accept the revised Terms.
                </p>
              </Section>

              <Section id="contact" title="20. Contact">
                <p>
                  Questions about these Terms, your account, an order, or a privacy request
                  should be directed to:
                </p>
                <p>
                  <strong className="text-paper">Microflex Film Corporation</strong>
                  <br />
                  4130 Garner Rd.
                  <br />
                  Riverside, CA 92501
                  <br />
                  <a href="mailto:info@microflexfilm.com" className="text-cyan">
                    info@microflexfilm.com
                  </a>
                  <br />
                  909.360.9066
                </p>
              </Section>

              <div
                className="mt-12 rounded-2xl p-6 text-sm leading-relaxed text-muted-dark"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <strong className="text-paper">Important notice.</strong> This page is
                provided as general information about how Microflex Film Corporation does
                business. It is not legal advice. Customers should consult their own counsel
                on whether these Terms meet their requirements. For a signed master supply
                agreement with negotiated terms, contact{" "}
                <a href="mailto:info@microflexfilm.com" className="text-cyan">
                  info@microflexfilm.com
                </a>
                .
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="mb-3 text-2xl font-extrabold text-paper md:text-3xl">{title}</h2>
      <div className="space-y-3 text-base leading-relaxed text-muted">{children}</div>
    </section>
  );
}
