"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/background";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SampleGallery } from "@/components/sample-gallery";
import { GeneratorForm } from "@/components/generator-form";
import { LoadingScreen } from "@/components/loading-screen";
import { ResultView } from "@/components/result-view";
import { MarkdownRender } from "@/components/markdown-render";
import type { GenerateInput } from "@/lib/types";

type Phase = "landing" | "form" | "loading" | "streaming" | "result" | "error";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [markdown, setMarkdown] = useState("");
  const [input, setInput] = useState<GenerateInput | null>(null);
  const [error, setError] = useState("");

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const start = () => {
    scrollTop();
    setPhase("form");
  };

  const runGeneration = async (data: GenerateInput) => {
    scrollTop();
    setInput(data);
    setMarkdown("");
    setError("");
    setPhase("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `Request failed (${res.status})`);
      }

      setPhase("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        setMarkdown(buf);
      }
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      setPhase("error");
    }
  };

  const reset = () => {
    scrollTop();
    setMarkdown("");
    setInput(null);
    setError("");
    setPhase("landing");
  };

  const regenerate = () => {
    if (input) runGeneration(input);
  };

  const isResult = phase === "result" || phase === "streaming";

  return (
    <>
      {!isResult && <AnimatedBackground />}
      <main className="min-h-screen relative z-10" style={{ pointerEvents: "auto" }}>
        <header className="relative z-20 px-4 py-5 md:px-8 md:py-6 flex items-center justify-between">
          <button
            onClick={reset}
            className="flex items-center gap-2.5 group focus-ring rounded-xl"
            aria-label="Home"
          >
            <div className="relative w-9 h-9 rounded-xl gradient-bg grid place-items-center shadow-lg shadow-cyan-500/30">
              <span className="text-white text-sm font-bold">L</span>
              <span className="absolute inset-0 rounded-xl border border-white/20" />
            </div>
            <span className="font-display font-bold text-base md:text-lg group-hover:opacity-80 transition-opacity">
              Lead Magnet Generator
            </span>
          </button>
          <a
            href="https://github.com/evolvebryan2025/lead-magnet-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus-ring rounded px-2 py-1"
          >
            GitHub ↗
          </a>
        </header>

        <div className="relative z-20">
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero onStart={start} />
              <HowItWorks />
              <SampleGallery />
              <div className="text-center pb-16 px-4">
                <button
                  onClick={start}
                  className="gradient-bg text-white font-semibold px-8 py-4 rounded-2xl text-base md:text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  Start generating →
                </button>
              </div>
            </motion.div>
          )}

          {phase === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GeneratorForm onSubmit={runGeneration} initial={input ?? undefined} />
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingScreen />
            </motion.div>
          )}

          {phase === "streaming" && (
            <motion.div
              key="streaming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-4 py-6 md:py-10"
            >
              <div className="text-xs font-semibold text-[var(--color-accent-cyan)] mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent-cyan)] animate-pulse" />
                Writing live…
              </div>
              <div className="gradient-border-card rounded-3xl p-6 md:p-10">
                <MarkdownRender markdown={markdown} />
              </div>
            </motion.div>
          )}

          {phase === "result" && input && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultView
                markdown={markdown}
                format={input.format}
                brandName={input.brandName || undefined}
                primaryColor={input.primaryColor || undefined}
                onReset={reset}
                onRegenerate={regenerate}
              />
            </motion.div>
          )}

          {phase === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-xl mx-auto px-4 py-20 text-center"
            >
              <div className="gradient-border-card rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-3">Something went wrong</h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-6">{error}</p>
                <button
                  onClick={() => {
                    scrollTop();
                    setPhase("form");
                  }}
                  className="gradient-bg text-white font-semibold px-6 py-3 rounded-xl text-sm"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        <footer className="relative z-20 px-4 py-10 mt-10 text-center text-xs text-[var(--color-text-dim)]">
          Built with Next.js · Powered by OpenAI · Deployed on Vercel
        </footer>
      </main>
    </>
  );
}
