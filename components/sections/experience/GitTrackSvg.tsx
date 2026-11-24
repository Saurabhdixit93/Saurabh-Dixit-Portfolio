"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, MotionValue, isMotionValue } from "framer-motion";

export interface GitTrackSvgProps {
  progress?: MotionValue<number> | number;
  reducedMotion?: boolean;
  nodeYs?: number[];
  height?: number;
  className?: string;
}

/**
 * Calculates exact position and angle along the Git branch track
 * using pure closed-form geometry (zero reliance on DOM getTotalLength).
 */
function computeGitTrackPosition(
  progressVal: number,
  xBranch: number,
  xTrunk: number,
  y0: number,
  y2: number,
  y3: number,
  yBottom: number
): { x: number; y: number; angle: number } {
  const p = Math.min(1, Math.max(0, isNaN(progressVal) ? 0 : progressVal));
  const L1 = Math.max(1, y2 - y0);
  const cy = (y2 + y3) / 2;
  const L2 = Math.max(1, Math.hypot(xBranch - xTrunk, y3 - y2) * 1.15);
  const L3 = Math.max(1, yBottom - y3);
  const totalLen = L1 + L2 + L3;

  const d = p * totalLen;

  if (d <= L1) {
    const t = d / L1;
    return {
      x: xBranch,
      y: y0 + t * (y2 - y0),
      angle: 90,
    };
  } else if (d <= L1 + L2) {
    const t = (d - L1) / L2;
    const invT = 1 - t;
    // Cubic Bezier interpolation: (xBranch, y2) -> (xBranch, cy) -> (xTrunk, cy) -> (xTrunk, y3)
    const x =
      invT * invT * invT * xBranch +
      3 * invT * invT * t * xBranch +
      3 * invT * t * t * xTrunk +
      t * t * t * xTrunk;
    const y =
      invT * invT * invT * y2 +
      3 * invT * invT * t * cy +
      3 * invT * t * t * cy +
      t * t * t * y3;

    // Tangent derivative for orientation angle
    const dx = 6 * invT * t * (xTrunk - xBranch);
    const dy = 3 * invT * invT * (cy - y2) + 3 * t * t * (y3 - cy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return { x, y, angle };
  } else {
    const t = (d - L1 - L2) / L3;
    return {
      x: xTrunk,
      y: y3 + t * (yBottom - y3),
      angle: 90,
    };
  }
}

export const GitTrackSvg: React.FC<GitTrackSvgProps> = ({
  progress = 1,
  reducedMotion = false,
  nodeYs = [60, 260, 480, 700],
  className = "",
}) => {
  const xTrunk = 24;
  const xBranch = 60;

  const y0 = nodeYs[0] ?? 60;   // VP of Eng (HEAD)
  const y1 = nodeYs[1] ?? 260;  // Senior SDE
  const y2 = nodeYs[2] ?? 480;  // Full Stack (Fork origin)
  const y3 = nodeYs[3] ?? 700;  // Kenmark ITan (Trunk root)
  const yBottom = y3 + 40;

  // Path 1: Branch line from VP (y0) to Full Stack (y2)
  const branchPath = `M ${xBranch} ${y0} L ${xBranch} ${y2}`;

  // Path 2: Fork curve connecting Full Stack down to Kenmark
  const cy = (y2 + y3) / 2;
  const forkPath = `M ${xBranch} ${y2} C ${xBranch} ${cy}, ${xTrunk} ${cy}, ${xTrunk} ${y3}`;

  // Path 3: Trunk line downward from Kenmark to root
  const trunkBottomPath = `M ${xTrunk} ${y3} L ${xTrunk} ${yBottom}`;

  // Full continuous graph path for scroll-linked drawing
  const fullGraphPath = `${branchPath} ${forkPath.replace(/^M/, "L")} L ${xTrunk} ${yBottom}`;

  const pathLengthValue = reducedMotion ? 1 : progress;

  // Scroll Traveler Car / Rover Position State
  const [traveler, setTraveler] = useState<{ x: number; y: number; angle: number }>(() =>
    computeGitTrackPosition(0, xBranch, xTrunk, y0, y2, y3, yBottom)
  );

  const updateCar = useCallback(
    (pVal: number) => {
      const pos = computeGitTrackPosition(pVal, xBranch, xTrunk, y0, y2, y3, yBottom);
      setTraveler(pos);
    },
    [xBranch, xTrunk, y0, y2, y3, yBottom]
  );

  useEffect(() => {
    if (isMotionValue(progress)) {
      updateCar(progress.get());
      const unsub = progress.on("change", (latest) => {
        updateCar(latest);
      });
      return () => unsub();
    } else if (typeof progress === "number") {
      updateCar(progress);
    }
  }, [progress, updateCar]);

  return (
    <svg
      viewBox={`0 0 80 ${yBottom}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-20 overflow-visible select-none pointer-events-none ${className}`}
      style={{ height: yBottom }}
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for active nodes */}
        <filter id="live-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#34D399" floodOpacity="0.8" />
        </filter>
        <filter id="accent-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF6A2B" floodOpacity="0.6" />
        </filter>
        {/* Headlight beam gradient */}
        <linearGradient id="headlight-beam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6A2B" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFD166" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
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
        y={yBottom - 8}
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

      {/* Terminal Root Commit Base */}
      <g transform={`translate(${xTrunk}, ${yBottom})`}>
        <rect x="-5" y="-1" width="10" height="2" fill="currentColor" className="text-muted/60" />
      </g>

      {/* Prominent High-Tech Cyber Car / Rover Traveling on Scroll */}
      {!reducedMotion && (
        <g
          transform={`translate(${traveler.x}, ${traveler.y}) rotate(${traveler.angle})`}
          className="transition-transform duration-75"
        >
          {/* Forward Headlight Beam Cone */}
          <polygon
            points="6,-4 28,-11 28,11 6,4"
            fill="url(#headlight-beam)"
            opacity="0.9"
          />

          {/* Underglow Glow Shadow */}
          <ellipse cx="0" cy="0" rx="12" ry="7" fill="#FF6A2B" opacity="0.35" filter="url(#accent-glow)" />

          {/* Cyber Vehicle Chassis */}
          <rect
            x="-10"
            y="-5.5"
            width="20"
            height="11"
            rx="2.5"
            fill="#FF6A2B"
            stroke="#FFFFFF"
            strokeWidth="1"
          />

          {/* Aerodynamic Cockpit Windshield */}
          <polygon
            points="-2,-4 5,-3 5,3 -2,4"
            fill="#0B0D10"
            stroke="#FFD166"
            strokeWidth="0.6"
          />

          {/* Front & Rear Cyber Wheels */}
          <rect x="-8.5" y="-7.5" width="4.5" height="2.2" rx="0.8" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="0.8" />
          <rect x="4" y="-7.5" width="4.5" height="2.2" rx="0.8" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="0.8" />
          <rect x="-8.5" y="5.3" width="4.5" height="2.2" rx="0.8" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="0.8" />
          <rect x="4" y="5.3" width="4.5" height="2.2" rx="0.8" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="0.8" />

          {/* Flashing Roof Beacon Indicator */}
          <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="1.2" fill="#FF6A2B" />

          {/* Rear Twin Cyan Plasma Exhaust Trails */}
          <circle cx="-11" cy="-2.5" r="1.2" fill="#4DE1C1" />
          <circle cx="-11" cy="2.5" r="1.2" fill="#4DE1C1" />
        </g>
      )}
    </svg>
  );
};

export default GitTrackSvg;
