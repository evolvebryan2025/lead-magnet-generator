"use client";
import { motion } from "framer-motion";

const DOCS = [
  { id: 1, x: "5%", y: "16%", rotate: -12, scale: 0.78, color: "from-cyan-500/14 to-blue-600/8", title: "Guide", lines: 5 },
  { id: 2, x: "85%", y: "14%", rotate: 10, scale: 0.85, color: "from-purple-500/14 to-violet-700/8", title: "Checklist", lines: 6 },
  { id: 3, x: "8%", y: "74%", rotate: 6, scale: 0.8, color: "from-pink-500/14 to-purple-700/8", title: "Email", lines: 4 },
  { id: 4, x: "82%", y: "72%", rotate: -8, scale: 0.78, color: "from-blue-500/14 to-cyan-700/8", title: "Template", lines: 5 },
];

export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Slow-shifting mesh gradient blobs */}
      <div
        className="absolute -top-1/3 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.32), rgba(0,229,255,0) 60%)",
          animation: "mesh-shift 30s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -top-1/4 -right-1/4 w-[65vw] h-[65vw] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(160,32,240,0.32), rgba(160,32,240,0) 60%)",
          animation: "mesh-shift 38s ease-in-out infinite -12s",
        }}
      />
      <div
        className="absolute -bottom-1/3 left-1/3 w-[65vw] h-[65vw] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,43,177,0.25), rgba(255,43,177,0) 60%)",
          animation: "mesh-shift 42s ease-in-out infinite -20s",
        }}
      />

      {/* Tech grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #00e5ff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating document cards — gentle drift only, NO mouse tracking */}
      {DOCS.map((doc, i) => (
        <FloatingDoc key={doc.id} doc={doc} delayIdx={i} />
      ))}

      {/* Center magnetic pulse (desktop only, very subtle) */}
      <div
        className="hidden lg:block absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ opacity: 0.2 }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-cyan-400/40"
            style={{
              animation: `magnetic-pulse 4s ease-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Strong vignette to darken edges + center for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(2,3,12,0.4) 0%, rgba(2,3,12,0.75) 75%, rgba(2,3,12,0.95) 100%)",
        }}
      />
    </div>
  );
}

function FloatingDoc({
  doc,
  delayIdx,
}: {
  doc: (typeof DOCS)[number];
  delayIdx: number;
}) {
  return (
    <motion.div
      className="absolute hidden lg:block"
      style={{
        left: doc.x,
        top: doc.y,
        transform: `rotate(${doc.rotate}deg) scale(${doc.scale})`,
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: delayIdx * 0.2, ease: "easeOut" }}
    >
      <div
        className={`relative w-40 h-52 rounded-xl bg-gradient-to-br ${doc.color} backdrop-blur-sm border border-white/5 p-4 shadow-2xl`}
        style={{
          animation: `drift-slow 12s ease-in-out infinite`,
          animationDelay: `${delayIdx * 1.2}s`,
        }}
      >
        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-3 font-semibold">
          {doc.title}
        </div>
        <div className="space-y-1.5">
          {Array.from({ length: doc.lines }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-white/8"
              style={{ width: `${65 + ((i * 13) % 30)}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
