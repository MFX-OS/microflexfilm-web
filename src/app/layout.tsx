import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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

// Tidio live chat. Customer chats route into a Google Chat space via Tidio's
// native Google Chat integration so Randy + team reply directly inside Google
// Chat without switching apps. Loads only when NEXT_PUBLIC_TIDIO_PUBLIC_KEY is
// set to a real public key (alphanumeric, ~10 chars). Placeholder values are
// ignored so the site stays clean until a real key is provisioned.
const TIDIO_PUBLIC_KEY = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY;
const TIDIO_ENABLED = TIDIO_PUBLIC_KEY && /^[a-z0-9]{8,40}$/i.test(TIDIO_PUBLIC_KEY);

// Google Analytics 4 — defaults to the Firebase web app's measurement ID.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-JSN4SZ1J2Z";
// Microsoft Clarity heatmaps/session replay — opt-in via env.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

// Sitewide structured data (Organization) for rich search results.
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Microflex Film Corporation",
  url: "https://microflexfilm.com",
  logo: "https://microflexfilm.com/images/microflex-logo-white.png",
  email: "info@microflexfilm.com",
  telephone: "+1-909-360-9066",
  description:
    "Flexible packaging, printed film, labels, pouches, sachets, stick packs, and shrink sleeves. SQF certified, solar powered, manufactured in the USA.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4130 Garner Rd.",
    addressLocality: "Riverside",
    addressRegion: "CA",
    postalCode: "92501",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {/* Organization structured data (rendered in SSR HTML for crawlers) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
        {children}

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}

        {/* Microsoft Clarity (optional) */}
        {CLARITY_ID && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
          </Script>
        )}

        {TIDIO_ENABLED && (
          <Script
            id="tidio-chat"
            strategy="afterInteractive"
            src={`//code.tidio.co/${TIDIO_PUBLIC_KEY}.js`}
          />
        )}
      </body>
    </html>
  );
}
