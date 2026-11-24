"use client";

import React, { useState, useId } from "react";
import { ArchitectureNode, ArchitectureEdge, ArchitectureCategory } from "@/content/types";

export interface ArchitectureDiagramProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  title?: string;
  className?: string;
}

const CATEGORY_META: Record<
  ArchitectureCategory,
  { label: string; stroke: string; fill: string; text: string; badge: string }
> = {
  client: {
    label: "CLIENT",
    stroke: "#38bdf8",
    fill: "rgba(56, 189, 248, 0.08)",
    text: "#38bdf8",
    badge: "CLIENT / UX",
  },
  gateway: {
    label: "GATEWAY",
    stroke: "#fb923c",
    fill: "rgba(251, 146, 60, 0.08)",
    text: "#fb923c",
    badge: "API GATEWAY",
  },
  api: {
    label: "GATEWAY",
    stroke: "#fb923c",
    fill: "rgba(251, 146, 60, 0.08)",
    text: "#fb923c",
    badge: "API GATEWAY",
  },
  service: {
    label: "SERVICE",
    stroke: "#c084fc",
    fill: "rgba(192, 132, 252, 0.08)",
    text: "#c084fc",
    badge: "SERVICE CORE",
  },
  worker: {
    label: "WORKER",
    stroke: "#818cf8",
    fill: "rgba(129, 140, 248, 0.08)",
    text: "#818cf8",
    badge: "ASYNC WORKER",
  },
  database: {
    label: "DATABASE",
    stroke: "#34d399",
    fill: "rgba(52, 211, 153, 0.08)",
    text: "#34d399",
    badge: "PERSISTENCE",
  },
  storage: {
    label: "STORAGE",
    stroke: "#34d399",
    fill: "rgba(52, 211, 153, 0.08)",
    text: "#34d399",
    badge: "STORAGE",
  },
  ai: {
    label: "AI / LLM",
    stroke: "var(--accent, #FF6A2B)",
    fill: "rgba(255, 106, 43, 0.12)",
    text: "var(--accent, #FF6A2B)",
    badge: "INTELLIGENCE",
  },
  queue: {
    label: "QUEUE",
    stroke: "#facc15",
    fill: "rgba(250, 204, 21, 0.08)",
    text: "#facc15",
    badge: "EVENT QUEUE",
  },
  external: {
    label: "EXTERNAL",
    stroke: "#94a3b8",
    fill: "rgba(148, 163, 184, 0.08)",
    text: "#94a3b8",
    badge: "INTEGRATION",
  },
};

export function ArchitectureDiagram({
  nodes,
  edges,
  title = "System Topology & Signal Flow",
  className = "",
}: ArchitectureDiagramProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const diagramId = useId().replace(/:/g, "_");

  // Coordinate normalizer: converts percentage (0-100) to SVG canvas (0-800, 0-420)
  const getNodeCoordinates = (node: ArchitectureNode) => {
    const isPercentage = node.x <= 100 && node.y <= 100;
    const cx = isPercentage ? (node.x / 100) * 800 : node.x;
    const cy = isPercentage ? (node.y / 100) * 420 : node.y;
    return { cx, cy };
  };

  const nodeMap = new Map<string, ArchitectureNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Node dimensions
  const nodeW = 136;
  const nodeH = 56;
  const halfW = nodeW / 2;
  const halfH = nodeH / 2;

  // Compute Bezier path between two nodes
  const computePath = (fromNode: ArchitectureNode, toNode: ArchitectureNode) => {
    const from = getNodeCoordinates(fromNode);
    const to = getNodeCoordinates(toNode);

    let startX = from.cx;
    let startY = from.cy;
    let endX = to.cx;
    let endY = to.cy;

    const dx = to.cx - from.cx;
    const dy = to.cy - from.cy;

    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx > 0) {
        startX = from.cx + halfW;
        endX = to.cx - halfW;
      } else {
        startX = from.cx - halfW;
        endX = to.cx + halfW;
      }
      const cOffset = Math.abs(endX - startX) * 0.5;
      const c1x = dx > 0 ? startX + cOffset : startX - cOffset;
      const c2x = dx > 0 ? endX - cOffset : endX + cOffset;
      return {
        d: `M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`,
        midX: (startX + endX) / 2,
        midY: (startY + endY) / 2,
      };
    } else {
      if (dy > 0) {
        startY = from.cy + halfH;
        endY = to.cy - halfH;
      } else {
        startY = from.cy - halfH;
        endY = to.cy + halfH;
      }
      const cOffset = Math.abs(endY - startY) * 0.5;
      const c1y = dy > 0 ? startY + cOffset : startY - cOffset;
      const c2y = dy > 0 ? endY - cOffset : endY + cOffset;
      return {
        d: `M ${startX} ${startY} C ${startX} ${c1y}, ${endX} ${c2y}, ${endX} ${endY}`,
        midX: (startX + endX) / 2,
        midY: (startY + endY) / 2,
      };
    }
  };

  return (
    <div className={`relative w-full rounded-xl border border-hairline bg-surface/90 backdrop-blur-sm overflow-hidden p-4 sm:p-6 shadow-sm ${className}`}>
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-hairline/60">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs font-semibold text-text uppercase tracking-wider">
            {title}
          </span>
          <span className="font-mono text-[11px] text-muted hidden sm:inline">
            // {nodes.length} NODES · {edges.length} SIGNAL CHANNELS
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted">
          <span className="inline-block w-2 h-2 rounded-sm bg-accent/30 border border-accent" />
          <span>ACTIVE STREAM</span>
          <span className="text-hairline">|</span>
          <span className="inline-block w-2 h-2 rounded-sm bg-emerald-500/30 border border-emerald-500" />
          <span>PERSISTENCE</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 800 420"
          className="w-full h-auto min-w-[680px] select-none"
          role="img"
          aria-label={`${title} system architecture diagram`}
        >
          <defs>
            {/* Blueprint Grid Pattern */}
            <pattern
              id={`grid-${diagramId}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="var(--line, rgba(255,255,255,0.06))"
                strokeWidth="0.6"
              />
              <circle
                cx="0"
                cy="0"
                r="0.8"
                fill="var(--line, rgba(255,255,255,0.1))"
              />
            </pattern>

            {/* Arrowhead Marker */}
            <marker
              id={`arrow-${diagramId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--muted, #8b949e)" />
            </marker>
            <marker
              id={`arrow-active-${diagramId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--accent, #FF6A2B)" />
            </marker>
          </defs>

          <style>
            {`
              @media (prefers-reduced-motion: reduce) {
                .diagram-signal-pulse {
                  display: none !important;
                }
                .diagram-radar-ring {
                  animation: none !important;
                }
              }
            `}
          </style>

          {/* Grid Background */}
          <rect width="800" height="420" fill={`url(#grid-${diagramId})`} rx="8" />

          {/* Edges */}
          <g className="edges-group">
            {edges.map((edge, idx) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const { d, midX, midY } = computePath(fromNode, toNode);
              const isConnectedToHover =
                hoveredNodeId === edge.from || hoveredNodeId === edge.to;
              const isEdgeActive = edge.animated !== false || isConnectedToHover;
              const edgeColor = isConnectedToHover
                ? "var(--accent, #FF6A2B)"
                : "var(--line, rgba(255,255,255,0.18))";

              const pathId = `edge-${diagramId}-${idx}`;

              return (
                <g key={`edge-${edge.from}-${edge.to}-${idx}`}>
                  {/* Background Path */}
                  <path
                    id={pathId}
                    d={d}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={isConnectedToHover ? 2 : 1.2}
                    strokeDasharray={edge.animated === false ? "4,4" : undefined}
                    markerEnd={`url(#${isConnectedToHover ? `arrow-active-${diagramId}` : `arrow-${diagramId}`})`}
                    className="transition-colors duration-200"
                  />

                  {/* Traveling Pulse Along Path */}
                  {isEdgeActive && (
                    <circle
                      r={isConnectedToHover ? 4 : 3}
                      fill="var(--accent, #FF6A2B)"
                      className="diagram-signal-pulse"
                    >
                      <animateMotion
                        path={d}
                        dur={`${2.4 + (idx % 3) * 0.4}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Edge Label (if present) */}
                  {edge.label && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-48"
                        y="-10"
                        width="96"
                        height="20"
                        rx="4"
                        fill="var(--surface, #111418)"
                        stroke="var(--line, rgba(255,255,255,0.12))"
                        strokeWidth="0.8"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="var(--muted, #8b949e)"
                        fontSize="9"
                        fontFamily="var(--font-geist-mono, monospace)"
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes-group">
            {nodes.map((node) => {
              const { cx, cy } = getNodeCoordinates(node);
              const cat = (node.category || node.type || "service") as ArchitectureCategory;
              const meta = CATEGORY_META[cat] || CATEGORY_META.service;
              const isHovered = hoveredNodeId === node.id;
              const isAi = cat === "ai" || node.active;

              return (
                <g
                  key={node.id}
                  transform={`translate(${cx}, ${cy})`}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer transition-transform duration-200"
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label}: ${node.sublabel || meta.badge}`}
                  onFocus={() => setHoveredNodeId(node.id)}
                  onBlur={() => setHoveredNodeId(null)}
                >
                  {/* Radar pulse for active/AI nodes */}
                  {isAi && (
                    <circle
                      r={halfW * 0.9}
                      fill="none"
                      stroke="var(--accent, #FF6A2B)"
                      strokeWidth="1.2"
                      opacity="0.3"
                      className="diagram-radar-ring animate-ping"
                    />
                  )}

                  {/* Node Box */}
                  <rect
                    x={-halfW}
                    y={-halfH}
                    width={nodeW}
                    height={nodeH}
                    rx="8"
                    fill="var(--surface, #111418)"
                    stroke={isHovered ? "var(--accent, #FF6A2B)" : meta.stroke}
                    strokeWidth={isHovered ? 2 : 1.2}
                    className="transition-all duration-200"
                    style={{
                      filter: isHovered
                        ? "drop-shadow(0 0 12px rgba(255,106,43,0.35))"
                        : "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                    }}
                  />

                  {/* Category Pill Tag */}
                  <rect
                    x={-halfW + 8}
                    y={-halfH + 6}
                    width={60}
                    height={14}
                    rx="3"
                    fill={meta.fill}
                    stroke={meta.stroke}
                    strokeWidth="0.6"
                  />
                  <text
                    x={-halfW + 38}
                    y={-halfH + 16.5}
                    textAnchor="middle"
                    fill={meta.text}
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="var(--font-geist-mono, monospace)"
                    letterSpacing="0.05em"
                  >
                    {meta.label}
                  </text>

                  {/* Status Indicator Dot */}
                  <circle
                    cx={halfW - 12}
                    cy={-halfH + 13}
                    r="3"
                    fill={isAi ? "var(--accent, #FF6A2B)" : meta.stroke}
                  />

                  {/* Node Primary Label */}
                  <text
                    x="0"
                    y={8}
                    textAnchor="middle"
                    fill="var(--text, #f0f6fc)"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="var(--font-geist-mono, monospace)"
                  >
                    {node.label}
                  </text>

                  {/* Node Sublabel */}
                  {node.sublabel && (
                    <text
                      x="0"
                      y={20}
                      textAnchor="middle"
                      fill="var(--muted, #8b949e)"
                      fontSize="8.5"
                      fontFamily="var(--font-geist-mono, monospace)"
                    >
                      {node.sublabel}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Screen Reader Accessible Fallback */}
      <details className="mt-4 border border-hairline/60 bg-bg/60 rounded-lg p-3 text-xs font-mono text-muted">
        <summary className="cursor-pointer text-text hover:text-accent font-medium select-none flex items-center justify-between">
          <span>// SYSTEM ARCHITECTURE SPECIFICATION (ACCESSIBLE TEXT EQUIVALENT)</span>
          <span className="text-[10px] text-muted">EXPAND FOR TOPOLOGY SPEC →</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-hairline/60 space-y-3">
          <div>
            <h4 className="font-semibold text-text uppercase text-[11px] mb-1.5">
              1. System Nodes ({nodes.length})
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {nodes.map((node) => (
                <li key={node.id}>
                  <strong className="text-text">{node.label}</strong> (
                  {node.category || node.type || "node"})
                  {node.sublabel ? `: ${node.sublabel}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text uppercase text-[11px] mb-1.5">
              2. Data Flow & Signal Pipelines ({edges.length})
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {edges.map((edge, idx) => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                return (
                  <li key={idx}>
                    <span className="text-text">{fromNode?.label || edge.from}</span> →{" "}
                    <span className="text-text">{toNode?.label || edge.to}</span>
                    {edge.label ? ` via ${edge.label}` : ""}
                    {edge.protocol ? ` [${edge.protocol}]` : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}

export default ArchitectureDiagram;
