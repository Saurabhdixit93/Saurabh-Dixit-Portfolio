import { assistantKnowledge } from '@/content/assistant-knowledge';
import { profile } from '@/content/profile';

export function buildMailtoLink(
  email: string = profile.email,
  subject: string = 'Inquiry via Systems Blueprint Portfolio',
  body: string = 'Hi Saurabh,\n\nI was reviewing your Systems Blueprint portfolio (https://www.saurabhdixit93.site) and wanted to connect regarding:\n\n'
): string {
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encSubject}&body=${encBody}`;
}

export const REFUSAL_TEXT = `I don't have that information in Saurabh's verified portfolio. You can reach him directly at [${profile.email}](${buildMailtoLink(profile.email, 'Portfolio Inquiry - Additional Context', 'Hi Saurabh,\n\nI was inquiring through your portfolio assistant and wanted to follow up with you directly regarding:\n\n')}).`;

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
  const cleanQ = normalized.replace(/[^a-z0-9\s]/gi, '').trim();

  // Conversational Intent: Casual Acknowledgments (e.g., "ok", "okkk", "cool", "got it", "thanks")
  if (/^(ok+|okk+|cool|nice|got it|great|thanks|thank you|perfect|sounds good|alright|fine|k|sure|cheers)[\s!.]*$/i.test(normalized)) {
    return `Glad to help! You can ask me anything about Saurabh's engineering leadership at Sensegrass, verified system metrics (+35% velocity, 3× AI scale), architecture case studies ([#work]), 5-tier technical stack ([#stack]), or how to contact him ([#contact]).`;
  }

  // Conversational Intent: Friendly Greetings (e.g., "hi", "hello", "hey")
  if (/^(hi+|hello+|hey+|hola|namaste|good (morning|afternoon|evening)|howdy|greetings)[\s!.]*$/i.test(normalized)) {
    return `Hello! I am Saurabh's verified portfolio assistant. I can answer inquiries about his role as VP of Engineering at Sensegrass, verified metrics (+35% velocity, -45% incidents), production architecture case studies ([#work]), tech stack ([#stack]), and availability ([#contact]). What would you like to know?`;
  }

  // Identity / Overview / Bio
  if (
    normalized === 'about' ||
    normalized.includes('who is') ||
    normalized.includes('who are you') ||
    normalized.includes('tell me about yourself') ||
    normalized.includes('tell me about saurabh') ||
    normalized === 'saurabh' ||
    normalized === 'saurabh dixit'
  ) {
    return `Saurabh Dixit is a Full-Stack Engineer and VP of Engineering at Sensegrass based in India (IST, UTC+5:30). He specializes in scalable AI platforms, distributed systems, and high-velocity engineering delivery. He holds a Bachelor of Science (Maths & Science) from Bundelkhand University, Jhansi (2019 — 2022).\n\nSource: Systems Profile & Identity ([#about])`;
  }

  // Resume / CV inquiries
  if (
    normalized.includes('resume') ||
    normalized.includes('cv') ||
    normalized.includes('curriculum vitae') ||
    normalized.includes('download resume') ||
    normalized.includes('pdf')
  ) {
    return `You can download Saurabh Dixit's complete verified resume (PDF) directly from the top navigation bar or the hero section ([#about]). It details his 3+ years of production experience, VP of Engineering leadership at Sensegrass, and verified system metrics.\n\nSource: Resume & Academic Foundation ([#about])`;
  }

  // Education / Degree / Academic foundation
  if (
    normalized.includes('education') ||
    normalized.includes('degree') ||
    normalized.includes('university') ||
    normalized.includes('college') ||
    normalized.includes('bundelkhand') ||
    normalized.includes('maths') ||
    normalized.includes('bsc') ||
    normalized.includes('bachelor')
  ) {
    return `Saurabh holds a Bachelor of Science (B.Sc.) in Mathematics & Science from Bundelkhand University, Jhansi (2019 — 2022). His mathematical foundation in numerical analysis, discrete mathematics, and algorithmic logic underpins his work on distributed systems and deterministic AI guardrails.\n\nSource: Academic Foundation ([#about])`;
  }

  // Technical Stack / Skills
  if (
    normalized.includes('tech stack') ||
    normalized.includes('technologies') ||
    normalized.includes('skills') ||
    normalized.includes('languages') ||
    normalized.includes('what tools')
  ) {
    return `Saurabh's core production stack spans 5 architectural tiers:\n• Tier 01 AI & Intelligent Systems: LangChain, LLM reasoning, RAG pipelines, FastAPI, Python\n• Tier 02 Frontend & UI: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion\n• Tier 03 Backend & Distributed: Node.js, Express, REST & GraphQL APIs, microservices\n• Tier 04 Data & Storage: PostgreSQL, Redis, MongoDB\n• Tier 05 DevOps & Infra: Docker, AWS, GitHub Actions CI/CD\nYou can inspect every node and relationship in the interactive stack diagram ([#stack]).\n\nSource: The Layered Architecture ([#stack])`;
  }

  // Contact / Inquiries
  if (
    normalized.includes('contact') ||
    normalized.includes('email') ||
    normalized.includes('reach') ||
    normalized.includes('hire') ||
    normalized.includes('call') ||
    normalized.includes('touch')
  ) {
    const contactMailto = buildMailtoLink(
      profile.email,
      'Architecture & Engineering Inquiry',
      'Hi Saurabh,\n\nI am reaching out regarding engineering opportunities and technical collaboration:\n\n'
    );
    return `You can contact Saurabh directly via email at [${profile.email}](${contactMailto}), connect on LinkedIn (https://www.linkedin.com/in/saurabhdixit93), or review his code on GitHub (https://github.com/saurabhdixit93). He is currently open to high-impact leadership roles, VP/Staff engineering opportunities, and technical advisory ([#contact]).\n\nSource: Inquiries & Advisory ([#contact])`;
  }

  // Fast path for canonical suggested prompts
  if (normalized.includes('built with llm') || normalized.includes('llm') || normalized.includes('ai project')) {
    return `Saurabh has architected high-impact LLM systems including the Enterprise AI Code Review Platform (hybrid static analysis + LLM reasoning for GitHub PRs) and Disha AI Health Coach (FastAPI, Python, with episodic patient memory). Both systems enforce rigid deterministic guardrails around probabilistic AI outputs.\n\nSource: AI Platforms ([#work])`;
  }

  if (normalized.includes('leadership') || normalized.includes('lead engineering') || normalized.includes('vp of engineering') || normalized.includes('management')) {
    return `As VP of Engineering at Sensegrass (2025-Present), Saurabh directs cross-functional engineering teams, increasing delivery velocity by +35% through standardized sprint cadences, automated CI/CD guardrails, and architectural RFC reviews. Under his leadership, the team scaled production AI assistants to handle 3× higher usage while maintaining system stability.\n\nSource: Engineering Leadership ([#experience])`;
  }

  if (normalized.includes('open to') || normalized.includes('hire') || normalized.includes('roles') || normalized.includes('opportunities') || normalized.includes('available')) {
    const rolesMailto = buildMailtoLink(
      profile.email,
      'Engineering Leadership & Advisory Opportunity',
      'Hi Saurabh,\n\nI would like to discuss potential leadership or advisory roles with you:\n\n'
    );
    return `Saurabh is currently open to high-impact leadership roles, VP/Staff engineering opportunities, and select technical advisory engagements. You can reach out directly via email at [${profile.email}](${rolesMailto}) or connect on LinkedIn (https://www.linkedin.com/in/saurabhdixit93).\n\nSource: Contact & Availability ([#contact])`;
  }

  if (normalized.includes('strongest project') || normalized.includes('flagship') || normalized.includes('best project')) {
    return `Saurabh's flagship project is the Enterprise AI Code Review Platform, an asynchronous worker pipeline combining rule-based linting with LLM reasoning for automated pull request analysis. Built with Next.js, TypeScript, Node.js, MongoDB, and Redis, it processes webhooks with sub-second feedback and zero token waste.\n\nSource: Enterprise AI Code Review Platform ([#work])`;
  }

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
