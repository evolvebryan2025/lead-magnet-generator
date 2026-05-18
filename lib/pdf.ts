import { jsPDF } from "jspdf";

export type PdfTheme = "minimal" | "bold" | "magazine";

interface PdfOptions {
  markdown: string;
  brandName?: string;
  primaryColor?: string;
  theme?: PdfTheme;
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [79, 140, 255];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function stripInline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

interface ThemeStyle {
  bgColor: [number, number, number] | null;
  textColor: [number, number, number];
  mutedColor: [number, number, number];
  topBarHeight: number;
  showCover: boolean;
}

function getThemeStyle(theme: PdfTheme): ThemeStyle {
  switch (theme) {
    case "minimal":
      return {
        bgColor: null,
        textColor: [20, 20, 30],
        mutedColor: [120, 120, 130],
        topBarHeight: 4,
        showCover: false,
      };
    case "magazine":
      return {
        bgColor: null,
        textColor: [25, 25, 35],
        mutedColor: [110, 110, 130],
        topBarHeight: 10,
        showCover: true,
      };
    case "bold":
    default:
      return {
        bgColor: null,
        textColor: [20, 20, 30],
        mutedColor: [115, 115, 135],
        topBarHeight: 8,
        showCover: true,
      };
  }
}

export function generatePdf({
  markdown,
  brandName,
  primaryColor,
  theme = "bold",
}: PdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const contentW = pageW - margin * 2;
  const [r, g, b] = hexToRgb(primaryColor || "#4f8cff");
  const style = getThemeStyle(theme);

  // Cover page (bold + magazine themes)
  if (style.showCover) {
    const titleMatch = /^#\s+(.+)$/m.exec(markdown);
    const title = titleMatch ? stripInline(titleMatch[1]) : "Lead Magnet";

    if (theme === "bold") {
      doc.setFillColor(r, g, b);
      doc.rect(0, 0, pageW, pageH, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text((brandName || "LEAD MAGNET").toUpperCase(), margin, margin + 20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      const wrapped = doc.splitTextToSize(title, contentW);
      doc.text(wrapped, margin, pageH / 2 - wrapped.length * 18);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Generated with Lead Magnet Generator", margin, pageH - margin);
    } else {
      // magazine
      doc.setFillColor(245, 240, 235);
      doc.rect(0, 0, pageW, pageH, "F");
      doc.setFillColor(r, g, b);
      doc.rect(0, 0, pageW, style.topBarHeight, "F");
      doc.rect(0, pageH - style.topBarHeight, pageW, style.topBarHeight, "F");

      doc.setTextColor(60, 60, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        (brandName || "ISSUE 01").toUpperCase(),
        margin,
        margin + 20,
      );

      doc.setTextColor(r, g, b);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(46);
      const wrapped = doc.splitTextToSize(title, contentW);
      doc.text(wrapped, margin, pageH / 2 - wrapped.length * 22);

      doc.setTextColor(80, 80, 90);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("A briefing inside.", margin, pageH / 2 + wrapped.length * 22 + 18);
    }
    doc.addPage();
  }

  let y = margin;

  // Top bar accent
  if (style.topBarHeight > 0) {
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageW, style.topBarHeight, "F");
    y += style.topBarHeight + 8;
  }

  if (brandName && !style.showCover) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...style.mutedColor);
    doc.text(brandName.toUpperCase(), margin, y);
    y += 20;
  }

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      if (style.topBarHeight > 0) {
        doc.setFillColor(r, g, b);
        doc.rect(0, 0, pageW, style.topBarHeight, "F");
      }
      y = margin + style.topBarHeight + 8;
    }
  };

  const lines = markdown.split("\n");
  let inCode = false;
  let codeBuf: string[] = [];
  let titleSkipped = !style.showCover; // skip H1 on first body page if cover already showed it

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
      if (!titleSkipped) {
        titleSkipped = true;
        continue;
      }
      const t = stripInline(line.slice(2));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...style.textColor);
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
    titleSkipped = true; // any non-H1 means body started

    if (line.startsWith("## ")) {
      const t = stripInline(line.slice(3));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(...style.textColor);
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
  const coverOffset = style.showCover ? 1 : 0;
  for (let i = 1 + coverOffset; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 160);
    doc.text(`${i - coverOffset} / ${pages - coverOffset}`, pageW - margin, pageH - 24, {
      align: "right",
    });
    if (brandName) {
      doc.text(brandName, margin, pageH - 24);
    }
  }

  return doc;
}
