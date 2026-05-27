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
          <div className="leading-none">
            <strong className="display block text-[30px] text-paper">Microflex</strong>
            <span
              className="mt-2 block text-[10px] font-bold uppercase text-cyan"
              style={{ letterSpacing: "0.48em" }}
            >
              Film Corporation
            </span>
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
          <span>Flexible Packaging. Engineered to Perform.</span>
        </div>
      </div>
    </footer>
  );
}
