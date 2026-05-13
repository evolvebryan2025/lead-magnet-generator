# Lead Magnet Generator

A free web tool that generates a complete, downloadable lead magnet — guide, checklist, template pack, email sequence, or cheat sheet — from a single description of your audience and offer. Built with Next.js 15, Tailwind v4, and Claude.

## What it does

- Multi-step form captures audience, pain point, format, and optional branding
- Streams the response live as Claude writes it
- Renders Markdown inline (headings, lists, code blocks, inline formatting)
- One-click PDF and Markdown download with brand color theming
- Optional email capture with Resend integration
- Mobile-first responsive design, dark theme

## Setup

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

## Environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | **Yes** | Powers generation. Get one at console.anthropic.com. |
| `ANTHROPIC_MODEL` | No | Override default model (`claude-sonnet-4-5`). |
| `RESEND_API_KEY` | No | Sends confirmation emails after lead capture. |
| `RESEND_FROM_EMAIL` | No | From address. Defaults to `onboarding@resend.dev`. |
| `UPSTASH_REDIS_REST_URL` | No | Distributed rate limiting (10 req/hour/IP). |
| `UPSTASH_REDIS_REST_TOKEN` | No | Paired with the URL above. |

All optional vars fall back gracefully when unset.

## Deployment

```bash
vercel --prod
```

Then add `ANTHROPIC_API_KEY` in the Vercel project settings.

## Stack

- Next.js 15 (App Router) + TypeScript strict mode
- Tailwind CSS v4 (CSS-based theming)
- Framer Motion
- Anthropic SDK with streaming + ephemeral prompt caching
- jsPDF for client-side PDF generation
- Zod for input validation

## License

MIT
