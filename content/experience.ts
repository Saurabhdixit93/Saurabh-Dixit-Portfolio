import { EducationItem, ExperienceItem } from './types';

/**
 * Career Experience & Roles
 * Verified descriptions and timelines sourced directly from official resume.
 */
export const experiences: ExperienceItem[] = [
  {
    id: 'sensegrass-vpe',
    company: 'Sensegrass',
    role: 'VP of Engineering',
    period: 'Jan 2025 — Present',
    startDate: '2025-01',
    endDate: 'Present',
    isCurrent: true,
    description:
      'Directing a cross-functional engineering team, lifting delivery velocity by 35% and shortening release cycles by 25% through optimized processes and technical leadership.',
    achievements: [
      'Directed cross-functional engineering team, lifting delivery velocity by +35% and shortening release cycles by 25%',
      'Architected AI assistants and automation pipelines that scaled to 3× higher usage without downtime',
      'Established engineering standards for architecture, DevOps, and code quality, cutting integration defects by 40%',
    ],
    technologies: [
      'TypeScript',
      'Node.js',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'LLM Integrations',
      'CI/CD Pipelines',
    ],
    location: 'Remote / India',
    thumbnail: '/exp4.svg',
  },
  {
    id: 'sensegrass-sr-sde',
    company: 'Sensegrass',
    role: 'Senior Software Development Engineer',
    period: 'May 2024 — Jan 2025',
    startDate: '2024-05',
    endDate: '2025-01',
    isCurrent: false,
    description:
      'Engineered backend and platform components that enhanced API throughput by 30% and strengthened overall system resilience.',
    achievements: [
      'Engineered backend and platform components that enhanced API throughput by +30%',
      'Resolved complex distributed-system failures, lowering recurring incidents by -45% and improving MTTR by 30%',
      'Collaborated with data and product teams to launch 3+ AI/automation features, contributing to a 20–25% uplift in workflow adoption',
      'Revamped legacy modules, trimming execution latency by 20–35% across critical paths',
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
    period: 'Sep 2023 — May 2024',
    startDate: '2023-09',
    endDate: '2024-05',
    isCurrent: false,
    description:
      'Delivered full-stack features by architecting scalable frontend modules and backend services, enabling seamless end-to-end application workflows.',
    achievements: [
      'Delivered scalable frontend modules and backend services for end-to-end applications',
      'Built and integrated AI-powered features, including chatbot modules and data automation',
      'Created responsive, user-centric UI components with clean, maintainable front-end code',
      'Managed database design, optimization, and performance tuning across SQL/NoSQL systems',
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
    period: 'Oct 2022 — Oct 2023',
    startDate: '2022-10',
    endDate: '2023-10',
    isCurrent: false,
    description:
      'Developed backend services and RESTful APIs using Node.js and Express. Built automation workflows for data processing and internal operational tasks.',
    achievements: [
      'Developed backend services and RESTful APIs using Node.js, Express, and modern JavaScript standards',
      'Built automation workflows for data processing, API integrations, and internal operational tasks',
      'Worked extensively with SQL databases for schema design, writing optimized queries, and improving data performance',
    ],
    technologies: [
      'Node.js',
      'Express',
      'JavaScript',
      'RESTful APIs',
      'SQL',
      'PostgreSQL',
      'MySQL',
    ],
    location: 'India',
    thumbnail: '/exp1.svg',
  },
];

export const education: EducationItem[] = [
  {
    id: 'bundelkhand-univ',
    degree: 'Bachelor of Science (Mathematics Education)',
    institution: 'Bundelkhand University, Jhansi',
    duration: '2019 — 2022',
    description:
      'Strong academic foundation in Mathematics and Science. Formal education in science paired with long-term hands-on specialization in software architecture, distributed systems, and AI engineering.',
    icon: '/education.png',
  },
];
