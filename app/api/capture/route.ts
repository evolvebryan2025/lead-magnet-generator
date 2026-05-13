import { NextRequest, NextResponse } from "next/server";
import { CaptureInputSchema } from "@/lib/types";
import { saveLead, sendConfirmationEmail } from "@/lib/leads-store";

export const runtime = "nodejs";

function getClientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anonymous";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = CaptureInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const lead = {
    ...parsed.data,
    capturedAt: new Date().toISOString(),
    ip: getClientIp(req),
  };

  await saveLead(lead);
  const emailResult = await sendConfirmationEmail(lead);

  return NextResponse.json({
    ok: true,
    emailSent: emailResult.sent,
  });
}
