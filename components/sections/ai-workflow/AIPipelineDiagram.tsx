"use client";

import React from "react";
import { aiWorkflow } from "@/content/ai-workflow";
import { User, Cpu, FileCode2 } from "lucide-react";

export const AIPipelineDiagram: React.FC = () => {
  const prefersReducedMotion = false;
  const stages = aiWorkflow.pipelineStages;

  return (
    <div className="space-y-6">
      {/* Title & Pipeline Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline/60">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            {!prefersReducedMotion && (
              <span className="animate-ping motion-reduce:hidden absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            )}
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent shadow-[0_0_8px_var(--accent)]" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold">
            [SYS.PIPELINE]
          </span>
          <span className="font-mono text-xs text-muted">
            Bounded Reasoning to Production Delivery
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full bg-accent2 ${
              prefersReducedMotion ? "" : "animate-pulse motion-reduce:animate-none"
            }`}
          />
          <span className="font-mono text-[11px] text-text font-medium">
            Continuous Invariant Enforcement
          </span>
        </div>
      </div>

      {/* High-Tech Animated Circuit Rail & Stage Nodes */}
      <div className="relative w-full pt-2 pb-1">
        {/* Continuous Traveling Shimmer Progress Rail */}
        <div className="relative w-full h-1.5 bg-surface/90 rounded-full overflow-hidden border border-hairline/80 mb-5">
          {!prefersReducedMotion && (
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent animate-pipeline-shimmer motion-reduce:hidden" />
          )}
        </div>

        {/* SVG Circuit Bus Connecting the 4 Stage Nodes + Vertical Drop Lines */}
        <div className="relative">
          <svg
            viewBox="0 0 800 52"
            preserveAspectRatio="none"
            className="hidden lg:block absolute top-1 left-0 w-full h-12 pointer-events-none"
            aria-hidden="true"
          >
            {/* Base horizontal bus line across all 4 centers (100, 300, 500, 700) */}
            <line
              x1="100"
              y1="10"
              x2="700"
              y2="10"
              stroke="var(--line)"
              strokeWidth="1.5"
            />
            {/* Vertical drop lines from each node down toward its card */}
            {[100, 300, 500, 700].map((cx, i) => (
              <g key={cx}>
                <line
                  x1={cx}
                  y1="10"
                  x2={cx}
                  y2="52"
                  stroke="var(--line)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                {!prefersReducedMotion && (
                  <>
                    <line
                      x1={cx}
                      y1="10"
                      x2={cx}
                      y2="52"
                      stroke="var(--accent)"
                      strokeWidth="1.6"
                      strokeDasharray="6 10"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="16"
                        to="0"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                    </line>
                    <circle r="2.5" fill="var(--accent)">
                      <animateMotion
                        dur="1.8s"
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                        path={`M ${cx} 10 L ${cx} 52`}
                      />
                    </circle>
                  </>
                )}
              </g>
            ))}
            {/* Animated glowing signal trace */}
            {!prefersReducedMotion && (
              <>
                <line
                  x1="100"
                  y1="10"
                  x2="700"
                  y2="10"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="48 160"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="208"
                    to="0"
                    dur="2.6s"
                    repeatCount="indefinite"
                  />
                </line>
                <circle r="3.5" fill="var(--accent-2)">
                  <animateMotion
                    dur="2.6s"
                    repeatCount="indefinite"
                    path="M 100 10 L 700 10"
                  />
                </circle>
              </>
            )}
          </svg>

          {/* 4 Interactive Node Stage Indicators */}
          <div className="grid grid-cols-4 gap-2 relative z-10 px-2 sm:px-6">
            {stages.map((stage, idx) => (
              <div
                key={stage.step}
                className="flex flex-col items-center text-center space-y-1.5"
              >
                <div className="relative flex items-center justify-center">
                  {!prefersReducedMotion && (
                    <span
                      className="absolute w-6 h-6 rounded-full bg-accent/25 animate-ping motion-reduce:hidden"
                      style={{
                        animationDelay: `${idx * 0.4}s`,
                        animationDuration: "2.4s",
                      }}
                    />
                  )}
                  <span className="relative w-4 h-4 rounded-full bg-surface border-2 border-accent shadow-[0_0_10px_var(--accent)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </span>
                </div>
                <span className="font-mono text-[10px] text-accent font-semibold tracking-wider bg-bg/80 px-1.5 rounded">
                  {stage.code}
                </span>
                <span className="font-mono text-[9px] text-muted hidden sm:inline bg-bg/85 px-1.5 rounded">
                  STEP 0{stage.step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Pipeline Stage Cards Grid with Corner Registration Marks & Unified Border Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <div
            key={stage.step}
            className="relative p-5 rounded-none bg-surface/95 backdrop-blur-md border border-hairline transition-all duration-300 flex flex-col justify-between gap-3 group shadow-sm hover:shadow-[0_0_24px_rgba(255,106,43,0.12)]"
          >
            {/* Unified Perimeter Hover Border Trace (sits directly on the -1px border frame alongside corner marks) */}
            <div className="pointer-events-none absolute -inset-[1px] z-10" aria-hidden="true">
              <span className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-accent via-accent2 to-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              <span className="absolute top-0 right-0 bottom-0 w-[1.5px] bg-gradient-to-b from-accent via-accent2 to-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-75 ease-out" />
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-l from-accent via-accent2 to-accent origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-150 ease-out" />
              <span className="absolute top-0 left-0 bottom-0 w-[1.5px] bg-gradient-to-t from-accent via-accent2 to-accent origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-200 ease-out" />
            </div>

            {/* Blueprint Corner Registration Marks - flush on exact -1px corners */}
            <span className="corner-mark corner-mark-tl opacity-85 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            <span className="corner-mark corner-mark-tr opacity-85 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            <span className="corner-mark corner-mark-bl opacity-85 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            <span className="corner-mark corner-mark-br opacity-85 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

            {/* Header / Step code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] font-semibold text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/25">
                  {stage.code}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  STEP 0{stage.step}
                </span>
              </div>
              <h3 className="font-mono text-sm font-semibold text-text group-hover:text-accent transition-colors">
                {stage.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed mt-1">
                {stage.description}
              </p>
            </div>

            {/* Roles Division */}
            <div className="pt-2 border-t border-hairline/60 space-y-1.5 text-[11px]">
              <div className="flex items-start gap-1.5 text-text">
                <User className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong className="font-mono font-medium text-muted">
                    Human:
                  </strong>{" "}
                  {stage.humanRole}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-text">
                <Cpu className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong className="font-mono font-medium text-muted">
                    AI Role:
                  </strong>{" "}
                  {stage.aiRole}
                </span>
              </div>
            </div>

            {/* Deliverable Tag */}
            <div className="pt-2 border-t border-hairline/40 flex items-start gap-1.5 text-[10px] font-mono text-muted">
              <FileCode2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
              <span className="leading-snug">{stage.deliverable}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPipelineDiagram;
