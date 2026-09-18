import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

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

const MARKET_ANALYTICS_SYSTEM_PROMPT = `You produce a market-demand snapshot for a small business owner in a specific niche and city, inside a habit-building app. You do NOT have real-time search — draw on general knowledge of how this industry and this kind of city typically behave, not specific dated statistics you cannot verify. You ARE told today's actual date, so you can honestly ground the snapshot in the real current season or shopping calendar for India.

Given their exact business niche and city, provide:
- demandChangePct: a plausible whole-number percentage (roughly -20 to +35) for how demand for this niche is shifting month-over-month right now, given the season — never claim this is a measured statistic, just a realistic illustrative estimate
- demand: an array of exactly 6 numbers from 20-100 representing a relative demand trend over the last 6 months (oldest first), shaped consistently with demandChangePct — e.g. a rising trend if demandChangePct is positive
- insight: one specific, plausible sentence connecting this niche AND this city — reference something genuinely locally relevant if you can (a known local shopping season, local buyer behavior, the kind of city it is), phrased as an observation, never as a verified fact or statistic

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"demandChangePct": 0, "demand": [0,0,0,0,0,0], "insight": "..."}`;

const PLAN_PROGRESS_SYSTEM_PROMPT = `You assess a small business owner's real progress toward their goal and plan inside a daily habit-building app, using their actual numbers, and suggest one concrete next action. You do NOT have real-time search — reason only from the numbers given, never invent numbers of your own.

You're given: their goal, their monthly/quarterly/yearly plan steps, how many days of the daily loop they've completed out of the tracking period, their actual logged costs/sales/net (from bills and sales vouchers they've uploaded), their starting investment, and — if available — a market demand trend for their niche and city.

Estimate a realistic 0-100 percentage for how far along each plan tier appears to be. Weigh BOTH time elapsed AND the actual sales/cost/investment-recovery signal — someone with strong sales relative to how many days they've been running is further along than someone who has just been logging in without results, even if the day count is the same. If costs and sales are both zero, they almost certainly haven't logged any transactions yet — don't judge them as "behind," note that logging their first bill/sale is the natural next step.

Then write progressNote: 2-3 sentences — an honest, specific assessment of how they're actually tracking given their real numbers (not generic encouragement), followed by ONE concrete, doable-this-week suggested next action drawn from their plan and their current gap.

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"monthlyProgressPct": 0, "quarterlyProgressPct": 0, "yearlyProgressPct": 0, "progressNote": "..."}`;

async function handleMarketAnalytics(req, res) {
  const { subjectName, subcategoryLabel, city, language } = req.body || {};
  if (!subjectName) {
    res.status(400).json({ error: "subjectName is required" });
    return;
  }
  const langName = LANGUAGE_NAMES[language] || "English";
  const niche = subcategoryLabel ? `${subjectName} — specifically ${subcategoryLabel}` : subjectName;
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Business niche: ${niche}\nCity: ${city || "India"}\nToday's date: ${today}`,
      config: { systemInstruction: `${MARKET_ANALYTICS_SYSTEM_PROMPT}\n\nRespond entirely in ${langName}.`, responseMimeType: "application/json" },
    });
    const text = (response.text || "").trim();
    let data = null;
    try {
      data = JSON.parse(text.replace(/^```(json)?/i, "").replace(/```$/, "").trim());
    } catch {
      data = null;
    }
    if (!data || !Array.isArray(data.demand) || data.demand.length !== 6) {
      res.status(422).json({ error: "Could not generate market analytics" });
      return;
    }
    res.status(200).json({
      demandChangePct: Number(data.demandChangePct) || 0,
      demand: data.demand.map((v) => Math.max(5, Math.min(100, Number(v) || 50))),
      insight: data.insight || "",
    });
  } catch (err) {
    logGeminiError("insights market-analytics error", err);
    res.status(500).json({ error: "Market analytics generation failed" });
  }
}

async function handlePlanProgress(req, res) {
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
      model: "gemini-3.6-flash",
      contents: context,
      config: { systemInstruction: `${PLAN_PROGRESS_SYSTEM_PROMPT}\n\nRespond entirely in ${langName}.`, responseMimeType: "application/json" },
    });
    const text = (response.text || "").trim();
    let data = null;
    try {
      data = JSON.parse(text.replace(/^```(json)?/i, "").replace(/```$/, "").trim());
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
    logGeminiError("insights plan-progress error", err);
    res.status(500).json({ error: "Progress assessment failed" });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { action } = req.body || {};
  if (action === "plan-progress") return handlePlanProgress(req, res);
  if (action === "market-analytics") return handleMarketAnalytics(req, res);
  res.status(400).json({ error: "Unknown action" });
}
