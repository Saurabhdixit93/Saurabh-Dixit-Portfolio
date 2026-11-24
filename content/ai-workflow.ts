import { AIWorkflowContent } from "./types";

/**
 * AI Workflow & Tooling Content
 * Strictly typed content layer for the AI Workflow section and Ask Saurabh assistant teaser.
 * In accordance with PRD Prompt 8 & Project Integrity Rules, unconfirmed tools are tagged with TODO(owner).
 */
export const aiWorkflow: AIWorkflowContent = {
  eyebrow: "// 06 · AI TOOLING & SYSTEM WORKFLOW",
  heading: "Pragmatic AI Systems & Engineering Workflow.",
  subheading:
    "How I leverage LLMs as bounded reasoning engines while enforcing deterministic schemas and production guardrails.",
  philosophyTitle: "AI as Leverage, Not an Architecture Substitute",
  philosophyDescription:
    "LLMs are powerful, non-deterministic reasoning engines. True production reliability emerges when probabilistic intelligence is contained inside rigid type contracts, automated test suites, and strict fallback pipelines.",
  philosophyBullets: [
    "Bounded Reasoning: Probabilistic models draft code and explore edge cases, while deterministic compilers and Zod schemas enforce invariants.",
    "Automated Guardrails: Continuous integration, AST validation, and rate limiting ensure system stability and predictable latency.",
    "Zero Hallucinations: Production AI assistants must cite verified ground-truth context and gracefully refuse out-of-scope speculation.",
  ],
  tools: [
    {
      id: "tool-claude",
      name: "Claude 3.5 / 3.7 Sonnet",
      category: "model",
      role: "Reasoning & Architecture",
      description:
        "Primary model for deep code analysis, architectural RFC formulation, and edge-case discovery.",
      verificationStatus: "verified",
      badge: "VERIFIED",
    },
    {
      id: "tool-openai",
      name: "GPT-4o / OpenAI API",
      category: "model",
      role: "Structured Generation & Extraction",
      description:
        "High-throughput structured JSON generation, semantic embedding pipelines, and classification.",
      verificationStatus: "verified",
      badge: "VERIFIED",
    },
    {
      id: "tool-cursor",
      name: "Cursor & Claude Code",
      category: "ide-agent",
      role: "Agentic IDE Workflows",
      description:
        "In-editor multi-file refactoring, fast scaffold exploration, and automated regression test generation.",
      verificationStatus: "todo-owner",
      badge: "TODO(owner)",
    },
    {
      id: "tool-langchain",
      name: "LangChain & Vector Pipelines",
      category: "orchestration",
      role: "RAG & Memory Systems",
      description:
        "Context chunking, episodic long-term memory retrieval, and multi-tenant tool orchestration.",
      verificationStatus: "todo-owner",
      badge: "TODO(owner)",
    },
    {
      id: "tool-zod-guardrails",
      name: "Zod & Schema Guardrails",
      category: "guardrail",
      role: "Boundary Validation",
      description:
        "Strict runtime validation layers intercepting prompt payloads and bounding model output objects.",
      verificationStatus: "verified",
      badge: "VERIFIED",
    },
  ],
  pipelineStages: [
    {
      step: 1,
      code: "01_SPEC",
      title: "Spec & Constraint Modeling",
      description:
        "Establish human architectural contracts, domain schemas, boundary types, and failure criteria before generating code.",
      humanRole: "Architectural vision, business logic, RFC authoring",
      aiRole: "Edge-case synthesis, failure mode probing, schema review",
      deliverable: "Rigid TypeScript / Zod schemas and design RFC",
    },
    {
      step: 2,
      code: "02_SCAFFOLD",
      title: "AI-Assisted Scaffolding",
      description:
        "Rapidly scaffold modular implementations, test fixtures, and mock datasets guided by strict constraints.",
      humanRole: "Component boundaries, API signature control, code review",
      aiRole: "Boilerplate generation, draft implementation, test matrix",
      deliverable: "Executable feature branch with unit tests",
    },
    {
      step: 3,
      code: "03_VALIDATE",
      title: "Deterministic Validation",
      description:
        "Execute automated test suites, typechecks, and AST linters. AI suggestions are rejected if tests fail.",
      humanRole: "Correctness sign-off, manual verification, security audit",
      aiRole: "Test failure diagnosis, minimal diff proposal",
      deliverable: "100% typechecked, passing test pipeline",
    },
    {
      step: 4,
      code: "04_OBSERVE",
      title: "Telemetry & Graceful Fallbacks",
      description:
        "Deploy with active rate limiting, latency budgets, and deterministic offline fallbacks to prevent outage propagation.",
      humanRole: "SLO definition, alert thresholds, capacity planning",
      aiRole: "Dynamic token routing, fallback execution",
      deliverable: "Zero-500 production resilience",
    },
  ],
  assistantTeaser: {
    badge: "SYS.ONLINE · GROUNDED",
    headline: "Ask Saurabh (Interactive Assistant)",
    subcopy:
      "Grounded strictly on 15 verified entries from Saurabh’s portfolio knowledge base. Inquire about architecture, stack, leadership, or metrics.",
    buttonText: "Launch Assistant",
    shortcutHint: "⌘K or click floating icon",
    suggestedPrompts: [
      "What has he built with LLMs?",
      "Tell me about his leadership experience",
      "Is he open to new roles?",
      "Show his strongest project",
    ],
  },
};
