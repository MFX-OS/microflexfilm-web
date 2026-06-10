export type Capability = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  intro: string;
  anatomy: { n: number; title: string; desc: string }[];
  features: { title: string; desc: string }[];
  bestFor: string[];
  consider: { text: string; link?: { label: string; slug: string } }[];
  applications: string[];
  education: { title: string; body: string };
};

export const capabilities: Capability[] = [
  {
    slug: "pouches",
    name: "Pouches & Flexible Packaging",
    shortName: "Pouches",
    tagline: "A 360° shelf billboard that protects, reseals, and ships light.",
    intro:
      "Stand-up and lay-flat pouches turn flexible film into structured, shelf-ready packaging. Multi-layer laminations protect the product inside while the printed surface works as your brand's billboard on every side.",
    anatomy: [
      { n: 1, title: "Resealable zipper", desc: "Press-to-close or slider closures keep product fresh between uses and add everyday convenience." },
      { n: 2, title: "Tear notch", desc: "A clean, controlled opening point — no scissors required." },
      { n: 3, title: "Multi-layer film structure", desc: "Print layer, barrier layer, and sealant layer laminated together. The barrier blocks moisture, oxygen, light, and aroma transfer." },
      { n: 4, title: "Bottom gusset", desc: "The fold that lets the pouch stand upright on shelf and expand with fill volume." },
      { n: 5, title: "Side seals", desc: "Heat-sealed edges engineered for strength and a clean finished look." },
      { n: 6, title: "Print panel", desc: "Front, back, and gusset surfaces are all printable — full-coverage branding in matte, gloss, soft-touch, or metallic finishes." },
    ],
    features: [
      { title: "Shelf presence", desc: "Stand-up formats display upright with full-coverage print on every panel — strong facings without rigid packaging cost." },
      { title: "Engineered barrier protection", desc: "Lamination structures matched to your product's sensitivity: moisture, oxygen, UV, and aroma control." },
      { title: "Reseal & convenience options", desc: "Zippers, tear notches, hang holes, and clear windows tailored to how your customer actually uses the product." },
      { title: "Lightweight & efficient", desc: "Flexible packaging ships flat, fills fast, and dramatically reduces weight versus rigid containers." },
      { title: "Finish flexibility", desc: "Matte, gloss, soft-touch, metallic, and clear-window combinations to match your brand's look." },
      { title: "Format range", desc: "Stand-up, lay-flat, side-gusseted, and custom shapes across a wide range of sizes." },
    ],
    bestFor: [
      "Retail food, snacks, coffee, and pet products that need shelf impact",
      "Supplements and powders that need barrier protection and reseal",
      "Brands replacing jars, boxes, or rigid containers to cut cost and weight",
      "Products where the package itself is part of the brand experience",
    ],
    consider: [
      { text: "You need single-dose, portion-controlled packaging", link: { label: "Stick Packs & Sachets", slug: "stick-packs" } },
      { text: "You already run automated form-fill-seal equipment and fill in-line", link: { label: "Printed Film / Rollstock", slug: "rollstock" } },
      { text: "Your product needs rigid structural protection — talk to us about hybrid approaches" },
    ],
    applications: ["Coffee & Tea", "Snacks", "Pet Treats", "Supplements", "Powders & Mixes", "Home & Refill", "Frozen", "Confection"],
    education: {
      title: "How a pouch is built",
      body: "Your artwork is printed on the outer film web, then laminated to barrier and sealant layers selected for your product. The laminated web is formed, gusseted, and sealed into finished pouches — delivered ready to fill by hand or machine. Structure, closure, and finish are engineered around how your product is filled, shipped, and used.",
    },
  },
  {
    slug: "labels",
    name: "Labels & Stickers",
    shortName: "Labels",
    tagline: "Five engineered layers that turn any container into branded packaging.",
    intro:
      "Pressure-sensitive labels are the fastest path from product to branded shelf presence. A precision-built stack of facestock, adhesive, and protective finish applies cleanly by hand or at line speed.",
    anatomy: [
      { n: 1, title: "Facestock", desc: "The visible label material — paper or film, white, clear, or metallized — chosen for look and durability." },
      { n: 2, title: "Ink layer", desc: "Your printed artwork: brand color, text, codes, and compliance content." },
      { n: 3, title: "Laminate / varnish", desc: "A protective top finish that resists moisture, abrasion, and scuffing — gloss, matte, or soft-touch." },
      { n: 4, title: "Adhesive", desc: "Permanent, removable, or specialty adhesives matched to your container surface and storage conditions." },
      { n: 5, title: "Release liner", desc: "The carrier web that protects the adhesive until application — by hand or automatic applicator." },
      { n: 6, title: "Die-cut shape", desc: "Custom shapes cut to your container geometry for clean, registered application." },
    ],
    features: [
      { title: "Fast to launch", desc: "Labels move from approved artwork to applied product faster than nearly any packaging format — ideal for launches and refreshes." },
      { title: "Durable in the real world", desc: "Laminates and film facestocks stand up to moisture, oil, refrigeration, and handling." },
      { title: "Any container, any surface", desc: "Adhesive systems for glass, plastic, metal, and paperboard — flat or curved." },
      { title: "Multi-SKU friendly", desc: "Run families of SKUs efficiently — same die, different artwork — keeping unit costs predictable." },
      { title: "Hand or machine application", desc: "Supplied on rolls or sheets configured for your application method." },
      { title: "Premium finish options", desc: "Metallic stocks, clear no-label looks, spot varnish, and tactile finishes." },
    ],
    bestFor: [
      "Bottles, jars, tins, and boxes that need branding without custom packaging",
      "New products testing the market before investing in printed film",
      "Product lines with many SKUs or frequent artwork changes",
      "Brands adding compliance, batch, or barcode content to existing packaging",
    ],
    consider: [
      { text: "You want 360° decoration that conforms to curved containers", link: { label: "Bottles & Specialty Formats", slug: "specialty" } },
      { text: "Volume is high enough to print directly on your packaging film", link: { label: "Printed Film / Rollstock", slug: "rollstock" } },
    ],
    applications: ["Bottles & Jars", "Tins", "Boxes & Cartons", "Promo & Branding", "Compliance & Barcodes", "Tamper Seals"],
    education: {
      title: "How a label is built",
      body: "Every label is a stack: facestock carries your print, a protective laminate or varnish shields it, the adhesive bonds it to your container, and the release liner carries it to application. Each layer is selected for your surface, environment, and application method — which is why the same artwork can need very different constructions for a refrigerated jar versus a dry-goods box.",
    },
  },
  {
    slug: "rollstock",
    name: "Printed Film / Rollstock",
    shortName: "Rollstock",
    tagline: "Continuous printed film, engineered to run on your filling lines.",
    intro:
      "Rollstock is printed, laminated film supplied on rolls — built to run on vertical or horizontal form-fill-seal equipment where the package is formed, filled, and sealed in one continuous operation.",
    anatomy: [
      { n: 1, title: "Web width", desc: "The roll width, matched precisely to your forming equipment specification." },
      { n: 2, title: "Print repeat", desc: "Your artwork repeating down the web — one repeat per finished package." },
      { n: 3, title: "Eye mark", desc: "The registration mark your equipment's sensor reads to cut and seal each package in exactly the right place." },
      { n: 4, title: "Lamination structure", desc: "Print, barrier, and sealant webs bonded into one engineered material." },
      { n: 5, title: "Sealant layer", desc: "The inner layer that forms strong, consistent seals at your line's temperature and speed." },
      { n: 6, title: "Core & unwind", desc: "Core size and unwind orientation configured to load directly onto your equipment." },
    ],
    features: [
      { title: "Built for automation", desc: "Runs on VFFS and HFFS lines — pillow bags, flow wrap, sachet webs, and lidding applications." },
      { title: "Efficient at scale", desc: "Printing directly on the film web eliminates separate labeling and premade-bag costs at volume." },
      { title: "Engineered seal performance", desc: "Sealant systems specified for your machine's speed, temperature, and product characteristics." },
      { title: "Full-web graphics", desc: "High-impact print across the entire package surface, with registered placement every cycle." },
      { title: "Barrier matched to product", desc: "Moisture, oxygen, and light protection built into the lamination." },
      { title: "Production consistency", desc: "Tight registration and controlled tolerances roll after roll, run after run." },
    ],
    bestFor: [
      "Brands and co-packers running form-fill-seal equipment",
      "High-volume products filled in-line — snacks, powders, liquids, frozen",
      "Operations consolidating label + bag into one printed material",
      "Programs that need repeatable, spec-controlled supply",
    ],
    consider: [
      { text: "You don't have filling equipment — premade pouches fill by hand or simple sealers", link: { label: "Pouches & Flexible Packaging", slug: "pouches" } },
      { text: "You need small-format single-dose packaging", link: { label: "Stick Packs & Sachets", slug: "stick-packs" } },
    ],
    applications: ["Snacks & Chips", "Frozen Foods", "Powders", "Liquids & Sauces", "Flow Wrap", "Lidding Film", "Co-Pack Programs"],
    education: {
      title: "How rollstock runs on your line",
      body: "Your form-fill-seal machine pulls film off the roll, forms it around a tube or through a die, fills the product, and seals each package — reading the printed eye mark to register every cut. That's why rollstock is specified to your equipment, not just your artwork: web width, repeat length, core size, unwind direction, and sealant chemistry all have to match the machine. Send us your equipment spec and we engineer the film to run on it.",
    },
  },
  {
    slug: "specialty",
    name: "Bottles & Specialty Formats",
    shortName: "Specialty",
    tagline: "Full-body decoration that conforms to any container shape.",
    intro:
      "Shrink sleeves and specialty formats wrap your container in 360° of print — conforming to curves, contours, and complex shapes that flat labels can't follow, with built-in tamper evidence.",
    anatomy: [
      { n: 1, title: "Full-body shrink sleeve", desc: "A printed film tube that shrinks tightly around the container under heat, following every contour." },
      { n: 2, title: "360° print area", desc: "The entire container surface becomes printable — no front/back label limits." },
      { n: 3, title: "Tamper-evident band", desc: "Sleeve extends over the closure to provide visible tamper evidence — broken means opened." },
      { n: 4, title: "Conforming fit", desc: "Distortion-compensated artwork keeps logos and text true as the sleeve shrinks to complex curves." },
      { n: 5, title: "Perforation", desc: "Engineered tear lines for clean opening and easier separation in recycling streams." },
    ],
    features: [
      { title: "Maximum brand real estate", desc: "Use the entire container as your canvas — 360° graphics that flat labels can't match." },
      { title: "Works on complex shapes", desc: "Contoured bottles, jars, cans, and unique container geometries all sleeve cleanly." },
      { title: "Tamper evidence built in", desc: "Neck bands and full-body sleeves give customers visible product-integrity assurance." },
      { title: "No-label premium look", desc: "High-gloss, matte, and metallic sleeve finishes deliver a fully decorated, premium presentation." },
      { title: "Container flexibility", desc: "Change container suppliers or shapes without re-engineering your decoration approach." },
      { title: "Specialty format support", desc: "Beyond sleeves — Microflex supports specialty and custom presentation formats project by project." },
    ],
    bestFor: [
      "Beverages, supplements, and personal care in contoured containers",
      "Products that need tamper evidence at retail",
      "Brands that want full-body decoration and premium shelf presence",
      "Multi-container product families needing one consistent look",
    ],
    consider: [
      { text: "Your container has flat panels and simple geometry — labels are faster and leaner", link: { label: "Labels & Stickers", slug: "labels" } },
      { text: "Your product is flexible-only with no rigid container", link: { label: "Pouches & Flexible Packaging", slug: "pouches" } },
    ],
    applications: ["Beverages", "Supplements", "Personal Care", "Sauces & Condiments", "Tamper Bands", "Promotional Editions"],
    education: {
      title: "How a shrink sleeve works",
      body: "Artwork is printed on heat-shrinkable film, distortion-compensated so graphics stay true on curved surfaces, then seamed into a tube. The tube slides over your container and passes through a heat tunnel, shrinking to grip every contour. Because decoration is independent of the container itself, you can sleeve glass, plastic, or metal — and change containers without starting over.",
    },
  },
  {
    slug: "stick-packs",
    name: "Stick Packs & Sachets",
    shortName: "Stick Packs",
    tagline: "Precision single-serve packaging — one dose, zero waste.",
    intro:
      "Stick packs and sachets deliver exactly one portion: powders, liquids, gels, and granules sealed in slim, portable, tear-open formats that travel anywhere your customer goes.",
    anatomy: [
      { n: 1, title: "Top & bottom seals", desc: "Heat seals that close each dose — engineered for clean tearing and fill integrity." },
      { n: 2, title: "Tear notch", desc: "Controlled opening exactly where the customer expects it — no scissors, no struggle." },
      { n: 3, title: "Back seal (fin seal)", desc: "The longitudinal seal that forms the stick's tube — slim profile, strong closure." },
      { n: 4, title: "Print panel", desc: "Compact but complete branding: logo, flavor, dosage, and compliance content." },
      { n: 5, title: "4-side seal sachet", desc: "The flat alternative — sealed on all four edges for samples, liquids, and wider-format doses." },
    ],
    features: [
      { title: "Perfect portion control", desc: "Every package is one dose — consistent, measured, and mess-free for the customer." },
      { title: "Ultra portable", desc: "Slim sticks fit pockets, gym bags, and purses — packaging that travels with the customer." },
      { title: "Sampling powerhouse", desc: "Low material per unit makes sticks and sachets the most efficient format for trial and sampling programs." },
      { title: "Versatile contents", desc: "Powders, granules, liquids, and gels — with barrier structures matched to each." },
      { title: "High-speed production", desc: "Multi-lane filling means high output and efficient unit economics at volume." },
      { title: "Freshness per dose", desc: "Each serving is individually sealed — the tenth dose is as fresh as the first." },
    ],
    bestFor: [
      "Supplement, electrolyte, and drink-mix brands selling per-serving",
      "Sampling and trial programs that need low cost per unit",
      "Condiments, sauces, and single-use personal care",
      "Products where dosing accuracy matters to the customer",
    ],
    consider: [
      { text: "Customers use multiple servings per sitting — a resealable pouch fits better", link: { label: "Pouches & Flexible Packaging", slug: "pouches" } },
      { text: "You fill on your own equipment and need printed web", link: { label: "Printed Film / Rollstock", slug: "rollstock" } },
    ],
    applications: ["Drink Mixes", "Electrolytes", "Supplements", "Condiments", "Cosmetic Samples", "Coffee & Beverage", "Nutraceuticals"],
    education: {
      title: "Stick pack vs. sachet — which one?",
      body: "Stick packs are slim tubes sealed at top and bottom — ideal for pouring powders into bottles and for pocket portability. Sachets are flat, four-side-sealed packets — better for liquids, gels, creams, and wider contents like wipes or samples. Fill volume, product flow, and how your customer opens and uses the dose determine the right format; we'll guide you through it in a consult.",
    },
  },
  {
    slug: "display",
    name: "Display & Shipping Packaging",
    shortName: "Display & Shipping",
    tagline: "The outer layer of your packaging system — protect, present, deliver.",
    intro:
      "Display and shipping packaging completes the system: corrugated shippers that protect product in transit, retail-ready displays that sell it on arrival, and branded presentations that make the unboxing part of the experience.",
    anatomy: [
      { n: 1, title: "Corrugated structure", desc: "Fluted board engineered for stacking strength and transit protection." },
      { n: 2, title: "Printed exterior", desc: "Branding, handling marks, and retail-facing graphics on the outer surface." },
      { n: 3, title: "Display conversion", desc: "Trays and shippers that convert to shelf-ready displays — cut case labor at retail." },
      { n: 4, title: "Interior fitment", desc: "Inserts, dividers, and trays that hold product securely and present it cleanly on opening." },
      { n: 5, title: "Tear-open perforation", desc: "Engineered perf lines so the case opens clean and displays right the first time." },
    ],
    features: [
      { title: "Retail-ready displays", desc: "PDQ trays and display shippers that go from pallet to shelf in seconds — retailers favor brands that make stocking easy." },
      { title: "Transit protection", desc: "Structures specified for your product's weight, fragility, and shipping environment." },
      { title: "Branded unboxing", desc: "Printed interiors, fitted inserts, and presentation details that make opening the box a brand moment." },
      { title: "Kitting & sample programs", desc: "Sample kits, influencer mailers, and multi-product presentations assembled and ready to ship." },
      { title: "System thinking", desc: "Designed alongside your primary packaging so the pouch, label, and shipper work as one program." },
      { title: "DTC and retail in one program", desc: "Configurations for e-commerce shipping and retail display from the same product line." },
    ],
    bestFor: [
      "Brands shipping DTC that want unboxing to feel premium",
      "Products heading to club stores or retail displays",
      "Sample kits, launch kits, and influencer mailer programs",
      "Teams that want primary + secondary packaging coordinated in one place",
    ],
    consider: [
      { text: "You only need primary product packaging right now", link: { label: "Pouches & Flexible Packaging", slug: "pouches" } },
      { text: "You need branding on existing boxes — labels may be all it takes", link: { label: "Labels & Stickers", slug: "labels" } },
    ],
    applications: ["E-Commerce Shippers", "Retail Displays", "Club Packs", "Sample Kits", "Subscription Boxes", "Launch Kits"],
    education: {
      title: "Packaging as a system",
      body: "Your customer meets your packaging three times: the shipper that arrives intact, the display or box that presents the product, and the primary package in their hand. When those layers are designed together — structure, print, and fitment coordinated — every touchpoint reinforces the brand and nothing gets damaged in between. That's why we design display and shipping packaging alongside your primary format, not after it.",
    },
  },
  {
    slug: "flat-pouches",
    name: "Flat & 3-Side-Seal Pouches",
    shortName: "Flat Pouches",
    tagline: "The lean, clean workhorse of flexible packaging.",
    intro:
      "Flat pouches seal your product between two printed webs — simple, efficient, and endlessly versatile. From single-serve samples to family-size refills, they deliver maximum print area with minimum material.",
    anatomy: [
      { n: 1, title: "Top seal / opening", desc: "Heat-sealed top with optional tear notch or zipper for clean opening and reclose." },
      { n: 2, title: "Tear notch", desc: "Controlled opening point placed where the customer expects it." },
      { n: 3, title: "Three-side seal perimeter", desc: "Sealed edges on three sides create a flat, efficient package with strong integrity." },
      { n: 4, title: "Print panels — front & back", desc: "Two full faces of printable space for branding, instructions, and compliance." },
      { n: 5, title: "Film structure", desc: "Lamination selected for your product's barrier needs — from economical to high-barrier." },
    ],
    features: [
      { title: "Material-efficient", desc: "The leanest format per unit — less film, lower cost, lighter shipping." },
      { title: "Display flexibility", desc: "Hang holes for peg display, lay-flat for bins and counters, stackable for shipping." },
      { title: "Fast to produce", desc: "Simple construction means quick turns from approved art to delivered pouches." },
      { title: "Scales down beautifully", desc: "The format of choice for samples, single-serves, and trial-size programs." },
      { title: "Full barrier range", desc: "From clear economy films to foil ultra-barrier — the structure matches the product." },
      { title: "Reseal options", desc: "Add zippers for multi-use products without changing the format's efficiency." },
    ],
    bestFor: [
      "Single-serve and sample programs that need low cost per unit",
      "Peg-displayed products needing hang holes and flat faces",
      "Powders, mixes, spices, and flat-profile products",
      "Brands that want maximum print area per material dollar",
    ],
    consider: [
      { text: "Your product needs to stand upright on a shelf", link: { label: "Stand-Up Pouches", slug: "pouches" } },
      { text: "You need slim single-dose tubes for powders or liquids", link: { label: "Stick Packs & Sachets", slug: "stick-packs" } },
    ],
    applications: ["Samples & trials", "Spices", "Drink mixes", "Jerky", "Wipes", "Hardware & parts"],
    education: {
      title: "Why flat pouches stay popular",
      body: "Every format trend comes and goes, but flat pouches persist because the economics are unbeatable: two webs, three seals, done. When your product doesn't need to stand up or pour, paying for gussets and fitments is wasted spend. The flat pouch puts that budget into better film, better print, or better margin.",
    },
  },
  {
    slug: "quad-seal",
    name: "Quad-Seal & Flat-Bottom Pouches",
    shortName: "Quad-Seal",
    tagline: "Box-like structure. Flexible-packaging economics.",
    intro:
      "Quad-seal and flat-bottom pouches use four sealed corner edges and a square base to create the most structured, premium-standing format in flexible packaging — five printable panels and a shelf presence that rivals a box.",
    anatomy: [
      { n: 1, title: "Four corner seals", desc: "Vertical seals at each corner create crisp, box-like edges and structural stability." },
      { n: 2, title: "Flat square bottom", desc: "A true flat base that stands square, stacks clean, and maximizes shelf footprint." },
      { n: 3, title: "Five print panels", desc: "Front, back, two sides, and top — more branded real estate than any other pouch." },
      { n: 4, title: "Reclose system", desc: "Zippers, sliders, or fold-over tin-tie closures for products used over weeks." },
      { n: 5, title: "Heavy-fill construction", desc: "Reinforced laminations engineered for dense, heavy products." },
    ],
    features: [
      { title: "Premium shelf architecture", desc: "Stands square and tall like a carton — with flexible packaging's cost and weight advantages." },
      { title: "Maximum brand real estate", desc: "Five printable panels for storytelling, instructions, and certifications." },
      { title: "Built for heavy fills", desc: "Coffee, protein, pet food — quad-seals handle multi-pound products confidently." },
      { title: "Efficient cube utilization", desc: "Square footprints pack tighter on shelves, in cases, and on pallets." },
      { title: "Side-panel functionality", desc: "Degassing valves, windows, and reclose systems integrate cleanly into side panels." },
      { title: "Upscale finish pairing", desc: "Matte and soft-touch finishes complete the premium-carton impression." },
    ],
    bestFor: [
      "Coffee, protein, and pet food brands with heavy fills",
      "Premium products that need carton-level shelf presence",
      "Multi-week products needing strong reclose systems",
      "Brands maximizing pallet and shelf-space efficiency",
    ],
    consider: [
      { text: "Lighter fills and simpler needs — a stand-up pouch costs less", link: { label: "Stand-Up Pouches", slug: "pouches" } },
      { text: "You fill on form-fill-seal equipment", link: { label: "Printed Film / Rollstock", slug: "rollstock" } },
    ],
    applications: ["Coffee", "Protein powder", "Pet food", "Rice & grains", "Granola", "Fertilizer"],
    education: {
      title: "Quad-seal vs. stand-up: how to choose",
      body: "Both formats stand on shelf — the difference is structure and panels. A stand-up pouch curves softly and gives you front, back, and gusset print. A quad-seal stands architecturally square with five crisp panels and handles heavier fills without slumping. If your product weighs more than a pound or your brand competes against boxes, quad-seal usually earns its premium.",
    },
  },
  {
    slug: "fin-seal",
    name: "Fin-Seal & Flow-Wrap Pouches",
    shortName: "Fin-Seal",
    tagline: "High-speed pillow packs for high-volume products.",
    intro:
      "Fin-seal (pillow) pouches form around your product on high-speed flow-wrap and VFFS lines — a back fin seal and two end seals produce the fastest, most economical wrapped format in the industry.",
    anatomy: [
      { n: 1, title: "End seals", desc: "Top and bottom crimp seals close each package at line speed." },
      { n: 2, title: "Tear entry", desc: "Serrated crimps or notches give customers an easy opening point." },
      { n: 3, title: "Back fin seal", desc: "The longitudinal seal running down the back — the format's signature closure." },
      { n: 4, title: "Wraparound print", desc: "Continuous graphics around the full circumference of the package." },
      { n: 5, title: "Registered film", desc: "Eye-marked rollstock keeps every package's graphics perfectly positioned." },
    ],
    features: [
      { title: "Fastest format in packaging", desc: "Flow-wrap lines run at speeds no premade format can match — economics that win at volume." },
      { title: "Snug product fit", desc: "The film forms around the product — minimal excess material, clean presentation." },
      { title: "Single-serve champion", desc: "Bars, candies, and unit-portion products are flow-wrap's home territory." },
      { title: "Multipack ready", desc: "Individually wrapped units bundle cleanly into bags, boxes, and club packs." },
      { title: "Barrier options", desc: "From economical OPP to high-barrier laminations for sensitive products." },
      { title: "Supplied as rollstock", desc: "Delivered as printed roll film specified precisely to your wrapping equipment." },
    ],
    bestFor: [
      "Bars, candies, and single-portion products at volume",
      "Brands running flow-wrap or VFFS equipment",
      "Multipack programs needing individually wrapped units",
      "High-volume SKUs where unit economics decide winners",
    ],
    consider: [
      { text: "No wrapping equipment — premade pouches need only a sealer", link: { label: "Flat Pouches", slug: "flat-pouches" } },
      { text: "Product needs to stand on a retail shelf solo", link: { label: "Stand-Up Pouches", slug: "pouches" } },
    ],
    applications: ["Protein bars", "Candy", "Baked goods", "Frozen novelties", "Soap & personal care"],
    education: {
      title: "How flow wrap works",
      body: "Printed film feeds off a roll, forms into a tube around your product, seals along the back fin, then crimps and cuts at each end — one continuous motion at hundreds of packages per minute. Because the machine reads printed eye marks to position every cut, the film must be engineered to your wrapper's specs: web width, repeat, registration, and sealant. That's rollstock engineering, and it's exactly what we do.",
    },
  },
  {
    slug: "die-cut",
    name: "Die-Cut & Shaped Pouches",
    shortName: "Die-Cut Shapes",
    tagline: "Break the rectangle. Own the shelf.",
    intro:
      "Custom die-cut pouches turn packaging itself into brand identity — bottle silhouettes, product shapes, character outlines. When every competitor is a rectangle, a shape gets remembered.",
    anatomy: [
      { n: 1, title: "Custom die line", desc: "Your unique perimeter shape, engineered for clean cutting and strong seals." },
      { n: 2, title: "Tear entry", desc: "Opening features positioned to work with the custom geometry." },
      { n: 3, title: "Shaped seal perimeter", desc: "Seals follow the contour — engineered so shape never compromises integrity." },
      { n: 4, title: "Full-shape print", desc: "Graphics designed into the silhouette for a package that is the brand." },
      { n: 5, title: "Hang feature", desc: "Integrated hang holes for peg display where shaped packages shine." },
    ],
    features: [
      { title: "Unmissable differentiation", desc: "A shaped package breaks the visual pattern of every rectangular competitor around it." },
      { title: "Shape as brand asset", desc: "Bottle, fruit, mascot, product silhouette — the package becomes a trademark." },
      { title: "Peg-display power", desc: "Shaped pouches with hang holes dominate impulse and checkout pegs." },
      { title: "Full functionality retained", desc: "Zippers, barriers, and windows all integrate into shaped formats." },
      { title: "Engineered manufacturability", desc: "We refine your shape so it cuts clean, seals strong, and fills efficiently." },
      { title: "Limited-edition energy", desc: "Seasonal shapes and special editions that create collection appeal." },
    ],
    bestFor: [
      "Brands fighting for attention on crowded pegs and shelves",
      "Products with iconic shapes worth celebrating",
      "Kids' products, novelty items, and seasonal editions",
      "Sample programs that need to be memorable",
    ],
    consider: [
      { text: "Maximum fill efficiency matters more than shape", link: { label: "Stand-Up Pouches", slug: "pouches" } },
      { text: "High-volume economics rule the category", link: { label: "Fin-Seal & Flow-Wrap", slug: "fin-seal" } },
    ],
    applications: ["Candy & novelty", "Kids' snacks", "Drink mixes", "Cosmetics", "Promotional editions"],
    education: {
      title: "Designing a shape that works",
      body: "Great shaped pouches start with manufacturing reality: seal areas need adequate width, inside curves need minimum radii, and fill openings need clearance for your filling method. Send us your concept and we'll engineer a die line that keeps the personality while sealing strong and filling clean — then prototype it before you commit.",
    },
  },
  {
    slug: "child-resistant",
    name: "Child-Resistant Pouches",
    shortName: "Child-Resistant",
    tagline: "Certified protection without sacrificing brand.",
    intro:
      "Child-resistant pouches pair certified-difficult opening systems with everything else you expect from premium flexible packaging — full print, real barriers, and adult-friendly operation.",
    anatomy: [
      { n: 1, title: "CR zipper system", desc: "Press-and-slide or pinch-and-pull closures requiring coordinated adult dexterity." },
      { n: 2, title: "Controlled opening", desc: "Opening mechanics tested against child-access protocols while staying senior-friendly." },
      { n: 3, title: "Tear-resistant lamination", desc: "Film structures that resist puncture, tearing, and determined small hands." },
      { n: 4, title: "Opacity options", desc: "Opaque structures that conceal contents where regulations or safety require." },
      { n: 5, title: "Compliance print zones", desc: "Dedicated panel space for warnings, dosage, and regulatory content." },
    ],
    features: [
      { title: "Certification-path closures", desc: "CR systems aligned to 16 CFR 1700 testing protocols for regulated products." },
      { title: "Adult-friendly by design", desc: "Difficult for children, manageable for adults and seniors — the balance that matters." },
      { title: "No brand compromise", desc: "Full print quality, premium finishes, and barrier performance with CR built in." },
      { title: "Reseal that stays CR", desc: "Closures remain child-resistant through repeated open-close cycles." },
      { title: "Barrier protection included", desc: "Moisture, oxygen, and odor barriers appropriate to sensitive contents." },
      { title: "Regulatory print support", desc: "Layout guidance for warning statements and compliance content." },
    ],
    bestFor: [
      "Products regulators require to be child-resistant",
      "Supplements, medications, and high-potency products",
      "Household chemicals and concentrated products",
      "Any product where accidental child access is a real risk",
    ],
    consider: [
      { text: "No regulatory or safety driver — standard zippers cost less", link: { label: "Stand-Up Pouches", slug: "pouches" } },
      { text: "Single-dose format eliminates the reclose question", link: { label: "Stick Packs & Sachets", slug: "stick-packs" } },
    ],
    applications: ["Regulated products", "Supplements & actives", "Household chemicals", "Pharma-adjacent"],
    education: {
      title: "How child resistance is verified",
      body: "Child-resistant packaging in the U.S. is defined by protocol testing: panels of children must be substantially unable to open the package, while adults — including seniors — must open it without trouble. The closure system, film structure, and seal design all play roles. If your product requires certified CR packaging, we'll walk you through the closure options and documentation in a consult.",
    },
  },
  {
    slug: "spouted-pouches",
    name: "Spouted & Fitment Pouches",
    shortName: "Spouted Pouches",
    tagline: "Pour, squeeze, reclose — the bottle replacement.",
    intro:
      "Spouted pouches add a rigid pour spout and cap to flexible packaging — clean dispensing for liquids, gels, and purees with a fraction of a bottle's plastic, weight, and freight cost.",
    anatomy: [
      { n: 1, title: "Spout & cap fitment", desc: "Welded pour spout with tamper-evident cap — clean dispensing and secure reclose." },
      { n: 2, title: "Spout weld zone", desc: "The engineered seal where rigid fitment meets flexible film — strength-critical." },
      { n: 3, title: "Liquid-rated laminations", desc: "Flex-crack-resistant films that survive squeezing, shipping, and refrigeration." },
      { n: 4, title: "Stand-up gusset", desc: "Stable base keeps the pouch upright in fridge doors and on shelves." },
      { n: 5, title: "Full-face print", desc: "Wraparound branding that bottles with labels can't match." },
    ],
    features: [
      { title: "Massive plastic reduction", desc: "Dramatically less plastic than rigid bottles — a sustainability story customers can see." },
      { title: "Freight that fits", desc: "Pouches ship flat before filling and weigh far less after — pallets go further." },
      { title: "Cleaner dispensing", desc: "Controlled pour and squeeze without scooping, splashing, or contamination." },
      { title: "Kid-friendly formats", desc: "Choke-guard spouts for squeeze pouches in baby food and kids' snacks." },
      { title: "Cap variety", desc: "Flip-tops, screw caps, tamper-evident bands — matched to use case." },
      { title: "Refill-economy ready", desc: "The format powering refill programs in personal care and home goods." },
    ],
    bestFor: [
      "Sauces, dressings, and liquid foods replacing bottles",
      "Baby food and yogurt squeeze formats",
      "Refill programs in personal care and home care",
      "Brands with sustainability commitments and liquid products",
    ],
    consider: [
      { text: "Single-use portions — sachets dispense without fitment cost", link: { label: "Stick Packs & Sachets", slug: "stick-packs" } },
      { text: "Dry products don't need a spout", link: { label: "Stand-Up Pouches", slug: "pouches" } },
    ],
    applications: ["Baby food", "Sauces & condiments", "Beverages", "Soap & lotion refills", "Yogurt & smoothies"],
    education: {
      title: "Why brands are switching from bottles",
      body: "A spouted pouch typically uses far less plastic than the rigid bottle it replaces, ships flat to your filler, and cubes out dramatically better in transit. Customers get a package that pours like a bottle and empties more completely. The trade-off is fill equipment compatibility — which is exactly what we help you work through before you commit.",
    },
  },
];

export function getCapability(slug: string) {
  return capabilities.find((c) => c.slug === slug);
}
