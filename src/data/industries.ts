export type Industry = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  demands: { title: string; desc: string }[];
  formats: { label: string; slug: string }[];
  finishes: string;
  compliance?: string;
  applications: string[];
};

const F = {
  pouches: { label: "Stand-Up Pouches", slug: "pouches" },
  flat: { label: "Flat Pouches", slug: "flat-pouches" },
  rollstock: { label: "Printed Rollstock", slug: "rollstock" },
  stick: { label: "Stick Packs & Sachets", slug: "stick-packs" },
  labels: { label: "Labels & Stickers", slug: "labels" },
  specialty: { label: "Shrink Sleeves & Specialty", slug: "specialty" },
  quad: { label: "Quad-Seal Pouches", slug: "quad-seal" },
  spout: { label: "Spouted Pouches", slug: "spouted-pouches" },
  cr: { label: "Child-Resistant Pouches", slug: "child-resistant" },
  display: { label: "Display & Shipping", slug: "display" },
  diecut: { label: "Die-Cut Shapes", slug: "die-cut" },
};

export const industries: Industry[] = [
  {
    slug: "coffee-tea",
    name: "Coffee & Tea Packaging",
    tagline: "Lock in aroma from roast to last cup.",
    intro:
      "Coffee and tea live or die on freshness. Oxygen staleness, aroma loss, and UV degradation are the enemies — our high-barrier structures, degassing options, and premium finishes keep what's inside as good as the day it was roasted or blended.",
    demands: [
      { title: "Aroma & oxygen barrier", desc: "High-barrier laminations and foil structures hold aroma in and oxygen out for the full shelf window." },
      { title: "Degassing for fresh roast", desc: "One-way valve options vent CO₂ from freshly roasted beans without letting oxygen back in." },
      { title: "Premium shelf presence", desc: "Coffee is bought with the eyes first — matte, soft-touch, and metallic finishes signal craft quality." },
    ],
    formats: [F.pouches, F.quad, F.stick, F.rollstock],
    finishes: "Matte and soft-touch dominate specialty coffee; metallic accents for premium tiers; kraft-look for organic positioning.",
    applications: ["Whole bean", "Ground coffee", "Loose-leaf tea", "Tea sachets", "Cold brew packs", "Single-serve sticks"],
  },
  {
    slug: "snacks",
    name: "Snack Packaging",
    tagline: "Keep the crunch. Win the aisle.",
    intro:
      "Snacks demand two things at once: a moisture barrier that protects texture and graphics loud enough to win a crowded aisle. We build both into films that run fast on high-speed lines.",
    demands: [
      { title: "Moisture barrier for texture", desc: "Crisp stays crisp — barrier structures block humidity that kills crunch." },
      { title: "High-speed line performance", desc: "Films and rollstock engineered for fast, consistent sealing on VFFS lines." },
      { title: "Shelf shout", desc: "Gloss finishes and vibrant print that read from six feet away." },
    ],
    formats: [F.rollstock, F.pouches, F.flat, F.display],
    finishes: "High-gloss for color pop; clear windows to show the product; matte for premium snack positioning.",
    applications: ["Chips", "Pretzels", "Crackers", "Trail mix", "Popcorn", "Baked snacks"],
  },
  {
    slug: "candy-confection",
    name: "Candy & Confection Packaging",
    tagline: "Packaging as irresistible as the product.",
    intro:
      "Confection brands compete on impulse. Bright, tactile, premium packaging converts a glance into a grab — while barrier structures protect flavor, prevent melt-and-stick, and keep candy fresh.",
    demands: [
      { title: "Flavor & freshness protection", desc: "Moisture and aroma barriers that keep candy fresh and prevent flavor transfer." },
      { title: "Impulse-grade graphics", desc: "Vivid print, metallic effects, and finish contrast designed for the checkout decision." },
      { title: "Resealability for share sizes", desc: "Zippers that keep family-size bags fresh between snacking sessions." },
    ],
    formats: [F.pouches, F.flat, F.rollstock, F.diecut],
    finishes: "Gloss with metallic accents is the confection standard; die-cut shapes for novelty formats.",
    applications: ["Gummies", "Hard candy", "Chocolate", "Taffy & chews", "Seasonal editions", "Bulk & share sizes"],
  },
  {
    slug: "gummies",
    name: "Gummy Packaging",
    tagline: "High-barrier pouches built for the gummy boom.",
    intro:
      "Gummies — candy, vitamin, or functional — need real barrier engineering: moisture control to prevent clumping, aroma containment, and in regulated categories, certified child-resistant closures.",
    demands: [
      { title: "Clump-free moisture control", desc: "Barrier structures that keep gummies from sticking, sweating, or hardening." },
      { title: "Compliance-ready print", desc: "Clear panel space for supplement facts, dosage, batch, and regulatory content." },
      { title: "Child-resistant options", desc: "Certified CR zippers for regulated and dosage-sensitive products." },
    ],
    formats: [F.pouches, F.cr, F.flat, F.rollstock],
    finishes: "Soft-touch matte with vibrant fruit-forward print; CR closures integrate cleanly without breaking the design.",
    compliance: "Child-resistant formats reference 16 CFR 1700 testing protocols; supplement-facts panel layout support available.",
    applications: ["Vitamin gummies", "Candy gummies", "Functional gummies", "Sample packs"],
  },
  {
    slug: "supplements",
    name: "Nutritional Supplement Packaging",
    tagline: "Protect potency. Project credibility.",
    intro:
      "Supplement buyers read packaging like a label-conscious skeptic. Crisp compliance print, premium finish, and barrier protection for actives — all in formats from single-dose sticks to value-size pouches.",
    demands: [
      { title: "Active-ingredient protection", desc: "Moisture, oxygen, and UV barriers that protect potency through the labeled shelf life." },
      { title: "Compliance-grade print", desc: "Sharp, legible supplement facts, claims, and lot/expiry zones that pass review." },
      { title: "Format range for SKU strategy", desc: "Sticks for dosing, pouches for value sizes, sachets for trial — one supplier across all." },
    ],
    formats: [F.pouches, F.stick, F.cr, F.labels],
    finishes: "Clinical clean or premium dark — matte bases with metallic or gloss accents that signal efficacy.",
    applications: ["Capsules & softgels", "Powders", "Electrolytes", "Greens & supergreens", "Collagen", "Pre/post-workout"],
  },
  {
    slug: "protein-powder",
    name: "Protein Powder Packaging",
    tagline: "Big-format pouches that perform like the product.",
    intro:
      "Protein and performance powders need wide-mouth access, heavy-fill strength, scoop-friendly openings, and barriers that keep powder dry and flowing — in pack sizes from single-serve sticks to multi-pound bags.",
    demands: [
      { title: "Heavy-fill structural strength", desc: "Reinforced seals and puncture-resistant laminations rated for dense, heavy fills." },
      { title: "Moisture control for flow", desc: "Barrier films that prevent clumping and keep every scoop free-flowing." },
      { title: "Gym-bag portability", desc: "Stick packs and sachets for single servings that travel." },
    ],
    formats: [F.quad, F.pouches, F.stick, F.rollstock],
    finishes: "Bold matte with high-contrast graphics — the performance category's visual language.",
    applications: ["Whey & casein", "Plant protein", "Meal replacement", "Mass gainers", "Single-serve sticks"],
  },
  {
    slug: "pet",
    name: "Pet Food & Treats Packaging",
    tagline: "Packaging pet parents trust — and pets can't open.",
    intro:
      "Pet food packaging works hard: aroma containment, grease resistance, puncture-proof strength for kibble, and reseal systems that survive daily use — wrapped in branding that wins the pet parent.",
    demands: [
      { title: "Aroma containment", desc: "Keeps strong pet-food aromas inside the bag and off the shelf." },
      { title: "Puncture & tear resistance", desc: "Heavy-duty laminations that survive sharp kibble, transit, and enthusiastic pets." },
      { title: "Durable reseal", desc: "Zippers and sliders engineered for months of daily opens." },
    ],
    formats: [F.quad, F.pouches, F.flat, F.rollstock],
    finishes: "Gloss with photographic print for mainstream; matte kraft-look for natural and premium lines.",
    applications: ["Kibble", "Treats", "Jerky & chews", "Cat food", "Bird & small animal", "Supplements"],
  },
  {
    slug: "meat-jerky",
    name: "Meat & Jerky Packaging",
    tagline: "High-barrier protection for high-protein products.",
    intro:
      "Jerky and meat snacks demand serious oxygen barrier, oxygen-scavenger compatibility, and structures that handle oils and proteins — plus the rugged brand look the category expects.",
    demands: [
      { title: "Oxygen barrier for shelf life", desc: "High-barrier laminations that slow oxidation and rancidity in high-fat proteins." },
      { title: "Grease & oil resistance", desc: "Sealant systems that hold strong seal integrity with oily contents." },
      { title: "Vacuum & gas-flush ready", desc: "Structures compatible with MAP, vacuum, and oxygen-absorber programs." },
    ],
    formats: [F.pouches, F.flat, F.rollstock, F.display],
    finishes: "Matte black and kraft tones rule the category; clear windows prove the product.",
    applications: ["Beef jerky", "Meat sticks", "Biltong", "Smoked meats", "Pet jerky"],
  },
  {
    slug: "frozen-foods",
    name: "Frozen Food Packaging",
    tagline: "Films that stay flexible at freezer temperatures.",
    intro:
      "Freezers destroy ordinary packaging — films crack, seals fail, and ice crystals fog graphics. Our cold-crack-resistant structures and freezer-grade sealants keep packages intact and looking sharp from blast freezer to checkout.",
    demands: [
      { title: "Cold-crack resistance", desc: "PE-rich films engineered to flex, not fracture, at deep-freeze temperatures." },
      { title: "Freezer-grade seal integrity", desc: "Sealants that bond through frost and hold through thermal cycling." },
      { title: "Moisture & freezer-burn defense", desc: "Barriers that protect food quality through months of frozen storage." },
    ],
    formats: [F.rollstock, F.pouches, F.flat],
    finishes: "High-gloss print that stays vivid behind freezer-case glass; anti-fog options for visibility.",
    applications: ["Frozen fruits & vegetables", "Prepared meals", "Proteins & seafood", "Frozen baked goods", "Ice pops"],
  },
  {
    slug: "freeze-dried",
    name: "Freeze-Dried Packaging",
    tagline: "Maximum barrier for maximum shelf life.",
    intro:
      "Freeze-dried products are moisture magnets — one humid afternoon can undo the entire process. Foil and ultra-high-barrier structures protect crispness, nutrition, and years-long shelf life targets.",
    demands: [
      { title: "Near-zero moisture transmission", desc: "Foil laminations and ultra-barrier films for products that must stay bone-dry." },
      { title: "Long-duration shelf life", desc: "Structures specified for multi-year storage without quality loss." },
      { title: "Lightweight product, light-protected", desc: "UV barriers that protect color and nutrients in delicate freeze-dried goods." },
    ],
    formats: [F.pouches, F.flat, F.quad, F.rollstock],
    finishes: "Vivid gloss print for snack positioning; foil-faced structures for survival and bulk formats.",
    applications: ["Freeze-dried fruit", "Candy", "Camping & survival meals", "Instant coffee", "Pet treats"],
  },
  {
    slug: "dried-fruit-nuts",
    name: "Dried Fruit & Nut Packaging",
    tagline: "Freshness sealed in. Oils kept stable.",
    intro:
      "Nuts and dried fruit carry natural oils and sugars that oxidize, clump, and stale. Barrier structures matched to each product — plus windows and finishes that show off quality you can see.",
    demands: [
      { title: "Oil oxidation control", desc: "Oxygen barriers that keep nut oils fresh and prevent rancid notes." },
      { title: "Moisture balance", desc: "Films that keep dried fruit supple without inviting clumping or mold." },
      { title: "Show-the-product confidence", desc: "Clear windows and full-clear formats that let quality sell itself." },
    ],
    formats: [F.pouches, F.flat, F.rollstock, F.display],
    finishes: "Kraft-look with windows for natural positioning; gloss for mainstream retail.",
    applications: ["Almonds & mixed nuts", "Trail mix", "Dried mango & fruit", "Dates", "Seeds"],
  },
  {
    slug: "sauces-liquids",
    name: "Sauce & Liquid Packaging",
    tagline: "Leak-proof flexibility for everything that pours.",
    intro:
      "Liquids punish weak packaging. Our reinforced seal systems, flex-crack-resistant films, and spouted formats carry sauces, dressings, and beverages safely from filler to fridge.",
    demands: [
      { title: "Seal integrity under pressure", desc: "Reinforced seals engineered for liquid weight, transit shock, and squeeze-handling." },
      { title: "Flex-crack resistance", desc: "Films that survive repeated flexing without pinholes." },
      { title: "Dispensing built in", desc: "Spouted pouches and sachets that pour, squeeze, and reclose cleanly." },
    ],
    formats: [F.spout, F.stick, F.flat, F.rollstock],
    finishes: "Gloss print with appetite-appeal photography; clear formats for clean-label sauces.",
    applications: ["Hot sauce", "Dressings & marinades", "Condiment sachets", "Beverages", "Purees & baby food"],
  },
  {
    slug: "spices",
    name: "Spice Packaging",
    tagline: "Aroma-tight packaging for flavor-first brands.",
    intro:
      "Spices lose the volatile oils that make them worth buying — unless the packaging holds them in. Aroma-barrier films, light protection for color, and formats from single-use sachets to chef-size pouches.",
    demands: [
      { title: "Volatile-oil retention", desc: "Aroma barriers that keep flavor compounds in the pack, not the air." },
      { title: "Color protection", desc: "UV barriers that keep paprika red and turmeric gold through shelf life." },
      { title: "Fine-powder seal cleanliness", desc: "Seal systems that stay strong even with fine powder in the seal zone." },
    ],
    formats: [F.flat, F.pouches, F.stick, F.rollstock],
    finishes: "Rich matte tones with metallic accents — the premium spice-rack aesthetic.",
    applications: ["Ground spices", "Whole spices", "Blends & rubs", "Chili powders", "Baking spices"],
  },
  {
    slug: "organic-natural",
    name: "Organic & Natural Food Packaging",
    tagline: "Packaging that looks like your values.",
    intro:
      "Natural brands need packaging that visually signals clean and sustainable — without sacrificing the barrier protection preservative-free products need most. Kraft aesthetics, recyclable structures, and honest design.",
    demands: [
      { title: "Natural visual language", desc: "Kraft-look films and earthy palettes that read 'organic' at a glance." },
      { title: "Extra barrier for clean labels", desc: "Preservative-free products lean harder on packaging — we spec barriers accordingly." },
      { title: "Sustainable structure options", desc: "Recycle-ready mono-materials and PCR content that back up the brand story." },
    ],
    formats: [F.pouches, F.flat, F.rollstock, F.labels],
    finishes: "Matte kraft-look with minimal-ink design; paper-based structures with functional barriers.",
    applications: ["Granola & cereals", "Grains & legumes", "Superfoods", "Baking mixes", "Snacks"],
  },
  {
    slug: "health-beauty",
    name: "Health & Beauty Packaging",
    tagline: "Beauty-counter polish in flexible formats.",
    intro:
      "Personal care products need packaging with cosmetic-grade finish quality and chemical-resistant structures — sachets for sampling, spouted pouches for refills, and premium prints that belong on a vanity.",
    demands: [
      { title: "Chemical-resistant sealants", desc: "Structures compatible with oils, actives, fragrances, and surfactants." },
      { title: "Cosmetic-grade aesthetics", desc: "Soft-touch finishes, metallic details, and flawless print built for beauty standards." },
      { title: "Sample & refill economy", desc: "Sachets for trial programs; spouted refill pouches that cut plastic versus rigid bottles." },
    ],
    formats: [F.stick, F.spout, F.flat, F.labels],
    finishes: "Soft-touch and pearlescent finishes; foil accents for prestige lines.",
    applications: ["Masks & serums samples", "Bath salts & soaks", "Lotion refills", "Hair care", "Single-use kits"],
  },
  {
    slug: "medical",
    name: "Medical Supplies Packaging",
    tagline: "Clean, compliant, and controlled.",
    intro:
      "Medical and hygiene products demand documented materials, reliable seal integrity, and clear traceability. We support medical-adjacent programs with controlled production, spec documentation, and dependable supply.",
    demands: [
      { title: "Documented material compliance", desc: "Spec sheets and material documentation that support your regulatory files." },
      { title: "Seal reliability", desc: "Consistent, validated seal performance protecting product integrity." },
      { title: "Traceability", desc: "Lot-level tracking and COA documentation from an SQF-certified facility." },
    ],
    formats: [F.flat, F.pouches, F.rollstock, F.labels],
    finishes: "Clean clinical print with high-legibility compliance zones.",
    compliance: "Produced under SQF-certified controls; documentation packages available per program.",
    applications: ["Gauze & dressings", "Hygiene products", "Test kit components", "Wellness devices"],
  },
  {
    slug: "lawn-garden",
    name: "Lawn & Garden Packaging",
    tagline: "Tough enough for the garage shelf.",
    intro:
      "Seeds, fertilizers, and garden products need UV-resistant, moisture-tight, puncture-proof packaging that survives garages, sheds, and outdoor handling — with reseal systems for season-long use.",
    demands: [
      { title: "Outdoor-grade durability", desc: "Heavy laminations that handle rough storage, sun, and temperature swings." },
      { title: "Moisture protection both ways", desc: "Keeps seeds dry and keeps moist products from drying out." },
      { title: "Season-long reseal", desc: "Closures built for repeated use across a growing season." },
    ],
    formats: [F.quad, F.pouches, F.flat, F.rollstock],
    finishes: "High-gloss with instructional print zones; heavy-duty matte for professional lines.",
    applications: ["Seeds", "Fertilizers", "Soil amendments", "Plant food", "Pest control"],
  },
  {
    slug: "rice-grains-pasta",
    name: "Rice, Grain & Pasta Packaging",
    tagline: "Pantry staples, premium presentation.",
    intro:
      "Staples compete on trust and value — packaging that protects against moisture and pests, stands up straight on shelf, and elevates everyday products into branded pantry pieces.",
    demands: [
      { title: "Pest & moisture defense", desc: "Tight barrier structures that protect dry goods in long pantry storage." },
      { title: "Heavy-fill stability", desc: "Gusseted formats that stand square and stack clean at multi-pound fills." },
      { title: "Window-forward design", desc: "Clear panels that show grain quality while framing the brand." },
    ],
    formats: [F.quad, F.pouches, F.flat, F.rollstock],
    finishes: "Clean gloss with large windows; kraft-look for heritage and organic lines.",
    applications: ["Rice", "Pasta", "Beans & legumes", "Flour & baking", "Ancient grains"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
