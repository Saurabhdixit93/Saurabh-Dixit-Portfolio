"use client";

import * as React from "react";
import { ProcessPhase } from "@/content/types";

export interface ProcessCardProps {
  phase: ProcessPhase;
  index: number;
  total?: number;
  className?: string;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({
  phase,
  index,
  total = 4,
  className = "",
}) => {
  const sequence = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <article
      tabIndex={0}
      role="article"
      aria-label={`Phase ${phase.phase}: ${phase.title} (${sequence})`}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 bg-surface/90 backdrop-blur-md border border-hairline transition-all duration-200 hover:border-accent/60 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-sm ${className}`}
    >
      {/* Corner registration mark */}
      <div
        className="absolute top-0 right-0 p-2 font-mono text-[10px] text-muted/60 pointer-events-none select-none"
        aria-hidden="true"
      >
        +
      </div>

      <div className="space-y-4">
        {/* Header with Phase Code, Sequence & Timeframe */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-accent tracking-wider">
              {phase.code}
            </span>
            <span className="font-mono text-[11px] text-muted">
              · {sequence}
            </span>
          </div>

          {phase.timeframe && (
            <span
              className="font-mono text-[10px] text-accent/90 bg-accent/10 border border-accent/20 px-2 py-0.5 rounded inline-flex items-center"
              title="Estimated timeframe"
            >
              {phase.timeframe}
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="font-display text-xl text-text group-hover:text-accent transition-colors">
            {phase.title}
          </h3>
          <p className="font-mono text-xs text-muted mt-1">
            {phase.subtitle}
          </p>
        </div>

        {/* 1-Line Delivery Promise */}
        {phase.promise && (
          <div className="p-3 bg-bg/80 border border-hairline/80 rounded-sm">
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent block mb-1">
              // DELIVERY PROMISE
            </span>
            <p className="text-xs text-text/90 italic leading-relaxed">
              &ldquo;{phase.promise}&rdquo;
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-muted leading-relaxed">
          {phase.description}
        </p>
      </div>

      {/* Deliverables List */}
      <div className="mt-6 pt-4 border-t border-hairline/60">
        <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2.5">
          // KEY DELIVERABLES
        </span>
        <ul className="space-y-2" role="list">
          {phase.deliverables.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs text-text/80"
            >
              <span
                className="text-accent font-mono text-[11px] leading-tight shrink-0 select-none"
                aria-hidden="true"
              >
                ▪
              </span>
              <span className="leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default ProcessCard;
