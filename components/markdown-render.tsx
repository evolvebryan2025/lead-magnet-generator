"use client";
import { useMemo } from "react";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(text: string) {
  let s = escape(text);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-accent-cyan)] text-[0.9em]">$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--color-accent-cyan)] underline underline-offset-2">$1</a>');
  return s;
}

function mdToHtml(md: string) {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let inCode = false;
  let codeBuf: string[] = [];

  const closeList = () => {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  };

  for (const raw of lines) {
    const line = raw;

    if (line.startsWith("```")) {
      if (inCode) {
        out.push(
          `<pre class="my-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-strong)] overflow-x-auto text-xs font-mono text-[var(--color-text)]"><code>${codeBuf.map(escape).join("\n")}</code></pre>`
        );
        codeBuf = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      out.push(
        `<h1 class="text-3xl md:text-4xl font-bold mt-2 mb-6 leading-tight">${renderInline(line.slice(2))}</h1>`
      );
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      out.push(
        `<h2 class="text-xl md:text-2xl font-bold mt-8 mb-3 leading-snug">${renderInline(line.slice(3))}</h2>`
      );
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      out.push(
        `<h3 class="text-lg font-semibold mt-6 mb-2">${renderInline(line.slice(4))}</h3>`
      );
      continue;
    }

    const ulMatch = /^[-*]\s+(.*)/.exec(line);
    if (ulMatch) {
      if (inList !== "ul") {
        closeList();
        out.push('<ul class="my-3 space-y-1.5 list-disc pl-6">');
        inList = "ul";
      }
      out.push(`<li class="leading-relaxed">${renderInline(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = /^\d+\.\s+(.*)/.exec(line);
    if (olMatch) {
      if (inList !== "ol") {
        closeList();
        out.push('<ol class="my-3 space-y-1.5 list-decimal pl-6">');
        inList = "ol";
      }
      out.push(`<li class="leading-relaxed">${renderInline(olMatch[1])}</li>`);
      continue;
    }

    closeList();
    out.push(
      `<p class="my-3 leading-relaxed text-[var(--color-text)]">${renderInline(line)}</p>`
    );
  }
  closeList();
  if (inCode && codeBuf.length) {
    out.push(
      `<pre class="my-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-strong)] overflow-x-auto text-xs font-mono">${codeBuf.map(escape).join("\n")}</pre>`
    );
  }
  return out.join("\n");
}

export function MarkdownRender({ markdown }: { markdown: string }) {
  const html = useMemo(() => mdToHtml(markdown), [markdown]);
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
