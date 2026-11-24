"use client";

import * as React from "react";

export interface SystemCoreDiagramProps {
  className?: string;
}

/**
 * SystemCoreDiagram
 * Pure SVG engineering blueprint diagram representing the request flow:
 * Client -> Gateway -> Workers & Database -> LLM Core (Active Reasoning Node).
 *
 * Performance & Accessibility:
 * - Zero Three.js to guarantee mobile LCP < 2.2s.
 * - Hardware-accelerated CSS packet pulse animations along connecting paths.
 * - Active radar pulse on LLM core in var(--accent).
 * - Fully respects prefers-reduced-motion: reduce (animations disabled).
 * - Fluidly responsive via viewBox="0 0 500 360".
 */
export const SystemCoreDiagram: React.FC<SystemCoreDiagramProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative w-full max-w-[500px] aspect-[500/360] select-none ${className}`}
      role="img"
      aria-label="System architecture diagram illustrating request flow from Client through API Gateway to Workers, Database, and LLM Core"
    >
      <svg
        viewBox="0 0 500 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>{`
            @keyframes sysDash {
              from { stroke-dashoffset: 32; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes sysReverseDash {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: 32; }
            }
            @keyframes sysPulseRing {
              0% { r: 24px; opacity: 0.75; }
              100% { r: 42px; opacity: 0; }
            }
            .sys-flow-forward {
              animation: sysDash 2.4s linear infinite;
            }
            .sys-flow-fast {
              animation: sysDash 1.8s linear infinite;
            }
            .sys-flow-reverse {
              animation: sysReverseDash 3.2s linear infinite;
            }
            .sys-pulse-ring {
              animation: sysPulseRing 2.2s cubic-bezier(0.1, 0.7, 0.3, 1) infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .sys-flow-forward,
              .sys-flow-fast,
              .sys-flow-reverse {
                animation: none !important;
                stroke-dasharray: none !important;
              }
              .sys-pulse-ring {
                display: none !important;
              }
            }
          `}</style>

          {/* Gradients */}
          <linearGradient id="llmGlow" x1="368" y1="146" x2="464" y2="206" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Blueprint Framing & Header */}
        <rect
          x="4"
          y="4"
          width="492"
          height="352"
          rx="6"
          fill="var(--surface)"
          fillOpacity="0.65"
          stroke="var(--line)"
          strokeWidth="1"
        />

        {/* Corner Registration Marks */}
        <path d="M 10 18 L 10 10 L 18 10" stroke="var(--accent)" strokeWidth="1.5" />
        <path d="M 482 10 L 490 10 L 490 18" stroke="var(--accent)" strokeWidth="1.5" />
        <path d="M 10 342 L 10 350 L 18 350" stroke="var(--accent)" strokeWidth="1.5" />
        <path d="M 482 350 L 490 350 L 490 342" stroke="var(--accent)" strokeWidth="1.5" />

        {/* Blueprint Metadata Header */}
        <text
          x="22"
          y="28"
          fill="var(--muted)"
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="0.08em"
        >
          SYS_TOPOLOGY // V4.2
        </text>
        <circle cx="436" cy="25" r="3" fill="var(--accent)" />
        <text
          x="444"
          y="28"
          fill="var(--accent)"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="0.08em"
        >
          LIVE CORE
        </text>

        {/* =========================================================================
            CONNECTING PATHS (Base hairline lines)
           ========================================================================= */}
        {/* Client -> Gateway */}
        <path d="M 104 176 L 136 176" stroke="var(--line)" strokeWidth="1.5" />

        {/* Gateway -> Workers */}
        <path d="M 220 166 C 236 166 236 96 252 96" stroke="var(--line)" strokeWidth="1.5" />

        {/* Gateway -> Database */}
        <path d="M 220 186 C 236 186 236 256 252 256" stroke="var(--line)" strokeWidth="1.5" />

        {/* Workers <-> Database (State sync) */}
        <path d="M 297 122 L 297 230" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Workers -> LLM Core */}
        <path d="M 342 96 C 356 96 356 166 368 166" stroke="var(--line)" strokeWidth="1.5" />

        {/* Database -> LLM Core (RAG / Context) */}
        <path d="M 342 256 C 356 256 356 186 368 186" stroke="var(--line)" strokeWidth="1.5" />

        {/* Feedback loop: LLM Core -> Gateway */}
        <path
          d="M 416 206 C 416 312 178 312 178 202"
          stroke="var(--line)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* =========================================================================
            ACTIVE PACKET FLOWS (Animated pulses)
           ========================================================================= */}
        {/* Packet: Client -> Gateway */}
        <path
          d="M 104 176 L 136 176"
          stroke="var(--accent-2)"
          strokeWidth="1.5"
          strokeDasharray="6 26"
          className="sys-flow-fast"
        />

        {/* Packet: Gateway -> Workers */}
        <path
          d="M 220 166 C 236 166 236 96 252 96"
          stroke="var(--accent-2)"
          strokeWidth="1.5"
          strokeDasharray="6 26"
          className="sys-flow-forward"
        />

        {/* Packet: Gateway -> Database */}
        <path
          d="M 220 186 C 236 186 236 256 252 256"
          stroke="var(--accent-2)"
          strokeWidth="1.5"
          strokeDasharray="6 26"
          className="sys-flow-forward"
        />

        {/* Packet: Workers -> LLM Core */}
        <path
          d="M 342 96 C 356 96 356 166 368 166"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="6 26"
          className="sys-flow-forward"
        />

        {/* Packet: Database -> LLM Core */}
        <path
          d="M 342 256 C 356 256 356 186 368 186"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="6 26"
          className="sys-flow-forward"
        />

        {/* Packet: LLM Response -> Gateway (Return loop) */}
        <path
          d="M 416 206 C 416 312 178 312 178 202"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="6 26"
          className="sys-flow-reverse"
        />

        {/* =========================================================================
            NODES
           ========================================================================= */}

        {/* NODE 1: CLIENT */}
        <g id="node-client">
          <rect
            x="24"
            y="150"
            width="80"
            height="52"
            rx="4"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <circle cx="36" cy="164" r="2.5" fill="var(--accent-2)" />
          <text
            x="64"
            y="172"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            CLIENT
          </text>
          <text
            x="64"
            y="188"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8"
          >
            HTTP / UI
          </text>
        </g>

        {/* NODE 2: GATEWAY */}
        <g id="node-gateway">
          <rect
            x="136"
            y="150"
            width="84"
            height="52"
            rx="4"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <circle cx="148" cy="164" r="2.5" fill="var(--accent-2)" />
          <text
            x="178"
            y="172"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            GATEWAY
          </text>
          <text
            x="178"
            y="188"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8"
          >
            ROUTER / API
          </text>
        </g>

        {/* NODE 3: WORKERS */}
        <g id="node-workers">
          <rect
            x="252"
            y="70"
            width="90"
            height="52"
            rx="4"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <circle cx="264" cy="84" r="2.5" fill="var(--accent-2)" />
          <text
            x="297"
            y="92"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            WORKERS
          </text>
          <text
            x="297"
            y="108"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8"
          >
            ASYNC QUEUES
          </text>
        </g>

        {/* NODE 4: DATABASE */}
        <g id="node-database">
          <rect
            x="252"
            y="230"
            width="90"
            height="52"
            rx="4"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <circle cx="264" cy="244" r="2.5" fill="var(--accent-2)" />
          <text
            x="297"
            y="252"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            DATABASE
          </text>
          <text
            x="297"
            y="268"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8"
          >
            PG & REDIS
          </text>
        </g>

        {/* NODE 5: LLM CORE (Active AI Node) */}
        <g id="node-llm-core">
          {/* Active Radar Pulse Ring */}
          <circle
            cx="416"
            cy="176"
            r="28"
            stroke="var(--accent)"
            strokeWidth="1"
            fill="none"
            className="sys-pulse-ring"
          />

          {/* Node Box */}
          <rect
            x="368"
            y="146"
            width="96"
            height="60"
            rx="6"
            fill="url(#llmGlow)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />

          {/* Active Badge */}
          <rect
            x="396"
            y="138"
            width="40"
            height="14"
            rx="7"
            fill="var(--accent)"
          />
          <text
            x="416"
            y="148"
            textAnchor="middle"
            fill="var(--accent-contrast)"
            fontFamily="var(--font-mono)"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="0.06em"
          >
            ACTIVE
          </text>

          {/* Node Labels */}
          <text
            x="416"
            y="174"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="0.06em"
          >
            LLM CORE
          </text>
          <text
            x="416"
            y="190"
            textAnchor="middle"
            fill="var(--accent)"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
            fontWeight="500"
            letterSpacing="0.04em"
          >
            REASONING
          </text>
        </g>

        {/* Blueprint Footer Metadata */}
        <text
          x="22"
          y="340"
          fill="var(--muted)"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="0.05em"
        >
          PIPELINE: CLIENT → API → WORKERS → DB → LLM
        </text>
        <text
          x="478"
          y="340"
          textAnchor="end"
          fill="var(--muted)"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="0.05em"
        >
          LATENCY &lt; 45ms
        </text>
      </svg>
    </div>
  );
};

export default SystemCoreDiagram;
