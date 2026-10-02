import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You are a business coach inside a daily habit-building app for small business owners, running their daily "AI Validation" check-in. The user has a real, outcome-based goal for this period (not a numeric target) and a checklist of concrete actions toward it. Each day they write ONE observation about what they've noticed in their own business, and you validate it against their real-world situation.

You're given: their goal, today's observation, their current checklist (with which items are done), their demand-check status (if they've run one), and their logged costs/sales/net so far.

Respond with two things:
1. "guidance": brief (2-3 sentences), specific, actionable guidance connecting today's observation to a concrete next step toward their goal. Be warm but concrete — never generic pep talk, never mention that you are an AI, never mention pricing or subscriptions.
2. "progressNote": one short sentence assessing, from the real signals given (demand status, checklist completion, costs vs sales), whether they're on track, need to adjust something specific, or are drifting from the goal — grounded in the actual numbers/status given, not generic encouragement.

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"guidance": "...", "progressNote": "..."}`;

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

  const { observationText, goal, subjectName, checklist, demandStatusColor, totalCosts, totalSales, netAmount, investmentAmount, language } = req.body || {};
  if (!observationText || !observationText.trim()) {
    res.status(400).json({ error: "observationText is required" });
    return;
  }

  const langName = LANGUAGE_NAMES[language] || "English";
  const checklistSummary = Array.isArray(checklist) && checklist.length
    ? `${checklist.filter((c) => c.done).length} of ${checklist.length} checklist items done: ${checklist.map((c) => `${c.done ? "[x]" : "[ ]"} ${c.task}`).join("; ")}`
    : "No checklist yet";

  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Their business area: ${subjectName || "small business"}
Their goal for this period: "${goal || "not set"}"
Today's observation: "${observationText}"
Checklist: ${checklistSummary}
Demand check status: ${demandStatusColor || "not run yet"}
Logged costs so far: ₹${totalCosts || 0}
Logged sales so far: ₹${totalSales || 0}
Net (sales minus costs minus starting investment): ₹${netAmount || 0}
Starting investment: ₹${investmentAmount || 0}`,
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

    if (!data || !data.guidance) {
      res.status(200).json({ guidance: "Keep this observation in mind as you plan tomorrow — small, specific notice like this is how you'll spot what's actually moving the needle.", progressNote: "" });
      return;
    }

    res.status(200).json({ guidance: data.guidance, progressNote: data.progressNote || "" });
  } catch (err) {
    logGeminiError("guide-observation error", err);
    res.status(500).json({ error: "Guidance failed" });
  }
}
