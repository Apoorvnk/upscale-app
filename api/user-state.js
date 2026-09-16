import { createClient } from "@supabase/supabase-js";

let client;
function getClient() {
  if (!client) client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return client;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const phone = (req.query.phone || "").trim();
    if (!phone) {
      res.status(400).json({ error: "phone is required" });
      return;
    }
    try {
      const { data, error } = await getClient()
        .from("proprietor_state")
        .select("state")
        .eq("phone", phone)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        res.status(200).json({ found: false });
        return;
      }
      res.status(200).json({ found: true, state: data.state });
    } catch (err) {
      console.error("user-state GET error:", err);
      res.status(500).json({ error: "Could not load saved data" });
    }
    return;
  }

  if (req.method === "POST") {
    const { phone, state } = req.body || {};
    const trimmedPhone = (phone || "").trim();
    if (!trimmedPhone || !state) {
      res.status(400).json({ error: "phone and state are required" });
      return;
    }
    try {
      const { error } = await getClient()
        .from("proprietor_state")
        .upsert({ phone: trimmedPhone, state, updated_at: new Date().toISOString() }, { onConflict: "phone" });
      if (error) throw error;
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("user-state POST error:", err);
      res.status(500).json({ error: "Could not save data" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
