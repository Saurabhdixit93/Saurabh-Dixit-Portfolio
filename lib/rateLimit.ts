/**
 * Sliding Window Rate Limiter
 *
 * Reusable in-memory sliding window rate limiter for API routes.
 * Supports configurable limit, window duration, periodic memory garbage collection,
 * dynamic retryAfter calculation, and deterministic resets for test isolation.
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfter?: number; // seconds
}

export class SlidingWindowRateLimiter {
  private limit: number;
  private windowMs: number;
  private ipStore: Map<string, number[]>;
  private lastCleanup: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.ipStore = new Map();
    this.lastCleanup = Date.now();
  }

  /**
   * Periodic garbage collection to remove expired entries and prevent memory leaks.
   */
  private cleanupExpired(now: number, windowMs: number): void {
    if (now - this.lastCleanup < 5 * 60 * 1000) return;
    this.lastCleanup = now;

    const expiry = now - windowMs;
    for (const [ip, timestamps] of this.ipStore.entries()) {
      const valid = timestamps.filter((ts) => ts > expiry);
      if (valid.length === 0) {
        this.ipStore.delete(ip);
      } else {
        this.ipStore.set(ip, valid);
      }
    }
  }

  /**
   * Checks whether the given IP is allowed to proceed under the rate limit.
   */
  public check(
    ip: string,
    customLimit?: number,
    customWindowMs?: number
  ): RateLimitResult {
    const activeLimit = customLimit ?? this.limit;
    const activeWindowMs = customWindowMs ?? this.windowMs;
    const now = Date.now();

    this.cleanupExpired(now, activeWindowMs);

    const expiry = now - activeWindowMs;
    let timestamps = this.ipStore.get(ip) || [];

    // Filter timestamps within current sliding window
    timestamps = timestamps.filter((ts) => ts > expiry);

    if (timestamps.length >= activeLimit) {
      this.ipStore.set(ip, timestamps);
      const oldest = timestamps[0];
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((oldest + activeWindowMs - now) / 1000)
      );
      return {
        allowed: false,
        limit: activeLimit,
        remaining: 0,
        retryAfter: retryAfterSeconds,
      };
    }

    timestamps.push(now);
    this.ipStore.set(ip, timestamps);

    return {
      allowed: true,
      limit: activeLimit,
      remaining: activeLimit - timestamps.length,
    };
  }

  /**
   * Clears all stored rate limit history. Useful for unit tests.
   */
  public reset(): void {
    this.ipStore.clear();
    this.lastCleanup = Date.now();
  }
}

/**
 * Pre-configured contact form rate limiter: 5 submissions per 15 minutes per IP.
 */
export const contactRateLimiter = new SlidingWindowRateLimiter(
  5,
  15 * 60 * 1000
);
