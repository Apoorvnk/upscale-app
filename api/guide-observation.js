import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const GuidanceSchema = z.object({
  guidance: z.string(),
});

const SYSTEM_PROMPT = `You are a business coach inside a daily habit-building app for small business owners. The user has a stated target for this period. Each day they read an update, a trend, and a success story about their industry, then write ONE observation about what they've noticed in their own business.

Read their target and their observation, then give brief (2-3 sentences), specific, actionable guidance connecting today's observation to a concrete next step toward their target. Be warm but concrete — never generic pep talk, never mention that you are an AI, never mention pricing or subscriptions.`;

let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { observationText, goal, subjectName } = req.body || {};
  if (!observationText || !observationText.trim()) {
    res.status(400).json({ error: "observationText is required" });
    return;
  }

  try {
    const response = await getClient().messages.parse({
      model: "claude-opus-5",
      max_tokens: 500,
      output_config: { format: zodOutputFormat(GuidanceSchema), effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Their business area: ${subjectName || "small business"}
Their target for this period: "${goal || "not set"}"
Today's observation: "${observationText}"`,
        },
      ],
    });

    if (!response.parsed_output) {
      res.status(200).json({ guidance: "Keep this observation in mind as you plan tomorrow — small, specific notice like this is how you'll spot what's actually moving the needle." });
      return;
    }

    res.status(200).json(response.parsed_output);
  } catch (err) {
    console.error("guide-observation error:", err);
    res.status(500).json({ error: "Guidance failed" });
  }
}
