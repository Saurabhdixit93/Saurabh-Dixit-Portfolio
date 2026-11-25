"use client";

import * as React from "react";
import Image from "next/image";
import { StackItem } from "@/content/types";

export type StackChipState = "idle" | "active" | "related" | "dimmed";

export interface StackChipProps {
  item: StackItem;
  state: StackChipState;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  className?: string;
}

export const StackChip = React.forwardRef<HTMLButtonElement, StackChipProps>(
  (
    {
      item,
      state,
      onSelect,
      onHover,
      onLeave,
      className = "",
    },
    ref
  ) => {
    const isActive = state === "active";
    const isRelated = state === "related";
    const isDimmed = state === "dimmed";

    // Detect white-filled SVGs requiring high-contrast background in Paper theme
    const isWhiteFilledIcon =
      item.icon === "/next.svg" ||
      item.icon === "/git.svg" ||
      item.icon === "/cloud.svg" ||
      item.name === "Cloudinary";

    // Compute state styling classes (consistent font-medium ensures zero width shifts;
    // opaque surface backing + z-30 for active/related keeps pills crisp above connector SVG)
    let stateStyles =
      "z-10 bg-surface/90 text-text border-hairline hover:border-accent/70 hover:bg-surface";
    if (isActive) {
      stateStyles =
        "z-30 bg-accent text-[var(--accent-contrast)] border-accent ring-2 ring-accent/40 shadow-[0_0_16px_rgba(255,106,43,0.45)]";
    } else if (isRelated) {
      stateStyles =
        "z-30 bg-surface text-accent border-accent ring-1 ring-accent/40 shadow-[inset_0_0_0_100px_rgba(255,106,43,0.14),0_0_12px_rgba(255,106,43,0.22)]";
    } else if (isDimmed) {
      stateStyles = "z-10 opacity-35 grayscale-[50%] border-hairline/40";
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isActive}
        aria-label={`${item.name} (${item.level || "core"})`}
        data-tech-name={item.name}
        data-category={item.category}
        onClick={onSelect}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
        className={`relative inline-flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto min-h-[42px] sm:min-h-0 px-2.5 py-2 sm:px-3 sm:py-1.5 rounded-sm border font-mono text-[11px] sm:text-xs font-medium text-left transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent select-none ${stateStyles} ${className}`}
      >
        <span className="pointer-events-none flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
          {/* Tech Icon or Monogram */}
          {item.icon ? (
            <span
              className={`pointer-events-none shrink-0 inline-flex items-center justify-center ${
                isWhiteFilledIcon
                  ? "w-4 h-4 rounded-xs bg-[#0B0D10] p-0.5 border border-white/20"
                  : "w-4 h-4"
              }`}
            >
              <Image
                src={item.icon}
                alt=""
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain pointer-events-none"
                unoptimized
              />
            </span>
          ) : (
            <span
              className={`pointer-events-none shrink-0 font-mono text-[10px] px-1 py-0.2 rounded-xs border ${
                isActive
                  ? "border-[var(--accent-contrast)]/30 text-[var(--accent-contrast)]"
                  : "border-hairline text-accent"
              }`}
            >
              λ
            </span>
          )}

          {/* Technology Name */}
          <span className="pointer-events-none leading-tight sm:leading-normal break-words sm:truncate">
            {item.name}
          </span>
        </span>

        {/* Level Indicator Pill */}
        <span
          className={`pointer-events-none w-1.5 h-1.5 rounded-full shrink-0 ${
            isActive
              ? "bg-[var(--accent-contrast)] shadow-[0_0_4px_rgba(0,0,0,0.5)]"
              : item.level === "core"
              ? "bg-accent shadow-[0_0_4px_rgba(255,106,43,0.6)]"
              : "bg-muted/60"
          }`}
          title={`Proficiency: ${item.level || "core"}`}
          aria-hidden="true"
        />
      </button>
    );
  }
);

StackChip.displayName = "StackChip";

export default StackChip;
