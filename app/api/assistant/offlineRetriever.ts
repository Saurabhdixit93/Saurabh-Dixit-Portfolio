import { assistantKnowledge } from '@/content/assistant-knowledge';
import { profile } from '@/content/profile';

export const REFUSAL_TEXT = `I don't have that information in Saurabh's verified portfolio. You can reach him directly at ${profile.email}.`;

const STOP_WORDS = new Set([
  'what',
  'who',
  'where',
  'when',
  'which',
  'how',
  'why',
  'tell',
  'about',
  'does',
  'have',
  'with',
  'from',
  'this',
  'that',
  'saurabh',
  'dixit',
  "saurabh's",
  'he',
  'his',
  'him',
  'work',
]);

/**
 * Checks for prompt injection, jailbreaking, instruction overrides, or obvious off-topic queries.
 */
export function isInjectionOrOffTopic(query: string): boolean {
  const q = query.toLowerCase().trim();

  // Prompt injection & extraction patterns
  const injectionPatterns = [
    'ignore all previous',
    'ignore previous',
    'ignore instructions',
    'ignore all instructions',
    'disregard all',
    'disregard instructions',
    'system prompt',
    'repeat your instructions',
    'reveal your prompt',
    'what are your instructions',
    'developer mode',
    'dan mode',
    'you are dan',
    'act as an unrestricted',
    'act as',
    'jailbreak',
    'pretend you are',
    'bypass',
    'prompt injection',
  ];

  if (injectionPatterns.some((pattern) => q.includes(pattern))) {
    return true;
  }

  // Explicit DAN check with word boundary
  if (/\bdan\b/i.test(q)) {
    return true;
  }

  // Off-topic categories (trivia, creative writing, unrelated topics)
  const offTopicPatterns = [
    'poem',
    'poetry',
    'write a story',
    'tell me a story',
    'tell me a joke',
    'joke',
    'world cup',
    'who won',
    'weather',
    'recipe',
    'capital of',
    'translate this',
    'president',
    'solve this equation',
    'write a rap',
    'rap song',
  ];

  if (offTopicPatterns.some((pattern) => q.includes(pattern))) {
    return true;
  }

  return false;
}

/**
 * Maps an entry id or category to its primary anchor link in the portfolio.
 */
function getCitationLink(id: string, category: string): string {
  if (id.includes('project') || category === 'projects') return '[#work]';
  if (id.includes('leadership') || id.includes('career') || category === 'experience') return '[#experience]';
  if (id.includes('stack') || category === 'stack') return '[#stack]';
  if (id.includes('contact') || id.includes('availability')) return '[#contact]';
  return '[#about]';
}

/**
 * Deterministically finds the best matching knowledge entry for a query.
 */
export function findBestKnowledgeMatch(query: string): string {
  if (isInjectionOrOffTopic(query)) {
    return REFUSAL_TEXT;
  }

  const normalized = query.toLowerCase().trim();

  // Fast path for canonical suggested prompts
  if (normalized.includes('built with llm') || normalized.includes('llm') || normalized.includes('ai project')) {
    return `Saurabh has architected high-impact LLM systems including the Enterprise AI Code Review Platform (hybrid static analysis + LLM reasoning for GitHub PRs) and Disha AI Health Coach (FastAPI, Python, with episodic patient memory). Both systems enforce rigid deterministic guardrails around probabilistic AI outputs.\n\nSource: AI Platforms ([#work])`;
  }

  if (normalized.includes('leadership') || normalized.includes('lead engineering') || normalized.includes('vp of engineering') || normalized.includes('management')) {
    return `As VP of Engineering at Sensegrass (2025-Present), Saurabh directs cross-functional engineering teams, increasing delivery velocity by +35% through standardized sprint cadences, automated CI/CD guardrails, and architectural RFC reviews. Under his leadership, the team scaled production AI assistants to handle 3× higher usage while maintaining system stability.\n\nSource: Engineering Leadership ([#experience])`;
  }

  if (normalized.includes('open to') || normalized.includes('hire') || normalized.includes('roles') || normalized.includes('opportunities') || normalized.includes('available')) {
    return `Saurabh is currently open to high-impact leadership roles, VP/Staff engineering opportunities, and select technical advisory engagements. You can reach out directly via email at ${profile.email} or connect on LinkedIn (https://www.linkedin.com/in/saurabhdixit93).\n\nSource: Contact & Availability ([#contact])`;
  }

  if (normalized.includes('strongest project') || normalized.includes('flagship') || normalized.includes('best project')) {
    return `Saurabh's flagship project is the Enterprise AI Code Review Platform, an asynchronous worker pipeline combining rule-based linting with LLM reasoning for automated pull request analysis. Built with Next.js, TypeScript, Node.js, MongoDB, and Redis, it processes webhooks with sub-second feedback and zero token waste.\n\nSource: Enterprise AI Code Review Platform ([#work])`;
  }

  const cleanQ = normalized.replace(/[^a-z0-9\s]/gi, '').trim();

  // General keyword and question-pattern scoring across all 15 entries
  let bestScore = 0;
  let bestEntry = assistantKnowledge[0];

  for (const entry of assistantKnowledge) {
    let score = 0;

    // Pattern matching
    if (entry.questionPatterns) {
      for (const pattern of entry.questionPatterns) {
        const pNorm = pattern.toLowerCase();
        const cleanP = pNorm.replace(/[^a-z0-9\s]/gi, '').trim();

        if (cleanQ === cleanP || cleanQ.includes(cleanP)) {
          score += 6;
        } else if (cleanQ.length >= 10 && cleanP.includes(cleanQ)) {
          score += 6;
        } else {
          // Check word overlap with pattern, filtering out common question stop-words and subject entity tokens
          const pWords = cleanP
            .split(/\s+/)
            .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
          const queryTokens = cleanQ.split(/\s+/);
          for (const pw of pWords) {
            if (queryTokens.includes(pw)) score += 2;
          }
        }
      }
    }

    // Keyword matching
    for (const kw of entry.keywords) {
      const kwNorm = kw.toLowerCase().trim();
      if (STOP_WORDS.has(kwNorm) || kwNorm === 'saurabh dixit') continue;
      if (normalized.includes(kwNorm)) {
        score += 3;
      }
    }

    // Category / topic match
    if (normalized.includes(entry.topic.toLowerCase())) {
      score += 4;
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  // Threshold score for match confidence
  if (bestScore >= 3) {
    const citation = getCitationLink(bestEntry.id, bestEntry.category);
    return `${bestEntry.content}\n\nSource: ${bestEntry.topic} (${citation})`;
  }

  // Below confidence threshold -> return grounded refusal
  return REFUSAL_TEXT;
}

/**
 * Generates a streaming Response chunking words with simulated typing latency (~15ms).
 */
export function generateOfflineResponseStream(query: string, isFallback = false): Response {
  const text = findBestKnowledgeMatch(query);
  const words = text.split(' ');
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Approximate ~15ms typing latency (faster in tests if simulated)
          if (process.env.NODE_ENV !== 'test') {
            await new Promise((r) => setTimeout(r, 15));
          }
        }
      } catch (err) {
        // Stream aborted or closed
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
      'X-Assistant-Mode': isFallback ? 'fallback-offline' : 'offline-grounded',
    },
  });
}
