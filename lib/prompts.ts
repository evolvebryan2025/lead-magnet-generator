import type { Format } from "./types";

const FORMAT_GUIDANCE: Record<Format, string> = {
  "ultimate-guide": `Produce a long-form guide of 1200–1800 words.
Structure: H1 title, an "Intro" section (2–3 paragraphs hooking the reader), 4–6 main sections each with an H2 and 2–4 short paragraphs plus bullet points, then a "Next Steps" H2 with a 3-item action list and a soft CTA tying back to the brand.`,

  checklist: `Produce a scannable checklist of 12–18 items grouped into 3–4 themed sections.
Structure: H1 title, 1-paragraph intro explaining who it's for, then sections with H2 headers each containing 3–6 checkbox items. Each item begins with an action verb. End with a "Bonus tip" callout.`,

  "template-pack": `Produce 3–5 fill-in-the-blank templates the audience can use immediately.
Structure: H1 title, 1-paragraph intro, then each template as an H2 followed by a short use-case sentence and a fenced code block (\`\`\`) containing the template text with [BRACKETED] placeholders. End with a "How to customize these" H2 list.`,

  "email-sequence": `Produce a 5-email nurture sequence.
Structure: H1 sequence title, 1-paragraph intro describing the goal of the sequence, then 5 emails each as an H2 in the format "Email N — Subject line". Under each email include: send timing (e.g. "Send: Day 0"), preview text, and the full email body (120–200 words) with a single clear CTA.`,

  "cheat-sheet": `Produce a one-page cheat sheet at 400–700 words.
Structure: H1 title, 1-sentence purpose statement, then 4–6 H2 sections each containing either a short bullet list or a numbered mini-framework. Density over depth. End with a single "Remember" callout line.`,
};

export const SYSTEM_PROMPT = `You are a senior conversion copywriter who creates high-value lead magnets for B2B and B2C marketers.

Your output rules:
1. Return ONLY clean Markdown. No HTML, no code-fence wrapping around the entire response, no preamble like "Here is your lead magnet:".
2. The very first line MUST be a single H1 (# Title). Make the title benefit-driven and specific.
3. Use proper Markdown headings (##, ###), bullet points (-), and numbered lists (1.) where appropriate.
4. Tone: confident, direct, modern. No fluff, no AI tells ("In today's fast-paced world…"), no em-dash overuse.
5. Specific > generic. Use concrete examples, numbers, and scenarios that match the stated audience.
6. The content must be genuinely useful — something the reader would pay for. Avoid filler.
7. If a brand name is provided, weave it naturally into the intro and closing. Never force it.
8. Length and structure must follow the format-specific instructions below exactly.`;

export function buildUserPrompt(input: {
  audience: string;
  painPoint: string;
  format: Format;
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

Format-specific instructions:
${FORMAT_GUIDANCE[input.format]}

Begin now with the H1 title on line 1.`;
}
