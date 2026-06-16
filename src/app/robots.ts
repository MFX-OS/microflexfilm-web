import type { MetadataRoute } from "next";

// AI / LLM crawlers we explicitly welcome so the site can be referenced and
// cited by AI assistants and answer engines.
const AI_BOTS = [
  "GPTBot", "ChatGPT-User", "OAI-SearchBot", // OpenAI
  "ClaudeBot", "Claude-Web", "anthropic-ai", // Anthropic
  "PerplexityBot", "Perplexity-User", // Perplexity
  "Google-Extended", // Google Gemini / AI Overviews training
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl (feeds many models)
  "Amazonbot", "cohere-ai", "Meta-ExternalAgent", "DuckAssistBot", "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/portal", "/contact-error"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/portal"] },
    ],
    sitemap: "https://microflexfilm.com/sitemap.xml",
    host: "https://microflexfilm.com",
  };
}
