"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduceMotion = Boolean(useReducedMotion());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 85%"],
  });

  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Fixed proportional nodeYs for the sticky left Git Track SVG so all 4 commits
  // stay visible in the sticky left rail as the rover drives from node 0 -> 3.
  const stickyNodeYs = [44, 164, 284, 404];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Blueprint Layout: Sticky Left Git Graph Track + Cover-by-Cover Sticky Commit Cards */}
      <div className="relative flex items-start gap-3 sm:gap-6 md:gap-10">
        {/* Left Rail: Sticky Git Branch SVG Spine */}
        <div className="sticky top-24 shrink-0 select-none self-start hidden sm:block">
          <GitTrackSvg
            progress={scrollProgress}
            reducedMotion={shouldReduceMotion}
            nodeYs={stickyNodeYs}
            height={460}
          />
        </div>

        {/* Mobile Left Rail: Compact Sticky Git Track */}
        <div className="sticky top-24 shrink-0 select-none self-start block sm:hidden">
          <GitTrackSvg
            progress={scrollProgress}
            reducedMotion={shouldReduceMotion}
            nodeYs={stickyNodeYs}
            height={460}
          />
        </div>

        {/* Right Rail: Cover-by-Cover Sticky Git Commit Cards Deck */}
        <div className="flex-1 min-w-0 space-y-24 sm:space-y-32 pb-20">
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
