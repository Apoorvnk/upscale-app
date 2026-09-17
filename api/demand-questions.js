import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You suggest a short list of extra poll questions for a small business owner validating real demand for a product or service idea. The core question ("would you buy/use this?") is already asked separately — you're suggesting ADDITIONAL questions that would help the owner understand their buyers better: things like which area/region the respondent is from, their age bracket, how sensitive they are to price/discount, how often they'd buy, or similar — pick whichever 4-5 are most useful for this specific niche, not a generic fixed set.

Each question must be answerable with a single tap from a short list of options (never free text) — provide 3-5 short, mutually exclusive options per question. This app is for small business owners in India — use Indian Rupees (₹) for any price/budget-related options, never $ or other currencies.

If the owner specified a target age group or gender, make sure age/gender-related questions are still included and phrased naturally (don't assume — always ask, since the owner's stated target is just who they intend to reach, not a filter on respondents).

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"questions": [{"id": "region", "label": "Which area are you in?", "options": ["...", "...", "..."]}]}`;

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

  const { subjectName, inputType, description, targetAgeGroup, targetGender, language } = req.body || {};
  if (!subjectName) {
    res.status(400).json({ error: "subjectName is required" });
    return;
  }

  const langName = LANGUAGE_NAMES[language] || "English";
  const targetNote = [targetAgeGroup ? `Intended target age group: ${targetAgeGroup}` : "", targetGender ? `Intended target gender: ${targetGender}` : ""].filter(Boolean).join("\n");

  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Business niche: ${subjectName}\nWhat they're testing: ${inputType === "service" ? `a service — "${description || ""}"` : "a product (photo provided)"}\n${targetNote}`,
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

    if (!data || !Array.isArray(data.questions)) {
      res.status(422).json({ error: "Could not suggest questions" });
      return;
    }

    const questions = data.questions
      .filter((q) => q && q.label && Array.isArray(q.options) && q.options.length >= 2)
      .map((q, i) => ({ id: q.id || `q${i}`, label: q.label, options: q.options.slice(0, 6) }));

    res.status(200).json({ questions });
  } catch (err) {
    console.error("demand-questions error:", err);
    res.status(500).json({ error: "Could not suggest questions" });
  }
}
