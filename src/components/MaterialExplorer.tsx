"use client";

import { useState } from "react";

type Trait = { label: string; level: number }; // level 1-5

type Material = {
  name: string;
  swatch: string; // CSS background
  swatchText?: string;
  desc: string;
  traits: Trait[];
  uses: string[];
};

type Category = {
  id: string;
  label: string;
  blurb: string;
  items: Material[];
};

const categories: Category[] = [
  {
    id: "finishes",
    label: "Finishes",
    blurb:
      "The surface your customer sees and touches. Finish sets the brand tone before a single word is read.",
    items: [
      {
        name: "Matte",
        swatch: "linear-gradient(135deg, #2e4356, #1b2c3a)",
        desc: "Soft, glare-free, and modern. Hides fingerprints and scuffs while giving shelf presence a premium, understated tone.",
        traits: [
          { label: "Shine", level: 1 },
          { label: "Color vibrancy", level: 3 },
          { label: "Premium cue", level: 5 },
          { label: "Scuff resistance", level: 4 },
        ],
        uses: ["Coffee", "Supplements", "Premium snacks", "Personal care"],
      },
      {
        name: "Gloss",
        swatch:
          "linear-gradient(135deg, #3a5a75 0%, #6c93b0 45%, #2c4458 100%)",
        desc: "The classic high-shine look. Maximizes color pop and contrast — bold artwork reads loud and clean from across the aisle.",
        traits: [
          { label: "Shine", level: 5 },
          { label: "Color vibrancy", level: 5 },
          { label: "Premium cue", level: 3 },
          { label: "Scuff resistance", level: 3 },
        ],
        uses: ["Snacks", "Candy & confection", "Frozen", "Beverage mixes"],
      },
      {
        name: "Soft-Touch",
        swatch: "linear-gradient(135deg, #243646, #182734)",
        desc: "A velvet, tactile coating customers notice the moment they pick it up. The strongest 'this is premium' signal a finish can send.",
        traits: [
          { label: "Shine", level: 1 },
          { label: "Color vibrancy", level: 3 },
          { label: "Premium cue", level: 5 },
          { label: "Tactile feel", level: 5 },
        ],
        uses: ["Luxury brands", "Cosmetics", "Specialty coffee", "Gift & launch kits"],
      },
      {
        name: "Metallic",
        swatch:
          "linear-gradient(135deg, #8fa6b8 0%, #d9e6ee 30%, #5d7689 60%, #b9cdd9 100%)",
        desc: "Foil-driven shimmer — full metallic fields or registered accents that catch light and eyes. Pairs with matte for high contrast.",
        traits: [
          { label: "Shine", level: 5 },
          { label: "Color vibrancy", level: 4 },
          { label: "Premium cue", level: 5 },
          { label: "Shelf pop", level: 5 },
        ],
        uses: ["Energy & sport", "Limited editions", "Confection", "Supplements"],
      },
      {
        name: "Clear / Window",
        swatch:
          "linear-gradient(135deg, rgba(245,249,251,0.25), rgba(245,249,251,0.06))",
        desc: "Let the product sell itself. Full-clear films or registered windows show texture, color, and quality directly.",
        traits: [
          { label: "Product visibility", level: 5 },
          { label: "Color vibrancy", level: 3 },
          { label: "Premium cue", level: 3 },
          { label: "Barrier (varies)", level: 3 },
        ],
        uses: ["Fresh & dried foods", "Granola", "Pet treats", "Hardware & goods"],
      },
    ],
  },
  {
    id: "barriers",
    label: "Barrier Systems",
    blurb:
      "The invisible engineering layer. Barrier selection is matched to what degrades your product — moisture, oxygen, light, or aroma loss.",
    items: [
      {
        name: "Moisture Barrier",
        swatch: "linear-gradient(135deg, #0c2133, #004a66)",
        desc: "Blocks humidity transfer in both directions — keeps crunchy products crunchy and powders free-flowing.",
        traits: [
          { label: "Moisture protection", level: 5 },
          { label: "Oxygen protection", level: 3 },
          { label: "Clarity option", level: 4 },
        ],
        uses: ["Chips & snacks", "Powders & mixes", "Crackers", "Dry goods"],
      },
      {
        name: "Oxygen Barrier",
        swatch: "linear-gradient(135deg, #0c2133, #114a5e)",
        desc: "Slows oxidation that causes staleness and rancidity. Essential for fats, roasted products, and long shelf-life targets.",
        traits: [
          { label: "Oxygen protection", level: 5 },
          { label: "Moisture protection", level: 4 },
          { label: "Shelf-life extension", level: 5 },
        ],
        uses: ["Coffee", "Nuts", "Jerky & meat snacks", "Oils & sauces"],
      },
      {
        name: "Light / UV Barrier",
        swatch:
          "linear-gradient(135deg, #4d6374 0%, #93a9b9 40%, #3c5263 100%)",
        desc: "Foil and metallized structures that block light degradation — protecting nutrients, color, and active ingredients.",
        traits: [
          { label: "Light protection", level: 5 },
          { label: "Oxygen protection", level: 5 },
          { label: "Product visibility", level: 1 },
        ],
        uses: ["Vitamins & actives", "Dairy powders", "Pharma-adjacent", "Pet nutrition"],
      },
      {
        name: "Aroma Barrier",
        swatch: "linear-gradient(135deg, #11303f, #0a1d29)",
        desc: "Keeps product aroma in and outside odors out — the difference between coffee that smells fresh at opening and coffee that doesn't.",
        traits: [
          { label: "Aroma retention", level: 5 },
          { label: "Oxygen protection", level: 4 },
          { label: "Flavor protection", level: 5 },
        ],
        uses: ["Coffee & tea", "Spices", "Pet food", "Scented products"],
      },
    ],
  },
  {
    id: "structures",
    label: "Film Structures",
    blurb:
      "The substrate families we laminate into your packaging — each balances strength, seal, clarity, and cost differently.",
    items: [
      {
        name: "PET Laminations",
        swatch: "linear-gradient(135deg, #1d3850, #0e2336)",
        desc: "Crisp print carrier with excellent strength and dimensional stability — the workhorse outer layer of premium laminations.",
        traits: [
          { label: "Print clarity", level: 5 },
          { label: "Strength", level: 5 },
          { label: "Heat resistance", level: 4 },
        ],
        uses: ["Stand-up pouches", "Rollstock", "Lidding", "Premium formats"],
      },
      {
        name: "PE Structures",
        swatch: "linear-gradient(135deg, #16324a, #0a1f30)",
        desc: "The sealing layer family — and the basis for recyclable mono-material structures where the whole package is one polymer.",
        traits: [
          { label: "Seal performance", level: 5 },
          { label: "Flexibility", level: 5 },
          { label: "Recyclability path", level: 4 },
        ],
        uses: ["Sealant webs", "Mono-material pouches", "Liquid products", "E-comm friendly"],
      },
      {
        name: "BOPP Films",
        swatch: "linear-gradient(135deg, #1a3a52, #102a40)",
        desc: "Economical, crisp, and moisture-resistant — the high-efficiency choice for snack and confection volume programs.",
        traits: [
          { label: "Cost efficiency", level: 5 },
          { label: "Moisture protection", level: 4 },
          { label: "Clarity", level: 4 },
        ],
        uses: ["Snack bags", "Flow wrap", "Confection", "High-volume programs"],
      },
      {
        name: "Foil Laminations",
        swatch:
          "linear-gradient(135deg, #aebfcc 0%, #e8f0f5 35%, #7e95a6 70%, #c5d6e0 100%)",
        desc: "Absolute barrier — light, oxygen, and moisture stopped cold. The structure of choice when shelf life is non-negotiable.",
        traits: [
          { label: "Total barrier", level: 5 },
          { label: "Premium feel", level: 5 },
          { label: "Product visibility", level: 1 },
        ],
        uses: ["Coffee", "Pharma-adjacent", "Long shelf-life", "Stick packs"],
      },
      {
        name: "Paper / Kraft Look",
        swatch: "linear-gradient(135deg, #6b5d4a, #4a3f32)",
        desc: "Natural, organic shelf language — kraft aesthetics with engineered barrier liners so the look doesn't cost you protection.",
        traits: [
          { label: "Natural cue", level: 5 },
          { label: "Barrier (lined)", level: 3 },
          { label: "Print warmth", level: 4 },
        ],
        uses: ["Organic & natural", "Baked goods", "Tea", "Artisan brands"],
      },
    ],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    blurb:
      "Packaging that answers the question customers are already asking. We'll match the right sustainable path to your product's barrier needs.",
    items: [
      {
        name: "Mono-Material (Recycle-Ready)",
        swatch: "linear-gradient(135deg, #1d4a3a, #0e2d22)",
        desc: "All-PE or all-PP structures designed for store-drop-off and film recycling streams — one polymer, one stream.",
        traits: [
          { label: "Recyclability path", level: 5 },
          { label: "Barrier range", level: 3 },
          { label: "Brand story value", level: 5 },
        ],
        uses: ["Retail brands", "Sustainability commitments", "Snacks", "Home goods"],
      },
      {
        name: "PCR Content",
        swatch: "linear-gradient(135deg, #2a4a3d, #163026)",
        desc: "Post-consumer recycled content built into the film structure — measurable progress toward recycled-content goals.",
        traits: [
          { label: "Recycled content", level: 4 },
          { label: "Performance parity", level: 4 },
          { label: "Brand story value", level: 4 },
        ],
        uses: ["CPG goals", "Retailer requirements", "ESG reporting", "Refill programs"],
      },
      {
        name: "Lightweighting",
        swatch: "linear-gradient(135deg, #1c3d4f, #0d2533)",
        desc: "Down-gauged structures that use less material per package without sacrificing protection — less plastic, lower freight, same shelf life.",
        traits: [
          { label: "Material reduction", level: 5 },
          { label: "Cost impact", level: 5 },
          { label: "Performance parity", level: 4 },
        ],
        uses: ["Volume programs", "Cost optimization", "Carbon targets", "E-commerce"],
      },
      {
        name: "Paper-Based Structures",
        swatch: "linear-gradient(135deg, #75674f, #514635)",
        desc: "Fiber-forward constructions with functional barrier coatings — for brands whose customers expect paper in hand.",
        traits: [
          { label: "Fiber content", level: 5 },
          { label: "Barrier range", level: 3 },
          { label: "Natural cue", level: 5 },
        ],
        uses: ["Natural & organic", "Dry goods", "Bakery", "DTC brands"],
      },
    ],
  },
];

function TraitBar({ trait }: { trait: Trait }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted">
        {trait.label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="h-1.5 w-5 rounded-full"
            style={{
              background:
                i <= trait.level ? "linear-gradient(90deg,#00a8cf,#00d8f2)" : "rgba(255,255,255,0.1)",
              boxShadow: i <= trait.level ? "0 0 8px rgba(0,216,242,0.4)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MaterialExplorer() {
  const [active, setActive] = useState(categories[0].id);
  const cat = categories.find((c) => c.id === active)!;

  return (
    <div>
      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className="rounded-full px-5 py-2.5 text-sm font-extrabold transition"
            style={{
              border: `1px solid ${
                c.id === active ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"
              }`,
              background:
                c.id === active
                  ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))"
                  : "rgba(255,255,255,0.03)",
              color: c.id === active ? "#34e3f5" : "#a9b9c8",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mb-7 max-w-3xl text-lg leading-relaxed text-muted">{cat.blurb}</p>

      {/* Material cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cat.items.map((m) => (
          <div key={m.name} className="card !min-h-0 flex flex-col">
            <div
              className="-mx-1 mb-4 flex h-[88px] items-end rounded-2xl p-4"
              style={{
                background: m.swatch,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span className="text-lg font-black text-paper drop-shadow-md">{m.name}</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted">{m.desc}</p>
            <div className="mb-4 grid gap-2">
              {m.traits.map((t) => (
                <TraitBar key={t.label} trait={t} />
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {m.uses.map((u) => (
                <span
                  key={u}
                  className="rounded-full px-3 py-1 text-[11px] font-bold text-muted-light"
                  style={{
                    border: "1px solid rgba(0,216,242,0.22)",
                    background: "rgba(0,216,242,0.05)",
                  }}
                >
                  {u}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
