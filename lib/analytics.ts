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
 * Dispatches an analytics event across configured telemetry channels.
 * - Records in memory buffer for inspection & testing
 * - Emits [TELEMETRY] console log in development mode
 * - Dispatches 'portfolio:analytics' DOM CustomEvent
 * - Safe call to window.va (Vercel Analytics) if present
 */
export function trackEvent<E extends AnalyticsEventName>(
  event: E,
  properties?: AnalyticsEventMap[E]
): void {
  const record: TrackedEventRecord<E> = {
    event,
    properties,
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
    console.log('[TELEMETRY]', event, properties ?? {});
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
        data: properties as Record<string, unknown> | undefined,
      });
    } else if (typeof win.plausible === 'function') {
      win.plausible(event, {
        props: (properties ?? {}) as Record<string, unknown>,
      });
    } else if (typeof win.gtag === 'function') {
      win.gtag('event', event, (properties ?? {}) as Record<string, unknown>);
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
