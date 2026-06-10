"use client";

export const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(2,5,9,0.6)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "12px 14px",
  color: "#f7fbff",
  fontSize: "14px",
};

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Result({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{ border: "1px solid rgba(0,216,242,0.4)", background: "rgba(0,216,242,0.07)" }}
    >
      <div className="font-mono text-2xl font-black text-cyan md:text-3xl">
        {value}
        {unit && <span className="ml-1 text-base font-bold text-muted-light">{unit}</span>}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted">{label}</div>
    </div>
  );
}

/**
 * ToolCard — wraps every interactive tool with the three-part explainer:
 * the question it answers, how to use it, and why it matters.
 */
export function ToolCard({
  id,
  n,
  title,
  answers,
  how,
  why,
  children,
}: {
  id: string;
  n: string;
  title: string;
  answers: string;
  how: string[];
  why: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-28 rounded-4xl p-6 md:p-10"
      style={{
        border: "1px solid rgba(0,216,242,0.22)",
        background: "linear-gradient(135deg, rgba(0,216,242,0.05), rgba(255,255,255,0.02))",
      }}
    >
      <div className="mb-6">
        <div className="kicker mb-2"><span className="font-mono">{n}</span></div>
        <h3 className="display text-[clamp(24px,2.8vw,38px)] text-paper">{title}</h3>
        <p className="mt-2 text-base font-bold text-cyan">Answers: {answers}</p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr,1.6fr]">
        <div className="grid gap-4">
          <div
            className="rounded-2xl p-5"
            style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(2,5,9,0.4)" }}
          >
            <div className="kicker mb-3 text-[10px]">How to use it</div>
            <ol className="grid gap-2">
              {how.map((h, i) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="font-mono text-xs font-black text-cyan">{i + 1}.</span>
                  {h}
                </li>
              ))}
            </ol>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ border: "1px solid rgba(0,216,242,0.2)", background: "rgba(0,216,242,0.05)" }}
          >
            <div className="kicker mb-2 text-[10px]">Why it matters</div>
            <p className="text-sm leading-relaxed text-muted">{why}</p>
          </div>
        </div>

        <div
          className="rounded-3xl p-5 md:p-7"
          style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-xs leading-relaxed text-muted-dark">{children}</p>;
}
