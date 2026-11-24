"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";

export interface CountUpNumberProps {
  value?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * CountUpNumber
 * Zero-CLS count-up component using font-mono tabular-nums.
 * Renders exact target value in initial SSR HTML, counts up when in view on client.
 * Disabled under prefers-reduced-motion (instant display).
 */
export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value = 0,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className = "",
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [displayValue, setDisplayValue] = React.useState<number>(value);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    if (!isInView || hasAnimated.current) return;

    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        hasAnimated.current = true;
        return;
      }
    }

    hasAnimated.current = true;
    setDisplayValue(0);

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth exponential deceleration
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={`font-mono tabular-nums select-none ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
