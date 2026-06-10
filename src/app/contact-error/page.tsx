import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Something went wrong",
};

export default async function ContactError({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const sp = await searchParams;
  const reason =
    sp?.reason === "files"
      ? "One of the attached files couldn't be accepted — please check the file types (AI, PDF, PSD, PNG, JPG, TIFF, EPS, SVG, ZIP) and keep the total under 10 MB, or share a file link instead."
      : sp?.reason === "missing-fields"
      ? "Please fill in your name, company, and email so we can reach you."
      : "Something went wrong on our side. Please try again, or email us directly.";

  return (
    <>
      <Header />
      <main id="top" className="flex min-h-[70vh] items-center">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="kicker mb-5">We hit a snag</div>
            <h1 className="display text-[clamp(36px,5vw,64px)] text-paper">
              Inquiry didn&apos;t go through.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">{reason}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/#quote-form" className="btn btn-primary">
                Try again
              </Link>
              <a href="mailto:info@microflexfilm.com" className="btn btn-secondary">
                Email us instead
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
