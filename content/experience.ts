import { EducationItem, ExperienceItem } from './types';

/**
 * Career Experience & Roles
 * Verified descriptions sourced directly from production data/index.ts.
 * Missing months are flagged with explicit TODO(owner) markers.
 */
export const experiences: ExperienceItem[] = [
  {
    id: 'sensegrass-vpe',
    company: 'Sensegrass',
    role: 'VP of Engineering',
    period: '2025 — Present // TODO(owner): confirm exact start month',
    startDate: '2025 // TODO(owner): confirm start month',
    endDate: 'Present',
    isCurrent: true,
    description:
      'Directing a cross-functional engineering team, lifting delivery velocity by 35%. Architecting AI assistants and automation pipelines that scale to 3× higher usage.',
    achievements: [
      'Lifted engineering delivery velocity by +35% across sprint cycles',
      'Architected production AI assistants and automated pipelines scaling to 3× usage',
      'Established engineering standards, sprint cadences, and cross-functional leadership',
    ],
    technologies: [
      'TypeScript',
      'Node.js',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'LLM Integrations',
    ],
    location: 'Remote / India',
    thumbnail: '/exp4.svg',
  },
  {
    id: 'sensegrass-sr-sde',
    company: 'Sensegrass',
    role: 'Senior Software Development Engineer',
    period: '2024 — 2025 // TODO(owner): confirm exact start and end months (previous site showed 2024 - 2024)',
    startDate: '2024 // TODO(owner): confirm start month',
    endDate: '2025 // TODO(owner): confirm end month',
    isCurrent: false,
    description:
      'Engineered platform components that enhanced API throughput by 30%. Resolved complex distributed-system failures, lowering recurring incidents by 45%.',
    achievements: [
      'Enhanced core platform API throughput by +30% through query and caching optimizations',
      'Diagnosed and resolved distributed system bottlenecks, cutting recurring incidents by -45%',
      'Hardened backend services, worker queues, and database connection handling',
    ],
    technologies: [
      'Node.js',
      'TypeScript',
      'Redis',
      'MongoDB',
      'PostgreSQL',
      'REST APIs',
      'Docker',
    ],
    location: 'Remote / India',
    thumbnail: '/exp5.svg',
  },
  {
    id: 'sensegrass-fullstack',
    company: 'Sensegrass',
    role: 'Full Stack Engineer',
    period: '2023 — 2024 // TODO(owner): confirm exact start and end months',
    startDate: '2023 // TODO(owner): confirm start month',
    endDate: '2024 // TODO(owner): confirm end month',
    isCurrent: false,
    description:
      'Delivered scalable frontend modules and backend services for end-to-end applications. Built and integrated AI-powered chatbot modules and data automation.',
    achievements: [
      'Engineered responsive web client interfaces and microservices across full product lifecycle',
      'Designed and deployed conversational AI chatbot interfaces for user automation',
      'Integrated third-party APIs, authentication, and asynchronous data ingestion pipelines',
    ],
    technologies: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'MongoDB',
      'Firebase',
    ],
    location: 'Remote / India',
    thumbnail: '/exp3.svg',
  },
  {
    id: 'kenmark-itan',
    company: 'Kenmark ITan Solutions',
    role: 'Junior Node.js Developer',
    period: '2022 — 2023 // TODO(owner): confirm exact start and end months',
    startDate: '2022 // TODO(owner): confirm start month',
    endDate: '2023 // TODO(owner): confirm end month',
    isCurrent: false,
    description:
      'Developed backend services and RESTful APIs using Node.js and Express. Built automation workflows for data processing and internal operational tasks.',
    achievements: [
      'Built and maintained RESTful API endpoints in Node.js/Express for core client services',
      'Constructed internal automation scripts reducing manual data processing overhead',
      'Assisted in schema migration, unit testing, and API integration documentation',
    ],
    technologies: [
      'Node.js',
      'Express',
      'JavaScript',
      'RESTful APIs',
      'MongoDB',
      'Git',
    ],
    location: 'India',
    thumbnail: '/exp1.svg',
  },
];

export const education: EducationItem[] = [
  {
    id: 'bu-jhansi-bsc',
    degree: 'Bachelor of Science (Maths & Science)',
    institution: 'Bundelkhand University, Jhansi',
    duration: '2019 — 2022',
    description:
      'Strong academic foundation in Mathematics and Science, instilling first-principles analytical reasoning and algorithmic discipline for software engineering.',
    icon: '/education.png',
  },
];
