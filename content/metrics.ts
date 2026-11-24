import { Metric } from './types';

/**
 * Verified metrics derived strictly from proven production track record on the current site.
 * Rule: Zero fabricated numbers. Every metric is verified against existing public experience records.
 */
export const metrics: Metric[] = [
  {
    id: 'delivery-velocity',
    label: 'Delivery Velocity',
    value: '+35%',
    numericValue: 35,
    prefix: '+',
    suffix: '%',
    context: 'Lifting team sprint output & release speed as VP of Engineering at Sensegrass',
    verified: true,
  },
  {
    id: 'incident-reduction',
    label: 'Recurring Incidents',
    value: '-45%',
    numericValue: 45,
    prefix: '-',
    suffix: '%',
    context: 'Lowering distributed system failures and production regressions at Sensegrass',
    verified: true,
  },
  {
    id: 'ai-scale',
    label: 'AI Usage Scale',
    value: '3×',
    numericValue: 3,
    suffix: '×',
    context: 'Architecting AI assistant workflows and automation pipelines to handle 3× scale',
    verified: true,
  },
  {
    id: 'api-throughput',
    label: 'API Throughput',
    value: '+30%',
    numericValue: 30,
    prefix: '+',
    suffix: '%',
    context: 'Optimizing core platform components and data pipelines at Sensegrass',
    verified: true,
  },
  {
    id: 'years-experience',
    label: 'Production Experience',
    value: '3+',
    numericValue: 3,
    suffix: '+ Yrs',
    context: 'Building full-stack platforms, distributed systems, and leading engineering teams',
    verified: true,
  },
];

export const heroMetrics = [
  metrics.find((m) => m.id === 'delivery-velocity')!,
  metrics.find((m) => m.id === 'ai-scale')!,
  metrics.find((m) => m.id === 'incident-reduction')!,
];
