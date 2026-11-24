import { StackCategory } from './types';

/**
 * Technology Stack Architecture
 * Layered map representing verified production skills across the entire engineering pipeline.
 * Derived from technologies already demonstrated and verified on the site.
 */
export const stackCategories: StackCategory[] = [
  {
    id: 'ai-llm',
    name: 'AI & Intelligent Systems',
    description:
      'Production LLM reasoning, retrieval pipelines, conversational assistants, and automation agents.',
    items: [
      { name: 'LLM Orchestration', category: 'ai-llm', highlight: true, level: 'core' },
      { name: 'RAG & Vector Pipelines', category: 'ai-llm', highlight: true, level: 'core' },
      { name: 'Conversational Agents', category: 'ai-llm', highlight: true, level: 'core' },
      { name: 'Python', category: 'ai-llm', icon: '/python.svg', highlight: true, level: 'core' },
      { name: 'FastAPI', category: 'ai-llm', icon: '/fastapi.svg', highlight: true, level: 'core' },
      { name: 'LangChain & Prompt Systems', category: 'ai-llm', level: 'proficient' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Distributed Services',
    description:
      'High-throughput APIs, asynchronous worker queues, distributed state, and fault-tolerant microservices.',
    items: [
      { name: 'Node.js', category: 'backend', icon: '/node.svg', highlight: true, level: 'core' },
      { name: 'TypeScript', category: 'backend', icon: '/ts.svg', highlight: true, level: 'core' },
      { name: 'Express.js', category: 'backend', icon: '/expre.svg', level: 'core' },
      { name: 'REST & GraphQL APIs', category: 'backend', highlight: true, level: 'core' },
      { name: 'Worker Queues & Pipelines', category: 'backend', level: 'core' },
      { name: 'Microservice Architecture', category: 'backend', level: 'proficient' },
    ],
  },
  {
    id: 'data',
    name: 'Data & State Management',
    description:
      'Relational modeling, document stores, in-memory caching, real-time sync, and connection resilience.',
    items: [
      { name: 'PostgreSQL', category: 'data', icon: '/postgresql.svg', highlight: true, level: 'core' },
      { name: 'Redis', category: 'data', icon: '/redis.svg', highlight: true, level: 'core' },
      { name: 'MongoDB', category: 'data', icon: '/mongo.svg', highlight: true, level: 'core' },
      { name: 'Supabase', category: 'data', icon: '/supabase.svg', level: 'proficient' },
      { name: 'Firebase', category: 'data', icon: '/firbase.svg', level: 'proficient' },
      { name: 'Appwrite', category: 'data', icon: '/app.svg', level: 'familiar' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend & UI Engineering',
    description:
      'Accessible, performance-critical web interfaces with server-side rendering and deliberate micro-interactions.',
    items: [
      { name: 'Next.js (App Router)', category: 'frontend', icon: '/next.svg', highlight: true, level: 'core' },
      { name: 'React', category: 'frontend', icon: '/re.svg', highlight: true, level: 'core' },
      { name: 'TypeScript', category: 'frontend', icon: '/ts.svg', highlight: true, level: 'core' },
      { name: 'Tailwind CSS', category: 'frontend', icon: '/tail.svg', highlight: true, level: 'core' },
      { name: 'Framer Motion', category: 'frontend', icon: '/fm.svg', highlight: true, level: 'core' },
      { name: 'Three.js / React Three Fiber', category: 'frontend', icon: '/three.svg', level: 'proficient' },
    ],
  },
  {
    id: 'devops-infra',
    name: 'DevOps & Cloud Infrastructure',
    description:
      'Containerization, CI/CD automation, cloud deployment, and edge media delivery.',
    items: [
      { name: 'Docker', category: 'devops-infra', icon: '/dock.svg', highlight: true, level: 'core' },
      { name: 'Git & GitHub Actions', category: 'devops-infra', icon: '/git.svg', highlight: true, level: 'core' },
      { name: 'Vercel & Netlify', category: 'devops-infra', level: 'core' },
      { name: 'Render', category: 'devops-infra', level: 'proficient' },
      { name: 'Cloudinary', category: 'devops-infra', icon: '/cloud.svg', level: 'proficient' },
      { name: 'Linux / Shell Scripting', category: 'devops-infra', level: 'core' },
    ],
  },
];
