import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You produce daily content for small business owners in a specific niche, inside a habit-building app. You do NOT have real-time search — draw on general knowledge of how this industry typically behaves, not specific dated events.

Given their exact business niche, provide:
- trend: the specific product or service that typically sees the highest demand/growth in this exact niche (be specific, not generic — e.g. "lightweight daily-wear gold chains under 10g", not "jewelry is trending")
- update: a realistic, specific theme, shift, or common challenge that business owners in this niche regularly face — framed as an illustrative observation about the industry, never as a specific dated news claim, statistic, or event (you have no way to verify those are real, so never state one as fact)
- videoTitle: a specific, well-framed title for an educational or explainer video that would genuinely help someone in this niche — a good topic suggestion, not a claim that an exact video by this title exists
- successStory: a brief (1-2 sentence) illustrative example of a business in this niche succeeding with a specific tactic — this is a plausible composite example, it does not need to be a real sourced story

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"trend": "...", "update": "...", "videoTitle": "...", "successStory": "..."}`;

let client;
function getClient() {
  if (!client) client = new GoogleGenAI({});
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
    const response = await getClient().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Business niche: ${niche}`,
      config: {
        systemInstruction: `${SYSTEM_PROMPT}\n\nRespond entirely in ${langName}.`,
        responseMimeType: "application/json",
      },
    });

    const text = (response.text || "").trim();

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
      updateSourceUrl: "",
      video: { title: data.videoTitle || "", url: "" },
      successStory: data.successStory || "",
    });
  } catch (err) {
    console.error("daily-content error:", err);
    res.status(500).json({ error: "Content generation failed" });
  }
}
