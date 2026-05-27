import Image from "next/image";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="hero relative isolate grid-backdrop py-14 md:py-20 lg:py-24">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="kicker mb-3">
              Flexible Packaging • Labels • Pouches • Printed Film
            </div>
            <h1 className="display text-[clamp(40px,9vw,96px)] text-paper">
              Flexible Packaging.
              <br />
              <span className="text-cyan">Engineered to Perform.</span>
            </h1>
            <p className="mt-6 max-w-[690px] text-base leading-relaxed text-muted md:mt-7 md:text-lg lg:text-xl">
              Microflex helps brands produce printed film, pouches, labels, shrink sleeves,
              sachets, stick packs, and custom flexible packaging with disciplined production,
              artwork control, and quality-focused execution.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8">
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

          {/* HeroStage — now visible on all sizes (scaled down for mobile/tablet). */}
          <div className="mt-2 lg:mt-0">
            <HeroStage />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStage() {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[42px] shadow-deep min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]"
      style={{
        border: "1px solid rgba(0,216,242,0.23)",
        background:
          "radial-gradient(circle at 84% 18%, rgba(0,216,242,0.22), transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
      }}
      aria-label="Microflex product family preview"
    >
      <div
        className="absolute inset-[14px] sm:inset-[20px] lg:inset-[28px] rounded-[20px] sm:rounded-[26px] lg:rounded-[32px] overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at 70% 20%, rgba(0,216,242,0.19), transparent 29%), linear-gradient(180deg, #081929 0%, #020509 92%)",
        }}
      >
        {/* Logo plate */}
        <div className="absolute left-[18px] right-[18px] top-[18px] sm:left-[26px] sm:right-[26px] sm:top-[26px] lg:left-[34px] lg:right-[34px] lg:top-[34px] z-10 flex items-start justify-between gap-5">
          <div className="flex-1">
            {/* Mobile: smaller logo so it never overflows the inner box */}
            <div className="lg:hidden">
              <Logo size="md" variant="light" href={null} priority />
            </div>
            <div className="hidden lg:block">
              <Logo size="xl" variant="light" href={null} priority />
            </div>
          </div>
          <div
            className="hidden w-[168px] rounded-[22px] p-4 text-xs leading-snug text-muted backdrop-blur-md xl:block"
            style={{
              border: "1px solid rgba(0,216,242,0.28)",
              background: "rgba(2,5,9,0.62)",
            }}
          >
            <b className="mb-1 block text-sm text-paper">Packaging Systems</b>
            Formats, finishes, labels, rollstock, samples, and client-ready packaging programs.
          </div>
        </div>

        {/* Real product family photo */}
        <ProductFamily />
      </div>
    </div>
  );
}

function ProductFamily() {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[90px] sm:top-[140px] lg:top-[200px] flex items-end justify-center">
      <div className="relative h-full w-full">
        <Image
          src="/images/items.png"
          alt="Microflex Film Corporation product family — printed film rollstock, pouches, sachets, stick packs, bottles, jars, labels, display boxes, and shipping cases"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          style={{
            objectFit: "contain",
            objectPosition: "bottom center",
          }}
          priority
        />
      </div>
    </div>
  );
}
