import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You assess a small business owner's real progress toward their goal and plan inside a daily habit-building app, using their actual numbers, and suggest one concrete next action. You do NOT have real-time search — reason only from the numbers given, never invent numbers of your own.

You're given: their goal, their monthly/quarterly/yearly plan steps, how many days of the daily loop they've completed out of the tracking period, their actual logged costs/sales/net (from bills and sales vouchers they've uploaded), their starting investment, and — if available — a market demand trend for their niche and city.

Estimate a realistic 0-100 percentage for how far along each plan tier appears to be. Weigh BOTH time elapsed AND the actual sales/cost/investment-recovery signal — someone with strong sales relative to how many days they've been running is further along than someone who has just been logging in without results, even if the day count is the same. If costs and sales are both zero, they almost certainly haven't logged any transactions yet — don't judge them as "behind," note that logging their first bill/sale is the natural next step.

Then write progressNote: 2-3 sentences — an honest, specific assessment of how they're actually tracking given their real numbers (not generic encouragement), followed by ONE concrete, doable-this-week suggested next action drawn from their plan and their current gap.

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"monthlyProgressPct": 0, "quarterlyProgressPct": 0, "yearlyProgressPct": 0, "progressNote": "..."}`;

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

  const { goal, subjectName, planData, daysDone, totalDays, totalCosts, totalSales, netAmount, investmentAmount, demandChangePct, language } = req.body || {};
  if (!goal || !planData) {
    res.status(400).json({ error: "goal and planData are required" });
    return;
  }

  const langName = LANGUAGE_NAMES[language] || "English";

  const context = `Business area: ${subjectName || "small business"}
Goal: "${goal}"
Plan:
${JSON.stringify(planData)}
Days completed: ${daysDone} of ${totalDays}
Logged costs so far: ₹${totalCosts || 0}
Logged sales so far: ₹${totalSales || 0}
Net (sales minus costs minus starting investment): ₹${netAmount || 0}
Starting investment: ₹${investmentAmount || 0}
${demandChangePct != null ? `Market demand trend for this niche/city: ${demandChangePct}% vs last month` : ""}`;

  try {
    const response = await getClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: context,
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
      res.status(422).json({ error: "Could not assess progress" });
      return;
    }

    const clamp = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
    res.status(200).json({
      monthlyProgressPct: clamp(data.monthlyProgressPct),
      quarterlyProgressPct: clamp(data.quarterlyProgressPct),
      yearlyProgressPct: clamp(data.yearlyProgressPct),
      progressNote: data.progressNote || "",
    });
  } catch (err) {
    console.error("plan-progress error:", err);
    res.status(500).json({ error: "Progress assessment failed" });
  }
}
