const AREAS = [
  "Riverside", "Inland Empire", "Los Angeles", "Orange County",
  "San Diego", "Southern California", "Nationwide",
];

export default function AreasServed() {
  return (
    <section className="py-14 md:py-18">
      <div className="container-x">
        <div className="kicker mb-3">Where we serve</div>
        <h2 className="display text-[clamp(28px,3.6vw,50px)] text-paper">
          Riverside-made. Shipped nationwide.
        </h2>
        <p className="mt-4 max-w-[780px] text-lg leading-relaxed text-muted">
          Microflex Film manufactures flexible packaging in Riverside, California — serving brands
          across the Inland Empire, Greater Los Angeles, Orange County, San Diego, and all of
          Southern California, and supplying co-packers and CPG brands nationwide. Domestic
          production means responsive support, faster turnarounds, and a real person on your
          account — not an overseas broker.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <span
              key={a}
              className="rounded-full px-4 py-2 text-sm font-bold"
              style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)", color: "#bdd0dc" }}
            >
              {a}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Popular in Southern California:{" "}
          <a href="/service-areas/coffee-packaging-southern-california" className="font-bold text-cyan underline">Coffee packaging</a>
          {" · "}
          <a href="/service-areas/supplement-packaging-southern-california" className="font-bold text-cyan underline">Supplement packaging</a>
          {" · "}
          <a href="/service-areas" className="font-bold text-cyan underline">All service areas</a>
        </p>
      </div>
    </section>
  );
}
