import Logo from "./Logo";
import Link from "next/link";

const cols = [
  {
    title: "Products",
    links: [
      { href: "/capabilities/pouches", label: "Stand-Up Pouches" },
      { href: "/capabilities/flat-pouches", label: "Flat Pouches" },
      { href: "/capabilities/quad-seal", label: "Quad-Seal Pouches" },
      { href: "/capabilities/stick-packs", label: "Stick Packs & Sachets" },
      { href: "/capabilities/rollstock", label: "Printed Rollstock" },
      { href: "/capabilities", label: "All Formats →" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/coffee-tea", label: "Coffee & Tea" },
      { href: "/industries/snacks", label: "Snacks" },
      { href: "/industries/supplements", label: "Supplements" },
      { href: "/industries/pet", label: "Pet Food & Treats" },
      { href: "/industries/frozen-foods", label: "Frozen Foods" },
      { href: "/industries", label: "All Industries →" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/about", label: "About Microflex" },
      { href: "/materials", label: "Materials & Finishes" },
      { href: "/printing", label: "Printing Options" },
      { href: "/artwork-guidelines", label: "Artwork Guidelines" },
      { href: "/calculators", label: "Calculators" },
      { href: "/faq", label: "FAQs" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="py-14"
      style={{
        borderTop: "1px solid rgba(0,216,242,0.14)",
        background: "rgba(0,0,0,0.28)",
      }}
    >
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-[1.2fr,1fr,1fr,1fr,1.2fr]">
          <div>
            <Logo size="md" variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Flexible Packaging. Engineered to Perform.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="text-sm">
              <h4 className="mb-3 font-bold text-paper">{c.title}</h4>
              <ul className="grid gap-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-muted transition hover:text-cyan">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="text-sm text-muted">
            <h4 className="mb-3 font-bold text-paper">Contact</h4>
            <p className="leading-relaxed">
              MicroflexFilm.com
              <br />
              info@microflexfilm.com
              <br />
              909.360.9066
              <br />
              4130 Garner Rd., Riverside, CA 92501
            </p>
            <a href="/portal" className="btn btn-secondary mt-4 inline-flex" style={{ minHeight: 40, fontSize: 13 }}>
              Client Portal Login
            </a>
          </div>
        </div>

        <div
          className="mt-9 flex flex-wrap items-center justify-between gap-5 pt-5 text-xs text-muted-dark"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span>
            © {new Date().getFullYear()} Microflex Film Corporation. All rights reserved. •
            Flexible Packaging. Engineered to Perform.
          </span>
          <span className="flex items-center gap-5">
            <a
              href="/portal"
              className="hover:text-cyan transition font-semibold uppercase tracking-wider"
              style={{ letterSpacing: "0.08em" }}
            >
              Client Portal
            </a>
            <Link
              href="/terms"
              className="hover:text-cyan transition font-semibold uppercase tracking-wider"
              style={{ letterSpacing: "0.08em" }}
            >
              Terms &amp; Conditions
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
