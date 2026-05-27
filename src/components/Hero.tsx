export default function Hero() {
  return (
    <section className="hero relative isolate grid-backdrop py-20 md:py-24">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="kicker mb-3">
              Flexible Packaging • Labels • Pouches • Printed Film
            </div>
            <h1 className="display text-[clamp(48px,7vw,96px)] text-paper">
              Flexible Packaging.
              <br />
              <span className="text-cyan">Engineered to Perform.</span>
            </h1>
            <p className="mt-7 max-w-[690px] text-lg leading-relaxed text-muted md:text-xl">
              Microflex helps brands produce printed film, pouches, labels, shrink sleeves,
              sachets, stick packs, and custom flexible packaging with disciplined production,
              artwork control, and quality-focused execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote-form" className="btn btn-primary">
                Start a Project
              </a>
              <a href="#capabilities" className="btn btn-secondary">
                Explore Capabilities
              </a>
              <a href="#client-center" className="btn btn-secondary">
                Upload Artwork or PO
              </a>
            </div>

            <div className="mt-8 grid max-w-[650px] grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["SQF Certified Facility", "Food-safety-aligned packaging operations."],
                ["Manufactured in the USA", "Responsive domestic production support."],
                ["Solar-Powered Operations", "Responsible energy use and modern operations."],
              ].map(([title, sub]) => (
                <div
                  key={title}
                  className="rounded-2xl border px-4 py-3.5"
                  style={{
                    borderColor: "rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.038)",
                  }}
                >
                  <strong className="block text-sm text-paper">{title}</strong>
                  <span className="mt-1 block text-xs leading-snug text-muted opacity-75">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <HeroStage />
        </div>
      </div>
    </section>
  );
}

function HeroStage() {
  return (
    <div
      className="relative overflow-hidden rounded-[42px] shadow-deep"
      style={{
        minHeight: 590,
        border: "1px solid rgba(0,216,242,0.23)",
        background:
          "radial-gradient(circle at 84% 18%, rgba(0,216,242,0.22), transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
      }}
      aria-label="Microflex product family preview"
    >
      <div
        className="absolute rounded-[32px] overflow-hidden"
        style={{
          inset: 28,
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at 70% 20%, rgba(0,216,242,0.19), transparent 29%), linear-gradient(180deg, #081929 0%, #020509 92%)",
        }}
      >
        <div className="absolute left-[34px] right-[34px] top-[34px] z-10 flex items-start justify-between gap-5">
          <div className="flex-1 border-b-[3px] border-cyan pb-5">
            <strong className="display block text-[clamp(46px,4.8vw,70px)] text-paper">
              Microflex
            </strong>
            <span
              className="mt-4 block text-[11px] uppercase text-cyan"
              style={{ letterSpacing: "0.55em" }}
            >
              Film Corporation
            </span>
          </div>
          <div
            className="hidden w-[168px] rounded-[22px] p-4 text-xs leading-snug text-muted backdrop-blur-md sm:block"
            style={{
              border: "1px solid rgba(0,216,242,0.28)",
              background: "rgba(2,5,9,0.62)",
            }}
          >
            <b className="mb-1 block text-sm text-paper">Packaging Systems</b>
            Formats, finishes, labels, rollstock, samples, and client-ready packaging programs.
          </div>
        </div>

        <ProductCollage />
      </div>
    </div>
  );
}

function ProductCollage() {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[260px] flex items-end justify-center gap-3 px-8 pb-8">
      {[
        { tag: "Stand-Up Pouch", h: 280 },
        { tag: "Stick Pack", h: 240 },
        { tag: "Rollstock", h: 300 },
        { tag: "Label", h: 220 },
      ].map((item, i) => (
        <div
          key={item.tag}
          className="relative flex-1 rounded-2xl border"
          style={{
            height: item.h,
            maxWidth: 120,
            borderColor: "rgba(0,216,242,0.30)",
            background:
              i % 2 === 0
                ? "linear-gradient(180deg, #0c2133 0%, #061421 100%)"
                : "linear-gradient(180deg, #0e2840 0%, #06192a 100%)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-2 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,216,242,0.10) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-3 text-center">
            <span
              className="inline-block rounded-full bg-black/40 px-2 py-1 font-mono text-[9px] uppercase text-cyan"
              style={{ letterSpacing: "0.18em" }}
            >
              {item.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
