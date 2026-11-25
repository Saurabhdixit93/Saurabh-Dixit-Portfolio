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
 * - Fluidly responsive with expanded sizing up to max-w-[660px] and taller 560x440 canvas
 *   to balance visually with the Hero copy & metrics column.
 * - Hardware-accelerated CSS packet pulse & transform-based radar ring animations.
 * - Live animated data packets traversing all circuits + telemetry waveform bars.
 * - Fully respects prefers-reduced-motion: reduce.
 */
export const SystemCoreDiagram: React.FC<SystemCoreDiagramProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative w-full max-w-[660px] aspect-[560/440] select-none ${className}`}
      role="img"
      aria-label="System architecture diagram illustrating request flow from Client through API Gateway to Workers, Database, and LLM Core"
    >
      <svg
        viewBox="0 0 560 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>{`
            @keyframes sysDash {
              from { stroke-dashoffset: 36; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes sysReverseDash {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: 36; }
            }
            @keyframes sysPulseScale {
              0% {
                transform: scale(0.75);
                opacity: 0.85;
              }
              100% {
                transform: scale(1.65);
                opacity: 0;
              }
            }
            @keyframes sysNodeBreathe {
              0%, 100% { opacity: 0.75; }
              50% { opacity: 1; }
            }
            @keyframes sysBarPulse {
              0%, 100% { transform: scaleY(0.45); opacity: 0.65; }
              50% { transform: scaleY(1); opacity: 1; }
            }
            @keyframes sysScanline {
              0% { transform: translateY(0px); opacity: 0; }
              15% { opacity: 0.35; }
              85% { opacity: 0.35; }
              100% { transform: translateY(370px); opacity: 0; }
            }
            .sys-flow-forward {
              animation: sysDash 1.6s linear infinite !important;
            }
            .sys-flow-fast {
              animation: sysDash 1.1s linear infinite !important;
            }
            .sys-flow-reverse {
              animation: sysReverseDash 2.2s linear infinite !important;
            }
            .sys-pulse-ring {
              transform-box: fill-box;
              transform-origin: center;
              animation: sysPulseScale 2.4s cubic-bezier(0.15, 0.7, 0.3, 1) infinite !important;
            }
            .sys-pulse-ring-2 {
              transform-box: fill-box;
              transform-origin: center;
              animation: sysPulseScale 2.4s cubic-bezier(0.15, 0.7, 0.3, 1) infinite 1.2s !important;
            }
            .sys-node-breathe {
              animation: sysNodeBreathe 3s ease-in-out infinite !important;
            }
            .sys-bar {
              transform-box: fill-box;
              transform-origin: bottom;
              animation: sysBarPulse 1.6s ease-in-out infinite !important;
            }
            .sys-scanline {
              animation: sysScanline 5.5s linear infinite !important;
            }
            .sys-packet {
              will-change: transform;
            }
          `}</style>

          {/* Blueprint Internal Grid Pattern */}
          <pattern
            id="sys-internal-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="var(--line)"
              strokeWidth="0.6"
              strokeOpacity="0.45"
            />
          </pattern>

          {/* Glowing Filters */}
          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="5"
              floodColor="#FF6A2B"
              floodOpacity="0.75"
            />
          </filter>
          <filter id="packet-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor="#4DE1C1"
              floodOpacity="0.85"
            />
          </filter>

          {/* Gradients */}
          <linearGradient
            id="llmGlow"
            x1="406"
            y1="168"
            x2="522"
            y2="248"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--accent)" stopOpacity="0.24" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent-2)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Blueprint Framing */}
        <rect
          x="4"
          y="4"
          width="552"
          height="432"
          rx="8"
          fill="var(--surface)"
          fillOpacity="0.92"
          stroke="var(--line)"
          strokeWidth="1.2"
        />

        {/* Internal Grid */}
        <rect
          x="12"
          y="42"
          width="536"
          height="356"
          rx="4"
          fill="url(#sys-internal-grid)"
        />

        {/* Subtle Blueprint Scanline */}
        <rect
          x="12"
          y="42"
          width="536"
          height="1.5"
          fill="url(#scanGrad)"
          className="sys-scanline"
        />

        {/* Corner Registration Marks */}
        <path d="M 10 22 L 10 10 L 22 10" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M 538 10 L 550 10 L 550 22" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M 10 418 L 10 430 L 22 430" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M 538 430 L 550 430 L 550 418" stroke="var(--accent)" strokeWidth="1.8" />

        {/* Blueprint Metadata Header */}
        <line x1="12" y1="40" x2="548" y2="40" stroke="var(--line)" strokeWidth="0.8" />
        <text
          x="24"
          y="27"
          fill="var(--muted)"
          fontFamily="var(--font-mono)"
          fontSize="9.5"
          letterSpacing="0.08em"
        >
          SYS_TOPOLOGY // V4.4.2 · PRODUCTION RUNTIME
        </text>
        <circle
          cx="426"
          cy="24"
          r="4"
          fill="#34D399"
          className="animate-ping motion-reduce:hidden opacity-75"
        />
        <circle cx="426" cy="24" r="2.8" fill="#34D399" />
        <text
          x="436"
          y="27"
          fill="var(--accent)"
          fontFamily="var(--font-mono)"
          fontSize="9.5"
          fontWeight="bold"
          letterSpacing="0.08em"
        >
          ONLINE (99.99%)
        </text>

        {/* =========================================================================
            CONNECTING PATHS (Base hairline lines)
           ========================================================================= */}
        {/* Client -> Gateway */}
        <path
          id="path-client-gw"
          d="M 114 208 L 152 208"
          stroke="var(--line)"
          strokeWidth="1.5"
        />

        {/* Gateway -> Workers */}
        <path
          id="path-gw-workers"
          d="M 248 194 C 266 194 266 108 284 108"
          stroke="var(--line)"
          strokeWidth="1.5"
        />

        {/* Gateway -> Database */}
        <path
          id="path-gw-db"
          d="M 248 222 C 266 222 266 308 284 308"
          stroke="var(--line)"
          strokeWidth="1.5"
        />

        {/* Workers <-> Database (State sync) */}
        <path
          d="M 336 138 L 336 278"
          stroke="var(--line)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />

        {/* Workers -> LLM Core */}
        <path
          id="path-workers-llm"
          d="M 388 108 C 402 108 402 194 414 194"
          stroke="var(--line)"
          strokeWidth="1.5"
        />

        {/* Database -> LLM Core (RAG / Context) */}
        <path
          id="path-db-llm"
          d="M 388 308 C 402 308 402 222 414 222"
          stroke="var(--line)"
          strokeWidth="1.5"
        />

        {/* Feedback loop: LLM Core -> Gateway */}
        <path
          id="path-llm-feedback"
          d="M 468 244 C 468 372 200 372 200 238"
          stroke="var(--line)"
          strokeWidth="1.1"
          strokeDasharray="4 4"
        />

        {/* =========================================================================
            ACTIVE PACKET FLOWS (Animated pulses)
           ========================================================================= */}
        <path
          d="M 114 208 L 152 208"
          stroke="var(--accent-2)"
          strokeWidth="1.8"
          strokeDasharray="8 28"
          className="sys-flow-fast"
        />
        <path
          d="M 248 194 C 266 194 266 108 284 108"
          stroke="var(--accent-2)"
          strokeWidth="1.8"
          strokeDasharray="8 28"
          className="sys-flow-forward"
        />
        <path
          d="M 248 222 C 266 222 266 308 284 308"
          stroke="var(--accent-2)"
          strokeWidth="1.8"
          strokeDasharray="8 28"
          className="sys-flow-forward"
        />
        <path
          d="M 388 108 C 402 108 402 194 414 194"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeDasharray="8 28"
          className="sys-flow-forward"
        />
        <path
          d="M 388 308 C 402 308 402 222 414 222"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeDasharray="8 28"
          className="sys-flow-forward"
        />
        <path
          d="M 468 244 C 468 372 200 372 200 238"
          stroke="var(--accent)"
          strokeWidth="1.3"
          strokeDasharray="8 28"
          className="sys-flow-reverse"
        />

        {/* Edge Protocol Micro-Labels */}
        <g fontFamily="var(--font-mono)" fontSize="7.5" fill="var(--muted)">
          <text x="336" y="211" textAnchor="middle" fill="var(--surface)" stroke="var(--surface)" strokeWidth="4" paintOrder="stroke">
            STATE SYNC
          </text>
          <text x="336" y="211" textAnchor="middle">
            STATE SYNC
          </text>
          <text x="334" y="366" textAnchor="middle">
            STREAMING TOKEN RESPONSE
          </text>
        </g>

        {/* REALISTIC ANIMATED FLYING DATA PACKETS (Staggered Infinite Stream) */}
        {/* Client -> Gateway (Cyan) */}
        <circle r="3.2" fill="#4DE1C1" filter="url(#packet-glow)" className="sys-packet">
          <animateMotion dur="1.4s" begin="0s" repeatCount="indefinite" path="M 114 208 L 152 208" />
        </circle>
        <circle r="2.6" fill="#4DE1C1" filter="url(#packet-glow)" className="sys-packet">
          <animateMotion dur="1.4s" begin="0.7s" repeatCount="indefinite" path="M 114 208 L 152 208" />
        </circle>

        {/* Gateway -> Workers (Cyan) */}
        <circle r="3.4" fill="#4DE1C1" filter="url(#packet-glow)" className="sys-packet">
          <animateMotion dur="2.2s" begin="0s" repeatCount="indefinite" path="M 248 194 C 266 194 266 108 284 108" />
        </circle>
        <circle r="2.6" fill="#4DE1C1" filter="url(#packet-glow)" className="sys-packet">
          <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path="M 248 194 C 266 194 266 108 284 108" />
        </circle>

        {/* Gateway -> Database (Cyan) */}
        <circle r="3.4" fill="#4DE1C1" filter="url(#packet-glow)" className="sys-packet">
          <animateMotion dur="2.4s" begin="0.3s" repeatCount="indefinite" path="M 248 222 C 266 222 266 308 284 308" />
        </circle>
        <circle r="2.6" fill="#4DE1C1" filter="url(#packet-glow)" className="sys-packet">
          <animateMotion dur="2.4s" begin="1.5s" repeatCount="indefinite" path="M 248 222 C 266 222 266 308 284 308" />
        </circle>

        {/* Workers <-> Database State Sync (Cyan) */}
        <circle r="2.5" fill="#4DE1C1" filter="url(#packet-glow)" className="sys-packet">
          <animateMotion dur="2.0s" begin="0s" repeatCount="indefinite" path="M 336 138 L 336 278" />
        </circle>

        {/* Workers -> LLM Core (Accent Orange) */}
        <circle r="3.8" fill="#FF6A2B" filter="url(#core-glow)" className="sys-packet">
          <animateMotion dur="2.0s" begin="0s" repeatCount="indefinite" path="M 388 108 C 402 108 402 194 414 194" />
        </circle>
        <circle r="2.8" fill="#FF6A2B" filter="url(#core-glow)" className="sys-packet">
          <animateMotion dur="2.0s" begin="1.0s" repeatCount="indefinite" path="M 388 108 C 402 108 402 194 414 194" />
        </circle>

        {/* Database -> LLM Core (Accent Orange) */}
        <circle r="3.8" fill="#FF6A2B" filter="url(#core-glow)" className="sys-packet">
          <animateMotion dur="2.2s" begin="0.4s" repeatCount="indefinite" path="M 388 308 C 402 308 402 222 414 222" />
        </circle>
        <circle r="2.8" fill="#FF6A2B" filter="url(#core-glow)" className="sys-packet">
          <animateMotion dur="2.2s" begin="1.5s" repeatCount="indefinite" path="M 388 308 C 402 308 402 222 414 222" />
        </circle>

        {/* LLM Core -> Gateway Return Stream (Amber / Orange) */}
        <circle r="3.2" fill="#FFD166" className="sys-packet">
          <animateMotion dur="3.4s" begin="0s" repeatCount="indefinite" path="M 468 244 C 468 372 200 372 200 238" />
        </circle>
        <circle r="2.5" fill="#FF6A2B" className="sys-packet">
          <animateMotion dur="3.4s" begin="1.7s" repeatCount="indefinite" path="M 468 244 C 468 372 200 372 200 238" />
        </circle>

        {/* =========================================================================
            NODES
           ========================================================================= */}

        {/* NODE 1: CLIENT */}
        <g id="node-client">
          <rect
            x="24"
            y="178"
            width="90"
            height="60"
            rx="5"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1.3"
          />
          <circle cx="37" cy="193" r="2.8" fill="var(--accent-2)" className="sys-node-breathe" />
          <text
            x="69"
            y="204"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            CLIENT
          </text>
          <text
            x="69"
            y="222"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
          >
            HTTP / UI
          </text>
        </g>

        {/* NODE 2: GATEWAY */}
        <g id="node-gateway">
          <rect
            x="152"
            y="178"
            width="96"
            height="60"
            rx="5"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1.3"
          />
          <circle cx="165" cy="193" r="2.8" fill="var(--accent-2)" className="sys-node-breathe" />
          <text
            x="200"
            y="204"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            GATEWAY
          </text>
          <text
            x="200"
            y="222"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
          >
            ROUTER / API
          </text>
        </g>

        {/* NODE 3: WORKERS */}
        <g id="node-workers">
          <rect
            x="284"
            y="78"
            width="104"
            height="60"
            rx="5"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1.3"
          />
          <circle cx="297" cy="93" r="2.8" fill="var(--accent-2)" className="sys-node-breathe" />
          <text
            x="336"
            y="104"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            WORKERS
          </text>
          <text
            x="336"
            y="122"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
          >
            ASYNC QUEUES
          </text>
        </g>

        {/* NODE 4: DATABASE */}
        <g id="node-database">
          <rect
            x="284"
            y="278"
            width="104"
            height="60"
            rx="5"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1.3"
          />
          <circle cx="297" cy="293" r="2.8" fill="var(--accent-2)" className="sys-node-breathe" />
          <text
            x="336"
            y="304"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            DATABASE
          </text>
          <text
            x="336"
            y="322"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
          >
            PG &amp; REDIS
          </text>
        </g>

        {/* NODE 5: LLM CORE (Focal Reasoning Node) */}
        <g id="node-llm-core">
          {/* Radar Wave Pulse Rings (transform-based for universal browser support) */}
          <circle
            cx="468"
            cy="208"
            r="38"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            className="sys-pulse-ring"
          />
          <circle
            cx="468"
            cy="208"
            r="38"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.2"
            className="sys-pulse-ring-2"
          />

          {/* Node Frame */}
          <rect
            x="414"
            y="172"
            width="108"
            height="72"
            rx="6"
            fill="url(#llmGlow)"
            stroke="var(--accent)"
            strokeWidth="1.8"
            filter="url(#core-glow)"
          />

          {/* Active Badge */}
          <rect x="446" y="163" width="44" height="16" rx="8" fill="var(--accent)" />
          <text
            x="468"
            y="174"
            textAnchor="middle"
            fill="var(--accent-contrast)"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
            fontWeight="bold"
            letterSpacing="0.06em"
          >
            ACTIVE
          </text>

          {/* Node Labels */}
          <text
            x="468"
            y="205"
            textAnchor="middle"
            fill="var(--text)"
            fontFamily="var(--font-mono)"
            fontSize="12"
            fontWeight="bold"
            letterSpacing="0.06em"
          >
            LLM CORE
          </text>
          <text
            x="468"
            y="223"
            textAnchor="middle"
            fill="var(--accent)"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fontWeight="500"
            letterSpacing="0.05em"
          >
            REASONING
          </text>
        </g>

        {/* Blueprint Footer Metadata & Live Telemetry Bars */}
        <line x1="12" y1="398" x2="548" y2="398" stroke="var(--line)" strokeWidth="0.8" />
        <text
          x="24"
          y="418"
          fill="var(--muted)"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="0.05em"
        >
          PIPELINE: CLIENT → API → WORKERS → DB → LLM
        </text>

        {/* Live Telemetry Equalizer Bars */}
        <g transform="translate(310, 408)">
          <rect x="0" y="2" width="3" height="10" rx="1" fill="var(--accent-2)" className="sys-bar" style={{ animationDelay: "0s" }} />
          <rect x="5" y="0" width="3" height="12" rx="1" fill="var(--accent-2)" className="sys-bar" style={{ animationDelay: "0.2s" }} />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="var(--accent)" className="sys-bar" style={{ animationDelay: "0.4s" }} />
          <rect x="15" y="1" width="3" height="11" rx="1" fill="var(--accent-2)" className="sys-bar" style={{ animationDelay: "0.6s" }} />
          <rect x="20" y="4" width="3" height="8" rx="1" fill="var(--accent)" className="sys-bar" style={{ animationDelay: "0.8s" }} />
        </g>

        <text
          x="536"
          y="418"
          textAnchor="end"
          fill="var(--muted)"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="0.05em"
        >
          THROUGHPUT: 18.4K/S · P99: 24ms
        </text>
      </svg>
    </div>
  );
};

export default SystemCoreDiagram;
