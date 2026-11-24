"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";

export interface GitTrackSvgProps {
  progress?: MotionValue<number> | number;
  reducedMotion?: boolean;
  nodeYs?: number[];
  height?: number;
  className?: string;
}

export const GitTrackSvg: React.FC<GitTrackSvgProps> = ({
  progress = 1,
  reducedMotion = false,
  nodeYs = [60, 260, 480, 700],
  height = 800,
  className = "",
}) => {
  const xTrunk = 24;
  const xBranch = 60;

  const y0 = nodeYs[0] ?? 60;   // VP of Eng (feat/sensegrass HEAD)
  const y1 = nodeYs[1] ?? 260;  // Senior SDE
  const y2 = nodeYs[2] ?? 480;  // Full Stack (branch fork point)
  const y3 = nodeYs[3] ?? 700;  // Kenmark ITan (main trunk)
  const yBottom = Math.max(height, y3 + 80);

  // Path 1: Branch line from VP (y0) to Full Stack (y2)
  const branchPath = `M ${xBranch} ${y0} L ${xBranch} ${y2}`;

  // Path 2: Fork curve connecting Full Stack (xBranch, y2) down to Kenmark on trunk (xTrunk, y3)
  const cy = (y2 + y3) / 2;
  const forkPath = `M ${xBranch} ${y2} C ${xBranch} ${cy}, ${xTrunk} ${cy}, ${xTrunk} ${y3}`;

  // Path 3: Trunk line continuing downward from Kenmark (xTrunk, y3) to bottom
  const trunkBottomPath = `M ${xTrunk} ${y3} L ${xTrunk} ${yBottom}`;

  // Full continuous graph path for scroll-linked drawing
  const fullGraphPath = `${branchPath} ${forkPath.replace(/^M/, "L")} L ${xTrunk} ${yBottom}`;

  const pathLengthValue = reducedMotion ? 1 : progress;

  return (
    <svg
      viewBox={`0 0 80 ${yBottom}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-20 h-full overflow-visible select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for active nodes */}
        <filter id="live-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#34D399" floodOpacity="0.8" />
        </filter>
        <filter id="accent-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF6A2B" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Background Inactive Tracks (Blueprint Hairline Grid Spine) */}
      <g stroke="currentColor" className="text-hairline" strokeWidth="2" strokeDasharray="3 3">
        {/* Trunk baseline line running through Kenmark and upward */}
        <line x1={xTrunk} y1={y0 - 20} x2={xTrunk} y2={y3} opacity={0.35} />
      </g>

      <g stroke="currentColor" className="text-hairline" strokeWidth="2">
        <path d={branchPath} opacity={0.4} />
        <path d={forkPath} opacity={0.4} />
        <path d={trunkBottomPath} opacity={0.4} />
      </g>

      {/* Active Scroll-Linked Path */}
      <motion.path
        d={fullGraphPath}
        stroke="var(--accent, #FF6A2B)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          pathLength: pathLengthValue,
        }}
      />

      {/* Branch Annotation Labels (Blueprint Monospace) */}
      <text
        x={xBranch + 6}
        y={y0 - 14}
        className="fill-muted font-mono text-[9px] uppercase tracking-wider"
      >
        feat/sensegrass
      </text>

      <text
        x={xTrunk - 6}
        y={yBottom - 10}
        textAnchor="end"
        className="fill-muted font-mono text-[9px] uppercase tracking-wider"
      >
        main
      </text>

      {/* Commit Nodes */}
      {/* Node 0: VP of Engineering (HEAD / LIVE) */}
      <g transform={`translate(${xBranch}, ${y0})`}>
        {!reducedMotion && (
          <circle r="12" fill="none" stroke="#34D399" strokeWidth="1.5" className="animate-ping opacity-60" />
        )}
        <circle r="9" fill="none" stroke="#34D399" strokeWidth="1.5" opacity={0.7} />
        <circle r="5" fill="#34D399" filter="url(#live-glow)" />
      </g>

      {/* Node 1: Senior SDE */}
      <g transform={`translate(${xBranch}, ${y1})`}>
        <circle r="7" fill="var(--surface, #12151B)" stroke="var(--accent, #FF6A2B)" strokeWidth="2" />
        <circle r="3" fill="var(--accent, #FF6A2B)" />
      </g>

      {/* Node 2: Full Stack Engineer (Branch Fork Origin) */}
      <g transform={`translate(${xBranch}, ${y2})`}>
        <circle r="7" fill="var(--surface, #12151B)" stroke="var(--accent, #FF6A2B)" strokeWidth="2" />
        <circle r="3" fill="var(--accent, #FF6A2B)" />
      </g>

      {/* Node 3: Kenmark ITan Solutions (Trunk Commit) */}
      <g transform={`translate(${xTrunk}, ${y3})`}>
        <circle r="7" fill="var(--surface, #12151B)" stroke="var(--accent2, #4DE1C1)" strokeWidth="2" />
        <circle r="3" fill="var(--accent2, #4DE1C1)" />
      </g>
    </svg>
  );
};

export default GitTrackSvg;
