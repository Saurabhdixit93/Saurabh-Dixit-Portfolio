import React from "react";
import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-bg text-text flex items-center justify-center py-20 px-4 relative overflow-hidden outline-none">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

      <Container size="prose" className="relative z-10 text-center">
        <div className="border border-hairline bg-surface/90 backdrop-blur-md rounded-xl p-8 sm:p-12 shadow-xl relative">
          {/* Blueprint Corner Marks */}
          <span className="corner-mark corner-mark-tl" aria-hidden="true" />
          <span className="corner-mark corner-mark-tr" aria-hidden="true" />
          <span className="corner-mark corner-mark-bl" aria-hidden="true" />
          <span className="corner-mark corner-mark-br" aria-hidden="true" />

          {/* Eyebrow: Exact requirement 404 // node not found */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-accent/30 bg-accent/10 font-mono text-xs text-accent mb-6">
            <Terminal className="w-3.5 h-3.5" />
            <span>404 // node not found</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text font-normal mb-4">
            System Topology Exception
          </h1>

          <p className="font-sans text-sm sm:text-base text-muted max-w-md mx-auto mb-6 leading-relaxed">
            The requested architecture node or case study route does not exist in the active system topology.
          </p>

          {/* Monospace telemetry diagnostics */}
          <div className="p-3 bg-bg border border-hairline font-mono text-[11px] text-muted max-w-sm mx-auto mb-8 text-left space-y-1">
            <div className="text-accent font-semibold">// DIAGNOSTIC_TELEMETRY</div>
            <div>STATUS: 404_ROUTE_UNRESOLVED</div>
            <div>ROUTER: Next.js App Router</div>
            <div>ACTION: Reroute to root topology</div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-xs font-medium bg-accent text-[var(--accent-contrast)] hover:bg-accent/90 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Root Home →</span>
            </Link>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-xs font-medium border border-hairline bg-surface/50 text-text hover:border-accent hover:text-accent transition-colors"
            >
              <span>Explore Selected Work</span>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
