import { jsPDF } from "jspdf";

interface PdfOptions {
  markdown: string;
  brandName?: string;
  primaryColor?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [59, 130, 246];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function stripInline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function generatePdf({ markdown, brandName, primaryColor }: PdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const contentW = pageW - margin * 2;
  const [r, g, b] = hexToRgb(primaryColor || "#3b82f6");

  let y = margin;

  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageW, 6, "F");
  y += 12;

  if (brandName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 130);
    doc.text(brandName.toUpperCase(), margin, y);
    y += 20;
  }

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      doc.setFillColor(r, g, b);
      doc.rect(0, 0, pageW, 6, "F");
      y = margin + 12;
    }
  };

  const lines = markdown.split("\n");
  let inCode = false;
  let codeBuf: string[] = [];

  const flushCode = () => {
    if (!codeBuf.length) return;
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFillColor(245, 245, 248);
    const padded = codeBuf.join("\n");
    const wrapped = doc.splitTextToSize(padded, contentW - 16);
    const h = wrapped.length * 12 + 16;
    ensureSpace(h + 6);
    doc.rect(margin, y, contentW, h, "F");
    doc.text(wrapped, margin + 8, y + 16);
    y += h + 10;
    codeBuf = [];
  };

  for (const raw of lines) {
    const line = raw;

    if (line.startsWith("```")) {
      if (inCode) flushCode();
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (!line.trim()) {
      y += 6;
      continue;
    }

    if (line.startsWith("# ")) {
      const t = stripInline(line.slice(2));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(20, 20, 30);
      const wrapped = doc.splitTextToSize(t, contentW);
      ensureSpace(wrapped.length * 26 + 10);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 26 + 8;
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(2);
      doc.line(margin, y, margin + 60, y);
      y += 18;
      continue;
    }
    if (line.startsWith("## ")) {
      const t = stripInline(line.slice(3));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(20, 20, 30);
      const wrapped = doc.splitTextToSize(t, contentW);
      ensureSpace(wrapped.length * 19 + 10);
      y += 10;
      doc.text(wrapped, margin, y);
      y += wrapped.length * 19 + 4;
      continue;
    }
    if (line.startsWith("### ")) {
      const t = stripInline(line.slice(4));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 50);
      const wrapped = doc.splitTextToSize(t, contentW);
      ensureSpace(wrapped.length * 16 + 6);
      y += 6;
      doc.text(wrapped, margin, y);
      y += wrapped.length * 16 + 2;
      continue;
    }

    const ulMatch = /^[-*]\s+(.*)/.exec(line);
    const olMatch = /^(\d+)\.\s+(.*)/.exec(line);
    if (ulMatch || olMatch) {
      const t = stripInline(ulMatch ? ulMatch[1] : olMatch![2]);
      const bullet = ulMatch ? "•" : `${olMatch![1]}.`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(40, 40, 50);
      const wrapped = doc.splitTextToSize(t, contentW - 18);
      ensureSpace(wrapped.length * 14 + 4);
      doc.setTextColor(r, g, b);
      doc.text(bullet, margin, y + 11);
      doc.setTextColor(40, 40, 50);
      doc.text(wrapped, margin + 18, y + 11);
      y += wrapped.length * 14 + 4;
      continue;
    }

    const t = stripInline(line);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(40, 40, 50);
    const wrapped = doc.splitTextToSize(t, contentW);
    ensureSpace(wrapped.length * 14 + 4);
    doc.text(wrapped, margin, y + 11);
    y += wrapped.length * 14 + 6;
  }

  if (inCode) flushCode();

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 160);
    doc.text(`${i} / ${pages}`, pageW - margin, pageH - 24, { align: "right" });
    if (brandName) {
      doc.text(brandName, margin, pageH - 24);
    }
  }

  return doc;
}
