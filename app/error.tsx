"use client";

import * as React from "react";
import Button from "@/components/primitives/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[APPLICATION_RUNTIME_EXCEPTION]", error);
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-bg text-text outline-none">
      <div className="max-w-md w-full bg-surface border border-hairline p-8 relative space-y-6">
        {/* Corner registration mark */}
        <div className="absolute top-0 right-0 p-3 font-mono text-xs text-muted/60 pointer-events-none select-none">
          +
        </div>

        <div className="space-y-2">
          {/* Exact requirement: 500 // pipeline fault */}
          <span className="font-mono text-xs font-semibold text-accent tracking-wider block">
            500 // pipeline fault
          </span>
          <h1 className="font-display text-2xl text-text font-normal">
            Execution Pipeline Fault
          </h1>
          <p className="font-mono text-xs text-muted leading-relaxed">
            An unhandled runtime fault was caught by the boundary supervisor. Diagnostic state has been isolated.
          </p>
        </div>

        {/* Monospace error telemetry panel */}
        <div className="p-3 bg-bg border border-hairline font-mono text-[11px] text-muted space-y-1 break-all">
          <div className="text-accent font-semibold">// ERROR_TELEMETRY</div>
          <div>STATUS: 500_PIPELINE_FAULT</div>
          {error.digest && <div>DIGEST: {error.digest}</div>}
          <div>MESSAGE: {error.message || "Unknown execution exception"}</div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button variant="primary" size="sm" onClick={() => reset()}>
            Retry Pipeline ↺
          </Button>
          <Button variant="outline" size="sm" href="/">
            Return to Root Home →
          </Button>
        </div>
      </div>
    </main>
  );
}
