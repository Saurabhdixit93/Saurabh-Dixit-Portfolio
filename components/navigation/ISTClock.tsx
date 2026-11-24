"use client";

import * as React from "react";

export interface ISTClockProps {
  className?: string;
  showSeconds?: boolean;
  showLabel?: boolean;
  showIcon?: boolean;
}

/**
 * Format a given Date object to Indian Standard Time (Asia/Kolkata, UTC+5:30).
 * Exported for deterministic unit testing.
 */
export function formatISTTime(
  date: Date,
  options: { showSeconds?: boolean } = { showSeconds: true }
): string {
  const { showSeconds = true } = options;
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    ...(showSeconds ? { second: "2-digit" } : {}),
    hour12: false,
  });

  return formatter.format(date);
}

export function ISTClock({
  className = "",
  showSeconds = true,
  showLabel = true,
  showIcon = true,
}: ISTClockProps) {
  const [mounted, setMounted] = React.useState(false);
  const [timeString, setTimeString] = React.useState<string>("");

  React.useEffect(() => {
    setMounted(true);
    // Initialize immediately upon mount
    setTimeString(formatISTTime(new Date(), { showSeconds }));

    const interval = setInterval(() => {
      setTimeString(formatISTTime(new Date(), { showSeconds }));
    }, 1000);

    return () => clearInterval(interval);
  }, [showSeconds]);

  const placeholder = showSeconds ? "--:--:-- IST" : "--:-- IST";
  const displayTime = mounted && timeString ? `${timeString} IST` : placeholder;

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono text-xs tabular-nums text-muted ${className}`}
      aria-label="Indian Standard Time"
      title="Indian Standard Time (UTC+5:30) - Asia/Kolkata"
    >
      {showIcon && (
        <span
          className="relative flex h-2 w-2 items-center justify-center"
          aria-hidden="true"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              mounted ? "bg-accent/80 animate-pulse" : "bg-muted/40"
            }`}
          />
        </span>
      )}
      <span>{displayTime}</span>
      {showLabel && (
        <span className="text-[10px] text-muted/70 tracking-wider uppercase hidden sm:inline">
          (UTC+5:30)
        </span>
      )}
    </div>
  );
}

export default ISTClock;
