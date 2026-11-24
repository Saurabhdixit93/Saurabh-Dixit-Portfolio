/**
 * Typed Content Layer for Saurabh Dixit's Portfolio Redesign
 * Single source of truth for all content, copy, metrics, and metadata.
 */

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'whatsapp';
  url: string;
  label: string;
  handle?: string;
  isPrimary?: boolean;
}

export interface AvailabilityStatus {
  status: 'available' | 'busy' | 'open';
  label: string;
  headline?: string;
}

export interface Profile {
  name: string;
  roleTitles: string[];
  taglineOptions: string[];
  headline: string;
  shortBio: string;
  leadershipBio: string;
  location: string;
  timezone: string; // e.g. "Asia/Kolkata"
  utcOffset: string; // e.g. "UTC+5:30"
  email: string;
  socials: SocialLink[];
  resumePath: string;
  availability: AvailabilityStatus;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  context: string;
  verified: true;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate: string; // ISO date or Year with TODO(owner) if month unconfirmed
  endDate: string; // ISO date, 'Present', or Year with TODO(owner)
  isCurrent: boolean;
  description: string;
  achievements?: string[];
  technologies?: string[];
  location?: string;
  thumbnail?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  description: string;
  icon?: string;
}

export interface ProjectLinks {
  live?: string;
  repo?: string;
  caseStudy?: string;
}

export interface Project {
  slug: string;
  title: string;
  pitch: string;
  problem: string;
  solution: string;
  role: string;
  stack: string[];
  metrics: string[];
  links: ProjectLinks;
  coverImage: string;
  featured: boolean;
  year: number;
  architectureDiagram?: string;
}

export interface StackItem {
  name: string;
  category: string;
  icon?: string;
  highlight?: boolean;
  level?: 'core' | 'proficient' | 'familiar';
}

export interface StackCategory {
  id: string;
  name: string;
  description?: string;
  items: StackItem[];
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  skills: string[];
  tools: string[];
}

export interface Principle {
  id: string;
  number: string;
  title: string;
  summary: string;
  description: string;
}

export interface ProcessPhase {
  phase: number;
  code: string; // e.g. "PHASE_01"
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  timeframe: string;
  promise: string;
}

export interface ProcessContent {
  annotation: string;
  heading: string;
  subheading: string;
}

export interface EngineeringNote {
  id: string;
  title: string;
  summary: string;
  readingTime: string;
  link: {
    url: string;
    label: string;
    isExternal: boolean;
  };
  date?: string;
  tags: string[];
  slug?: string;
  category?: string;
  publishedAt?: string;
  externalLink?: string;
}

export interface NotesContent {
  annotation: string;
  heading: string;
  subheading: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  avatarUrl?: string;
  verified: boolean;
  linkedInUrl?: string;
}

export interface AssistantKnowledgeEntry {
  id: string;
  category:
    | 'profile'
    | 'experience'
    | 'projects'
    | 'stack'
    | 'capabilities'
    | 'principles'
    | 'process'
    | 'general';
  topic: string;
  questionPatterns?: string[];
  content: string;
  keywords: string[];
}

// ==========================================
// Architecture Diagram Contracts (Milestone 7)
// ==========================================
export type ArchitectureCategory =
  | 'client'
  | 'gateway'
  | 'api'
  | 'service'
  | 'worker'
  | 'database'
  | 'ai'
  | 'queue'
  | 'storage'
  | 'external';

export type ArchitectureNodeType = ArchitectureCategory;

export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel?: string;
  category?: ArchitectureCategory;
  type?: ArchitectureNodeType;
  x: number; // coordinate or percentage in SVG canvas (0-800 or 0-100)
  y: number; // coordinate or percentage in SVG canvas (0-420 or 0-100)
  active?: boolean;
  status?: 'active' | 'standby' | 'monitored';
  statusBadge?: string;
}

export interface ArchitectureEdge {
  from: string; // source node id
  to: string;   // target node id
  label?: string;
  protocol?: string;
  flow?: 'forward' | 'reverse' | 'bidirectional';
  animated?: boolean;
}

export interface ArchitectureDiagramData {
  summary?: string;
  description?: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

// ==========================================
// Key Decision & Trade-off Contract
// ==========================================
export interface KeyDecision {
  title: string;
  context?: string;
  choice?: string;
  decision?: string;
  considered?: string;
  tradeOff: string;
}

// ==========================================
// Case Study Contracts
// ==========================================
export interface CaseStudyMetric {
  label: string;
  value: string;
  context?: string;
  verified: boolean;
}

export interface CaseStudyProblem {
  headline?: string;
  summary: string;
  description?: string;
  painPoints?: string[];
  points?: string[];
  ownerTodo?: string;
}

export interface CaseStudyConstraints {
  items: string[];
  ownerTodo?: string;
}

export interface CaseStudyRoleResponsibilities {
  summary: string;
  responsibilities: string[];
  ownerTodo?: string;
}

export interface CaseStudyResults {
  summary: string;
  outcomes?: string[];
  metrics?: string[];
  ownerTodo?: string;
}

export interface CaseStudyStackItem {
  name: string;
  purpose: string;
}

export interface CaseStudy {
  slug: string;
  aliases?: string[];
  projectId?: string;
  title: string;
  subtitle: string;
  pitch?: string;
  role: string;
  year: number;
  timeline?: string;
  clientOrContext?: string;
  featured: boolean;
  coverImage: string;
  links: {
    live?: string;
    repo?: string;
    caseStudy: string;
  };
  metrics: CaseStudyMetric[];
  problem: CaseStudyProblem;
  constraints: string[] | CaseStudyConstraints;
  roleResponsibilities?: CaseStudyRoleResponsibilities;
  architecture: ArchitectureDiagramData;
  decisions: KeyDecision[];
  results: CaseStudyResults;
  stack: string[] | CaseStudyStackItem[];
}

export type CaseStudyData = CaseStudy;

// ==========================================
// AI Workflow & Assistant Contracts (Milestone 9)
// ==========================================
export type AIToolCategory = 'model' | 'ide-agent' | 'orchestration' | 'guardrail';

export interface AIToolItem {
  id: string;
  name: string;
  category: AIToolCategory;
  role: string;
  description: string;
  verificationStatus: 'verified' | 'todo-owner';
  badge?: string;
}

export interface AIPipelineStage {
  step: number;
  code: string;
  title: string;
  description: string;
  humanRole: string;
  aiRole: string;
  deliverable: string;
}

export interface AIWorkflowContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  philosophyTitle: string;
  philosophyDescription: string;
  philosophyBullets: string[];
  tools: AIToolItem[];
  pipelineStages: AIPipelineStage[];
  assistantTeaser: {
    badge: string;
    headline: string;
    subcopy: string;
    buttonText: string;
    shortcutHint: string;
    suggestedPrompts: string[];
  };
}

// ==========================================
// Contact & Footer Contracts (Milestone 11)
// ==========================================
export interface ContactIntentOption {
  value: string;
  label: string;
  description?: string;
}

export interface ContactFormFieldCopy {
  label: string;
  placeholder?: string;
}

export interface ContactContent {
  annotation: string;
  heading: string;
  subheading: string;
  responsePromise: string;
  form: {
    dispatchHeader: string;
    name: ContactFormFieldCopy;
    email: ContactFormFieldCopy;
    intent: ContactFormFieldCopy;
    message: ContactFormFieldCopy;
    disclaimer: string;
    submitButtonText: string;
    submittingButtonText: string;
    successTitle: string;
    successMessage: string;
    resetButtonText: string;
  };
  intents: ContactIntentOption[];
  directChannels: {
    inboxHeader: string;
    copyButtonText: string;
    copiedButtonText: string;
  };
  telemetry: {
    header: string;
    statusLabel: string;
    locationLabel: string;
    timeLabel: string;
  };
  resume: {
    header: string;
    buttonText: string;
    downloadPath: string;
    fileName: string;
  };
  footer: {
    brandTag: string;
    brandTitle: string;
    summary: string;
    sitemapHeader: string;
    externalHeader: string;
    backToTopText: string;
    copyrightPrefix: string;
    tagline: string;
    navLinks: { label: string; href: string }[];
  };
}


