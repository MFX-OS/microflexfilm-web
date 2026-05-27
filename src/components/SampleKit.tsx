export default function SampleKit() {
  return (
    <section id="sample-kit" className="py-16 md:py-20">
      <div className="container-x">
        <div
          className="grid items-center gap-8 rounded-[42px] p-10 shadow-deep md:grid-cols-[0.95fr_1.05fr] md:p-12"
          style={{
            border: "1px solid rgba(0,216,242,0.22)",
            background:
              "radial-gradient(circle at 84% 28%, rgba(0,216,242,0.19), transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
          }}
        >
          <div>
            <div className="kicker mb-3">Sample Kit</div>
            <h2 className="display text-[clamp(30px,3.6vw,52px)] text-paper">
              See the materials before you commit.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              Request a Microflex sample kit to explore packaging formats, materials, finishes,
              reference cards, and printed examples before starting your next project.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#quote-form" className="btn btn-primary">
                Request a Sample Kit
              </a>
              <a href="#resources" className="btn btn-secondary">
                View Resources
              </a>
            </div>
          </div>

          <SampleVisual />
        </div>
      </div>
    </section>
  );
}

function SampleVisual() {
  return (
    <div
      className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(180deg, #081929 0%, #020509 100%)",
        boxShadow: "inset 0 0 0 1px rgba(0,216,242,0.15)",
      }}
    >
      <svg viewBox="0 0 500 400" className="h-full w-full" aria-hidden>
        {/* Sample kit box */}
        <g transform="translate(80,100)">
          <rect width="340" height="200" rx="8" fill="#0c2133" stroke="#00d8f2" strokeWidth="1.5" />
          <rect x="20" y="20" width="100" height="60" rx="4" fill="#102a40" stroke="#00d8f2" strokeWidth="1" />
          <rect x="30" y="30" width="60" height="6" fill="#00d8f2" />
          <rect x="30" y="42" width="80" height="3" fill="#00d8f2" opacity="0.5" />
          <rect x="140" y="20" width="100" height="60" rx="4" fill="#102a40" stroke="#00d8f2" strokeWidth="1" />
          <rect x="150" y="30" width="60" height="6" fill="#00d8f2" />
          <rect x="150" y="42" width="80" height="3" fill="#00d8f2" opacity="0.5" />
          <rect x="260" y="20" width="60" height="60" rx="4" fill="#102a40" stroke="#00d8f2" strokeWidth="1" />
          <circle cx="290" cy="50" r="14" fill="#00d8f2" opacity="0.6" />

          <rect x="20" y="100" width="100" height="80" rx="4" fill="#102a40" stroke="#00d8f2" strokeWidth="1" />
          <rect x="30" y="115" width="80" height="50" rx="3" fill="#00d8f2" opacity="0.3" />
          <rect x="140" y="100" width="100" height="80" rx="4" fill="#102a40" stroke="#00d8f2" strokeWidth="1" />
          <rect x="150" y="115" width="50" height="50" fill="#00d8f2" opacity="0.4" />
          <rect x="260" y="100" width="60" height="80" rx="4" fill="#102a40" stroke="#00d8f2" strokeWidth="1" />
          <path d="M270 130 L310 130 M270 145 L310 145 M270 160 L290 160" stroke="#00d8f2" strokeWidth="1.5" />
        </g>
        <text x="250" y="60" textAnchor="middle" fill="#00d8f2" fontSize="14" fontFamily="monospace" letterSpacing="4">
          MICROFLEX SAMPLE KIT
        </text>
      </svg>
    </div>
  );
}
