/**
 * In-Memory Sliding Window Rate Limiter
 * Enforces IP-based rate limiting (10-15 requests/minute, default 12) with automatic garbage collection.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const windowMs = 60 * 1000; // 1 minute window
const maxRequests = 12; // 12 requests per window

const ipStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;

  const expiry = now - windowMs;
  for (const [ip, record] of ipStore.entries()) {
    const valid = record.timestamps.filter((ts) => ts > expiry);
    if (valid.length === 0) {
      ipStore.delete(ip);
    } else {
      record.timestamps = valid;
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfter?: number;
}

export function checkRateLimit(ip: string, customLimit = maxRequests, customWindowMs = windowMs): RateLimitResult {
  cleanupExpired();
  const now = Date.now();
  const expiry = now - customWindowMs;

  let record = ipStore.get(ip);
  if (!record) {
    record = { timestamps: [] };
    ipStore.set(ip, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > expiry);

  if (record.timestamps.length >= customLimit) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + customWindowMs - now) / 1000));
    return {
      allowed: false,
      limit: customLimit,
      remaining: 0,
      retryAfter: retryAfterSeconds,
    };
  }

  record.timestamps.push(now);

  return {
    allowed: true,
    limit: customLimit,
    remaining: customLimit - record.timestamps.length,
  };
}

export function resetRateLimits(): void {
  ipStore.clear();
}
