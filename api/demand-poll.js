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
      const { data, error } = await getClient().from("demand_polls").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: "Poll not found" });
        return;
      }
      if (req.query.includeResponses) {
        const { data: responses, error: respErr } = await getClient()
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
      console.error("demand-poll GET error:", err);
      res.status(500).json({ error: "Could not load poll" });
    }
    return;
  }

  if (req.method === "POST") {
    const { action } = req.body || {};

    if (action === "create") {
      const { phone, subjectName, inputType, imageData, description, pitch, questions, targetAgeGroup, targetGender, language } = req.body || {};
      if (!phone || !pitch) {
        res.status(400).json({ error: "phone and pitch are required" });
        return;
      }
      try {
        const { data, error } = await getClient()
          .from("demand_polls")
          .insert({
            phone: phone.trim(),
            subject_name: subjectName || null,
            input_type: inputType || null,
            image_data: imageData || null,
            description: description || null,
            pitch,
            questions: Array.isArray(questions) ? questions : null,
            target_age_group: targetAgeGroup || null,
            target_gender: targetGender || null,
            language: language || "en",
          })
          .select("id")
          .single();
        if (error) throw error;
        res.status(200).json({ id: data.id });
      } catch (err) {
        console.error("demand-poll create error:", err);
        res.status(500).json({ error: "Could not create poll" });
      }
      return;
    }

    if (action === "vote") {
      const { id, vote, answers, review } = req.body || {};
      if (!id || !["yes", "no", "maybe"].includes(vote)) {
        res.status(400).json({ error: "id and a valid vote (yes/no/maybe) are required" });
        return;
      }
      try {
        const column = `${vote}_count`;
        const { data: current, error: readErr } = await getClient()
          .from("demand_polls")
          .select(column)
          .eq("id", id)
          .maybeSingle();
        if (readErr) throw readErr;
        if (!current) {
          res.status(404).json({ error: "Poll not found" });
          return;
        }
        const { data: updated, error: writeErr } = await getClient()
          .from("demand_polls")
          .update({ [column]: (current[column] || 0) + 1 })
          .eq("id", id)
          .select("yes_count, no_count, maybe_count")
          .single();
        if (writeErr) throw writeErr;

        // Best-effort — the vote count above is the source of truth for the
        // Green/Orange/Red signal, so a hiccup saving the detail row
        // shouldn't fail the respondent's vote.
        try {
          await getClient().from("demand_poll_responses").insert({
            poll_id: id,
            vote,
            answers: answers && typeof answers === "object" ? answers : null,
            review: review || null,
          });
        } catch (detailErr) {
          console.error("demand-poll response detail insert failed:", detailErr);
        }

        res.status(200).json(updated);
      } catch (err) {
        console.error("demand-poll vote error:", err);
        res.status(500).json({ error: "Could not record vote" });
      }
      return;
    }

    res.status(400).json({ error: "Unknown action" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
