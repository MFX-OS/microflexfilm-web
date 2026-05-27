export default function Showcase() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-x">
        <div
          className="panel-light grid items-center gap-6 overflow-hidden p-10 md:grid-cols-[0.95fr_1.05fr] md:p-12"
        >
          <div>
            <div className="kicker mb-3 text-cyan-600">Product Family</div>
            <h2 className="display text-[clamp(32px,4vw,56px)] text-ink">
              Versatile solutions built for your brand.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-dark">
              Microflex supports brands across flexible packaging, printed film, labels, pouches,
              sachets, stick packs, sample programs, and custom packaging systems designed to look
              sharp, protect well, and scale with your business.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#quote-form" className="btn btn-primary">
                Request a Quote
              </a>
              <a href="#capabilities" className="btn btn-dark">
                View Capabilities
              </a>
            </div>
          </div>

          {/* Product family visual — light-theme variant */}
          <ProductFamilyVisual />
        </div>
      </div>
    </section>
  );
}

function ProductFamilyVisual() {
  return (
    <div className="relative aspect-[5/4] w-full rounded-2xl bg-mist p-6">
      <svg viewBox="0 0 500 400" className="h-full w-full" aria-hidden>
        {/* Pouch */}
        <g transform="translate(60,80)">
          <path
            d="M0 20 L80 20 L85 200 Q85 215 70 215 L15 215 Q0 215 0 200 Z"
            fill="#06121d"
            stroke="#00d8f2"
            strokeWidth="1.5"
          />
          <rect x="25" y="10" width="35" height="12" rx="2" fill="#06121d" />
          <rect x="10" y="45" width="65" height="6" fill="#00d8f2" />
          <rect x="10" y="60" width="50" height="3" fill="#00d8f2" opacity="0.6" />
        </g>
        {/* Roll */}
        <g transform="translate(180,110)">
          <ellipse cx="60" cy="20" rx="60" ry="12" fill="#06121d" stroke="#00d8f2" strokeWidth="1.5" />
          <path d="M0 20 L0 170 Q0 185 60 185 Q120 185 120 170 L120 20" fill="#06121d" stroke="#00d8f2" strokeWidth="1.5" />
          <ellipse cx="60" cy="20" rx="40" ry="8" fill="#0c2133" />
          <ellipse cx="60" cy="20" rx="18" ry="3.5" fill="#00d8f2" opacity="0.6" />
        </g>
        {/* Stick packs */}
        <g transform="translate(330,100)">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${i * 28},0)`}>
              <rect width="22" height="180" rx="3" fill="#06121d" stroke="#00d8f2" strokeWidth="1.2" />
              <rect x="2" y="30" width="18" height="4" fill="#00d8f2" />
              <rect x="2" y="42" width="14" height="2" fill="#00d8f2" opacity="0.5" />
            </g>
          ))}
        </g>
        {/* Label */}
        <g transform="translate(60,310)">
          <rect width="180" height="50" rx="6" fill="#06121d" stroke="#00d8f2" strokeWidth="1.5" />
          <rect x="14" y="14" width="80" height="6" fill="#00d8f2" />
          <rect x="14" y="26" width="120" height="3" fill="#00d8f2" opacity="0.6" />
          <circle cx="155" cy="25" r="11" fill="#00d8f2" opacity="0.5" />
        </g>
        {/* Box */}
        <g transform="translate(280,300)">
          <path d="M0 30 L60 10 L120 30 L120 80 L60 100 L0 80 Z" fill="#06121d" stroke="#00d8f2" strokeWidth="1.5" />
          <path d="M0 30 L60 50 L120 30" fill="none" stroke="#00d8f2" strokeWidth="1.5" />
          <path d="M60 50 L60 100" fill="none" stroke="#00d8f2" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
