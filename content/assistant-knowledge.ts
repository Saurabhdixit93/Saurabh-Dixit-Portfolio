import { AssistantKnowledgeEntry } from './types';

/**
 * Assistant Grounding Knowledge Base
 * Flat, structured knowledge base derived strictly from verified content layer files.
 * Used by the "Ask Saurabh" AI assistant to answer recruiter/founder inquiries with zero hallucinations.
 */
export const assistantKnowledge: AssistantKnowledgeEntry[] = [
  {
    id: 'kb-profile',
    category: 'profile',
    topic: 'Identity, Current Role, and Background',
    questionPatterns: [
      'Who is Saurabh Dixit?',
      'What is Saurabh Dixit current role?',
      'Tell me about Saurabh Dixit.',
      'Where is Saurabh located?',
    ],
    content:
      'Saurabh Dixit is a Full-Stack Engineer and VP of Engineering at Sensegrass based in India (IST, UTC+5:30). He specializes in building scalable AI platforms, distributed systems, and leading high-velocity engineering teams. He holds a Bachelor of Science in Mathematics and Science from Bundelkhand University, Jhansi (2019-2022), providing a strong analytical and algorithmic foundation.',
    keywords: [
      'Saurabh Dixit',
      'VP of Engineering',
      'Sensegrass',
      'Full-Stack',
      'AI Systems',
      'Location',
      'India',
      'Education',
      'Bundelkhand University',
    ],
  },
  {
    id: 'kb-leadership',
    category: 'experience',
    topic: 'Engineering Leadership at Sensegrass',
    questionPatterns: [
      'How does Saurabh lead engineering teams?',
      'What did Saurabh achieve as VP of Engineering?',
      'What is his management or leadership style?',
    ],
    content:
      'As VP of Engineering at Sensegrass (2025-Present), Saurabh directs cross-functional engineering teams. He increased delivery velocity by +35% through standardized sprint cadences, automated CI/CD guardrails, and architectural RFC reviews. Under his leadership, the team scaled production AI assistants and automated data pipelines to handle 3× higher usage while maintaining high system stability.',
    keywords: [
      'Leadership',
      'VP of Engineering',
      'Sensegrass',
      'Delivery Velocity',
      '+35%',
      '3x scale',
      'AI Assistants',
      'Team Management',
    ],
  },
  {
    id: 'kb-metrics',
    category: 'general',
    topic: 'Verified Production Metrics and Track Record',
    questionPatterns: [
      'What are his key achievements?',
      'Show me verified numbers or proof of work.',
      'What metrics has Saurabh improved?',
    ],
    content:
      'Saurabh relies on verifiable numbers rather than adjectives: 1) +35% engineering delivery velocity as VP of Engineering at Sensegrass; 2) 3× AI usage scale handled by architected AI pipelines; 3) +30% API throughput achieved as Senior SDE through caching and query optimization; 4) -45% recurring production incidents resolved through root-cause analysis; 5) 3+ years of production full-stack and systems engineering experience.',
    keywords: [
      'Metrics',
      '+35% velocity',
      '-45% incidents',
      '+30% throughput',
      '3x AI scale',
      '3+ years',
      'Verified data',
    ],
  },
  {
    id: 'kb-career-history',
    category: 'experience',
    topic: 'Career Progression & Work Experience',
    questionPatterns: [
      'What is Saurabh experience history?',
      'Where has he worked before?',
      'What was his progression at Sensegrass?',
    ],
    content:
      'Saurabh has progressed through key engineering and leadership tiers: 1) VP of Engineering at Sensegrass (2025-Present, directing cross-functional teams and AI platforms); 2) Senior Software Development Engineer at Sensegrass (2024-2025, optimized API throughput by +30% and cut incidents by -45%); 3) Full Stack Engineer at Sensegrass (2023-2024, built scalable frontend modules and conversational AI chatbot integrations); 4) Junior Node.js Developer at Kenmark ITan Solutions (2022-2023, built RESTful APIs and automation workflows in Node.js/Express).',
    keywords: [
      'Career',
      'Work Experience',
      'Sensegrass',
      'Kenmark ITan Solutions',
      'Senior SDE',
      'Full Stack',
      'Node.js Developer',
    ],
  },
  {
    id: 'kb-project-ai-code-review',
    category: 'projects',
    topic: 'Enterprise AI Code Review Platform',
    questionPatterns: [
      'What is the Enterprise AI Code Review Platform?',
      'Has Saurabh built AI tools for developers?',
      'How does the code review platform work?',
    ],
    content:
      'Enterprise AI Code Review Platform is a hybrid static-analysis and AI reasoning platform for GitHub pull requests. Saurabh architected an asynchronous worker pipeline combining rule-based linting/AST checks with LLM reasoning. Built with Next.js, TypeScript, Node.js, MongoDB, Tailwind CSS, and Redis, it incorporates enterprise RBAC and automated webhook processing. Repository: https://github.com/saurabhdixit93/ai-code-review.',
    keywords: [
      'AI Code Review',
      'GitHub PR',
      'Static Analysis',
      'LLM reasoning',
      'Redis queues',
      'MongoDB',
      'Next.js',
    ],
  },
  {
    id: 'kb-project-disha-health',
    category: 'projects',
    topic: 'Disha AI Health Coach',
    questionPatterns: [
      'What is Disha AI Health Coach?',
      'What healthcare or medical AI projects has he built?',
      'How does Disha AI handle patient memory?',
    ],
    content:
      'Disha AI Health Coach is an intelligent conversational health assistant featuring WhatsApp-like UX, long-term episodic patient memory, and medical protocol integration. Saurabh built the system using FastAPI, Python, Next.js, PostgreSQL, and Redis. It enforces strict clinical guardrails while providing fluid, context-aware streaming conversations. Repository: https://github.com/Saurabhdixit93/AI-Health-Coach.',
    keywords: [
      'Disha AI',
      'Health Coach',
      'FastAPI',
      'Python',
      'Medical protocols',
      'Long-term memory',
      'Conversational AI',
    ],
  },
  {
    id: 'kb-project-careers-builder',
    category: 'projects',
    topic: 'Careers Page Builder',
    questionPatterns: [
      'What is Careers Page Builder?',
      'Has Saurabh built multi-tenant SaaS products?',
    ],
    content:
      'Careers Page Builder is a multi-tenant platform empowering recruiters to generate branded career websites with real-time live preview. Saurabh built it using Next.js, TypeScript, Supabase, MongoDB, Redis, and Tailwind CSS, featuring tenant isolation and instant visual styling updates without engineering overhead. Repository: https://github.com/Saurabhdixit93/careers-page-builder.',
    keywords: [
      'Careers Page Builder',
      'Multi-tenant',
      'SaaS',
      'Supabase',
      'MongoDB',
      'Recruitment',
      'Live preview',
    ],
  },
  {
    id: 'kb-project-react-chat-app',
    category: 'projects',
    topic: 'React Chat App',
    questionPatterns: [
      'What is the React Chat App?',
      'Where is the live demo of the chat app?',
    ],
    content:
      'React Chat App is a realtime messaging application built with React, Firebase, and Tailwind CSS. It features sub-second message synchronization via Firebase Realtime Database and AI-assisted reply suggestions. Live application: https://reactchatawebpp.netlify.app.',
    keywords: [
      'React Chat App',
      'Firebase',
      'Realtime',
      'Smart suggestions',
      'Live Demo',
    ],
  },
  {
    id: 'kb-project-youtube-downloader',
    category: 'projects',
    topic: 'YouTube Audio and Video Downloader',
    questionPatterns: [
      'What is the YouTube Downloader project?',
      'What streaming backend projects has he built?',
    ],
    content:
      'YouTube Audio and Video Downloader is a high-performance web service built with Node.js and Express. It uses stream-based piping to convert and deliver audio and video streams without buffering entire gigabyte files to server disk. Live deployment: https://youtube-converter-losg.onrender.com/.',
    keywords: [
      'YouTube Downloader',
      'Node.js',
      'Express',
      'Streams',
      'Media conversion',
      'Render',
    ],
  },
  {
    id: 'kb-project-portfolio',
    category: 'projects',
    topic: 'Personal Portfolio ("The Systems Blueprint")',
    questionPatterns: [
      'How was this portfolio designed and built?',
      'What tech stack powers this site?',
    ],
    content:
      'This portfolio ("The Systems Blueprint") was built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Three.js. It features a fully typed content layer, a zero-flash dual-theme system (Graphite dark / Paper light with signal-orange accent), WCAG AA accessibility, and an interactive system architecture narrative. Live: https://www.saurabhdixit93.site, Repo: https://github.com/saurabhdixit93/portfolio.',
    keywords: [
      'Portfolio',
      'Systems Blueprint',
      'Next.js App Router',
      'TypeScript',
      'Tailwind CSS',
      'Dual-theme',
      'Framer Motion',
    ],
  },
  {
    id: 'kb-tech-stack',
    category: 'stack',
    topic: 'Technical Stack and Proficiency',
    questionPatterns: [
      'What is Saurabh tech stack?',
      'Does Saurabh know Python or TypeScript?',
      'What databases does he use?',
    ],
    content:
      'Saurabh tech stack spans: 1) AI/LLM: Python, FastAPI, LangChain, OpenAI/Claude APIs, vector search, prompt systems; 2) Backend: Node.js, TypeScript, Express, REST APIs, asynchronous worker queues; 3) Data: PostgreSQL, Redis, MongoDB, Supabase, Firebase; 4) Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Three.js; 5) DevOps: Docker, Git/GitHub Actions, Vercel, Netlify, Render.',
    keywords: [
      'Tech Stack',
      'Python',
      'TypeScript',
      'Node.js',
      'Next.js',
      'PostgreSQL',
      'Redis',
      'MongoDB',
      'Docker',
      'FastAPI',
    ],
  },
  {
    id: 'kb-capabilities',
    category: 'capabilities',
    topic: 'Core Engineering Capabilities',
    questionPatterns: [
      'What are his primary skills?',
      'What kind of roles or contracts is he best suited for?',
    ],
    content:
      'Saurabh operates across four major capability pillars: 1) AI Platforms & Automation (building resilient LLM pipelines and automated agents); 2) Full-Stack Product Engineering (shipping production-grade web applications with modern UX); 3) Distributed Systems & APIs (optimizing throughput, concurrency, and fault tolerance); 4) Engineering Leadership (directing sprint cadences, technical RFCs, and mentoring teams).',
    keywords: [
      'Capabilities',
      'AI Platforms',
      'Full-Stack',
      'Distributed Systems',
      'Engineering Leadership',
    ],
  },
  {
    id: 'kb-principles',
    category: 'principles',
    topic: 'Engineering Principles and Philosophy',
    questionPatterns: [
      'What are his engineering principles?',
      'How does he think about software architecture?',
    ],
    content:
      'Saurabh follows four foundational engineering principles: 1) "Systems Over Silos" — viewing architecture, infrastructure, and team dynamics as one interconnected feedback loop; 2) "Metrics Over Adjectives" — validating every engineering decision with concrete measurements and benchmarks; 3) "Velocity With Guardrails" — achieving lasting speed through automated tests and strict type contracts; 4) "Pragmatic AI Integration" — leveraging AI for high-leverage reasoning while preserving deterministic validation.',
    keywords: [
      'Principles',
      'Systems Over Silos',
      'Metrics Over Adjectives',
      'Velocity With Guardrails',
      'Pragmatic AI',
    ],
  },
  {
    id: 'kb-process',
    category: 'process',
    topic: 'Development Process and Delivery Methodology',
    questionPatterns: [
      'What is his development process?',
      'How does Saurabh deliver software?',
    ],
    content:
      'Saurabh follows a disciplined four-phase approach: 1) Discover & Align (clarifying constraints, user journeys, and baseline benchmarks); 2) Design & Architect (mapping data schemas, API contracts, and security boundaries); 3) Build & Iterate (shipping modular typed code with continuous test feedback); 4) Ship & Scale (zero-downtime releases with observability and performance monitoring).',
    keywords: [
      'Process',
      'Discover & Align',
      'Design & Architect',
      'Build & Iterate',
      'Ship & Scale',
    ],
  },
  {
    id: 'kb-contact-availability',
    category: 'profile',
    topic: 'Contact Information and Availability',
    questionPatterns: [
      'How can I contact Saurabh?',
      'Is Saurabh open to new jobs or consulting?',
      'What is his email or LinkedIn?',
    ],
    content:
      'Saurabh is currently open to high-impact leadership roles, VP/Staff engineering opportunities, and select technical advisory engagements. Email: [smartds2550@gmail.com](mailto:smartds2550@gmail.com). LinkedIn: [LinkedIn](https://www.linkedin.com/in/saurabhdixit93). GitHub: [GitHub](https://github.com/saurabhdixit93). Resume: [Resume (PDF)](/resume.pdf). Location: India (IST, UTC+5:30).',
    keywords: [
      'Contact',
      'Email',
      'LinkedIn',
      'GitHub',
      'Resume',
      'Availability',
      'Open to opportunities',
    ],
  },
  {
    id: 'kb-certifications',
    category: 'profile',
    topic: 'Professional Certifications & Accreditations',
    questionPatterns: [
      'What certifications does Saurabh have?',
      'Has he completed any accredited courses?',
      'Show me his credentials and certifications.',
      'Is he certified in full-stack or frontend?',
    ],
    content:
      'Saurabh holds 3 verified industry credentials: 1) Micro1 Talent Certification (Nov 2025, microl.ai/apply-as-talent); 2) Pro5.ai Frontend Engineering Certification (Jul 2024, ID: 38756230258); 3) Coding Ninjas Full Stack Web Development (Jul 2023, ID: 3edda2132ea34344). These validate his core competencies across modern full-stack web engineering and UI development.',
    keywords: [
      'Certifications',
      'Micro1',
      'Pro5.ai',
      'Coding Ninjas',
      'Full Stack',
      'Credentials',
      'Accreditation',
    ],
  },
  {
    id: 'kb-project-yieldsync',
    category: 'projects',
    topic: 'YieldSync Agritech Platform (Sensegrass)',
    questionPatterns: [
      'What is YieldSync?',
      'What IoT or agritech projects has he worked on?',
      'Tell me about farm automation and sensor telemetry at Sensegrass.',
    ],
    content:
      'YieldSync by Sensegrass (Feb 2024) is an agritech platform delivering real-time farm data processing and agronomy intelligence. Saurabh engineered end-to-end automation workflows, robust API pipelines for sensor data ingestion and cross-platform synchronization, and integrated AI-driven decision-making for crop yield predictions and farm management.',
    keywords: [
      'YieldSync',
      'Sensegrass',
      'Agritech',
      'Sensors',
      'Telemetry',
      'Yield Prediction',
      'IoT',
      'Data Ingestion',
    ],
  },
  {
    id: 'kb-project-email-agent',
    category: 'projects',
    topic: 'AI Email Automation Agent',
    questionPatterns: [
      'What is the AI Email Automation Agent?',
      'Has he built email automation workflows?',
      'How does his AI email agent work?',
    ],
    content:
      'The AI Email Automation Agent (May 2025) is an automated communication system built with Next.js and OpenAI. It features intelligent, context-aware email generation, integrated SMTP and SendGrid pipelines for automated triggers, and an intuitive UI for drafting, previewing, and templating recurring communication workflows with high consistency.',
    keywords: [
      'AI Email Agent',
      'Email Automation',
      'SendGrid',
      'SMTP',
      'OpenAI',
      'Next.js',
      'Productivity',
    ],
  },
  {
    id: 'kb-experience-kenmark',
    category: 'experience',
    topic: 'Junior Node.js Developer at Kenmark ITan Solutions',
    questionPatterns: [
      'What did Saurabh do at Kenmark ITan Solutions?',
      'Tell me about his first software role.',
      'What was his work in 2022-2023?',
    ],
    content:
      'At Kenmark ITan Solutions (Oct 2022 — Oct 2023), Saurabh served as Junior Node.js Developer. He developed core backend services and RESTful APIs using Node.js and Express, constructed internal automation workflows for data processing, and worked extensively with SQL databases (schema design, query optimization, and performance tuning).',
    keywords: [
      'Kenmark ITan Solutions',
      'Junior Node.js Developer',
      'Express',
      'Node.js',
      'REST APIs',
      'SQL',
      '2022',
      '2023',
    ],
  },
  {
    id: 'kb-education-bundelkhand',
    category: 'profile',
    topic: 'Academic Foundation — Bundelkhand University Jhansi',
    questionPatterns: [
      'Where did Saurabh go to college or university?',
      'What is his degree and educational background?',
      'What did he study at Bundelkhand University?',
      'When did he graduate from college?',
    ],
    content:
      'Saurabh graduated in July 2022 with a Bachelor of Science (B.Sc.) in Mathematics Education / Mathematics & Science from Bundelkhand University, Jhansi (UP, India). His rigorous training in discrete mathematics, numerical analysis, and scientific computing underpins his deterministic approach to distributed systems and AI guardrails.',
    keywords: [
      'Education',
      'Bundelkhand University',
      'Jhansi',
      'Bachelor of Science',
      'BSc',
      'Maths',
      'Mathematics',
      '2019-2022',
      'College',
    ],
  },
  {
    id: 'kb-assistant-guidelines',
    category: 'general',
    topic: 'Assistant Guardrails & Response Boundaries',
    questionPatterns: [
      'Can you tell me things not in the resume?',
      'Can you write a poem or talk about politics?',
    ],
    content:
      'The Ask Saurabh assistant is strictly grounded in Saurabh Dixit verified portfolio, technical skills, projects, and work history. It will politely decline to answer speculative questions, fabricate unverified metrics, or discuss topics outside of Saurabh professional background and engineering philosophy.',
    keywords: [
      'Guardrails',
      'Grounding',
      'No Hallucination',
      'Verification',
      'Scope',
    ],
  },
];
