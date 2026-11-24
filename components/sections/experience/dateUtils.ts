/**
 * Date formatting utilities for experience items.
 *
 * Slices unverified TODO comments in production to ensure clean, professional
 * year intervals ("2025 — Present", "2024 — 2025") without leaking internal notes,
 * while retaining TODO indicators in development mode for engineering visibility.
 */

export function formatExperiencePeriod(
  period: string,
  isProduction: boolean = process.env.NODE_ENV === "production"
): string {
  if (!period) return "";
  if (isProduction) {
    const clean = period.split("//")[0].trim();
    return clean.replace(/\s+/g, " ");
  }
  return period.trim();
}

/**
 * Extracts any developer TODO note attached to an experience period string.
 * Returns null if no TODO comment is present.
 */
export function getExperiencePeriodTodo(period: string): string | null {
  if (!period || !period.includes("//")) return null;
  const parts = period.split("//");
  if (parts.length < 2) return null;
  const comment = parts.slice(1).join("//").trim();
  return comment.length > 0 ? comment : null;
}
