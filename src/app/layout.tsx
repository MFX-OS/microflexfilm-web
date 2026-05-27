import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://microflexfilm.com"),
  title: {
    default: "Microflex Film Corporation | Flexible Packaging. Engineered to Perform.",
    template: "%s — Microflex Film",
  },
  description:
    "Microflex Film Corporation — flexible packaging, printed film, labels, pouches, sachets, stick packs, shrink sleeves, and custom packaging solutions.",
  keywords: [
    "flexible packaging",
    "printed film",
    "rollstock",
    "pouches",
    "stick packs",
    "sachets",
    "labels",
    "shrink sleeves",
    "Microflex Film Corporation",
    "Riverside packaging",
  ],
  icons: {
    icon: [
      { url: "/images/microflex-mark.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/microflex-mark.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/images/microflex-mark.png",
  },
  openGraph: {
    title: "Microflex Film Corporation — Flexible Packaging. Engineered to Perform.",
    description:
      "Flexible packaging, printed film, labels, pouches, sachets, stick packs, shrink sleeves, and custom solutions. SQF certified. Solar powered. Manufactured in the USA.",
    url: "https://microflexfilm.com",
    siteName: "Microflex Film Corporation",
    type: "website",
    images: [
      {
        url: "/images/microflex-logo-white.png",
        width: 8549,
        height: 2500,
        alt: "Microflex Film Corporation — Flexible Packaging. Engineered to Perform.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Microflex Film Corporation",
    description: "Flexible Packaging. Engineered to Perform.",
    images: ["/images/microflex-logo-white.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020509",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
