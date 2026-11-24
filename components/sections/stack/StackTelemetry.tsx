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
      className={`border border-hairline bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-none flex items-center justify-between gap-3 text-xs font-mono min-h-[54px] shadow-sm ${className}`}
    >
      {/* Invisible Screen Reader Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcementText}
      </div>

      {activeTech ? (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="inline-flex items-center gap-1.5 text-accent font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>[INSPECTING: {activeTech}]</span>
          </div>

          <span className="text-muted shrink-0">➔</span>

          <span className="text-muted shrink-0 text-[11px]">
            CONNECTED ({relatedTechs.length}):
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {relatedTechs.map((name) => (
              <span
                key={name}
                className="px-1.5 py-0.5 rounded-xs border border-accent/40 bg-accent/10 text-accent font-mono text-[11px] whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted truncate">
          <Activity className="w-3.5 h-3.5 text-accent animate-pulse shrink-0" />
          <span className="truncate">
            // ARCHITECTURAL TELEMETRY: HOVER OR FOCUS ANY NODE TO TRACE
            CROSS-TIER SYSTEM RELATIONSHIPS
          </span>
        </div>
      )}

      {/* Clear Button (Always accessible when active) */}
      {activeTech && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear active technology inspection"
          className="inline-flex items-center gap-1 px-2 py-1 rounded-sm border border-hairline bg-surface hover:border-accent hover:text-accent text-muted text-[11px] font-mono shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X className="w-3 h-3" />
          <span className="hidden sm:inline">CLEAR [ESC]</span>
          <span className="sm:hidden">CLEAR</span>
        </button>
      )}
    </div>
  );
};

export default StackTelemetry;
