"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0D10] text-[#EDEBE8] font-mono p-8 flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-xl font-bold text-[#FF6A2B] mb-4">// CRITICAL APPLICATION ERROR</h2>
        <p className="text-sm text-gray-400 mb-6 max-w-md">
          An unexpected system fault occurred. Diagnostic state has been isolated.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 border border-[#FF6A2B] text-[#FF6A2B] hover:bg-[#FF6A2B]/10 rounded text-xs uppercase tracking-wider cursor-pointer"
        >
          Recover System
        </button>
      </body>
    </html>
  );
}
