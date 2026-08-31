import Anthropic from "@anthropic-ai/sdk";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You produce daily content for small business owners in a specific niche, inside a habit-building app. You have access to real-time web search.

Given their exact business niche, provide:
- trend: the specific product or service currently seeing the highest demand/growth in this exact niche (be specific, not generic — e.g. "lightweight daily-wear gold chains under 10g", not "jewelry is trending")
- update: one real, current news item relevant to this niche, found via web search — a real fact, never invented
- updateSourceUrl: the real URL where you found that news item (or "" if you couldn't find one)
- videoTitle: the title of a REAL, specific, existing educational or explainer video (search the web for one that actually exists) relevant to this exact niche
- videoUrl: the real URL of that video (or "" if you couldn't find a specific real one — never invent a URL)
- successStory: a brief (1-2 sentence) illustrative example of a business in this niche succeeding with a specific tactic — this can be a plausible composite example, it does not need to be a real sourced story

Never invent a URL. If you can't find a real one via search, leave that URL field as "".

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"trend": "...", "update": "...", "updateSourceUrl": "...", "videoTitle": "...", "videoUrl": "...", "successStory": "..."}`;

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
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 4 }],
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
      res.status(422).json({ error: "Could not generate content" });
      return;
    }

    res.status(200).json({
      trend: data.trend || "",
      update: data.update || "",
      updateSourceUrl: data.updateSourceUrl || "",
      video: { title: data.videoTitle || "", url: data.videoUrl || "" },
      successStory: data.successStory || "",
    });
  } catch (err) {
    console.error("daily-content error:", err);
    res.status(500).json({ error: "Content generation failed" });
  }
}
