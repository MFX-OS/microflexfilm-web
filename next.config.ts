import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
    return Object.entries(map).map(([from, to]) => ({
      source: `/industries/${from}`,
      destination: `/industries/${to}`,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
