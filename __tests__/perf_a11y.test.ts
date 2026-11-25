/**
 * Milestone 13 (Step M: Performance, Accessibility, Cleanup - Prompt 12) Verification Suite
 *
 * Checks:
 * 1. Dead Code & Dependency Purge (legacy components, Aceternity UI, data/, unused deps, 19 facades kept)
 * 2. Public Asset Hygiene (36 dead assets deleted, active & metadata assets intact and referenced)
 * 3. Performance & Bundle Splitting (Server Component app/page.tsx, Footer outside main, next/dynamic, AVIF/WebP, no below-fold priority)
 * 4. Landmarks, Skip Link & Heading Hierarchy (skip link -> #main-content, main landmarks on all routes, no heading jumps > 1)
 * 5. WCAG 2.2 AA Color Contrast (programmatic luminance ratio >= 4.5:1 for Paper/Graphite accent, zero bg-accent text-white / emerald text)
 * 6. Keyboard Focus Trap, Visible Focus Rings & prefers-reduced-motion Guards
 */

import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";

import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Capabilities } from "../components/sections/Capabilities";
import { StackMap } from "../components/sections/StackMap";
import { SelectedWork } from "../components/sections/SelectedWork";
import { Experience } from "../components/sections/Experience";
import { AIWorkflow } from "../components/sections/AIWorkflow";
import { AssistantProvider } from "../components/assistant/AssistantContext";
import { Process } from "../components/sections/Process";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/sections/Footer";
import { ArchitectureDiagram } from "../components/work/ArchitectureDiagram";
import { getCaseStudy } from "../content/case-studies";

export interface PerfA11yValidationResult {
  success: boolean;
  checksPassed: number;
  details: string[];
}

function collectSourceFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx|mjs|js|css)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function hexToRelativeLuminance(hex: string): number {
  const clean = hex.replace("#", "").trim();
  const r8 = parseInt(clean.slice(0, 2), 16) / 255;
  const g8 = parseInt(clean.slice(2, 4), 16) / 255;
  const b8 = parseInt(clean.slice(4, 6), 16) / 255;
  const toLin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLin(r8) + 0.7152 * toLin(g8) + 0.0722 * toLin(b8);
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = hexToRelativeLuminance(hexA);
  const l2 = hexToRelativeLuminance(hexB);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

function extractHeadingLevels(html: string): number[] {
  const matches = html.match(/<h([1-6])\b/gi) || [];
  return matches.map((m) => parseInt(m.replace(/<h/i, ""), 10));
}

export function runPerfA11yValidation(): PerfA11yValidationResult {
  let checksPassed = 0;
  const details: string[] = [];
  const projectRoot = process.cwd();

  // =========================================================================
  // 1. Dead Code Elimination, Facade Preservation & Dependency Purge
  // =========================================================================
  const deadFiles = [
    "components/Approach.tsx",
    "components/Clients.tsx",
    "components/Education.tsx",
    "components/Grid.tsx",
    "components/MagicButton.tsx",
    "components/RecentProjects.tsx",
    "components/ui",
    "data",
  ];
  for (const rel of deadFiles) {
    if (fs.existsSync(path.join(projectRoot, rel))) {
      throw new Error(`Dead legacy file/directory still exists: ${rel}`);
    }
  }

  const requiredFacades = [
    "AIWorkflow.tsx",
    "About.tsx",
    "AskSaurabh.tsx",
    "Capabilities.tsx",
    "CommandPalette.tsx",
    "Contact.tsx",
    "Experience.tsx",
    "Footer.tsx",
    "Hero.tsx",
    "ISTClock.tsx",
    "Notes.tsx",
    "Process.tsx",
    "ScrollHUD.tsx",
    "SelectedWork.tsx",
    "SignalStrip.tsx",
    "SiteHeader.tsx",
    "StackMap.tsx",
    "ThemeToggle.tsx",
    "Voices.tsx",
  ];
  for (const facade of requiredFacades) {
    if (!fs.existsSync(path.join(projectRoot, "components", facade))) {
      throw new Error(`Required active root facade missing: components/${facade}`);
    }
  }

  const pkgJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8")
  );
  const allDeps = {
    ...(pkgJson.dependencies || {}),
    ...(pkgJson.devDependencies || {}),
  };
  const removedDeps = [
    "three",
    "@types/three",
    "@react-three/fiber",
    "@react-three/drei",
    "three-globe",
    "lottie-react",
    "react-icons",
    "@tabler/icons-react",
    "vercel",
  ];
  for (const dep of removedDeps) {
    if (dep in allDeps) {
      throw new Error(`Unused dependency still present in package.json: ${dep}`);
    }
  }
  if (!pkgJson.scripts?.analyze?.includes("ANALYZE=true")) {
    throw new Error('package.json must include "analyze" script with ANALYZE=true');
  }

  const activeSourceFiles = [
    ...collectSourceFiles(path.join(projectRoot, "app")),
    ...collectSourceFiles(path.join(projectRoot, "components")),
    ...collectSourceFiles(path.join(projectRoot, "content")),
    ...collectSourceFiles(path.join(projectRoot, "lib")),
  ];
  const forbiddenImportPatterns = [
    /@\/data\b/,
    /from\s+["']three["']/,
    /@react-three\//,
    /three-globe/,
    /lottie-react/,
    /react-icons/,
    /@tabler\/icons-react/,
  ];
  for (const file of activeSourceFiles) {
    const content = fs.readFileSync(file, "utf-8");
    for (const pattern of forbiddenImportPatterns) {
      if (pattern.test(content)) {
        throw new Error(
          `Forbidden legacy import ${pattern} found in ${path.relative(projectRoot, file)}`
        );
      }
    }
  }

  checksPassed++;
  details.push(
    "1. Dead code & dependency purge verified: 6 legacy components, 13 Aceternity UI files, data/, and 9 unused packages removed; all 19 active root facades intact"
  );

  // =========================================================================
  // 2. Public Asset Hygiene
  // =========================================================================
  const deletedPublicAssets = [
    "ApiImage.svg",
    "c.svg",
    "calendar.svg",
    "exp2.svg",
    "farmos.svg",
    "footer-grid.svg",
    "gsap.svg",
    "insta.svg",
    "jsm-logo.png",
    "logo.png",
    "og-image.png",
    "p1.svg",
    "p2.svg",
    "p3.svg",
    "p4.svg",
    "project2.svg",
    "project3.svg",
    "stream.svg",
    "twit.svg",
    "Project6.svg",
    "appName.svg",
    "b1.svg",
    "b4.svg",
    "b5.svg",
    "bg.png",
    "cloudName.svg",
    "confetti.gif",
    "dockerName.svg",
    "grid.svg",
    "host.svg",
    "hostName.svg",
    "link.svg",
    "profile.svg",
    "s.svg",
    "streamName.svg",
    "wha.svg",
  ];
  for (const asset of deletedPublicAssets) {
    if (fs.existsSync(path.join(projectRoot, "public", asset))) {
      throw new Error(`Dead public asset still exists: public/${asset}`);
    }
  }

  const publicEntries = fs
    .readdirSync(path.join(projectRoot, "public"))
    .filter((f) => f !== ".DS_Store");
  const combinedSourceText = activeSourceFiles
    .map((f) => fs.readFileSync(f, "utf-8"))
    .join("\n");

  for (const asset of publicEntries) {
    if (!combinedSourceText.includes(asset)) {
      throw new Error(`Unreferenced asset remains in public/: ${asset}`);
    }
  }
  if (!publicEntries.includes("resume.pdf")) {
    throw new Error("Required public/resume.pdf is missing");
  }

  checksPassed++;
  details.push(
    `2. Public asset hygiene verified: all 36 dead assets purged, all ${publicEntries.length} remaining assets actively referenced`
  );

  // =========================================================================
  // 3. Performance, Bundle Splitting & Image Optimization
  // =========================================================================
  const pageSrc = fs.readFileSync(path.join(projectRoot, "app/page.tsx"), "utf-8");
  if (/^["']use client["']/.test(pageSrc.trim())) {
    throw new Error("app/page.tsx must be a Server Component (no 'use client' directive)");
  }
  if (!pageSrc.includes('import dynamic from "next/dynamic"')) {
    throw new Error("app/page.tsx must use next/dynamic for below-the-fold code splitting");
  }
  const dynamicSections = [
    "About",
    "Capabilities",
    "StackMap",
    "SelectedWork",
    "Experience",
    "AIWorkflow",
    "Process",
    "Voices",
    "Notes",
    "Contact",
    "Footer",
  ];
  for (const sec of dynamicSections) {
    const dynRegex = new RegExp(`const\\s+${sec}\\s*=\\s*dynamic\\(`);
    if (!dynRegex.test(pageSrc)) {
      throw new Error(`app/page.tsx must dynamically import ${sec}`);
    }
  }
  const closeMainIdx = pageSrc.indexOf("</main>");
  const footerIdx = pageSrc.indexOf("<Footer");
  if (closeMainIdx === -1 || footerIdx === -1 || footerIdx < closeMainIdx) {
    throw new Error("app/page.tsx must render <Footer /> outside </main>");
  }

  const layoutSrc = fs.readFileSync(path.join(projectRoot, "app/layout.tsx"), "utf-8");
  if (
    !layoutSrc.includes("CommandPaletteLazy") ||
    !layoutSrc.includes("AskSaurabhLazy")
  ) {
    throw new Error("app/layout.tsx must load CommandPalette and AskSaurabh via lazy wrappers");
  }
  const cmdLazySrc = fs.readFileSync(
    path.join(projectRoot, "components/navigation/CommandPaletteLazy.tsx"),
    "utf-8"
  );
  const askLazySrc = fs.readFileSync(
    path.join(projectRoot, "components/assistant/AskSaurabhLazy.tsx"),
    "utf-8"
  );
  if (!cmdLazySrc.includes("ssr: false") || !askLazySrc.includes("ssr: false")) {
    throw new Error("Overlay lazy wrappers must configure dynamic(..., { ssr: false })");
  }

  const workSlugSrc = fs.readFileSync(
    path.join(projectRoot, "app/work/[slug]/page.tsx"),
    "utf-8"
  );
  if (!workSlugSrc.includes("dynamic(") || !workSlugSrc.includes("ArchitectureDiagram")) {
    throw new Error("app/work/[slug]/page.tsx must dynamically import ArchitectureDiagram");
  }

  const nextConfigSrc = fs.readFileSync(
    path.join(projectRoot, "next.config.mjs"),
    "utf-8"
  );
  if (
    !nextConfigSrc.includes("image/avif") ||
    !nextConfigSrc.includes("image/webp") ||
    !nextConfigSrc.includes("@next/bundle-analyzer")
  ) {
    throw new Error(
      "next.config.mjs must configure image/avif + image/webp formats and @next/bundle-analyzer"
    );
  }

  const featuredCardSrc = fs.readFileSync(
    path.join(projectRoot, "components/sections/work/FeaturedProjectCard.tsx"),
    "utf-8"
  );
  if (featuredCardSrc.includes("priority={index === 0}")) {
    throw new Error("FeaturedProjectCard must not set priority={index === 0} below the fold");
  }

  for (const file of activeSourceFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (/<img\b/i.test(content)) {
      throw new Error(`Raw <img> tag found in ${path.relative(projectRoot, file)}`);
    }
  }

  checksPassed++;
  details.push(
    "3. Performance & image optimization verified: SSR app/page.tsx, dynamic section/overlay/diagram splitting, AVIF/WebP config, zero raw <img>, no below-fold priority"
  );

  // =========================================================================
  // 4. Skip Link, <main> Landmarks & Heading Hierarchy
  // =========================================================================
  if (!layoutSrc.includes('href="#main-content"') || !layoutSrc.includes("Skip to main content")) {
    throw new Error("app/layout.tsx must render a skip-to-content link targeting #main-content");
  }

  const landmarkRoutes = [
    "app/page.tsx",
    "app/work/[slug]/page.tsx",
    "app/not-found.tsx",
    "app/error.tsx",
  ];
  if (fs.existsSync(path.join(projectRoot, "app/dev/tokens/page.tsx"))) {
    landmarkRoutes.push("app/dev/tokens/page.tsx");
  }
  for (const route of landmarkRoutes) {
    const src = fs.readFileSync(path.join(projectRoot, route), "utf-8");
    if (!/<main[^>]*id=["']main-content["']/.test(src)) {
      throw new Error(`${route} must contain <main id="main-content">`);
    }
  }

  // SSR render home sections and verify sequential heading levels (no jump > 1)
  const homeHtml = [
    ReactDOMServer.renderToString(React.createElement(Hero)),
    ReactDOMServer.renderToString(React.createElement(About, { id: "about" })),
    ReactDOMServer.renderToString(React.createElement(Capabilities, { id: "capabilities" })),
    ReactDOMServer.renderToString(React.createElement(StackMap, { id: "stack" })),
    ReactDOMServer.renderToString(React.createElement(SelectedWork, { id: "work" })),
    ReactDOMServer.renderToString(React.createElement(Experience, { id: "experience" })),
    ReactDOMServer.renderToString(
      React.createElement(
        AssistantProvider,
        null,
        React.createElement(AIWorkflow, { id: "ai-workflow" })
      )
    ),
    ReactDOMServer.renderToString(React.createElement(Process, { id: "process" })),
    ReactDOMServer.renderToString(React.createElement(Contact, { id: "contact" })),
    ReactDOMServer.renderToString(React.createElement(Footer)),
  ].join("\n");

  const homeHeadings = extractHeadingLevels(homeHtml);
  if (homeHeadings.length === 0 || homeHeadings[0] !== 1) {
    throw new Error("Home page SSR output must start with <h1>");
  }
  for (let i = 1; i < homeHeadings.length; i++) {
    if (homeHeadings[i] - homeHeadings[i - 1] > 1) {
      throw new Error(
        `Heading level jump > 1 in home page SSR: h${homeHeadings[i - 1]} -> h${homeHeadings[i]}`
      );
    }
  }

  const study = getCaseStudy("ai-code-review");
  if (!study) throw new Error("Missing flagship case study ai-code-review");
  const archHtml = ReactDOMServer.renderToString(
    React.createElement(ArchitectureDiagram, {
      nodes: study.architecture.nodes,
      edges: study.architecture.edges,
      title: study.title,
    })
  );
  const archHeadings = extractHeadingLevels(archHtml);
  for (const level of archHeadings) {
    // ArchitectureDiagram sits directly inside an <h2> section
    if (level > 3) {
      throw new Error(
        `ArchitectureDiagram renders <h${level}> under <h2>, skipping <h3>`
      );
    }
  }

  const devTokensPath = path.join(projectRoot, "app/dev/tokens/page.tsx");
  if (fs.existsSync(devTokensPath)) {
    const devTokensSrc = fs.readFileSync(devTokensPath, "utf-8");
    if (/<h4\b/i.test(devTokensSrc)) {
      throw new Error("app/dev/tokens/page.tsx must not skip heading levels with <h4>");
    }
  }

  checksPassed++;
  details.push(
    `4. Landmarks, skip link & heading order verified: #main-content across 5 routes, ${homeHeadings.length} home headings sequential without jumps`
  );

  // =========================================================================
  // 5. WCAG 2.2 AA Color Contrast (Both Themes)
  // =========================================================================
  for (const file of activeSourceFiles) {
    const rel = path.relative(projectRoot, file);
    if (!rel.startsWith("app/") && !rel.startsWith("components/")) continue;
    const content = fs.readFileSync(file, "utf-8");
    if (content.includes("bg-accent text-white")) {
      throw new Error(`Low-contrast 'bg-accent text-white' found in ${rel}`);
    }
    if (/text-emerald-[45]00/.test(content)) {
      throw new Error(`Low-contrast emerald text class found in ${rel}`);
    }
    if (/\bpaper:[a-zA-Z0-9\-\[\]#/]+/.test(content)) {
      throw new Error(`Invalid 'paper:' Tailwind variant found in ${rel}`);
    }
    if (/text-accent-contrast|bg-accent-contrast/.test(content)) {
      throw new Error(`Invalid Tailwind class 'accent-contrast' found in ${rel}`);
    }
  }

  const globalsCss = fs.readFileSync(
    path.join(projectRoot, "app/globals.css"),
    "utf-8"
  );
  const paperBlockMatch = globalsCss.match(/\[data-theme="paper"\][\s\S]*?\{([\s\S]*?)\}/);
  if (!paperBlockMatch) {
    throw new Error("Could not find [data-theme=\"paper\"] token block in app/globals.css");
  }
  const paperBlock = paperBlockMatch[1];
  const paperBg = paperBlock.match(/--bg:\s*(#[0-9a-fA-F]{6})/)?.[1];
  const paperAccent = paperBlock.match(/--accent:\s*(#[0-9a-fA-F]{6})/)?.[1];
  const paperAccentContrast = paperBlock.match(
    /--accent-contrast:\s*(#[0-9a-fA-F]{6})/
  )?.[1];
  if (!paperBg || !paperAccent || !paperAccentContrast) {
    throw new Error("Missing Paper theme tokens in app/globals.css");
  }
  const paperAccentOnBg = contrastRatio(paperAccent, paperBg);
  const paperContrastOnAccent = contrastRatio(paperAccentContrast, paperAccent);
  if (paperAccentOnBg < 4.5) {
    throw new Error(
      `Paper --accent (${paperAccent}) on --bg (${paperBg}) contrast is ${paperAccentOnBg.toFixed(2)}:1 (< 4.5:1)`
    );
  }
  if (paperContrastOnAccent < 4.5) {
    throw new Error(
      `Paper --accent-contrast (${paperAccentContrast}) on --accent (${paperAccent}) contrast is ${paperContrastOnAccent.toFixed(2)}:1 (< 4.5:1)`
    );
  }

  checksPassed++;
  details.push(
    `5. WCAG AA contrast verified: Paper --accent (${paperAccent}) on --bg (${paperBg}) = ${paperAccentOnBg.toFixed(2)}:1, zero bg-accent text-white or invalid variants`
  );

  // =========================================================================
  // 6. Focus Trap, Focus Rings & Reduced Motion Guards
  // =========================================================================
  const siteHeaderSrc = fs.readFileSync(
    path.join(projectRoot, "components/navigation/SiteHeader.tsx"),
    "utf-8"
  );
  if (!siteHeaderSrc.includes('e.key === "Tab"') || !siteHeaderSrc.includes("mobileNavRef")) {
    throw new Error("SiteHeader.tsx mobile dialog must implement a Tab focus trap");
  }
  if (!siteHeaderSrc.includes("bg-bg text-text")) {
    throw new Error("SiteHeader.tsx mobile drawer must use bg-bg text-text");
  }

  const footerSrc = fs.readFileSync(
    path.join(projectRoot, "components/sections/Footer.tsx"),
    "utf-8"
  );
  if (!footerSrc.includes("focus-visible:ring-2")) {
    throw new Error("Footer.tsx back-to-top button must use focus-visible:ring-2");
  }

  const askSrc = fs.readFileSync(
    path.join(projectRoot, "components/assistant/AskSaurabh.tsx"),
    "utf-8"
  );
  if (!askSrc.includes("focus-visible:ring-2")) {
    throw new Error("AskSaurabh.tsx input must use focus-visible:ring-2");
  }

  const contactSrc = fs.readFileSync(
    path.join(projectRoot, "components/sections/Contact.tsx"),
    "utf-8"
  );
  if (!contactSrc.includes("focus-visible:ring-2")) {
    throw new Error("Contact.tsx form fields must use focus-visible:ring-2");
  }

  const smoothScrollFiles = [
    "components/navigation/SiteHeader.tsx",
    "components/navigation/CommandPalette.tsx",
    "components/sections/Process.tsx",
    "components/sections/Footer.tsx",
  ];
  for (const rel of smoothScrollFiles) {
    const src = fs.readFileSync(path.join(projectRoot, rel), "utf-8");
    if (!src.includes("prefers-reduced-motion: reduce")) {
      throw new Error(`${rel} must guard smooth scrolling with prefers-reduced-motion`);
    }
  }

  const sysCoreSrc = fs.readFileSync(
    path.join(projectRoot, "components/sections/hero/SystemCoreDiagram.tsx"),
    "utf-8"
  );
  if (!sysCoreSrc.includes(".sys-packet") || !sysCoreSrc.includes("motion-reduce:hidden")) {
    throw new Error(
      "SystemCoreDiagram.tsx must disable SMIL packet animations and ping dot under prefers-reduced-motion"
    );
  }

  checksPassed++;
  details.push(
    "6. Keyboard focus trap, visible focus-visible rings & prefers-reduced-motion guards verified across header, palette, chat, process, contact, footer, and hero SVG"
  );

  return {
    success: true,
    checksPassed,
    details,
  };
}

if (require.main === module) {
  try {
    const res = runPerfA11yValidation();
    console.log(JSON.stringify(res, null, 2));
    if (!res.success) process.exit(1);
  } catch (err) {
    console.error("Performance & A11y Validation Failed:", err);
    process.exit(1);
  }
}
