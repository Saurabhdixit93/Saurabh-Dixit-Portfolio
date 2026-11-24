import { Capability } from './types';

/**
 * Core Engineering Capabilities
 * Highlights the four key pillars of Saurabh's expertise as an engineering leader and builder.
 */
export const capabilities: Capability[] = [
  {
    id: 'ai-platforms',
    title: 'AI Platforms & Automation',
    description:
      'Architecting production-ready LLM systems, intelligent agents, and automated reasoning pipelines that integrate seamlessly with enterprise business workflows.',
    skills: [
      'LLM Reasoning Pipelines',
      'RAG & Semantic Retrieval',
      'Conversational AI Agents',
      'Workflow Automation Pipelines',
      'Model Guardrails & Protocol Alignment',
    ],
    tools: [
      'Python',
      'FastAPI',
      'LangChain',
      'OpenAI & Claude APIs',
      'Redis Vector Stores',
      'Prompt Engineering',
    ],
  },
  {
    id: 'fullstack-engineering',
    title: 'Full-Stack Product Engineering',
    description:
      'Building responsive, accessible, and high-performance web applications from concept to production with meticulous attention to typography, state, and user experience.',
    skills: [
      'Next.js App Router Architecture',
      'Strict TypeScript Systems',
      'Server-Side Rendering (SSR) & Streaming',
      'Design Token Systems & Micro-Interactions',
      'Core Web Vitals & Accessibility (WCAG AA)',
    ],
    tools: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Three.js',
    ],
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems & APIs',
    description:
      'Designing robust, fault-tolerant backend architectures, asynchronous event pipelines, and high-throughput RESTful services engineered for resilience.',
    skills: [
      'High-Throughput API Design',
      'Database Schema Optimization & Indexing',
      'In-Memory Caching & Concurrency Control',
      'Incident Root-Cause Analysis & Prevention',
      'Worker Queues & Streaming Pipelines',
    ],
    tools: [
      'Node.js',
      'Express',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Docker',
    ],
  },
  {
    id: 'engineering-leadership',
    title: 'Engineering Leadership',
    description:
      'Directing cross-functional engineering teams, lifting delivery velocity, establishing rigorous technical standards, and aligning architectural roadmaps with business milestones.',
    skills: [
      'Sprint Velocity Optimization (+35%)',
      'Incident Reduction Strategies (-45%)',
      'Technical Architecture RFCs & Reviews',
      'Developer Mentorship & Team Growth',
      'Cross-Functional Alignment (Product, Design, Exec)',
    ],
    tools: [
      'Git & GitHub Workflow Governance',
      'CI/CD Automation',
      'Agile / Scrum Methodologies',
      'System Architecture Diagrams',
      'Observability & Metrics Tracking',
    ],
  },
];
