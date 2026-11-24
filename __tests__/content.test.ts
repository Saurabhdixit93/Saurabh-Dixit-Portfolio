/**
 * Content Layer Verification Tests
 * Ensures data integrity, contract compliance, and absence of fabricated content.
 */

import {
  profile,
  metrics,
  heroMetrics,
  experiences,
  education,
  projects,
  stackCategories,
  capabilities,
  principles,
  processPhases,
  testimonials,
  assistantKnowledge,
} from '../content';

export function runContentValidation(): { success: boolean; checksPassed: number } {
  let checksPassed = 0;

  // 1. Profile Verification
  if (!profile.name || profile.name !== 'Saurabh Dixit') {
    throw new Error('Profile name must be "Saurabh Dixit"');
  }
  if (!profile.roleTitles.includes('Full-Stack Engineer') || !profile.roleTitles.some(r => r.includes('VP of Engineering'))) {
    throw new Error('Profile must include Full-Stack Engineer and VP of Engineering');
  }
  if (profile.email !== 'smartds2550@gmail.com') {
    throw new Error('Profile email mismatch');
  }
  if (profile.timezone !== 'Asia/Kolkata') {
    throw new Error('Profile timezone must be Asia/Kolkata');
  }
  checksPassed++;

  // 2. Metrics Verification - Integrity Check
  if (metrics.length !== 5) {
    throw new Error(`Expected exactly 5 verified metrics, got ${metrics.length}`);
  }
  for (const m of metrics) {
    if (m.verified !== true) {
      throw new Error(`Metric ${m.id} must be marked verified: true`);
    }
  }
  const metricIds = metrics.map((m) => m.id);
  const expectedMetricIds = [
    'delivery-velocity',
    'incident-reduction',
    'ai-scale',
    'api-throughput',
    'years-experience',
  ];
  for (const id of expectedMetricIds) {
    if (!metricIds.includes(id)) {
      throw new Error(`Missing expected metric: ${id}`);
    }
  }
  if (heroMetrics.length !== 3) {
    throw new Error('Hero metrics must contain exactly 3 highlighted proof metrics');
  }
  checksPassed++;

  // 3. Experience Verification
  if (experiences.length !== 4) {
    throw new Error(`Expected 4 experience items, got ${experiences.length}`);
  }
  const companies = experiences.map((e) => e.company);
  if (!companies.includes('Sensegrass') || !companies.includes('Kenmark ITan Solutions')) {
    throw new Error('Experiences must include Sensegrass and Kenmark ITan Solutions');
  }
  if (education.length === 0 || !education[0].institution.includes('Bundelkhand University')) {
    throw new Error('Education must reflect Bundelkhand University, Jhansi');
  }
  checksPassed++;

  // 4. Projects Verification
  if (projects.length !== 6) {
    throw new Error(`Expected 6 seeded projects, got ${projects.length}`);
  }
  const slugs = projects.map((p) => p.slug);
  const expectedSlugs = [
    'ai-code-review',
    'disha-ai-health-coach',
    'careers-page-builder',
    'react-chat-app',
    'youtube-downloader',
    'systems-blueprint-portfolio',
  ];
  for (const s of expectedSlugs) {
    if (!slugs.includes(s)) {
      throw new Error(`Missing project slug: ${s}`);
    }
  }

  // Verify link label rule:
  const aiCodeReview = projects.find((p) => p.slug === 'ai-code-review')!;
  if (aiCodeReview.links.live || !aiCodeReview.links.repo) {
    throw new Error('ai-code-review must have repo link only, not live');
  }

  const reactChat = projects.find((p) => p.slug === 'react-chat-app')!;
  if (!reactChat.links.live) {
    throw new Error('react-chat-app must have live link');
  }
  checksPassed++;

  // 5. Stack Verification
  if (stackCategories.length !== 5) {
    throw new Error(`Expected 5 stack categories, got ${stackCategories.length}`);
  }
  const categoryIds = stackCategories.map((c) => c.id);
  for (const cat of ['ai-llm', 'backend', 'data', 'frontend', 'devops-infra']) {
    if (!categoryIds.includes(cat)) {
      throw new Error(`Missing stack category: ${cat}`);
    }
  }
  checksPassed++;

  // 6. Capabilities Verification
  if (capabilities.length !== 4) {
    throw new Error(`Expected 4 capabilities, got ${capabilities.length}`);
  }
  checksPassed++;

  // 7. Principles Verification
  if (principles.length < 3 || principles.length > 4) {
    throw new Error(`Expected 3 to 4 principles, got ${principles.length}`);
  }
  checksPassed++;

  // 8. Process Phases Verification - Non-duplicate titles
  if (processPhases.length !== 4) {
    throw new Error(`Expected 4 process phases, got ${processPhases.length}`);
  }
  const titles = processPhases.map((p) => p.title.trim().toLowerCase());
  const uniqueTitles = new Set(titles);
  if (uniqueTitles.size !== titles.length) {
    throw new Error('Process phase titles must be completely distinct with no duplicates');
  }
  checksPassed++;

  // 9. Testimonials Integrity Verification
  if (testimonials.length !== 0) {
    throw new Error('Testimonials array must be strictly empty to prevent fabricated testimonials');
  }
  checksPassed++;

  // 10. Assistant Knowledge Base Verification
  if (assistantKnowledge.length < 10) {
    throw new Error('Assistant knowledge base should contain at least 10 grounded entries');
  }
  for (const entry of assistantKnowledge) {
    if (!entry.id || !entry.topic || !entry.content || !entry.keywords.length) {
      throw new Error(`Malformed knowledge entry: ${entry.id}`);
    }
  }
  checksPassed++;

  return { success: true, checksPassed };
}
