export default function ContactBlock() {
  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="container-x">
        <div
          className="grid items-center gap-7 rounded-[42px] p-10 shadow-deep md:grid-cols-[0.95fr_1.05fr] md:p-12"
          style={{
            border: "1px solid rgba(0,216,242,0.22)",
            background:
              "radial-gradient(circle at 84% 28%, rgba(0,216,242,0.19), transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
          }}
        >
          <div>
            <div className="kicker mb-3">Contact</div>
            <h2 className="display text-[clamp(30px,3.6vw,52px)] text-paper">
              Ready to build your next packaging project?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              Start with a quote request, upload artwork, send a purchase order, or connect with
              the Microflex team.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#quote-form" className="btn btn-primary">
                Start a Project
              </a>
              <a href="mailto:info@microflexfilm.com" className="btn btn-secondary">
                Email Microflex
              </a>
            </div>
          </div>

          <div
            className="rounded-[32px] p-7 md:p-8"
            style={{
              border: "1px solid rgba(0,216,242,0.22)",
              background: "rgba(255,255,255,0.045)",
            }}
          >
            <h3 className="mb-3 text-xl font-bold text-paper">
              Microflex Film Corporation
            </h3>
            <p className="leading-relaxed text-muted">
              MicroflexFilm.com
              <br />
              <a href="mailto:info@microflexfilm.com" className="text-paper hover:text-cyan">
                info@microflexfilm.com
              </a>
              <br />
              <a href="tel:9093609066" className="text-paper hover:text-cyan">
                909.360.9066
              </a>
              <br />
              4130 Garner Rd.
              <br />
              Riverside, CA 92501
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
