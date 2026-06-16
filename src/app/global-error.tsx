"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  void error;
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#020509", color: "#f7fbff", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>We hit a snag.</h1>
          <p style={{ color: "#a9b9c8", maxWidth: 480, marginTop: 12 }}>
            Something went wrong loading the site. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ marginTop: 24, padding: "12px 22px", borderRadius: 999, border: "none", background: "linear-gradient(135deg,#00d8f2,#00a8cf)", color: "#001018", fontWeight: 800, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
