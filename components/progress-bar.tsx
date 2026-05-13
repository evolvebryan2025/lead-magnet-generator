"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function ProgressBar({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels: string[];
}) {
  const pct = ((step + 1) / total) * 100;

  return (
    <div className="mb-8">
      <div className="hidden sm:flex items-center justify-between mb-3">
        {labels.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  done
                    ? "gradient-bg text-white"
                    : current
                      ? "bg-[var(--color-accent-cyan)] text-[var(--color-bg)]"
                      : "bg-[var(--color-bg-elevated)] text-[var(--color-text-dim)] border border-[var(--color-border-strong)]"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium ${
                  current
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="sm:hidden flex items-center justify-between mb-3 text-xs">
        <span className="text-[var(--color-text-muted)]">
          Step {step + 1} of {total}
        </span>
        <span className="font-medium">{labels[step]}</span>
      </div>

      <div className="h-1.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-bg"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
