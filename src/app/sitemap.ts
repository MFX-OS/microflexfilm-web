import type { MetadataRoute } from "next";
import { capabilities } from "@/data/capabilities";
import { industryPages } from "@/data/industryPages";
import { applicationPages } from "@/data/applicationPages";
import { journalArticles } from "@/data/journalArticles";
import { caseStudies } from "@/data/caseStudies";
import { serviceAreas } from "@/data/serviceAreas";

const BASE = "https://microflexfilm.com";

function uniqueSlugs(items: { slug: string }[]): string[] {
  return Array.from(new Set(items.map((i) => i.slug)));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "", "/about", "/capabilities", "/industries", "/applications", "/journal",
    "/materials", "/printing", "/artwork-guidelines", "/calculators",
    "/packaging-spec-builder", "/configurator", "/faq", "/terms",
    "/case-studies", "/accessibility", "/service-areas",
  ];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : p === "/configurator" ? 0.9 : 0.7,
  }));

  const dynamic: MetadataRoute.Sitemap = [
    ...uniqueSlugs(capabilities).map((s) => ({ url: `${BASE}/capabilities/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...uniqueSlugs(industryPages).map((s) => ({ url: `${BASE}/industries/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...uniqueSlugs(applicationPages).map((s) => ({ url: `${BASE}/applications/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...uniqueSlugs(journalArticles).map((s) => ({ url: `${BASE}/journal/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...uniqueSlugs(caseStudies).map((s) => ({ url: `${BASE}/case-studies/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...uniqueSlugs(serviceAreas).map((s) => ({ url: `${BASE}/service-areas/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];

  return [...staticRoutes, ...dynamic];
}
