import { capabilities } from "@/data/capabilities";
import { journalArticles } from "@/data/journalArticles";
import { serviceAreas } from "@/data/serviceAreas";

/* /llms.txt — an emerging standard (llmstxt.org) that gives AI assistants a
   clean, curated map of the site's most useful, citable content. Served as
   plain text, generated at build from real data. */

export const dynamic = "force-static";

const BASE = "https://microflexfilm.com";

function uniqueBy<T extends { slug: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter((x) => (seen.has(x.slug) ? false : (seen.add(x.slug), true)));
}

export async function GET() {
  const caps = uniqueBy(capabilities);
  const guides = journalArticles.slice(0, 20);

  const body = `# Microflex Film Corporation

> Flexible packaging manufacturer in Riverside, California. We make custom printed film, rollstock, stand-up and flat pouches, quad-seal and box-bottom bags, spouted pouches, stick packs, sachets, shrink sleeves, and labels. SQF-certified, solar-powered, and manufactured in the USA — serving brands across Southern California and nationwide. Strengths: barrier engineering (moisture, oxygen, light, aroma), finishes (matte, gloss, soft-touch, metallic, kraft), artwork/prepress control, and a customer portal for quotes, proofs, and reorders.

## Key facts
- Company: Microflex Film Corporation
- Location: 4130 Garner Rd., Riverside, CA 92501, USA
- Contact: info@microflexfilm.com · 909.360.9066
- Certifications/claims: SQF certified, solar powered, manufactured in the USA
- Formats: stand-up pouch, flat pouch, quad-seal bag, box-bottom bag, spouted pouch, stick pack, sachet, rollstock, shrink sleeve, label
- Finishes: matte, gloss, soft-touch, metallic/foil, kraft, clear/window
- Barriers: moisture, oxygen, light, aroma
- Print methods: flexographic and digital

## Tools
- [3D Packaging Configurator](${BASE}/configurator): Build a package in 3D — format, finish, color, size, artwork — with an instant estimate.
- [Packaging Spec Builder](${BASE}/packaging-spec-builder): Define a packaging spec step by step.
- [Calculators](${BASE}/calculators): Packaging format, barrier, and cost decision tools.

## Capabilities (formats)
${caps.map((c) => `- [${c.name}](${BASE}/capabilities/${c.slug})`).join("\n")}

## Guides & reference (Journal)
${guides.map((g) => `- [${g.title}](${BASE}/journal/${g.slug})`).join("\n")}

## Service areas
${serviceAreas.map((s) => `- [${s.industry} — ${s.region}](${BASE}/service-areas/${s.slug})`).join("\n")}

## Reference
- [Glossary of flexible packaging terms](${BASE}/glossary)
- [FAQ](${BASE}/faq)
- [Materials & finishes](${BASE}/materials)
- [Case studies](${BASE}/case-studies)
- [About Microflex](${BASE}/about)

## Start a project
- [Request a quote](${BASE}/#quote-form)
- [Request a sample kit](${BASE}/#sample-kit)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
