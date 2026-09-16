import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You produce daily content for small business owners in a specific niche, inside a habit-building app. You do NOT have real-time search — draw on general knowledge of how this industry typically behaves, not specific dated news events. You ARE told today's actual date below, so you can honestly ground content in the real current season, month, or festival/shopping calendar for India — that's knowable without search and makes the content feel current without inventing facts.

Given their exact business niche, provide:
- videoTitle: a specific, well-framed title for an educational or explainer video that would genuinely help someone in this niche — a good topic suggestion, not a claim that an exact video by this title exists
- successStory: a brief (1-2 sentence) illustrative example of a business in this niche succeeding with a specific tactic — this is a plausible composite example, it does not need to be a real sourced story

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"videoTitle": "...", "successStory": "..."}`;

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
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const response = await getClient().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Business niche: ${niche}\nToday's date: ${today}`,
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
      video: { title: data.videoTitle || "", url: "" },
      successStory: data.successStory || "",
    });
  } catch (err) {
    console.error("daily-content error:", err);
    res.status(500).json({ error: "Content generation failed" });
  }
}
