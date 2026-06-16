"use client";

import { useReportWebVitals } from "next/web-vitals";

type Gtag = (...args: unknown[]) => void;

/* Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) to GA4 as events, so you
   can see real-user performance in Analytics. No-ops if analytics aren't loaded
   (e.g., before consent). */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag !== "function") return;
    gtag("event", metric.name, {
      event_category: "Web Vitals",
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  });
  return null;
}
