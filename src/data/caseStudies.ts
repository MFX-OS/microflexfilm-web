/* Case studies. These two entries are REPRESENTATIVE examples (anonymized) to
   show the format — replace with real, client-approved case studies (with named
   clients, logos, and verified metrics) when you have permission. Each card is
   tagged "Representative" until then so nothing overstates a specific client. */

export type CaseStudy = {
  slug: string;
  client: string; // named client, or anonymized descriptor
  representative: boolean; // true = example/anonymized, false = real & approved
  industry: string;
  format: string;
  title: string;
  summary: string;
  challenge: string;
  approach: string;
  result: string;
  metrics: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "specialty-coffee-stand-up-pouch",
    client: "Specialty Coffee Roaster",
    representative: true,
    industry: "Coffee & Tea",
    format: "Stand-Up Pouch · Matte · Degassing Valve",
    title: "From two SKUs to a shelf-ready coffee line",
    summary:
      "A growing roaster needed premium, aroma-locking bags that ran clean on their filler — without an enterprise minimum.",
    challenge:
      "The brand was hand-filling generic bags that dulled aroma and looked off-shelf next to national brands. They needed an oxygen + aroma barrier with a degassing valve, a premium matte look, and quantities that matched a small-but-growing business.",
    approach:
      "We specified a high-barrier stand-up pouch with a one-way degassing valve and a soft, matte finish, then ran an artwork-readiness check before plates. Two structure options were quoted so they could compare cost against shelf life.",
    result:
      "A shelf-ready line that protects aroma, runs cleanly on their filler, and reorders predictably as they scale.",
    metrics: [
      { label: "Structure options compared", value: "2" },
      { label: "Prepress issues caught pre-plate", value: "100%" },
      { label: "Reorder", value: "2-click" },
    ],
  },
  {
    slug: "supplement-startup-multi-sku-launch",
    client: "Supplement Startup",
    representative: true,
    industry: "Supplements",
    format: "Stand-Up Pouch · Matte + Metallic · Moisture/Light Barrier",
    title: "A multi-SKU supplement launch, on time",
    summary:
      "A new brand launching several flavors needed consistent color and a moisture/light barrier across every SKU.",
    challenge:
      "Launching multiple flavors at once meant color had to stay consistent across SKUs, with a barrier strong enough for powders and a compliance-ready print area — all under a tight launch date.",
    approach:
      "We engineered a barrier lamination with a matte base and metallic accents, locked brand color across SKUs, and managed artwork and proofs so every flavor matched. The 3D studio let the founders preview each SKU before committing.",
    result:
      "All SKUs shipped to the launch window with consistent color and protection that holds shelf life.",
    metrics: [
      { label: "SKUs launched together", value: "Multiple" },
      { label: "Color consistency", value: "Roll 1 = Roll 50" },
      { label: "Launch date", value: "Hit" },
    ],
  },
];
