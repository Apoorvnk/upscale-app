import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const ValidationSchema = z.object({
  valid: z.boolean(),
  feedback: z.string(),
});

const SYSTEM_PROMPT = `You are validating daily business observations from small business owners using a coaching app. Each day they're shown a trend, an update, and a success story for their industry, then asked to write ONE observation about what they've personally noticed in their own business this week.

Mark valid: true when the observation is genuine and specific — it names something concrete about their own business (a number, a customer interaction, a change, a decision), even if brief and imperfectly written.

Mark valid: false when the observation is empty, gibberish, random characters, or so generic it says nothing (e.g. "good", "nothing", "business is fine") or is just copied from the day's content without adding their own detail.

Always include brief, encouraging feedback (1-2 sentences). If rejecting, say specifically what kind of detail would make it pass.`;

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

  const { observationText, subjectName, trend, update, successStory } = req.body || {};
  if (!observationText || !observationText.trim()) {
    res.status(400).json({ error: "observationText is required" });
    return;
  }

  try {
    const response = await getClient().messages.parse({
      model: "claude-opus-5",
      max_tokens: 500,
      output_config: { format: zodOutputFormat(ValidationSchema), effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Today's content for their industry ("${subjectName}"):
- Trend: ${trend}
- Update: ${update}
- Success story: ${successStory}

Their observation: "${observationText}"`,
        },
      ],
    });

    if (!response.parsed_output) {
      res.status(200).json({ valid: true, feedback: "Thanks for sharing your observation." });
      return;
    }

    res.status(200).json(response.parsed_output);
  } catch (err) {
    console.error("validate-observation error:", err);
    res.status(500).json({ error: "Validation failed" });
  }
}
