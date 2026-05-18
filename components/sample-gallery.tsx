"use client";
import { motion } from "framer-motion";
import { FileText, ListChecks, Mail, Layout, StickyNote, ArrowUpRight } from "lucide-react";

const SAMPLES = [
  {
    icon: FileText,
    format: "Ultimate Guide",
    audience: "Series A SaaS founders",
    title: "The Modern Founder's Guide to Content That Converts",
    preview:
      "Most founder-led content fails for a reason you can fix in an afternoon. Here are the five plays that separate $5M ARR companies from the rest…",
    accent: "from-cyan-500/30 to-blue-600/20",
  },
  {
    icon: ListChecks,
    format: "Checklist",
    audience: "Freelance designers",
    title: "The Pre-Pitch Checklist: 14 Boxes to Tick Before Sending a Proposal",
    preview:
      "Before you send another proposal, check these. Section 1: Discovery. Did you confirm budget tier? Did you ask about decision-maker?",
    accent: "from-purple-500/30 to-violet-700/20",
  },
  {
    icon: Mail,
    format: "Email Sequence",
    audience: "Course creators",
    title: "The 5-Email Launch Sequence That Sold $48K in 7 Days",
    preview:
      "Email 1 — Subject: 'What I learned losing $30k.' Day 0. Hey [first_name], I want to tell you about the most expensive mistake of my career…",
    accent: "from-pink-500/30 to-purple-600/20",
  },
  {
    icon: Layout,
    format: "Template Pack",
    audience: "Sales reps",
    title: "The Cold Outreach Template Pack (10 Plays That Get Replies)",
    preview:
      "Template 1 — The 'Specific Praise' opener. Use this when you've found a recent post or talk by your prospect. Subject: 'Loved your point on…",
    accent: "from-cyan-500/30 to-purple-600/20",
  },
  {
    icon: StickyNote,
    format: "Cheat Sheet",
    audience: "Marketing managers",
    title: "The One-Page Funnel Diagnostic Cheat Sheet",
    preview:
      "Where is your funnel leaking? Section 1: Top-of-funnel. If CTR < 2%, your hook is weak. If bounce > 70%, your promise is mismatched…",
    accent: "from-blue-500/30 to-cyan-600/20",
  },
  {
    icon: FileText,
    format: "Ultimate Guide",
    audience: "Real estate agents",
    title: "The First-Time Buyer's Playbook: 9 Steps From Browsing to Keys",
    preview:
      "Buying your first home is part finance, part emotion, part luck. This guide breaks down the nine steps every successful first-time buyer takes…",
    accent: "from-magenta-500/30 to-purple-600/20",
  },
];

export function SampleGallery() {
  return (
    <section id="examples" className="relative py-16 md:py-24 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent-magenta)] mb-3">
            Examples
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Real magnets, <span className="gradient-text">real ICPs</span>.
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
            A sample of what the generator produces across the five formats.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SAMPLES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group gradient-border-card rounded-2xl p-5 md:p-6 hover:scale-[1.015] transition-transform cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.accent} grid place-items-center backdrop-blur-sm border border-white/10`}
                >
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--color-text-dim)] group-hover:text-[var(--color-accent-cyan)] transition-colors" />
              </div>

              <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5 font-bold">
                {s.format} · {s.audience}
              </div>
              <h3 className="text-base font-bold leading-snug mb-3 line-clamp-2 text-white">
                {s.title}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                {s.preview}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
