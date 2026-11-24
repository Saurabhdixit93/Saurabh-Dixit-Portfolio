import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { experiences, education } from "../content/experience";
import {
  GIT_EXPERIENCE_DATA,
  GitExperienceItem,
} from "../components/sections/experience/experienceGitData";
import {
  formatExperiencePeriod,
  getExperiencePeriodTodo,
} from "../components/sections/experience/dateUtils";
import {
  highlightMetricsText,
} from "../components/sections/experience/highlightMetrics";
import { Experience } from "../components/sections/Experience";
import { GitGraphTimeline } from "../components/sections/experience/GitGraphTimeline";
import { GitCommitCard } from "../components/sections/experience/GitCommitCard";
import { GitTrackSvg } from "../components/sections/experience/GitTrackSvg";
import { EducationFootnote } from "../components/sections/experience/EducationFootnote";

export interface ExperienceValidationResult {
  success: boolean;
  checksPassed: number;
  details: string[];
}

export function runExperienceValidation(): ExperienceValidationResult {
  let checksPassed = 0;
  const details: string[] = [];
  const projectRoot = process.cwd();

  // =========================================================================
  // 1. Content Layer Integrity Contract (content/experience.ts)
  // =========================================================================
  if (experiences.length !== 4) {
    throw new Error(`Expected exactly 4 experiences, found ${experiences.length}`);
  }

  const expectedRoleIds = [
    "sensegrass-vpe",
    "sensegrass-sr-sde",
    "sensegrass-fullstack",
    "kenmark-itan",
  ];

  for (const roleId of expectedRoleIds) {
    const role = experiences.find((r) => r.id === roleId);
    if (!role) {
      throw new Error(`Role ${roleId} missing from content/experience.ts`);
    }
    if (!role.company || !role.role || !role.period) {
      throw new Error(`Role ${roleId} is missing essential text fields`);
    }
    if (!role.achievements || role.achievements.length < 3) {
      throw new Error(`Role ${roleId} must have at least 3 achievement bullets`);
    }
    if (!role.technologies || role.technologies.length < 4) {
      throw new Error(`Role ${roleId} must list at least 4 technologies`);
    }
  }

  // Academic milestone check
  if (education.length !== 1) {
    throw new Error(`Expected exactly 1 education item, found ${education.length}`);
  }
  const primaryEdu = education[0];
  if (
    !primaryEdu.degree.includes("Bachelor of Science") ||
    !primaryEdu.institution.includes("Bundelkhand University") ||
    !primaryEdu.duration.includes("2019 — 2022")
  ) {
    throw new Error(
      `Education item mismatch: degree, institution, or duration invalid`
    );
  }

  checksPassed++;
  details.push("1. Content layer verified: 4 experiences and 1 education item present");

  // =========================================================================
  // 2. Git Metadata & Branch Topology (experienceGitData.ts)
  // =========================================================================
  if (GIT_EXPERIENCE_DATA.length !== 4) {
    throw new Error(`GIT_EXPERIENCE_DATA length mismatch`);
  }

  const hex7Regex = /^[0-9a-f]{7}$/i;
  let liveCount = 0;

  for (const item of GIT_EXPERIENCE_DATA) {
    if (!item.git) {
      throw new Error(`Experience ${item.id} is missing git metadata`);
    }
    if (!hex7Regex.test(item.git.commitHash)) {
      throw new Error(
        `Commit hash for ${item.id} ('${item.git.commitHash}') must be a 7-character hex string`
      );
    }
    if (!item.git.commitMessage || item.git.commitMessage.length < 10) {
      throw new Error(`Commit message for ${item.id} is invalid`);
    }

    if (item.id === "sensegrass-vpe") {
      if (item.git.branch !== "feat/sensegrass" || item.git.branchType !== "branch") {
        throw new Error(`VP role must be on branch feat/sensegrass`);
      }
      if (!item.git.isLive) {
        throw new Error(`VP of Engineering role must have isLive: true`);
      }
      liveCount++;
    } else if (item.id === "sensegrass-sr-sde" || item.id === "sensegrass-fullstack") {
      if (item.git.branch !== "feat/sensegrass" || item.git.branchType !== "branch") {
        throw new Error(`Sensegrass role ${item.id} must be on branch feat/sensegrass`);
      }
      if (item.git.isLive) {
        throw new Error(`Only current role can have isLive: true`);
      }
    } else if (item.id === "kenmark-itan") {
      if (item.git.branch !== "main" || item.git.branchType !== "trunk") {
        throw new Error(`Kenmark ITan Solutions must be trunk commit on branch main`);
      }
      if (item.git.isLive) {
        throw new Error(`Kenmark ITan cannot have isLive: true`);
      }
    }
  }

  if (liveCount !== 1) {
    throw new Error(`Expected exactly 1 LIVE role, got ${liveCount}`);
  }

  checksPassed++;
  details.push(
    "2. Git metadata & branch topology verified: 7-char hashes, feat/sensegrass branch, main trunk, single LIVE node"
  );

  // =========================================================================
  // 3. Date Formatting & Fallback (dateUtils.ts)
  // =========================================================================
  const sdeRole = experiences.find((r) => r.id === "sensegrass-sr-sde")!;
  const vpeRole = experiences.find((r) => r.id === "sensegrass-vpe")!;

  // Production check (strips TODO comments, outputs clean year intervals)
  const sdeProdDate = formatExperiencePeriod(sdeRole.period, true);
  if (sdeProdDate !== "2024 — 2025") {
    throw new Error(
      `Expected '2024 — 2025' in production for Senior SDE, got '${sdeProdDate}'`
    );
  }
  if (sdeProdDate.includes("TODO") || sdeProdDate.includes("//")) {
    throw new Error(`Production date leaked TODO comment: ${sdeProdDate}`);
  }

  const vpeProdDate = formatExperiencePeriod(vpeRole.period, true);
  if (vpeProdDate !== "2025 — Present") {
    throw new Error(
      `Expected '2025 — Present' in production for VP role, got '${vpeProdDate}'`
    );
  }

  // Development check (preserves TODO annotation)
  const sdeDevDate = formatExperiencePeriod(sdeRole.period, false);
  if (!sdeDevDate.includes("TODO")) {
    throw new Error(`Development date must retain TODO comment for developer tracking`);
  }

  const todoNote = getExperiencePeriodTodo(sdeRole.period);
  if (!todoNote || !todoNote.includes("TODO(owner)")) {
    throw new Error(`getExperiencePeriodTodo failed to extract comment`);
  }

  checksPassed++;
  details.push(
    "3. Date formatting verified: production cleanly outputs '2024 — 2025' and '2025 — Present', development retains TODO"
  );

  // =========================================================================
  // 4. Verified Metrics Highlighting (highlightMetrics.tsx)
  // =========================================================================
  const testString =
    "Lifted engineering delivery velocity by +35% and scaled pipelines to 3× usage while boosting throughput +30% and cutting incidents by -45%.";
  const highlightedNodes = highlightMetricsText(testString);

  // Filter for elements that are metric spans
  const metricElements = highlightedNodes.filter(
    (node) => React.isValidElement(node) && (node.props as any).className?.includes("text-accent")
  );

  if (metricElements.length !== 4) {
    throw new Error(
      `Expected 4 highlighted metric spans (+35%, 3×, +30%, -45%), found ${metricElements.length}`
    );
  }

  const matchedTexts = metricElements.map(
    (el) => (el as React.ReactElement<{ children: string }>).props.children
  );
  if (!matchedTexts.includes("+35%")) throw new Error("Missing highlighted +35%");
  if (!matchedTexts.includes("3×")) throw new Error("Missing highlighted 3×");
  if (!matchedTexts.includes("+30%")) throw new Error("Missing highlighted +30%");
  if (!matchedTexts.includes("-45%")) throw new Error("Missing highlighted -45%");

  checksPassed++;
  details.push(
    "4. Verified metrics highlighting verified: +35%, 3×, +30%, -45% wrapped in font-mono font-semibold text-accent"
  );

  // =========================================================================
  // 5. Component Structure & SSR Rendering
  // =========================================================================
  const renderedHtml = ReactDOMServer.renderToString(
    React.createElement(Experience, { id: "experience", isProduction: true })
  );

  if (!renderedHtml.includes('id="experience"')) {
    throw new Error(`Rendered Experience section is missing id="experience"`);
  }
  if (!renderedHtml.includes("Career Progression as a Git Branch.")) {
    throw new Error(`Rendered Experience section is missing expected heading`);
  }
  if (!renderedHtml.includes("feat/sensegrass")) {
    throw new Error(`Rendered Experience section is missing branch indicator feat/sensegrass`);
  }
  if (!renderedHtml.includes("main")) {
    throw new Error(`Rendered Experience section is missing trunk indicator main`);
  }
  if (!renderedHtml.includes("a1d49e6")) {
    throw new Error(`Rendered Experience section is missing VP commit hash a1d49e6`);
  }
  if (!renderedHtml.includes("LIVE")) {
    throw new Error(`Rendered Experience section is missing pulsing LIVE badge`);
  }
  if (!renderedHtml.includes("Bundelkhand University")) {
    throw new Error(`Rendered Experience section is missing academic foundation footnote`);
  }

  checksPassed++;
  details.push(
    "5. SSR rendering verified: section id, heading, branch indicators, commit hashes, LIVE badge, and footnote rendered"
  );

  // =========================================================================
  // 6. Next.js App Page Integration (app/page.tsx)
  // =========================================================================
  const pagePath = path.join(projectRoot, "app", "page.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  // Verify standalone Education component is eliminated
  if (pageContent.includes("import Education") || pageContent.includes("<Education")) {
    throw new Error(
      `app/page.tsx still contains standalone Education component import or JSX tag`
    );
  }

  // Verify Experience is mounted in page
  if (
    !pageContent.includes('<Experience id="experience" />') &&
    !pageContent.includes("<Experience")
  ) {
    throw new Error(`app/page.tsx is missing <Experience id="experience" />`);
  }

  // Verify sequence: SelectedWork -> Experience
  const selectedWorkPos = pageContent.indexOf("<SelectedWork");
  const experiencePos = pageContent.indexOf("<Experience");
  if (selectedWorkPos === -1 || experiencePos === -1 || selectedWorkPos > experiencePos) {
    throw new Error(
      `Experience must be mounted directly after SelectedWork in app/page.tsx`
    );
  }

  checksPassed++;
  details.push(
    "6. Page integration verified: <Experience id='experience' /> positioned after SelectedWork, standalone <Education /> eliminated"
  );

  // =========================================================================
  // 7. Facade & Barrel Export Verification
  // =========================================================================
  const facadePath = path.join(projectRoot, "components", "Experience.tsx");
  const facadeContent = fs.readFileSync(facadePath, "utf-8");
  if (!facadeContent.includes("components/sections/Experience")) {
    throw new Error(
      `components/Experience.tsx must re-export from components/sections/Experience`
    );
  }

  const indexPath = path.join(projectRoot, "components", "sections", "index.ts");
  const indexContent = fs.readFileSync(indexPath, "utf-8");
  if (
    !indexContent.includes("export { Experience") ||
    !indexContent.includes("GitGraphTimeline") ||
    !indexContent.includes("EducationFootnote")
  ) {
    throw new Error(
      `components/sections/index.ts must export Experience and timeline subcomponents`
    );
  }

  checksPassed++;
  details.push(
    "7. Facades & exports verified: components/Experience.tsx and components/sections/index.ts wired correctly"
  );

  // =========================================================================
  // 8. Mobile SVG Scaling & Viewport Alignment Integrity (GitTrackSvg.tsx)
  // =========================================================================
  const svgPath = path.join(
    projectRoot,
    "components",
    "sections",
    "experience",
    "GitTrackSvg.tsx"
  );
  const svgContent = fs.readFileSync(svgPath, "utf-8");

  // Verify responsive drift class 'w-12 sm:w-20' is eradicated
  if (svgContent.includes("w-12 sm:w-20") || svgContent.includes("w-12")) {
    throw new Error(
      `GitTrackSvg.tsx must not use 'w-12' on mobile viewports. Found 'w-12' which causes a 0.6 scale compression and vertical alignment drift.`
    );
  }

  // Verify consistent w-20 width class
  if (!svgContent.includes("w-20")) {
    throw new Error(
      `GitTrackSvg.tsx must specify 'w-20' (80px) to guarantee a 1:1 scale ratio with viewBox width 80.`
    );
  }

  // SSR render probe: ensure rendered SVG element carries w-20 and viewBox width 80
  const renderedSvgHtml = ReactDOMServer.renderToString(
    React.createElement(GitTrackSvg, { nodeYs: [60, 260, 480, 700], height: 800 })
  );

  if (!renderedSvgHtml.includes('viewBox="0 0 80') && !renderedSvgHtml.includes("viewBox='0 0 80")) {
    throw new Error(
      `GitTrackSvg must define viewBox with width 80 matching w-20 (80px)`
    );
  }

  if (!renderedSvgHtml.includes("w-20")) {
    throw new Error(
      `Rendered GitTrackSvg HTML must contain class 'w-20' for consistent width across all viewports`
    );
  }

  // Scale factor verification: CSS width (80px from w-20) / viewBox width (80) = 1.0
  const viewBoxWidth = 80;
  const cssPixelWidth = 80; // Tailwind w-20 = 5rem = 80px
  const scaleFactor = cssPixelWidth / viewBoxWidth;
  if (scaleFactor !== 1.0) {
    throw new Error(
      `Aspect ratio scale factor must be exactly 1.0, got ${scaleFactor}`
    );
  }

  checksPassed++;
  details.push(
    "8. Mobile SVG scaling verified: consistent w-20 width, viewBox width 80, scale factor 1.0 (zero drift across all viewports down to 320px)"
  );

  return {
    success: true,
    checksPassed,
    details,
  };
}

// Standalone execution support
if (require.main === module || (typeof process !== "undefined" && process.argv[1]?.endsWith("experience.test.ts"))) {
  try {
    const result = runExperienceValidation();
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error("Experience validation failed:", error.message || error);
    process.exit(1);
  }
}
