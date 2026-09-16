import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You write a single, sharp pitch line for a small business owner who wants to test real demand for a product or service idea before fully committing to it. The pitch will be shown to strangers on a one-tap poll (Yes / No / Maybe) — it must be short (one sentence, under 25 words), concrete, and end in a way that's easy to react to. Mention a specific detail if one is visible or given (material, price if mentioned, what problem it solves) — never generic ("great new product!").

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"pitch": "..."}`;

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

  const { subjectName, inputType, imageBase64, mediaType, description, language } = req.body || {};
  if (inputType === "product" && !imageBase64) {
    res.status(400).json({ error: "imageBase64 is required for a product pitch" });
    return;
  }
  if (inputType === "service" && (!description || !description.trim())) {
    res.status(400).json({ error: "description is required for a service pitch" });
    return;
  }

  const langName = LANGUAGE_NAMES[language] || "English";

  try {
    const contents = [];
    if (imageBase64) contents.push({ inlineData: { mimeType: mediaType || "image/jpeg", data: imageBase64 } });
    contents.push({
      text: `Business area: ${subjectName || "small business"}\nWhat they're testing: ${inputType === "service" ? `a service — "${description}"` : description ? `a product — "${description}"` : "a product (see photo)"}`,
    });

    const response = await getClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents,
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

    if (!data || !data.pitch) {
      res.status(422).json({ error: "Could not generate a pitch" });
      return;
    }

    res.status(200).json({ pitch: data.pitch });
  } catch (err) {
    console.error("demand-pitch error:", err);
    res.status(500).json({ error: "Pitch generation failed", detail: err?.message || String(err) });
  }
}
