const steps = [
  { n: "01", title: "Consult", body: "We learn about your product, goals, timeline, market, and packaging requirements." },
  { n: "02", title: "Engineer", body: "We recommend the right structure, material, finish, and production path." },
  { n: "03", title: "Prepress", body: "We prepare artwork, dielines, layouts, proofs, and technical specifications." },
  { n: "04", title: "Produce", body: "Your packaging is manufactured with precision, consistency, and controlled standards." },
  { n: "05", title: "Finish & QC", body: "We inspect, finish, and review packaging to support quality and performance." },
  { n: "06", title: "Deliver", body: "We prepare your order for reliable delivery, communication, and continued support." },
];

export default function Process() {
  return (
    <section id="process" className="py-16 md:py-20">
      <div className="container-x">
        <div className="mb-9 max-w-3xl">
          <div className="kicker mb-3">Process</div>
          <h2 className="display text-[clamp(34px,4.3vw,62px)] text-paper">
            A controlled path from quote to delivery.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Microflex guides packaging projects through structured intake, quoting, artwork review,
            proofing, production, quality review, and delivery.
          </p>
        </div>

        <div
          className="rounded-[38px] p-8 shadow-deep"
          style={{
            border: "1px solid rgba(0,216,242,0.20)",
            background:
              "radial-gradient(circle at 90% 12%, rgba(0,216,242,0.16), transparent 32%), rgba(255,255,255,0.04)",
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(2,6,10,0.55)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <strong className="mb-3 block text-sm text-cyan">{s.n}</strong>
                <h3 className="mb-2 text-base font-bold text-paper">{s.title}</h3>
                <p className="text-sm leading-snug text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
