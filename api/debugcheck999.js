import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const urlPresent = !!process.env.SUPABASE_URL;
  const url = process.env.SUPABASE_URL || "";
  const keyPresent = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const keyLength = process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0;

  let queryOk = false;
  let errMessage = "";
  let errCode = "";
  let errDetails = "";
  let errHint = "";

  try {
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await client.from("proprietor_state").select("phone").limit(1);
    if (error) throw error;
    queryOk = true;
    errMessage = `ok, rows: ${JSON.stringify(data)}`;
  } catch (err) {
    errMessage = err?.message || String(err);
    errCode = err?.code || "";
    errDetails = err?.details || "";
    errHint = err?.hint || "";
  }

  res.status(200).json({ urlPresent, url, keyPresent, keyLength, queryOk, errMessage, errCode, errDetails, errHint });
}
