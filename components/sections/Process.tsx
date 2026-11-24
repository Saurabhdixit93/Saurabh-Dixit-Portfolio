"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import { processPhases, processContent } from "@/content/process";
import ProcessCard from "@/components/sections/process/ProcessCard";

export interface ProcessProps {
  id?: string;
  className?: string;
}

export const Process: React.FC<ProcessProps> = ({
  id = "process",
  className = "",
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Section
      id={id}
      annotation={processContent.annotation}
      heading={
        <>
          {processContent.heading} ·{" "}
          <span className="italic text-accent">Lifecycle</span>
        </>
      }
      subheading={processContent.subheading}
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      {/* Top Architecture Telemetry Pipeline & Desktop Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline/60">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="font-mono text-[10px] text-accent tracking-wider uppercase shrink-0">
            PIPELINE //
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted shrink-0">
            <span className="text-text font-medium">01 DISCOVER</span>
            <span className="text-hairline">→</span>
            <span className="text-text font-medium">02 ARCHITECT</span>
            <span className="text-hairline">→</span>
            <span className="text-text font-medium">03 BUILD</span>
            <span className="text-hairline">→</span>
            <span className="text-text font-medium">04 SHIP</span>
          </div>
        </div>

        {/* Desktop Rail Scroll Controls */}
        <div className="hidden lg:flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll to previous phase"
            className="p-1.5 font-mono text-xs border border-hairline bg-surface/50 text-text hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← PREV
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll to next phase"
            className="p-1.5 font-mono text-xs border border-hairline bg-surface/50 text-text hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            NEXT →
          </button>
        </div>
      </div>

      {/* Process Cards Rail: Mobile Stacked Deck + Desktop Horizontal Snap Rail */}
      <div
        ref={scrollContainerRef}
        role="region"
        aria-label="Engineering Delivery Lifecycle Phases"
        tabIndex={0}
        className="flex flex-col lg:flex-row lg:overflow-x-auto snap-none lg:snap-x lg:snap-mandatory gap-6 pt-6 pb-2 scrollbar-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        {processPhases.map((phase, index) => (
          <div
            key={phase.code}
            className="w-full lg:w-[calc(25%-18px)] lg:min-w-[280px] lg:shrink-0 lg:snap-start flex flex-col"
          >
            <ProcessCard
              phase={phase}
              index={index}
              total={processPhases.length}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Process;
