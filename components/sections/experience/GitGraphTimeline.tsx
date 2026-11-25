"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import { GIT_EXPERIENCE_DATA, GitExperienceItem } from "./experienceGitData";
import { GitTrackSvg } from "./GitTrackSvg";
import { GitCommitCard } from "./GitCommitCard";
import { EducationFootnote } from "./EducationFootnote";

export interface GitGraphTimelineProps {
  items?: GitExperienceItem[];
  isProduction?: boolean;
  className?: string;
}

interface StickyCommitDeckCardProps {
  item: GitExperienceItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isProduction: boolean;
  shouldReduceMotion: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}

const StickyCommitDeckCard: React.FC<StickyCommitDeckCardProps> = ({
  item,
  index,
  total,
  progress,
  isProduction,
  shouldReduceMotion,
  cardRef,
}) => {
  // Each card scales down slightly as subsequent cards scroll up to cover it
  const stepStart = index / total;
  const stepEnd = Math.min(1, (index + 1) / total);
  const targetScale = shouldReduceMotion || index === total - 1 ? 1 : 1 - (total - 1 - index) * 0.025;
  const scale = useTransform(progress, [stepStart, stepEnd], [1, targetScale]);

  const topOffset = 88 + index * 14;

  return (
    <div
      ref={cardRef}
      className="sticky will-change-transform"
      style={{
        top: `${topOffset}px`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { scale }}
        className="origin-top transition-shadow duration-200"
      >
        <GitCommitCard item={item} isProduction={isProduction} />
      </motion.div>
    </div>
  );
};

export const GitGraphTimeline: React.FC<GitGraphTimelineProps> = ({
  items = GIT_EXPERIENCE_DATA,
  isProduction = process.env.NODE_ENV === "production",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotionPref = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR vs client hydration mismatch (#418) when OS prefers-reduced-motion differs
  const shouldReduceMotion = mounted ? Boolean(reducedMotionPref) : false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 85%"],
  });

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const computeNaturalDocTop = useCallback((index: number): number | null => {
    const deck = deckRef.current;
    if (!deck || typeof window === "undefined") return null;
    const deckTopInDoc = deck.getBoundingClientRect().top + window.scrollY;
    let naturalOffset = 0;
    for (let i = 0; i < index; i++) {
      const el = cardRefs.current[i];
      const nextEl = cardRefs.current[i + 1];
      const elHeight = el ? el.offsetHeight : 0;
      const margin = nextEl
        ? parseFloat(window.getComputedStyle(nextEl).marginTop || "0")
        : 0;
      naturalOffset += elHeight + (Number.isFinite(margin) ? margin : 0);
    }
    return deckTopInDoc + naturalOffset;
  }, []);

  useEffect(() => {
    const updateActiveFromScroll = (latest: number) => {
      setScrollProgress(latest);
      if (typeof window === "undefined") return;
      let current = 0;
      for (let i = 0; i < items.length; i++) {
        const naturalTop = computeNaturalDocTop(i);
        const topOffset = 88 + i * 14;
        if (naturalTop !== null && window.scrollY + topOffset + 48 >= naturalTop) {
          current = i;
        }
      }
      setActiveIndex(current);
    };

    const unsubscribe = scrollYProgress.on("change", updateActiveFromScroll);
    return () => unsubscribe();
  }, [scrollYProgress, items.length, computeNaturalDocTop]);

  // Fixed proportional nodeYs for the sticky left Git Track SVG so all 4 commits
  // stay visible in the sticky left rail as the rover drives from node 0 -> 3.
  const stickyNodeYs = [44, 164, 284, 404];
  const nodePositions = [
    { x: 60, y: stickyNodeYs[0] },
    { x: 60, y: stickyNodeYs[1] },
    { x: 60, y: stickyNodeYs[2] },
    { x: 24, y: stickyNodeYs[3] },
  ];

  const handleNodeClick = useCallback(
    (index: number) => {
      const naturalTop = computeNaturalDocTop(index);
      const topOffset = 88 + index * 14;
      if (naturalTop !== null && typeof window !== "undefined") {
        window.scrollTo({
          top: Math.max(0, naturalTop - topOffset),
          behavior: "smooth",
        });
        setActiveIndex(index);
        return;
      }
      const card = cardRefs.current[index];
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [computeNaturalDocTop]
  );

  const renderNodeButtons = () =>
    items.slice(0, 4).map((item, idx) => {
      const pos = nodePositions[idx];
      if (!pos) return null;
      const isActive = activeIndex === idx;
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => handleNodeClick(idx)}
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          className={`group/dot absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-transform duration-150 hover:scale-110 ${
            isActive ? "scale-105" : ""
          }`}
          aria-label={`Jump to ${item.role} at ${item.company}`}
          aria-pressed={isActive}
          title={`${item.role} · ${item.company}`}
        >
          <span
            className={`w-6 h-6 rounded-full border transition-all duration-200 ${
              isActive
                ? idx === 0
                  ? "border-emerald-400/80 bg-emerald-400/10 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
                  : idx === 3
                  ? "border-accent2/80 bg-accent2/10 shadow-[0_0_10px_rgba(77,225,193,0.4)]"
                  : "border-accent/80 bg-accent/10 shadow-[0_0_10px_rgba(255,106,43,0.4)]"
                : "border-transparent group-hover/dot:border-accent/70 group-hover/dot:bg-accent/10"
            }`}
            aria-hidden="true"
          />
        </button>
      );
    });

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Blueprint Layout: Sticky Left Git Graph Track + Cover-by-Cover Sticky Commit Cards */}
      <div className="relative flex items-start gap-3 sm:gap-6 md:gap-10">
        {/* Left Rail: Sticky Git Branch SVG Spine */}
        <div className="sticky top-24 shrink-0 select-none self-start hidden sm:block">
          <div className="relative">
            <GitTrackSvg
              progress={scrollProgress}
              reducedMotion={shouldReduceMotion}
              nodeYs={stickyNodeYs}
              height={460}
              activeIndex={activeIndex}
            />
            {renderNodeButtons()}
          </div>
        </div>

        {/* Mobile Left Rail: Compact Sticky Git Track */}
        <div className="sticky top-24 shrink-0 select-none self-start block sm:hidden">
          <div className="relative">
            <GitTrackSvg
              progress={scrollProgress}
              reducedMotion={shouldReduceMotion}
              nodeYs={stickyNodeYs}
              height={460}
              activeIndex={activeIndex}
            />
            {renderNodeButtons()}
          </div>
        </div>

        {/* Right Rail: Cover-by-Cover Sticky Git Commit Cards Deck */}
        <div ref={deckRef} className="flex-1 min-w-0 space-y-24 sm:space-y-32 pb-20">
          {items.map((item, index) => (
            <StickyCommitDeckCard
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              progress={scrollYProgress}
              isProduction={isProduction}
              shouldReduceMotion={shouldReduceMotion}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>

      {/* Terminal Academic Foundation Footnote */}
      <div className="mt-10 sm:mt-14">
        <EducationFootnote />
      </div>
    </div>
  );
};

export default GitGraphTimeline;
