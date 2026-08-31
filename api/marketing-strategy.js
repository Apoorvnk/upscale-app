import Anthropic from "@anthropic-ai/sdk";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You are a marketing strategist for small business owners in a daily habit-building app. You have access to real-time web search.

Given their exact business niche, identify the single psychological angle that actually moves buyers in this niche, and build a simple, implementable marketing strategy around it. Small business owners are not moved by generic advice like "post on social media more" — they need one sharp, specific angle they can act on this week.

For example: Mediclaim/health insurance buyers are moved by fear of unexpected medical costs — sell protection from the disease, not the policy's features. Jewelry buyers are moved by sentiment and emotion — sell the feeling behind the gift, not the metal weight. Education/coaching buyers are moved by fear of falling behind or joblessness — sell the outcome they're afraid of missing, not the syllabus. Find the equivalent angle for the given niche — it will usually be fear, aspiration, status, emotion/sentiment, trust/safety, or urgency, but pick whichever one actually fits.

Provide:
- angle: a short (4-8 word) label naming the specific psychological angle for this niche
- pitch: one punchy sentence embodying that angle — the actual marketing hook a small owner could say or write today
- strategy: 2-3 sentences explaining why this angle works for this niche and how to lean into it
- tactics: 3 concrete, low-budget, doable-this-week actions a small owner (no team, no big budget) can take to apply this angle. Each needs "tactic" (what to do, short) and "how" (one sentence on exactly how to execute it)
- videoTitle: the title of a REAL, specific, existing marketing/sales educational video (search the web for one that actually exists) relevant to this exact niche and angle
- videoUrl: the real URL of that video (or "" if you couldn't find a specific real one — never invent a URL)

Never invent a URL. If you can't find a real one via search, leave videoUrl as "".

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"angle": "...", "pitch": "...", "strategy": "...", "tactics": [{"tactic": "...", "how": "..."}], "videoTitle": "...", "videoUrl": "..."}`;

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

  const { subjectName, subcategoryLabel, language } = req.body || {};
  if (!subjectName) {
    res.status(400).json({ error: "subjectName is required" });
    return;
  }

  const langName = LANGUAGE_NAMES[language] || "English";
  const niche = subcategoryLabel ? `${subjectName} — specifically ${subcategoryLabel}` : subjectName;

  try {
    const response = await getClient().messages.create({
      model: "claude-opus-5",
      max_tokens: 2000,
      system: `${SYSTEM_PROMPT}\n\nRespond entirely in ${langName}.`,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 3 }],
      messages: [{ role: "user", content: `Business niche: ${niche}` }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    let data = null;
    try {
      const cleaned = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      data = null;
    }

    if (!data) {
      res.status(422).json({ error: "Could not generate a marketing strategy" });
      return;
    }

    res.status(200).json({
      angle: data.angle || "",
      pitch: data.pitch || "",
      strategy: data.strategy || "",
      tactics: Array.isArray(data.tactics) ? data.tactics : [],
      video: { title: data.videoTitle || "", url: data.videoUrl || "" },
    });
  } catch (err) {
    console.error("marketing-strategy error:", err);
    res.status(500).json({ error: "Marketing strategy generation failed" });
  }
}
