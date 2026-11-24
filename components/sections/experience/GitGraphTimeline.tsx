"use client";

import React, { useRef, useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { GIT_EXPERIENCE_DATA, GitExperienceItem } from "./experienceGitData";
import { GitTrackSvg } from "./GitTrackSvg";
import { GitCommitCard } from "./GitCommitCard";
import { EducationFootnote } from "./EducationFootnote";

export interface GitGraphTimelineProps {
  items?: GitExperienceItem[];
  isProduction?: boolean;
  className?: string;
}

export const GitGraphTimeline: React.FC<GitGraphTimelineProps> = ({
  items = GIT_EXPERIENCE_DATA,
  isProduction = process.env.NODE_ENV === "production",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const [nodeYs, setNodeYs] = useState<number[]>([40, 260, 480, 700]);
  const [containerHeight, setContainerHeight] = useState<number>(850);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Measure dynamic card positions to align SVG nodes with cards across viewports
  useEffect(() => {
    function updatePositions() {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const measured = cardRefs.current.map((cardEl, idx) => {
        if (!cardEl) return (idx + 1) * 200;
        const cardRect = cardEl.getBoundingClientRect();
        // Offset 32px to align circle with commit hash header bar
        return Math.round(cardRect.top - containerRect.top + 32);
      });

      if (measured.length > 0) {
        setNodeYs(measured);
      }
      setContainerHeight(Math.round(containerRect.height));
    }

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, [items]);

  // Bulletproof native window scroll tracking for 60fps rover traversal
  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Rover starts when top of container reaches 85% of screen, finishes at 25%
      const start = vh * 0.85;
      const end = vh * 0.25;
      const total = rect.height + (start - end);
      const current = start - rect.top;
      const fraction = Math.min(1, Math.max(0, current / total));
      setScrollProgress(fraction);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Blueprint Layout: Left Git Graph Track + Right Commit Cards Stream */}
      <div className="relative flex items-start gap-3 sm:gap-6 md:gap-10">
        {/* Left Rail: Git Branch SVG Spine */}
        <div className="relative shrink-0 select-none">
          <GitTrackSvg
            progress={scrollProgress}
            reducedMotion={Boolean(shouldReduceMotion)}
            nodeYs={nodeYs}
            height={containerHeight}
          />
        </div>

        {/* Right Rail: Git Commit Cards Flow */}
        <div className="flex-1 min-w-0 space-y-8 sm:space-y-12">
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="relative"
            >
              <GitCommitCard
                item={item}
                isProduction={isProduction}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Academic Foundation Footnote */}
      <EducationFootnote />
    </div>
  );
};

export default GitGraphTimeline;
