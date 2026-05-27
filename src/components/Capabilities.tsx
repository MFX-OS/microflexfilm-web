const caps = [
  {
    title: "Pouches & Flexible Packaging",
    body: "Shelf-ready pouch formats designed for presentation, protection, and product delivery.",
    cta: "Start Pouch Project",
    visual: "pouch",
  },
  {
    title: "Labels & Stickers",
    body: "Durable, brand-forward labels for clean product presentation and production consistency.",
    cta: "Request Label Support",
    visual: "label",
  },
  {
    title: "Printed Film / Rollstock",
    body: "Rollstock and printed film engineered for performance, shelf impact, and scalable production.",
    cta: "Request Film Quote",
    visual: "roll",
  },
  {
    title: "Bottles & Specialty Formats",
    body: "Brand-ready packaging support across specialty formats, materials, and presentation needs.",
    cta: "Discuss Specialty Packaging",
    visual: "bottle",
  },
  {
    title: "Stick Packs & Sachets",
    body: "Small-format, portion-controlled packaging for samples, powders, liquids, and single-serve products.",
    cta: "Start Sachet Project",
    visual: "stick",
  },
  {
    title: "Display & Shipping Packaging",
    body: "Boxes, sample presentations, and shipping support for customer-ready packaging systems.",
    cta: "View Packaging Support",
    visual: "box",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-16 md:py-20">
      <div className="container-x">
        <div className="mb-9 max-w-3xl">
          <div className="kicker mb-3">Capabilities</div>
          <h2 className="display text-[clamp(34px,4.3vw,62px)] text-paper">
            Packaging formats built around your product.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            From printed film and flexible packaging to pouches, labels, shrink sleeves, sachets,
            and specialty formats, Microflex supports packaging projects from concept through
            production.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caps.map((c) => (
            <article key={c.title} className="card flex min-h-[400px] flex-col">
              <CapVisual kind={c.visual} />
              <h3 className="mb-2 text-xl font-bold text-paper">{c.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted">{c.body}</p>
              <a
                href="#quote-form"
                className="mt-auto inline-block text-xs font-extrabold uppercase text-cyan"
                style={{ letterSpacing: "0.08em" }}
              >
                {c.cta} →
              </a>
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-dark">
          Visuals are placeholders — drop real product photography into <code className="font-mono">/public/images/</code> and update the
          <code className="font-mono"> CapVisual</code> component to render them.
        </p>
      </div>
    </section>
  );
}

function CapVisual({ kind }: { kind: string }) {
  // Stylized placeholder mock-ups — light frame, dark "product" silhouette.
  return (
    <div
      className="-mx-2 mb-5 flex h-[200px] items-center justify-center overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(180deg, #f8fbfd, #ffffff)",
        boxShadow: "inset 0 0 0 1px rgba(6,18,29,0.08)",
      }}
    >
      <svg viewBox="0 0 200 160" className="h-full w-auto p-3" aria-hidden>
        {kind === "pouch" && (
          <>
            <path
              d="M55 30 L145 30 L150 130 Q150 145 135 145 L65 145 Q50 145 50 130 Z"
              fill="#0c2133"
              stroke="#00d8f2"
              strokeWidth="1.5"
            />
            <rect x="85" y="20" width="30" height="12" rx="2" fill="#0c2133" />
            <rect x="65" y="55" width="70" height="6" fill="#00d8f2" opacity="0.7" />
            <rect x="65" y="68" width="50" height="3" fill="#00d8f2" opacity="0.4" />
            <rect x="65" y="76" width="50" height="3" fill="#00d8f2" opacity="0.4" />
          </>
        )}
        {kind === "label" && (
          <>
            <rect x="30" y="50" width="140" height="60" rx="6" fill="#0c2133" stroke="#00d8f2" strokeWidth="1.5" />
            <rect x="45" y="65" width="60" height="6" fill="#00d8f2" opacity="0.7" />
            <rect x="45" y="78" width="100" height="3" fill="#00d8f2" opacity="0.4" />
            <rect x="45" y="86" width="80" height="3" fill="#00d8f2" opacity="0.4" />
            <circle cx="150" cy="80" r="10" fill="#00d8f2" opacity="0.5" />
          </>
        )}
        {kind === "roll" && (
          <>
            <ellipse cx="100" cy="50" rx="55" ry="10" fill="#0c2133" stroke="#00d8f2" strokeWidth="1.5" />
            <path d="M45 50 L45 120 Q45 130 100 130 Q155 130 155 120 L155 50" fill="#0c2133" stroke="#00d8f2" strokeWidth="1.5" />
            <ellipse cx="100" cy="50" rx="40" ry="7" fill="#061421" />
            <ellipse cx="100" cy="50" rx="20" ry="3.5" fill="#00d8f2" opacity="0.5" />
            <rect x="45" y="80" width="110" height="3" fill="#00d8f2" opacity="0.4" />
            <rect x="45" y="95" width="110" height="3" fill="#00d8f2" opacity="0.4" />
          </>
        )}
        {kind === "bottle" && (
          <>
            <rect x="85" y="20" width="30" height="20" rx="3" fill="#0c2133" />
            <path d="M75 40 L75 140 Q75 145 80 145 L120 145 Q125 145 125 140 L125 40 Z" fill="#0c2133" stroke="#00d8f2" strokeWidth="1.5" />
            <rect x="80" y="70" width="40" height="40" fill="#00d8f2" opacity="0.2" />
            <rect x="85" y="80" width="30" height="3" fill="#00d8f2" />
            <rect x="85" y="90" width="20" height="2" fill="#00d8f2" opacity="0.6" />
          </>
        )}
        {kind === "stick" && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={40 + i * 32} y="30" width="22" height="100" rx="2" fill="#0c2133" stroke="#00d8f2" strokeWidth="1.2" />
                <rect x={42 + i * 32} y="50" width="18" height="3" fill="#00d8f2" opacity="0.7" />
                <rect x={42 + i * 32} y="58" width="14" height="2" fill="#00d8f2" opacity="0.4" />
                <rect x={42 + i * 32} y="100" width="18" height="3" fill="#00d8f2" opacity="0.5" />
              </g>
            ))}
          </>
        )}
        {kind === "box" && (
          <>
            <path d="M40 60 L100 35 L160 60 L160 130 L100 155 L40 130 Z" fill="#0c2133" stroke="#00d8f2" strokeWidth="1.5" />
            <path d="M40 60 L100 85 L160 60" fill="none" stroke="#00d8f2" strokeWidth="1.5" />
            <path d="M100 85 L100 155" fill="none" stroke="#00d8f2" strokeWidth="1.5" />
            <rect x="55" y="100" width="35" height="4" fill="#00d8f2" opacity="0.6" />
            <rect x="55" y="112" width="25" height="3" fill="#00d8f2" opacity="0.4" />
          </>
        )}
      </svg>
    </div>
  );
}
