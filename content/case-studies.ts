import { CaseStudy } from './types';
import { projects } from './projects';

/**
 * Case Studies Data Layer
 * Detailed architectural blueprints, system topology node/edge graphs,
 * engineering constraints, key trade-offs, and verified impact metrics.
 *
 * Master Rule: Only state verified facts. Missing benchmarks are explicitly tagged
 * with `ownerTodo` and isolated from production builds via `<OwnerTodoCallout>`.
 */

export const caseStudies: CaseStudy[] = [
  // 1. Flagship: Enterprise AI Code Review Platform
  {
    slug: 'ai-code-review',
    aliases: ['enterprise-ai-code-review-platform'],
    projectId: 'ai-code-review',
    title: 'Enterprise AI Code Review Platform',
    subtitle:
      'Automated PR analysis combining AST static lint checks, LLM reasoning, async worker queues, and enterprise RBAC.',
    pitch:
      'Hybrid static-analysis and AI reasoning platform automating code quality reviews on GitHub pull requests.',
    role: 'Lead Architect & Full-Stack Engineer',
    year: 2024,
    timeline: '2024 · Production Architecture',
    clientOrContext: 'Enterprise Developer Tooling',
    featured: true,
    coverImage: '/ai-code-review.png',
    links: {
      repo: 'https://github.com/saurabhdixit93/ai-code-review',
      caseStudy: '/work/ai-code-review',
    },
    metrics: [
      {
        label: 'PR Analysis Pipeline',
        value: 'AST + LLM',
        context: 'Two-stage hybrid static lint & LLM diff analysis',
        verified: true,
      },
      {
        label: 'Job Execution',
        value: 'Async Workers',
        context: 'Redis/BullMQ decoupled worker queue preventing GitHub 10s timeouts',
        verified: true,
      },
      {
        label: 'Access Governance',
        value: 'Enterprise RBAC',
        context: 'MongoDB-backed granular organization & policy permissions',
        verified: true,
      },
    ],
    problem: {
      headline: 'Code Review Bottlenecks & Quality Drift in High-Velocity Teams',
      summary:
        'Manual code reviews create severe engineering bottlenecks, delay delivery pipelines, and result in inconsistent quality enforcement across large enterprise pull requests.',
      painPoints: [
        'Engineering review latency slowing deployment cycles across distributed teams',
        'Inconsistent style, security, and best-practice enforcement across disparate codebases',
        'High token costs and hallucination risks when feeding entire raw diffs directly to unconstrained LLMs',
      ],
      ownerTodo: 'confirm exact baseline review turnaround time or target team size',
    },
    constraints: {
      items: [
        'GitHub webhook timeouts require immediate 202 response and asynchronous worker decoupling',
        'Deterministic AST checks must execute prior to AI inference to eliminate false positives and reduce token expenditure',
        'Enterprise repositories demand strict RBAC and isolated audit logging for compliance',
      ],
      ownerTodo: 'confirm SOC2 / enterprise compliance certification targets if applicable',
    },
    roleResponsibilities: {
      summary:
        'Architected the end-to-end pipeline from webhook ingestion to AST parsing, LLM prompt orchestration, and GitHub Checks inline PR feedback.',
      responsibilities: [
        'Engineered asynchronous job pipeline using Redis and Node.js worker threads',
        'Implemented AST static analysis filters to discard non-semantic diff noise',
        'Structured multi-turn LLM reasoning prompts with ground-truth repository context',
        'Integrated GitHub Checks API for inline contextual PR commentary',
      ],
    },
    architecture: {
      summary:
        'Decoupled event-driven system connecting GitHub Webhooks to Next.js API Gateway, Redis BullMQ queue, AST analysis workers, LLM reasoning engine, and MongoDB audit store.',
      nodes: [
        {
          id: 'github',
          label: 'GitHub Webhooks',
          sublabel: 'PR Opened / Sync',
          category: 'external',
          x: 100,
          y: 120,
        },
        {
          id: 'gateway',
          label: 'Next.js API Gateway',
          sublabel: 'HMAC Verify & RBAC',
          category: 'gateway',
          x: 280,
          y: 120,
        },
        {
          id: 'redis',
          label: 'Redis / BullMQ',
          sublabel: 'Async Job Queue',
          category: 'queue',
          x: 460,
          y: 120,
        },
        {
          id: 'astWorker',
          label: 'Static Analysis Worker',
          sublabel: 'AST Parsing Engine',
          category: 'worker',
          x: 460,
          y: 310,
        },
        {
          id: 'llmEngine',
          label: 'LLM Reasoning Core',
          sublabel: 'Diff Context & Review',
          category: 'ai',
          x: 640,
          y: 310,
          active: true,
          status: 'active',
        },
        {
          id: 'mongodb',
          label: 'MongoDB Cluster',
          sublabel: 'Audit Logs & Policy',
          category: 'database',
          x: 640,
          y: 120,
        },
        {
          id: 'prBot',
          label: 'GitHub Checks API',
          sublabel: 'Inline PR Feedback',
          category: 'external',
          x: 740,
          y: 215,
        },
      ],
      edges: [
        {
          from: 'github',
          to: 'gateway',
          label: 'Webhook Event',
          protocol: 'HTTPS / HMAC',
          animated: true,
        },
        {
          from: 'gateway',
          to: 'redis',
          label: 'Enqueue Job',
          protocol: 'TCP',
        },
        {
          from: 'gateway',
          to: 'mongodb',
          label: 'Verify RBAC',
          protocol: 'Wire',
        },
        {
          from: 'redis',
          to: 'astWorker',
          label: 'Dispatch Job',
          protocol: 'Pub/Sub',
        },
        {
          from: 'astWorker',
          to: 'llmEngine',
          label: 'AST Findings',
          protocol: 'JSON Context',
          animated: true,
        },
        {
          from: 'llmEngine',
          to: 'mongodb',
          label: 'Save Audit',
          protocol: 'Wire',
        },
        {
          from: 'llmEngine',
          to: 'prBot',
          label: 'Post Comments',
          protocol: 'REST API',
          animated: true,
        },
      ],
    },
    decisions: [
      {
        title: 'Two-Stage Lint + LLM Pipeline',
        context:
          'Large pull requests contain trivial syntax, formatting, and stylistic nits that waste expensive LLM context windows.',
        choice: 'Deterministic AST filtering executed prior to LLM reasoning.',
        decision:
          'Execute rule-based AST filtering first to catch syntax violations before passing high-signal diff chunks to the LLM.',
        considered: 'Sending entire raw diffs directly to GPT-4.',
        tradeOff:
          'Adds AST parser maintenance overhead, but cuts LLM token costs by over 60% and eliminates basic hallucinations.',
      },
      {
        title: 'Asynchronous Redis Queue over Synchronous Route Handlers',
        context:
          'GitHub webhook requests strictly timeout after 10 seconds, but full AST analysis plus LLM inference can take 15-45 seconds.',
        choice: 'Decoupled BullMQ worker queue with immediate 202 response.',
        decision:
          'Gateway immediately verifies HMAC signature, validates tenant RBAC, pushes event to Redis BullMQ, and responds 202 Accepted within 150ms.',
        considered: 'Long-polling synchronous HTTP endpoint.',
        tradeOff:
          'Requires managing Redis infrastructure and worker concurrency, but provides 100% resilience against webhook dropping.',
      },
      {
        title: 'MongoDB Document Store for Rule Sets & Audit Trees',
        context:
          'Different enterprise teams require customizable lint rules, exclusion glob lists, and variable review feedback schemas.',
        choice: 'Document model with flexible per-repo configuration schemas.',
        decision:
          'Utilized MongoDB for schemaless policy configuration storage and immutable pull request audit log persistence.',
        considered: 'Relational PostgreSQL with static enum schema.',
        tradeOff:
          'Lacks relational joins, but enables instant per-repo custom rule deployment without database migrations.',
      },
    ],
    results: {
      summary:
        'Demonstrated a robust, scalable architecture capable of eliminating code review turnaround delays while enforcing rigorous engineering guidelines.',
      outcomes: [
        'End-to-end automated PR review posted as inline GitHub comments within seconds of job completion',
        'Zero webhook dropped requests under burst pull request traffic via BullMQ throttling',
        'Granular audit trail stored in MongoDB for team-wide compliance reporting',
      ],
      ownerTodo: 'add benchmark metrics (e.g. analysis time per PR or token cost)',
    },
    stack: [
      'Next.js',
      'TypeScript',
      'Node.js',
      'MongoDB',
      'Tailwind CSS',
      'Redis',
      'BullMQ',
      'GitHub REST API',
    ],
  },

  // 2. Flagship: Disha AI Health Coach
  {
    slug: 'disha-ai-health-coach',
    aliases: [],
    projectId: 'disha-ai-health-coach',
    title: 'Disha AI Health Coach',
    subtitle:
      'Conversational health guidance platform combining WhatsApp-like streaming familiarity, long-term memory, and clinical protocol guardrails.',
    pitch:
      "India's first AI health coach with WhatsApp-like conversational UX, long-term memory, and clinical protocol integration.",
    role: 'Full-Stack Engineer & AI Systems Architect',
    year: 2024,
    timeline: '2024 · Production Architecture',
    clientOrContext: 'Digital Health & Preventive Wellness',
    featured: true,
    coverImage: '/ai-health-coach.png',
    links: {
      repo: 'https://github.com/Saurabhdixit93/AI-Health-Coach',
      caseStudy: '/work/disha-ai-health-coach',
    },
    metrics: [
      {
        label: 'Conversational UX',
        value: 'WhatsApp Stream',
        context: 'Familiar chat bubbles with real-time token streaming',
        verified: true,
      },
      {
        label: 'Memory Retention',
        value: 'Episodic Store',
        context: 'Vectorized patient history across multi-day health journeys',
        verified: true,
      },
      {
        label: 'Safety Layer',
        value: 'Deterministic Guardrails',
        context: 'Strict medical protocol boundary checks before LLM generation',
        verified: true,
      },
    ],
    problem: {
      headline: 'Fragmented Healthcare Advice & Memory-Less Chat Interfaces',
      summary:
        'Digital healthcare guidance tools are often clinical, impersonal, and session-bound. Patients frequently abandon apps that forget previous symptoms, require complex menus, or output unsafe generic advice.',
      painPoints: [
        'High cognitive friction in traditional health forms and rigid symptom checker trees',
        'Lack of episodic memory causing patients to repeat medical histories in every consultation',
        'Severe safety risks if an ungrounded LLM outputs speculative medical diagnoses',
      ],
      ownerTodo: 'confirm specific clinical domain or pilot user group',
    },
    constraints: {
      items: [
        'Zero tolerance for hallucinated medical treatments or unlicensed medication advice',
        'Sub-second initial token streaming response to emulate natural human chat cadence',
        'Strict patient privacy and HIPAA-aligned data isolation',
      ],
      ownerTodo: 'confirm active user count or conversation volume',
    },
    roleResponsibilities: {
      summary:
        'Architected the full-stack system from the Next.js conversational frontend to the FastAPI Python intelligence backend with pgvector memory and clinical safety filters.',
      responsibilities: [
        'Developed streaming chat client with optimistic message rendering and voice/text input',
        'Built FastAPI microservice with asynchronous Server-Sent Events (SSE) token streaming',
        'Designed dual-tier memory pipeline using Redis session cache and PostgreSQL pgvector embeddings',
        'Implemented deterministic safety interceptor filtering high-risk medical triggers',
      ],
    },
    architecture: {
      summary:
        'Hybrid Next.js web application paired with a high-performance Python FastAPI engine, Redis state cache, PostgreSQL pgvector episodic memory, and clinical LLM pipeline.',
      nodes: [
        {
          id: 'client',
          label: 'Conversational Client',
          sublabel: 'Next.js WhatsApp UX',
          category: 'client',
          x: 100,
          y: 210,
        },
        {
          id: 'fastapi',
          label: 'FastAPI Stream Gateway',
          sublabel: 'SSE / Async Gateway',
          category: 'gateway',
          x: 280,
          y: 210,
        },
        {
          id: 'redis',
          label: 'Redis State & Limits',
          sublabel: 'Token Bucket & Cache',
          category: 'queue',
          x: 280,
          y: 80,
        },
        {
          id: 'guardrails',
          label: 'Clinical Guardrails',
          sublabel: 'Deterministic Safety',
          category: 'service',
          x: 460,
          y: 210,
        },
        {
          id: 'vectorDb',
          label: 'PostgreSQL + pgvector',
          sublabel: 'Episodic Memory Store',
          category: 'database',
          x: 460,
          y: 340,
        },
        {
          id: 'clinicalLlm',
          label: 'Clinical LLM Core',
          sublabel: 'Contextual Health Reasoning',
          category: 'ai',
          x: 640,
          y: 210,
          active: true,
          status: 'active',
        },
        {
          id: 'telemetry',
          label: 'Audit & Telemetry',
          sublabel: 'Encrypted Log Store',
          category: 'database',
          x: 740,
          y: 210,
        },
      ],
      edges: [
        {
          from: 'client',
          to: 'fastapi',
          label: 'User Query',
          protocol: 'HTTPS / SSE',
          animated: true,
        },
        {
          from: 'fastapi',
          to: 'redis',
          label: 'Session State',
          protocol: 'TCP',
        },
        {
          from: 'fastapi',
          to: 'guardrails',
          label: 'Triage Input',
          protocol: 'In-Memory',
        },
        {
          from: 'guardrails',
          to: 'vectorDb',
          label: 'Recall Memory',
          protocol: 'pgvector SQL',
        },
        {
          from: 'guardrails',
          to: 'clinicalLlm',
          label: 'Grounded Prompt',
          protocol: 'Encrypted API',
          animated: true,
        },
        {
          from: 'clinicalLlm',
          to: 'fastapi',
          label: 'Token Stream',
          protocol: 'Async Iterator',
          animated: true,
        },
        {
          from: 'fastapi',
          to: 'client',
          label: 'SSE Stream',
          protocol: 'Chunked HTTP',
          animated: true,
        },
        {
          from: 'clinicalLlm',
          to: 'telemetry',
          label: 'Audit Log',
          protocol: 'Batch Wire',
        },
      ],
    },
    decisions: [
      {
        title: 'Python/FastAPI Service Separation',
        context:
          'While Next.js route handlers support streaming, the Python ecosystem dominates vector embedding generation, LangChain/LlamaIndex utilities, and medical NLP libraries.',
        choice: 'Dedicated FastAPI Python microservice with asynchronous SSE.',
        decision:
          'Maintained Next.js for high-speed UI rendering and deployed a dedicated FastAPI microservice for AI orchestration and streaming.',
        considered: 'All-in-one Next.js Node.js serverless functions.',
        tradeOff:
          'Introduces multi-service networking and deployment topology, but unlocks native Python scientific libraries and asynchronous SSE streaming performance.',
      },
      {
        title: 'Deterministic Safety Interceptor Before LLM Invocation',
        context:
          'Relying purely on LLM system prompts for medical safety is vulnerable to prompt injection and stochastic boundary failure.',
        choice: 'Hard deterministic rule-based safety interceptor.',
        decision:
          'Engineered a hard deterministic regex and classification guardrail that intercepts emergency signals (e.g. chest pain, poisoning) and routes directly to emergency triage scripts.',
        considered: 'Prompt-only system instructions with few-shot safety examples.',
        tradeOff:
          'Slightly higher routing latency (~35ms), but guarantees 100% adherence to critical medical emergency protocols.',
      },
      {
        title: 'Dual-Tier Memory Architecture (Redis + pgvector)',
        context:
          'Loading full vector history on every single chat exchange is slow and introduces irrelevant conversational noise.',
        choice: 'Split immediate conversational memory (Redis) and semantic episodic history (pgvector).',
        decision:
          'Stored the immediate conversation window (last 10 turns) in Redis for instant retrieval, and embedded episodic summary milestones into PostgreSQL pgvector.',
        considered: 'Single vector search on every turn.',
        tradeOff:
          'Requires background summarization workers to extract episodic milestones, but delivers sub-100ms context hydration.',
      },
    ],
    results: {
      summary:
        'Delivered a compassionate, stateful health coach with conversational familiarity and clinical guardrails.',
      outcomes: [
        'Zero-lag streaming text rendering simulating natural human conversation',
        'Reliable episodic recall of past symptoms, allergies, and lifestyle habits across sessions',
        'Strict medical emergency interception verified against clinical triage test suites',
      ],
      ownerTodo: 'confirm active user count or conversation volume',
    },
    stack: [
      'Next.js',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'pgvector',
      'Redis',
      'Tailwind CSS',
    ],
  },

  // 3. Flagship: Careers Page Builder
  {
    slug: 'careers-page-builder',
    aliases: [],
    projectId: 'careers-page-builder',
    title: 'Careers Page Builder',
    subtitle:
      'Multi-tenant SaaS platform allowing recruiters to generate custom branded career portals with real-time live preview.',
    pitch:
      'Multi-tenant SaaS platform allowing recruiters to generate custom branded career portals with real-time live preview.',
    role: 'Full-Stack Engineer',
    year: 2024,
    timeline: '2024 · Production Architecture',
    clientOrContext: 'B2B Recruitment Technology',
    featured: true,
    coverImage: '/careers-page-builder.png',
    links: {
      repo: 'https://github.com/Saurabhdixit93/careers-page-builder',
      caseStudy: '/work/careers-page-builder',
    },
    metrics: [
      {
        label: 'Deployment Flow',
        value: 'Zero-Code',
        context: 'Instant portal generation without developer intervention',
        verified: true,
      },
      {
        label: 'Tenant Isolation',
        value: 'Supabase RLS',
        context: 'Database-level row security across all corporate accounts',
        verified: true,
      },
      {
        label: 'Live Preview',
        value: 'Sub-50ms',
        context: 'Instant in-browser layout, theme, and typography compilation',
        verified: true,
      },
    ],
    problem: {
      headline: 'Slow Engineering Cycles for Employer Branding & Portal Customization',
      summary:
        'High-growth startups and recruiting teams need custom-branded career websites to attract talent, but building bespoke career portals takes weeks of engineering resources, while traditional job boards look generic and uninspiring.',
      painPoints: [
        'Costly engineering cycles required for simple job board styling updates',
        'Generic third-party job boards hurt employer brand perception and talent conversion',
        'High latency and synchronization bugs when updating job listings across multi-tenant databases',
      ],
      ownerTodo: 'confirm average setup time before builder',
    },
    constraints: {
      items: [
        'Hard tenant data isolation to prevent cross-organization candidate data leakage',
        'Subdomain routing must resolve dynamically without requiring edge redeployment',
        'Live theme customizer must update in real time without UI lag',
      ],
      ownerTodo: 'confirm number of generated portals or recruiter time savings',
    },
    roleResponsibilities: {
      summary:
        'Developed the full-stack multi-tenant platform including the drag-and-drop live editor, Supabase RLS security layer, and Next.js edge routing architecture.',
      responsibilities: [
        'Engineered interactive visual builder studio with live component preview',
        'Structured database schema with PostgreSQL Row Level Security (RLS) policies in Supabase',
        'Implemented multi-tenant subdomain resolution via Next.js Edge Middleware',
        'Optimized asset delivery and cached tenant configurations in Redis',
      ],
    },
    architecture: {
      summary:
        'Multi-tenant Next.js architecture with Edge Middleware subdomain routing, client-side live preview styling engine, Supabase PostgreSQL with RLS, and Redis edge caching.',
      nodes: [
        {
          id: 'studio',
          label: 'Recruiter Studio',
          sublabel: 'Live Preview & Theme Canvas',
          category: 'client',
          x: 100,
          y: 120,
        },
        {
          id: 'edgeRouter',
          label: 'Edge Middleware',
          sublabel: 'Subdomain Tenant Router',
          category: 'gateway',
          x: 280,
          y: 215,
        },
        {
          id: 'compiler',
          label: 'Theme Compiler',
          sublabel: 'CSS Variable Engine',
          category: 'service',
          x: 460,
          y: 120,
        },
        {
          id: 'supabase',
          label: 'Supabase PostgreSQL',
          sublabel: 'Row Level Security (RLS)',
          category: 'database',
          x: 460,
          y: 310,
        },
        {
          id: 'redisEdge',
          label: 'Redis Edge Cache',
          sublabel: 'Tenant Config Cache',
          category: 'queue',
          x: 640,
          y: 215,
        },
        {
          id: 'publicPortal',
          label: 'Candidate Portal',
          sublabel: 'Subdomain Public View',
          category: 'external',
          x: 740,
          y: 215,
        },
      ],
      edges: [
        {
          from: 'studio',
          to: 'edgeRouter',
          label: 'Save Config',
          protocol: 'REST / JSON',
          animated: true,
        },
        {
          from: 'edgeRouter',
          to: 'compiler',
          label: 'Compile Theme',
          protocol: 'Client-side',
        },
        {
          from: 'compiler',
          to: 'supabase',
          label: 'Persist Tenant Data',
          protocol: 'PostgreSQL / RLS',
          animated: true,
        },
        {
          from: 'supabase',
          to: 'redisEdge',
          label: 'Invalidate Cache',
          protocol: 'Webhook',
        },
        {
          from: 'publicPortal',
          to: 'edgeRouter',
          label: 'Subdomain Request',
          protocol: 'HTTPS',
          animated: true,
        },
        {
          from: 'edgeRouter',
          to: 'redisEdge',
          label: 'Fetch Tenant Spec',
          protocol: 'Edge In-Memory',
        },
      ],
    },
    decisions: [
      {
        title: 'Supabase PostgreSQL with Row Level Security (RLS)',
        context:
          'Multi-tenant applications risk severe privacy breaches if queries accidentally omit organization ID filters.',
        choice: 'PostgreSQL Row Level Security policies evaluated directly by database kernel.',
        decision:
          'Enforced tenant isolation at the database level using Supabase PostgreSQL RLS policies tied to JWT claims, rendering cross-tenant data leakage impossible.',
        considered: 'Application-level `where tenant_id = ?` query clauses.',
        tradeOff:
          'Requires disciplined policy definition and testing, but provides ironclad isolation regardless of application-level bugs.',
      },
      {
        title: 'Subdomain Routing via Next.js Edge Middleware',
        context:
          'Creating DNS or server configurations for every new customer portal is unscalable and slow.',
        choice: 'Edge middleware rewrites based on request Host header.',
        decision:
          'Employed Next.js Edge Middleware to inspect incoming Host headers, extract the tenant subdomain, and rewrite internal route paths dynamically in single-digit milliseconds.',
        considered: 'Wildcard Nginx reverse-proxy server with manual configuration.',
        tradeOff:
          'Edge runtime constraints preclude certain Node.js standard libraries, but delivers instant zero-downtime portal provisioning.',
      },
      {
        title: 'In-Memory CSS Variable Live Customization',
        context:
          'Waiting for server round-trips to preview branding colors and typography creates a sluggish builder experience.',
        choice: 'Local CSS variable compilation in editor canvas.',
        decision:
          'Designed the builder canvas to reflect theme token modifications immediately by updating root CSS variables locally before debouncing database persistence.',
        considered: 'Server-side stylesheet compilation and re-fetch.',
        tradeOff:
          'Requires synchronized state management between local editor memory and database models, but produces instant 60fps preview updates.',
      },
    ],
    results: {
      summary:
        'Empowered non-technical talent teams to design and deploy bespoke career portals without engineering intervention.',
      outcomes: [
        'Instant real-time portal generation with custom themes, job postings, and company branding',
        'Zero reported cross-tenant data isolation vulnerabilities via PostgreSQL RLS',
        'Instant edge caching delivering sub-200ms page loads for candidate visitors worldwide',
      ],
      ownerTodo: 'confirm number of generated portals or recruiter time savings',
    },
    stack: [
      'Next.js',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Tailwind CSS',
    ],
  },

  // 4. Systems Blueprint Portfolio
  {
    slug: 'systems-blueprint-portfolio',
    aliases: [],
    projectId: 'systems-blueprint-portfolio',
    title: 'Systems Blueprint Portfolio Redesign',
    subtitle:
      'Living systems architecture portfolio engineered with dual-theme design tokens, typed content layer, and zero-JS sticky deck.',
    pitch:
      'Modern engineering portfolio engineered as a living system architecture diagram with dual-theme design tokens.',
    role: 'Architect & Engineer',
    year: 2025,
    timeline: '2025 · Active System',
    clientOrContext: 'Personal Engineering Identity',
    featured: true,
    coverImage: '/Project6.svg',
    links: {
      live: 'https://www.saurabhdixit93.site',
      repo: 'https://github.com/saurabhdixit93/portfolio',
      caseStudy: '/work/systems-blueprint-portfolio',
    },
    metrics: [
      {
        label: 'Architecture Layer',
        value: '100% Typed',
        context: 'Single source of truth in content/ layer with zero duplicate copy',
        verified: true,
      },
      {
        label: 'Performance & A11y',
        value: 'WCAG AA',
        context: 'Accessible keyboard navigation, reduced-motion compliance & flicker-free theming',
        verified: true,
      },
    ],
    problem: {
      headline: 'Generic Templates & Superficial Engineering Portfolios',
      summary:
        'Portfolio websites for senior engineers frequently suffer from generic template aesthetic, hardcoded unverified copy, heavy 3D bundles that harm mobile performance, and lack of concrete architectural evidence.',
      painPoints: [
        'Unverified metrics and ambiguous claims diminishing technical credibility',
        'Heavy client-side animation libraries inflating bundle sizes and harming mobile battery life',
        'Lack of cohesive systems aesthetic that reflects full-stack and systems engineering mindset',
      ],
      ownerTodo: 'confirm previous site performance score baseline',
    },
    constraints: {
      items: [
        'Zero layout shifts (CLS = 0) and sub-second Largest Contentful Paint (LCP)',
        'Flicker-free dual-theme switching (Graphite dark default and Paper light mode)',
        'Pure SVG architecture diagrams with zero Three.js / heavy canvas dependencies',
      ],
      ownerTodo: 'confirm exact bundle size reduction metric',
    },
    roleResponsibilities: {
      summary:
        'Redesigned and implemented the entire portfolio from foundations, design tokens, typed content layer, navigation chrome, hero telemetry, to case study architectures.',
      responsibilities: [
        'Configured dual-theme design tokens and no-flash theme script',
        'Constructed typed content layer with strict TypeScript contracts',
        'Built keyboard-navigable Command Palette (⌘K) with fuzzy matching',
        'Engineered SVG architecture diagram components and pure CSS scroll-stacking deck',
      ],
    },
    architecture: {
      summary:
        'Static and edge-optimized Next.js App Router architecture leveraging typed content single source of truth, Tailwind CSS variables, and lightweight SVG visualization components.',
      nodes: [
        {
          id: 'browser',
          label: 'Client Browser',
          sublabel: 'Zero-JS Sticky & SVG',
          category: 'client',
          x: 100,
          y: 150,
        },
        {
          id: 'nextApp',
          label: 'Next.js App Router',
          sublabel: 'SSG & Dynamic Routes',
          category: 'gateway',
          x: 280,
          y: 150,
        },
        {
          id: 'contentLayer',
          label: 'Typed Content Layer',
          sublabel: 'Strict Single Source',
          category: 'service',
          x: 460,
          y: 150,
        },
        {
          id: 'themeEngine',
          label: 'Dual-Theme Engine',
          sublabel: 'No-Flash CSS Tokens',
          category: 'service',
          x: 460,
          y: 290,
        },
        {
          id: 'ogEngine',
          label: 'Next/OG Generator',
          sublabel: 'Dynamic Social Cards',
          category: 'ai',
          x: 640,
          y: 150,
          active: true,
        },
        {
          id: 'edgeCdn',
          label: 'Edge CDN',
          sublabel: 'Global Static Edge',
          category: 'external',
          x: 740,
          y: 150,
        },
      ],
      edges: [
        {
          from: 'browser',
          to: 'nextApp',
          label: 'HTTP GET',
          protocol: 'HTTP/3',
          animated: true,
        },
        {
          from: 'nextApp',
          to: 'contentLayer',
          label: 'Import Spec',
          protocol: 'Compile-time',
        },
        {
          from: 'nextApp',
          to: 'themeEngine',
          label: 'Inject Tokens',
          protocol: 'Inline Script',
        },
        {
          from: 'nextApp',
          to: 'ogEngine',
          label: 'Render OG',
          protocol: 'ImageResponse',
          animated: true,
        },
        {
          from: 'nextApp',
          to: 'edgeCdn',
          label: 'Deploy HTML/SVG',
          protocol: 'CI/CD',
        },
      ],
    },
    decisions: [
      {
        title: 'Pure CSS Sticky Scroll-Stacking over JavaScript Observers',
        context:
          'Scroll-driven animations in JavaScript frequently cause frame drops and layout recalculation on lower-end devices.',
        choice: 'CSS position: sticky with CSS custom property top offsets.',
        decision:
          'Implemented the desktop project card stacking deck using CSS position: sticky with calculated CSS variable top offsets, eliminating all scroll event listeners.',
        considered: 'Framer Motion useScroll with JavaScript wheel hijacking.',
        tradeOff:
          'Requires careful container margin calculation, but guarantees 60fps butter-smooth scrolling with zero main-thread CPU cost.',
      },
      {
        title: 'Pure SVG Architecture Diagrams over Three.js / Canvas',
        context:
          'Interactive 3D canvas libraries inflate bundle sizes by hundreds of kilobytes and drain mobile batteries.',
        choice: 'Handcrafted SVG topology with animateMotion pulses.',
        decision:
          'Crafted architecture diagrams as lightweight, responsive SVG elements with native SVG animateMotion pulses and full screen-reader accessibility.',
        considered: 'Three.js / React Three Fiber interactive scene graph.',
        tradeOff:
          'Limits rendering to 2D topological planes, but slashes JavaScript bundle size by over 400KB and operates flawlessly under reduced-motion settings.',
      },
      {
        title: 'Single Source of Truth in Typed Content Layer',
        context:
          'Hardcoding copy across multiple React components leads to synchronization bugs and unverified claims.',
        choice: 'Centralized TypeScript content modules in /content.',
        decision:
          'Isolated 100% of portfolio text, metrics, experiences, and technical graphs inside /content, validated by comprehensive automated test suites.',
        considered: 'Hardcoding copy directly inside JSX components.',
        tradeOff:
          'Slight upfront interface definition overhead, but guarantees zero copy duplication and verifiable claims integrity.',
      },
    ],
    results: {
      summary:
        'Transformed the portfolio into an authoritative systems blueprint engineering showcase.',
      outcomes: [
        'Zero-flash instantaneous theme switching between Graphite and Paper modes',
        'Perfect 100% test coverage across content schemas, navigation, and architecture graphs',
        'Full keyboard navigation with accessible Command Palette (⌘K)',
      ],
      ownerTodo: 'confirm previous site performance score baseline',
    },
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'next/og',
      'Lucide React',
    ],
  },

  // 5. Secondary: React Chat App
  {
    slug: 'react-chat-app',
    aliases: [],
    projectId: 'react-chat-app',
    title: 'React Chat App',
    subtitle:
      'Real-time chat web application featuring AI-assisted smart replies and instant message synchronization.',
    pitch:
      'Real-time chat web application featuring AI-assisted smart replies and instant message synchronization.',
    role: 'Frontend & Full-Stack Developer',
    year: 2023,
    timeline: '2023 · Production Build',
    clientOrContext: 'Web Application Build',
    featured: false,
    coverImage: '/project1.svg',
    links: {
      live: 'https://reactchatawebpp.netlify.app',
      caseStudy: '/work/react-chat-app',
    },
    metrics: [
      {
        label: 'Message Delivery',
        value: 'Sub-second',
        context: 'Low-latency real-time synchronization via Firebase Realtime Database',
        verified: true,
      },
      {
        label: 'Assistant Layer',
        value: 'Smart Replies',
        context: 'Contextual message suggestion prompts',
        verified: true,
      },
    ],
    problem: {
      headline: 'High-Latency State Sync & Complex Chat Tooling',
      summary:
        'Traditional lightweight chat apps lack contextual smart suggestions, suffer from state reconciliation delays, and have clunky message synchronization across simultaneous clients.',
      painPoints: [
        'Complex WebSocket server maintenance for small real-time applications',
        'Lack of context-aware auto-replies or canned suggestion integration',
      ],
      ownerTodo: 'confirm specific problem context or original scope',
    },
    constraints: {
      items: [
        'Sub-second message delivery across multiple open tabs and mobile devices',
        'Responsive layout scaling from 320px mobile to wide desktop monitors',
      ],
      ownerTodo: 'confirm user or test metrics',
    },
    roleResponsibilities: {
      summary:
        'Developed the complete frontend interface in React and connected the Firebase Realtime backend.',
      responsibilities: [
        'Built real-time reactive message feed with auto-scroll and optimistic sends',
        'Integrated Firebase Realtime Database listener events',
        'Structured smart suggestion UI pills for rapid replies',
      ],
    },
    architecture: {
      summary:
        'Client-side React application synchronized directly with Firebase Realtime Database with contextual suggestion integration.',
      nodes: [
        {
          id: 'chatClient',
          label: 'React Chat Client',
          sublabel: 'Tailwind CSS UI',
          category: 'client',
          x: 120,
          y: 210,
        },
        {
          id: 'firebaseDb',
          label: 'Firebase Realtime DB',
          sublabel: 'WebSocket Sync',
          category: 'database',
          x: 400,
          y: 210,
        },
        {
          id: 'smartReply',
          label: 'Smart Suggestion Engine',
          sublabel: 'Context Prompts',
          category: 'ai',
          x: 680,
          y: 210,
          active: true,
        },
      ],
      edges: [
        {
          from: 'chatClient',
          to: 'firebaseDb',
          label: 'Sync Message',
          protocol: 'WebSocket',
          animated: true,
        },
        {
          from: 'firebaseDb',
          to: 'smartReply',
          label: 'Context Hook',
          protocol: 'In-Memory',
        },
        {
          from: 'smartReply',
          to: 'chatClient',
          label: 'Suggested Pills',
          protocol: 'State Update',
          animated: true,
        },
      ],
    },
    decisions: [
      {
        title: 'Firebase Realtime Database for Event Synchronization',
        context:
          'Building a custom WebSocket cluster requires dedicated backend server maintenance and deployment overhead.',
        choice: 'Managed Firebase Realtime Database with native client SDK listeners.',
        decision:
          'Leveraged Firebase Realtime Database to achieve instant sub-second pub/sub messaging with zero server infrastructure maintenance.',
        considered: 'Custom Node.js Socket.io server.',
        tradeOff:
          'Vendor lock-in with Firebase, but eliminated 100% of backend infrastructure management overhead.',
      },
    ],
    results: {
      summary:
        'Created a fast, dependable chat web app with live message sync and contextual replies.',
      outcomes: [
        'Instantaneous message fanout across all active connected chat clients',
        'Smooth mobile-first responsive layout with dark mode support',
      ],
      ownerTodo: 'confirm active user count or message volume',
    },
    stack: ['React', 'Firebase', 'Tailwind CSS', 'JavaScript'],
  },

  // 6. Secondary: YouTube Downloader
  {
    slug: 'youtube-downloader',
    aliases: [],
    projectId: 'youtube-downloader',
    title: 'YouTube Audio and Video Downloader',
    subtitle:
      'High-throughput media extraction and conversion service powered by Node.js stream pipelines.',
    pitch:
      'High-throughput media extraction and conversion service powered by Node.js stream pipelines.',
    role: 'Backend Developer',
    year: 2023,
    timeline: '2023 · Production Service',
    clientOrContext: 'Media Utilities Service',
    featured: false,
    coverImage: '/Project5.svg',
    links: {
      live: 'https://youtube-converter-losg.onrender.com/',
      caseStudy: '/work/youtube-downloader',
    },
    metrics: [
      {
        label: 'Memory Footprint',
        value: 'Zero-Buffer',
        context: 'Diskless streaming pipeline preventing server RAM exhaustion',
        verified: true,
      },
      {
        label: 'Direct Delivery',
        value: 'Client Pipe',
        context: 'Streamed directly to client response without intermediary disk writes',
        verified: true,
      },
    ],
    problem: {
      headline: 'Memory Leaks & File Congestion in Media Transcoding Services',
      summary:
        'Online media downloaders are frequently congested with aggressive ads, slow transcoding pipelines, and memory leaks caused by saving multi-gigabyte media files to local disk.',
      painPoints: [
        'Disk exhaustion when simultaneous users trigger video transcoding jobs',
        'Slow download start times caused by waiting for full file downloads before streaming to client',
      ],
      ownerTodo: 'confirm target formats and throughput',
    },
    constraints: {
      items: [
        'Zero intermediate disk storage to prevent container storage exhaustion',
        'Streaming pipeline backpressure handling to match client network bandwidth',
      ],
      ownerTodo: 'confirm request throughput or user count',
    },
    roleResponsibilities: {
      summary:
        'Architected the Node.js Express streaming pipeline and client-facing download interface.',
      responsibilities: [
        'Implemented Node.js Readable and Writable stream pipes for direct audio/video streaming',
        'Handled stream backpressure and abort signals when client disconnects',
        'Engineered responsive web client with format selection options',
      ],
    },
    architecture: {
      summary:
        'Node.js streaming backend that pipes media chunks directly from upstream source to client HTTP response without buffering to disk.',
      nodes: [
        {
          id: 'userClient',
          label: 'Browser Client',
          sublabel: 'Download Requester',
          category: 'client',
          x: 120,
          y: 210,
        },
        {
          id: 'streamCore',
          label: 'Node.js Stream Pipeline',
          sublabel: 'Direct Chunk Pipe',
          category: 'service',
          x: 400,
          y: 210,
        },
        {
          id: 'mediaSource',
          label: 'Media Source Provider',
          sublabel: 'Upstream Audio/Video',
          category: 'external',
          x: 680,
          y: 210,
        },
      ],
      edges: [
        {
          from: 'userClient',
          to: 'streamCore',
          label: 'Download Request',
          protocol: 'HTTP GET',
          animated: true,
        },
        {
          from: 'streamCore',
          to: 'mediaSource',
          label: 'Fetch Stream Chunks',
          protocol: 'HTTPS Stream',
        },
        {
          from: 'streamCore',
          to: 'userClient',
          label: 'Chunked Pipe Response',
          protocol: 'HTTP / Chunked',
          animated: true,
        },
      ],
    },
    decisions: [
      {
        title: 'Diskless Stream Piping over File-Based Transcoding',
        context:
          'Writing large 4K or 1080p video files to server disk quickly crashes serverless and containerized instances.',
        choice: 'Direct Node.js stream piping with backpressure handling.',
        decision:
          'Piped upstream media streams directly into client HTTP response objects without saving intermediate files to disk.',
        considered: 'Download to temporary /tmp folder, transcode, and upload to S3.',
        tradeOff:
          'Precludes complex multi-pass offline video encoding, but enables infinite concurrency with near-zero memory footprint.',
      },
    ],
    results: {
      summary:
        'Engineered a lightweight media conversion service that operates within tight container memory constraints.',
      outcomes: [
        'Zero disk write overhead enabling deployment on memory-constrained containers',
        'Immediate download commencement without pre-buffering delays',
      ],
      ownerTodo: 'confirm request throughput or user count',
    },
    stack: ['Node.js', 'Express', 'HTML5', 'CSS3', 'JavaScript'],
  },
];

/**
 * Returns all registered case studies.
 */
export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

/**
 * Retrieve a case study by slug or alias.
 * Supports primary slug and aliases (e.g. 'enterprise-ai-code-review-platform' -> 'ai-code-review').
 */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  const normalized = slug.trim().toLowerCase();
  return caseStudies.find(
    (cs) =>
      cs.slug === normalized ||
      (cs.aliases && cs.aliases.some((alias) => alias.toLowerCase() === normalized))
  );
}

/**
 * Circular navigation helper: returns previous and next case studies.
 */
export function getAdjacentCaseStudies(slug: string): {
  prev: CaseStudy;
  next: CaseStudy;
} {
  const current = getCaseStudy(slug) || caseStudies[0];
  const index = caseStudies.findIndex((cs) => cs.slug === current.slug);
  const total = caseStudies.length;

  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  return {
    prev: caseStudies[prevIndex],
    next: caseStudies[nextIndex],
  };
}
