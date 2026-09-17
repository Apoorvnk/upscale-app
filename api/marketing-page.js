import { createClient } from "@supabase/supabase-js";

let client;
function getClient() {
  if (!client) client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return client;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const id = (req.query.id || "").trim();
    if (!id) {
      res.status(400).json({ error: "id is required" });
      return;
    }
    try {
      const { data, error } = await getClient().from("marketing_pages").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: "Page not found" });
        return;
      }
      res.status(200).json(data);
    } catch (err) {
      console.error("marketing-page GET error:", err);
      res.status(500).json({ error: "Could not load page" });
    }
    return;
  }

  if (req.method === "POST") {
    const { phone, subjectName, angle, pitch, strategy, tactics, language } = req.body || {};
    if (!phone || !pitch) {
      res.status(400).json({ error: "phone and pitch are required" });
      return;
    }
    try {
      const { data, error } = await getClient()
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
      console.error("marketing-page create error:", err);
      res.status(500).json({ error: "Could not create page" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
