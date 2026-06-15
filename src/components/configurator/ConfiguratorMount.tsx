"use client";

import dynamic from "next/dynamic";

// WebGL component must never render on the server.
const PackageConfigurator = dynamic(() => import("./PackageConfigurator"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-4xl"
      style={{ minHeight: 520, border: "1px solid rgba(0,216,242,0.25)", background: "rgba(255,255,255,0.03)" }}
    >
      <span className="text-sm text-muted">Loading 3D studio…</span>
    </div>
  ),
});

export default function ConfiguratorMount() {
  return <PackageConfigurator />;
}
