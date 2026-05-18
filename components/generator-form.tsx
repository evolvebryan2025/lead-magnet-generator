"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Wand2,
  FileText,
  ListChecks,
  Mail,
  Layout,
  StickyNote,
  Briefcase,
  Heart,
  Flame,
  Smile,
  TrendingUp,
  Filter,
  Calendar,
  Award,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";
import { ProgressBar } from "./progress-bar";
import {
  FORMATS,
  FORMAT_LABELS,
  FORMAT_DESCRIPTIONS,
  FORMAT_TIMES,
  TONES,
  TONE_LABELS,
  TONE_DESCRIPTIONS,
  GOALS,
  GOAL_LABELS,
  LENGTHS,
  GenerateInputSchema,
  type GenerateInput,
  type Format,
  type Tone,
  type Goal,
  type Length,
} from "@/lib/types";

const STEP_LABELS = ["Audience", "Format", "Voice", "Brand"];

const FORMAT_ICONS: Record<Format, typeof FileText> = {
  "ultimate-guide": FileText,
  checklist: ListChecks,
  "email-sequence": Mail,
  "template-pack": Layout,
  "cheat-sheet": StickyNote,
};

const TONE_ICONS: Record<Tone, typeof Briefcase> = {
  professional: Briefcase,
  friendly: Heart,
  bold: Flame,
  witty: Smile,
};

const GOAL_ICONS: Record<Goal, typeof TrendingUp> = {
  "list-growth": TrendingUp,
  "lead-qualification": Filter,
  "demo-booking": Calendar,
  authority: Award,
};

const AUDIENCE_PRESETS = [
  "Series A SaaS founders running 5-15 person teams who handle their own marketing",
  "Freelance brand designers charging $5k-$25k per project",
  "Course creators with engaged audiences but stalled launches",
  "B2B sales reps doing 50+ cold outreach attempts per week",
];

export function GeneratorForm({
  onSubmit,
  initial,
}: {
  onSubmit: (data: GenerateInput) => void;
  initial?: Partial<GenerateInput>;
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<GenerateInput>({
    audience: initial?.audience ?? "",
    painPoint: initial?.painPoint ?? "",
    format: initial?.format ?? "ultimate-guide",
    tone: initial?.tone ?? "professional",
    goal: initial?.goal ?? "list-growth",
    length: initial?.length ?? "standard",
    brandName: initial?.brandName ?? "",
    primaryColor: initial?.primaryColor ?? "",
  });

  const update = <K extends keyof GenerateInput>(key: K, value: GenerateInput[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (data.audience.trim().length < 10)
        errs.audience = "Tell us a bit more about your audience (10+ chars).";
      if (data.painPoint.trim().length < 10)
        errs.painPoint = "Describe the pain point in more detail (10+ chars).";
    }
    if (step === 3 && data.primaryColor && !/^#[0-9a-fA-F]{6}$/.test(data.primaryColor)) {
      errs.primaryColor = "Use a hex color like #3b82f6";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEP_LABELS.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const back = () => setStep(Math.max(0, step - 1));

  const handleSubmit = () => {
    const parsed = GenerateInputSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    onSubmit(parsed.data);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <ProgressBar step={step} total={STEP_LABELS.length} labels={STEP_LABELS} />

      <div className="gradient-border-card rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <Step1
                audience={data.audience}
                painPoint={data.painPoint}
                onAudience={(v) => update("audience", v)}
                onPainPoint={(v) => update("painPoint", v)}
                errors={errors}
              />
            )}
            {step === 1 && (
              <Step2
                format={data.format}
                length={data.length}
                onFormat={(v) => update("format", v)}
                onLength={(v) => update("length", v)}
              />
            )}
            {step === 2 && (
              <Step3
                tone={data.tone}
                goal={data.goal}
                onTone={(v) => update("tone", v)}
                onGoal={(v) => update("goal", v)}
              />
            )}
            {step === 3 && (
              <Step4
                brandName={data.brandName || ""}
                primaryColor={data.primaryColor || ""}
                onBrandName={(v) => update("brandName", v)}
                onPrimaryColor={(v) => update("primaryColor", v)}
                errors={errors}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className="disabled:invisible"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={next} size="lg">
            {step === STEP_LABELS.length - 1 ? (
              <>
                <Wand2 className="w-4 h-4" />
                Generate magnet
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Step1({
  audience,
  painPoint,
  onAudience,
  onPainPoint,
  errors,
}: {
  audience: string;
  painPoint: string;
  onAudience: (v: string) => void;
  onPainPoint: (v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Who is this for?</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        The more specific you are, the sharper the output.
      </p>
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="audience" className="mb-0">Audience</Label>
            <button
              type="button"
              onClick={() => {
                const random = AUDIENCE_PRESETS[Math.floor(Math.random() * AUDIENCE_PRESETS.length)];
                onAudience(random);
              }}
              className="text-xs text-[var(--color-accent-cyan)] hover:underline focus-ring rounded"
            >
              Use an example →
            </button>
          </div>
          <Textarea
            id="audience"
            placeholder="e.g. Series A SaaS founders running 5–15 person teams who handle their own marketing"
            value={audience}
            onChange={(e) => onAudience(e.target.value)}
            rows={3}
          />
          {errors.audience && (
            <p className="text-xs text-red-400 mt-1.5">{errors.audience}</p>
          )}
        </div>
        <div>
          <Label htmlFor="painPoint">Primary pain point</Label>
          <Textarea
            id="painPoint"
            placeholder="e.g. They're spending too much time on content that doesn't convert and aren't sure how to measure what's working"
            value={painPoint}
            onChange={(e) => onPainPoint(e.target.value)}
            rows={3}
          />
          {errors.painPoint && (
            <p className="text-xs text-red-400 mt-1.5">{errors.painPoint}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step2({
  format,
  length,
  onFormat,
  onLength,
}: {
  format: Format;
  length: Length;
  onFormat: (v: Format) => void;
  onLength: (v: Length) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Pick a format</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Each format is tuned to a specific use case.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {FORMATS.map((f) => {
          const selected = format === f;
          const Icon = FORMAT_ICONS[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => onFormat(f)}
              className={`group text-left p-4 rounded-2xl border-2 transition-all focus-ring ${
                selected
                  ? "border-[var(--color-accent-cyan)] bg-cyan-400/5 shadow-lg shadow-cyan-500/10"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg grid place-items-center transition-colors ${
                    selected
                      ? "gradient-bg"
                      : "bg-[var(--color-bg-card)] group-hover:bg-[var(--color-bg-card-hover)]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] font-semibold">
                  {FORMAT_TIMES[f]}
                </span>
              </div>
              <div className="font-semibold text-sm mb-1">{FORMAT_LABELS[f]}</div>
              <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {FORMAT_DESCRIPTIONS[f]}
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <Label>Length</Label>
        <div className="grid grid-cols-3 gap-2">
          {LENGTHS.map((l) => {
            const selected = length === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => onLength(l)}
                className={`py-2.5 px-3 rounded-xl border-2 text-xs font-medium capitalize transition-all focus-ring ${
                  selected
                    ? "border-[var(--color-accent-cyan)] bg-cyan-400/5 text-white"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step3({
  tone,
  goal,
  onTone,
  onGoal,
}: {
  tone: Tone;
  goal: Goal;
  onTone: (v: Tone) => void;
  onGoal: (v: Goal) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Voice & goal</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Tunes the writing style and the closing CTA.
      </p>

      <div className="mb-7">
        <Label>Tone</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TONES.map((t) => {
            const selected = tone === t;
            const Icon = TONE_ICONS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => onTone(t)}
                title={TONE_DESCRIPTIONS[t]}
                className={`flex flex-col items-center gap-2 py-3 px-3 rounded-xl border-2 transition-all focus-ring ${
                  selected
                    ? "border-[var(--color-accent-violet)] bg-violet-500/5"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    selected ? "text-[var(--color-accent-violet)]" : "text-[var(--color-text-muted)]"
                  }`}
                />
                <span className="text-xs font-medium">{TONE_LABELS[t]}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--color-text-dim)] mt-2.5 italic">
          {TONE_DESCRIPTIONS[tone]}
        </p>
      </div>

      <div>
        <Label>Goal of the magnet</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOALS.map((g) => {
            const selected = goal === g;
            const Icon = GOAL_ICONS[g];
            return (
              <button
                key={g}
                type="button"
                onClick={() => onGoal(g)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl border-2 text-left transition-all focus-ring ${
                  selected
                    ? "border-[var(--color-accent-orange)] bg-orange-400/5"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    selected ? "text-[var(--color-accent-orange)]" : "text-[var(--color-text-muted)]"
                  }`}
                />
                <span className="text-xs font-medium">{GOAL_LABELS[g]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step4({
  brandName,
  primaryColor,
  onBrandName,
  onPrimaryColor,
  errors,
}: {
  brandName: string;
  primaryColor: string;
  onBrandName: (v: string) => void;
  onPrimaryColor: (v: string) => void;
  errors: Record<string, string>;
}) {
  const PRESET_COLORS = ["#22d3ee", "#4f8cff", "#a855f7", "#fb923c", "#10b981", "#ef4444"];
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Brand <span className="text-[var(--color-text-dim)] text-xl">(optional)</span></h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Skip this if you just want the content.
      </p>
      <div className="space-y-5">
        <div>
          <Label htmlFor="brandName">Brand name</Label>
          <Input
            id="brandName"
            placeholder="Acme Co."
            value={brandName}
            onChange={(e) => onBrandName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="primaryColor">
            PDF accent color{" "}
            <span className="text-[var(--color-text-dim)] font-normal">
              — used for headings and the cover bar
            </span>
          </Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onPrimaryColor(c)}
                className={`w-9 h-9 rounded-lg border-2 transition-transform hover:scale-110 focus-ring ${
                  primaryColor === c ? "border-white scale-110" : "border-white/20"
                }`}
                style={{ background: c }}
                aria-label={`Pick color ${c}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <Input
              id="primaryColor"
              placeholder="#3b82f6"
              value={primaryColor}
              onChange={(e) => onPrimaryColor(e.target.value)}
              maxLength={7}
            />
            <div
              className="w-12 h-12 rounded-xl border border-[var(--color-border-strong)] shrink-0"
              style={{
                background: /^#[0-9a-fA-F]{6}$/.test(primaryColor)
                  ? primaryColor
                  : "var(--color-bg-elevated)",
              }}
            />
          </div>
          {errors.primaryColor && (
            <p className="text-xs text-red-400 mt-1.5">{errors.primaryColor}</p>
          )}
        </div>
      </div>
    </div>
  );
}
