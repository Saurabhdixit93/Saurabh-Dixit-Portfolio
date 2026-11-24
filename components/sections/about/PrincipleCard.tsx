"use client";

import * as React from "react";
import { Principle } from "@/content/types";

export interface PrincipleCardProps {
  principle: Principle;
  index: number;
  className?: string;
}

export const PrincipleCard: React.FC<PrincipleCardProps> = ({
  principle,
  index,
  className = "",
}) => {
  return (
    <article
      className={`group relative border border-hairline bg-surface/50 hover:bg-surface/80 hover:border-accent/50 transition-all duration-200 p-5 sm:p-6 corner-marks ${className}`}
    >
      {/* Corner Registration Marks */}
      <span className="corner-mark corner-mark-tl" aria-hidden="true" />
      <span className="corner-mark corner-mark-tr" aria-hidden="true" />
      <span className="corner-mark corner-mark-bl" aria-hidden="true" />
      <span className="corner-mark corner-mark-br" aria-hidden="true" />

      {/* Header with Mono Number & Title */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-semibold px-2 py-0.5 border border-accent/30 bg-accent/5 rounded-sm">
              {principle.number}
            </span>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              OPERATING PRINCIPLE
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-normal text-text pt-1 group-hover:text-accent transition-colors duration-200">
            {principle.title}
          </h3>
        </div>
      </div>

      {/* Italicized Summary */}
      <p className="font-sans text-xs sm:text-sm text-text/90 italic leading-relaxed mb-3">
        &ldquo;{principle.summary}&rdquo;
      </p>

      {/* Full Architectural Rationale */}
      <p className="font-sans text-xs text-muted leading-relaxed pt-3 border-t border-hairline/60">
        {principle.description}
      </p>
    </article>
  );
};

export default PrincipleCard;
