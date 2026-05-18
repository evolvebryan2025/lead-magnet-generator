"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Play } from "lucide-react";

const ROTATING_WORDS = ["guide", "checklist", "template", "email sequence", "cheat sheet"];

export function Hero({ onStart }: { onStart: () => void }) {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative pt-10 pb-16 sm:pt-12 sm:pb-20 md:pt-20 md:pb-28 px-4">
      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass mb-6 sm:mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-white/90 whitespace-nowrap">
            Powered by GPT-4o · Free · No signup
          </span>
        </motion.div>

        <div className="relative">
          {/* Backdrop scrim for legibility */}
          <div
            aria-hidden
            className="absolute -inset-x-4 -inset-y-4 md:-inset-x-12 md:-inset-y-8 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(2,3,12,0.85) 0%, rgba(2,3,12,0.5) 60%, transparent 100%)",
              filter: "blur(8px)",
            }}
          />

          {/* Headline — stacks line-by-line, gradient highlight glows */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative font-bold leading-[1.08] mb-5 sm:mb-6 tracking-tight text-white"
          >
            <span className="block text-[28px] sm:text-5xl md:text-6xl lg:text-7xl">
              Generate a complete
            </span>
            <span className="block text-[32px] sm:text-5xl md:text-6xl lg:text-7xl mt-1 sm:mt-2 min-h-[1.2em] leading-[1.15]">
              <span className="highlight-bar inline-block px-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ROTATING_WORDS[wordIdx]}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.4 }}
                    className="inline-block gradient-text"
                  >
                    {ROTATING_WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
            <span className="block text-[26px] sm:text-5xl md:text-6xl lg:text-7xl mt-1 sm:mt-2">
              in under 60 seconds.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative text-[15px] sm:text-base md:text-lg lg:text-xl text-[var(--color-text-muted)] max-w-md sm:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
          >
            Describe your audience, pick a format, and watch a publish-ready lead magnet write itself. Download as branded PDF or Markdown.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10 sm:mb-12 items-stretch sm:items-center max-w-md sm:max-w-none mx-auto"
        >
          <button
            onClick={onStart}
            className="gradient-bg text-white font-semibold px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-base md:text-lg shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:shadow-[0_0_60px_rgba(0,229,255,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2.5 focus-ring"
          >
            <Zap className="w-5 h-5" />
            <span className="whitespace-nowrap">Generate Lead Magnet</span>
            <ArrowRight className="w-4 h-4 ml-0.5 hidden sm:inline" />
          </button>
          <a
            href="#examples"
            className="glass text-white/95 font-medium px-6 py-3.5 sm:py-4 rounded-2xl text-base hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2 focus-ring"
          >
            <Play className="w-4 h-4" />
            See examples
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 max-w-md sm:max-w-2xl mx-auto"
        >
          {[
            { label: "Avg time", value: "47s", sub: "to ready PDF" },
            { label: "Formats", value: "5", sub: "battle-tested" },
            { label: "Cost / gen", value: "~$0.01", sub: "GPT-4o tokens" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text font-display">
                {s.value}
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mt-1.5 font-semibold">
                {s.label}
              </div>
              <div className="text-[11px] sm:text-xs text-[var(--color-text-dim)] mt-0.5 hidden sm:block">
                {s.sub}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

