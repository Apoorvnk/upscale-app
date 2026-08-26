import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const HEADERS = [
  "Name",
  "Subject",
  "Target",
  "City",
  "Contact",
  "Date",
  "Update Sent (Y/N)",
  "Video Sent (Y/N)",
  "Observation Submitted (Y/N)",
  "Observation Text",
  "Streak",
  "Would they use it tomorrow?",
  "Notes",
];

let sheetsClient;
function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

async function getFirstSheetTitle(sheets) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  return meta.data.sheets[0].properties.title;
}

// Row matching and Notes/"Would they use it tomorrow?" are manual-only, so
// every write below is scoped to columns A:K and never touches L or M.
async function ensureHeaders(sheets, title) {
  const current = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${title}!A1:M1`,
  });
  const row = current.data.values?.[0] || [];
  const matches = HEADERS.every((h, i) => row[i] === h);
  if (!matches) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${title}!A1:M1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

async function findRowNumber(sheets, title, name, date) {
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${title}!A2:F`,
  });
  const rows = existing.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if ((rows[i][0] || "") === name && (rows[i][5] || "") === date) {
      return i + 2; // +1 for header row, +1 for 0-index -> 1-index
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, subject, target, city, contact, date, observationText, streak } = req.body || {};
  if (!name || !date) {
    res.status(400).json({ error: "name and date are required" });
    return;
  }

  try {
    const sheets = getSheetsClient();
    const title = await getFirstSheetTitle(sheets);
    await ensureHeaders(sheets, title);

    const values = [[
      name,
      subject || "",
      target || "",
      city || "",
      contact || "",
      date,
      "Y",
      "Y",
      "Y",
      observationText || "",
      streak ?? "",
    ]];

    const rowNumber = await findRowNumber(sheets, title, name, date);
    if (rowNumber) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${title}!A${rowNumber}:K${rowNumber}`,
        valueInputOption: "RAW",
        requestBody: { values },
      });
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${title}!A:K`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values },
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("sheet-log error:", err);
    // TEMPORARY: surfacing err.message for setup debugging — revert to a
    // generic message before this handles real tester traffic.
    res.status(500).json({ error: "Failed to log to sheet", detail: err?.response?.data || err?.message });
  }
}
