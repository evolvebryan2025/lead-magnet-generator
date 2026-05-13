import { promises as fs } from "fs";
import path from "path";
import os from "os";
import type { CaptureInput } from "./types";

type Lead = CaptureInput & { capturedAt: string; ip?: string };

const STORE_PATH = path.join(os.tmpdir(), "lead-magnet-leads.json");

async function readAll(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

export async function saveLead(lead: Lead) {
  try {
    const all = await readAll();
    all.push(lead);
    await fs.writeFile(STORE_PATH, JSON.stringify(all, null, 2), "utf-8");
    return { ok: true };
  } catch (err) {
    console.warn("Lead store write failed (non-fatal):", err);
    return { ok: false };
  }
}

export async function sendConfirmationEmail(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  if (!apiKey) return { sent: false, reason: "no-api-key" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: lead.email,
        subject: `Your lead magnet: ${lead.magnetTitle}`,
        html: `<p>Hey,</p>
<p>Thanks for using the Lead Magnet Generator. Your "${lead.magnetTitle}" is ready in the browser — download the PDF or Markdown copy from the result page.</p>
<p>— The Lead Magnet Generator</p>`,
      }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false, reason: "fetch-error" };
  }
}
