"use client";

import React from "react";
import Section from "@/components/primitives/Section";
import { aiWorkflow } from "@/content/ai-workflow";
import { AIPipelineDiagram } from "./ai-workflow/AIPipelineDiagram";
import { AIToolsGrid } from "./ai-workflow/AIToolsGrid";
import { AssistantTeaser } from "./ai-workflow/AssistantTeaser";
import { ShieldCheck, Compass, CheckCircle2 } from "lucide-react";

export interface AIWorkflowProps {
  id?: string;
  className?: string;
}

export const AIWorkflow: React.FC<AIWorkflowProps> = ({
  id = "ai-workflow",
  className = "",
}) => {
  return (
    <Section
      id={id}
      annotation={aiWorkflow.eyebrow}
      heading={aiWorkflow.heading}
      subheading={aiWorkflow.subheading}
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      {/* Anchor target for #assistant commands */}
      <span id="assistant" className="absolute -top-24" aria-hidden="true" />

      <div className="space-y-12 md:space-y-16">
        {/* Philosophy & Guardrails Narrative Block */}
        <div className="p-6 md:p-8 rounded bg-surface/90 backdrop-blur-md border border-hairline space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent" />
            <h3 className="font-mono text-sm font-semibold tracking-wide text-text uppercase">
              {aiWorkflow.philosophyTitle}
            </h3>
          </div>

          <p className="text-sm md:text-base text-muted leading-relaxed max-w-4xl">
            {aiWorkflow.philosophyDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-hairline/60">
            {aiWorkflow.philosophyBullets.map((bullet, idx) => {
              const [prefix, rest] = bullet.split(": ");
              return (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-text font-mono font-medium">{prefix}:</strong>{" "}
                    {rest}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-Stage Idea to Production Pipeline Diagram */}
        <AIPipelineDiagram />

        {/* Verified Tools Grid with TODO(owner) Badges */}
        <AIToolsGrid />

        {/* Live Assistant Teaser Card */}
        <AssistantTeaser />
      </div>
    </Section>
  );
};

export default AIWorkflow;
