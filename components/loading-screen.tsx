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
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <MagneticAnimation />
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-sm font-medium shimmer-text mt-6"
          >
            {MESSAGES[idx]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="gradient-border-card rounded-3xl p-6 md:p-8 space-y-4">
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
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}

function MagneticAnimation() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-cyan-400/60"
          style={{
            animation: `magnetic-pulse 2.5s ease-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
      {/* Orbiting particles */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`orbit-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: `orbit 3.5s linear infinite`, animationDelay: `${i * -0.875}s` }}
        >
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </div>
      ))}
      {/* Center magnet */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="w-12 h-12 rounded-full gradient-bg shadow-[0_0_30px_rgba(79,140,255,0.7)]"
          style={{ animation: `pulse-glow 1.6s ease-in-out infinite` }}
        />
      </div>
    </div>
  );
}
