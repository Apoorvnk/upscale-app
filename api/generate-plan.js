import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const StepSchema = z.object({
  step: z.string(),
  how: z.string(),
});

const PlanSchema = z.object({
  monthly: z.array(StepSchema),
  quarterly: z.array(StepSchema),
  yearly: StepSchema,
});

const LANGUAGE_NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };

const SYSTEM_PROMPT = `You create simple, doable execution plans for small business owners using a daily habit-building app. Given their goal, business area, and tracking period, break it into three tiers:

- monthly: 2-4 concrete monthly action steps
- quarterly: 2-3 quarterly milestones that build on the monthly steps
- yearly: one overall yearly outcome statement

Each item needs both "step" (what to do — short and specific) and "how" (one sentence on how to actually execute it — a concrete method, script, or habit, never vague advice like "work harder" or "market more"). Keep everything realistic for a small, resource-constrained business owner — no big-budget tactics, no requiring a team.`;

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

  const { goal, subjectName, period, language } = req.body || {};
  if (!goal || !goal.trim()) {
    res.status(400).json({ error: "goal is required" });
    return;
  }

  const langName = LANGUAGE_NAMES[language] || "English";

  try {
    const response = await getClient().messages.parse({
      model: "claude-opus-5",
      max_tokens: 1500,
      output_config: { format: zodOutputFormat(PlanSchema), effort: "medium" },
      system: `${SYSTEM_PROMPT}\n\nRespond entirely in ${langName}.`,
      messages: [
        {
          role: "user",
          content: `Business area: ${subjectName || "small business"}\nGoal: "${goal}"\nTracking period: ${period || "Monthly"}`,
        },
      ],
    });

    if (!response.parsed_output) {
      res.status(422).json({ error: "Could not generate a plan" });
      return;
    }

    res.status(200).json(response.parsed_output);
  } catch (err) {
    console.error("generate-plan error:", err);
    res.status(500).json({ error: "Plan generation failed" });
  }
}
