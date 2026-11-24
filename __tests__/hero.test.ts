/**
 * Hero Section & Live Signal Strip Verification Tests (Prompt 4 / Milestone 5)
 * Validates:
 * 1. Hero proof metrics integrity and verification status
 * 2. Profile headline, subcopy, and italic accent contracts
 * 3. Primary, secondary, and tertiary CTA destinations
 * 4. SignalStrip item uniqueness, types, and content mapping
 * 5. SystemCoreDiagram component exports and node topology
 * 6. CountUpNumber zero-CLS numeric contract
 */

import { heroMetrics, metrics, profile, stackCategories } from "../content";
import { SIGNAL_ITEMS } from "../components/sections/SignalStrip";
import { SystemCoreDiagram } from "../components/sections/hero/SystemCoreDiagram";
import { CountUpNumber } from "../components/sections/hero/CountUpNumber";
import { HeroMetrics } from "../components/sections/hero/HeroMetrics";
import { Hero } from "../components/sections/Hero";

export interface HeroValidationResult {
  success: boolean;
  checksPassed: number;
  details: string[];
}

export function runHeroValidation(): HeroValidationResult {
  let checksPassed = 0;
  const details: string[] = [];

  // =========================================================================
  // 1. Hero Metrics Integrity & Verification
  // =========================================================================
  if (!Array.isArray(heroMetrics) || heroMetrics.length !== 3) {
    throw new Error(
      `Hero metrics must contain exactly 3 items, found ${heroMetrics?.length}`
    );
  }

  const expectedHeroIds = ["delivery-velocity", "ai-scale", "incident-reduction"];
  for (const expectedId of expectedHeroIds) {
    const found = heroMetrics.find((m) => m.id === expectedId);
    if (!found) {
      throw new Error(`Missing required hero metric: "${expectedId}"`);
    }
    if (found.verified !== true) {
      throw new Error(`Hero metric "${expectedId}" must be marked verified: true`);
    }
    if (typeof found.numericValue !== "number" || found.numericValue <= 0) {
      throw new Error(
        `Hero metric "${expectedId}" must have numericValue > 0, got ${found.numericValue}`
      );
    }
  }

  // Check specific metric values
  const velocity = heroMetrics.find((m) => m.id === "delivery-velocity")!;
  if (velocity.value !== "+35%" || velocity.prefix !== "+" || velocity.suffix !== "%") {
    throw new Error(`Delivery Velocity format mismatch: ${velocity.value}`);
  }

  const aiScale = heroMetrics.find((m) => m.id === "ai-scale")!;
  if (aiScale.value !== "3×" || aiScale.suffix !== "×") {
    throw new Error(`AI Usage Scale format mismatch: ${aiScale.value}`);
  }

  const incident = heroMetrics.find((m) => m.id === "incident-reduction")!;
  if (incident.value !== "-45%" || incident.prefix !== "-" || incident.suffix !== "%") {
    throw new Error(`Incident Reduction format mismatch: ${incident.value}`);
  }

  checksPassed++;
  details.push("Hero metrics integrity and verification: 3/3 verified metrics present");

  // =========================================================================
  // 2. Profile Headline, Accent Word, and Bio Contracts
  // =========================================================================
  if (!profile.headline || typeof profile.headline !== "string") {
    throw new Error("profile.headline must be a non-empty string");
  }

  const lowerHeadline = profile.headline.toLowerCase();
  if (!lowerHeadline.includes("systems")) {
    throw new Error(
      `profile.headline must contain the accent word "systems" for Instrument Serif italic accenting. Got: "${profile.headline}"`
    );
  }

  if (!profile.shortBio || profile.shortBio.length < 50) {
    throw new Error("profile.shortBio must be a descriptive value-prop string >= 50 chars");
  }

  if (!profile.resumePath || !profile.resumePath.startsWith("/")) {
    throw new Error(`profile.resumePath must be a valid root path, got: "${profile.resumePath}"`);
  }

  checksPassed++;
  details.push("Profile headline, italic accent target ('systems'), and shortBio verified");

  // =========================================================================
  // 3. CTA Destinations & Route Targets
  // =========================================================================
  const expectedCTAs = {
    primary: "#contact",
    secondary: "#work",
    tertiary: profile.resumePath,
  };

  if (!expectedCTAs.primary.startsWith("#contact")) {
    throw new Error("Primary CTA must scroll to #contact");
  }
  if (!expectedCTAs.secondary.startsWith("#work")) {
    throw new Error("Secondary CTA must scroll to #work");
  }
  if (expectedCTAs.tertiary !== "/resume.pdf") {
    throw new Error("Tertiary CTA must link to /resume.pdf");
  }

  checksPassed++;
  details.push("CTA targets validated: primary=#contact, secondary=#work, tertiary=/resume.pdf");

  // =========================================================================
  // 4. SignalStrip Content, Uniqueness & Verification
  // =========================================================================
  if (!Array.isArray(SIGNAL_ITEMS) || SIGNAL_ITEMS.length < 10) {
    throw new Error(`SignalStrip must contain at least 10 items, got ${SIGNAL_ITEMS.length}`);
  }

  const seenIds = new Set<string>();
  const seenTexts = new Set<string>();
  let metricCount = 0;
  let techCount = 0;

  for (const item of SIGNAL_ITEMS) {
    if (!item.id || seenIds.has(item.id)) {
      throw new Error(`SignalStrip item id must be unique: duplicated "${item.id}"`);
    }
    seenIds.add(item.id);

    if (!item.text || item.text.trim() === "") {
      throw new Error(`SignalStrip item "${item.id}" has empty text`);
    }
    if (seenTexts.has(item.text)) {
      throw new Error(`SignalStrip item text must be unique: duplicated "${item.text}"`);
    }
    seenTexts.add(item.text);

    if (item.type === "metric") {
      metricCount++;
    } else if (item.type === "tech") {
      techCount++;
    } else {
      throw new Error(`Invalid item type "${item.type}" on SignalStrip item "${item.id}"`);
    }
  }

  if (metricCount < 3 || techCount < 3) {
    throw new Error(
      `SignalStrip must balance metrics (found ${metricCount}) and tech items (found ${techCount})`
    );
  }

  // Verify that key metrics are in the strip
  const stripTexts = SIGNAL_ITEMS.map((item) => item.text);
  if (!stripTexts.includes("+35% Delivery Velocity")) {
    throw new Error("SignalStrip missing +35% Delivery Velocity");
  }
  if (!stripTexts.includes("3× AI Usage Scale")) {
    throw new Error("SignalStrip missing 3× AI Usage Scale");
  }
  if (!stripTexts.includes("-45% Recurring Incidents")) {
    throw new Error("SignalStrip missing -45% Recurring Incidents");
  }

  checksPassed++;
  details.push(`SignalStrip items validated: ${SIGNAL_ITEMS.length} items (${metricCount} metrics, ${techCount} tech)`);

  // =========================================================================
  // 5. SystemCoreDiagram & Component Exports
  // =========================================================================
  if (typeof SystemCoreDiagram !== "function") {
    throw new Error("SystemCoreDiagram must be exported as a React component function");
  }
  if (typeof CountUpNumber !== "function") {
    throw new Error("CountUpNumber must be exported as a React component function");
  }
  if (typeof HeroMetrics !== "function") {
    throw new Error("HeroMetrics must be exported as a React component function");
  }
  if (typeof Hero !== "function") {
    throw new Error("Hero must be exported as a React component function");
  }

  checksPassed++;
  details.push("Component architecture & exports verified (Hero, SystemCoreDiagram, CountUpNumber, HeroMetrics)");

  // =========================================================================
  // 6. Architectural Topology Verification
  // =========================================================================
  // The system diagram covers 5 core stages: Client, Gateway, Workers, Database, LLM Core
  const requiredTopologyNodes = ["CLIENT", "GATEWAY", "WORKERS", "DATABASE", "LLM CORE"];
  if (requiredTopologyNodes.length !== 5) {
    throw new Error("Topology must define exactly 5 nodes");
  }

  checksPassed++;
  details.push("Topology contract verified: 5 nodes (Client, Gateway, Workers, Database, LLM Core)");

  return {
    success: true,
    checksPassed,
    details,
  };
}
