"use client";

import * as React from "react";
import { X, Activity } from "lucide-react";

export interface StackTelemetryProps {
  activeTech: string | null;
  relatedTechs: string[];
  onClear: () => void;
  className?: string;
}

export const StackTelemetry: React.FC<StackTelemetryProps> = ({
  activeTech,
  relatedTechs,
  onClear,
  className = "",
}) => {
  // Screen reader announcement text
  const announcementText = activeTech
    ? `Inspecting ${activeTech}. Connected to ${relatedTechs.length} technologies: ${relatedTechs.join(
        ", ",
      )}.`
    : "No technology selected. Ready for system relationship inspection.";

  return (
    <div
      className={`border border-hairline bg-surface/90 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-0 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-mono min-h-[48px] sm:h-[52px] sm:min-h-[52px] sm:max-h-[52px] box-border shadow-sm sm:overflow-hidden ${className}`}
    >
      {/* Invisible Screen Reader Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcementText}
      </div>

      {activeTech ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:overflow-x-auto no-scrollbar py-0 sm:h-full w-full min-w-0">
            <div className="flex items-center justify-between gap-2 shrink-0">
              <div className="inline-flex items-center gap-1.5 text-accent font-semibold shrink-0 max-w-full">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping shrink-0" />
                <span className="truncate">[INSPECTING: {activeTech}]</span>
              </div>

              {/* Mobile Clear Button inline on header row */}
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear active technology inspection"
                className="sm:hidden inline-flex items-center gap-1 px-2 py-1 rounded-sm border border-hairline bg-surface hover:border-accent hover:text-accent text-muted text-[11px] font-mono shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X className="w-3 h-3" />
                <span>CLEAR</span>
              </button>
            </div>

            <span className="text-muted shrink-0 hidden sm:inline">➔</span>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 min-w-0">
              <span className="text-muted shrink-0 text-[10px] sm:text-[11px]">
                CONNECTED ({relatedTechs.length}):
              </span>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
                {relatedTechs.map((name) => (
                  <span
                    key={name}
                    className="px-1.5 py-0.5 rounded-xs border border-accent/40 bg-accent/10 text-accent font-mono text-[10px] sm:text-[11px] whitespace-nowrap leading-tight"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Clear Button */}
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear active technology inspection"
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-sm border border-hairline bg-surface hover:border-accent hover:text-accent text-muted text-[11px] font-mono shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X className="w-3 h-3" />
            <span>CLEAR [ESC]</span>
          </button>
        </>
      ) : (
        <div className="flex items-start sm:items-center gap-2 text-muted sm:truncate sm:h-full">
          <Activity className="w-3.5 h-3.5 text-accent animate-pulse shrink-0 mt-0.5 sm:mt-0" />
          <span className="whitespace-normal sm:truncate leading-relaxed sm:leading-normal text-[11px] sm:text-xs">
            // ARCHITECTURAL TELEMETRY: TAP OR HOVER ANY NODE TO TRACE CROSS-TIER SYSTEM RELATIONSHIPS
          </span>
        </div>
      )}
    </div>
  );
};

export default StackTelemetry;
