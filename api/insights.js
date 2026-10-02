import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

let client;
function getClient() {
  if (!client) client = new GoogleGenAI({});
  return client;
}

let supabase;
function getSupabase() {
  if (!supabase) supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return supabase;
}

// Distinguishes real quota exhaustion (429 RESOURCE_EXHAUSTED) from
// transient overload (503 UNAVAILABLE) or other failures in Vercel's
// function logs, so quota exhaustion is easy to grep for instead of
// having to read every raw error.
function logGeminiError(label, err) {
  const isQuota = err?.status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(err?.message || "");
  console.error(isQuota ? `GEMINI QUOTA EXCEEDED — ${label}:` : `${label}:`, err);
}

// Market analytics depends only on niche/subcategory/city/language, never
// on which proprietor asked for it — cached per (niche, subcategory, city,
// language, day) and shared across every user hitting the same niche+city
// that day. Free-tier quota is a hard per-project daily cap shared across
// the whole app, so cutting duplicate calls for the same niche+city matters
// far more than per-call cost.
function cacheKey(parts) {
  const today = new Date().toISOString().slice(0, 10);
  return ["market-analytics", ...parts, today].join("::").toLowerCase();
}

const MARKET_ANALYTICS_SYSTEM_PROMPT = `You produce a market-demand snapshot for a small business owner in a specific niche and city, inside a habit-building app. You do NOT have real-time search — draw on general knowledge of how this industry and this kind of city typically behave, not specific dated statistics you cannot verify. You ARE told today's actual date, so you can honestly ground the snapshot in the real current season or shopping calendar for India.

Given their exact business niche and city, provide:
- demandChangePct: a plausible whole-number percentage (roughly -20 to +35) for how demand for this niche is shifting month-over-month right now, given the season — never claim this is a measured statistic, just a realistic illustrative estimate
- demand: an array of exactly 6 numbers from 20-100 representing a relative demand trend over the last 6 months (oldest first), shaped consistently with demandChangePct — e.g. a rising trend if demandChangePct is positive
- insight: one specific, plausible sentence connecting this niche AND this city — reference something genuinely locally relevant if you can (a known local shopping season, local buyer behavior, the kind of city it is), phrased as an observation, never as a verified fact or statistic

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"demandChangePct": 0, "demand": [0,0,0,0,0,0], "insight": "..."}`;

async function handleMarketAnalytics(req, res) {
  const { subjectName, subcategoryLabel, city, language } = req.body || {};
  if (!subjectName) {
    res.status(400).json({ error: "subjectName is required" });
    return;
  }
  const langName = LANGUAGE_NAMES[language] || "English";
  const niche = subcategoryLabel ? `${subjectName} — specifically ${subcategoryLabel}` : subjectName;
  const key = cacheKey([subjectName, subcategoryLabel || "", city || "", language || "en"]);

  try {
    const { data: cached } = await getSupabase().from("ai_content_cache").select("content").eq("cache_key", key).maybeSingle();
    if (cached) {
      res.status(200).json(cached.content);
      return;
    }
  } catch (err) {
    console.error("market-analytics cache lookup failed (continuing without cache):", err);
  }

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
    const result = {
      demandChangePct: Number(data.demandChangePct) || 0,
      demand: data.demand.map((v) => Math.max(5, Math.min(100, Number(v) || 50))),
      insight: data.insight || "",
    };
    try {
      await getSupabase().from("ai_content_cache").upsert({ cache_key: key, content: result }, { onConflict: "cache_key" });
    } catch (err) {
      console.error("market-analytics cache write failed (non-fatal):", err);
    }
    res.status(200).json(result);
  } catch (err) {
    logGeminiError("insights market-analytics error", err);
    res.status(500).json({ error: "Market analytics generation failed" });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { action } = req.body || {};
  if (action === "market-analytics") return handleMarketAnalytics(req, res);
  res.status(400).json({ error: "Unknown action" });
}
