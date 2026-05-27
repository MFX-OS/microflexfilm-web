import Logo from "./Logo";

const primaryNav = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#process", label: "Process" },
  { href: "#quality", label: "Quality" },
  { href: "#resources", label: "Resources" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <>
      <div className="topline hidden md:block">
        <div className="container-x flex min-h-[34px] items-center justify-between gap-5">
          <span>SQF Certified Facility • Solar-Powered Operations • Manufactured in the USA</span>
          <span>MicroflexFilm.com • 909.360.9066</span>
        </div>
      </div>

      <header
        className="sticky top-0 z-30 border-b backdrop-blur-xl"
        style={{
          background: "rgba(2,5,9,0.84)",
          borderColor: "rgba(0,216,242,0.14)",
        }}
      >
        <div className="container-x flex min-h-[68px] items-center justify-between gap-4 md:min-h-[88px] md:gap-8">
          {/* Real Microflex logo — scales sm → md across breakpoints */}
          <div className="block md:hidden">
            <Logo size="sm" variant="light" />
          </div>
          <div className="hidden md:block">
            <Logo size="md" variant="light" />
          </div>

          <nav
            className="hidden items-center gap-6 text-sm font-bold text-muted lg:flex"
            aria-label="Primary"
          >
            {primaryNav.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-cyan">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden gap-3 md:flex">
            <a href="#client-center" className="btn btn-secondary">
              Client Center
            </a>
            <a href="#quote-form" className="btn btn-primary">
              Start a Project
            </a>
          </div>

          <a
            href="#quote-form"
            className="btn btn-primary px-4 text-xs md:hidden"
            style={{ minHeight: 40 }}
          >
            Start
          </a>
        </div>
      </header>
    </>
  );
}
