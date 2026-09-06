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
  // Content-Security-Policy in REPORT-ONLY mode first: it logs violations to the
  // browser console without blocking anything, so we can verify the allowlist is
  // complete before switching the key to "Content-Security-Policy" to enforce.
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://code.tidio.co https://*.tidio.co https://www.clarity.ms https://*.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self'",
      "frame-src 'self' https://drive.google.com https://*.google.com https://*.tidio.co",
      "connect-src 'self' https://*.googleapis.com https://www.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.clarity.ms https://*.tidio.co https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebaseinstallations.googleapis.com wss://*.firebaseio.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
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
      // b470docs (2026-09-06): every permanent QR printed on the 2026 controlled documents (FSQMS / MFX-OS) points at
      // microflexfilm.com/<DOCUMENT_ID>. The document pages live in the MFX-OS hosting tree (os.microflexfilm.com/doc/);
      // this is the permanent hop. IDs are never reused, so these two rules never change. Matching is case-insensitive
      // (Next default); the /doc/ app resolves a lowercase id to the document. Nothing else on the marketing site
      // starts with "FO-" or "MFX-". Register of IDs: MFX_2026_QR_Master_Register.xlsx (98 documents).
      { source: "/:id(FO-[A-Za-z0-9-]+)", destination: "https://os.microflexfilm.com/doc/?id=:id", permanent: true },
      { source: "/:id(MFX-[A-Za-z0-9-]+)", destination: "https://os.microflexfilm.com/doc/?id=:id", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
