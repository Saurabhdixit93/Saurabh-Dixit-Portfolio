"use client";

import * as React from "react";
import { motion } from "framer-motion";

export interface SignalItem {
  id: string;
  type: "metric" | "tech";
  text: string;
  highlight?: boolean;
}

export const SIGNAL_ITEMS: SignalItem[] = [
  {
    id: "vp-eng",
    type: "metric",
    text: "VP of Engineering · Sensegrass",
    highlight: true,
  },
  {
    id: "del-vel",
    type: "metric",
    text: "+35% Delivery Velocity",
    highlight: true,
  },
  {
    id: "tech-next",
    type: "tech",
    text: "Next.js 15 & React 19",
  },
  {
    id: "ai-scale",
    type: "metric",
    text: "3× AI Workload Scale",
    highlight: true,
  },
  {
    id: "tech-ts",
    type: "tech",
    text: "TypeScript & Node.js",
  },
  {
    id: "inc-red",
    type: "metric",
    text: "-45% Recurring Incidents",
    highlight: true,
  },
  {
    id: "tech-py",
    type: "tech",
    text: "Python & FastAPI",
  },
  {
    id: "api-thr",
    type: "metric",
    text: "+30% API Throughput",
    highlight: true,
  },
  {
    id: "tech-db",
    type: "tech",
    text: "PostgreSQL & Redis",
  },
  {
    id: "tech-rag",
    type: "tech",
    text: "LLM Orchestration & RAG",
    highlight: true,
  },
  {
    id: "exp-yrs",
    type: "metric",
    text: "3+ Yrs Production Systems",
    highlight: true,
  },
  {
    id: "tech-dock",
    type: "tech",
    text: "Docker & Cloud Infrastructure",
  },
];

export interface SignalStripProps {
  className?: string;
  items?: SignalItem[];
}

/**
 * SignalStrip
 * High-tech infinite marquee telemetry strip running below the Hero section:
 * - Powered by Framer Motion Web Animations API for 100% reliable 60fps continuous looping.
 * - Precision pill-badge capsules with hairline borders and backdrop-blur.
 * - Dual track with aria-hidden="true" on the clone for gapless seamless looping.
 */
export const SignalStrip: React.FC<SignalStripProps> = ({
  className = "",
  items = SIGNAL_ITEMS,
}) => {
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-hairline bg-surface/50 backdrop-blur-md py-3 select-none ${className}`}
      role="region"
      aria-label="Live signals, verified engineering metrics, and core technologies"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Blueprint Left Edge Fade Gradient */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-bg via-bg/80 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Blueprint Right Edge Fade Gradient */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-bg via-bg/80 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Marquee Track Container (Framer Motion 60fps Infinite Loop) */}
      <motion.div
        className="flex w-max"
        animate={
          isPaused
            ? undefined
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 28,
            ease: "linear",
          },
        }}
      >
        {/* Track 1: Primary */}
        <div className="flex items-center shrink-0 space-x-3 sm:space-x-4 pr-3 sm:pr-4">
          {items.map((item) => (
            <div
              key={`primary-${item.id}`}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wide whitespace-nowrap transition-colors duration-150 ${
                item.highlight
                  ? "bg-surface/90 border-accent/40 text-text shadow-[0_0_12px_rgba(255,106,43,0.15)] hover:border-accent"
                  : "bg-surface/70 border-hairline text-muted hover:text-text hover:border-hairline/80"
              }`}
            >
              {item.highlight ? (
                <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent shadow-[0_0_6px_var(--accent)]" />
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-accent2/60 shrink-0" />
              )}
              <span className={item.highlight ? "font-semibold text-text" : "font-normal"}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Track 2: Clone for seamless infinite loop */}
        <div
          className="flex items-center shrink-0 space-x-3 sm:space-x-4 pr-3 sm:pr-4"
          aria-hidden="true"
        >
          {items.map((item) => (
            <div
              key={`clone-${item.id}`}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wide whitespace-nowrap transition-colors duration-150 ${
                item.highlight
                  ? "bg-surface/90 border-accent/40 text-text shadow-[0_0_12px_rgba(255,106,43,0.15)] hover:border-accent"
                  : "bg-surface/70 border-hairline text-muted hover:text-text hover:border-hairline/80"
              }`}
            >
              {item.highlight ? (
                <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent shadow-[0_0_6px_var(--accent)]" />
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-accent2/60 shrink-0" />
              )}
              <span className={item.highlight ? "font-semibold text-text" : "font-normal"}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SignalStrip;
