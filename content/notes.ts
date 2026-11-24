import { EngineeringNote, NotesContent } from './types';

/**
 * Notes section metadata and header configuration
 */
export const notesContent: NotesContent = {
  annotation: '// 09 · ENGINEERING NOTES & ADRs',
  heading: 'Engineering Notes & Architectural ADRs',
  subheading:
    'Distilled write-ups on distributed systems, offline-first AI, and zero-CLS frontend architectures.',
};

/**
 * Engineering Notes & Architectural Decision Records
 * Thought leadership and systems architecture write-ups.
 */
export const engineeringNotes: EngineeringNote[] = [
  {
    id: 'note-01',
    slug: 'offline-first-ai-retrieval',
    title: 'Architecting Offline-First AI Retrieval for Web Applications',
    summary:
      'Techniques for client-side vector search, indexed embeddings in IndexedDB, and progressive fallback topologies when edge connectivity drops.',
    readingTime: '5 min read',
    date: '2025-01-15',
    publishedAt: '2025-01-15',
    category: 'AI Architecture',
    tags: ['Offline AI', 'Vector Search', 'IndexedDB', 'TypeScript'],
    link: {
      url: 'https://github.com/saurabhdixit93',
      label: 'Read note ↗',
      isExternal: true,
    },
  },
  {
    id: 'note-02',
    slug: 'distributed-iot-sensor-scaling',
    title: 'Scaling Distributed IoT Sensor Ingestion to High Throughput',
    summary:
      'Partitioning telemetry pipelines, mitigating worker backpressure with Redis Streams, and optimizing time-series storage for precision agriculture.',
    readingTime: '6 min read',
    date: '2025-02-02',
    publishedAt: '2025-02-02',
    category: 'Distributed Systems',
    tags: ['Distributed Systems', 'IoT', 'Redis Streams', 'Time-Series'],
    link: {
      url: 'https://github.com/saurabhdixit93',
      label: 'Read note ↗',
      isExternal: true,
    },
  },
  {
    id: 'note-03',
    slug: 'zero-cls-design-tokens-blueprint',
    title: 'Zero-CLS Design Tokens in Systems Blueprint Architecture',
    summary:
      'Eliminating layout shift in dynamic theme systems using strict token contracts, SSR hydration guards, and subgrid rail alignment in Next.js 15.',
    readingTime: '4 min read',
    date: '2025-02-20',
    publishedAt: '2025-02-20',
    category: 'Frontend Architecture',
    tags: ['Design Systems', 'Zero-CLS', 'Next.js 15', 'Performance'],
    link: {
      url: 'https://github.com/saurabhdixit93',
      label: 'Read note ↗',
      isExternal: true,
    },
  },
];
