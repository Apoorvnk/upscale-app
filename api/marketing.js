import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

let supabase;
function getSupabase() {
  if (!supabase) supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return supabase;
}

let genai;
function getGenai() {
  if (!genai) genai = new GoogleGenAI({});
  return genai;
}

// Distinguishes real quota exhaustion (429 RESOURCE_EXHAUSTED) from
// transient overload (503 UNAVAILABLE) or other failures in Vercel's
// function logs, so quota exhaustion is easy to grep for instead of
// having to read every raw error.
function logGeminiError(label, err) {
  const isQuota = err?.status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(err?.message || "");
  console.error(isQuota ? `GEMINI QUOTA EXCEEDED — ${label}:` : `${label}:`, err);
}

// The generated strategy depends only on niche/subcategory/language, never
// on which proprietor asked for it — so it's cached per (niche,
// subcategory, language, day) and shared across every user hitting the
// same niche that day, instead of burning a fresh Gemini call per user.
// Free-tier quota is a hard per-project daily cap shared across the whole
// app, so cutting duplicate calls for the same niche matters far more than
// per-call cost.
function cacheKey(parts) {
  const today = new Date().toISOString().slice(0, 10);
  return ["marketing", ...parts, today].join("::").toLowerCase();
}

const STRATEGY_SYSTEM_PROMPT = `You are a marketing strategist for small business owners in a daily habit-building app. You do NOT have real-time search — draw on general marketing knowledge, not specific dated events.

Given their exact business niche, identify the single psychological angle that actually moves buyers in this niche, and build a simple, implementable marketing strategy around it. Small business owners are not moved by generic advice like "post on social media more" — they need one sharp, specific angle they can act on this week.

For example: Mediclaim/health insurance buyers are moved by fear of unexpected medical costs — sell protection from the disease, not the policy's features. Jewelry buyers are moved by sentiment and emotion — sell the feeling behind the gift, not the metal weight. Education/coaching buyers are moved by fear of falling behind or joblessness — sell the outcome they're afraid of missing, not the syllabus. Find the equivalent angle for the given niche — it will usually be fear, aspiration, status, emotion/sentiment, trust/safety, or urgency, but pick whichever one actually fits.

Provide:
- angle: a short (4-8 word) label naming the specific psychological angle for this niche
- pitch: one punchy sentence embodying that angle — the actual marketing hook a small owner could say or write today
- strategy: 2-3 sentences explaining why this angle works for this niche and how to lean into it
- tactics: 3 concrete, low-budget, doable-this-week actions a small owner (no team, no big budget) can take to apply this angle. Each needs "tactic" (what to do, short) and "how" (one sentence on exactly how to execute it)
- videoTitle: a specific, well-framed title for a marketing/sales educational video that would genuinely help apply this angle — a good topic suggestion, not a claim that an exact video by this title exists

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"angle": "...", "pitch": "...", "strategy": "...", "tactics": [{"tactic": "...", "how": "..."}], "videoTitle": "..."}`;

async function handleGenerate(req, res) {
  const { subjectName, subcategoryLabel, language } = req.body || {};
  if (!subjectName) {
    res.status(400).json({ error: "subjectName is required" });
    return;
  }
  const langName = LANGUAGE_NAMES[language] || "English";
  const niche = subcategoryLabel ? `${subjectName} — specifically ${subcategoryLabel}` : subjectName;
  const key = cacheKey([subjectName, subcategoryLabel || "", language || "en"]);

  try {
    const { data: cached } = await getSupabase().from("ai_content_cache").select("content").eq("cache_key", key).maybeSingle();
    if (cached) {
      res.status(200).json(cached.content);
      return;
    }
  } catch (err) {
    console.error("marketing cache lookup failed (continuing without cache):", err);
  }

  try {
    const response = await getGenai().models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Business niche: ${niche}`,
      config: { systemInstruction: `${STRATEGY_SYSTEM_PROMPT}\n\nRespond entirely in ${langName}.`, responseMimeType: "application/json" },
    });
    const text = (response.text || "").trim();
    let data = null;
    try {
      data = JSON.parse(text.replace(/^```(json)?/i, "").replace(/```$/, "").trim());
    } catch {
      data = null;
    }
    if (!data) {
      res.status(422).json({ error: "Could not generate a marketing strategy" });
      return;
    }
    const result = {
      angle: data.angle || "",
      pitch: data.pitch || "",
      strategy: data.strategy || "",
      tactics: Array.isArray(data.tactics) ? data.tactics : [],
      video: { title: data.videoTitle || "", url: "" },
    };
    try {
      await getSupabase().from("ai_content_cache").upsert({ cache_key: key, content: result }, { onConflict: "cache_key" });
    } catch (err) {
      console.error("marketing cache write failed (non-fatal):", err);
    }
    res.status(200).json(result);
  } catch (err) {
    logGeminiError("marketing generate error", err);
    res.status(500).json({ error: "Marketing strategy generation failed" });
  }
}

async function handleCreatePage(req, res) {
  const { phone, subjectName, angle, pitch, strategy, tactics, language } = req.body || {};
  if (!phone || !pitch) {
    res.status(400).json({ error: "phone and pitch are required" });
    return;
  }
  try {
    const { data, error } = await getSupabase()
      .from("marketing_pages")
      .insert({
        phone: phone.trim(),
        subject_name: subjectName || null,
        angle: angle || null,
        pitch,
        strategy: strategy || null,
        tactics: Array.isArray(tactics) ? tactics : null,
        language: language || "en",
      })
      .select("id")
      .single();
    if (error) throw error;
    res.status(200).json({ id: data.id });
  } catch (err) {
    console.error("marketing create-page error:", err);
    res.status(500).json({ error: "Could not create page" });
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const id = (req.query.id || "").trim();
    if (!id) {
      res.status(400).json({ error: "id is required" });
      return;
    }
    try {
      const { data, error } = await getSupabase().from("marketing_pages").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: "Page not found" });
        return;
      }
      res.status(200).json(data);
    } catch (err) {
      console.error("marketing GET error:", err);
      res.status(500).json({ error: "Could not load page" });
    }
    return;
  }

  if (req.method === "POST") {
    const { action } = req.body || {};
    if (action === "create-page") return handleCreatePage(req, res);
    return handleGenerate(req, res);
  }

  res.status(405).json({ error: "Method not allowed" });
}
