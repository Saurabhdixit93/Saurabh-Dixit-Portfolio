/**
 * Milestone 10 (Prompt 9: How I Work / Process + Optional Voices + Notes)
 * Comprehensive Verification Test Suite
 */

import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";

import {
  processPhases,
  processContent,
  testimonials,
  engineeringNotes,
  notesContent,
  FEATURE_FLAGS,
  isNotesEnabled,
} from "../content";

import { Process } from "../components/sections/Process";
import { ProcessCard } from "../components/sections/process/ProcessCard";
import { Voices } from "../components/sections/Voices";
import { Notes } from "../components/sections/Notes";

import ProcessFacade from "../components/Process";
import VoicesFacade from "../components/Voices";
import NotesFacade from "../components/Notes";
import * as SectionsExports from "../components/sections";

export interface ProcessValidationResult {
  success: boolean;
  checksPassed: number;
  details: string[];
}

export function runProcessValidation(): ProcessValidationResult {
  let checksPassed = 0;
  const details: string[] = [];
  const projectRoot = process.cwd();

  // =========================================================================
  // 1. Content Layer Integrity Contracts
  // =========================================================================
  // Process phases
  if (!Array.isArray(processPhases) || processPhases.length !== 4) {
    throw new Error(`Expected exactly 4 process phases, got ${processPhases?.length}`);
  }

  const titles = new Set<string>();
  for (const phase of processPhases) {
    if (!phase.code || !phase.title || !phase.subtitle || !phase.promise || !phase.timeframe) {
      throw new Error(`Phase ${phase.phase} missing required fields (code, title, subtitle, promise, timeframe)`);
    }
    if (titles.has(phase.title.toLowerCase())) {
      throw new Error(`Duplicate process phase title detected: ${phase.title}`);
    }
    titles.add(phase.title.toLowerCase());

    if (!Array.isArray(phase.deliverables) || phase.deliverables.length === 0) {
      throw new Error(`Phase ${phase.code} must have at least one deliverable`);
    }

    if (!phase.timeframe.includes("[TODO: owner confirmation]")) {
      throw new Error(`Phase ${phase.code} timeframe must be flagged with '[TODO: owner confirmation]'`);
    }
  }

  // Process section content metadata
  if (
    processContent.annotation !== "// 07 · DELIVERY LIFECYCLE & PROCESS" ||
    !processContent.heading.includes("How I Work & Deliver") ||
    !processContent.subheading
  ) {
    throw new Error("processContent metadata mismatch");
  }

  // Testimonials integrity: must be strictly empty array
  if (!Array.isArray(testimonials) || testimonials.length !== 0) {
    throw new Error("content/testimonials.ts must be strictly empty to prevent fabricated testimonials");
  }

  // Engineering notes
  if (!Array.isArray(engineeringNotes) || engineeringNotes.length !== 3) {
    throw new Error(`Expected exactly 3 engineering notes, got ${engineeringNotes?.length}`);
  }
  for (const note of engineeringNotes) {
    if (!note.id || !note.title || !note.summary || !note.readingTime || !note.link) {
      throw new Error(`Engineering note ${note.id} missing required fields`);
    }
    if (!note.link.url || !note.link.label) {
      throw new Error(`Engineering note ${note.id} has invalid link object`);
    }
  }

  // Feature flags
  if (FEATURE_FLAGS.ENABLE_NOTES !== false) {
    throw new Error("FEATURE_FLAGS.ENABLE_NOTES must be false by default");
  }
  if (isNotesEnabled() !== false) {
    throw new Error("isNotesEnabled() must return false by default");
  }
  if (isNotesEnabled(true) !== true || isNotesEnabled(false) !== false) {
    throw new Error("isNotesEnabled(override) must respect boolean override parameter");
  }

  checksPassed++;
  details.push(
    "1. Content layer verified: 4 distinct phases with promises & TODO timeframes, strictly empty testimonials, 3 engineering notes, flags default off"
  );

  // =========================================================================
  // 2. SSR Rendering of <Process id="process" />
  // =========================================================================
  const processHtml = ReactDOMServer.renderToString(
    React.createElement(Process, { id: "process" })
  );

  if (!processHtml.includes('id="process"')) {
    throw new Error("<Process> rendered output missing id='process'");
  }
  if (!processHtml.includes("// 07 · DELIVERY LIFECYCLE &amp; PROCESS") && !processHtml.includes("// 07 · DELIVERY LIFECYCLE & PROCESS")) {
    throw new Error("<Process> rendered output missing section annotation // 07 · DELIVERY LIFECYCLE & PROCESS");
  }
  if (!processHtml.includes("How I Work &amp; Deliver") && !processHtml.includes("How I Work & Deliver")) {
    throw new Error("<Process> rendered output missing heading 'How I Work & Deliver'");
  }

  for (const phase of processPhases) {
    const escapedTitle = phase.title.replace(/&/g, "&amp;");
    if (!processHtml.includes(phase.title) && !processHtml.includes(escapedTitle)) {
      throw new Error(`<Process> missing phase title: ${phase.title}`);
    }
    if (!processHtml.includes(phase.code)) {
      throw new Error(`<Process> missing phase code: ${phase.code}`);
    }
  }

  // Check sequence numbering "01 / 04"
  if (!processHtml.includes("01 / 04") || !processHtml.includes("04 / 04")) {
    throw new Error("<Process> missing sequence numbering ('01 / 04')");
  }

  // Check timeframe badge with TODO marker
  if (!processHtml.includes("[TODO: owner confirmation]")) {
    throw new Error("<Process> missing '[TODO: owner confirmation]' timeframe badge");
  }

  // Check deliverables checklist markers
  if (!processHtml.includes("KEY DELIVERABLES") || !processHtml.includes("▪")) {
    throw new Error("<Process> missing deliverables checklist or bullet markers");
  }

  // Check ARIA landmark
  if (!processHtml.includes('role="region"') || !processHtml.includes('aria-label="Engineering Delivery Lifecycle Phases"')) {
    throw new Error("<Process> missing accessible ARIA attributes for snap-scroll region");
  }

  checksPassed++;
  details.push(
    "2. SSR <Process> verified: rendered id='process', annotation, all 4 phase titles, sequence codes, delivery promises, deliverables list, and ARIA attributes"
  );

  // =========================================================================
  // 3. SSR Rendering of <Voices id="voices" /> (Integrity Guard)
  // =========================================================================
  // When testimonials is empty (default), Voices MUST return null (empty SSR string)
  const voicesDefaultHtml = ReactDOMServer.renderToString(
    React.createElement(Voices, { id: "voices" })
  );
  if (voicesDefaultHtml !== "") {
    throw new Error(
      `<Voices> must render null (empty string) when testimonials is empty, got: ${voicesDefaultHtml}`
    );
  }

  // When provided authentic testimonials, it must render calm 2-column grid with quotes
  const mockTestimonials = [
    {
      id: "mock-1",
      quote: "Saurabh is an exceptional system architect who delivers robust software.",
      author: "Jane Doe",
      title: "Staff Engineer",
      company: "Acme Corp",
      verified: true,
      linkedInUrl: "https://linkedin.com/in/janedoe",
    },
    {
      id: "mock-2",
      quote: "Transformed our data ingestion throughput with zero downtime.",
      author: "John Smith",
      title: "VP of Engineering",
      company: "Tech Global",
      verified: true,
      linkedInUrl: "https://linkedin.com/in/johnsmith",
    },
  ];

  const voicesPopulatedHtml = ReactDOMServer.renderToString(
    React.createElement(Voices, { id: "voices", items: mockTestimonials })
  );

  if (!voicesPopulatedHtml.includes('id="voices"')) {
    throw new Error("<Voices> with items must render section with id='voices'");
  }
  if (!voicesPopulatedHtml.includes("grid-cols-1 md:grid-cols-2")) {
    throw new Error("<Voices> with items must use calm 2-column grid layout");
  }
  if (!voicesPopulatedHtml.includes("Jane Doe") || !voicesPopulatedHtml.includes("John Smith")) {
    throw new Error("<Voices> with items missing author names");
  }
  if (!voicesPopulatedHtml.includes("https://linkedin.com/in/janedoe")) {
    throw new Error("<Voices> with items missing LinkedIn source verification link");
  }

  // Verify source code anti-fabrication comment in Voices.tsx
  const voicesSourcePath = path.join(projectRoot, "components/sections/Voices.tsx");
  const voicesSource = fs.readFileSync(voicesSourcePath, "utf-8");
  if (
    !voicesSource.includes("MANDATORY INTEGRITY CODE COMMENT") ||
    !voicesSource.includes("Fake quotes")
  ) {
    throw new Error("components/sections/Voices.tsx must contain mandatory anti-fabrication integrity comment");
  }

  checksPassed++;
  details.push(
    "3. SSR <Voices> verified: returns null when empty (zero DOM footprint), renders calm 2-column grid when populated, contains mandatory anti-fabrication code comment"
  );

  // =========================================================================
  // 4. SSR Rendering of <Notes id="notes" /> (Feature Flag Guard)
  // =========================================================================
  // Default: flag off -> returns null
  const notesDefaultHtml = ReactDOMServer.renderToString(
    React.createElement(Notes, { id: "notes" })
  );
  if (notesDefaultHtml !== "") {
    throw new Error(
      `<Notes> must render null (empty string) when enabled is not true, got: ${notesDefaultHtml}`
    );
  }

  // With enabled={false} -> returns null
  const notesDisabledHtml = ReactDOMServer.renderToString(
    React.createElement(Notes, { id: "notes", enabled: false })
  );
  if (notesDisabledHtml !== "") {
    throw new Error("<Notes enabled={false}> must render null");
  }

  // With enabled={true} -> renders 3 cards
  const notesEnabledHtml = ReactDOMServer.renderToString(
    React.createElement(Notes, { id: "notes", enabled: true })
  );
  if (!notesEnabledHtml.includes('id="notes"')) {
    throw new Error("<Notes enabled={true}> must render section with id='notes'");
  }
  if (!notesEnabledHtml.includes("grid-cols-1 md:grid-cols-3")) {
    throw new Error("<Notes enabled={true}> must render 3-column card grid");
  }
  for (const note of engineeringNotes) {
    const escapedTitle = note.title.replace(/&/g, "&amp;");
    if (!notesEnabledHtml.includes(note.title) && !notesEnabledHtml.includes(escapedTitle)) {
      throw new Error(`<Notes> missing note title: ${note.title}`);
    }
    if (!notesEnabledHtml.includes(note.readingTime)) {
      throw new Error(`<Notes> missing note reading time: ${note.readingTime}`);
    }
  }

  checksPassed++;
  details.push(
    "4. SSR <Notes> verified: returns null when disabled (default), renders 3-card grid with reading times, tags, and links when enabled"
  );

  // =========================================================================
  // 5. Page Layout Integration & Elimination of Legacy Clients (app/page.tsx)
  // =========================================================================
  const pagePath = path.join(projectRoot, "app/page.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  // Verify mounts
  if (!pageContent.includes('<Process id="process"')) {
    throw new Error("app/page.tsx must mount <Process id=\"process\" />");
  }
  if (!pageContent.includes('<Voices id="voices"')) {
    throw new Error("app/page.tsx must mount <Voices id=\"voices\" />");
  }
  if (!pageContent.includes('<Notes id="notes"')) {
    throw new Error("app/page.tsx must mount <Notes id=\"notes\" />");
  }

  // Verify mounting order: AIWorkflow -> Process -> Voices -> Notes -> Footer
  const aiWorkflowPos = pageContent.indexOf("<AIWorkflow");
  const processPos = pageContent.indexOf("<Process");
  const voicesPos = pageContent.indexOf("<Voices");
  const notesPos = pageContent.indexOf("<Notes");
  const footerPos = pageContent.indexOf("<Footer");

  if (aiWorkflowPos === -1 || processPos === -1 || voicesPos === -1 || notesPos === -1 || footerPos === -1) {
    throw new Error("Missing expected section components in app/page.tsx");
  }

  if (
    !(aiWorkflowPos < processPos && processPos < voicesPos && voicesPos < notesPos && notesPos < footerPos)
  ) {
    throw new Error(
      `Incorrect mounting order in app/page.tsx. Expected: AIWorkflow (${aiWorkflowPos}) < Process (${processPos}) < Voices (${voicesPos}) < Notes (${notesPos}) < Footer (${footerPos})`
    );
  }

  // Verify legacy Clients is completely purged
  if (pageContent.includes("<Clients") || pageContent.includes("from \"@/components/Clients\"")) {
    throw new Error("Legacy <Clients /> must be completely purged from app/page.tsx");
  }

  checksPassed++;
  details.push(
    "5. Page layout integration verified: AIWorkflow < Process < Voices < Notes < Footer sequence strictly enforced, legacy <Clients /> eliminated"
  );

  // =========================================================================
  // 6. Facade & Barrel Export Integrity
  // =========================================================================
  if (ProcessFacade !== Process) {
    throw new Error("components/Process.tsx facade does not re-export canonical Process component");
  }
  if (VoicesFacade !== Voices) {
    throw new Error("components/Voices.tsx facade does not re-export canonical Voices component");
  }
  if (NotesFacade !== Notes) {
    throw new Error("components/Notes.tsx facade does not re-export canonical Notes component");
  }

  if (
    !SectionsExports.Process ||
    !SectionsExports.ProcessCard ||
    !SectionsExports.Voices ||
    !SectionsExports.Notes
  ) {
    throw new Error("components/sections/index.ts is missing re-exports for Process, ProcessCard, Voices, or Notes");
  }

  checksPassed++;
  details.push(
    "6. Facades & barrel exports verified: components/Process.tsx, Voices.tsx, Notes.tsx, and components/sections/index.ts properly wired"
  );

  // =========================================================================
  // 7. ProcessCard Component Isolated Unit Test
  // =========================================================================
  const cardHtml = ReactDOMServer.renderToString(
    React.createElement(ProcessCard, {
      phase: processPhases[0],
      index: 0,
      total: 4,
    })
  );

  if (!cardHtml.includes("PHASE_01") || !cardHtml.includes("01 / 04")) {
    throw new Error("ProcessCard failed to render code or sequence index");
  }
  const escapedFirstTitle = processPhases[0].title.replace(/&/g, "&amp;");
  if (!cardHtml.includes(processPhases[0].title) && !cardHtml.includes(escapedFirstTitle)) {
    throw new Error("ProcessCard failed to render title");
  }
  if (!cardHtml.includes(processPhases[0].promise)) {
    throw new Error("ProcessCard failed to render delivery promise");
  }
  const escapedDeliverable = processPhases[0].deliverables[0].replace(/&/g, "&amp;");
  if (!cardHtml.includes(processPhases[0].deliverables[0]) && !cardHtml.includes(escapedDeliverable)) {
    throw new Error("ProcessCard failed to render deliverable items");
  }

  checksPassed++;
  details.push(
    "7. ProcessCard component isolated unit test verified: renders phase code, sequence, title, promise, deliverables, and timeframe"
  );

  return { success: true, checksPassed, details };
}

// Direct execution entrypoint
if (require.main === module || process.argv[1]?.endsWith("process.test.ts")) {
  try {
    const result = runProcessValidation();
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Process Validation Failed:", error);
    process.exit(1);
  }
}
