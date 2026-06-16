# Microflexfilm.com — AI / Generative Engine Optimization (GEO)

Goal: make the site one that AI assistants (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews, Copilot) crawl, trust, and **cite** when people ask about flexible packaging.

---

## ✅ Built into the site
- **AI crawlers explicitly welcomed** in `robots.txt` — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, and more. (Most sites accidentally block these; we allow them so the site can be referenced.)
- **`/llms.txt`** — the emerging llmstxt.org standard: a clean, plain-text, curated map of the site's most useful, citable content (capabilities, guides, tools, glossary, service areas, key facts). This is what well-behaved AI agents read to navigate a site efficiently.
- **`/glossary`** — plain-language definitions with **DefinedTermSet** structured data. Definitions are the single most-cited content type by AI answer engines.
- **Rich structured data everywhere** — LocalBusiness, FAQPage, BreadcrumbList, Article, Service, DefinedTermSet. This is how machines understand your entity, facts, and relationships.
- **Server-rendered, JS-free content** — all reference pages are static HTML (SSG), so crawlers that don't run JavaScript still get the full content.
- **A "Key facts" block** in `/llms.txt` — formats, finishes, barriers, certifications, contact — so models can quote precise, correct facts about Microflex.

## Why this works
AI answer engines pull from: (1) their crawl/index of the open web, (2) live retrieval at answer time, and (3) third-party mentions. The site is now optimized for (1) and (2). The biggest lever for (3) is below.

---

## 🔴 Do these off-site — earn the citations
AIs cite sources that are **mentioned and corroborated across the web**. To become the reference:

1. **Be factual, structured, and unique.** Keep adding definitive guides, comparisons, specs, and FAQs. Models favor clear, well-organized, factual content with headings, lists, and tables. Replace the "Representative" case studies with real, named ones (unique facts get cited).
2. **Get mentioned where models learn.** Aim for citations/mentions on high-trust, frequently-crawled sources: industry publications, Wikipedia-adjacent references, Reddit/Quora threads about packaging, supplier directories (Thomasnet), and trade associations. Models weight corroboration heavily.
3. **Author & expertise signals (E-E-A-T).** Add author names, titles, and "reviewed by" lines to journal articles, with dates. Expertise and freshness increase trust.
4. **Keep content fresh.** Update guides and add new ones regularly; recency is a ranking and citation signal.
5. **Earn backlinks.** The same links that help SEO help AI — they signal authority that models use to weight sources.
6. **Be consistent across the web.** Identical company facts (NAP, certifications, capabilities) everywhere reduce model uncertainty about your entity.

---

## Maintenance
- `/llms.txt` is generated from real data (`capabilities`, `journalArticles`, `serviceAreas`) — it stays current automatically as you add content.
- Extend the **glossary** (`src/data/glossary.ts`) over time — more clear definitions = more citable surface area.
- Validate structured data in Google's Rich Results Test and schema.org validator after changes.

## Quick wins
1. Publish 3–5 more definitive, factual guides (comparisons, specs, "how to choose…").
2. Add author + reviewed-by + dates to journal articles.
3. Replace representative case studies with real, named ones.
4. Pursue mentions on Thomasnet, trade press, and relevant Reddit/forum threads.
5. After deploy, confirm `/llms.txt` and `/robots.txt` load and that the glossary validates as DefinedTermSet.
