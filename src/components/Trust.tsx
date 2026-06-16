/* Trust layer — stats band, industries strip (real internal links), and
   testimonials. Replace the TESTIMONIALS placeholders with real client quotes
   when you have approvals; the structure and styling are production-ready. */

const STATS: { value: string; label: string }[] = [
  { value: "SQF", label: "Certified facility" },
  { value: "USA", label: "Manufactured domestically" },
  { value: "100%", label: "Solar-powered operations" },
  { value: "10+", label: "Packaging formats" },
];

const INDUSTRIES: { label: string; href: string }[] = [
  { label: "Coffee & Tea", href: "/industries/coffee-packaging" },
  { label: "Supplements", href: "/industries/nutritional-supplement-packaging" },
  { label: "Protein Powder", href: "/industries/protein-powder-packaging" },
  { label: "Snacks", href: "/industries/snack-packaging" },
  { label: "Pet Food & Treats", href: "/industries/pet-food-packaging" },
  { label: "Frozen Foods", href: "/industries/frozen-food-packaging" },
  { label: "Gummies", href: "/industries/gummy-packaging" },
  { label: "Health & Beauty", href: "/industries/health-beauty-packaging" },
];

const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "Microflex turned our quote around fast and gave us two structure options to compare. The pouches ran clean on our filler the first time.",
    name: "Operations Lead",
    role: "Specialty Coffee Brand",
  },
  {
    quote:
      "Artwork review caught issues before plates. Color matched our brand across the whole run — roll 1 looked like roll 50.",
    name: "Founder",
    role: "Supplement Startup",
  },
  {
    quote:
      "Domestic production and a real person on our account made reorders effortless. Lead times we could actually plan around.",
    name: "Supply Chain Manager",
    role: "Pet Treat Company",
  },
];

export default function Trust() {
  return (
    <section className="py-14 md:py-18">
      <div className="container-x">
        {/* Stats band */}
        <div
          className="grid grid-cols-2 gap-4 rounded-4xl p-6 md:grid-cols-4 md:p-8"
          style={{ border: "1px solid rgba(0,216,242,0.2)", background: "rgba(255,255,255,0.03)" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="display text-[clamp(28px,3.6vw,48px)] text-cyan">{s.value}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-widest text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Industries strip */}
        <div className="mt-10">
          <div className="kicker mb-3 text-center">Trusted across categories</div>
          <div className="flex flex-wrap justify-center gap-2">
            {INDUSTRIES.map((i) => (
              <a
                key={i.href}
                href={i.href}
                className="rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5"
                style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)", color: "#bdd0dc" }}
              >
                {i.label}
              </a>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="card !min-h-0">
              <div className="mb-3 text-2xl text-cyan">&ldquo;</div>
              <blockquote className="text-sm leading-relaxed text-paper">{t.quote}</blockquote>
              <figcaption className="mt-4 text-xs text-muted">
                <span className="font-bold text-paper">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
