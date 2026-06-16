const CHIPS = [
  "Stand-Up Pouch", "Quad-Seal Bag", "Spouted Pouch", "Stick Pack",
  "Sachet", "Rollstock", "Shrink Sleeve", "Label",
];

export default function StudioTeaser() {
  return (
    <section id="studio" className="py-14 md:py-18">
      <div className="container-x">
        <div
          className="relative overflow-hidden rounded-4xl p-8 md:p-12"
          style={{
            border: "1px solid rgba(0,216,242,0.3)",
            background:
              "radial-gradient(circle at 85% 15%, rgba(0,216,242,0.18), transparent 40%), linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
          }}
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="kicker mb-3">New · Interactive</div>
              <h2 className="display text-[clamp(30px,4vw,56px)] text-paper">
                Design your packaging in 3D.
              </h2>
              <p className="mt-4 max-w-[560px] text-base leading-relaxed text-muted md:text-lg">
                Pick a format, finish, color, and size, drop in your artwork, and spin a live
                3D mockup — with an instant estimate. Lock the spec to start your quote.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="/configurator" className="btn btn-primary">
                  Open the 3D Studio →
                </a>
                <a href="/materials" className="btn btn-secondary">
                  Explore Materials &amp; Finishes
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {CHIPS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{
                      border: "1px solid rgba(0,216,242,0.25)",
                      background: "rgba(0,216,242,0.06)",
                      color: "#34e3f5",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="flex aspect-[4/3] items-center justify-center rounded-3xl"
              style={{
                border: "1px solid rgba(0,216,242,0.2)",
                background:
                  "radial-gradient(circle at 50% 35%, rgba(0,216,242,0.12), transparent 55%), linear-gradient(180deg, #081929, #020509)",
              }}
            >
              <div className="text-center">
                <div className="text-6xl">📦</div>
                <p className="mt-3 text-sm font-bold text-paper">Live 3D Configurator</p>
                <p className="mt-1 text-xs text-muted">Rotate · re-color · drop in artwork</p>
                <a href="/configurator" className="mt-4 inline-block text-sm font-bold text-cyan underline">
                  Try it now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
