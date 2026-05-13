"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Analyzing your audience…",
  "Outlining the structure…",
  "Drafting headlines…",
  "Writing the body copy…",
  "Adding actionable steps…",
  "Polishing the final draft…",
];

export function LoadingScreen() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="inline-block w-12 h-12 mb-6">
          <div className="w-full h-full rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-accent-cyan)] animate-spin" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-[var(--color-text-muted)]"
          >
            {MESSAGES[idx]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 space-y-4">
        <div className="skeleton h-8 w-3/4 rounded-lg" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
          <div className="skeleton h-3 w-4/6 rounded" />
        </div>
        <div className="skeleton h-6 w-1/2 rounded-lg mt-6" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-11/12 rounded" />
        </div>
      </div>
    </div>
  );
}
