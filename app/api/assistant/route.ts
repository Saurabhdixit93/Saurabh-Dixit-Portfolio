import { NextRequest } from 'next/server';
import { AssistantRequestSchema } from './schema';
import { checkRateLimit } from './rateLimit';
import { buildSystemPrompt } from './systemPrompt';
import { generateOfflineResponseStream, isInjectionOrOffTopic, REFUSAL_TEXT } from './offlineRetriever';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


/**
 * Stream Anthropic Messages API
 */
async function streamAnthropic(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  apiKey: string
): Promise<Response> {
  const model = process.env.ASSISTANT_MODEL || 'claude-3-5-sonnet-20241022';
  const systemPrompt = buildSystemPrompt();

  const formattedMessages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user' as const, content: message },
  ];

  const upstreamRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 450,
      system: systemPrompt,
      messages: formattedMessages,
      stream: true,
    }),
  });

  if (!upstreamRes.ok || !upstreamRes.body) {
    throw new Error(`Anthropic error: ${upstreamRes.status} ${upstreamRes.statusText}`);
  }

  const reader = upstreamRes.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.type === 'content_block_delta' && data.delta?.text) {
                  controller.enqueue(encoder.encode(data.delta.text));
                }
              } catch {
                // Ignore partial JSON chunks
              }
            }
          }
        }
      } catch (err) {
        // Stream reading completed or aborted
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache, no-transform',
      'X-Assistant-Mode': 'live-anthropic',
    },
  });
}

/**
 * Stream OpenAI Chat Completions API
 */
async function streamOpenAI(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  apiKey: string
): Promise<Response> {
  const model = process.env.ASSISTANT_MODEL || 'gpt-4o';
  const systemPrompt = buildSystemPrompt();

  const formattedMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user' as const, content: message },
  ];

  const upstreamRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 450,
      messages: formattedMessages,
      stream: true,
    }),
  });

  if (!upstreamRes.ok || !upstreamRes.body) {
    throw new Error(`OpenAI error: ${upstreamRes.status} ${upstreamRes.statusText}`);
  }

  const reader = upstreamRes.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const data = JSON.parse(dataStr);
                const token = data.choices?.[0]?.delta?.content;
                if (token) {
                  controller.enqueue(encoder.encode(token));
                }
              } catch {
                // Ignore partial JSON
              }
            }
          }
        }
      } catch (err) {
        // Stream completed or interrupted
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache, no-transform',
      'X-Assistant-Mode': 'live-openai',
    },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  // 1. IP-Based Sliding Window Rate Limiting (10-15 req/min, default 12)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  const rateResult = checkRateLimit(clientIp);
  if (!rateResult.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests. Please wait a minute before querying the assistant again.',
        retryAfter: rateResult.retryAfter || 60,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateResult.retryAfter || 60),
        },
      }
    );
  }

  // 2. Body Parsing & Zod Schema Validation
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Handle both { message, history } and alternate { messages: [...] }
  let normalizedBody = rawBody;
  if (
    rawBody &&
    typeof rawBody === 'object' &&
    !('message' in rawBody) &&
    'messages' in rawBody &&
    Array.isArray((rawBody as { messages: unknown[] }).messages)
  ) {
    const msgs = (rawBody as { messages: Array<{ role: 'user' | 'assistant'; content: string }> }).messages;
    const lastMsg = msgs[msgs.length - 1];
    normalizedBody = {
      message: lastMsg?.content || '',
      history: msgs.slice(0, -1),
    };
  }

  const parsed = AssistantRequestSchema.safeParse(normalizedBody);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: 'Validation error',
        details: parsed.error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { message, history } = parsed.data;

  // Immediate guard against prompt injections or explicit out-of-scope tasks
  if (isInjectionOrOffTopic(message)) {
    return generateOfflineResponseStream(message, false);
  }

  // 3. Upstream Provider Execution (Anthropic or OpenAI if env key exists)
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    try {
      return await streamAnthropic(message, history, anthropicKey);
    } catch {
      // Graceful fallback on upstream network or quota error
      return generateOfflineResponseStream(message, true);
    }
  }

  if (openaiKey) {
    try {
      return await streamOpenAI(message, history, openaiKey);
    } catch {
      // Graceful fallback on upstream network or quota error
      return generateOfflineResponseStream(message, true);
    }
  }

  // 4. Zero-Key Graceful Grounded Offline Streamer
  return generateOfflineResponseStream(message, false);
}
