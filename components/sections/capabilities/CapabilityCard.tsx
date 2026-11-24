"use client";

import * as React from "react";
import { Capability } from "@/content/types";
import { Tag } from "@/components/primitives/Tag";
import { ChevronDown } from "lucide-react";

export interface CapabilityCardProps {
  capability: Capability;
  index: number;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const CapabilityCard: React.FC<CapabilityCardProps> = ({
  capability,
  index,
  isOpen = false,
  onToggle,
  className = "",
}) => {
  const pillarNumber = String(index + 1).padStart(2, "0");
  const panelId = `capability-panel-${capability.id}`;
  const triggerId = `capability-trigger-${capability.id}`;

  return (
    <article
      className={`group relative border border-hairline bg-surface/60 hover:bg-surface/90 hover:border-accent/60 transition-colors duration-200 p-5 sm:p-7 corner-marks rounded-none flex flex-col justify-between ${className}`}
    >
      {/* Blueprint Corner Registration Marks */}
      <span className="corner-mark corner-mark-tl" aria-hidden="true" />
      <span className="corner-mark corner-mark-tr" aria-hidden="true" />
      <span className="corner-mark corner-mark-bl" aria-hidden="true" />
      <span className="corner-mark corner-mark-br" aria-hidden="true" />

      <div>
        {/* Header Bar: Mono Number & Eyebrow */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-hairline/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-semibold px-2 py-0.5 border border-accent/30 bg-accent/5 rounded-sm">
              {pillarNumber}
            </span>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              PILLAR {pillarNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted hidden sm:inline-block">
              {capability.skills.length} COMPETENCIES · {capability.tools.length} TOOLS
            </span>

            {/* Mobile Accordion Toggle Button (>= 48px tap target) */}
            <button
              id={triggerId}
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={`Toggle ${capability.title} details`}
              className="md:hidden flex items-center justify-center w-12 h-12 -mr-2 text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent cursor-pointer"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl sm:text-3xl font-normal text-text mb-3 group-hover:text-accent transition-colors duration-200">
          {capability.title}
        </h3>

        {/* High-level Description */}
        <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed mb-4">
          {capability.description}
        </p>
      </div>

      {/* Expandable Tray (Desktop: hover or focus-within; Mobile: isOpen toggle) */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid transition-[grid-template-rows] duration-250 ease-out ${
          isOpen
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-4 mt-2 border-t border-hairline space-y-4">
            {/* Sub-skills / Key Competencies */}
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                <span>Key Competencies</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {capability.skills.map((skill) => (
                  <Tag
                    key={skill}
                    variant="outline"
                    size="sm"
                    className="bg-surface/40 hover:border-accent/40 text-text/90"
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Tools & Platforms */}
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent2/60" />
                <span>Tools & Platforms</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {capability.tools.map((tool) => (
                  <Tag
                    key={tool}
                    variant="default"
                    size="sm"
                    className="border-hairline hover:border-accent2/50 text-text"
                  >
                    {tool}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop expand hint bar */}
      <div className="hidden md:flex items-center justify-between pt-3 mt-2 border-t border-hairline/40 text-[10px] font-mono text-muted group-hover:text-accent transition-colors duration-200">
        <span>// EXPAND TO INSPECT CAPABILITY MATRIX</span>
        <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-200" />
      </div>
    </article>
  );
};

export default CapabilityCard;
