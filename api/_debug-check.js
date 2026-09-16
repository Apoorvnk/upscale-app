import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  const keyPresent = !!process.env.GEMINI_API_KEY;
  const keyLength = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0;
  const keyPrefix = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 6) : "";

  let callOk = false;
  let errMessage = "";
  let errStatus = "";
  let errType = "";

  try {
    const client = new GoogleGenAI({});
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Say hi",
    });
    callOk = !!response?.text;
  } catch (err) {
    errMessage = err?.message || String(err);
    errStatus = err?.status || err?.code || "";
    errType = err?.constructor?.name || typeof err;
  }

  res.status(200).json({ keyPresent, keyLength, keyPrefix, callOk, errMessage, errStatus, errType });
}
