const PORTAL_URL = "/portal";

const tiles = [
  { letter: "A", title: "Request Quote", body: "Start a new project or request pricing for an existing packaging need.", cta: "Start", href: "#quote-form" },
  { letter: "B", title: "Upload Artwork", body: "Send artwork files, notes, SKU names, and project details for review.", cta: "Upload", href: "#quote-form" },
  { letter: "C", title: "Upload PO", body: "Submit a purchase order for a quote, reorder, or approved project.", cta: "Submit PO", href: "#quote-form" },
  { letter: "D", title: "Project Support", body: "Contact us about an active project, proof, delivery, or invoice question.", cta: "Support", href: "#contact" },
  { letter: "E", title: "Sample Kit", body: "Request packaging samples, finishes, cards, and product references.", cta: "Samples", href: "#sample-kit" },
];

export default function ClientCenter() {
  return (
    <section id="client-center" className="py-16 md:py-20">
      <div className="container-x">
        <div className="mb-9 max-w-3xl">
          <div className="kicker mb-3">Client Center</div>
          <h2 className="display text-[clamp(34px,4.3vw,62px)] text-paper">
            Send files, purchase orders, and project details.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Use the Client Center to continue an active packaging project, upload artwork, submit
            a purchase order, request support, or contact the Microflex team.
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {tiles.map((t) => (
            <a key={t.letter} href={t.href} className="card flex flex-col">
              <div className="mb-5 font-black text-cyan">{t.letter}</div>
              <h3 className="mb-2 text-xl font-bold text-paper">{t.title}</h3>
              <p className="mb-4 text-sm leading-snug text-muted">{t.body}</p>
              <span
                className="mt-auto text-xs font-extrabold uppercase text-cyan"
                style={{ letterSpacing: "0.08em" }}
              >
                {t.cta} →
              </span>
            </a>
          ))}
        </div>

        {/* Client Portal — existing clients sign in to the Microflex OS portal to
            review quotes, approve pricing, sign sales orders, and track jobs. */}
        <a
          href={PORTAL_URL}
          className="card mt-6 flex flex-col items-start gap-4 border-cyan/40 sm:flex-row sm:items-center"
        >
          <div className="flex-1">
            <h3 className="mb-1 text-xl font-bold text-paper">Client Portal Login</h3>
            <p className="text-sm leading-snug text-muted">
              Already working with us? Sign in with Google to view current and pending
              orders, submit requests, and reorder previous runs with one click.
            </p>
          </div>
          <span
            className="btn btn-primary shrink-0"
            style={{ letterSpacing: "0.04em" }}
          >
            Open Client Portal →
          </span>
        </a>
      </div>
    </section>
  );
}
