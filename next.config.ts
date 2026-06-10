import path from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS for two years, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Never MIME-sniff responses
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow embedding the site in iframes (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send only origin on cross-site navigation
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser APIs we don't use
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    serverActions: {
      // Allow artwork/PO uploads on the inquiry form (validated server-side)
      bodySizeLimit: "12mb",
    },
  },
  // Pin Next.js workspace root to this project so it ignores any stray
  // package-lock.json in parent directories (e.g. C:\Users\A10ti\).
  outputFileTracingRoot: path.join(__dirname),

  async redirects() {
    const map: Record<string, string> = {
      "coffee-tea": "coffee-packaging",
      snacks: "snack-packaging",
      "candy-confection": "gummy-packaging",
      gummies: "gummy-packaging",
      supplements: "nutritional-supplement-packaging",
      "protein-powder": "protein-powder-packaging",
      pet: "pet-food-packaging",
      "meat-jerky": "beef-jerky-packaging",
      "frozen-foods": "frozen-food-packaging",
      "freeze-dried": "freeze-dried-food-packaging",
      "dried-fruit-nuts": "dried-fruit-packaging",
      "sauces-liquids": "sauce-condiment-packaging",
      spices: "spice-seasoning-packaging",
      "organic-natural": "natural-product-packaging",
      "health-beauty": "health-beauty-packaging",
      medical: "medical-wellness-supplies-packaging",
      "lawn-garden": "lawn-garden-seed-packaging",
      "rice-grains-pasta": "rice-grain-packaging",
    };
    const industryRedirects = Object.entries(map).map(([from, to]) => ({
      source: `/industries/${from}`,
      destination: `/industries/${to}`,
      permanent: true,
    }));
    return [
      ...industryRedirects,
      { source: "/packaging-engineering-journal", destination: "/journal", permanent: true },
      { source: "/packaging-engineering-journal/:slug", destination: "/journal/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
