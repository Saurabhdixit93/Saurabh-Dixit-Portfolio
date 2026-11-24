import { Principle } from './types';

/**
 * Engineering Principles
 * The philosophical foundations governing architectural choices, team leadership, and code delivery.
 */
export const principles: Principle[] = [
  {
    id: 'systems-over-silos',
    number: '01',
    title: 'Systems Over Silos',
    summary:
      'Architecture is the synthesis of infrastructure, data flow, and team communication—never an isolated code artifact.',
    description:
      'High-performing software cannot exist in isolation. Every service, database query, and UI component is part of an interconnected feedback loop. By designing explicit boundaries and observable contracts, we eliminate organizational friction and build platforms that endure.',
  },
  {
    id: 'metrics-over-adjectives',
    number: '02',
    title: 'Metrics Over Adjectives',
    summary:
      'Engineering assertions must be proven by empirical benchmarks, uptime statistics, and measurable throughput.',
    description:
      'Saying a system is "scalable" or "fast" is meaningless without data. We benchmark API throughput (+30%), track release cycle acceleration (+35%), and measure production stability (-45% incidents). Data gives teams confidence and turns vague intentions into verifiable reality.',
  },
  {
    id: 'velocity-with-guardrails',
    number: '03',
    title: 'Velocity With Guardrails',
    summary:
      'Speed without safety is merely accumulated failure. True speed is unlocked through automated quality gates.',
    description:
      'Moving fast does not mean breaking things; it means building automated CI pipelines, strict TypeScript contracts, and asynchronous sanity checks so developers can ship with high confidence. When guardrails catch mistakes early, release velocity compounds.',
  },
  {
    id: 'pragmatic-ai',
    number: '04',
    title: 'Pragmatic AI Integration',
    summary:
      'Deploy AI where it creates genuine non-linear leverage, bounded by deterministic protocols and ground truth.',
    description:
      'AI is an amplifier, not a substitute for software fundamentals. We deploy LLMs and autonomous agents where unstructured reasoning creates massive user value, while keeping strict deterministic validation, vector retrieval bounds, and zero tolerance for hallucination.',
  },
];
