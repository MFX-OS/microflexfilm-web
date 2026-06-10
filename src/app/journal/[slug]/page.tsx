import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteChecklist from "@/components/QuoteChecklist";
import { journalArticles, getJournalArticle } from "@/data/journalArticles";

export function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getJournalArticle(slug);
  if (!a) return {};
  return {
    title: `${a.title} | Packaging Engineering Journal`,
    description: a.intro.slice(0, 158),
    alternates: { canonical: `https://microflexfilm.com/journal/${a.slug}` },
  };
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-4 mt-12">
      <div className="kicker mb-2"><span className="font-mono">{n}</span></div>
      <h2 className="display text-[clamp(24px,2.8vw,38px)] text-paper">{title}</h2>
    </div>
  );
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getJournalArticle(slug);
  if (!a) notFound();

  const idx = journalArticles.findIndex((x) => x.slug === a.slug);
  const more = [...journalArticles.slice(idx + 1), ...journalArticles.slice(0, idx)].slice(0, 4);

  return (
    <>
      <Header />
      <main id="top">
        <article>
          <section className="grid-backdrop relative py-14 md:py-20">
            <div className="container-x">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <a href="/journal" className="kicker transition hover:opacity-80">
                  ← Packaging Engineering Journal
                </a>
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan"
                  style={{ border: "1px solid rgba(0,216,242,0.3)", background: "rgba(0,216,242,0.05)" }}
                >
                  {a.cat}
                </span>
              </div>
              <h1 className="display max-w-[880px] text-[clamp(30px,4.2vw,56px)] text-paper">
                {a.title}
              </h1>
              <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted">{a.intro}</p>
            </div>
          </section>

          <div className="container-x"><div className="hairline" /></div>

          <section className="pb-10">
            <div className="container-x max-w-[860px]">
              <SectionHead n="01" title="The problem, framed." />
              <p className="text-lg leading-relaxed text-muted">{a.framing}</p>

              <SectionHead n="02" title="What's actually going on." />
              <p className="text-lg leading-relaxed text-muted">{a.technical}</p>

              <SectionHead n="03" title="How to decide." />
              <div className="grid gap-3">
                {a.decide.map((d, i) => (
                  <div
                    key={d}
                    className="flex gap-4 rounded-2xl p-4"
                    style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(0,216,242,0.04)" }}
                  >
                    <span className="font-mono text-sm font-black text-cyan">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm leading-relaxed text-muted-light">{d}</span>
                  </div>
                ))}
              </div>

              <SectionHead n="04" title="Common mistakes." />
              <div className="grid gap-3 sm:grid-cols-2">
                {a.mistakes.map((m) => (
                  <div
                    key={m}
                    className="flex gap-3 rounded-2xl p-4"
                    style={{ border: "1px solid rgba(255,120,120,0.25)", background: "rgba(255,80,80,0.05)" }}
                  >
                    <span className="font-black" style={{ color: "#ff9d9d" }}>✕</span>
                    <span className="text-sm leading-relaxed text-muted-light">{m}</span>
                  </div>
                ))}
              </div>

              <SectionHead n="05" title="Your checklist." />
              <QuoteChecklist items={a.checklist} context={a.title} />

              <SectionHead n="06" title="Where to go next." />
              <div className="grid gap-3 sm:grid-cols-2">
                {a.related.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    className="rounded-2xl p-4 transition hover:-translate-y-0.5"
                    style={{ border: "1px solid rgba(0,216,242,0.25)", background: "rgba(255,255,255,0.035)" }}
                  >
                    <span className="block text-sm font-bold text-paper">{r.label}</span>
                    <span className="mt-1 block text-[11px] font-extrabold uppercase text-cyan" style={{ letterSpacing: "0.08em" }}>
                      Open →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="py-10">
            <div className="container-x">
              <div
                className="rounded-4xl p-8 text-center md:p-12"
                style={{
                  border: "1px solid rgba(0,216,242,0.35)",
                  background: "radial-gradient(circle at 50% 0%, rgba(0,216,242,0.12), transparent 60%), rgba(255,255,255,0.03)",
                }}
              >
                <h2 className="display text-[clamp(26px,3.4vw,44px)] text-paper">
                  Need help applying this to your product?
                </h2>
                <p className="mx-auto mt-3 max-w-[640px] text-muted">
                  Microflex can review your product type, fill weight, barrier concerns, format
                  options, artwork status, quantity, SKU count, and timeline to help identify a
                  practical packaging direction.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href="/packaging-spec-builder" className="btn btn-primary">{a.cta}</a>
                  <a href="/#quote-form" className="btn btn-secondary">Request a Quote</a>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-16 md:pb-20">
            <div className="container-x">
              <div className="kicker mb-5">Keep reading</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {more.map((m) => (
                  <a
                    key={m.slug}
                    href={`/journal/${m.slug}`}
                    className="rounded-2xl p-4 transition hover:-translate-y-1"
                    style={{ border: "1px solid rgba(0,216,242,0.18)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-cyan">{m.cat}</span>
                    <span className="block text-sm font-bold text-paper">{m.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
