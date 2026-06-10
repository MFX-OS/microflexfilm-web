import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreflightChecklist from "@/components/PreflightChecklist";

export const metadata: Metadata = {
  title: "Artwork Guidelines | Prepress & File Prep",
  description:
    "Microflex artwork submission guidelines for packaging print: native .AI files, 300 DPI imagery, outlined fonts, CMYK + Pantone color, die lines, bleeds, and the pre-flight checklist.",
  alternates: { canonical: "https://microflexfilm.com/artwork-guidelines" },
};

const specs = [
  { value: ".AI", label: "Native Illustrator" },
  { value: "300+", label: "DPI at 100% scale" },
  { value: "CMYK", label: "+ Pantone Solid Coated" },
  { value: "0.125″", label: "Bleed past die line" },
];

const toc = [
  { id: "format", label: "01 — File Format & Layout Setup" },
  { id: "fonts", label: "02 — Fonts, Text & Die Lines" },
  { id: "color", label: "03 — Color Modes & Profiles" },
  { id: "bleed", label: "04 — Bleeds & Safety Margins" },
  { id: "checklist", label: "05 — Pre-Flight Checklist" },
];

/* ---------- Visuals ---------- */

function VectorVsRaster() {
  return (
    <svg viewBox="0 0 560 240" className="w-full" role="img" aria-label="Vector artwork stays sharp; low-resolution raster artwork pixelates">
      {/* Vector side */}
      <rect x="8" y="8" width="264" height="190" rx="18" fill="rgba(0,216,242,0.06)" stroke="rgba(0,216,242,0.45)" />
      <text x="140" y="120" textAnchor="middle" fontSize="92" fontWeight="900" fill="#00d8f2" fontFamily="Inter, sans-serif">A</text>
      <circle cx="40" cy="40" r="10" fill="none" stroke="#34e3f5" strokeWidth="2" />
      <path d="M226 36 l16 16 M242 36 l-16 16" stroke="#34e3f5" strokeWidth="2" />
      <text x="140" y="178" textAnchor="middle" fontSize="13" fontWeight="800" fill="#f7fbff" fontFamily="Inter, sans-serif" letterSpacing="2">VECTOR — STAYS SHARP</text>
      <text x="140" y="222" textAnchor="middle" fontSize="12" fill="#a9b9c8" fontFamily="Inter, sans-serif">Mathematically defined. Scales infinitely.</text>

      {/* Raster side */}
      <rect x="288" y="8" width="264" height="190" rx="18" fill="rgba(255,80,80,0.05)" stroke="rgba(255,120,120,0.35)" />
      {/* pixelated A built from blocks */}
      <g fill="#ff8d8d" opacity="0.9">
        <rect x="404" y="48" width="16" height="16" />
        <rect x="420" y="48" width="16" height="16" />
        <rect x="388" y="64" width="16" height="16" />
        <rect x="436" y="64" width="16" height="16" />
        <rect x="388" y="80" width="16" height="16" />
        <rect x="436" y="80" width="16" height="16" />
        <rect x="372" y="96" width="16" height="16" />
        <rect x="388" y="96" width="16" height="16" />
        <rect x="404" y="96" width="16" height="16" />
        <rect x="420" y="96" width="16" height="16" />
        <rect x="436" y="96" width="16" height="16" />
        <rect x="452" y="96" width="16" height="16" />
        <rect x="372" y="112" width="16" height="16" />
        <rect x="452" y="112" width="16" height="16" />
        <rect x="356" y="128" width="16" height="16" />
        <rect x="468" y="128" width="16" height="16" />
      </g>
      <text x="420" y="178" textAnchor="middle" fontSize="13" fontWeight="800" fill="#f7fbff" fontFamily="Inter, sans-serif" letterSpacing="2">LOW-RES RASTER — REJECTED</text>
      <text x="420" y="222" textAnchor="middle" fontSize="12" fill="#a9b9c8" fontFamily="Inter, sans-serif">72 DPI or upscaled images pixelate on press.</text>
    </svg>
  );
}

function LayersPanel() {
  const layers = [
    { name: "DIE LINE — spot color, overprint", tone: "#ff5fa2", top: true },
    { name: "Text (outlined)", tone: "#00d8f2", top: false },
    { name: "Vector graphics", tone: "#00d8f2", top: false },
    { name: "Embedded images (300 DPI)", tone: "#7fa6bd", top: false },
    { name: "Background / bleed", tone: "#7fa6bd", top: false },
  ];
  return (
    <div
      className="overflow-hidden rounded-2xl font-mono text-xs"
      style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(2,5,9,0.6)" }}
    >
      <div
        className="px-4 py-2.5 font-bold uppercase tracking-widest text-muted"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
      >
        Layers
      </div>
      {layers.map((l) => (
        <div
          key={l.name}
          className="flex items-center gap-3 px-4 py-3"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: l.top ? "rgba(255,95,162,0.08)" : "transparent",
          }}
        >
          <span className="text-muted-dark">👁</span>
          <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: l.tone }} />
          <span className={l.top ? "font-bold text-paper" : "text-muted"}>{l.name}</span>
          {l.top && (
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(255,95,162,0.18)", color: "#ff8fbe" }}
            >
              Top layer
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function ColorSwatches() {
  const cmyk = [
    { c: "#00b7eb", l: "C" },
    { c: "#ec008c", l: "M" },
    { c: "#ffe600", l: "Y" },
    { c: "#1a1a1a", l: "K" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center">
        {cmyk.map((s, i) => (
          <div
            key={s.l}
            className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-black md:h-20 md:w-20"
            style={{
              background: s.c,
              color: s.l === "Y" ? "#1a1a1a" : "#fff",
              marginLeft: i === 0 ? 0 : -14,
              border: "3px solid #061421",
              mixBlendMode: "screen",
            }}
          >
            {s.l}
          </div>
        ))}
      </div>
      <div
        className="rounded-xl p-4"
        style={{ border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)" }}
      >
        <div className="mb-2 h-10 w-36 rounded-md" style={{ background: "#00d8f2" }} />
        <div className="font-mono text-xs font-bold text-paper">PANTONE 311 C</div>
        <div className="text-[11px] text-muted">Solid Coated — brand critical</div>
      </div>
    </div>
  );
}

function BleedDiagram() {
  return (
    <svg viewBox="0 0 560 360" className="w-full" role="img" aria-label="Bleed extends past the die line; critical content stays inside the safety margin">
      {/* Bleed zone */}
      <rect x="40" y="28" width="480" height="280" rx="14" fill="rgba(0,216,242,0.05)" stroke="#34e3f5" strokeWidth="1.5" strokeDasharray="7 5" />
      {/* Die line */}
      <rect x="88" y="62" width="384" height="212" rx="10" fill="rgba(255,255,255,0.03)" stroke="#ff5fa2" strokeWidth="2.5" />
      {/* Safety margin */}
      <rect x="136" y="96" width="288" height="144" rx="8" fill="rgba(0,216,242,0.07)" stroke="#00d8f2" strokeWidth="1.5" strokeDasharray="3 4" />
      <text x="280" y="158" textAnchor="middle" fontSize="15" fontWeight="800" fill="#f7fbff" fontFamily="Inter, sans-serif">SAFE ZONE</text>
      <text x="280" y="182" textAnchor="middle" fontSize="11.5" fill="#a9b9c8" fontFamily="Inter, sans-serif">Text · logos · barcodes · regulatory icons</text>

      {/* Labels */}
      <g fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700">
        <text x="48" y="20" fill="#34e3f5">BLEED — extend art 0.125″ past die line</text>
        <text x="96" y="54" fill="#ff8fbe">DIE LINE — cut/crease path (spot color, overprint)</text>
        <text x="144" y="124" fill="#00d8f2" fontSize="11">SAFETY — keep content 0.125″ inside</text>
      </g>

      {/* Dimension arrows */}
      <g stroke="#a9b9c8" strokeWidth="1.2">
        <line x1="472" y1="330" x2="520" y2="330" />
        <line x1="472" y1="324" x2="472" y2="336" />
        <line x1="520" y1="324" x2="520" y2="336" />
      </g>
      <text x="496" y="352" textAnchor="middle" fontSize="11" fill="#a9b9c8" fontFamily="Inter, sans-serif">0.125″</text>
      <g stroke="#a9b9c8" strokeWidth="1.2">
        <line x1="40" y1="330" x2="88" y2="330" />
        <line x1="40" y1="324" x2="40" y2="336" />
        <line x1="88" y1="324" x2="88" y2="336" />
      </g>
      <text x="64" y="352" textAnchor="middle" fontSize="11" fill="#a9b9c8" fontFamily="Inter, sans-serif">0.125″</text>
    </svg>
  );
}

/* ---------- Building blocks ---------- */

function SectionHeading({
  n,
  id,
  title,
  intro,
}: {
  n: string;
  id: string;
  title: string;
  intro: string;
}) {
  return (
    <div id={id} className="mb-8 scroll-mt-28 max-w-3xl">
      <div className="kicker mb-3">
        <span className="font-mono">{n}</span>
      </div>
      <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">{title}</h2>
      <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>
    </div>
  );
}

function Rule({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "1px solid rgba(0,216,242,0.16)", background: "rgba(255,255,255,0.032)" }}
    >
      <h3 className="mb-1.5 font-bold text-paper">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function RiskCallout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="mt-4 rounded-2xl p-5"
      style={{ border: "1px solid rgba(255,120,120,0.35)", background: "rgba(255,80,80,0.06)" }}
    >
      <div
        className="mb-1.5 text-xs font-extrabold uppercase"
        style={{ color: "#ff9d9d", letterSpacing: "0.18em" }}
      >
        ⚠ {label}
      </div>
      <p className="text-sm leading-relaxed text-muted-light">{children}</p>
    </div>
  );
}

/* ---------- Page ---------- */

export default function ArtworkGuidelinesPage() {
  return (
    <>
      <Header />
      <main id="top">
        {/* Hero */}
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Prepress &amp; Artwork</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              Artwork Submission Guidelines
            </h1>
            <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">
              Precision packaging starts with precision files. To guarantee sharp text,
              accurate color, and scannable barcodes on press, every final layout must
              follow the setup standards below before it reaches our prepress team.
            </p>

            {/* Spec strip */}
            <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-5 text-center"
                  style={{
                    border: "1px solid rgba(0,216,242,0.22)",
                    background: "rgba(255,255,255,0.038)",
                  }}
                >
                  <div className="font-mono text-2xl font-black text-cyan md:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <RiskCallout label="Why it matters">
              Files that miss these specifications may cause production delays or incur
              additional file-correction fees. Two minutes of pre-flight saves days on
              the schedule.
            </RiskCallout>

            {/* TOC */}
            <div
              className="mt-8 rounded-2xl p-6"
              style={{
                border: "1px solid rgba(0,216,242,0.22)",
                background: "rgba(255,255,255,0.038)",
              }}
            >
              <div className="kicker mb-4">On This Page</div>
              <ol className="grid gap-x-8 gap-y-2 text-sm text-muted sm:grid-cols-2">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a className="transition hover:text-cyan" href={`#${t.id}`}>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* 01 — File format */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <SectionHeading
              n="01"
              id="format"
              title="Required file format & layout setup."
              intro="We enforce a strict native-vector standard to protect structural and visual integrity across our packaging lines. The master file is always a native Adobe Illustrator (.AI) document."
            />
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div className="card !min-h-0 flex items-center">
                <VectorVsRaster />
              </div>
              <div className="grid gap-3">
                <Rule title="Native .AI master file">
                  All die lines, structural markings, text layers, vector illustrations, and
                  barcodes must remain live, unflattened vector elements within the
                  Illustrator document. Packaging lines require crisp, mathematically defined
                  lines — vector format guarantees legibility and barcode scanning compliance.
                </Rule>
                <Rule title="The 100% scale rule">
                  Raster images (.PSD, .TIFF, high-res .PNG) placed in the layout must be
                  built at 100% of their actual physical print size from the project&rsquo;s
                  inception — never scaled up inside Illustrator.
                </Rule>
                <Rule title="Resolution: 300 DPI minimum">
                  Placed images need a minimum effective resolution of 300 DPI at final
                  physical dimensions. For intricate graphics or small detailed imagery,
                  600 DPI is preferred.
                </Rule>
                <Rule title="Asset management">
                  Explicitly <strong className="text-paper">Embed</strong> all placed images
                  into the .AI file, or supply the raw assets in a separate
                  &ldquo;Links&rdquo; folder with your submission.
                </Rule>
                <RiskCallout label="Production risk">
                  Upscaling a low-resolution graphic — like placing a 72 DPI web image or
                  stretching a small file to fill a panel — causes pixelation and an
                  immediate rejection of the print run.
                </RiskCallout>
              </div>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* 02 — Fonts & die lines */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <SectionHeading
              n="02"
              id="fonts"
              title="Fonts, text & die lines."
              intro="Lock down all type before saving the final file — this prevents typographic shifts, missing-font errors, and layout alterations on our prepress workstations."
            />
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div className="grid gap-3">
                <Rule title="Convert all text to outlines">
                  Select every text layer and run{" "}
                  <span className="font-mono text-cyan">Type → Create Outlines</span>{" "}
                  (<span className="font-mono">⌘⇧O</span> /{" "}
                  <span className="font-mono">Ctrl+Shift+O</span>). This converts type to
                  vector shapes and removes all font dependencies.
                </Rule>
                <Rule title="Die lines on a dedicated layer">
                  Structural die lines live on a completely separate, clearly labeled layer
                  at the <strong className="text-paper">top</strong> of the layers panel.
                </Rule>
                <Rule title="Spot color + overprint">
                  The die line must be designated as a spot color and set to{" "}
                  <strong className="text-paper">Overprint</strong> so it never prints onto
                  the physical artwork.
                </Rule>
              </div>
              <div className="card !min-h-0">
                <div className="kicker mb-4 text-[10px]">Correct layer structure</div>
                <LayersPanel />
              </div>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* 03 — Color */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <SectionHeading
              n="03"
              id="color"
              title="Color modes & profiles."
              intro="Screen color (RGB) does not translate directly to physical ink. Files submitted in the wrong color mode undergo automatic conversion — which can drastically alter the printed result."
            />
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div className="card !min-h-0 flex items-center justify-center py-10">
                <ColorSwatches />
              </div>
              <div className="grid gap-3">
                <Rule title="Design in CMYK from day one">
                  Set the Illustrator document color mode to{" "}
                  <strong className="text-paper">CMYK</strong> before design work begins —
                  not as a last-minute conversion.
                </Rule>
                <Rule title="Pantone for brand-critical color">
                  For precise replication of corporate branding, logos, or specific packaging
                  zones, specify exact{" "}
                  <strong className="text-paper">Pantone Matching System (PMS) Solid Coated</strong>{" "}
                  codes within your vector layers. Never rely on CMYK approximations for
                  critical brand colors.
                </Rule>
                <RiskCallout label="RGB submissions">
                  RGB files are auto-converted to CMYK at prepress. Vibrant on-screen colors
                  — especially bright greens, oranges, and blues — can shift dramatically.
                </RiskCallout>
              </div>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* 04 — Bleed */}
        <section className="py-14 md:py-18">
          <div className="container-x">
            <SectionHeading
              n="04"
              id="bleed"
              title="Bleeds, safety margins & tolerances."
              intro="Packaging production involves mechanical cutting, creasing, and folding. Artwork must compensate for slight structural shifts during manufacturing."
            />
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div className="card !min-h-0">
                <BleedDiagram />
              </div>
              <div className="grid gap-3">
                <Rule title="Bleed allowance — 0.125″">
                  Extend all background graphics, colors, and placed images at least{" "}
                  <strong className="text-paper">1/8″ (0.125″)</strong> past the physical
                  cutting/die line on all sides.
                </Rule>
                <Rule title="Safety margin — 0.125″">
                  Keep all critical text, logos, nutritional facts, and regulatory icons at
                  least <strong className="text-paper">1/8″ (0.125″)</strong> inside the die
                  line boundary to avoid clipping during die-cutting and folding.
                </Rule>
              </div>
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* 05 — Checklist */}
        <section id="checklist" className="scroll-mt-28 py-14 md:py-20">
          <div className="container-x">
            <PreflightChecklist />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
