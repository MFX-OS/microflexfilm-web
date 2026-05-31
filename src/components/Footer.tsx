import Logo from "./Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-14"
      style={{
        borderTop: "1px solid rgba(0,216,242,0.14)",
        background: "rgba(0,0,0,0.28)",
      }}
    >
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo size="md" variant="light" href={null} />
          </div>

          <div className="text-muted">
            <h4 className="mb-3 font-bold text-paper">Capabilities</h4>
            <p className="leading-relaxed">
              Flexible packaging, printed film, pouches, labels, shrink sleeves, sachets, stick
              packs, materials, finishes, and custom solutions.
            </p>
          </div>

          <div className="text-muted">
            <h4 className="mb-3 font-bold text-paper">Contact</h4>
            <p className="leading-relaxed">
              MicroflexFilm.com
              <br />
              info@microflexfilm.com
              <br />
              909.360.9066
              <br />
              4130 Garner Rd., Riverside, CA 92501
            </p>
          </div>
        </div>

        <div
          className="mt-9 flex flex-wrap items-center justify-between gap-5 pt-5 text-xs text-muted-dark"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span>© {new Date().getFullYear()} Microflex Film Corporation. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className="hover:text-cyan transition">
              Terms &amp; Legal
            </Link>
            <span>Flexible Packaging. Engineered to Perform.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
