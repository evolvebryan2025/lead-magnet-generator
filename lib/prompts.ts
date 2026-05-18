import type { Format, Tone, Goal, Length } from "./types";

const FORMAT_GUIDANCE: Record<Format, (length: Length) => string> = {
  "ultimate-guide": (l) => {
    const wc =
      l === "short" ? "700–1000 words" : l === "long" ? "1800–2400 words" : "1200–1800 words";
    return `Produce a long-form guide of ${wc}.
Structure: H1 title, an "Intro" section (2–3 paragraphs hooking the reader), 4–6 main sections each with an H2 and 2–4 short paragraphs plus bullet points, then a "Next Steps" H2 with a 3-item action list and a soft CTA tying back to the brand.`;
  },
  checklist: (l) => {
    const ic = l === "short" ? "8–12" : l === "long" ? "18–24" : "12–18";
    return `Produce a scannable checklist of ${ic} items grouped into 3–4 themed sections.
Structure: H1 title, 1-paragraph intro explaining who it's for, then sections with H2 headers each containing 3–6 checkbox items. Each item begins with an action verb. End with a "Bonus tip" callout.`;
  },
  "template-pack": (l) => {
    const tc = l === "short" ? "3" : l === "long" ? "5–7" : "3–5";
    return `Produce ${tc} fill-in-the-blank templates the audience can use immediately.
Structure: H1 title, 1-paragraph intro, then each template as an H2 followed by a short use-case sentence and a fenced code block (\`\`\`) containing the template text with [BRACKETED] placeholders. End with a "How to customize these" H2 list.`;
  },
  "email-sequence": (l) => {
    const ec = l === "short" ? "3" : l === "long" ? "7" : "5";
    return `Produce a ${ec}-email nurture sequence.
Structure: H1 sequence title, 1-paragraph intro describing the goal of the sequence, then ${ec} emails each as an H2 in the format "Email N — Subject line". Under each email include: send timing (e.g. "Send: Day 0"), preview text, and the full email body (120–200 words) with a single clear CTA.`;
  },
  "cheat-sheet": (l) => {
    const wc = l === "short" ? "300–500 words" : l === "long" ? "700–1000 words" : "400–700 words";
    return `Produce a one-page cheat sheet at ${wc}.
Structure: H1 title, 1-sentence purpose statement, then 4–6 H2 sections each containing either a short bullet list or a numbered mini-framework. Density over depth. End with a single "Remember" callout line.`;
  },
};

const TONE_GUIDANCE: Record<Tone, string> = {
  professional:
    "Tone: Confident, credible, direct. Industry-appropriate vocabulary. No slang. Default for B2B and high-stakes verticals.",
  friendly:
    "Tone: Warm, conversational, second-person ('you', 'your'). Light contractions. Like a smart friend giving advice over coffee.",
  bold:
    "Tone: Direct, opinionated, challenger-brand energy. Take strong stances. Call out conventional wisdom. Use short, declarative sentences.",
  witty:
    "Tone: Smart-funny, observational, light. Occasional asides. Specific cultural references where relevant. Never sacrifice clarity for the joke.",
};

const GOAL_GUIDANCE: Record<Goal, string> = {
  "list-growth":
    "Primary goal: grow the email list. Final CTA should encourage signing up for more content like this. Mention the brand owns more value the reader can access by subscribing.",
  "lead-qualification":
    "Primary goal: qualify leads. Include 2–3 self-assessment moments where the reader evaluates their fit. Final CTA invites the qualified reader to a discovery call.",
  "demo-booking":
    "Primary goal: book demos. Reader should naturally arrive at 'I should see this in action.' Final CTA is a single clear demo-booking invitation, framed around the outcome (not the product).",
  authority:
    "Primary goal: build authority and trust. Include specific data points, named frameworks, and at least one contrarian opinion. Final CTA is soft — follow for more / share with a colleague.",
};

export const SYSTEM_PROMPT = `You are a senior conversion copywriter who creates high-value lead magnets for B2B and B2C marketers.

Your output rules:
1. Return ONLY clean Markdown. No HTML, no code-fence wrapping around the entire response, no preamble like "Here is your lead magnet:".
2. The very first line MUST be a single H1 (# Title). Make the title benefit-driven and specific.
3. Use proper Markdown headings (##, ###), bullet points (-), and numbered lists (1.) where appropriate.
4. No fluff, no AI tells ("In today's fast-paced world…"), no em-dash overuse, no "delve / unleash / unlock / leverage / robust".
5. Specific > generic. Use concrete examples, numbers, and scenarios that match the stated audience.
6. The content must be genuinely useful — something the reader would pay for. Avoid filler.
7. If a brand name is provided, weave it naturally into the intro and closing. Never force it.
8. Length, structure, tone, and goal must follow the instructions below exactly.`;

export function buildUserPrompt(input: {
  audience: string;
  painPoint: string;
  format: Format;
  tone: Tone;
  goal: Goal;
  length: Length;
  brandName?: string;
}) {
  const brandLine = input.brandName
    ? `Brand: ${input.brandName}`
    : "Brand: (none — write in a neutral first-person plural voice)";

  return `Create a lead magnet with these inputs.

Audience: ${input.audience}
Primary pain point: ${input.painPoint}
${brandLine}
Format: ${input.format}

${TONE_GUIDANCE[input.tone]}

${GOAL_GUIDANCE[input.goal]}

Format-specific structure:
${FORMAT_GUIDANCE[input.format](input.length)}

Begin now with the H1 title on line 1.`;
}
