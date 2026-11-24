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
    console.error("[APPLICATION_RUNTIME_EXCEPTION]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-bg text-text">
      <div className="max-w-md w-full bg-surface border border-hairline p-8 relative space-y-6">
        {/* Corner registration mark */}
        <div className="absolute top-0 right-0 p-3 font-mono text-xs text-muted/60 pointer-events-none select-none">
          +
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold text-red-400 tracking-wider">
            // RUNTIME_EXCEPTION · 500
          </span>
          <h1 className="font-display text-2xl text-text">
            System Execution Interrupted
          </h1>
          <p className="font-mono text-xs text-muted leading-relaxed">
            An unhandled runtime fault was caught by the boundary supervisor. The error details have been recorded.
          </p>
        </div>

        {error.digest && (
          <div className="p-3 bg-bg border border-hairline font-mono text-[11px] text-muted break-all">
            Digest: {error.digest}
          </div>
        )}

        <div className="pt-2 flex flex-wrap gap-3">
          <Button variant="primary" size="sm" onClick={() => reset()}>
            Retry Execution ↺
          </Button>
          <Button variant="outline" size="sm" href="/">
            Return to Root Home →
          </Button>
        </div>
      </div>
    </div>
  );
}
