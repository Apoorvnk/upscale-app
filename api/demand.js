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

const PITCH_SYSTEM_PROMPT = `You write a single, sharp pitch line for a small business owner who wants to test real demand for a product or service idea before fully committing to it. The pitch will be shown to strangers on a one-tap poll (Yes / No / Maybe) — it must be short (one sentence, under 25 words), concrete, and end in a way that's easy to react to. Mention a specific detail if one is visible or given (material, price if mentioned, what problem it solves) — never generic ("great new product!").

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"pitch": "..."}`;

async function handlePitch(req, res) {
  const { subjectName, inputType, images, description, role, area, priceRange, language } = req.body || {};
  if (inputType === "product" && !(Array.isArray(images) && images.length)) {
    res.status(400).json({ error: "images is required for a product pitch" });
    return;
  }
  if (inputType === "service" && (!description || !description.trim())) {
    res.status(400).json({ error: "description is required for a service pitch" });
    return;
  }
  const langName = LANGUAGE_NAMES[language] || "English";
  try {
    const contents = [];
    if (Array.isArray(images)) {
      for (const img of images.slice(0, 5)) {
        if (img?.base64) contents.push({ inlineData: { mimeType: img.mediaType || "image/jpeg", data: img.base64 } });
      }
    }
    const context = [
      `Business area: ${subjectName || "small business"}`,
      `What they're testing: ${inputType === "service" ? `a service — "${description}"` : description ? `a product — "${description}"` : "a product (see photos)"}`,
      role ? `Seller role: ${role}` : "",
      area ? `Area: ${area}` : "",
      priceRange ? `Price: ${priceRange}` : "",
    ].filter(Boolean).join("\n");
    contents.push({ text: context });
    const response = await getGenai().models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: { systemInstruction: `${PITCH_SYSTEM_PROMPT}\n\nRespond entirely in ${langName}.`, responseMimeType: "application/json" },
    });
    const text = (response.text || "").trim();
    let data = null;
    try {
      data = JSON.parse(text.replace(/^```(json)?/i, "").replace(/```$/, "").trim());
    } catch {
      data = null;
    }
    if (!data || !data.pitch) {
      res.status(422).json({ error: "Could not generate a pitch" });
      return;
    }
    res.status(200).json({ pitch: data.pitch });
  } catch (err) {
    logGeminiError("demand pitch error", err);
    res.status(500).json({ error: "Pitch generation failed" });
  }
}

async function handleCreate(req, res) {
  const { phone, subjectName, inputType, images, description, pitch, questions, role, area, priceRange, language } = req.body || {};
  if (!phone || !pitch) {
    res.status(400).json({ error: "phone and pitch are required" });
    return;
  }
  try {
    const { data, error } = await getSupabase()
      .from("demand_polls")
      .insert({
        phone: phone.trim(),
        subject_name: subjectName || null,
        input_type: inputType || null,
        images: Array.isArray(images) ? images : null,
        description: description || null,
        pitch,
        questions: Array.isArray(questions) ? questions : null,
        role: role || null,
        area: area || null,
        price_range: priceRange || null,
        language: language || "en",
      })
      .select("id")
      .single();
    if (error) throw error;
    res.status(200).json({ id: data.id });
  } catch (err) {
    console.error("demand create error:", err);
    res.status(500).json({ error: "Could not create poll" });
  }
}

async function handleVote(req, res) {
  const { id, vote, answers, review } = req.body || {};
  if (!id || !["yes", "no", "maybe"].includes(vote)) {
    res.status(400).json({ error: "id and a valid vote (yes/no/maybe) are required" });
    return;
  }
  try {
    const column = `${vote}_count`;
    const { data: current, error: readErr } = await getSupabase().from("demand_polls").select(column).eq("id", id).maybeSingle();
    if (readErr) throw readErr;
    if (!current) {
      res.status(404).json({ error: "Poll not found" });
      return;
    }
    const { data: updated, error: writeErr } = await getSupabase()
      .from("demand_polls")
      .update({ [column]: (current[column] || 0) + 1 })
      .eq("id", id)
      .select("yes_count, no_count, maybe_count")
      .single();
    if (writeErr) throw writeErr;

    try {
      await getSupabase().from("demand_poll_responses").insert({
        poll_id: id,
        vote,
        answers: answers && typeof answers === "object" ? answers : null,
        review: review || null,
      });
    } catch (detailErr) {
      console.error("demand response detail insert failed:", detailErr);
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("demand vote error:", err);
    res.status(500).json({ error: "Could not record vote" });
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
      const { data, error } = await getSupabase().from("demand_polls").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: "Poll not found" });
        return;
      }
      if (req.query.includeResponses) {
        const { data: responses, error: respErr } = await getSupabase()
          .from("demand_poll_responses")
          .select("vote, answers, review, created_at")
          .eq("poll_id", id)
          .order("created_at", { ascending: false })
          .limit(200);
        if (respErr) throw respErr;
        data.responses = responses || [];
      }
      res.status(200).json(data);
    } catch (err) {
      console.error("demand GET error:", err);
      res.status(500).json({ error: "Could not load poll" });
    }
    return;
  }

  if (req.method === "POST") {
    const { action } = req.body || {};
    if (action === "pitch") return handlePitch(req, res);
    if (action === "create") return handleCreate(req, res);
    if (action === "vote") return handleVote(req, res);
    res.status(400).json({ error: "Unknown action" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
