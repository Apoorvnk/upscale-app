import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are a business coach inside a daily habit-building app for small business owners. The user has a stated goal for this period. Each day they read an update, a trend, and a success story about their industry, then write ONE observation about what they've noticed in their own business.

Read their goal and their observation, then give brief (2-3 sentences), specific, actionable guidance connecting today's observation to a concrete next step toward their goal. Be warm but concrete — never generic pep talk, never mention that you are an AI, never mention pricing or subscriptions.

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"guidance": "..."}`;

let client;
function getClient() {
  if (!client) client = new GoogleGenAI({});
  return client;
}

// Distinguishes real quota exhaustion (429 RESOURCE_EXHAUSTED) from
// transient overload (503 UNAVAILABLE) or other failures in Vercel's
// function logs, so quota exhaustion is easy to grep for instead of
// having to read every raw error.
function logGeminiError(label, err) {
  const isQuota = err?.status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(err?.message || "");
  console.error(isQuota ? `GEMINI QUOTA EXCEEDED — ${label}:` : `${label}:`, err);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { observationText, goal, subjectName } = req.body || {};
  if (!observationText || !observationText.trim()) {
    res.status(400).json({ error: "observationText is required" });
    return;
  }

  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Their business area: ${subjectName || "small business"}\nTheir goal for this period: "${goal || "not set"}"\nToday's observation: "${observationText}"`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
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

    if (!data || !data.guidance) {
      res.status(200).json({ guidance: "Keep this observation in mind as you plan tomorrow — small, specific notice like this is how you'll spot what's actually moving the needle." });
      return;
    }

    res.status(200).json({ guidance: data.guidance });
  } catch (err) {
    logGeminiError("guide-observation error", err);
    res.status(500).json({ error: "Guidance failed" });
  }
}
