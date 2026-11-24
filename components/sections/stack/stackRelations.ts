/**
 * Cross-Tier Technology Relational Mapping
 * Connects technologies across all 5 architectural tiers:
 * AI & LLM, Frontend, Backend, Data, DevOps & Cloud Infrastructure.
 * Guaranteed symmetrical: if A connects to B, B connects to A.
 */

export const RAW_STACK_RELATIONS: Record<string, string[]> = {
  // Tier: Frontend & UI Engineering
  "Next.js (App Router)": [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Three.js / React Three Fiber",
    "Node.js",
    "Vercel & Netlify",
    "REST & GraphQL APIs",
    "PostgreSQL",
    "Supabase",
    "Firebase",
    "Cloudinary",
    "LangChain & Prompt Systems",
  ],
  React: [
    "Next.js (App Router)",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Three.js / React Three Fiber",
    "Node.js",
    "Vercel & Netlify",
    "Firebase",
  ],
  TypeScript: [
    "Next.js (App Router)",
    "React",
    "Node.js",
    "Express.js",
    "REST & GraphQL APIs",
    "PostgreSQL",
    "Supabase",
    "LangChain & Prompt Systems",
  ],
  "Tailwind CSS": [
    "Next.js (App Router)",
    "React",
    "Framer Motion",
    "Vercel & Netlify",
  ],
  "Framer Motion": [
    "Next.js (App Router)",
    "React",
    "Tailwind CSS",
    "Three.js / React Three Fiber",
    "Vercel & Netlify",
  ],
  "Three.js / React Three Fiber": [
    "React",
    "Next.js (App Router)",
    "Framer Motion",
    "Cloudinary",
  ],

  // Tier: Backend & Distributed Services
  "Node.js": [
    "TypeScript",
    "Express.js",
    "REST & GraphQL APIs",
    "Worker Queues & Pipelines",
    "Microservice Architecture",
    "PostgreSQL",
    "Redis",
    "MongoDB",
    "Docker",
    "Next.js (App Router)",
    "Render",
    "Linux / Shell Scripting",
    "LangChain & Prompt Systems",
  ],
  "Express.js": [
    "Node.js",
    "TypeScript",
    "REST & GraphQL APIs",
    "MongoDB",
    "PostgreSQL",
  ],
  "REST & GraphQL APIs": [
    "Next.js (App Router)",
    "Node.js",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Express.js",
    "Microservice Architecture",
    "Appwrite",
  ],
  "Worker Queues & Pipelines": [
    "Node.js",
    "Redis",
    "PostgreSQL",
    "LLM Orchestration",
    "Microservice Architecture",
    "Docker",
  ],
  "Microservice Architecture": [
    "Node.js",
    "Python",
    "FastAPI",
    "Docker",
    "REST & GraphQL APIs",
    "Worker Queues & Pipelines",
  ],

  // Tier: Data & State Management
  PostgreSQL: [
    "Node.js",
    "FastAPI",
    "Supabase",
    "Redis",
    "Docker",
    "REST & GraphQL APIs",
    "Next.js (App Router)",
    "RAG & Vector Pipelines",
    "Render",
  ],
  Redis: [
    "Node.js",
    "FastAPI",
    "Worker Queues & Pipelines",
    "RAG & Vector Pipelines",
    "PostgreSQL",
    "LLM Orchestration",
    "Docker",
    "LangChain & Prompt Systems",
  ],
  MongoDB: [
    "Node.js",
    "Express.js",
    "TypeScript",
    "Docker",
  ],
  Supabase: [
    "Next.js (App Router)",
    "PostgreSQL",
    "TypeScript",
    "React",
  ],
  Firebase: [
    "Next.js (App Router)",
    "React",
    "Node.js",
  ],
  Appwrite: [
    "Next.js (App Router)",
    "Docker",
    "REST & GraphQL APIs",
  ],

  // Tier: AI & Intelligent Systems
  "LLM Orchestration": [
    "Python",
    "FastAPI",
    "LangChain & Prompt Systems",
    "RAG & Vector Pipelines",
    "Conversational Agents",
    "Redis",
    "Worker Queues & Pipelines",
  ],
  "RAG & Vector Pipelines": [
    "Python",
    "FastAPI",
    "Redis",
    "PostgreSQL",
    "LangChain & Prompt Systems",
    "LLM Orchestration",
  ],
  "Conversational Agents": [
    "LLM Orchestration",
    "RAG & Vector Pipelines",
    "LangChain & Prompt Systems",
    "FastAPI",
    "Next.js (App Router)",
  ],
  Python: [
    "FastAPI",
    "LangChain & Prompt Systems",
    "LLM Orchestration",
    "RAG & Vector Pipelines",
    "Docker",
    "PostgreSQL",
    "Microservice Architecture",
    "Linux / Shell Scripting",
  ],
  FastAPI: [
    "Python",
    "REST & GraphQL APIs",
    "RAG & Vector Pipelines",
    "Redis",
    "PostgreSQL",
    "Docker",
    "Microservice Architecture",
    "Render",
    "LangChain & Prompt Systems",
  ],
  "LangChain & Prompt Systems": [
    "Python",
    "FastAPI",
    "LLM Orchestration",
    "RAG & Vector Pipelines",
    "Conversational Agents",
    "Node.js",
    "TypeScript",
    "Next.js (App Router)",
    "Redis",
  ],

  // Tier: DevOps & Cloud Infrastructure
  Docker: [
    "Node.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Git & GitHub Actions",
    "Render",
    "Linux / Shell Scripting",
    "Microservice Architecture",
    "Appwrite",
  ],
  "Git & GitHub Actions": [
    "Docker",
    "Vercel & Netlify",
    "Next.js (App Router)",
    "Node.js",
    "Render",
    "Linux / Shell Scripting",
  ],
  "Vercel & Netlify": [
    "Next.js (App Router)",
    "React",
    "Git & GitHub Actions",
    "Tailwind CSS",
    "Framer Motion",
  ],
  Render: [
    "FastAPI",
    "Node.js",
    "Docker",
    "PostgreSQL",
    "Git & GitHub Actions",
  ],
  Cloudinary: [
    "Next.js (App Router)",
    "Node.js",
    "React",
    "Three.js / React Three Fiber",
  ],
  "Linux / Shell Scripting": [
    "Docker",
    "Node.js",
    "Python",
    "Git & GitHub Actions",
  ],
};

/**
 * Builds a strictly bidirectional relationship adjacency map.
 * Ensures if A connects to B, B connects back to A.
 */
function buildSymmetricalMap(raw: Record<string, string[]>): Record<string, string[]> {
  const map: Record<string, Set<string>> = {};

  for (const [source, targets] of Object.entries(raw)) {
    if (!map[source]) {
      map[source] = new Set<string>();
    }
    for (const target of targets) {
      map[source].add(target);
      if (!map[target]) {
        map[target] = new Set<string>();
      }
      map[target].add(source);
    }
  }

  const result: Record<string, string[]> = {};
  for (const [key, set] of Object.entries(map)) {
    result[key] = Array.from(set);
  }
  return result;
}

export const STACK_RELATIONS = buildSymmetricalMap(RAW_STACK_RELATIONS);

/**
 * Retrieves the list of technology names connected to the specified node.
 */
export function getRelatedTechnologies(techName: string): string[] {
  return STACK_RELATIONS[techName] || [];
}
