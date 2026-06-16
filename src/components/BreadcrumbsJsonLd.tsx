/* Renders BreadcrumbList structured data (helps SERP breadcrumbs + crawl depth).
   Server component — emits a JSON-LD <script> in the SSR HTML. */
export default function BreadcrumbsJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
