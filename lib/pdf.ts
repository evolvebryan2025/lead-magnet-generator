import { jsPDF } from "jspdf";

export type PdfTheme = "minimal" | "bold" | "magazine";

interface PdfOptions {
  markdown: string;
  brandName?: string;
  primaryColor?: string;
  theme?: PdfTheme;
}

// Page geometry (US Letter portrait, points)
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 64;
const MARGIN_TOP = 72;
const MARGIN_BOTTOM = 64;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

// Typography scale
const TYPE = {
  h1: { size: 26, lh: 31, weight: "bold" as const },
  h2: { size: 16, lh: 20, weight: "bold" as const },
  h3: { size: 12, lh: 16, weight: "bold" as const },
  body: { size: 10.5, lh: 16, weight: "normal" as const },
  small: { size: 9, lh: 12, weight: "normal" as const },
  code: { size: 9.5, lh: 14 },
};

// Colors (RGB tuples)
const TEXT = [22, 24, 38] as const;
const TEXT_SOFT = [70, 72, 90] as const;
const TEXT_MUTED = [120, 124, 145] as const;
const TEXT_DIM = [165, 168, 185] as const;
const BG_CODE = [244, 246, 252] as const;
const CODE_TEXT = [200, 70, 130] as const;

type Color = readonly [number, number, number];

function hexToRgb(hex: string): Color {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [79, 140, 255];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function setColor(doc: jsPDF, c: Color, kind: "text" | "fill" | "draw" = "text") {
  if (kind === "text") doc.setTextColor(c[0], c[1], c[2]);
  else if (kind === "fill") doc.setFillColor(c[0], c[1], c[2]);
  else doc.setDrawColor(c[0], c[1], c[2]);
}

// ─── Inline parser ──────────────────────────────────────────────────────
type Segment = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

function parseInline(line: string): Segment[] {
  const out: Segment[] = [];
  let i = 0;
  let buf = "";
  const push = (extras: Partial<Segment> = {}) => {
    if (buf) {
      out.push({ text: buf, ...extras });
      buf = "";
    }
  };
  while (i < line.length) {
    const ch = line[i];
    if (ch === "*" && line[i + 1] === "*") {
      const end = line.indexOf("**", i + 2);
      if (end > i + 2) {
        push();
        out.push({ text: line.slice(i + 2, end), bold: true });
        i = end + 2;
        continue;
      }
    }
    if (ch === "*" && line[i + 1] !== "*" && line[i - 1] !== "*") {
      const end = line.indexOf("*", i + 1);
      if (end > i + 1 && line[end - 1] !== "*" && line[end + 1] !== "*") {
        push();
        out.push({ text: line.slice(i + 1, end), italic: true });
        i = end + 1;
        continue;
      }
    }
    if (ch === "`") {
      const end = line.indexOf("`", i + 1);
      if (end > i + 1) {
        push();
        out.push({ text: line.slice(i + 1, end), code: true });
        i = end + 1;
        continue;
      }
    }
    if (ch === "[") {
      const close = line.indexOf("]", i + 1);
      if (close > i + 1 && line[close + 1] === "(") {
        const paren = line.indexOf(")", close + 2);
        if (paren > close + 1) {
          push();
          out.push({ text: line.slice(i + 1, close) });
          i = paren + 1;
          continue;
        }
      }
    }
    buf += ch;
    i++;
  }
  push();
  return out;
}

// ─── Renderer ───────────────────────────────────────────────────────────
export function generatePdf({
  markdown,
  brandName,
  primaryColor,
  theme = "bold",
}: PdfOptions) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const accent = hexToRgb(primaryColor || "#4f8cff") as Color;

  const titleMatch = /^#\s+(.+)$/m.exec(markdown);
  const rawTitle = titleMatch ? titleMatch[1].trim() : "Lead Magnet";
  // Strip markdown formatting from title
  const title = parseInline(rawTitle)
    .map((s) => s.text)
    .join("");

  let coverPages = 0;
  let y = MARGIN_TOP;

  const startBodyPage = () => {
    y = MARGIN_TOP;
    // Top accent bar
    const barH = theme === "minimal" ? 3 : theme === "magazine" ? 6 : 6;
    setColor(doc, accent, "fill");
    doc.rect(0, 0, PAGE_W, barH, "F");
  };

  const newPage = () => {
    doc.addPage();
    startBodyPage();
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN_BOTTOM) newPage();
  };

  // ─── Cover pages ──────────────────────────────────────────────────────
  const drawCover = () => {
    if (theme === "minimal") return;

    coverPages = 1;

    if (theme === "bold") {
      setColor(doc, accent, "fill");
      doc.rect(0, 0, PAGE_W, PAGE_H, "F");

      // brand stamp top-left
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        (brandName || "LEAD MAGNET").toUpperCase(),
        MARGIN_X,
        MARGIN_X + 20,
        { charSpace: 1.5 }
      );

      // Title block, centered vertically
      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      const wrapped = doc.splitTextToSize(title, CONTENT_W);
      const titleH = wrapped.length * 46;
      const titleY = PAGE_H / 2 - titleH / 2;
      doc.text(wrapped, MARGIN_X, titleY);

      // Accent line below title
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(2);
      doc.line(MARGIN_X, titleY + titleH + 8, MARGIN_X + 60, titleY + titleH + 8);

      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "A practical briefing.",
        MARGIN_X,
        titleY + titleH + 36
      );

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("Generated with Lead Magnet Generator", MARGIN_X, PAGE_H - MARGIN_X);
    }

    if (theme === "magazine") {
      // Cream background
      setColor(doc, [248, 244, 236], "fill");
      doc.rect(0, 0, PAGE_W, PAGE_H, "F");

      // Top + bottom accent bars
      setColor(doc, accent, "fill");
      doc.rect(0, 0, PAGE_W, 12, "F");
      doc.rect(0, PAGE_H - 12, PAGE_W, 12, "F");

      // Issue label top-left
      doc.setTextColor(80, 80, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(
        (brandName || "ISSUE 01").toUpperCase(),
        MARGIN_X,
        MARGIN_X + 28,
        { charSpace: 2 }
      );

      // Date line on right
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      doc.text(date, PAGE_W - MARGIN_X, MARGIN_X + 28, { align: "right" });

      // Title centered
      doc.setTextColor(accent[0], accent[1], accent[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(46);
      const wrapped = doc.splitTextToSize(title, CONTENT_W);
      const titleH = wrapped.length * 52;
      const titleY = PAGE_H / 2 - titleH / 2;
      doc.text(wrapped, MARGIN_X, titleY);

      // Subtitle
      doc.setFont("helvetica", "italic");
      doc.setFontSize(13);
      doc.setTextColor(90, 90, 110);
      doc.text(
        "A briefing inside.",
        MARGIN_X,
        titleY + titleH + 24
      );

      // Footer brand line
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 140);
      doc.text(
        (brandName || "Generated with Lead Magnet Generator"),
        MARGIN_X,
        PAGE_H - 28,
        { charSpace: 1 }
      );
    }
  };

  drawCover();
  if (coverPages > 0) doc.addPage();
  startBodyPage();

  // ─── Inline renderer with proper word-wrapping across formatting ──────
  function renderInline(
    segments: Segment[],
    opts: {
      x: number;
      maxWidth: number;
      lineHeight: number;
      fontSize: number;
      color: Color;
      bold?: boolean;
    }
  ): number {
    let x = opts.x;
    const startX = opts.x;
    const right = opts.x + opts.maxWidth;
    // Move y down by one line to account for baseline
    y += opts.lineHeight * 0.8;

    for (const seg of segments) {
      const isCode = !!seg.code;
      const segBold = !!seg.bold || !!opts.bold;
      const segItalic = !!seg.italic;
      // Apply font
      if (isCode) doc.setFont("courier", "normal");
      else if (segBold && segItalic) doc.setFont("helvetica", "bolditalic");
      else if (segBold) doc.setFont("helvetica", "bold");
      else if (segItalic) doc.setFont("helvetica", "italic");
      else doc.setFont("helvetica", "normal");
      doc.setFontSize(opts.fontSize);
      const color = isCode ? CODE_TEXT : opts.color;
      doc.setTextColor(color[0], color[1], color[2]);

      // Word-wrap this segment's text
      const tokens = seg.text.match(/\S+|\s+/g) ?? [];
      for (const tok of tokens) {
        const isSpace = /^\s+$/.test(tok);
        const w = doc.getTextWidth(tok);
        if (!isSpace && x + w > right) {
          x = startX;
          y += opts.lineHeight;
          if (y > PAGE_H - MARGIN_BOTTOM) {
            newPage();
            y += opts.lineHeight * 0.8;
          }
        }
        // Skip leading whitespace on a new line
        if (isSpace && x === startX) continue;

        // Background tint for inline code
        if (isCode && !isSpace) {
          const padX = 2;
          const padY = 3;
          setColor(doc, BG_CODE, "fill");
          doc.roundedRect(x - padX, y - opts.fontSize + padY, w + padX * 2, opts.fontSize + padY, 2, 2, "F");
          doc.setTextColor(color[0], color[1], color[2]);
        }
        doc.text(tok, x, y);
        x += w;
      }
    }
    y += opts.lineHeight * 0.4; // small descender space
    return y;
  }

  // ─── Walk markdown ────────────────────────────────────────────────────
  const lines = markdown.split("\n");
  let inCode = false;
  let codeBuf: string[] = [];
  let firstH1Seen = false;
  let firstH2OnPage = true;

  const flushCode = () => {
    if (!codeBuf.length) return;
    doc.setFont("courier", "normal");
    doc.setFontSize(TYPE.code.size);
    const wrapped = doc.splitTextToSize(codeBuf.join("\n"), CONTENT_W - 28);
    const h = wrapped.length * TYPE.code.lh + 24;
    ensureSpace(h + 8);
    // Block background
    setColor(doc, BG_CODE, "fill");
    doc.roundedRect(MARGIN_X, y, CONTENT_W, h, 6, 6, "F");
    // Left accent bar
    setColor(doc, accent, "fill");
    doc.rect(MARGIN_X, y, 3, h, "F");
    // Text
    doc.setTextColor(40, 45, 70);
    doc.text(wrapped, MARGIN_X + 16, y + 18);
    y += h + 10;
    codeBuf = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");

    // Code fence toggle
    if (/^```/.test(line)) {
      if (inCode) flushCode();
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      codeBuf.push(raw);
      continue;
    }

    if (!line.trim()) {
      y += 6;
      continue;
    }

    // H1
    if (/^# /.test(line)) {
      // Skip the first H1 if cover page already showed it
      if (coverPages > 0 && !firstH1Seen) {
        firstH1Seen = true;
        continue;
      }
      firstH1Seen = true;
      const segs = parseInline(line.slice(2));
      ensureSpace(TYPE.h1.lh * 2);
      renderInline(segs, {
        x: MARGIN_X,
        maxWidth: CONTENT_W,
        lineHeight: TYPE.h1.lh,
        fontSize: TYPE.h1.size,
        color: TEXT,
        bold: true,
      });
      // Accent underline
      setColor(doc, accent, "draw");
      doc.setLineWidth(2);
      doc.line(MARGIN_X, y + 2, MARGIN_X + 56, y + 2);
      y += 22;
      firstH2OnPage = true;
      continue;
    }
    firstH1Seen = true;

    // H2
    if (/^## /.test(line)) {
      const segs = parseInline(line.slice(3));
      ensureSpace(TYPE.h2.lh * 2 + 20);
      // Separator above H2 (not for first H2 on page)
      if (!firstH2OnPage) {
        setColor(doc, [225, 228, 238], "draw");
        doc.setLineWidth(0.5);
        doc.line(MARGIN_X, y + 4, MARGIN_X + CONTENT_W, y + 4);
        y += 20;
      } else {
        y += 12;
      }
      firstH2OnPage = false;
      renderInline(segs, {
        x: MARGIN_X,
        maxWidth: CONTENT_W,
        lineHeight: TYPE.h2.lh,
        fontSize: TYPE.h2.size,
        color: TEXT,
        bold: true,
      });
      y += 6;
      continue;
    }

    // H3
    if (/^### /.test(line)) {
      const segs = parseInline(line.slice(4));
      ensureSpace(TYPE.h3.lh * 2 + 8);
      y += 8;
      renderInline(segs, {
        x: MARGIN_X,
        maxWidth: CONTENT_W,
        lineHeight: TYPE.h3.lh,
        fontSize: TYPE.h3.size,
        color: TEXT,
        bold: true,
      });
      y += 2;
      continue;
    }

    // Bulleted list item
    const ul = /^[-*+]\s+(.*)/.exec(line);
    if (ul) {
      const segs = parseInline(ul[1]);
      ensureSpace(TYPE.body.lh + 4);
      // Bullet
      setColor(doc, accent, "fill");
      doc.circle(MARGIN_X + 4, y + TYPE.body.lh * 0.6, 1.8, "F");
      renderInline(segs, {
        x: MARGIN_X + 18,
        maxWidth: CONTENT_W - 18,
        lineHeight: TYPE.body.lh,
        fontSize: TYPE.body.size,
        color: TEXT_SOFT,
      });
      continue;
    }

    // Numbered list item
    const ol = /^(\d+)\.\s+(.*)/.exec(line);
    if (ol) {
      const num = ol[1];
      const segs = parseInline(ol[2]);
      ensureSpace(TYPE.body.lh + 4);
      // Number
      doc.setFont("helvetica", "bold");
      doc.setFontSize(TYPE.body.size);
      setColor(doc, accent);
      doc.text(`${num}.`, MARGIN_X, y + TYPE.body.lh * 0.85);
      renderInline(segs, {
        x: MARGIN_X + 22,
        maxWidth: CONTENT_W - 22,
        lineHeight: TYPE.body.lh,
        fontSize: TYPE.body.size,
        color: TEXT_SOFT,
      });
      continue;
    }

    // Blockquote / callout (lines starting with >)
    const bq = /^>\s*(.*)/.exec(line);
    if (bq) {
      const segs = parseInline(bq[1]);
      ensureSpace(TYPE.body.lh + 14);
      const startY = y;
      renderInline(segs, {
        x: MARGIN_X + 18,
        maxWidth: CONTENT_W - 18,
        lineHeight: TYPE.body.lh,
        fontSize: TYPE.body.size,
        color: TEXT_SOFT,
        italic: true,
      } as never);
      // Left accent bar matching height of rendered text
      setColor(doc, accent, "fill");
      doc.rect(MARGIN_X, startY + 4, 3, y - startY - 4, "F");
      continue;
    }

    // Default: paragraph
    const segs = parseInline(line);
    ensureSpace(TYPE.body.lh + 4);
    renderInline(segs, {
      x: MARGIN_X,
      maxWidth: CONTENT_W,
      lineHeight: TYPE.body.lh,
      fontSize: TYPE.body.size,
      color: TEXT_SOFT,
    });
    y += 4;
  }

  if (inCode) flushCode();

  // ─── Footer on every body page ────────────────────────────────────────
  const total = doc.getNumberOfPages();
  const bodyTotal = total - coverPages;
  for (let i = 1 + coverPages; i <= total; i++) {
    doc.setPage(i);
    const pageNumInBody = i - coverPages;
    // Hairline divider
    setColor(doc, [225, 228, 238], "draw");
    doc.setLineWidth(0.5);
    doc.line(MARGIN_X, PAGE_H - 40, PAGE_W - MARGIN_X, PAGE_H - 40);
    // Brand left
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(doc, TEXT_MUTED);
    if (brandName) {
      doc.text(brandName.toUpperCase(), MARGIN_X, PAGE_H - 26, { charSpace: 1 });
    } else {
      doc.text("LEAD MAGNET GENERATOR", MARGIN_X, PAGE_H - 26, { charSpace: 1 });
    }
    // Page X / Y right
    setColor(doc, TEXT_DIM);
    doc.text(`${pageNumInBody}  /  ${bodyTotal}`, PAGE_W - MARGIN_X, PAGE_H - 26, {
      align: "right",
    });
  }

  return doc;
}
