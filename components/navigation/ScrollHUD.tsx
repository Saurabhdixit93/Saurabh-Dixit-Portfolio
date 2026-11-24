"use client";

import * as React from "react";

export const LIFECYCLE_STAGES = [
  "CLIENT",
  "GATEWAY",
  "SERVICES",
  "DATA",
  "AI",
  "RESPONSE",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

/**
 * Maps a normalized scroll progress ratio (0 to 1) to an architectural lifecycle stage.
 * CLIENT -> GATEWAY -> SERVICES -> DATA -> AI -> RESPONSE
 * Exported for deterministic unit testing.
 */
export function getLifecycleStage(progressRatio: number): LifecycleStage {
  if (isNaN(progressRatio) || progressRatio <= 0) {
    return LIFECYCLE_STAGES[0];
  }
  const clamped = Math.min(1, Math.max(0, progressRatio));
  // Divide the range [0, 1] evenly into 6 intervals
  const stageIndex = Math.min(
    Math.floor(clamped * LIFECYCLE_STAGES.length),
    LIFECYCLE_STAGES.length - 1
  );
  return LIFECYCLE_STAGES[stageIndex];
}

export interface ScrollHUDProps {
  className?: string;
  showBadge?: boolean;
}

export interface ScrollLifecycleBadgeProps {
  className?: string;
  stage?: LifecycleStage;
  percentage?: number;
}

/**
 * Architectural telemetry badge displaying the current request lifecycle stage and scroll percentage.
 * Can be embedded directly inside header layouts (CSS flex flow) or rendered standalone.
 */
export function ScrollLifecycleBadge({
  className = "",
  stage: propStage,
  percentage: propPercentage,
}: ScrollLifecycleBadgeProps) {
  const [scrollProgress, setScrollProgress] = React.useState<number>(0);
  const [currentStage, setCurrentStage] = React.useState<LifecycleStage>("CLIENT");

  React.useEffect(() => {
    if (propStage !== undefined && propPercentage !== undefined) return;

    let ticking = false;

    const updateScrollProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const clamped = Math.min(1, Math.max(0, progress));

      setScrollProgress(clamped);
      setCurrentStage(getLifecycleStage(clamped));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    updateScrollProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [propStage, propPercentage]);

  const stage = propStage ?? currentStage;
  const percentage = propPercentage ?? Math.round(scrollProgress * 100);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase rounded-sm border border-hairline bg-surface/90 backdrop-blur-md shadow-sm transition-colors ${className}`}
      title={`Scroll Progress: ${percentage}% - Lifecycle Stage: ${stage}`}
      aria-label={`Request lifecycle stage: ${stage}, scroll progress: ${percentage}%`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
      </span>
      <span className="text-muted">REQ.STAGE:</span>
      <span className="font-semibold text-text tracking-widest">{stage}</span>
      <span className="text-muted/60 text-[9px] tabular-nums">[{percentage}%]</span>
    </div>
  );
}

export function ScrollHUD({ className = "", showBadge = false }: ScrollHUDProps) {
  const [scrollProgress, setScrollProgress] = React.useState<number>(0);
  const [stage, setStage] = React.useState<LifecycleStage>("CLIENT");

  React.useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const clamped = Math.min(1, Math.max(0, progress));

      setScrollProgress(clamped);
      setStage(getLifecycleStage(clamped));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    // Initialize on mount
    updateScrollProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  const percentage = Math.round(scrollProgress * 100);

  return (
    <>
      {/* 2px Fixed Top Progress Line (Visible on all devices) */}
      <div
        className={`fixed top-0 left-0 right-0 h-[2px] z-[60] bg-hairline/40 pointer-events-none ${className}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      >
        <div
          className="h-full bg-accent transition-[width] duration-75 ease-out shadow-[0_0_8px_var(--accent)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Standalone Lifecycle Stage Badge (Centered with pointer-events-none to prevent layout collision) */}
      {showBadge && (
        <div className="fixed top-2.5 left-1/2 -translate-x-1/2 z-40 hidden xl:inline-flex pointer-events-none">
          <ScrollLifecycleBadge stage={stage} percentage={percentage} />
        </div>
      )}
    </>
  );
}

export default ScrollHUD;
