import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const urlPresent = !!process.env.SUPABASE_URL;
  const keyPresent = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const results = {};
  try {
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const t1 = await client.from("proprietor_state").select("phone").limit(1);
    results.proprietor_state = { ok: !t1.error, error: t1.error?.message, code: t1.error?.code, details: t1.error?.details, hint: t1.error?.hint };

    const t2 = await client.from("demand_polls").select("id").limit(1);
    results.demand_polls = { ok: !t2.error, error: t2.error?.message, code: t2.error?.code, details: t2.error?.details, hint: t2.error?.hint };
  } catch (err) {
    results.fatal = err?.message || String(err);
  }

  res.status(200).json({ urlPresent, keyPresent, results });
}
