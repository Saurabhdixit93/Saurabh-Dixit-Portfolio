"use client";

import * as React from "react";

export interface LineEndpoint {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  targetName: string;
}

export interface StackConnectorSvgProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  chipElements: Map<string, HTMLButtonElement>;
  activeTech: string | null;
  relatedTechs: string[];
  className?: string;
}

export const StackConnectorSvg: React.FC<StackConnectorSvgProps> = ({
  containerRef,
  chipElements,
  activeTech,
  relatedTechs,
  className = "",
}) => {
  const [lines, setLines] = React.useState<LineEndpoint[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const calculateConnections = React.useCallback(() => {
    if (!mounted || !containerRef.current || !activeTech || relatedTechs.length === 0) {
      setLines([]);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const calculatedLines: LineEndpoint[] = [];

    // Find active element(s) matching activeTech (supporting multi-node instances like TypeScript)
    const activeCenters: Array<{ x: number; y: number }> = [];
    for (const [key, el] of Array.from(chipElements.entries())) {
      const techName = el.getAttribute("data-tech-name");
      if (techName === activeTech) {
        const rect = el.getBoundingClientRect();
        activeCenters.push({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        });
      }
    }

    if (activeCenters.length === 0) {
      setLines([]);
      return;
    }

    // Find related element(s) matching any in relatedTechs
    for (const [key, el] of Array.from(chipElements.entries())) {
      const techName = el.getAttribute("data-tech-name");
      if (techName && relatedTechs.includes(techName)) {
        const rect = el.getBoundingClientRect();
        const targetCenter = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };

        for (const activeCenter of activeCenters) {
          calculatedLines.push({
            startX: activeCenter.x,
            startY: activeCenter.y,
            endX: targetCenter.x,
            endY: targetCenter.y,
            targetName: techName,
          });
        }
      }
    }

    setLines(calculatedLines);
  }, [mounted, containerRef, chipElements, activeTech, relatedTechs]);

  // Recalculate on state changes and on resize
  React.useEffect(() => {
    calculateConnections();

    const handleResize = () => {
      calculateConnections();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleResize, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      observer = new ResizeObserver(() => {
        calculateConnections();
      });
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [calculateConnections, containerRef]);

  if (!mounted || !activeTech || lines.length === 0) {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full z-15 hidden md:block ${className}`}
    >
      <defs>
        <filter id="connector-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {lines.map((line, idx) => {
        const controlY = (line.startY + line.endY) / 2;
        const pathData = `M ${line.startX} ${line.startY} C ${line.startX} ${controlY}, ${line.endX} ${controlY}, ${line.endX} ${line.endY}`;

        return (
          <g key={`${line.targetName}-${line.startX.toFixed(1)}-${line.startY.toFixed(1)}-${idx}`}>
            {/* Soft background glow line */}
            <path
              d={pathData}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeOpacity="0.25"
              filter="url(#connector-glow)"
            />
            {/* Crisp dashed connector line */}
            <path
              d={pathData}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.85"
            />
            {/* Terminal start dot */}
            <circle
              cx={line.startX}
              cy={line.startY}
              r="3.5"
              fill="var(--accent)"
              className="drop-shadow-[0_0_6px_var(--accent)]"
            />
            {/* Terminal end dot */}
            <circle
              cx={line.endX}
              cy={line.endY}
              r="3"
              fill="var(--accent)"
              className="drop-shadow-[0_0_6px_var(--accent)]"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default StackConnectorSvg;
