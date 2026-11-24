import { ProcessPhase, ProcessContent } from './types';

/**
 * Process section metadata and header configuration
 */
export const processContent: ProcessContent = {
  annotation: '// 07 · DELIVERY LIFECYCLE & PROCESS',
  heading: 'How I Work & Deliver',
  subheading:
    'Four disciplined, verifiable phases ensuring architectural integrity from initial concept to zero-downtime release.',
};

/**
 * Engineering Delivery Process
 * 4 disciplined, verifiable phases ensuring architectural integrity from initial concept to scaled release.
 * Rule: Distinct non-duplicate titles across all phases.
 */
export const processPhases: ProcessPhase[] = [
  {
    phase: 1,
    code: 'PHASE_01',
    title: 'Discover & Align',
    subtitle: 'Problem Framing & System Boundaries',
    promise: 'De-risk the core technical and business assumptions upfront.',
    timeframe: '1 – 2 weeks',
    description:
      'Clarify core user requirements, business constraints, scale targets, and existing bottlenecks before writing code. Identify baseline metrics to benchmark future success.',
    deliverables: [
      'Problem definition document & user journeys',
      'Technical feasibility assessment & boundary mapping',
      'Measurable baseline success metrics',
    ],
  },
  {
    phase: 2,
    code: 'PHASE_02',
    title: 'Design & Architect',
    subtitle: 'Blueprint Architecture & Data Flow',
    promise: 'Lock in schemas and interface contracts before implementation begins.',
    timeframe: '2 – 3 weeks',
    description:
      'Map out end-to-end data schemas, API contracts, infrastructure nodes, and security boundaries. Ensure cross-functional consensus on interfaces before execution begins.',
    deliverables: [
      'System architecture diagrams & sequence flows',
      'Typed schema definitions & REST/gRPC contracts',
      'Security boundaries & RBAC policy definitions',
    ],
  },
  {
    phase: 3,
    code: 'PHASE_03',
    title: 'Build & Iterate',
    subtitle: 'Iterative Implementation & Guardrails',
    promise: 'Ship functional, verified vertical slices with continuous feedback.',
    timeframe: '4 – 8 weeks',
    description:
      'Ship functional code in tight, atomic increments with strict TypeScript validation, automated testing, and CI/CD reviews. Maintain continuous deployment feedback loops.',
    deliverables: [
      'Production-grade modular codebase',
      'Automated test suites (unit, integration, e2e)',
      'Continuous deployment preview environments',
    ],
  },
  {
    phase: 4,
    code: 'PHASE_04',
    title: 'Ship & Scale',
    subtitle: 'Production Hardening & Observability',
    promise: 'Zero-downtime release with telemetry dashboards and performance validation.',
    timeframe: '1 – 2 weeks',
    description:
      'Execute zero-downtime deployment, instrument end-to-end observability, and monitor Core Web Vitals, API throughput, and error rates to guarantee operational resilience.',
    deliverables: [
      'Zero-downtime production rollout',
      'Real-time dashboards, alerting & error tracing',
      'Performance audit & post-launch verification report',
    ],
  },
];
