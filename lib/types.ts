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
  "ultimate-guide": "A long-form, sectioned guide that establishes authority.",
  checklist: "A scannable, action-oriented step-by-step checklist.",
  "template-pack": "Fill-in-the-blank templates your audience can use today.",
  "email-sequence": "A 5-email nurture sequence ready to drop into your ESP.",
  "cheat-sheet": "A one-page reference your audience will pin to their desk.",
};

export const GenerateInputSchema = z.object({
  audience: z.string().min(10, "Tell us a bit more about your audience.").max(500),
  painPoint: z.string().min(10, "Describe the pain point in more detail.").max(500),
  format: z.enum(FORMATS),
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
