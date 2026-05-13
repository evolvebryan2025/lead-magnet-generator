"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";
import { ProgressBar } from "./progress-bar";
import {
  FORMATS,
  FORMAT_LABELS,
  FORMAT_DESCRIPTIONS,
  GenerateInputSchema,
  type GenerateInput,
  type Format,
} from "@/lib/types";

const STEP_LABELS = ["Audience", "Format", "Brand"];

export function GeneratorForm({
  onSubmit,
}: {
  onSubmit: (data: GenerateInput) => void;
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<GenerateInput>({
    audience: "",
    painPoint: "",
    format: "ultimate-guide",
    brandName: "",
    primaryColor: "",
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
    if (step === 2 && data.primaryColor && !/^#[0-9a-fA-F]{6}$/.test(data.primaryColor)) {
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
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <ProgressBar step={step} total={STEP_LABELS.length} labels={STEP_LABELS} />

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
              <Step2 format={data.format} onChange={(v) => update("format", v)} />
            )}
            {step === 2 && (
              <Step3
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
                Generate
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
      <h2 className="text-2xl font-bold mb-2">Who is this for?</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        The more specific, the better the output.
      </p>
      <div className="space-y-5">
        <div>
          <Label htmlFor="audience">Audience</Label>
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
  onChange,
}: {
  format: Format;
  onChange: (v: Format) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Pick a format</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Each format is tuned to a specific use case.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FORMATS.map((f) => {
          const selected = format === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => onChange(f)}
              className={`text-left p-4 rounded-2xl border-2 transition-all ${
                selected
                  ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/5"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]"
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {FORMAT_LABELS[f]}
              </div>
              <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {FORMAT_DESCRIPTIONS[f]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3({
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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Brand (optional)</h2>
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
            Primary color (hex){" "}
            <span className="text-[var(--color-text-dim)] font-normal">
              — used in the PDF accent
            </span>
          </Label>
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
