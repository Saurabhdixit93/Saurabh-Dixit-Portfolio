import * as React from "react";

export interface SignalItem {
  id: string;
  type: "metric" | "tech";
  text: string;
  highlight?: boolean;
}

/**
 * Curated list of live verified signals:
 * Alternates proven production metrics from content/metrics.ts
 * with core technologies from content/stack.ts.
 */
export const SIGNAL_ITEMS: SignalItem[] = [
  {
    id: "vp-eng",
    type: "metric",
    text: "VP of Engineering @ Sensegrass",
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
    text: "Next.js & React",
  },
  {
    id: "ai-scale",
    type: "metric",
    text: "3× AI Usage Scale",
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
    text: "3+ Yrs Production Experience",
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
 * Slow infinite marquee running directly below the Hero section:
 * - Edge-to-edge full bleed with hairline border and surface backdrop blur.
 * - Hardware-accelerated CSS keyframe transform loop.
 * - Pauses on hover and focus-within.
 * - Dual track with aria-hidden="true" on the clone.
 * - Converts to a clean static wrapping flex container under prefers-reduced-motion.
 */
export const SignalStrip: React.FC<SignalStripProps> = ({
  className = "",
  items = SIGNAL_ITEMS,
}) => {
  return (
    <div
      className={`signal-marquee-container relative w-full overflow-hidden border-b border-hairline bg-surface/60 backdrop-blur-sm py-3.5 select-none ${className}`}
      role="region"
      aria-label="Live signals, verified engineering metrics, and core technologies"
    >
      <style>{`
        @keyframes signalMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .signal-marquee-track {
          animation: signalMarquee 38s linear infinite;
        }
        .signal-marquee-container:hover .signal-marquee-track,
        .signal-marquee-container:focus-within .signal-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .signal-marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Left/Right Edge Fade Gradients */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-bg to-transparent z-10 motion-reduce:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-bg to-transparent z-10 motion-reduce:hidden"
        aria-hidden="true"
      />

      {/* Marquee Track Container */}
      <div className="signal-marquee-track flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2 motion-reduce:px-4">
        {/* Track 1: Primary (Announced to accessibility tree) */}
        <div className="flex items-center shrink-0 space-x-6 sm:space-x-8 pr-6 sm:pr-8 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-4 motion-reduce:pr-0">
          {items.map((item) => (
            <React.Fragment key={`primary-${item.id}`}>
              <div className="flex items-center space-x-2 font-mono text-xs sm:text-[13px] tracking-wide whitespace-nowrap">
                {item.highlight && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={
                    item.highlight
                      ? "text-text font-medium"
                      : "text-muted hover:text-text transition-colors"
                  }
                >
                  {item.text}
                </span>
              </div>
              <span
                className="text-muted/30 font-mono text-xs select-none motion-reduce:last:hidden"
                aria-hidden="true"
              >
                //
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Track 2: Clone for seamless looping (Hidden from screen readers and reduced-motion) */}
        <div
          className="flex items-center shrink-0 space-x-6 sm:space-x-8 pr-6 sm:pr-8 motion-reduce:hidden"
          aria-hidden="true"
        >
          {items.map((item) => (
            <React.Fragment key={`clone-${item.id}`}>
              <div className="flex items-center space-x-2 font-mono text-xs sm:text-[13px] tracking-wide whitespace-nowrap">
                {item.highlight && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={
                    item.highlight
                      ? "text-text font-medium"
                      : "text-muted hover:text-text transition-colors"
                  }
                >
                  {item.text}
                </span>
              </div>
              <span
                className="text-muted/30 font-mono text-xs select-none"
                aria-hidden="true"
              >
                //
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignalStrip;
