"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";
import { aiWorkflow } from "@/content/ai-workflow";
import { CheckCircle2, User, Cpu, FileCode2 } from "lucide-react";

export const AIPipelineDiagram: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const stages = aiWorkflow.pipelineStages;

  return (
    <div className="space-y-6">
      {/* Title & Pipeline Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline/60">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            [SYS.PIPELINE]
          </span>
          <span className="font-mono text-xs text-muted">
            Bounded Reasoning to Production Delivery
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted">
          Continuous Invariant Enforcement
        </span>
      </div>

      {/* SVG Circuit Connector for Desktop (md+) */}
      <div className="hidden md:block relative w-full px-6 py-2">
        <svg
          viewBox="0 0 1000 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 overflow-visible"
          aria-hidden="true"
        >
          {/* Base circuit rail */}
          <line
            x1="50"
            y1="18"
            x2="950"
            y2="18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-border-hairline"
          />

          {/* Animated signal pulse if motion allowed */}
          {!prefersReducedMotion && (
            <circle
              cx="50"
              cy="18"
              r="4"
              className="fill-accent filter drop-shadow-[0_0_6px_var(--accent)]"
            >
              <animate
                attributeName="cx"
                values="50;950"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* 4 Stage Nodes on Circuit */}
          {[125, 375, 625, 875].map((cx, idx) => (
            <g key={idx}>
              <circle
                cx={cx}
                cy="18"
                r="7"
                className="fill-bg stroke-accent"
                strokeWidth="2"
              />
              <circle cx={cx} cy="18" r="2.5" className="fill-accent" />
            </g>
          ))}
        </svg>
      </div>

      {/* 4 Pipeline Stage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <div
            key={stage.step}
            className="relative p-4 rounded bg-surface/50 border border-hairline hover:border-accent/60 transition-colors flex flex-col justify-between space-y-3 group"
          >
            {/* Header / Step code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] font-semibold text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
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
                  <strong className="font-mono font-medium text-muted">Human:</strong>{" "}
                  {stage.humanRole}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-text">
                <Cpu className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong className="font-mono font-medium text-muted">AI Role:</strong>{" "}
                  {stage.aiRole}
                </span>
              </div>
            </div>

            {/* Deliverable Tag */}
            <div className="pt-2 border-t border-hairline/40 flex items-center gap-1.5 text-[10px] font-mono text-muted">
              <FileCode2 className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate">
                {stage.deliverable}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPipelineDiagram;
