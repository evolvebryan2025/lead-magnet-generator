"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Mail, RotateCcw, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MarkdownRender } from "./markdown-render";
import { generatePdf } from "@/lib/pdf";
import { slugify } from "@/lib/utils";
import type { Format } from "@/lib/types";

export function ResultView({
  markdown,
  format,
  brandName,
  primaryColor,
  onReset,
}: {
  markdown: string;
  format: Format;
  brandName?: string;
  primaryColor?: string;
  onReset: () => void;
}) {
  const [email, setEmail] = useState("");
  const [captureState, setCaptureState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [captureMsg, setCaptureMsg] = useState("");

  const titleMatch = /^#\s+(.+)$/m.exec(markdown);
  const title = titleMatch ? titleMatch[1].trim() : "Lead Magnet";
  const filename = slugify(title) || "lead-magnet";

  const downloadPdf = () => {
    const doc = generatePdf({ markdown, brandName, primaryColor });
    doc.save(`${filename}.pdf`);
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
        setCaptureMsg("Got it — keep this tab open to download below.");
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
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-accent-cyan)]">
          <Check className="w-4 h-4" />
          Ready to download
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="w-3.5 h-3.5" />
          Generate another
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-10 overflow-hidden order-2 lg:order-1"
        >
          <MarkdownRender markdown={markdown} />
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start space-y-4"
        >
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-5">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
              Download
            </div>
            <div className="space-y-2">
              <Button onClick={downloadPdf} className="w-full" size="lg">
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button
                onClick={downloadMd}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                <FileText className="w-4 h-4" />
                Markdown
              </Button>
            </div>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-5">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 flex items-center gap-1.5">
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
        </motion.aside>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/95 to-transparent pointer-events-none">
        <div className="pointer-events-auto max-w-md mx-auto">
          <Button onClick={downloadPdf} className="w-full shadow-2xl shadow-blue-500/30" size="lg">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
