import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolCard } from "@/components/calc/shared";
import {
  ThicknessConverter,
  ThicknessChart,
  WeightVolumeConverter,
  CostComparison,
} from "@/components/calc/Converters";
import {
  PouchSizeCalc,
  RollstockCalc,
  CaseCalc,
  LabelSleeveCalc,
  BreakEvenCalc,
  SustainabilityCalc,
} from "@/components/calc/Estimators";
import {
  FormatFinder,
  BarrierSelector,
  FormatComparison,
  FinishVisualizer,
  DieLineGenerator,
} from "@/components/calc/DecisionTools";

export const metadata: Metadata = {
  title: "Packaging Calculators & Tools | 15 Free Interactive Estimators",
  description:
    "Free packaging tools: film thickness converter (micron/mil/gauge), pouch size estimator, digital vs flexo break-even, format finder quiz, barrier selector, die-line template generator, finish visualizer, and more.",
  alternates: { canonical: "https://microflexfilm.com/calculators" },
};

const sections = [
  {
    id: "decide",
    label: "Decide",
    title: "Decision tools",
    blurb: "Not sure what to order? These tools turn product facts into packaging direction.",
    tools: [
      { id: "format-finder", label: "Format Finder Quiz" },
      { id: "barrier-selector", label: "Barrier Selector" },
      { id: "format-comparison", label: "Format Comparison" },
      { id: "finish-visualizer", label: "Finish Visualizer" },
      { id: "dieline-generator", label: "Die-Line Generator" },
    ],
  },
  {
    id: "estimate",
    label: "Estimate",
    title: "Estimators",
    blurb: "Ballpark the physical and financial numbers before you request real quotes.",
    tools: [
      { id: "pouch-size", label: "Pouch Size" },
      { id: "break-even", label: "Digital vs Flexo" },
      { id: "label-sleeve", label: "Label & Sleeve Size" },
      { id: "rollstock-calc", label: "Rollstock Film" },
      { id: "case-pallet", label: "Case & Pallet" },
      { id: "sustainability", label: "Sustainability Savings" },
    ],
  },
  {
    id: "convert",
    label: "Convert",
    title: "Converters & references",
    blurb: "The units packaging is specified in — converted instantly, charted for reference.",
    tools: [
      { id: "thickness", label: "Thickness Converter" },
      { id: "thickness-chart", label: "Gauge Chart" },
      { id: "weight-volume", label: "Weight ↔ Volume" },
      { id: "cost-compare", label: "Quote Comparison" },
    ],
  },
];

export default function CalculatorsPage() {
  return (
    <>
      <Header />
      <main id="top">
        {/* Hero */}
        <section className="grid-backdrop relative py-14 md:py-20">
          <div className="container-x">
            <div className="kicker mb-3">Packaging Tools</div>
            <h1 className="display text-[clamp(36px,5vw,68px)] text-paper">
              15 free tools. Zero guesswork.
            </h1>
            <p className="mt-4 max-w-[720px] text-xl font-bold leading-snug text-cyan">
              Decide your format. Estimate your numbers. Convert your units.
            </p>
            <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-muted">
              Every packaging project starts with the same questions — what format, what size,
              what thickness, what will it cost. These interactive tools answer them in
              seconds, each with plain-English guidance on how to use it and why the answer
              matters. Bookmark this page; your future projects will thank you.
            </p>

            {/* Jump nav */}
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {sections.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl p-5"
                  style={{ border: "1px solid rgba(0,216,242,0.22)", background: "rgba(255,255,255,0.038)" }}
                >
                  <div className="kicker mb-2 text-[10px]">{s.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tools.map((t) => (
                      <a
                        key={t.id}
                        href={`#${t.id}`}
                        className="rounded-full px-3 py-1.5 text-[11px] font-bold text-muted-light transition hover:text-cyan"
                        style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.04)" }}
                      >
                        {t.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* ============ DECIDE ============ */}
        <section id="decide" className="scroll-mt-28 py-14 md:py-18">
          <div className="container-x grid gap-8">
            <div className="max-w-3xl">
              <div className="kicker mb-3">Section 01 — Decide</div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">{sections[0].title}</h2>
              <p className="mt-3 text-lg text-muted">{sections[0].blurb}</p>
            </div>

            <ToolCard
              id="format-finder"
              n="1.1"
              title="Format Finder Quiz"
              answers="“Which packaging format is right for my product?”"
              how={[
                "Answer five quick questions about your product, customer, and filling process.",
                "Get your top-match format plus a runner-up worth comparing.",
                "Click through to the format's full technical blueprint.",
              ]}
              why="Format is the first and most expensive decision in packaging — pick wrong and you re-tool, re-quote, and re-launch. Sixty seconds here points you at the right blueprint before any money moves."
            >
              <FormatFinder />
            </ToolCard>

            <ToolCard
              id="barrier-selector"
              n="1.2"
              title="Barrier Selector"
              answers="“What barrier protection does my product actually need?”"
              how={[
                "Check every threat that degrades your product — moisture, oxygen, light, aroma, grease, freezing.",
                "Read the recommended starting structure and why it fits.",
                "Follow the link to explore that barrier system in the materials library.",
              ]}
              why="Under-spec the barrier and your product goes stale on shelf. Over-spec it and you pay for protection you don't need on every single unit. Matching barrier to threat is where packaging budgets are won."
            >
              <BarrierSelector />
            </ToolCard>

            <ToolCard
              id="format-comparison"
              n="1.3"
              title="Format Comparison"
              answers="“How do these formats actually differ, side by side?”"
              how={[
                "Tap up to three formats to add them to the table.",
                "Compare shelf behavior, reclose, print panels, barrier range, fill weight, and equipment needs.",
                "Click any column header to open that format's blueprint.",
              ]}
              why="Format pages sell each format on its own terms — this table makes them compete. Seeing 'equipment needed' and 'fill weight' side by side usually settles the debate in one look."
            >
              <FormatComparison />
            </ToolCard>

            <ToolCard
              id="finish-visualizer"
              n="1.4"
              title="Finish Visualizer"
              answers="“What will my pouch look like in matte vs. gloss vs. metallic?”"
              how={[
                "Click each finish to preview it on the same pouch.",
                "Note how the finish changes the brand impression before reading a word.",
                "Order the sample kit to feel the difference physically — finish is a touch decision too.",
              ]}
              why="Finish is the single fastest premium cue a package sends, and it's nearly free to choose well. Brands routinely under-think it — then wonder why a competitor's identical product reads more expensive."
            >
              <FinishVisualizer />
            </ToolCard>

            <ToolCard
              id="dieline-generator"
              n="1.5"
              title="Die-Line Template Generator"
              answers="“What dimensions should my designer build the artwork to?”"
              how={[
                "Enter your pouch width, height, and gusset.",
                "Preview the template — die line, 0.125″ bleed, safety margin, and gusset fold at true proportions.",
                "Download the SVG and hand it to your designer as the planning canvas.",
              ]}
              why="Most artwork rejections trace back to art built without a die line — wrong size, no bleed, text in the gusset fold. Starting from a dimensioned template prevents the most common (and most avoidable) production delay."
            >
              <DieLineGenerator />
            </ToolCard>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* ============ ESTIMATE ============ */}
        <section id="estimate" className="scroll-mt-28 py-14 md:py-18">
          <div className="container-x grid gap-8">
            <div className="max-w-3xl">
              <div className="kicker mb-3">Section 02 — Estimate</div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">{sections[1].title}</h2>
              <p className="mt-3 text-lg text-muted">{sections[1].blurb}</p>
            </div>

            <ToolCard
              id="pouch-size"
              n="2.1"
              title="Pouch Size Estimator"
              answers="“What size pouch fits my fill weight?”"
              how={[
                "Pick the product type closest to yours — this sets the bulk density.",
                "Enter your fill weight in ounces.",
                "Read the estimated fill volume and the suggested standard pouch size.",
              ]}
              why="Pouch size drives material cost, shelf footprint, and perceived value all at once. Starting near the right size means your first quote and first samples are already in the zone."
            >
              <PouchSizeCalc />
            </ToolCard>

            <ToolCard
              id="break-even"
              n="2.2"
              title="Digital vs. Flexo Break-Even"
              answers="“At my volume, which print method is cheaper?”"
              how={[
                "Enter your run quantity (defaults are illustrative — replace with real quotes when you have them).",
                "Compare total cost for digital versus flexo including plate costs.",
                "Note the break-even quantity — below it digital wins, above it flexo wins.",
              ]}
              why="This is the most misunderstood economics in packaging. Digital has no tooling but a flat unit cost; flexo front-loads plates then gets cheap. Knowing where the lines cross keeps you from overpaying at either end — and tells you when it's time to graduate."
            >
              <BreakEvenCalc />
            </ToolCard>

            <ToolCard
              id="label-sleeve"
              n="2.3"
              title="Label & Sleeve Size Calculator"
              answers="“What size label or shrink sleeve fits my container?”"
              how={[
                "Choose wrap label or shrink sleeve.",
                "Enter your container's diameter and the height you want covered.",
                "Get label width with overlap, or sleeve layflat width and cut length.",
              ]}
              why="Label and sleeve dims are pure geometry — but get the overlap or shrink allowance wrong and you get gaps, wrinkles, or misregistered seams on every unit. This does the π for you."
            >
              <LabelSleeveCalc />
            </ToolCard>

            <ToolCard
              id="rollstock-calc"
              n="2.4"
              title="Rollstock Film Estimator"
              answers="“How much printed film does my run consume?”"
              how={[
                "Enter the finished bag width and height your machine produces.",
                "Enter the number of units you need.",
                "Read web width, print repeat, and total lineal feet of film required.",
              ]}
              why="Film is quoted by the roll, not the bag — so translating your unit count into web math is step one of any rollstock conversation. Walking in with lineal footage makes your quote faster and sharper."
            >
              <RollstockCalc />
            </ToolCard>

            <ToolCard
              id="case-pallet"
              n="2.5"
              title="Case & Pallet Calculator"
              answers="“How many cases and pallets will my order become?”"
              how={[
                "Enter units per case and your case pattern (cases per layer × layers).",
                "Enter total order units.",
                "Get case count, units per pallet, and total pallets for freight planning.",
              ]}
              why="Storage and freight surprises eat margins after the packaging math was already done. Knowing your pallet count before ordering means warehouse space and shipping quotes are real numbers, not guesses."
            >
              <CaseCalc />
            </ToolCard>

            <ToolCard
              id="sustainability"
              n="2.6"
              title="Sustainability Savings Estimator"
              answers="“How much material do I save switching to pouches?”"
              how={[
                "Enter your annual unit volume.",
                "Enter your current package weight and the comparable pouch weight in grams (defaults are typical).",
                "See material saved per year, percentage reduction, and the freight equivalent.",
              ]}
              why="Sustainability claims need numbers behind them — for customers, retailers, and ESG reporting. Flexible packaging's weight advantage over rigid is dramatic, and this puts your specific figure on it."
            >
              <SustainabilityCalc />
            </ToolCard>
          </div>
        </section>

        <div className="container-x"><div className="hairline" /></div>

        {/* ============ CONVERT ============ */}
        <section id="convert" className="scroll-mt-28 py-14 md:py-18">
          <div className="container-x grid gap-8">
            <div className="max-w-3xl">
              <div className="kicker mb-3">Section 03 — Convert</div>
              <h2 className="display text-[clamp(30px,3.8vw,54px)] text-paper">{sections[2].title}</h2>
              <p className="mt-3 text-lg text-muted">{sections[2].blurb}</p>
            </div>

            <ToolCard
              id="thickness"
              n="3.1"
              title="Film Thickness Converter"
              answers="“What is 75 micron in mil, gauge, mm, and inches?”"
              how={[
                "Enter any thickness value.",
                "Select its unit — micron, mil, gauge, millimeter, or inch.",
                "All five units update instantly. One converter, every direction.",
              ]}
              why="Film specs arrive in whatever unit the supplier prefers — microns from one, gauge from another, mil on the spec sheet. Comparing quotes without converting correctly is how brands accidentally buy thinner film than they think."
            >
              <ThicknessConverter />
            </ToolCard>

            <ToolCard
              id="thickness-chart"
              n="3.2"
              title="Gauge Thickness Reference Chart"
              answers="“What's the standard gauge-to-mil-to-micron table?”"
              how={[
                "Scan the chart for the gauge you've been quoted.",
                "Read across for mil, micron, millimeter, and inch equivalents.",
                "Bookmark it — this table comes up in every film conversation.",
              ]}
              why="The industry talks in three units interchangeably and assumes you keep up. Having the standard chart on hand means you're never the one nodding along without knowing the thickness being discussed."
            >
              <ThicknessChart />
            </ToolCard>

            <ToolCard
              id="weight-volume"
              n="3.3"
              title="Fill Weight ↔ Volume Converter"
              answers="“My product is sold in ounces — how many mL is that, and vice versa?”"
              how={[
                "Enter a value in ounces, grams, fluid ounces, or milliliters.",
                "Pick the product type so density is applied correctly.",
                "Read the value in all four units at once.",
              ]}
              why="Weight and volume get conflated constantly — a 12 oz bag of chips and 12 fl oz of sauce are wildly different package sizes. Density-aware conversion prevents the classic sizing mistake before it reaches a quote."
            >
              <WeightVolumeConverter />
            </ToolCard>

            <ToolCard
              id="cost-compare"
              n="3.4"
              title="Quote Comparison Calculator"
              answers="“How different are these two quotes, really — per unit and per year?”"
              how={[
                "Enter both quote totals.",
                "Add your units per run and runs per year.",
                "See the percentage difference, savings per unit, and the annualized impact.",
              ]}
              why="A few hundred dollars between quotes looks small until you multiply by every run, every year. And the reverse matters too: a slightly higher quote with the right structure is often the cheaper decision. This makes both visible."
            >
              <CostComparison />
            </ToolCard>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <div
              className="rounded-5xl p-8 text-center md:p-14"
              style={{
                border: "1px solid rgba(0,216,242,0.35)",
                background: "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.14), transparent 60%), rgba(255,255,255,0.03)",
              }}
            >
              <h2 className="display text-[clamp(30px,4vw,56px)] text-paper">
                Estimates done? Let&rsquo;s get you real numbers.
              </h2>
              <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed text-muted">
                Bring your tool results to a quote — format, size, and volume in hand — and
                your specialist can skip straight to engineering and pricing.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/#quote-form" className="btn btn-primary">Request a Quote</a>
                <a href="/#sample-kit" className="btn btn-secondary">Request Sample Kit</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
