"use client";

import * as React from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0D10] text-[#EDEBE8] font-mono p-6 sm:p-8 flex flex-col items-center justify-center min-h-screen text-center selection:bg-[#FF6A2B] selection:text-white">
        <div className="max-w-md w-full border border-white/10 bg-[#12151A] p-8 rounded-lg shadow-2xl space-y-6 text-left">
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold text-[#FF6A2B] tracking-wider block">
              500 // pipeline fault · global
            </span>
            <h1 className="text-2xl font-serif text-white font-normal">
              Root Execution Interrupted
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed font-mono">
              The root layout supervisor intercepted an unrecoverable exception.
            </p>
          </div>

          {error.digest && (
            <div className="p-3 bg-[#0B0D10] border border-white/10 text-[11px] text-gray-400 font-mono break-all">
              <span className="text-[#FF6A2B] font-semibold">DIGEST: </span>
              {error.digest}
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => reset()}
              type="button"
              className="px-4 py-2 bg-[#FF6A2B] text-white hover:bg-[#FF6A2B]/90 transition-colors rounded text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
            >
              Retry Pipeline ↺
            </button>
            <Link
              href="/"
              className="px-4 py-2 border border-white/20 text-gray-300 hover:text-white hover:border-[#FF6A2B] transition-colors rounded text-xs font-mono uppercase tracking-wider"
            >
              Return Home →
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
