"use client";

import * as React from "react";
import { StackCategory, StackItem } from "@/content/types";
import { StackChip, StackChipState } from "./StackChip";

export interface StackTierRowProps {
  category: StackCategory;
  tierNumber: number;
  activeTech: string | null;
  relatedTechs: string[];
  onSelectTech: (name: string) => void;
  onHoverTech: (name: string) => void;
  onLeaveTech: () => void;
  registerChipRef?: (techKey: string, el: HTMLButtonElement | null) => void;
  className?: string;
}

export const StackTierRow: React.FC<StackTierRowProps> = ({
  category,
  tierNumber,
  activeTech,
  relatedTechs,
  onSelectTech,
  onHoverTech,
  onLeaveTech,
  registerChipRef,
  className = "",
}) => {
  const tierBadge = `TIER 0${tierNumber}`;

  return (
    <div
      className={`relative border border-hairline bg-surface/35 hover:bg-surface/50 transition-colors duration-200 p-4 sm:p-5 corner-marks ${className}`}
    >
      {/* Corner Registration Marks */}
      <span className="corner-mark corner-mark-tl" aria-hidden="true" />
      <span className="corner-mark corner-mark-tr" aria-hidden="true" />
      <span className="corner-mark corner-mark-bl" aria-hidden="true" />
      <span className="corner-mark corner-mark-br" aria-hidden="true" />

      {/* Tier Header Line */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-3 border-b border-hairline/60">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-accent font-semibold px-2 py-0.5 border border-accent/30 bg-accent/5 rounded-sm">
            {tierBadge}
          </span>
          <h3 className="font-mono text-xs sm:text-sm font-semibold tracking-wide text-text uppercase">
            {category.name}
          </h3>
        </div>

        <p className="font-sans text-xs text-muted max-w-xl">
          {category.description}
        </p>
      </div>

      {/* Chips Cloud / Tier Flow */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {category.items.map((item: StackItem) => {
          // Determine chip state
          let chipState: StackChipState = "idle";
          if (activeTech) {
            if (activeTech === item.name) {
              chipState = "active";
            } else if (relatedTechs.includes(item.name)) {
              chipState = "related";
            } else {
              chipState = "dimmed";
            }
          }

          const chipKey = `${category.id}:${item.name}`;

          return (
            <StackChip
              key={chipKey}
              ref={(el) => {
                if (registerChipRef) {
                  registerChipRef(chipKey, el);
                }
              }}
              item={item}
              state={chipState}
              onSelect={() => onSelectTech(item.name)}
              onHover={() => onHoverTech(item.name)}
              onLeave={onLeaveTech}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StackTierRow;
