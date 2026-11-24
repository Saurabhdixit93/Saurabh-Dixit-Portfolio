import { Project } from './types';

/**
 * Flagship Projects Portfolio
 * Master Rule: Links must match destinations. Only include `live` if a verified live URL exists.
 * Any unconfirmed problem or impact metrics are explicitly marked with `TODO(owner)`.
 */
export const projects: Project[] = [
  {
    slug: 'ai-code-review',
    title: 'Enterprise AI Code Review Platform',
    pitch:
      'Hybrid static-analysis and AI reasoning platform automating code quality reviews on GitHub pull requests.',
    problem:
      'Manual code reviews create engineering bottlenecks and inconsistent quality enforcement across large enterprise pull requests. // TODO(owner): confirm exact baseline review turnaround time or target team size',
    solution:
      'Architected an asynchronous worker pipeline combining rule-based static analysis with LLM reasoning, integrated with GitHub webhooks and enterprise role-based access control (RBAC).',
    role: 'Lead Architect & Full-Stack Engineer',
    stack: [
      'Next.js',
      'TypeScript',
      'Node.js',
      'MongoDB',
      'Tailwind CSS',
      'Redis',
    ],
    metrics: [
      'Automated pull request analysis combining static checks and LLM reasoning',
      'Asynchronous worker queue architecture with enterprise RBAC // TODO(owner): add benchmark metrics (e.g. analysis time per PR or token cost)',
    ],
    links: {
      repo: 'https://github.com/saurabhdixit93/ai-code-review',
      caseStudy: '/work/ai-code-review',
    },
    coverImage: '/ai-code-review.png',
    featured: true,
    year: 2024,
  },
  {
    slug: 'disha-ai-health-coach',
    title: 'Disha AI Health Coach',
    pitch:
      "India's first AI health coach with WhatsApp-like conversational UX, long-term memory, and clinical protocol integration.",
    problem:
      'Digital healthcare guidance is typically disjointed, non-conversational, and forgets patient history between sessions. // TODO(owner): confirm specific clinical domain or pilot user group',
    solution:
      'Engineered an intelligent conversational backend using FastAPI, Python, and Next.js with vector retrieval, stateful memory sessions, and strict medical protocol guardrails.',
    role: 'Full-Stack Engineer & AI Systems Architect',
    stack: [
      'Next.js',
      'TypeScript',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'Tailwind CSS',
    ],
    metrics: [
      'Real-time streaming conversational interface with WhatsApp-like familiarity',
      'Stateful episodic patient memory and clinical protocol guardrails // TODO(owner): confirm active user count or conversation volume',
    ],
    links: {
      repo: 'https://github.com/Saurabhdixit93/AI-Health-Coach',
      caseStudy: '/work/disha-ai-health-coach',
    },
    coverImage: '/ai-health-coach.png',
    featured: true,
    year: 2024,
  },
  {
    slug: 'careers-page-builder',
    title: 'Careers Page Builder',
    pitch:
      'Multi-tenant SaaS platform allowing recruiters to generate custom branded career portals with real-time live preview.',
    problem:
      'Recruiting teams need branded career portals but rely on expensive engineering cycles or static job boards. // TODO(owner): confirm average setup time before builder',
    solution:
      'Built a multi-tenant web application featuring real-time preview editing, theme customization, and automated database sync powered by Supabase and MongoDB.',
    role: 'Full-Stack Engineer',
    stack: [
      'Next.js',
      'TypeScript',
      'Supabase',
      'MongoDB',
      'Redis',
      'Tailwind CSS',
    ],
    metrics: [
      'Zero-code real-time portal generator for recruitment teams',
      'Multi-tenant isolation and live styling engine // TODO(owner): confirm number of generated portals or recruiter time savings',
    ],
    links: {
      repo: 'https://github.com/Saurabhdixit93/careers-page-builder',
      caseStudy: '/work/careers-page-builder',
    },
    coverImage: '/careers-page-builder.png',
    featured: true,
    year: 2024,
  },
  {
    slug: 'react-chat-app',
    title: 'React Chat App',
    pitch:
      'Real-time chat web application featuring AI-assisted smart replies and instant message synchronization.',
    problem:
      'Traditional lightweight chat apps lack contextual smart suggestions and responsive conversation threads. // TODO(owner): confirm specific problem context or original scope',
    solution:
      'Developed a responsive React chat client backed by Firebase Realtime Database and integrated with conversational suggestion workflows.',
    role: 'Frontend & Full-Stack Developer',
    stack: ['React', 'Firebase', 'Tailwind CSS', 'JavaScript'],
    metrics: [
      'Sub-second message delivery via Firebase Realtime synchronization',
      'AI-powered smart contextual reply prompts // TODO(owner): confirm user or test metrics',
    ],
    links: {
      live: 'https://reactchatawebpp.netlify.app',
      caseStudy: '/work/react-chat-app',
    },
    coverImage: '/project1.svg',
    featured: false,
    year: 2023,
  },
  {
    slug: 'youtube-downloader',
    title: 'YouTube Audio and Video Downloader',
    pitch:
      'High-throughput media extraction and conversion service powered by Node.js stream pipelines.',
    problem:
      'Online media downloaders are frequently congested with ads, slow transcoding, and memory leaks on large video streams. // TODO(owner): confirm target formats and throughput',
    solution:
      'Constructed an Express and Node.js backend streaming service that pipes and converts audio/video directly to the client without buffering entire multi-gigabyte files to disk.',
    role: 'Backend Developer',
    stack: ['Node.js', 'Express', 'HTML5', 'CSS3', 'JavaScript'],
    metrics: [
      'Zero-buffer diskless stream piping minimizing server memory overhead',
      'Direct client format conversion // TODO(owner): confirm request throughput or user count',
    ],
    links: {
      live: 'https://youtube-converter-losg.onrender.com/',
      caseStudy: '/work/youtube-downloader',
    },
    coverImage: '/Project5.svg',
    featured: false,
    year: 2023,
  },
  {
    slug: 'systems-blueprint-portfolio',
    title: 'Personal Portfolio Redesign ("The Systems Blueprint")',
    pitch:
      'Modern engineering portfolio engineered as a living system architecture diagram with dual-theme design tokens.',
    problem:
      'Previous template-based site suffered from ambiguous positioning, unverified testimonials, and hardcoded copy lacking architectural depth. // TODO(owner): confirm previous site performance score baseline',
    solution:
      'Redesigned the portfolio using Next.js App Router, strict typed content layer, no-flash theme engine, Instrument Serif typography, and WCAG AA accessible primitives.',
    role: 'Architect & Engineer',
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Three.js',
    ],
    metrics: [
      '100% typed content layer with zero data duplication across components',
      'WCAG AA compliance, keyboard navigation, and flicker-free theme switching',
    ],
    links: {
      live: 'https://www.saurabhdixit93.site',
      repo: 'https://github.com/saurabhdixit93/portfolio',
      caseStudy: '/work/systems-blueprint-portfolio',
    },
    coverImage: '/Project6.svg',
    featured: true,
    year: 2025,
  },
];
