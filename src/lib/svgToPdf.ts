"use client";

/** Convert a generated SVG string into a vector PDF (base64, no data: prefix).
 *  jspdf + svg2pdf are dynamically imported so they never weigh down the page
 *  until a download is actually requested. */
export async function svgStringToPdfBase64(svgString: string): Promise<string> {
  const [{ jsPDF }] = await Promise.all([import("jspdf"), import("svg2pdf.js")]);

  const holder = document.createElement("div");
  holder.style.position = "absolute";
  holder.style.left = "-99999px";
  holder.innerHTML = svgString;
  const el = holder.querySelector("svg");
  if (!el) throw new Error("Invalid SVG");
  document.body.appendChild(holder);

  try {
    const vb = (el.getAttribute("viewBox") ?? "0 0 1000 700").split(/\s+/).map(Number);
    const wPx = vb[2] || 1000;
    const hPx = vb[3] || 700;
    const PT = 0.75; // px → pt
    const doc = new jsPDF({
      unit: "pt",
      format: [wPx * PT, hPx * PT],
      orientation: wPx >= hPx ? "landscape" : "portrait",
      compress: true,
    });
    // svg2pdf.js augments jsPDF with .svg()
    await (doc as unknown as { svg: (e: Element, o: object) => Promise<unknown> }).svg(el, {
      x: 0,
      y: 0,
      width: wPx * PT,
      height: hPx * PT,
    });
    const dataUri = doc.output("datauristring");
    return dataUri.split(",")[1] ?? "";
  } finally {
    holder.remove();
  }
}
