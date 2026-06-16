import { ImageResponse } from "next/og";

export const alt = "Microflex Film Corporation — Flexible Packaging. Engineered to Perform.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 82% 18%, rgba(0,216,242,0.28), transparent 42%), linear-gradient(150deg, #06121d, #020509)",
          color: "#f7fbff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#00d8f2", fontSize: 26, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase" }}>
          Microflex Film Corporation
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 900, lineHeight: 1.02, marginTop: 22, letterSpacing: -2 }}>
          Flexible Packaging.
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 900, lineHeight: 1.02, color: "#00d8f2", letterSpacing: -2 }}>
          Engineered to Perform.
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 28, color: "#a9b9c8" }}>
          Pouches · Rollstock · Labels · Shrink Sleeves · Stick Packs
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 34, fontSize: 22, color: "#7dffb0", fontWeight: 700 }}>
          SQF Certified · Solar Powered · Manufactured in the USA
        </div>
      </div>
    ),
    { ...size }
  );
}
