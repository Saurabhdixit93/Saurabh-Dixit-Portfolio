"use client";

import React from "react";
import { aiWorkflow } from "@/content/ai-workflow";
import { Terminal, ShieldCheck, Cpu, Layers } from "lucide-react";

export const AIToolsGrid: React.FC = () => {
  const tools = aiWorkflow.tools;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "model":
        return <Cpu className="w-4 h-4 text-accent" />;
      case "ide-agent":
        return <Terminal className="w-4 h-4 text-accent" />;
      case "orchestration":
        return <Layers className="w-4 h-4 text-accent" />;
      case "guardrail":
        return <ShieldCheck className="w-4 h-4 text-accent" />;
      default:
        return <Terminal className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline/60">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            [SYS.TOOLING]
          </span>
          <span className="font-mono text-xs text-muted">
            Verified Stack & Daily Production Multipliers
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted">
          Only Tools Actually Used · No Speculative Claims
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const isTodo = tool.verificationStatus === "todo-owner";
          return (
            <div
              key={tool.id}
              className="p-4 rounded-sm bg-surface/90 backdrop-blur-md border border-hairline hover:border-accent/60 transition-colors space-y-2.5 relative flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(tool.category)}
                    <h3 className="font-mono text-xs font-semibold text-text">
                      {tool.name}
                    </h3>
                  </div>

                  {/* Verification Badge */}
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                      isTodo
                        ? "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30"
                        : "bg-accent/10 text-accent border-accent/20"
                    }`}
                  >
                    {isTodo ? "TODO(owner)" : (tool.badge || "VERIFIED")}
                  </span>
                </div>

                <div className="font-mono text-[11px] text-accent mb-1">
                  {tool.role}
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-2 border-t border-hairline/40 flex items-center justify-between text-[10px] font-mono text-muted">
                <span className="uppercase">CAT: {tool.category}</span>
                <span>
                  {isTodo ? "Pending owner confirmation" : "Active in workflow"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIToolsGrid;
