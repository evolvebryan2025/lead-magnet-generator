import { z } from "zod";

export const FORMATS = [
  "ultimate-guide",
  "checklist",
  "template-pack",
  "email-sequence",
  "cheat-sheet",
] as const;
export type Format = (typeof FORMATS)[number];

export const FORMAT_LABELS: Record<Format, string> = {
  "ultimate-guide": "Ultimate Guide",
  checklist: "Checklist",
  "template-pack": "Template Pack",
  "email-sequence": "Email Sequence",
  "cheat-sheet": "Cheat Sheet",
};

export const FORMAT_DESCRIPTIONS: Record<Format, string> = {
  "ultimate-guide": "Long-form authority piece — 1200-1800 words, 4-6 sections.",
  checklist: "Scannable action items — 12-18 boxes grouped by phase.",
  "template-pack": "3-5 fill-in-the-blank templates with placeholders.",
  "email-sequence": "A 5-email nurture sequence with subjects + send timing.",
  "cheat-sheet": "Single-page reference — 400-700 words of pure density.",
};

export const FORMAT_TIMES: Record<Format, string> = {
  "ultimate-guide": "~60s",
  checklist: "~30s",
  "template-pack": "~45s",
  "email-sequence": "~50s",
  "cheat-sheet": "~25s",
};

export const TONES = ["professional", "friendly", "bold", "witty"] as const;
export type Tone = (typeof TONES)[number];

export const TONE_LABELS: Record<Tone, string> = {
  professional: "Professional",
  friendly: "Friendly",
  bold: "Bold",
  witty: "Witty",
};

export const TONE_DESCRIPTIONS: Record<Tone, string> = {
  professional: "Clear, credible, low-key. The default for B2B.",
  friendly: "Warm, conversational, second-person. Great for course creators.",
  bold: "Direct, opinionated, contrarian. For challenger brands.",
  witty: "Smart-funny, observational, light. For consumer-leaning audiences.",
};

export const GOALS = [
  "list-growth",
  "lead-qualification",
  "demo-booking",
  "authority",
] as const;
export type Goal = (typeof GOALS)[number];

export const GOAL_LABELS: Record<Goal, string> = {
  "list-growth": "Grow my email list",
  "lead-qualification": "Qualify leads",
  "demo-booking": "Book demos / calls",
  authority: "Build authority",
};

export const LENGTHS = ["short", "standard", "long"] as const;
export type Length = (typeof LENGTHS)[number];

export const GenerateInputSchema = z.object({
  audience: z.string().min(10, "Tell us a bit more about your audience.").max(500),
  painPoint: z.string().min(10, "Describe the pain point in more detail.").max(500),
  format: z.enum(FORMATS),
  tone: z.enum(TONES).default("professional"),
  goal: z.enum(GOALS).default("list-growth"),
  length: z.enum(LENGTHS).default("standard"),
  brandName: z.string().max(80).optional().or(z.literal("")),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #3b82f6")
    .optional()
    .or(z.literal("")),
});
export type GenerateInput = z.infer<typeof GenerateInputSchema>;

export const CaptureInputSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  magnetTitle: z.string().min(1).max(200),
  format: z.enum(FORMATS),
});
export type CaptureInput = z.infer<typeof CaptureInputSchema>;
