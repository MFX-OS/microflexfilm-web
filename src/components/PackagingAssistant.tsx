"use client";

import { useRef, useState } from "react";

/* Free, client-side guided helper — no API, no cost. Matches a question to
   Microflex's FAQ + packaging know-how and routes to the right next step. */

type Link = { label: string; href: string };
type Msg = { role: "user" | "bot"; text: string; links?: Link[] };

const QUOTE: Link = { label: "Start a Project", href: "/#quote-form" };
const STUDIO: Link = { label: "Open 3D Studio", href: "/configurator" };
const SAMPLES: Link = { label: "Request Sample Kit", href: "/#sample-kit" };
const MATERIALS: Link = { label: "Materials & Finishes", href: "/materials" };

type Entry = { keywords: string[]; answer: string; links?: Link[] };

const KB: Entry[] = [
  {
    keywords: ["quote", "price", "pricing", "cost", "how much", "estimate"],
    answer:
      "We quote each job to your spec — there's no fixed online price because it depends on format, size, quantity, structure, and finish. Tell us those and we usually come back with more than one option to compare. The 3D Studio gives you a ballpark estimate while you design.",
    links: [QUOTE, STUDIO],
  },
  {
    keywords: ["moq", "minimum", "minimum order", "quantity", "how many", "smallest"],
    answer:
      "Minimums depend on the format and print method — pre-made pouches start lower than rollstock runs. Send your target quantity with a quote request and we'll confirm the MOQ and price breaks for your exact job.",
    links: [QUOTE],
  },
  {
    keywords: ["lead time", "turnaround", "how long", "timeline", "fast", "rush", "when"],
    answer:
      "Typical production is about 15 business days from approved proof, plus prepress and shipping. Rush paths exist for some jobs — flag your in-hands date on the quote and we'll tell you what's possible.",
    links: [QUOTE],
  },
  {
    keywords: ["artwork", "file", "design", "dieline", "prepress", "proof", "ai", "pdf", "vector"],
    answer:
      "Send print-ready vector art (AI/PDF/EPS) with fonts outlined and a bit of bleed. Not sure? Our prepress team reviews everything and flags issues before plates. See the artwork guidelines, or upload files with your project.",
    links: [{ label: "Artwork Guidelines", href: "/artwork-guidelines" }, QUOTE],
  },
  {
    keywords: ["format", "pouch", "types", "options", "what can you make", "bag"],
    answer:
      "We make stand-up pouches, flat/lay-flat pouches, quad-seal and box-bottom bags, spouted pouches, stick packs, sachets, printed rollstock, shrink sleeves, and labels. Spin them up in 3D to compare.",
    links: [STUDIO, { label: "All Formats", href: "/capabilities" }],
  },
  {
    keywords: ["rollstock", "roll stock", "premade", "pre-made", "vs pouch", "rollstock vs"],
    answer:
      "Rollstock runs on your form-fill-seal line and is efficient at higher volumes; pre-made pouches are great for flexibility, lower volumes, and premium shelf presence. We'll help you pick based on your filling line and quantities.",
    links: [{ label: "Rollstock vs. Pouches", href: "/journal/rollstock-vs-premade-pouches" }, QUOTE],
  },
  {
    keywords: ["finish", "matte", "gloss", "soft touch", "soft-touch", "metallic", "foil", "look", "premium"],
    answer:
      "Finish drives perception: matte and soft-touch read premium/natural, gloss makes color pop, metallic/foil signals quality. Many brands combine a matte base with spot-gloss or foil accents. Explore finishes on the Materials page or try them in 3D.",
    links: [MATERIALS, STUDIO],
  },
  {
    keywords: ["barrier", "moisture", "oxygen", "shelf life", "shelf-life", "fresh", "protect", "light"],
    answer:
      "We engineer the barrier (moisture, oxygen, light, aroma) to your product's sensitivity and shelf-life target — enough protection without over-paying for what you don't need. Tell us the product and target shelf life and we'll spec it.",
    links: [MATERIALS, QUOTE],
  },
  {
    keywords: ["coffee", "tea", "beans", "degassing", "valve"],
    answer:
      "Coffee usually wants an aroma + oxygen barrier, often with a one-way degassing valve, on a stand-up or box-bottom bag. Matte or soft-touch finishes are popular for specialty roasters.",
    links: [{ label: "Coffee Packaging", href: "/industries/coffee-packaging" }, QUOTE],
  },
  {
    keywords: ["supplement", "powder", "protein", "vitamin", "capsule", "nutraceutical"],
    answer:
      "Supplements and powders typically need a strong moisture + light barrier with compliance-ready print area — barrier lamination, often matte with metallic accents. Stick packs and sachets work well for single-serve.",
    links: [{ label: "Supplement Packaging", href: "/industries/nutritional-supplement-packaging" }, QUOTE],
  },
  {
    keywords: ["sustainable", "sustainability", "recycle", "recyclable", "recycle-ready", "pcr", "mono", "eco", "green"],
    answer:
      "We offer recycle-ready mono-material structures, PCR content, and lightweighting — matched to your barrier needs so you don't sacrifice protection. We'll show you the trade-offs for your product.",
    links: [{ label: "Recycle-Ready Packaging", href: "/journal/recycle-ready-flexible-packaging-guide" }, QUOTE],
  },
  {
    keywords: ["sample", "samples", "sample kit", "feel", "touch", "see"],
    answer:
      "Request a sample kit to feel real finishes and structures in hand before you commit — the fastest way to choose a look.",
    links: [SAMPLES, QUOTE],
  },
  {
    keywords: ["spout", "liquid", "sauce", "drink", "juice", "fitment", "cap"],
    answer:
      "Liquids and sauces do well in spouted pouches (with a fitment/cap) or sachets, on a strong sealant film for flex-crack and seal integrity. Configure a spouted pouch in 3D to see it.",
    links: [STUDIO, QUOTE],
  },
  {
    keywords: ["stick pack", "stickpack", "sachet", "single serve", "single-serve", "on the go"],
    answer:
      "Stick packs and sachets are ideal for single-serve powders, samples, and on-the-go formats — efficient and great for trial sizes.",
    links: [{ label: "Stick Packs & Sachets", href: "/capabilities/stick-packs" }, STUDIO],
  },
  {
    keywords: ["shrink sleeve", "sleeve", "label", "labels", "sticker", "bottle", "jar"],
    answer:
      "We print shrink sleeves for bottles/jars and a full range of labels and stickers. Sleeves give 360° decoration; labels suit simpler applications.",
    links: [{ label: "Labels & Specialty", href: "/capabilities/labels" }, QUOTE],
  },
  {
    keywords: ["3d", "configurator", "studio", "mockup", "visualize", "design tool", "preview"],
    answer:
      "The 3D Studio lets you pick a format, finish, color, and size, drop in your artwork, and spin a live mockup with an instant estimate — then lock the spec to start a quote.",
    links: [STUDIO],
  },
  {
    keywords: ["reorder", "portal", "order status", "track", "account", "existing order", "login", "sign in"],
    answer:
      "Existing clients can sign in to the Client Portal to view orders, approve proofs, message the team, and reorder in a couple of clicks.",
    links: [{ label: "Client Portal", href: "/portal" }, QUOTE],
  },
  {
    keywords: ["printing", "print", "flexo", "digital", "gravure", "method", "colors", "cmyk"],
    answer:
      "We print flexo and digital — digital is great for shorter runs and lots of SKUs, flexo for longer runs and spot colors. We'll recommend the path that fits your art and volume.",
    links: [{ label: "Printing Options", href: "/printing" }, QUOTE],
  },
  {
    keywords: ["contact", "call", "phone", "email", "human", "talk", "rep", "speak"],
    answer:
      "Reach the team at 909.360.9066 or info@microflexfilm.com, use the live chat in the corner, or start a project and your specialist will follow up.",
    links: [QUOTE],
  },
];

const STARTERS = [
  "What structure for coffee with a long shelf life?",
  "Rollstock vs. pre-made pouches?",
  "What finish looks premium for supplements?",
  "How do I get a quote?",
];

function respond(qRaw: string): { text: string; links?: Link[] } {
  const q = qRaw.toLowerCase();
  let best: Entry | null = null;
  let score = 0;
  for (const e of KB) {
    let s = 0;
    for (const k of e.keywords) if (q.includes(k)) s += k.length > 5 ? 2 : 1;
    if (s > score) { score = s; best = e; }
  }
  if (best && score > 0) return { text: best.answer, links: best.links };
  return {
    text:
      "Good question — the quickest way to a precise answer is to tell our team your product, format, and quantity. You can also explore options in the 3D Studio or browse materials. Try asking about formats, finishes, barriers, lead time, MOQ, artwork, or sustainability.",
    links: [QUOTE, STUDIO, MATERIALS],
  };
}

export default function PackagingAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const r = respond(q);
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: r.text, links: r.links }]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 60);
  }

  return (
    <div
      className="rounded-4xl p-6 md:p-8"
      style={{ border: "1px solid rgba(0,216,242,0.25)", background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))" }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xl">💬</span>
        <div className="kicker">Packaging Helper</div>
      </div>
      <h3 className="mb-4 text-xl font-black text-paper md:text-2xl">Not sure what you need? Just ask.</h3>

      <div
        ref={scrollRef}
        className="mb-3 grid gap-3 rounded-2xl p-4"
        style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2,5,9,0.35)", maxHeight: 360, overflowY: "auto" }}
      >
        {msgs.length === 0 ? (
          <div className="text-sm text-muted">
            Ask about formats, finishes, barriers, materials, lead time, minimums, artwork, or sustainability — I&rsquo;ll point you to the right spec and next step.
          </div>
        ) : (
          msgs.map((m, i) => {
            const mine = m.role === "user";
            return (
              <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[88%]">
                  <div
                    className="whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm"
                    style={{
                      background: mine ? "linear-gradient(135deg, rgba(0,216,242,0.18), rgba(0,168,207,0.1))" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${mine ? "rgba(0,216,242,0.4)" : "rgba(255,255,255,0.1)"}`,
                      color: "#f7fbff",
                    }}
                  >
                    {m.text}
                  </div>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.links.map((l) => (
                        <a key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ border: "1px solid rgba(0,216,242,0.35)", background: "rgba(0,216,242,0.08)", color: "#34e3f5" }}>
                          {l.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {msgs.length === 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} className="rounded-full px-3 py-1.5 text-left text-xs font-semibold transition hover:-translate-y-0.5" style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(0,216,242,0.05)", color: "#bdd0dc" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your packaging…"
          className="flex-1 rounded-xl px-4 py-3 text-sm text-paper"
          style={{ background: "rgba(2,5,9,0.6)", border: "1px solid rgba(255,255,255,0.14)" }}
        />
        <button type="submit" disabled={!input.trim()} className="btn btn-primary" style={!input.trim() ? { opacity: 0.5 } : undefined}>
          Ask
        </button>
      </form>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-dark">
        Quick guidance from our FAQ and packaging know-how — for exact pricing, lead time, and specs, start a project and our team will confirm.
      </p>
    </div>
  );
}
