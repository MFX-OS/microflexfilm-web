import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuidePage from "@/components/GuidePage";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { industryPages, getIndustryPage } from "@/data/industryPages";

export function generateStaticParams() {
  return industryPages.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getIndustryPage(slug);
  if (!p) return {};
  return {
    title: p.seoTitle,
    description: p.metaDesc,
    alternates: { canonical: `https://microflexfilm.com/industries/${p.slug}` },
  };
}

export default async function IndustryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getIndustryPage(slug);
  if (!p) notFound();

  const idx = industryPages.findIndex((x) => x.slug === p.slug);
  const related = [...industryPages.slice(idx + 1), ...industryPages.slice(0, idx)]
    .slice(0, 6)
    .map((x) => ({ slug: x.slug, title: x.title }));

  return (
    <>
      <Header />
      <BreadcrumbsJsonLd items={[
        { name: "Home", url: "https://microflexfilm.com" },
        { name: "Industries", url: "https://microflexfilm.com/industries" },
        { name: p.title, url: `https://microflexfilm.com/industries/${p.slug}` },
      ]} />
      <GuidePage page={p} related={related} relatedTitle="Explore more industries" basePath="/industries" />
      <Footer />
    </>
  );
}
