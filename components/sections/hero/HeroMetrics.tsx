"use client";

import * as React from "react";
import { heroMetrics } from "@/content/metrics";
import { CountUpNumber } from "./CountUpNumber";

export interface HeroMetricsProps {
  className?: string;
}

const metricIndexLabels: Record<string, string> = {
  "delivery-velocity": "// 01 · VELOCITY",
  "ai-scale": "// 02 · SCALE",
  "incident-reduction": "// 03 · RELIABILITY",
};

/**
 * HeroMetrics
 * 3-column responsive grid displaying verified hero metrics from content/metrics.ts.
 * Built with "The Systems Blueprint" hairline borders, corner marks, and zero-CLS count-up.
 */
export const HeroMetrics: React.FC<HeroMetricsProps> = ({ className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full ${className}`}
      role="region"
      aria-label="Key engineering impact metrics"
    >
      {heroMetrics.map((metric) => {
        const indexLabel = metricIndexLabels[metric.id] ?? "// METRIC";

        return (
          <div
            key={metric.id}
            className="relative border border-hairline corner-marks bg-surface/50 backdrop-blur-xs p-4 sm:p-5 flex flex-col justify-between transition-colors duration-150 hover:border-accent/40 group"
          >
            {/* Top Index & Status */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-muted">
                {indexLabel}
              </span>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-accent/70 group-hover:bg-accent transition-colors"
                aria-hidden="true"
              />
            </div>

            {/* Metric Value with Zero-CLS Count-Up */}
            <div className="py-1">
              <CountUpNumber
                value={metric.numericValue ?? 0}
                prefix={metric.prefix}
                suffix={metric.suffix}
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text"
              />
            </div>

            {/* Metric Label & Context */}
            <div className="mt-1 space-y-0.5">
              <div className="font-sans text-xs sm:text-sm font-medium text-text">
                {metric.label}
              </div>
              <p className="font-mono text-[11px] text-muted leading-snug line-clamp-2">
                {metric.context}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroMetrics;
