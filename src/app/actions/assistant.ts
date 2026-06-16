"use server";

/* Microflex AI packaging assistant — calls the Anthropic API with a packaging-
   expert system prompt primed with Microflex's facts. No customer data leaves
   the server; the API key is server-only. Set ANTHROPIC_API_KEY (and optionally
   ANTHROPIC_MODEL) in the App Hosting environment. */

export type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM = `You are the packaging assistant for Microflex Film Corporation (microflexfilm.com), a US flexible-packaging manufacturer in Riverside, CA. Be warm, concise, and genuinely helpful — like a knowledgeable packaging engineer, not a salesperson.

What Microflex makes:
- Formats: stand-up pouches, flat/lay-flat pouches, quad-seal bags, box-bottom (flat-bottom) bags, spouted pouches, stick packs, sachets, printed rollstock, shrink sleeves, and labels.
- Finishes: matte, gloss, soft-touch, metallic/foil, kraft-look, and clear/windowed.
- Barriers: moisture, oxygen, light, and aroma — engineered to the product's shelf-life and fill process (avoid over-engineering to control cost).
- Options: resealable zippers, tear notches, hang holes, degassing valves (coffee), child-resistant features, recycle-ready mono-materials and PCR content.
- Operations: SQF-certified, solar-powered, manufactured in the USA. Print via flexo and digital. Quality docs include COAs and spec sheets.

How to help:
- Recommend structures/finishes/barriers based on the product, shelf life, and filling method.
- Explain trade-offs (e.g., rollstock vs premade pouches, matte vs gloss, foil vs metallized).
- Point people to the right next step:
  • Visualize and configure: the 3D Studio at /configurator
  • Get a quote: the "Start a Project" form (link to /#quote-form)
  • Feel materials: the Sample Kit at /#sample-kit
  • Tools: calculators at /calculators and the spec builder at /packaging-spec-builder

Rules:
- NEVER invent specific prices, MOQs, or lead times. For exact numbers, direct them to request a quote — quotes often come back with more than one option to compare.
- Keep answers short (2-5 sentences) unless asked for depth. Use plain language.
- If a question is outside packaging, gently steer back.`;

export async function askAssistant(
  history: ChatMsg[]
): Promise<{ ok: boolean; reply?: string; error?: string }> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ok: false, error: "NOT_CONFIGURED" };

  // Keep the last ~10 turns to control tokens/cost.
  const messages = history.slice(-10).map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (messages.length === 0) return { ok: false, error: "EMPTY" };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM,
        messages,
      }),
    });
    if (!res.ok) {
      console.error("Anthropic API error", res.status, await res.text().catch(() => ""));
      return { ok: false, error: "API_ERROR" };
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const reply = (data.content ?? [])
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (!reply) return { ok: false, error: "EMPTY_REPLY" };
    return { ok: true, reply };
  } catch (err) {
    console.error("Assistant error", err);
    return { ok: false, error: "NETWORK" };
  }
}
