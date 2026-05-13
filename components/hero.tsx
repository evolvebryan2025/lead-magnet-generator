"use client";
import { motion } from "framer-motion";
import { Sparkles, Zap, Download } from "lucide-react";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border-strong)] mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent-cyan)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            AI-powered · Free · No signup
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
        >
          Generate a complete{" "}
          <span className="gradient-text">lead magnet</span>
          <br className="hidden sm:block" /> in under a minute.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Describe your audience and pick a format. We&apos;ll write the guide,
          checklist, or email sequence — ready to download as PDF or Markdown.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={onStart}
          className="gradient-bg text-white font-semibold px-8 py-4 rounded-2xl text-base md:text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Generate Free Lead Magnet
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: Sparkles, label: "5 formats", desc: "Guide, checklist, templates, emails, cheat sheet" },
            { icon: Zap, label: "~30 seconds", desc: "Streamed live as it's written" },
            { icon: Download, label: "PDF + Markdown", desc: "Download or email yourself a copy" },
          ].map((f) => (
            <div
              key={f.label}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 text-left"
            >
              <f.icon className="w-5 h-5 text-[var(--color-accent-cyan)] mb-3" />
              <div className="font-semibold text-sm mb-1">{f.label}</div>
              <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
