import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/contact-error"],
    },
    sitemap: "https://microflexfilm.com/sitemap.xml",
    host: "https://microflexfilm.com",
  };
}
