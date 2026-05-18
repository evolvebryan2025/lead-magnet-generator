"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Play } from "lucide-react";

const ROTATING_WORDS = ["guide", "checklist", "template", "email sequence", "cheat sheet"];

export function Hero({ onStart }: { onStart: () => void }) {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4">
      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-xs font-medium text-white/80">
            Powered by GPT-4o · Free · No signup
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] mb-6 tracking-tight"
        >
          Generate a complete{" "}
          <span className="relative inline-block min-w-[180px] sm:min-w-[260px] md:min-w-[360px] lg:min-w-[480px] text-left align-baseline">
            <span className="gradient-text inline-block">
              <RotatingWord word={ROTATING_WORDS[wordIdx]} />
            </span>
          </span>
          <br className="hidden sm:block" /> in under 60 seconds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base md:text-lg lg:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Describe your audience, pick a format, and watch a publish-ready lead magnet write itself. Download as branded PDF or Markdown.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12 items-center"
        >
          <button
            onClick={onStart}
            className="gradient-bg text-white font-semibold px-8 py-4 rounded-2xl text-base md:text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-2.5 focus-ring"
          >
            <Zap className="w-5 h-5" />
            Generate Free Lead Magnet
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
          <a
            href="#examples"
            className="glass text-white/90 font-medium px-6 py-4 rounded-2xl text-base hover:bg-white/10 transition-all inline-flex items-center gap-2 focus-ring"
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
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
        >
          {[
            { label: "Avg time", value: "47s", sub: "to ready PDF" },
            { label: "Formats", value: "5", sub: "battle-tested templates" },
            { label: "Tokens used", value: "~$0.01", sub: "per generation" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text font-display">
                {s.value}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] mt-1.5">
                {s.label}
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5 hidden sm:block">
                {s.sub}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RotatingWord({ word }: { word: string }) {
  return (
    <motion.span
      key={word}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      {word}
    </motion.span>
  );
}
