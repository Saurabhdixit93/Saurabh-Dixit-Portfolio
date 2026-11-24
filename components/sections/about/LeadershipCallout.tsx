"use client";

import * as React from "react";
import { profile } from "@/content/profile";
import { Tag } from "@/components/primitives/Tag";

export interface LeadershipCalloutProps {
  className?: string;
}

export const LeadershipCallout: React.FC<LeadershipCalloutProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative border border-hairline bg-surface/60 p-5 sm:p-6 corner-marks backdrop-blur-sm space-y-4 ${className}`}
    >
      {/* Blueprint Corner Registration Marks */}
      <span className="corner-mark corner-mark-tl" aria-hidden="true" />
      <span className="corner-mark corner-mark-tr" aria-hidden="true" />
      <span className="corner-mark corner-mark-bl" aria-hidden="true" />
      <span className="corner-mark corner-mark-br" aria-hidden="true" />

      {/* Header Eyebrow */}
      <div className="flex items-center justify-between gap-2 border-b border-hairline pb-3">
        <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider">
          // HOW I LEAD · VP OF ENGINEERING
        </span>
        <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
          SYSTEMS PERSPECTIVE
        </span>
      </div>

      {/* Leadership Bio Copy */}
      <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
        {profile.leadershipBio}
      </p>

      {/* Verified Leadership Impact Metrics */}
      <div className="pt-2 border-t border-hairline/60">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-2.5">
          Empirical Delivery Metrics:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag variant="accent" size="sm" indicator="orange">
            +35% Velocity
          </Tag>
          <Tag variant="secondary" size="sm" indicator="cyan">
            -45% Incidents
          </Tag>
          <Tag variant="outline" size="sm" indicator="green">
            3× AI Scale
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default LeadershipCallout;
