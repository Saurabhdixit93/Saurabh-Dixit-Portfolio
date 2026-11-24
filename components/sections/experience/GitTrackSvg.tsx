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

      {/* Prominent High-Tech Cyber Rover / Off-Road Toy Vehicle Driving on Scroll */}
      {!reducedMotion && (
        <g
          transform={`translate(${traveler.x}, ${traveler.y}) rotate(${traveler.angle})`}
          style={{ pointerEvents: "none" }}
        >
          {/* Forward High-Beam Headlight Cone (illuminates the track ahead) */}
          <polygon
            points="10,-6 42,-18 42,18 10,6"
            fill="url(#headlight-beam)"
            opacity="0.85"
          />

          {/* Glowing Ground-Effect Neon Aura */}
          <ellipse cx="0" cy="0" rx="16" ry="10" fill="#FF6A2B" opacity="0.4" filter="url(#accent-glow)" />

          {/* Off-Road Tires (4 Rugged Wheels with treads) */}
          <rect x="-12" y="-11" width="7" height="3.5" rx="1" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="1" />
          <rect x="5" y="-11" width="7" height="3.5" rx="1" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="1" />
          <rect x="-12" y="7.5" width="7" height="3.5" rx="1" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="1" />
          <rect x="5" y="7.5" width="7" height="3.5" rx="1" fill="#0B0D10" stroke="#FF6A2B" strokeWidth="1" />

          {/* Wheel Axle Bars */}
          <line x1="-8.5" y1="-8" x2="-8.5" y2="8" stroke="#FF6A2B" strokeWidth="1.5" />
          <line x1="8.5" y1="-8" x2="8.5" y2="8" stroke="#FF6A2B" strokeWidth="1.5" />

          {/* Cyber Vehicle Armored Chassis */}
          <rect
            x="-14"
            y="-7.5"
            width="28"
            height="15"
            rx="3.5"
            fill="#FF6A2B"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Angular Off-Road Bull-Bar / Front Bumper */}
          <path
            d="M 14 -5 L 17 -3 L 17 3 L 14 5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Tinted Cockpit Windshield */}
          <polygon
            points="-4,-5.5 6,-4 6,4 -4,5.5"
            fill="#0B0D10"
            stroke="#FFD166"
            strokeWidth="0.8"
          />

          {/* Roof Rack & Twin Spotlights */}
          <rect x="-7" y="-5" width="10" height="10" rx="1.5" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
          <circle cx="6" cy="-2.5" r="1.5" fill="#FFFFFF" />
          <circle cx="6" cy="2.5" r="1.5" fill="#FFFFFF" />

          {/* Flashing Emergency Beacon (Amber) */}
          <circle cx="-1" cy="0" r="2.5" fill="#FFD166" className="animate-ping opacity-75" />
          <circle cx="-1" cy="0" r="1.5" fill="#FFFFFF" />

          {/* Rear Cyan Plasma Thruster Boosters */}
          <rect x="-16" y="-3.5" width="3" height="2" rx="0.5" fill="#4DE1C1" />
          <rect x="-16" y="1.5" width="3" height="2" rx="0.5" fill="#4DE1C1" />
          {/* Exhaust Flames */}
          <polygon points="-16,-2.5 -22,-2.5 -17,-3.5" fill="#4DE1C1" opacity="0.8" />
          <polygon points="-16,2.5 -22,2.5 -17,1.5" fill="#4DE1C1" opacity="0.8" />
        </g>
      )}
    </svg>
  );
};

export default GitTrackSvg;
