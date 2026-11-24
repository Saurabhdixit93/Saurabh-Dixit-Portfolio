"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import { stackCategories } from "@/content/stack";
import { StackTierRow } from "./stack/StackTierRow";
import { StackTelemetry } from "./stack/StackTelemetry";
import { StackConnectorSvg } from "./stack/StackConnectorSvg";
import { getRelatedTechnologies } from "./stack/stackRelations";

export interface StackMapProps {
  id?: string;
  className?: string;
}

export const StackMap: React.FC<StackMapProps> = ({
  id = "stack",
  className = "",
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Active inspected technology (hovered or pinned)
  const [activeTech, setActiveTech] = React.useState<string | null>(null);
  const [isPinned, setIsPinned] = React.useState(false);
  const leaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Registered chip DOM nodes for dynamic SVG lines calculation
  const chipElementsRef = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const registerChipRef = React.useCallback(
    (key: string, el: HTMLButtonElement | null) => {
      if (el) {
        chipElementsRef.current.set(key, el);
      } else {
        chipElementsRef.current.delete(key);
      }
    },
    []
  );

  // Derive related technologies for currently active node
  const relatedTechs = React.useMemo(() => {
    if (!activeTech) return [];
    return getRelatedTechnologies(activeTech);
  }, [activeTech]);

  // Clean up any pending timer on unmount
  React.useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  // Interaction handlers
  const handleSelectTech = (name: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (activeTech === name && isPinned) {
      // Toggle off if clicking the already pinned tech
      setActiveTech(null);
      setIsPinned(false);
    } else {
      setActiveTech(name);
      setIsPinned(true);
    }
  };

  const handleHoverTech = (name: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (!isPinned) {
      setActiveTech(name);
    }
  };

  const handleLeaveTech = () => {
    if (!isPinned) {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
      leaveTimerRef.current = setTimeout(() => {
        setActiveTech(null);
      }, 60);
    }
  };

  const handleClear = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveTech(null);
    setIsPinned(false);
  };

  // Keyboard navigation: Escape key clears active inspection
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeTech) {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTech]);

  // Order categories logically: AI -> Frontend -> Backend -> Data -> DevOps
  const orderedCategories = React.useMemo(() => {
    const order = ["ai-llm", "frontend", "backend", "data", "devops-infra"];
    return [...stackCategories].sort(
      (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
    );
  }, []);

  return (
    <Section
      id={id}
      annotation="// 03 · SYSTEMS ARCHITECTURE & STACK"
      heading={
        <>
          The Layered <span className="italic text-accent">Architecture</span>.
        </>
      }
      subheading="An interconnected map of production tools across 5 architectural tiers. Select or hover any node to inspect system relationships."
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      <div className="space-y-6 pt-2">
        {/* Real-time Telemetry Readout Bar */}
        <StackTelemetry
          activeTech={activeTech}
          relatedTechs={relatedTechs}
          onClear={handleClear}
        />

        {/* 5-Tier Interactive Diagram Container */}
        <div
          ref={containerRef}
          className="relative space-y-4"
        >
          {/* Dynamic SVG Bézier Overlay (Desktop) */}
          <StackConnectorSvg
            containerRef={containerRef}
            chipElements={chipElementsRef.current}
            activeTech={activeTech}
            relatedTechs={relatedTechs}
          />

          {/* 5 Layered Rows */}
          {orderedCategories.map((category, index) => (
            <StackTierRow
              key={category.id}
              category={category}
              tierNumber={index + 1}
              activeTech={activeTech}
              relatedTechs={relatedTechs}
              onSelectTech={handleSelectTech}
              onHoverTech={handleHoverTech}
              onLeaveTech={handleLeaveTech}
              registerChipRef={registerChipRef}
            />
          ))}
        </div>

        {/* Architectural Legend & Helper Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-hairline/60 text-[11px] font-mono text-muted">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_4px_rgba(255,106,43,0.6)]" />
              <span>Core Production Standard</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted/60" />
              <span>Proficient / Enterprise Tool</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t border-dashed border-accent" />
              <span>Cross-Tier Adjacency</span>
            </span>
          </div>

          <div className="text-muted/80">
            // TAB OR CLICK TO PIN · ESC TO RESET
          </div>
        </div>
      </div>
    </Section>
  );
};

export default StackMap;
