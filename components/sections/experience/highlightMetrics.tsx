import React from "react";

const METRIC_SPLIT_REGEX = /([+−-]?\d+%(?!\w)|[+−-]?\d+[×x](?!\w))/gi;
const SINGLE_METRIC_REGEX = /^[+−-]?\d+(?:%|[×x])$/i;

export interface HighlightMetricsProps {
  text: string;
  className?: string;
}

/**
 * Automatically tokenizes a text string and wraps verified quantitative metrics
 * (e.g. "+35%", "3×", "+30%", "-45%") in `<span className="font-mono font-semibold text-accent">`.
 */
export function highlightMetricsText(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts = text.split(METRIC_SPLIT_REGEX);
  return parts.map((part, index) => {
    if (SINGLE_METRIC_REGEX.test(part)) {
      return (
        <span key={index} className="font-mono font-semibold text-accent">
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const HighlightMetrics: React.FC<HighlightMetricsProps> = ({
  text,
  className = "",
}) => {
  return <span className={className}>{highlightMetricsText(text)}</span>;
};

export default HighlightMetrics;
