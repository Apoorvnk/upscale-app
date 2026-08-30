import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a lead-finding assistant for small business owners using a daily habit-building app. You have access to real-time web search.

When given a request describing what kind of business contacts they're looking for, search the web and find REAL, currently operating businesses that match — using only publicly available information meant for business outreach (business directories, official websites, Google Business listings, and similar public sources).

Never include private individuals' personal contact information — only business-level public listings meant for outreach. If you cannot find real matches, say so honestly rather than inventing results.

Respond with ONLY a JSON array (no markdown fences, no other text) of up to 6 results. Each item: {"name": string, "detail": string (what they do / why they match, one sentence), "contact": string (phone/website/address if publicly available, or "Not publicly listed"), "source": string (where this was found, e.g. a domain name)}. If you found nothing real, respond with an empty array: []`;

let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt, city } = req.body || {};
  if (!prompt || !prompt.trim()) {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  try {
    const response = await getClient().messages.create({
      model: "claude-opus-5",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
      messages: [
        {
          role: "user",
          content: `Find real businesses matching this request: "${prompt}"${city ? ` — preferably near ${city}` : ""}`,
        },
      ],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    let results = [];
    try {
      const cleaned = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) results = parsed;
    } catch {
      results = [];
    }

    res.status(200).json({ results, note: results.length ? undefined : text || "No real matches found for this search." });
  } catch (err) {
    console.error("find-leads error:", err);
    res.status(500).json({ error: "Lead search failed" });
  }
}
