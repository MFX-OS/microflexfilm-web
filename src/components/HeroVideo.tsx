"use client";

import { useEffect, useState } from "react";

/* Plays the background film only on larger screens and when the visitor isn't
   on a data-saver / reduced-data connection. Otherwise shows the poster image —
   lighter and kinder on mobile data. */
export default function HeroVideo() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-data: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (wide && !reduced && !conn?.saveData) setPlay(true);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {play ? (
        <video
          className="h-full w-full object-cover opacity-[0.55]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero-loop.mp4" type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/video/hero-poster.jpg" alt="" className="h-full w-full object-cover opacity-[0.5]" />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(2,5,9,0.95) 0%, rgba(2,5,9,0.82) 40%, rgba(2,5,9,0.5) 72%, rgba(2,5,9,0.28) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(180deg, transparent, #020509)" }} />
    </div>
  );
}
