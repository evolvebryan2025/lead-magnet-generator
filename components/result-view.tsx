"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Download,
  FileText,
  Mail,
  RotateCcw,
  Check,
  AlertCircle,
  Palette,
  Share2,
  Copy,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MarkdownRender } from "./markdown-render";
import { generatePdf, type PdfTheme } from "@/lib/pdf";
import { slugify } from "@/lib/utils";
import type { Format } from "@/lib/types";

const PDF_THEMES: { id: PdfTheme; label: string; swatch: string }[] = [
  { id: "minimal", label: "Minimal", swatch: "linear-gradient(135deg, #1a1a2e, #16213e)" },
  { id: "bold", label: "Bold", swatch: "linear-gradient(135deg, #22d3ee, #a855f7)" },
  { id: "magazine", label: "Magazine", swatch: "linear-gradient(135deg, #fb923c, #ef4444)" },
];

export function ResultView({
  markdown,
  format,
  brandName,
  primaryColor,
  onReset,
  onRegenerate,
}: {
  markdown: string;
  format: Format;
  brandName?: string;
  primaryColor?: string;
  onReset: () => void;
  onRegenerate?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<PdfTheme>("bold");
  const [copied, setCopied] = useState(false);
  const [captureState, setCaptureState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [captureMsg, setCaptureMsg] = useState("");
  const downloadedRef = useRef(false);

  const titleMatch = /^#\s+(.+)$/m.exec(markdown);
  const title = titleMatch ? titleMatch[1].trim() : "Lead Magnet";
  const filename = slugify(title) || "lead-magnet";

  const fireConfetti = () => {
    if (downloadedRef.current) return;
    downloadedRef.current = true;
    const colors = ["#22d3ee", "#4f8cff", "#a855f7", "#fb923c"];
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors,
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors,
      });
    }, 200);
  };

  const downloadPdf = () => {
    const doc = generatePdf({ markdown, brandName, primaryColor, theme });
    doc.save(`${filename}.pdf`);
    fireConfetti();
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    fireConfetti();
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setCaptureState("sending");
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, magnetTitle: title, format }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setCaptureState("success");
        setCaptureMsg("Got it — download below.");
      } else {
        setCaptureState("error");
        setCaptureMsg(json.error || "Couldn't save your email. Try again.");
      }
    } catch {
      setCaptureState("error");
      setCaptureMsg("Network error. Try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 mb-6"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-accent-cyan)]">
          <Sparkles className="w-4 h-4" />
          Magnet ready
        </div>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} title="Same inputs, fresh output">
              <RotateCcw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onReset}>
            <Sparkles className="w-3.5 h-3.5" />
            New magnet
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="gradient-border-card rounded-3xl p-6 md:p-10 overflow-hidden order-2 lg:order-1"
        >
          <MarkdownRender markdown={markdown} />
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start space-y-4"
        >
          <div className="gradient-border-card rounded-3xl p-5">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Palette className="w-3 h-3" /> PDF theme
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PDF_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col gap-2 p-2 rounded-xl border-2 transition-all focus-ring ${
                    theme === t.id
                      ? "border-[var(--color-accent-cyan)] bg-cyan-400/5"
                      : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  <div
                    className="h-8 rounded-md"
                    style={{ background: t.swatch }}
                  />
                  <span className="text-[10px] font-medium text-center">{t.label}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Button onClick={downloadPdf} className="w-full" size="lg">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={downloadMd}
                variant="secondary"
                className="w-full"
                size="md"
              >
                <FileText className="w-4 h-4" />
                Markdown
              </Button>
              <Button
                onClick={copyMarkdown}
                variant="ghost"
                className="w-full"
                size="md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Markdown
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="gradient-border-card rounded-3xl p-5">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email me a copy
            </div>
            <p className="text-xs text-[var(--color-text-dim)] mb-3">
              We&apos;ll send you a link — no spam.
            </p>
            <form onSubmit={submitEmail} className="space-y-2">
              <Label htmlFor="captureEmail" className="sr-only">
                Email
              </Label>
              <Input
                id="captureEmail"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={captureState === "sending" || captureState === "success"}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={captureState === "sending" || captureState === "success"}
              >
                {captureState === "sending"
                  ? "Sending…"
                  : captureState === "success"
                    ? "Sent ✓"
                    : "Send to my inbox"}
              </Button>
            </form>
            {captureMsg && (
              <div
                className={`mt-3 text-xs flex items-start gap-1.5 ${
                  captureState === "success"
                    ? "text-[var(--color-accent-cyan)]"
                    : "text-red-400"
                }`}
              >
                {captureState === "error" && (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                )}
                <span>{captureMsg}</span>
              </div>
            )}
          </div>

          <div className="gradient-border-card rounded-3xl p-5">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Share2 className="w-3 h-3" /> Share
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `I just generated "${title}" with the Lead Magnet Generator →`
                )}&url=${encodeURIComponent("https://lead-magnet-generator-alpha.vercel.app")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border-strong)] hover:border-[var(--color-accent-cyan)] text-center transition-colors focus-ring"
              >
                Twitter / X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://lead-magnet-generator-alpha.vercel.app")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border-strong)] hover:border-[var(--color-accent-cyan)] text-center transition-colors focus-ring"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </motion.aside>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/95 to-transparent pointer-events-none z-30">
        <div className="pointer-events-auto max-w-md mx-auto">
          <Button
            onClick={downloadPdf}
            className="w-full shadow-2xl shadow-cyan-500/40"
            size="lg"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
