"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const DOCS = [
  { id: 1, x: "8%", y: "18%", rotate: -14, scale: 0.85, color: "from-cyan-400/30 to-blue-500/20", title: "Guide", lines: 5 },
  { id: 2, x: "82%", y: "12%", rotate: 12, scale: 0.95, color: "from-violet-500/30 to-purple-500/20", title: "Checklist", lines: 6 },
  { id: 3, x: "12%", y: "70%", rotate: 8, scale: 0.9, color: "from-orange-400/30 to-pink-500/20", title: "Email", lines: 4 },
  { id: 4, x: "78%", y: "68%", rotate: -10, scale: 0.85, color: "from-blue-500/30 to-cyan-400/20", title: "Template", lines: 5 },
  { id: 5, x: "45%", y: "8%", rotate: -4, scale: 0.7, color: "from-purple-500/25 to-violet-400/15", title: "Cheat Sheet", lines: 3 },
];

export function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    let raf = 0;
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseX.set(x);
        mouseY.set(y);
      });
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handler);
      cancelAnimationFrame(raf);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Animated mesh gradient blobs */}
      <div
        className="absolute -top-1/3 -left-1/3 w-[80vw] h-[80vw] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.35), rgba(34,211,238,0) 60%)",
          animation: "mesh-shift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -top-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.30), rgba(168,85,247,0) 60%)",
          animation: "mesh-shift 28s ease-in-out infinite -8s",
        }}
      />
      <div
        className="absolute -bottom-1/3 left-1/4 w-[70vw] h-[70vw] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,146,60,0.25), rgba(251,146,60,0) 60%)",
          animation: "mesh-shift 32s ease-in-out infinite -16s",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating document cards */}
      {DOCS.map((doc, i) => (
        <FloatingDoc
          key={doc.id}
          doc={doc}
          springX={springX}
          springY={springY}
          delayIdx={i}
        />
      ))}

      {/* Center magnetic field — only visible from large screens */}
      <div
        className="hidden lg:block absolute left-1/2 top-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ opacity: 0.35 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-cyan-400/30"
            style={{
              animation: `magnetic-pulse 3.5s ease-out infinite`,
              animationDelay: `${i * 0.9}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(6,8,21,0.6) 80%, rgba(6,8,21,0.95) 100%)",
        }}
      />
    </div>
  );
}

function FloatingDoc({
  doc,
  springX,
  springY,
  delayIdx,
}: {
  doc: (typeof DOCS)[number];
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
  delayIdx: number;
}) {
  const parallaxStrength = 14 + delayIdx * 3;
  const x = useTransform(springX, (v) => v * parallaxStrength);
  const y = useTransform(springY, (v) => v * parallaxStrength);

  return (
    <motion.div
      className="absolute hidden md:block"
      style={{
        left: doc.x,
        top: doc.y,
        x,
        y,
        transform: `rotate(${doc.rotate}deg) scale(${doc.scale})`,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: delayIdx * 0.15, ease: "easeOut" }}
    >
      <div
        className={`relative w-44 h-56 rounded-xl bg-gradient-to-br ${doc.color} backdrop-blur-sm border border-white/10 p-4 shadow-2xl`}
        style={{
          animation: `drift 8s ease-in-out infinite`,
          animationDelay: `${delayIdx * 0.7}s`,
        }}
      >
        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-semibold">
          {doc.title}
        </div>
        <div className="space-y-1.5">
          {Array.from({ length: doc.lines }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-white/15"
              style={{ width: `${65 + ((i * 13) % 30)}%` }}
            />
          ))}
        </div>
        <div className="absolute bottom-3 right-3 w-6 h-6 rounded-md bg-white/10" />
      </div>
    </motion.div>
  );
}
