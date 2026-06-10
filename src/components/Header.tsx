import Logo from "./Logo";
import ChatButton from "./ChatButton";

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
          <span>
            <a
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-cyan transition hover:opacity-80"
            >
              Client Login
            </a>
            {" • MicroflexFilm.com • 909.360.9066"}
          </span>
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
            <a
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan"
            >
              Client Portal
            </a>
          </nav>

          <div className="hidden gap-3 md:flex">
            <ChatButton className="btn btn-secondary">Chat with us</ChatButton>
            <a href="#quote-form" className="btn btn-primary">
              Start a Project
            </a>
          </div>

          {/* Mobile-only CTAs — sit side by side on phones */}
          <div className="flex gap-2 md:hidden">
            <ChatButton
              className="btn btn-secondary px-3 text-xs"
              style={{ minHeight: 40 }}
            >
              Chat
            </ChatButton>
            <a
              href="#quote-form"
              className="btn btn-primary px-3 text-xs"
              style={{ minHeight: 40 }}
            >
              Start
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
