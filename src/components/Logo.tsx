import Image from "next/image";
import Link from "next/link";

type Size = "sm" | "md" | "lg" | "xl" | "2xl";
type Variant = "light" | "dark";

// Heights (in px) at each size. Width derived from logo aspect ratio.
const heightMap: Record<Size, number> = {
  sm: 36,
  md: 48,
  lg: 72,
  xl: 100,
  "2xl": 140,
};

// Master logo natural aspect ratio (8549 × 2500 = 3.42).
const ASPECT = 8549 / 2500;

export default function Logo({
  size = "md",
  variant = "light",
  href = "#top",
  ariaLabel = "Microflex Film Corporation home",
  priority = false,
}: {
  size?: Size;
  variant?: Variant;
  href?: string | null;
  ariaLabel?: string;
  priority?: boolean;
}) {
  const h = heightMap[size];
  const w = Math.round(h * ASPECT);

  // Single master file (white wordmark + cyan splash on transparent bg).
  // For dark backgrounds (Header/Hero/Footer) → display as-is.
  // For light backgrounds (Showcase section) → invert via CSS filter so wordmark
  //   becomes near-black while keeping the cyan splash close to its original hue.
  const filter =
    variant === "dark"
      ? "invert(1) hue-rotate(180deg) saturate(1.1)"
      : "none";

  const content = (
    <Image
      src="/images/microflex-logo-white.png"
      alt="Microflex Film Corporation"
      width={w}
      height={h}
      priority={priority}
      sizes={`${w}px`}
      style={{
        width: "auto",
        height: h,
        display: "block",
        filter,
      }}
    />
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label={ariaLabel} className="inline-flex">
      {content}
    </Link>
  );
}
