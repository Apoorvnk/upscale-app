import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You create simple, doable execution plans for small business owners using a daily habit-building app. Given their goal, business area, and tracking period, break it into three tiers:

- monthly: 2-4 concrete monthly action steps
- quarterly: 2-3 quarterly milestones that build on the monthly steps
- yearly: one overall yearly outcome statement

Each item needs both "step" (what to do — short and specific) and "how" (one sentence on how to actually execute it — a concrete method, script, or habit, never vague advice like "work harder" or "market more"). Keep everything realistic for a small, resource-constrained business owner — no big-budget tactics, no requiring a team.

Never restate the user's goal text itself as a step — every step, including the yearly one, must be a distinct, concrete action or milestone that moves toward the goal, not a repetition of the goal.

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"monthly": [{"step": "...", "how": "..."}], "quarterly": [{"step": "...", "how": "..."}], "yearly": {"step": "...", "how": "..."}}`;

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

  const { goal, subjectName, period, language } = req.body || {};
  if (!goal || !goal.trim()) {
    res.status(400).json({ error: "goal is required" });
    return;
  }

  const langName = LANGUAGE_NAMES[language] || "English";

  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Business area: ${subjectName || "small business"}\nGoal: "${goal}"\nTracking period: ${period || "Monthly"}`,
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

    if (!data || !Array.isArray(data.monthly) || !Array.isArray(data.quarterly) || !data.yearly) {
      res.status(422).json({ error: "Could not generate a plan" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    logGeminiError("generate-plan error", err);
    res.status(500).json({ error: "Plan generation failed" });
  }
}
