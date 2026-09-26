import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";
import mammoth from "mammoth";

const DOCX_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const LEGACY_DOC_MEDIA_TYPE = "application/msword";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const LEDGER_SHEET_TITLE = "Ledger";
const LEDGER_HEADERS = ["Date", "Type", "Amount", "Vendor", "Description", "Submitted By", "Contact"];

let genaiClient;
function getGenaiClient() {
  if (!genaiClient) genaiClient = new GoogleGenAI({});
  return genaiClient;
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

  const { fileBase64, mediaType, type, name, contact } = req.body || {};
  const isSupportedMediaType = mediaType && (
    mediaType.startsWith("image/") ||
    mediaType === "application/pdf" ||
    mediaType === DOCX_MEDIA_TYPE ||
    mediaType === LEGACY_DOC_MEDIA_TYPE
  );
  if (!fileBase64 || !isSupportedMediaType) {
    res.status(400).json({ error: "fileBase64 and a supported mediaType (image, PDF, or .docx) are required" });
    return;
  }
  if (mediaType === LEGACY_DOC_MEDIA_TYPE) {
    res.status(422).json({ error: "Older .doc files aren't supported — please upload a photo, PDF, or .docx instead." });
    return;
  }
  if (type !== "cost" && type !== "sales") {
    res.status(400).json({ error: "type must be 'cost' or 'sales'" });
    return;
  }

  try {
    const systemPrompt = `You are extracting structured data from a business ${type === "cost" ? "bill or receipt" : "sales voucher"}, given as a photo, PDF, or the text of a Word document. Read the amount (total, numeric, no currency symbol or commas), the vendor or party name, the date shown on the document (YYYY-MM-DD; if no date is visible, use "unknown"), and a short one-line description of what it's for. If the amount isn't legible, respond with 0 and say so in the description.

Respond with ONLY a JSON object (no markdown fences, no other text) shaped exactly like:
{"amount": 0, "vendor": "...", "date": "...", "description": "..."}`;

    let contents;
    if (mediaType === DOCX_MEDIA_TYPE) {
      const { value: docText } = await mammoth.extractRawText({ buffer: Buffer.from(fileBase64, "base64") });
      if (!docText.trim()) {
        res.status(422).json({ error: "Could not read any text from that document" });
        return;
      }
      contents = [{ text: `Extract the details from this document:\n\n${docText.slice(0, 8000)}` }];
    } else {
      contents = [
        { inlineData: { mimeType: mediaType, data: fileBase64 } },
        { text: "Extract the details from this document." },
      ];
    }

    const response = await getGenaiClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = (response.text || "").trim();

    let extracted = null;
    try {
      const cleaned = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.amount === "number" && typeof parsed.vendor === "string" && typeof parsed.date === "string" && typeof parsed.description === "string") {
        extracted = parsed;
      }
    } catch {
      extracted = null;
    }

    if (!extracted) {
      res.status(422).json({ error: "Could not read the document" });
      return;
    }

    // Ledger logging is best-effort — a Sheets hiccup shouldn't stop the
    // user from seeing the numbers just extracted.
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
