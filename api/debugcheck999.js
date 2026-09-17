import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const results = {};
  try {
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const t1 = await client.from("proprietor_state").select("phone").limit(1);
    results.proprietor_state = { ok: !t1.error, error: t1.error?.message };

    const t2 = await client.from("demand_polls").select("id, target_age_group, target_gender, questions").limit(1);
    results.demand_polls = { ok: !t2.error, error: t2.error?.message };

    const t3 = await client.from("demand_poll_responses").select("id, poll_id, vote, answers, review").limit(1);
    results.demand_poll_responses = { ok: !t3.error, error: t3.error?.message };
  } catch (err) {
    results.fatal = err?.message || String(err);
  }

  res.status(200).json(results);
}
