import React from "react";

export interface OwnerTodoCalloutProps {
  todo?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * OwnerTodoCallout: Isolates missing/unconfirmed facts.
 * In development, renders an amber blueprint annotation banner.
 * In production (`process.env.NODE_ENV === 'production'`), returns null to prevent
 * unverified claims or TODO markers from ever entering the production DOM.
 */
export function OwnerTodoCallout({
  todo,
  children,
  className = "",
}: OwnerTodoCalloutProps) {
  // Master Rule: In production, unverified owner TODOs are completely isolated (hidden)
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const content = todo || children;
  if (!content) return null;

  return (
    <div
      role="note"
      aria-label="Owner pending verification"
      className={`my-3 p-3 rounded border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs leading-relaxed flex items-start gap-2.5 ${className}`}
    >
      <span className="text-amber-500 font-bold shrink-0">// VERIFIED:</span>
      <div className="flex-1 opacity-90">{content}</div>
    </div>
  );
}

export default OwnerTodoCallout;
