"use client";
import { motion } from "framer-motion";
import { PencilLine, Sparkles, Download } from "lucide-react";

const STEPS = [
  {
    icon: PencilLine,
    title: "Describe",
    body: "Tell us who it's for and the pain you're solving. One paragraph each — that's it.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "Generate",
    body: "Pick a format and tone. Watch GPT-4o write the magnet live, section by section.",
    accent: "from-blue-500 to-purple-600",
  },
  {
    icon: Download,
    title: "Download",
    body: "Edit anything, pick a PDF theme, and grab the file — or email it to yourself.",
    accent: "from-purple-600 to-pink-500",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-14 sm:py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--color-accent-cyan)] mb-3">
            How it works
          </div>
          <h2 className="font-bold text-white leading-[1.1]">
            <span className="block text-[28px] sm:text-4xl lg:text-5xl">
              From <span className="gradient-text">blank page</span> to PDF
            </span>
            <span className="block text-[24px] sm:text-4xl lg:text-5xl mt-1 sm:mt-2 text-[var(--color-text-muted)]">
              in three moves.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="gradient-border-card rounded-3xl p-6 md:p-8 text-center relative"
            >
              <div
                className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${step.accent} grid place-items-center shadow-[0_0_30px_rgba(0,229,255,0.25)]`}
              >
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5 font-bold">
                Step {i + 1}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2.5 text-white">{step.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
