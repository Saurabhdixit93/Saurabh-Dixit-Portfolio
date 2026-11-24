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

    // Compute state styling classes
    let stateStyles =
      "bg-surface/80 text-text border-hairline hover:border-accent/60 hover:bg-surface";
    if (isActive) {
      stateStyles =
        "bg-accent text-accent-contrast border-accent ring-2 ring-accent/40 shadow-[0_0_16px_rgba(255,106,43,0.45)] scale-[1.03] z-20 font-semibold";
    } else if (isRelated) {
      stateStyles =
        "bg-accent/15 text-accent border-accent/80 ring-1 ring-accent/30 shadow-[0_0_10px_rgba(255,106,43,0.2)] z-10 font-semibold";
    } else if (isDimmed) {
      stateStyles = "opacity-35 grayscale-[50%] border-hairline/40";
    }

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isActive}
        aria-label={`${item.name} (${item.level || "core"})`}
        data-tech-name={item.name}
        data-category={item.category}
        onClick={onSelect}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border font-mono text-xs transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent select-none ${stateStyles} ${className}`}
      >
        {/* Tech Icon or Monogram */}
        {item.icon ? (
          <span
            className={`shrink-0 inline-flex items-center justify-center ${
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
              className="w-3.5 h-3.5 object-contain"
              unoptimized
            />
          </span>
        ) : (
          <span
            className={`font-mono text-[10px] px-1 py-0.2 rounded-xs border ${
              isActive
                ? "border-accent-contrast/30 text-accent-contrast"
                : "border-hairline text-accent"
            }`}
          >
            λ
          </span>
        )}

        {/* Technology Name */}
        <span className="truncate">{item.name}</span>

        {/* Level Indicator Pill */}
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isActive
              ? "bg-accent-contrast shadow-[0_0_4px_rgba(0,0,0,0.5)]"
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
