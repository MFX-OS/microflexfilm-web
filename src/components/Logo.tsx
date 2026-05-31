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
  href = "/",
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

  // Real master files for both variants:
  //   light = WHITE wordmark + cyan splash → for dark backgrounds (Header / Hero / Footer)
  //   dark  = BLACK wordmark + cyan splash → for light backgrounds (Showcase section)
  const src =
    variant === "light"
      ? "/images/microflex-logo-white.png"
      : "/images/microflex-logo.png";

  const content = (
    <Image
      src={src}
      alt="Microflex Film Corporation"
      width={w}
      height={h}
      priority={priority}
      sizes={`${w}px`}
      style={{
        width: "auto",
        height: h,
        display: "block",
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
