/* Blueprint-style annotated anatomy diagrams for capability pages.
   Numbered markers correspond to the anatomy legend in src/data/capabilities.ts */

function Marker({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="#020509" stroke="#00d8f2" strokeWidth="1.5" />
      <text
        x={x}
        y={y + 4.5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fill="#00d8f2"
        fontFamily="ui-monospace, monospace"
      >
        {n}
      </text>
    </g>
  );
}

function Leader({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="rgba(0,216,242,0.5)" strokeWidth="1" strokeDasharray="4 4" />;
}

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 560 420" className="w-full" role="img" aria-label={label}>
      <defs>
        <pattern id="bpgrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(0,216,242,0.07)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="560" height="420" fill="url(#bpgrid)" />
      <rect x="6" y="6" width="548" height="408" fill="none" stroke="rgba(0,216,242,0.25)" strokeWidth="1" />
      <text x="20" y="30" fontSize="11" fontFamily="ui-monospace, monospace" fill="rgba(0,216,242,0.65)" letterSpacing="3">
        {label.toUpperCase()}
      </text>
      <text x="540" y="402" textAnchor="end" fontSize="10" fontFamily="ui-monospace, monospace" fill="rgba(169,185,200,0.55)">
        MICROFLEX FILM — TECHNICAL BLUEPRINT
      </text>
      {children}
    </svg>
  );
}

export function PouchBlueprint() {
  return (
    <Frame label="Stand-Up Pouch — Anatomy">
      {/* Pouch body */}
      <path
        d="M195 90 L365 90 L378 330 Q378 352 352 352 L208 352 Q182 352 182 330 Z"
        fill="rgba(12,33,51,0.85)"
        stroke="#00d8f2"
        strokeWidth="2"
      />
      {/* Zipper */}
      <rect x="200" y="108" width="160" height="10" rx="3" fill="none" stroke="#34e3f5" strokeWidth="1.5" />
      <line x1="200" y1="113" x2="360" y2="113" stroke="#34e3f5" strokeWidth="1" strokeDasharray="6 3" />
      {/* Tear notch */}
      <path d="M365 132 l12 6 l-12 6" fill="none" stroke="#34e3f5" strokeWidth="2" />
      {/* Hang hole */}
      <circle cx="280" cy="100" r="0" fill="none" />
      {/* Side seals */}
      <line x1="195" y1="90" x2="182" y2="330" stroke="rgba(0,216,242,0.55)" strokeWidth="6" opacity="0.35" />
      <line x1="365" y1="90" x2="378" y2="330" stroke="rgba(0,216,242,0.55)" strokeWidth="6" opacity="0.35" />
      {/* Bottom gusset */}
      <path d="M182 330 Q280 300 378 330" fill="none" stroke="#34e3f5" strokeWidth="1.5" strokeDasharray="5 4" />
      {/* Print area */}
      <rect x="222" y="160" width="116" height="10" fill="#00d8f2" opacity="0.75" />
      <rect x="222" y="180" width="86" height="5" fill="#00d8f2" opacity="0.4" />
      <rect x="222" y="192" width="86" height="5" fill="#00d8f2" opacity="0.4" />
      {/* Film layers cutaway */}
      <g>
        <rect x="60" y="210" width="70" height="12" fill="#34e3f5" opacity="0.9" />
        <rect x="60" y="226" width="70" height="12" fill="#0087a8" />
        <rect x="60" y="242" width="70" height="12" fill="#102a40" stroke="#00d8f2" strokeWidth="0.8" />
        <text x="95" y="276" textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, monospace" fill="#a9b9c8">
          PRINT / BARRIER / SEALANT
        </text>
      </g>
      <Leader d="M130 235 L185 235" />
      {/* Markers + leaders */}
      <Marker x={160} y={113} n={1} />
      <Leader d="M173 113 L198 113" />
      <Marker x={415} y={138} n={2} />
      <Leader d="M402 138 L380 138" />
      <Marker x={95} y={185} n={3} />
      <Marker x={280} y={385} n={4} />
      <Leader d="M280 372 L280 322" />
      <Marker x={430} y={250} n={5} />
      <Leader d="M417 250 L376 250" />
      <Marker x={430} y={165} n={6} />
      <Leader d="M417 165 L340 165" />
    </Frame>
  );
}

export function LabelBlueprint() {
  return (
    <Frame label="Pressure-Sensitive Label — Layer Stack">
      {/* Exploded layer stack, isometric-ish */}
      {[
        { y: 90, fill: "rgba(0,216,242,0.18)", stroke: "#34e3f5", label: "LAMINATE / VARNISH" },
        { y: 150, fill: "rgba(0,216,242,0.45)", stroke: "#00d8f2", label: "INK LAYER" },
        { y: 210, fill: "rgba(12,33,51,0.95)", stroke: "#00d8f2", label: "FACESTOCK" },
        { y: 270, fill: "rgba(0,135,168,0.5)", stroke: "#0087a8", label: "ADHESIVE" },
        { y: 330, fill: "rgba(245,249,251,0.12)", stroke: "rgba(245,249,251,0.5)", label: "RELEASE LINER" },
      ].map((l) => (
        <g key={l.label}>
          <path
            d={`M170 ${l.y} L390 ${l.y} L430 ${l.y + 26} L210 ${l.y + 26} Z`}
            fill={l.fill}
            stroke={l.stroke}
            strokeWidth="1.5"
          />
          <text
            x="448"
            y={l.y + 18}
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            fill="#a9b9c8"
            letterSpacing="1"
          >
            {l.label}
          </text>
        </g>
      ))}
      {/* Die cut path on top layer */}
      <ellipse cx="300" cy="103" rx="80" ry="11" fill="none" stroke="#ff5fa2" strokeWidth="1.5" strokeDasharray="6 4" />
      <Marker x={120} y={103} n={3} />
      <Leader d="M133 103 L168 103" />
      <Marker x={120} y={163} n={2} />
      <Leader d="M133 163 L168 163" />
      <Marker x={120} y={223} n={1} />
      <Leader d="M133 223 L168 223" />
      <Marker x={120} y={283} n={4} />
      <Leader d="M133 283 L168 283" />
      <Marker x={120} y={343} n={5} />
      <Leader d="M133 343 L168 343" />
      <Marker x={460} y={70} n={6} />
      <Leader d="M448 76 L385 96" />
    </Frame>
  );
}

export function RollstockBlueprint() {
  return (
    <Frame label="Printed Rollstock — Web Specification">
      {/* Roll */}
      <ellipse cx="170" cy="120" rx="95" ry="26" fill="rgba(12,33,51,0.9)" stroke="#00d8f2" strokeWidth="2" />
      <path d="M75 120 L75 240 Q75 266 170 266 Q265 266 265 240 L265 120" fill="rgba(12,33,51,0.9)" stroke="#00d8f2" strokeWidth="2" />
      <ellipse cx="170" cy="120" rx="62" ry="17" fill="#061421" />
      <ellipse cx="170" cy="120" rx="26" ry="7" fill="none" stroke="#34e3f5" strokeWidth="1.5" />
      {/* Unwinding web */}
      <path d="M265 230 L500 230 L500 330 L265 330 Q240 300 265 230" fill="rgba(16,42,64,0.7)" stroke="#00d8f2" strokeWidth="1.5" />
      {/* Print repeats */}
      <rect x="300" y="250" width="56" height="56" rx="4" fill="none" stroke="#34e3f5" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="372" y="250" width="56" height="56" rx="4" fill="none" stroke="#34e3f5" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="444" y="250" width="42" height="56" rx="4" fill="none" stroke="#34e3f5" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="310" y="262" width="36" height="8" fill="#00d8f2" opacity="0.7" />
      <rect x="382" y="262" width="36" height="8" fill="#00d8f2" opacity="0.7" />
      {/* Eye marks */}
      <rect x="300" y="318" width="14" height="8" fill="#00d8f2" />
      <rect x="372" y="318" width="14" height="8" fill="#00d8f2" />
      <rect x="444" y="318" width="14" height="8" fill="#00d8f2" />
      {/* Width dimension */}
      <g stroke="#a9b9c8" strokeWidth="1.2">
        <line x1="510" y1="230" x2="510" y2="330" />
        <line x1="504" y1="230" x2="516" y2="230" />
        <line x1="504" y1="330" x2="516" y2="330" />
      </g>
      <text x="524" y="284" fontSize="10" fontFamily="ui-monospace, monospace" fill="#a9b9c8" transform="rotate(90 524 284)" textAnchor="middle">
        WEB WIDTH
      </text>
      <Marker x={170} y={60} n={6} />
      <Leader d="M170 73 L170 104" />
      <Marker x={328} y={210} n={2} />
      <Leader d="M328 223 L328 250" />
      <Marker x={250} y={355} n={3} />
      <Leader d="M263 351 L300 326" />
      <Marker x={50} y={290} n={4} />
      <Leader d="M63 290 L90 270" />
      <Marker x={490} y={200} n={1} />
      <Leader d="M490 213 L490 230" />
      <Marker x={170} y={320} n={5} />
      <Leader d="M170 307 L170 268" />
    </Frame>
  );
}

export function BottleBlueprint() {
  return (
    <Frame label="Shrink Sleeve on Container — Anatomy">
      {/* Bottle */}
      <rect x="245" y="62" width="70" height="34" rx="6" fill="rgba(12,33,51,0.9)" stroke="#00d8f2" strokeWidth="1.5" />
      <path
        d="M255 96 Q230 130 230 170 L230 330 Q230 352 252 352 L308 352 Q330 352 330 330 L330 170 Q330 130 305 96 Z"
        fill="rgba(12,33,51,0.9)"
        stroke="#00d8f2"
        strokeWidth="2"
      />
      {/* Sleeve (overlaid, slightly wider) */}
      <path
        d="M248 120 Q224 145 224 178 L224 326 Q224 346 248 346 L312 346 Q336 346 336 326 L336 178 Q336 145 312 120 Z"
        fill="rgba(0,216,242,0.13)"
        stroke="#34e3f5"
        strokeWidth="1.8"
        strokeDasharray="7 4"
      />
      {/* Tamper band */}
      <path d="M245 100 Q280 112 315 100 L315 86 Q280 98 245 86 Z" fill="rgba(0,216,242,0.25)" stroke="#34e3f5" strokeWidth="1.2" />
      {/* Perforation */}
      <line x1="280" y1="86" x2="280" y2="112" stroke="#ff5fa2" strokeWidth="1.4" strokeDasharray="3 3" />
      {/* Print */}
      <rect x="244" y="190" width="72" height="11" fill="#00d8f2" opacity="0.8" />
      <rect x="244" y="210" width="52" height="5" fill="#00d8f2" opacity="0.45" />
      <rect x="244" y="222" width="52" height="5" fill="#00d8f2" opacity="0.45" />
      {/* 360 arrow */}
      <path d="M205 270 Q280 308 355 270" fill="none" stroke="#34e3f5" strokeWidth="1.5" />
      <path d="M349 264 l10 5 l-10 6" fill="none" stroke="#34e3f5" strokeWidth="1.5" />
      <Marker x={150} y={150} n={1} />
      <Leader d="M163 150 L226 150" />
      <Marker x={420} y={196} n={2} />
      <Leader d="M407 196 L318 196" />
      <Marker x={420} y={93} n={3} />
      <Leader d="M407 93 L318 93" />
      <Marker x={150} y={290} n={4} />
      <Leader d="M163 290 L210 278" />
      <Marker x={280} y={50} n={5} />
      <Leader d="M280 63 L280 86" />
    </Frame>
  );
}

export function StickBlueprint() {
  return (
    <Frame label="Stick Pack / Sachet — Seal Map">
      {/* Stick pack */}
      <rect x="150" y="70" width="86" height="290" rx="8" fill="rgba(12,33,51,0.9)" stroke="#00d8f2" strokeWidth="2" />
      {/* Seals */}
      <rect x="150" y="70" width="86" height="26" fill="rgba(0,216,242,0.3)" stroke="#34e3f5" strokeWidth="1" />
      <rect x="150" y="334" width="86" height="26" fill="rgba(0,216,242,0.3)" stroke="#34e3f5" strokeWidth="1" />
      <line x1="193" y1="96" x2="193" y2="334" stroke="rgba(0,216,242,0.4)" strokeWidth="3" strokeDasharray="6 5" />
      {/* Tear notch */}
      <path d="M236 110 l12 6 l-12 6" fill="none" stroke="#34e3f5" strokeWidth="2" />
      {/* Print */}
      <rect x="162" y="150" width="62" height="9" fill="#00d8f2" opacity="0.8" />
      <rect x="162" y="168" width="46" height="4" fill="#00d8f2" opacity="0.45" />
      {/* Sachet (4-side seal) */}
      <rect x="330" y="120" width="160" height="200" rx="6" fill="rgba(12,33,51,0.9)" stroke="#00d8f2" strokeWidth="2" />
      <rect x="330" y="120" width="160" height="200" rx="6" fill="none" stroke="rgba(0,216,242,0.4)" strokeWidth="14" opacity="0.35" />
      <rect x="356" y="170" width="108" height="9" fill="#00d8f2" opacity="0.8" />
      <rect x="356" y="188" width="80" height="4" fill="#00d8f2" opacity="0.45" />
      <text x="410" y="305" textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, monospace" fill="#a9b9c8">
        4-SIDE SEAL SACHET
      </text>
      <text x="193" y="385" textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, monospace" fill="#a9b9c8">
        STICK PACK
      </text>
      <Marker x={100} y={83} n={1} />
      <Leader d="M113 83 L148 83" />
      <Marker x={290} y={116} n={2} />
      <Leader d="M277 116 L250 116" />
      <Marker x={100} y={215} n={3} />
      <Leader d="M113 215 L148 215" />
      <Marker x={100} y={155} n={4} />
      <Leader d="M113 155 L160 155" />
      <Marker x={520} y={140} n={5} />
      <Leader d="M507 140 L492 140" />
    </Frame>
  );
}

export function BoxBlueprint() {
  return (
    <Frame label="Display & Shipping System — Structure">
      {/* Shipper box isometric */}
      <path d="M120 170 L280 110 L440 170 L440 310 L280 370 L120 310 Z" fill="rgba(12,33,51,0.9)" stroke="#00d8f2" strokeWidth="2" />
      <path d="M120 170 L280 230 L440 170" fill="none" stroke="#00d8f2" strokeWidth="1.5" />
      <line x1="280" y1="230" x2="280" y2="370" stroke="#00d8f2" strokeWidth="1.5" />
      {/* Flutes (corrugation) */}
      <path d="M140 185 q6 -6 12 0 q6 6 12 0 q6 -6 12 0 q6 6 12 0" fill="none" stroke="#34e3f5" strokeWidth="1.2" opacity="0.7" />
      {/* Print */}
      <rect x="160" y="255" width="84" height="9" fill="#00d8f2" opacity="0.75" transform="skewY(20)" />
      <rect x="160" y="272" width="60" height="5" fill="#00d8f2" opacity="0.45" transform="skewY(20)" />
      {/* Display tray with products */}
      <path d="M335 250 L420 222 L420 268 L335 296 Z" fill="rgba(0,216,242,0.12)" stroke="#34e3f5" strokeWidth="1.2" strokeDasharray="5 3" transform="translate(0,-6)" />
      {/* Perf tear line */}
      <path d="M120 230 L280 290 L440 230" fill="none" stroke="#ff5fa2" strokeWidth="1.4" strokeDasharray="4 4" />
      <Marker x={75} y={160} n={1} />
      <Leader d="M88 160 L118 172" />
      <Marker x={90} y={278} n={2} />
      <Leader d="M103 278 L150 290" />
      <Marker x={500} y={236} n={3} />
      <Leader d="M487 236 L442 232" />
      <Marker x={500} y={150} n={4} />
      <Leader d="M487 153 L442 168" />
      <Marker x={280} y={60} n={5} />
      <Leader d="M280 73 L280 108" />
    </Frame>
  );
}
