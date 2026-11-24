"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";
import { aiWorkflow } from "@/content/ai-workflow";
import { User, Cpu, FileCode2 } from "lucide-react";

export const AIPipelineDiagram: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
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

      {/* High-Tech Animated Circuit Rail & Stage Dots */}
      <div className="relative w-full py-3 space-y-3">
        {/* Continuous Traveling Shimmer Progress Rail */}
        <div className="relative w-full h-1.5 bg-surface/90 rounded-full overflow-hidden border border-hairline/80">
          {!prefersReducedMotion && (
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent animate-pipeline-shimmer motion-reduce:hidden" />
          )}
        </div>

        {/* 4 Interactive Node Stage Indicators with Synchronized Pulse */}
        <div className="grid grid-cols-4 gap-2 relative z-10 px-2 sm:px-6">
          {stages.map((stage, idx) => (
            <div key={stage.step} className="flex flex-col items-center text-center space-y-1.5">
              {/* Concentric Radar Node Dot */}
              <div className="relative flex items-center justify-center">
                {!prefersReducedMotion && (
                  <span
                    className="absolute w-6 h-6 rounded-full bg-accent/25 animate-ping motion-reduce:hidden"
                    style={{ animationDelay: `${idx * 0.4}s`, animationDuration: "2.4s" }}
                  />
                )}
                <span
                  className="relative w-3.5 h-3.5 rounded-full bg-surface border-2 border-accent shadow-[0_0_8px_var(--accent)] flex items-center justify-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent font-semibold tracking-wider">
                {stage.code}
              </span>
              <span className="font-mono text-[9px] text-muted hidden sm:inline">
                STEP 0{stage.step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pipeline Stage Cards Grid with High-Contrast Backdrop Blur */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <div
            key={stage.step}
            className="relative p-5 rounded-sm bg-surface/90 backdrop-blur-md border border-hairline hover:border-accent/70 transition-all flex flex-col justify-between space-y-3 group shadow-sm"
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
            <div className="pt-2 border-t border-hairline/40 flex items-center gap-1.5 text-[10px] font-mono text-muted">
              <FileCode2 className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate">{stage.deliverable}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPipelineDiagram;
