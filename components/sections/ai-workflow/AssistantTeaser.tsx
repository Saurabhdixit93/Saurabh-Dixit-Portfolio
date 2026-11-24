"use client";

import React from "react";
import { aiWorkflow } from "@/content/ai-workflow";
import { useAssistant } from "@/components/assistant/AssistantContext";
import { Bot, ArrowRight, Sparkles, Terminal } from "lucide-react";

export const AssistantTeaser: React.FC = () => {
  const { openAssistant } = useAssistant();
  const teaser = aiWorkflow.assistantTeaser;

  return (
    <div className="relative p-6 sm:p-8 rounded-sm bg-surface/90 backdrop-blur-md border border-hairline hover:border-accent/50 transition-colors shadow-lg overflow-hidden">
      {/* Background Blueprint Grid Accents */}
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <Terminal className="w-32 h-32 text-accent" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Teaser Copy */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
              {teaser.badge}
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-text font-normal">
            {teaser.headline}
          </h3>

          <p className="text-sm text-muted leading-relaxed">
            {teaser.subcopy}
          </p>

          {/* Quick Click Prompts */}
          <div className="pt-2 flex flex-wrap gap-2">
            {teaser.suggestedPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => openAssistant(prompt)}
                className="font-mono text-[11px] px-2.5 py-1 rounded bg-bg/80 border border-hairline hover:border-accent text-muted hover:text-text transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-accent" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Launch Action */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0">
          <button
            onClick={() => openAssistant()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded bg-accent text-white font-mono text-xs font-semibold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md group"
            aria-label="Launch Ask Saurabh AI Assistant"
          >
            <Bot className="w-4 h-4" />
            <span>{teaser.buttonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <span className="font-mono text-[11px] text-muted">
            {teaser.shortcutHint}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssistantTeaser;
