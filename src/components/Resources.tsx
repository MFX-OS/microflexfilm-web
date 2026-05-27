const resources = [
  {
    title: "Artwork Checklist",
    body: "Prepare files, dimensions, colors, dielines, and production details before submitting artwork.",
    cta: "Upload Artwork",
    href: "#client-center",
  },
  {
    title: "Quote Checklist",
    body: "Gather packaging type, quantities, SKUs, materials, finishes, and timeline details.",
    cta: "Request Quote",
    href: "#quote-form",
  },
  {
    title: "Material & Finish Guide",
    body: "Review matte, gloss, metallic, clear, custom, and barrier performance options.",
    cta: "Explore Materials",
    href: "#capabilities",
  },
];

export default function Resources() {
  return (
    <section id="resources" className="py-16 md:py-20">
      <div className="container-x">
        <div className="mb-9 max-w-3xl">
          <div className="kicker mb-3">Resources</div>
          <h2 className="display text-[clamp(34px,4.3vw,62px)] text-paper">
            Prepare your packaging project faster.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Use these resources to prepare artwork, quote information, sample requests, and
            production details before contacting Microflex.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((r) => (
            <a key={r.title} href={r.href} className="card flex flex-col">
              <h3 className="mb-2 text-xl font-bold text-paper">{r.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted">{r.body}</p>
              <span
                className="mt-auto text-xs font-extrabold uppercase text-cyan"
                style={{ letterSpacing: "0.08em" }}
              >
                {r.cta} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
