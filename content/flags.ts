/**
 * Application Feature Flags
 * Controls progressive rollouts and optional sections.
 */

export const FEATURE_FLAGS = {
  ENABLE_NOTES: process.env.NEXT_PUBLIC_ENABLE_NOTES === 'true' || false,
} as const;

/**
 * Helper to determine if the Engineering Notes section should be rendered.
 * Allows runtime prop overrides for previews or testing.
 */
export function isNotesEnabled(override?: boolean): boolean {
  if (typeof override === 'boolean') {
    return override;
  }
  return process.env.NEXT_PUBLIC_ENABLE_NOTES === 'true' || FEATURE_FLAGS.ENABLE_NOTES === true;
}
