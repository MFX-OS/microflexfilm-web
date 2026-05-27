export default function Quality() {
  return (
    <section id="quality" className="py-16 md:py-20">
      <div className="container-x">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card flex flex-col justify-center">
            <div className="kicker mb-3">Quality</div>
            <h2 className="display text-[clamp(28px,3.4vw,48px)] text-paper">
              Quality is built into the process.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Microflex supports packaging projects with controlled workflows, documented checks,
              traceability-focused execution, and continuous improvement.
            </p>
          </div>

          <div className="card flex flex-col justify-center">
            <div className="kicker mb-3">Operating Philosophy</div>
            <h2 className="display text-[clamp(28px,3.4vw,48px)] text-paper">
              Say It. Do It.
              <br />
              <span className="text-cyan">Prove It. Evolve It.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Clear standards, controlled execution, evidence-based review, and disciplined
              improvement keep the system moving forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
