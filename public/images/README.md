# Drop logo files here

To use the real Microflex Film logo on the site, save these files:

- `microflex-logo.png` — the full logo (any color background OK; transparent best)
- `microflex-logo-white.png` — wordmark in white instead of black, for dark backgrounds (optional)
- `microflex-mark.png` — just the M + splash, square crop, for favicons (optional)

Once dropped, I will swap the SVG approximation in `src/components/Logo.tsx`
for `next/image` references to these files.
