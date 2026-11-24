/**
 * Milestone 12 (Step L: SEO, Metadata, Analytics, Error Pages - Prompt 11) Verification Suite
 *
 * Checks:
 * 1. Canonical Domain Uniformity (zero legacy vercel.app domains, no stale LinkedIn handles)
 * 2. Root & Route Metadata (canonical alternates, metadataBase, dynamic OpenGraph image)
 * 3. JSON-LD Structured Data (Person, WebSite, linked @id, canonical profile synchronization)
 * 4. Sitemap Generation (root + 6 flagship projects, /dev/tokens excluded)
 * 5. Robots.txt Policy (canonical sitemap pointer, allow root, disallow /api/ and /dev/)
 * 6. Web Manifest Contract (name, start_url, theme_color, background_color, icons)
 * 7. Analytics Dispatch Engine (8 typed event channels, SSR safety, in-memory test buffer, zero PII)
 * 8. Blueprint Error & 404 Pages SSR Markup ("404 // node not found", "500 // pipeline fault")
 * 9. Favicon & Dynamic Image Routes (icon.tsx, apple-icon.tsx, opengraph-image.tsx)
 */

import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";

import { generateJsonLd, JsonLd } from "../components/seo/JsonLd";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import manifest from "../app/manifest";
import {
  trackEvent,
  getRecentEvents,
  clearEventHistory,
  AnalyticsEventName,
} from "../lib/analytics";
import NotFound from "../app/not-found";
import ErrorBoundary from "../app/error";
import { projects } from "../content/projects";
import { profile } from "../content/profile";
import { generateMetadata as generateCaseStudyMetadata } from "../app/work/[slug]/page";

import * as OpenGraphImageModule from "../app/opengraph-image";
import * as IconModule from "../app/icon";
import * as AppleIconModule from "../app/apple-icon";

export interface SeoValidationResult {
  success: boolean;
  checksPassed: number;
  details: string[];
}

export async function runSeoValidation(): Promise<SeoValidationResult> {
  let checksPassed = 0;
  const details: string[] = [];
  const projectRoot = process.cwd();

  // =========================================================================
  // 1. Canonical Domain Uniformity
  // =========================================================================
  const canonicalDomain = "https://www.saurabhdixit93.site";
  const canonicalLinkedIn = "https://www.linkedin.com/in/saurabhdixit93";
  const staleLinkedIn = "saurabh-dixit-47a82b1b3";
  const staleVercelDomains = [
    "saurabh-dixit-portfolio.vercel.app",
    "saurabh-dixit.vercel.app",
  ];

  // Scan key source directories for forbidden legacy strings
  const dirsToScan = ["app", "components", "content", "data", "lib"];
  for (const dir of dirsToScan) {
    const fullDirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(fullDirPath)) continue;

    const scanDir = (currentPath: string) => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          scanDir(entryPath);
        } else if (/\.(tsx?|jsx?|json)$/.test(entry.name)) {
          const content = fs.readFileSync(entryPath, "utf-8");
          for (const staleDomain of staleVercelDomains) {
            if (content.includes(staleDomain)) {
              throw new Error(
                `Found forbidden legacy domain "${staleDomain}" in ${entryPath}`
              );
            }
          }
          if (content.includes(staleLinkedIn)) {
            throw new Error(
              `Found stale LinkedIn handle "${staleLinkedIn}" in ${entryPath}`
            );
          }
        }
      }
    };
    scanDir(fullDirPath);
  }

  // Profile SSOT must contain the canonical siteUrl
  if (profile.siteUrl !== canonicalDomain) {
    throw new Error(
      `profile.siteUrl must be "${canonicalDomain}", got "${profile.siteUrl}"`
    );
  }

  checksPassed++;
  details.push(
    "1. Canonical domain uniformity verified: zero legacy domains, zero stale LinkedIn handles across all source files"
  );

  // =========================================================================
  // 2. Root & Route Metadata
  // =========================================================================
  const layoutSource = fs.readFileSync(
    path.join(projectRoot, "app/layout.tsx"),
    "utf-8"
  );

  if (!layoutSource.includes('metadataBase: new URL("https://www.saurabhdixit93.site")')) {
    throw new Error('app/layout.tsx must configure metadataBase: new URL("https://www.saurabhdixit93.site")');
  }

  if (
    !layoutSource.includes('canonical: "https://www.saurabhdixit93.site"') ||
    !layoutSource.includes("alternates:")
  ) {
    throw new Error('app/layout.tsx must configure alternates.canonical: "https://www.saurabhdixit93.site"');
  }

  if (!layoutSource.includes('url: "/opengraph-image"') || !layoutSource.includes("openGraph:")) {
    throw new Error('app/layout.tsx openGraph.images must reference dynamic "/opengraph-image"');
  }

  if (!layoutSource.includes('images: ["/opengraph-image"]') || !layoutSource.includes("twitter:")) {
    throw new Error('app/layout.tsx twitter.images must reference dynamic "/opengraph-image"');
  }

  if (
    !layoutSource.includes('icon: "/icon"') ||
    !layoutSource.includes('apple: "/apple-icon"')
  ) {
    throw new Error('app/layout.tsx icons must reference dynamic "/icon" and "/apple-icon"');
  }

  if (!layoutSource.includes("<JsonLd />")) {
    throw new Error("app/layout.tsx must mount <JsonLd /> component in <head>");
  }

  // Test dynamic case study metadata generation
  const testStudyMeta = await generateCaseStudyMetadata({
    params: Promise.resolve({ slug: "ai-code-review" }),
  });

  if (
    testStudyMeta.alternates?.canonical !==
    "https://www.saurabhdixit93.site/work/ai-code-review"
  ) {
    throw new Error(
      "Case study metadata missing valid canonical alternate URL"
    );
  }

  if (
    testStudyMeta.openGraph?.url !==
    "https://www.saurabhdixit93.site/work/ai-code-review"
  ) {
    throw new Error(
      "Case study metadata missing valid openGraph.url"
    );
  }

  checksPassed++;
  details.push(
    "2. Root & route metadata verified: metadataBase, alternates.canonical, dynamic og:image, and case study generateMetadata"
  );

  // =========================================================================
  // 3. JSON-LD Structured Data
  // =========================================================================
  const jsonLdData = generateJsonLd();
  if (jsonLdData["@context"] !== "https://schema.org") {
    throw new Error(`JSON-LD @context must be https://schema.org`);
  }
  if (!Array.isArray(jsonLdData["@graph"]) || jsonLdData["@graph"].length !== 2) {
    throw new Error(
      `JSON-LD @graph must contain exactly 2 nodes (Person & WebSite), got ${jsonLdData["@graph"]?.length}`
    );
  }

  const personNode = jsonLdData["@graph"].find((n) => n["@type"] === "Person");
  if (!personNode) {
    throw new Error("JSON-LD missing Person node");
  }
  if (personNode["@id"] !== `${canonicalDomain}/#person`) {
    throw new Error(`Person @id must be "${canonicalDomain}/#person"`);
  }
  if (personNode.name !== "Saurabh Dixit") {
    throw new Error(`Person name must be "Saurabh Dixit"`);
  }
  if (personNode.jobTitle !== "VP of Engineering & Full-Stack Systems Engineer") {
    throw new Error(`Person jobTitle must be "VP of Engineering & Full-Stack Systems Engineer"`);
  }
  if (personNode.worksFor.name !== "Sensegrass") {
    throw new Error(`Person worksFor.name must be "Sensegrass"`);
  }
  if (personNode.email !== "smartds2550@gmail.com") {
    throw new Error(`Person email must be "smartds2550@gmail.com"`);
  }
  if (!personNode.sameAs.includes(canonicalLinkedIn)) {
    throw new Error(`Person sameAs must include canonical LinkedIn URL: "${canonicalLinkedIn}"`);
  }
  if (!Array.isArray(personNode.knowsAbout) || personNode.knowsAbout.length < 5) {
    throw new Error("Person knowsAbout must contain at least 5 architectural topics");
  }

  const websiteNode = jsonLdData["@graph"].find((n) => n["@type"] === "WebSite");
  if (!websiteNode) {
    throw new Error("JSON-LD missing WebSite node");
  }
  if (websiteNode["@id"] !== `${canonicalDomain}/#website`) {
    throw new Error(`WebSite @id must be "${canonicalDomain}/#website"`);
  }
  if (websiteNode.url !== canonicalDomain) {
    throw new Error(`WebSite url must be "${canonicalDomain}"`);
  }
  if (websiteNode.publisher["@id"] !== `${canonicalDomain}/#person`) {
    throw new Error(
      `WebSite publisher must reference "${canonicalDomain}/#person"`
    );
  }

  // SSR test of <JsonLd /> component
  const renderedJsonLd = ReactDOMServer.renderToString(React.createElement(JsonLd));
  if (!renderedJsonLd.includes('<script type="application/ld+json">')) {
    throw new Error("<JsonLd /> component must render <script type=\"application/ld+json\">");
  }
  if (!renderedJsonLd.includes(canonicalDomain) || !renderedJsonLd.includes("Sensegrass")) {
    throw new Error("<JsonLd /> SSR output missing required schema data");
  }

  checksPassed++;
  details.push(
    "3. JSON-LD structured data verified: Person (@id, jobTitle, Sensegrass, canonical LinkedIn) & WebSite linked nodes"
  );

  // =========================================================================
  // 4. Sitemap Generation
  // =========================================================================
  const sitemapEntries = sitemap();
  if (!Array.isArray(sitemapEntries)) {
    throw new Error("sitemap() must return an array");
  }

  // Must contain root entry with 1.0 priority
  const rootEntry = sitemapEntries.find((e) => e.url === canonicalDomain);
  if (!rootEntry || rootEntry.priority !== 1.0 || rootEntry.changeFrequency !== "weekly") {
    throw new Error(
      `Sitemap missing root entry "${canonicalDomain}" with priority 1.0 and weekly frequency`
    );
  }

  // Must dynamically map all 6 projects from content/projects.ts
  if (projects.length !== 6) {
    throw new Error(`Expected 6 projects in content/projects, got ${projects.length}`);
  }
  for (const project of projects) {
    const expectedUrl = `${canonicalDomain}/work/${project.slug}`;
    const projectEntry = sitemapEntries.find((e) => e.url === expectedUrl);
    if (!projectEntry) {
      throw new Error(`Sitemap missing project route: "${expectedUrl}"`);
    }
    if (projectEntry.priority !== 0.8) {
      throw new Error(`Project route "${expectedUrl}" must have priority 0.8`);
    }
    if (projectEntry.changeFrequency !== "monthly") {
      throw new Error(`Project route "${expectedUrl}" must have changeFrequency "monthly"`);
    }
  }

  // Must NOT include /dev/tokens to avoid robots.txt indexing conflict
  const hasDevTokens = sitemapEntries.some((e) => e.url.includes("/dev/"));
  if (hasDevTokens) {
    throw new Error("Sitemap must NOT contain /dev/ routes (disallowed in robots.txt)");
  }

  // Total entries should be exactly 7 (1 root + 6 projects)
  if (sitemapEntries.length !== 7) {
    throw new Error(
      `Sitemap expected 7 entries (1 root + 6 projects), got ${sitemapEntries.length}`
    );
  }

  checksPassed++;
  details.push(
    `4. Sitemap verified: root / (1.0) and all 6 projects from content/projects.ts (0.8), total ${sitemapEntries.length} routes, /dev/ excluded`
  );

  // =========================================================================
  // 5. Robots Policy
  // =========================================================================
  const robotsConfig = robots();
  if (robotsConfig.sitemap !== `${canonicalDomain}/sitemap.xml`) {
    throw new Error(
      `robots.sitemap must be "${canonicalDomain}/sitemap.xml", got "${robotsConfig.sitemap}"`
    );
  }

  const rules = Array.isArray(robotsConfig.rules)
    ? robotsConfig.rules[0]
    : robotsConfig.rules;

  if (rules?.allow !== "/") {
    throw new Error(`robots rule allow must be "/", got "${rules?.allow}"`);
  }

  const disallowList = Array.isArray(rules?.disallow)
    ? rules?.disallow
    : [rules?.disallow];
  if (!disallowList.includes("/api/") || !disallowList.includes("/dev/")) {
    throw new Error(
      `robots rule disallow must include ["/api/", "/dev/"]`
    );
  }

  checksPassed++;
  details.push(
    "5. Robots policy verified: canonical sitemap.xml, allow '/', disallow ['/api/', '/dev/']"
  );

  // =========================================================================
  // 6. Web Manifest Properties
  // =========================================================================
  const manifestData = manifest();
  if (manifestData.name !== "Saurabh Dixit - The Systems Blueprint") {
    throw new Error(
      `manifest.name must be "Saurabh Dixit - The Systems Blueprint", got "${manifestData.name}"`
    );
  }
  if (manifestData.short_name !== "Saurabh Dixit") {
    throw new Error(
      `manifest.short_name must be "Saurabh Dixit", got "${manifestData.short_name}"`
    );
  }
  if (manifestData.start_url !== "/") {
    throw new Error(`manifest.start_url must be "/", got "${manifestData.start_url}"`);
  }
  if (manifestData.display !== "standalone") {
    throw new Error(`manifest.display must be "standalone", got "${manifestData.display}"`);
  }
  if (manifestData.background_color !== "#0B0D10") {
    throw new Error(
      `manifest.background_color must be "#0B0D10", got "${manifestData.background_color}"`
    );
  }
  if (manifestData.theme_color !== "#FF6A2B") {
    throw new Error(
      `manifest.theme_color must be "#FF6A2B", got "${manifestData.theme_color}"`
    );
  }
  if (!Array.isArray(manifestData.icons) || manifestData.icons.length < 2) {
    throw new Error("manifest.icons must contain at least 2 icon definitions");
  }

  checksPassed++;
  details.push(
    "6. Web Manifest verified: name, short_name, standalone mode, #0B0D10 background, #FF6A2B theme, and icons"
  );

  // =========================================================================
  // 7. Analytics Dispatch Engine
  // =========================================================================
  clearEventHistory();

  const requiredEvents: AnalyticsEventName[] = [
    "cta_click",
    "resume_download",
    "contact_submit",
    "assistant_open",
    "assistant_message",
    "project_open",
    "theme_toggle",
    "palette_open",
  ];

  trackEvent("cta_click", {
    target: "contact",
    location: "hero",
    href: "#contact",
  });
  trackEvent("resume_download", { source: "hero" });
  trackEvent("contact_submit", { intent: "full-time", messageLength: 42 });
  trackEvent("assistant_open", { trigger: "header" });
  trackEvent("assistant_message", {
    role: "user",
    queryLength: 28,
    suggestedPrompt: true,
  });
  trackEvent("project_open", {
    slug: "ai-code-review",
    title: "Enterprise AI Code Review Platform",
    linkType: "case_study",
  });
  trackEvent("theme_toggle", { theme: "paper", source: "toggle_button" });
  trackEvent("palette_open", { source: "hotkey" });

  const history = getRecentEvents();
  if (history.length !== 8) {
    throw new Error(`Expected 8 recorded events in analytics history, got ${history.length}`);
  }

  for (const eventName of requiredEvents) {
    const found = history.find((h) => h.event === eventName);
    if (!found) {
      throw new Error(`Analytics event "${eventName}" was not recorded in history`);
    }
  }

  // Privacy verification: verify assistant_message NEVER captures raw text
  const asstMessage = history.find((h) => h.event === "assistant_message");
  if ((asstMessage?.properties as any)?.content || (asstMessage?.properties as any)?.text) {
    throw new Error("Privacy violation: assistant_message must never store raw message text");
  }

  // SSR test: trackEvent must not throw in Node environment (without window)
  try {
    trackEvent("cta_click", { target: "test", location: "ssr" });
  } catch (err: any) {
    throw new Error(`trackEvent failed under SSR: ${err.message}`);
  }

  // Negative privacy regression tests (runtime property allowlisting across history, CustomEvent, and providers)
  const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, "window");
  const prevWindow = (globalThis as any).window;
  const hadCustomEvent = Object.prototype.hasOwnProperty.call(globalThis, "CustomEvent");
  const prevCustomEvent = (globalThis as any).CustomEvent;

  try {
    const customEventDetails: any[] = [];
    const vaPayloads: any[] = [];
    const plausiblePayloads: any[] = [];
    const gtagPayloads: any[] = [];

    class MockCustomEvent {
      type: string;
      detail: any;
      constructor(type: string, init?: { detail?: any }) {
        this.type = type;
        this.detail = init?.detail;
      }
    }

    const mockWindow: any = {
      dispatchEvent: (ev: any) => {
        customEventDetails.push(ev.detail);
        return true;
      },
      va: (type: string, data: any) => {
        vaPayloads.push({ type, data });
      },
    };

    (globalThis as any).CustomEvent = MockCustomEvent;
    (globalThis as any).window = mockWindow;

    clearEventHistory();

    // 1) assistant_message with disallowed prompt/query fields (va + CustomEvent + history)
    trackEvent("assistant_message", {
      role: "user",
      query: "super-secret-user-prompt",
      queryLength: 24,
      suggestedPrompt: false,
    } as any);

    // 2) contact_submit with disallowed PII fields (va + CustomEvent + history)
    trackEvent("contact_submit", {
      intent: "full-time",
      message: "super-secret-contact-text",
      email: "secret@example.com",
      messageLength: 24,
    } as any);

    // 3) plausible provider branch
    delete mockWindow.va;
    mockWindow.plausible = (event: string, options?: { props: Record<string, unknown> }) => {
      plausiblePayloads.push({ event, props: options?.props });
    };
    trackEvent("assistant_message", {
      role: "user",
      query: "super-secret-user-prompt",
      queryLength: 24,
      suggestedPrompt: false,
    } as any);
    trackEvent("contact_submit", {
      intent: "full-time",
      message: "super-secret-contact-text",
      email: "secret@example.com",
      messageLength: 24,
    } as any);

    // 4) gtag provider branch
    delete mockWindow.plausible;
    mockWindow.gtag = (command: string, action: string, params: Record<string, unknown>) => {
      gtagPayloads.push({ command, action, params });
    };
    trackEvent("assistant_message", {
      role: "user",
      query: "super-secret-user-prompt",
      queryLength: 24,
      suggestedPrompt: false,
    } as any);
    trackEvent("contact_submit", {
      intent: "full-time",
      message: "super-secret-contact-text",
      email: "secret@example.com",
      messageLength: 24,
    } as any);

    const recent = getRecentEvents();
    const assistantRecords = recent.filter((r) => r.event === "assistant_message");
    const contactRecords = recent.filter((r) => r.event === "contact_submit");

    if (assistantRecords.length !== 3 || contactRecords.length !== 3) {
      throw new Error("Expected 3 assistant_message and 3 contact_submit records during privacy test");
    }

    for (const rec of assistantRecords) {
      const props = rec.properties as Record<string, unknown> | undefined;
      if (!props || props.role !== "user" || props.queryLength !== 24 || props.suggestedPrompt !== false) {
        throw new Error("assistant_message allowed properties were not preserved");
      }
      if ("query" in props || "prompt" in props || "message" in props || "content" in props || "text" in props) {
        throw new Error("Privacy violation: disallowed assistant_message property leaked into eventHistory");
      }
    }

    for (const rec of contactRecords) {
      const props = rec.properties as Record<string, unknown> | undefined;
      if (!props || props.intent !== "full-time" || props.messageLength !== 24) {
        throw new Error("contact_submit allowed properties were not preserved");
      }
      if ("message" in props || "email" in props || "name" in props) {
        throw new Error("Privacy violation: disallowed contact_submit PII leaked into eventHistory");
      }
    }

    const serializedChannels = JSON.stringify({
      customEventDetails,
      vaPayloads,
      plausiblePayloads,
      gtagPayloads,
    });
    for (const forbiddenSecret of [
      "super-secret-user-prompt",
      "super-secret-contact-text",
      "secret@example.com",
    ]) {
      if (serializedChannels.includes(forbiddenSecret)) {
        throw new Error(
          `Privacy violation: forbidden secret "${forbiddenSecret}" leaked into CustomEvent or provider payloads`
        );
      }
    }

    for (const detail of customEventDetails) {
      const props = detail?.properties ?? {};
      if ("query" in props || "message" in props || "email" in props) {
        throw new Error("Privacy violation: disallowed key leaked into CustomEvent detail");
      }
    }

    for (const payload of vaPayloads) {
      const data = payload?.data ?? {};
      if ("query" in data || "message" in data || "email" in data) {
        throw new Error("Privacy violation: disallowed key leaked into window.va payload");
      }
    }

    for (const payload of plausiblePayloads) {
      const props = payload?.props ?? {};
      if ("query" in props || "message" in props || "email" in props) {
        throw new Error("Privacy violation: disallowed key leaked into window.plausible payload");
      }
    }

    for (const payload of gtagPayloads) {
      const params = payload?.params ?? {};
      if ("query" in params || "message" in params || "email" in params) {
        throw new Error("Privacy violation: disallowed key leaked into window.gtag payload");
      }
    }
  } finally {
    if (hadWindow) {
      (globalThis as any).window = prevWindow;
    } else {
      delete (globalThis as any).window;
    }
    if (hadCustomEvent) {
      (globalThis as any).CustomEvent = prevCustomEvent;
    } else {
      delete (globalThis as any).CustomEvent;
    }
  }

  checksPassed++;
  details.push(
    "7. Analytics dispatch verified: all 8 typed event channels functional, SSR-safe, runtime allowlist blocks query & PII across all channels"
  );

  // =========================================================================
  // 8. Blueprint Error & 404 Pages SSR Markup
  // =========================================================================
  const renderedNotFound = ReactDOMServer.renderToString(
    React.createElement(NotFound)
  );
  if (!renderedNotFound.includes("404 // node not found")) {
    throw new Error(
      '<NotFound /> SSR markup must contain exact tag "404 // node not found"'
    );
  }
  if (!renderedNotFound.includes("System Topology Exception")) {
    throw new Error(
      '<NotFound /> SSR markup must contain headline "System Topology Exception"'
    );
  }
  if (!renderedNotFound.includes('href="/"')) {
    throw new Error(
      '<NotFound /> SSR markup must include return-to-home link href="/"'
    );
  }

  const dummyError = new Error("Pipeline execution failure");
  (dummyError as any).digest = "pipeline_digest_9999";
  const renderedError = ReactDOMServer.renderToString(
    React.createElement(ErrorBoundary, {
      error: dummyError,
      reset: () => {},
    })
  );

  if (!renderedError.includes("500 // pipeline fault")) {
    throw new Error(
      '<ErrorBoundary /> SSR markup must contain exact tag "500 // pipeline fault"'
    );
  }
  if (!renderedError.includes("Execution Pipeline Fault")) {
    throw new Error(
      '<ErrorBoundary /> SSR markup must contain headline "Execution Pipeline Fault"'
    );
  }
  if (!renderedError.includes("pipeline_digest_9999")) {
    throw new Error(
      "<ErrorBoundary /> SSR markup must render error digest code"
    );
  }
  if (!renderedError.includes('href="/"')) {
    throw new Error(
      '<ErrorBoundary /> SSR markup must include return-to-home link href="/"'
    );
  }

  checksPassed++;
  details.push(
    '8. Error & 404 pages SSR verified: exact tags ("404 // node not found", "500 // pipeline fault"), telemetry, return-home CTAs'
  );

  // =========================================================================
  // 9. Favicon & Dynamic Image Routes
  // =========================================================================
  if (
    OpenGraphImageModule.size.width !== 1200 ||
    OpenGraphImageModule.size.height !== 630
  ) {
    throw new Error("app/opengraph-image.tsx size must be 1200x630");
  }
  if (OpenGraphImageModule.contentType !== "image/png") {
    throw new Error('app/opengraph-image.tsx contentType must be "image/png"');
  }
  if (typeof OpenGraphImageModule.default !== "function") {
    throw new Error("app/opengraph-image.tsx must export default Image generator");
  }

  if (IconModule.size.width !== 32 || IconModule.size.height !== 32) {
    throw new Error("app/icon.tsx size must be 32x32");
  }
  if (IconModule.contentType !== "image/png") {
    throw new Error('app/icon.tsx contentType must be "image/png"');
  }
  if (typeof IconModule.default !== "function") {
    throw new Error("app/icon.tsx must export default Icon generator");
  }

  if (
    AppleIconModule.size.width !== 180 ||
    AppleIconModule.size.height !== 180
  ) {
    throw new Error("app/apple-icon.tsx size must be 180x180");
  }
  if (AppleIconModule.contentType !== "image/png") {
    throw new Error('app/apple-icon.tsx contentType must be "image/png"');
  }
  if (typeof AppleIconModule.default !== "function") {
    throw new Error("app/apple-icon.tsx must export default AppleIcon generator");
  }

  checksPassed++;
  details.push(
    "9. Favicon and dynamic image routes verified: opengraph-image.tsx (1200x630), icon.tsx (32x32), apple-icon.tsx (180x180)"
  );

  return {
    success: true,
    checksPassed,
    details,
  };
}

if (require.main === module) {
  runSeoValidation()
    .then((result) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((err: any) => {
      // eslint-disable-next-line no-console
      console.error("SEO Validation Failed:", err.message);
      process.exit(1);
    });
}
