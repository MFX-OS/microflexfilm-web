"use client";

import { useState } from "react";
import Logo from "./Logo";
import ChatButton from "./ChatButton";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; links: NavLink[] };

const groups: NavGroup[] = [
  {
    label: "Products",
    links: [
      { href: "/capabilities", label: "All Formats" },
      { href: "/capabilities/pouches", label: "Stand-Up Pouches" },
      { href: "/capabilities/flat-pouches", label: "Flat Pouches" },
      { href: "/capabilities/quad-seal", label: "Quad-Seal Pouches" },
      { href: "/capabilities/spouted-pouches", label: "Spouted Pouches" },
      { href: "/capabilities/stick-packs", label: "Stick Packs & Sachets" },
      { href: "/capabilities/fin-seal", label: "Fin-Seal / Flow Wrap" },
      { href: "/capabilities/die-cut", label: "Die-Cut Shapes" },
      { href: "/capabilities/child-resistant", label: "Child-Resistant" },
      { href: "/capabilities/rollstock", label: "Printed Rollstock" },
      { href: "/capabilities/labels", label: "Labels & Stickers" },
      { href: "/capabilities/specialty", label: "Shrink Sleeves & Specialty" },
      { href: "/capabilities/display", label: "Display & Shipping" },
    ],
  },
  {
    label: "Features",
    links: [
      { href: "/materials", label: "Materials & Finishes" },
      { href: "/printing", label: "Printing Options" },
      { href: "/artwork-guidelines", label: "Artwork Guidelines" },
      { href: "/industries", label: "Industries" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/about", label: "About Microflex" },
      { href: "/faq", label: "FAQs" },
      { href: "/calculators", label: "Packaging Calculators" },
      { href: "/#sample-kit", label: "Sample Kit" },
      { href: "/#process", label: "Our Process" },
      { href: "/terms", label: "Terms & Legal" },
    ],
  },
];

function Dropdown({ group }: { group: NavGroup }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1.5 py-2 text-sm font-bold text-muted transition hover:text-cyan"
      >
        {group.label}
        <span className="text-[9px] text-cyan">▼</span>
      </button>
      <div
        className="invisible absolute left-0 top-full z-40 min-w-[230px] rounded-2xl p-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
        style={{
          background: "rgba(2,5,9,0.97)",
          border: "1px solid rgba(0,216,242,0.25)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
        }}
      >
        {group.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-cyan/10 hover:text-cyan"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="topline hidden md:block">
        <div className="container-x flex min-h-[34px] items-center justify-between gap-5">
          <span>SQF Certified Facility • Solar-Powered Operations • Manufactured in the USA</span>
          <span>
            <a href="/portal" className="font-bold text-cyan transition hover:opacity-80">
              Client Login
            </a>
            {" • MicroflexFilm.com • 909.360.9066"}
          </span>
        </div>
      </div>

      <header
        className="sticky top-0 z-30 border-b backdrop-blur-xl"
        style={{ background: "rgba(2,5,9,0.84)", borderColor: "rgba(0,216,242,0.14)" }}
      >
        <div className="container-x flex min-h-[68px] items-center justify-between gap-4 md:min-h-[88px] md:gap-6">
          <a href="/" aria-label="Microflex home" className="shrink-0">
            <span className="block md:hidden"><Logo size="sm" variant="light" /></span>
            <span className="hidden md:block"><Logo size="md" variant="light" /></span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {groups.map((g) => (
              <Dropdown key={g.label} group={g} />
            ))}
            <a href="/industries" className="py-2 text-sm font-bold text-muted transition hover:text-cyan">
              Industries
            </a>
            <a href="/portal" className="py-2 text-sm font-bold text-muted transition hover:text-cyan">
              Client Portal
            </a>
          </nav>

          <div className="hidden gap-3 md:flex">
            <ChatButton className="btn btn-secondary">Chat with us</ChatButton>
            <a href="/#quote-form" className="btn btn-primary">Start a Project</a>
          </div>

          {/* Mobile CTAs + menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <ChatButton className="btn btn-secondary px-3 text-xs md:hidden" style={{ minHeight: 40 }}>
              Chat
            </ChatButton>
            <a href="/#quote-form" className="btn btn-primary px-3 text-xs md:hidden" style={{ minHeight: 40 }}>
              Start
            </a>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-cyan"
              style={{ border: "1px solid rgba(0,216,242,0.35)", background: "rgba(255,255,255,0.04)" }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav
            aria-label="Mobile"
            className="lg:hidden"
            style={{ borderTop: "1px solid rgba(0,216,242,0.14)", background: "rgba(2,5,9,0.98)" }}
          >
            <div className="container-x max-h-[70vh] overflow-y-auto py-4">
              {groups.map((g) => (
                <div key={g.label} className="mb-4">
                  <div className="kicker mb-2 text-[10px]">{g.label}</div>
                  <div className="grid grid-cols-2 gap-x-4">
                    {g.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm font-semibold text-muted transition hover:text-cyan"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pb-2 pt-2">
                <a href="/portal" onClick={() => setMobileOpen(false)} className="btn btn-secondary" style={{ minHeight: 42 }}>
                  Client Portal
                </a>
                <a href="/#quote-form" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ minHeight: 42 }}>
                  Start a Project
                </a>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
