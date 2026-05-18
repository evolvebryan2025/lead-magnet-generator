import { NextRequest } from "next/server";
import OpenAI from "openai";
import { GenerateInputSchema } from "@/lib/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anonymous";
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Server missing OPENAI_API_KEY. Add it in your Vercel project settings or .env.local to enable generation.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = GenerateInputSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: parsed.error.issues[0]?.message ?? "Invalid input." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip = getClientIp(req);
  const rl = await rateLimit(ip);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({
        error: "Rate limit reached (10/hour). Please try again later.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const userPrompt = buildUserPrompt(parsed.data);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          stream: true,
          temperature: 0.7,
          max_tokens: 4000,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed.";
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
