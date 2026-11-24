import { processPhases } from "../content/process";
import { testimonials } from "../content/testimonials";
import { engineeringNotes } from "../content/notes";
import sitemap from "../app/sitemap";
import robots from "../app/robots";

export function runProcessContactValidation() {
  const results: { name: string; passed: boolean; details?: string }[] = [];

  // Check 1: Process phases count & distinct titles
  const titles = processPhases.map((p) => p.title);
  const uniqueTitles = new Set(titles);
  const phasesValid =
    processPhases.length === 4 &&
    uniqueTitles.size === 4 &&
    processPhases.every((p) => p.deliverables && p.deliverables.length >= 3);

  results.push({
    name: "Process Phases: 4 distinct phases with valid deliverables",
    passed: phasesValid,
    details: `Found ${processPhases.length} phases, ${uniqueTitles.size} unique titles`,
  });

  // Check 2: Voices / Testimonials anti-fabrication enforcement
  const testimonialsPurged = Array.isArray(testimonials) && testimonials.length === 0;
  results.push({
    name: "Voices Integrity: Zero fake testimonials per Master Rule 6",
    passed: testimonialsPurged,
    details: `Testimonials count: ${testimonials.length} (expected: 0)`,
  });

  // Check 3: Engineering notes content
  const notesValid =
    engineeringNotes.length === 3 &&
    engineeringNotes.every((n) => n.id && n.title && n.summary && n.readingTime);

  results.push({
    name: "Engineering Notes: 3 valid architecture decision notes",
    passed: notesValid,
    details: `Found ${engineeringNotes.length} notes`,
  });

  // Check 4: Sitemap generation
  const sm = sitemap();
  const sitemapHasBase = sm.some((entry) => entry.url === "https://www.saurabhdixit93.site");
  const sitemapHasProjects = sm.some((entry) => entry.url.includes("/work/"));
  results.push({
    name: "Sitemap: Generates canonical URL and case studies",
    passed: sitemapHasBase && sitemapHasProjects && sm.length >= 5,
    details: `Total sitemap entries: ${sm.length}`,
  });

  // Check 5: Robots rules
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
  const robotsValid =
    r.sitemap === "https://www.saurabhdixit93.site/sitemap.xml" &&
    rules?.allow === "/";

  results.push({
    name: "Robots: Points to canonical sitemap and allows indexing",
    passed: Boolean(robotsValid),
    details: `Sitemap: ${r.sitemap}`,
  });

  return results;
}

if (require.main === module) {
  const res = runProcessContactValidation();
  console.log(JSON.stringify(res, null, 2));
  const failed = res.filter((r) => !r.passed);
  if (failed.length > 0) {
    process.exit(1);
  }
}
