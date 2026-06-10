import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuidePage from "@/components/GuidePage";
import { applicationPages, getApplicationPage } from "@/data/applicationPages";

export function generateStaticParams() {
  return applicationPages.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getApplicationPage(slug);
  if (!p) return {};
  return {
    title: p.seoTitle,
    description: p.metaDesc,
    alternates: { canonical: `https://microflexfilm.com/applications/${p.slug}` },
  };
}

export default async function ApplicationRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getApplicationPage(slug);
  if (!p) notFound();

  const idx = applicationPages.findIndex((x) => x.slug === p.slug);
  const related = [...applicationPages.slice(idx + 1), ...applicationPages.slice(0, idx)]
    .slice(0, 6)
    .map((x) => ({ slug: x.slug, title: x.title }));

  return (
    <>
      <Header />
      <GuidePage page={p} related={related} relatedTitle="Explore more applications" basePath="/applications" />
      <Footer />
    </>
  );
}
