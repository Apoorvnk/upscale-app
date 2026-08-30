import Anthropic from "@anthropic-ai/sdk";
import { google } from "googleapis";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const LEDGER_SHEET_TITLE = "Ledger";
const LEDGER_HEADERS = ["Date", "Type", "Amount", "Vendor", "Description", "Submitted By", "Contact"];

const ExtractSchema = z.object({
  amount: z.number(),
  vendor: z.string(),
  date: z.string(),
  description: z.string(),
});

let anthropicClient;
function getAnthropicClient() {
  if (!anthropicClient) anthropicClient = new Anthropic();
  return anthropicClient;
}

// Strips accidental wrapping quotes (common when a .env-style value is
// pasted verbatim into a dashboard field) before converting literal "\n"
// sequences into real newlines.
function normalizePrivateKey(raw) {
  let key = (raw || "").trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

let sheetsClient;
function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

async function ensureLedgerSheet(sheets) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const existing = meta.data.sheets.find((s) => s.properties.title === LEDGER_SHEET_TITLE);
  if (!existing) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: LEDGER_SHEET_TITLE } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${LEDGER_SHEET_TITLE}!A1:G1`,
      valueInputOption: "RAW",
      requestBody: { values: [LEDGER_HEADERS] },
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { imageBase64, mediaType, type, name, contact } = req.body || {};
  if (!imageBase64 || !mediaType || !mediaType.startsWith("image/")) {
    res.status(400).json({ error: "imageBase64 and an image mediaType are required" });
    return;
  }
  if (type !== "cost" && type !== "sales") {
    res.status(400).json({ error: "type must be 'cost' or 'sales'" });
    return;
  }

  try {
    const response = await getAnthropicClient().messages.parse({
      model: "claude-opus-5",
      max_tokens: 500,
      output_config: { format: zodOutputFormat(ExtractSchema), effort: "low" },
      system: `You are extracting structured data from a photo of a business ${type === "cost" ? "bill or receipt" : "sales voucher"}. Read the amount (total, numeric, no currency symbol or commas), the vendor or party name, the date shown on the document (YYYY-MM-DD; if no date is visible, use "unknown"), and a short one-line description of what it's for. If the amount isn't legible, respond with 0 and say so in the description.`,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: "Extract the details from this document." },
          ],
        },
      ],
    });

    if (!response.parsed_output) {
      res.status(422).json({ error: "Could not read the document" });
      return;
    }

    const extracted = response.parsed_output;

    // Ledger logging is best-effort — a Sheets hiccup shouldn't stop the
    // user from seeing the numbers Claude just extracted.
    try {
      const sheets = getSheetsClient();
      await ensureLedgerSheet(sheets);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${LEDGER_SHEET_TITLE}!A:G`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [[
            extracted.date,
            type === "cost" ? "Cost" : "Sales",
            extracted.amount,
            extracted.vendor,
            extracted.description,
            name || "",
            contact || "",
          ]],
        },
      });
    } catch (sheetErr) {
      console.error("extract-receipt sheet log failed:", sheetErr);
    }

    res.status(200).json(extracted);
  } catch (err) {
    console.error("extract-receipt error:", err);
    res.status(500).json({ error: "Extraction failed" });
  }
}
