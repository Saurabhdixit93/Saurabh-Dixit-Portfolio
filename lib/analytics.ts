/**
 * Telemetry & Analytics Dispatch Infrastructure for Saurabh Dixit's Portfolio
 * Safe against SSR, adblockers, and missing third-party SDKs.
 * Privacy-preserving: never records raw PII or user-entered prompt text.
 */

export type AnalyticsEventMap = {
  cta_click: {
    target: string;
    location: string;
    label?: string;
    href?: string;
  };
  resume_download: {
    source: string;
    format?: string;
  };
  contact_submit: {
    intent: string;
    messageLength: number;
  };
  assistant_open: {
    trigger: 'header' | 'hud' | 'hero' | 'teaser' | 'palette' | 'hotkey' | 'contact' | string;
  };
  assistant_message: {
    role: 'user' | 'assistant';
    queryLength?: number;
    suggestedPrompt?: boolean;
  };
  project_open: {
    slug: string;
    title: string;
    linkType: 'case_study' | 'live' | 'repo' | string;
  };
  theme_toggle: {
    theme: 'graphite' | 'paper' | string;
    source?: string;
  };
  palette_open: {
    source: 'hotkey' | 'button' | 'hud' | string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export interface TrackedEventRecord<E extends AnalyticsEventName = AnalyticsEventName> {
  event: E;
  properties?: AnalyticsEventMap[E];
  timestamp: number;
}

const eventHistory: TrackedEventRecord[] = [];
const MAX_HISTORY = 100;

/**
 * Strict runtime property allowlist per event type.
 * Prevents raw PII, prompt text, form messages, or arbitrary extra fields
 * (e.g. via structural typing, object spreads, or `as any` casts) from leaking
 * into history, console logs, DOM events, or third-party analytics providers.
 */
const EVENT_PROPERTY_ALLOWLIST: Record<AnalyticsEventName, readonly string[]> = {
  cta_click: ['target', 'location', 'label', 'href'],
  resume_download: ['source', 'format'],
  contact_submit: ['intent', 'messageLength'],
  assistant_open: ['trigger'],
  assistant_message: ['role', 'queryLength', 'suggestedPrompt'],
  project_open: ['slug', 'title', 'linkType', 'featured'],
  theme_toggle: ['theme', 'source'],
  palette_open: ['source', 'trigger'],
};

function sanitizeEventProperties<E extends AnalyticsEventName>(
  event: E,
  properties?: AnalyticsEventMap[E]
): AnalyticsEventMap[E] | undefined {
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) {
    return undefined;
  }

  const allowedKeys = EVENT_PROPERTY_ALLOWLIST[event];
  if (!allowedKeys) {
    return undefined;
  }

  const sanitized: Record<string, unknown> = {};
  const raw = properties as Record<string, unknown>;

  for (const key of allowedKeys) {
    if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
    const value = raw[key];
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      sanitized[key] = value;
    }
  }

  return Object.keys(sanitized).length > 0
    ? (sanitized as AnalyticsEventMap[E])
    : undefined;
}

/**
 * Dispatches an analytics event across configured telemetry channels.
 * - Sanitizes properties at runtime via strict per-event allowlist
 * - Records in memory buffer for inspection & testing
 * - Emits [TELEMETRY] console log in development mode
 * - Dispatches 'portfolio:analytics' DOM CustomEvent
 * - Safe call to window.va (Vercel Analytics) if present
 */
export function trackEvent<E extends AnalyticsEventName>(
  event: E,
  properties?: AnalyticsEventMap[E]
): void {
  const sanitizedProperties = sanitizeEventProperties(event, properties);
  const record: TrackedEventRecord<E> = {
    event,
    properties: sanitizedProperties,
    timestamp: Date.now(),
  };

  // 1. Maintain in-memory history buffer (useful for test assertions)
  eventHistory.unshift(record);
  if (eventHistory.length > MAX_HISTORY) {
    eventHistory.pop();
  }

  // 2. Telemetry console log in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[TELEMETRY]', event, sanitizedProperties ?? {});
  }

  // 3. Safe check for SSR environment
  if (typeof window === 'undefined') {
    return;
  }

  // 4. Dispatch custom DOM event for decoupled application listeners
  try {
    window.dispatchEvent(
      new CustomEvent('portfolio:analytics', {
        detail: record,
      })
    );
  } catch {
    // Silent failure on custom event error
  }

  // 5. Safe call to Vercel Analytics / third-party providers
  try {
    const win = window as unknown as {
      va?: (type: string, data: { name: string; data?: Record<string, unknown> }) => void;
      plausible?: (event: string, options?: { props: Record<string, unknown> }) => void;
      gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
    };

    if (typeof win.va === 'function') {
      win.va('event', {
        name: event,
        data: sanitizedProperties as Record<string, unknown> | undefined,
      });
    } else if (typeof win.plausible === 'function') {
      win.plausible(event, {
        props: (sanitizedProperties ?? {}) as Record<string, unknown>,
      });
    } else if (typeof win.gtag === 'function') {
      win.gtag('event', event, (sanitizedProperties ?? {}) as Record<string, unknown>);
    }
  } catch {
    // Adblockers or provider script faults fail silently
  }
}

/**
 * Returns a read-only snapshot of recently dispatched events.
 */
export function getRecentEvents(): readonly TrackedEventRecord[] {
  return [...eventHistory];
}

/**
 * Clears the in-memory event buffer.
 */
export function clearEventHistory(): void {
  eventHistory.length = 0;
}
