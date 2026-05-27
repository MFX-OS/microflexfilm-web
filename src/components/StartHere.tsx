const actions = [
  {
    num: "01",
    title: "Explore Capabilities",
    body: "See packaging formats, materials, and production options.",
    cta: "Explore",
    href: "#capabilities",
  },
  {
    num: "02",
    title: "Request a Quote",
    body: "Start a quote for printed film, pouches, labels, sleeves, or custom packaging.",
    cta: "Request Quote",
    href: "#quote-form",
  },
  {
    num: "03",
    title: "Upload Artwork or PO",
    body: "Send files, purchase orders, or project documents for review.",
    cta: "Upload Files",
    href: "#client-center",
  },
  {
    num: "04",
    title: "Request Sample Kit",
    body: "Review formats, finishes, materials, and printed examples.",
    cta: "Request Samples",
    href: "#sample-kit",
  },
  {
    num: "05",
    title: "Contact Microflex",
    body: "Connect with the team for project, artwork, delivery, or invoice questions.",
    cta: "Contact",
    href: "#contact",
  },
];

export default function StartHere() {
  return (
    <section id="start" className="py-16 md:py-20">
      <div className="container-x">
        <div className="mb-8 max-w-3xl">
          <div className="kicker mb-3">Start Here</div>
          <h2 className="display text-[clamp(34px,4.3vw,62px)] text-paper">
            What do you need today?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Choose the path that best matches where you are in your packaging project.
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {actions.map((a) => (
            <a key={a.num} href={a.href} className="card flex flex-col">
              <div className="mb-5 font-black text-cyan">{a.num}</div>
              <h3 className="mb-2 text-xl font-bold text-paper" style={{ letterSpacing: "-0.026em" }}>
                {a.title}
              </h3>
              <p className="mb-4 text-sm leading-snug text-muted">{a.body}</p>
              <span
                className="mt-auto text-xs font-extrabold uppercase text-cyan"
                style={{ letterSpacing: "0.08em" }}
              >
                {a.cta} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
