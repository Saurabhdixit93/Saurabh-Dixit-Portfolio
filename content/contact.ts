import { ContactContent } from './types';

/**
 * Single source of truth for Contact & Footer sections copy, metadata, and configuration.
 */
export const contactContent: ContactContent = {
  annotation: '// 10 · CONTACT & INQUIRIES',
  heading: 'Initiate Contact & Transmit Inquiries',
  subheading:
    'Available for VP of Engineering roles, high-scale AI consulting, and technical advisory.',
  responsePromise: 'TYPICAL REPLY < 24H',

  form: {
    dispatchHeader: '// DISPATCH MESSAGE',
    name: {
      label: 'Your Name *',
      placeholder: 'e.g. Alex Mercer',
    },
    email: {
      label: 'Your Email *',
      placeholder: 'alex@company.com',
    },
    intent: {
      label: 'Discussion Intent *',
      placeholder: 'Select inquiry intent',
    },
    message: {
      label: 'Message *',
      placeholder:
        'Tell me about the system, scale requirements, or project scope...',
    },
    disclaimer: '* All communications treated under NDA',
    submitButtonText: 'Send Message →',
    submittingButtonText: 'Transmitting...',
    successTitle: '✓ MESSAGE TRANSMITTED SUCCESSFULLY',
    successMessage:
      'Thank you for getting in touch. I review incoming engineering inquiries daily and will respond to your email within 24 hours.',
    resetButtonText: 'Send another message',
  },

  intents: [
    {
      value: 'full-time',
      label: 'Full-Time Leadership / VP Role',
      description: 'Executive leadership, VP of Engineering, or Head of Engineering',
    },
    {
      value: 'consulting',
      label: 'AI & Distributed Systems Consulting',
      description: 'Architecture audits, agent workflows, scaling infrastructure',
    },
    {
      value: 'advisory',
      label: 'Technical Advisory & Code Review',
      description: 'Strategic technology advisory, diligence, or architecture review',
    },
    {
      value: 'collaboration',
      label: 'Open Source & Collaboration',
      description: 'Engineering collaboration, open-source projects, and research',
    },
    {
      value: 'general',
      label: 'General Engineering Inquiry',
      description: 'Just saying hi, general networking, or quick questions',
    },
  ],

  directChannels: {
    inboxHeader: '// DIRECT INBOX',
    copyButtonText: 'Copy email address',
    copiedButtonText: '✓ Copied to clipboard',
  },

  telemetry: {
    header: '// OPERATIONAL TELEMETRY',
    statusLabel: 'Current Status:',
    locationLabel: 'Base Location:',
    timeLabel: 'Local Time (IST):',
  },

  resume: {
    header: '// VERIFIED EXTERNAL PROFILES',
    buttonText: 'Download Verified Resume (PDF) ↓',
    downloadPath: '/resume.pdf',
    fileName: 'Saurabh_Dixit_Resume.pdf',
  },

  footer: {
    brandTag: 'SAURABH DIXIT',
    brandTitle: 'VP ENG · AI SYSTEMS',
    summary:
      'Full-Stack Engineer & VP of Engineering. Specializing in AI-integrated products, distributed workflows, and scalable systems architecture.',
    sitemapHeader: '// ARCHITECTURAL SITEMAP',
    externalHeader: '// EXTERNAL NODES',
    backToTopText: 'Return to top',
    copyrightPrefix: 'Saurabh Dixit. All rights reserved.',
    tagline: 'Built with Next.js - designed in the open',
    navLinks: [
      { label: 'About', href: '#about' },
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Stack', href: '#stack' },
      { label: 'Work', href: '#work' },
      { label: 'Experience', href: '#experience' },
      { label: 'AI Workflow', href: '#ai-workflow' },
      { label: 'Process', href: '#process' },
      { label: 'Contact', href: '#contact' },
    ],
  },
};
