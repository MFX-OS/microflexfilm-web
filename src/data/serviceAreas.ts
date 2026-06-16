/* Service-area landing pages — genuine industry × region content (not thin
   doorway pages). Each combines real packaging expertise for the industry with
   a local/domestic angle for Southern California. Add more entries as needed. */

export type ServiceArea = {
  slug: string;
  industry: string;
  region: string;
  seoTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  challenges: { title: string; body: string }[];
  formats: string[];
  localAngle: string;
  related: { label: string; href: string }[];
  faq: { q: string; a: string }[];
};

export const serviceAreas: ServiceArea[] = [
  {
    slug: "coffee-packaging-southern-california",
    industry: "Coffee Packaging",
    region: "Southern California",
    seoTitle: "Coffee Packaging in Southern California | Microflex Film",
    metaDesc:
      "Custom coffee bags and pouches for Southern California roasters — aroma + oxygen barriers, degassing valves, matte and soft-touch finishes. Made in Riverside, shipped fast across SoCal.",
    h1: "Coffee packaging for Southern California roasters.",
    intro:
      "From specialty roasters in Los Angeles and Orange County to growing brands across the Inland Empire and San Diego, Southern California's coffee scene moves fast. Microflex manufactures custom coffee bags in Riverside — engineered to protect aroma and freshness, run clean on your filler, and look premium on the shelf.",
    challenges: [
      { title: "Aroma & oxygen protection", body: "Coffee is sensitive to oxygen and aroma loss. We spec high-barrier structures with one-way degassing valves so freshly roasted beans off-gas without going stale." },
      { title: "Premium shelf presence", body: "Matte, soft-touch, and metallic finishes help your bag stand out next to national brands — chosen deliberately for your brand, not pulled from a catalog." },
      { title: "Right size, right run", body: "Whole bean or ground, 8 oz to 5 lb — stand-up, box-bottom, or quad-seal — at quantities that match a small-but-growing roaster, with predictable reorders as you scale." },
    ],
    formats: ["Stand-Up Pouch", "Box-Bottom (Flat-Bottom) Bag", "Quad-Seal Bag", "Printed Rollstock", "Degassing Valve", "Resealable Zipper"],
    localAngle:
      "Because we manufacture domestically in Riverside, SoCal roasters get fast turnarounds, responsive support, and a real person on the account — not an overseas broker and a six-week boat. Ground freight across Southern California is quick and predictable.",
    related: [
      { label: "Coffee Packaging (industry)", href: "/industries/coffee-packaging" },
      { label: "Box-Bottom Bags", href: "/capabilities/quad-seal" },
      { label: "Design it in 3D", href: "/configurator" },
    ],
    faq: [
      { q: "Do you make coffee bags with degassing valves?", a: "Yes — one-way degassing valves are a standard option on our coffee bags so freshly roasted beans can off-gas without letting oxygen in." },
      { q: "What's the minimum order for coffee bags?", a: "It depends on the format and print method; pre-made pouches start lower than rollstock runs. Send your target quantity and we'll confirm the MOQ and price breaks." },
      { q: "How fast can I get coffee packaging in Los Angeles or San Diego?", a: "We produce in Riverside, so ground freight across Southern California is fast. Share your in-hands date and we'll tell you what's achievable, including rush options." },
    ],
  },
  {
    slug: "supplement-packaging-southern-california",
    industry: "Supplement Packaging",
    region: "Southern California",
    seoTitle: "Supplement Packaging in Southern California | Microflex Film",
    metaDesc:
      "Custom supplement and powder pouches for Southern California brands — moisture + light barriers, stick packs and sachets, consistent color across SKUs. Made in Riverside.",
    h1: "Supplement packaging for Southern California brands.",
    intro:
      "Southern California is a hub for supplement and wellness brands. Microflex manufactures protein, powder, gummy, and capsule packaging in Riverside — barrier-engineered for shelf life, compliance-ready for print, and color-consistent across every SKU in your line.",
    challenges: [
      { title: "Moisture & light protection", body: "Powders and gummies need a strong moisture barrier (and often light protection). We engineer barrier laminations matched to your product's sensitivity and shelf-life target." },
      { title: "Consistent color across SKUs", body: "Launching multiple flavors? We lock brand color across SKUs and manage proofs so roll 50 looks like roll 1 — critical for a cohesive shelf set." },
      { title: "Single-serve & full-size", body: "Stick packs and sachets for single-serve and samples, stand-up pouches for full sizes — with a compliance-ready print area for your supplement facts and claims." },
    ],
    formats: ["Stand-Up Pouch", "Stick Pack", "Sachet", "Matte + Metallic Finish", "Moisture/Light Barrier", "Resealable Zipper"],
    localAngle:
      "Manufacturing in Riverside means SoCal supplement brands get fast, responsive production and easy collaboration on artwork and compliance — with quick ground freight across Los Angeles, Orange County, San Diego, and the Inland Empire.",
    related: [
      { label: "Supplement Packaging (industry)", href: "/industries/nutritional-supplement-packaging" },
      { label: "Protein Powder Packaging", href: "/industries/protein-powder-packaging" },
      { label: "Design it in 3D", href: "/configurator" },
    ],
    faq: [
      { q: "Can you match color across multiple supplement SKUs?", a: "Yes — we lock brand color and manage proofs across every SKU so your line stays visually consistent from the first roll to the last." },
      { q: "Do you make stick packs and sachets for single-serve?", a: "Yes — stick packs and sachets are ideal for single-serve powders and samples, with a barrier matched to your product." },
      { q: "Are your materials food-contact compliant?", a: "We provide documentation supporting food-contact suitability for materials used in your application, produced in an SQF-certified facility. Share your requirements and we'll confirm specifics." },
    ],
  },
];

export function getServiceArea(slug: string) {
  return serviceAreas.find((s) => s.slug === slug);
}
