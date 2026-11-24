/**
 * Milestone 11 (Prompt 10: Contact, Footer, Resume)
 * Comprehensive Verification Test Suite
 */

import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { NextRequest } from "next/server";

import {
  contactSchema,
  CONTACT_INTENTS,
  ContactSubmission,
} from "../app/api/contact/schema";
import { POST } from "../app/api/contact/route";
import {
  SlidingWindowRateLimiter,
  contactRateLimiter,
} from "../lib/rateLimit";
import {
  contactContent,
  profile,
  FEATURE_FLAGS,
  isWhatsAppEnabled,
} from "../content";

import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/sections/Footer";

import ContactFacade from "../components/Contact";
import FooterFacade from "../components/Footer";
import * as SectionsExports from "../components/sections";

export interface ContactValidationResult {
  success: boolean;
  checksPassed: number;
  details: string[];
}

export async function runContactValidation(): Promise<ContactValidationResult> {
  let checksPassed = 0;
  const details: string[] = [];
  const projectRoot = process.cwd();

  // =========================================================================
  // 1. Zod Schema Validation & Intent Contracts
  // =========================================================================
  if (CONTACT_INTENTS.length !== 5) {
    throw new Error(`Expected exactly 5 CONTACT_INTENTS, got ${CONTACT_INTENTS.length}`);
  }

  const expectedIntents = [
    "full-time",
    "consulting",
    "advisory",
    "collaboration",
    "general",
  ];
  for (const intent of expectedIntents) {
    if (!CONTACT_INTENTS.includes(intent as any)) {
      throw new Error(`Missing expected intent: ${intent}`);
    }
  }

  // Valid payload with all intents
  for (const intent of CONTACT_INTENTS) {
    const valid = contactSchema.safeParse({
      name: "Saurabh Dixit",
      email: "engineer@example.com",
      intent,
      message: "Testing system architecture inquiry message.",
      loadedAt: Date.now() - 5000,
    });
    if (!valid.success) {
      throw new Error(`Valid intent ${intent} failed schema validation: ${JSON.stringify(valid.error)}`);
    }
  }

  // Name boundary tests
  if (!contactSchema.safeParse({ name: "Al", email: "a@b.co", intent: "general", message: "1234567890" }).success) {
    throw new Error("Name with 2 chars should be valid");
  }
  if (contactSchema.safeParse({ name: "A", email: "a@b.co", intent: "general", message: "1234567890" }).success) {
    throw new Error("Name with 1 char should be rejected");
  }
  if (contactSchema.safeParse({ name: "   ", email: "a@b.co", intent: "general", message: "1234567890" }).success) {
    throw new Error("Whitespace name should be rejected");
  }
  if (contactSchema.safeParse({ name: "a".repeat(101), email: "a@b.co", intent: "general", message: "1234567890" }).success) {
    throw new Error("Name > 100 chars should be rejected");
  }

  // Email validation tests
  if (contactSchema.safeParse({ name: "Alex", email: "invalid-email", intent: "general", message: "1234567890" }).success) {
    throw new Error("Invalid email format should be rejected");
  }
  if (contactSchema.safeParse({ name: "Alex", email: "user@", intent: "general", message: "1234567890" }).success) {
    throw new Error("Incomplete email format should be rejected");
  }

  // Message boundary tests
  if (!contactSchema.safeParse({ name: "Alex", email: "alex@co.com", intent: "general", message: "1234567890" }).success) {
    throw new Error("Message with 10 chars should be valid");
  }
  if (contactSchema.safeParse({ name: "Alex", email: "alex@co.com", intent: "general", message: "123456789" }).success) {
    throw new Error("Message with 9 chars should be rejected");
  }
  if (contactSchema.safeParse({ name: "Alex", email: "alex@co.com", intent: "general", message: "a".repeat(3001) }).success) {
    throw new Error("Message > 3000 chars should be rejected");
  }

  // Invalid intent
  if (contactSchema.safeParse({ name: "Alex", email: "alex@co.com", intent: "crypto", message: "1234567890" }).success) {
    throw new Error("Unknown intent should be rejected");
  }

  checksPassed++;
  details.push("1. Zod schema validation verified: intents, name/email/message boundaries, and character limits enforced");

  // =========================================================================
  // 2. Honeypot Anti-Spam Defense
  // =========================================================================
  // Empty honeypot or undefined honeypot is valid
  const emptyHoneypot = contactSchema.safeParse({
    name: "Alex",
    email: "alex@co.com",
    intent: "general",
    message: "Valid contact inquiry message text.",
    website: "",
  });
  if (!emptyHoneypot.success) {
    throw new Error("Empty website honeypot must be accepted");
  }

  // Populated honeypot is rejected
  const botSubmission = contactSchema.safeParse({
    name: "SpamBot",
    email: "bot@spam.com",
    intent: "general",
    message: "Automated spam message payload.",
    website: "https://spam.example.com",
  });
  if (botSubmission.success) {
    throw new Error("Populated honeypot website field must be rejected");
  }

  checksPassed++;
  details.push("2. Honeypot anti-spam defense verified: empty allowed, populated rejected");

  // =========================================================================
  // 3. Sliding-Window Rate Limiter
  // =========================================================================
  const testLimiter = new SlidingWindowRateLimiter(3, 1000);
  const ip1 = "192.168.1.101";
  const ip2 = "192.168.1.102";

  testLimiter.reset();

  const r1 = testLimiter.check(ip1);
  const r2 = testLimiter.check(ip1);
  const r3 = testLimiter.check(ip1);
  if (!r1.allowed || !r2.allowed || !r3.allowed) {
    throw new Error("First 3 requests within limit must be allowed");
  }
  if (r3.remaining !== 0) {
    throw new Error(`Expected remaining 0 after 3 requests, got ${r3.remaining}`);
  }

  const r4 = testLimiter.check(ip1);
  if (r4.allowed) {
    throw new Error("4th request exceeding limit must be blocked");
  }
  if (!r4.retryAfter || r4.retryAfter <= 0) {
    throw new Error("Blocked request must have positive retryAfter seconds");
  }

  // Different IP should still be allowed (independent window)
  const rOther = testLimiter.check(ip2);
  if (!rOther.allowed) {
    throw new Error("Distinct IP should have independent rate limit budget");
  }

  // Reset allows blocked IP again
  testLimiter.reset();
  const rAfterReset = testLimiter.check(ip1);
  if (!rAfterReset.allowed) {
    throw new Error("Rate limiter reset() must clear blocked IP state");
  }

  checksPassed++;
  details.push("3. Sliding-window rate limiter verified: threshold enforcement, retry-after calculation, IP isolation, and reset()");

  // =========================================================================
  // 4. API Route Handler Invocations (Mock HTTP Requests)
  // =========================================================================
  contactRateLimiter.reset();

  // Test 4a: Valid submission returns HTTP 200
  const validReq = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.0.1",
    },
    body: JSON.stringify({
      name: "Marcus Aurelius",
      email: "marcus@philosophy.org",
      intent: "consulting",
      message: "Looking for an architectural audit for distributed system pipeline.",
      loadedAt: Date.now() - 4000,
    }),
  });
  const validRes = await POST(validReq as any);
  if (validRes.status !== 200) {
    throw new Error(`Expected HTTP 200 for valid submission, got ${validRes.status}`);
  }
  const validJson = await validRes.json();
  if (!validJson.success || !validJson.message.includes("within 24 hours")) {
    throw new Error(`Unexpected valid response body: ${JSON.stringify(validJson)}`);
  }

  // Test 4b: Fast bot submission (< 1200ms) returns HTTP 400
  const fastReq = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.0.2",
    },
    body: JSON.stringify({
      name: "Speedy Bot",
      email: "speedy@bot.org",
      intent: "general",
      message: "Fast submission within milliseconds of loading.",
      loadedAt: Date.now() - 200,
    }),
  });
  const fastRes = await POST(fastReq as any);
  if (fastRes.status !== 400) {
    throw new Error(`Expected HTTP 400 for sub-1200ms submission, got ${fastRes.status}`);
  }
  const fastJson = await fastRes.json();
  if (fastJson.error !== "Submission too fast. Please retry.") {
    throw new Error(`Expected 'Submission too fast. Please retry.', got: ${fastJson.error}`);
  }

  // Test 4c: Validation error returns HTTP 400 with fieldErrors
  const invalidReq = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.0.3",
    },
    body: JSON.stringify({
      name: "A",
      email: "not-an-email",
      intent: "crypto",
      message: "Short",
      loadedAt: Date.now() - 5000,
    }),
  });
  const invalidRes = await POST(invalidReq as any);
  if (invalidRes.status !== 400) {
    throw new Error(`Expected HTTP 400 for invalid submission, got ${invalidRes.status}`);
  }
  const invalidJson = await invalidRes.json();
  if (!invalidJson.fieldErrors || !invalidJson.fieldErrors.email) {
    throw new Error(`Missing fieldErrors in validation response: ${JSON.stringify(invalidJson)}`);
  }

  // Test 4d: Rate limit enforcement returns HTTP 429 after 5 requests from same IP
  contactRateLimiter.reset();
  const rateLimitIp = "10.0.0.99";
  for (let i = 0; i < 5; i++) {
    const loopReq = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": rateLimitIp,
      },
      body: JSON.stringify({
        name: `User ${i}`,
        email: `user${i}@domain.com`,
        intent: "general",
        message: "Legitimate inquiry message payload for rate limit test.",
        loadedAt: Date.now() - 5000,
      }),
    });
    const loopRes = await POST(loopReq as any);
    if (loopRes.status !== 200) {
      throw new Error(`Expected HTTP 200 for attempt ${i + 1}, got ${loopRes.status}`);
    }
  }

  const blockedReq = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": rateLimitIp,
    },
    body: JSON.stringify({
      name: "User 6",
      email: "user6@domain.com",
      intent: "general",
      message: "Sixth message should be blocked by rate limiter.",
      loadedAt: Date.now() - 5000,
    }),
  });
  const blockedRes = await POST(blockedReq as any);
  if (blockedRes.status !== 429) {
    throw new Error(`Expected HTTP 429 for 6th attempt, got ${blockedRes.status}`);
  }
  const retryHeader = blockedRes.headers.get("Retry-After");
  if (!retryHeader) {
    throw new Error("HTTP 429 response must provide 'Retry-After' header");
  }

  contactRateLimiter.reset();

  checksPassed++;
  details.push("4. API route POST handler verified: 200 success, 400 speed bot rejection, 400 input validation, 429 rate limit with Retry-After header");

  // =========================================================================
  // 5. Content Layer Integrity & Feature Flags
  // =========================================================================
  if (FEATURE_FLAGS.ENABLE_WHATSAPP !== false) {
    throw new Error("FEATURE_FLAGS.ENABLE_WHATSAPP must default to false");
  }
  if (isWhatsAppEnabled() !== false) {
    throw new Error("isWhatsAppEnabled() must return false by default");
  }
  if (isWhatsAppEnabled(true) !== true || isWhatsAppEnabled(false) !== false) {
    throw new Error("isWhatsAppEnabled(override) runtime override broken");
  }

  // Verify contactContent SSOT contracts
  if (contactContent.annotation !== "// 10 · CONTACT & INQUIRIES") {
    throw new Error(`contactContent.annotation mismatch: ${contactContent.annotation}`);
  }
  if (!contactContent.heading.includes("Initiate Contact & Transmit Inquiries")) {
    throw new Error(`contactContent.heading mismatch: ${contactContent.heading}`);
  }
  if (contactContent.responsePromise !== "TYPICAL REPLY < 24H") {
    throw new Error(`contactContent.responsePromise mismatch: ${contactContent.responsePromise}`);
  }
  if (contactContent.footer.tagline !== "Built with Next.js - designed in the open") {
    throw new Error(`contactContent.footer.tagline mismatch: ${contactContent.footer.tagline}`);
  }
  if (contactContent.footer.navLinks.length !== 8) {
    throw new Error(`Expected 8 sitemap links, found ${contactContent.footer.navLinks.length}`);
  }

  // Verify canonical LinkedIn URL in profile.socials
  const profileLinkedIn = profile.socials.find((s) => s.platform === "linkedin");
  if (!profileLinkedIn || profileLinkedIn.url !== "https://www.linkedin.com/in/saurabhdixit93") {
    throw new Error(`profile.socials linkedin URL must be https://www.linkedin.com/in/saurabhdixit93, got: ${profileLinkedIn?.url}`);
  }

  // Verify resume file existence
  const resumeFilePath = path.join(projectRoot, "public", "resume.pdf");
  if (!fs.existsSync(resumeFilePath)) {
    throw new Error("public/resume.pdf must exist");
  }
  const resumeStat = fs.statSync(resumeFilePath);
  if (resumeStat.size < 100) {
    throw new Error(`public/resume.pdf appears corrupt or empty: ${resumeStat.size} bytes`);
  }

  checksPassed++;
  details.push("5. Content layer & feature flags verified: WhatsApp disabled by default, SSOT copy, canonical LinkedIn, verified resume PDF");

  // =========================================================================
  // 6. SSR Rendering Verification: <Contact />
  // =========================================================================
  const renderedContact = ReactDOMServer.renderToString(
    React.createElement(Contact, { id: "contact" })
  );

  if (!renderedContact.includes('id="contact"')) {
    throw new Error("<Contact /> SSR output is missing id=\"contact\"");
  }
  if (!renderedContact.includes("TYPICAL REPLY &lt; 24H") && !renderedContact.includes("TYPICAL REPLY < 24H")) {
    throw new Error("<Contact /> SSR output is missing response promise badge 'TYPICAL REPLY < 24H'");
  }
  if (!renderedContact.includes('name="website"') || !renderedContact.includes('tabindex="-1"')) {
    throw new Error("<Contact /> SSR output is missing honeypot input with tabIndex=-1");
  }
  if (!renderedContact.includes('id="contact-name"') || !renderedContact.includes('id="contact-email"')) {
    throw new Error("<Contact /> SSR output is missing accessible input ids for name and email");
  }
  if (!renderedContact.includes('id="contact-intent"') || !renderedContact.includes('id="contact-message"')) {
    throw new Error("<Contact /> SSR output is missing accessible input ids for intent and message");
  }
  if (!renderedContact.includes("OPERATIONAL TELEMETRY") || !renderedContact.includes("Current Status:")) {
    throw new Error("<Contact /> SSR output is missing operational telemetry panel");
  }
  if (!renderedContact.includes('data-track="resume_download"')) {
    throw new Error("<Contact /> SSR output is missing tracked resume download button (data-track='resume_download')");
  }
  if (!renderedContact.includes('href="/resume.pdf"')) {
    throw new Error("<Contact /> SSR output is missing resume link pointing to /resume.pdf");
  }
  if (!renderedContact.includes("https://www.linkedin.com/in/saurabhdixit93")) {
    throw new Error("<Contact /> SSR output must use canonical LinkedIn URL from profile.socials");
  }
  if (renderedContact.includes("saurabh-dixit-47a82b1b3")) {
    throw new Error("<Contact /> SSR output still contains stale hardcoded LinkedIn URL (saurabh-dixit-47a82b1b3)");
  }
  // WhatsApp must NOT be rendered when flag is false
  if (renderedContact.includes('data-track="whatsapp_click"') || renderedContact.includes("WhatsApp")) {
    throw new Error("<Contact /> SSR output must NOT render WhatsApp when FEATURE_FLAGS.ENABLE_WHATSAPP is false");
  }

  checksPassed++;
  details.push("6. <Contact /> SSR rendered correctly: section id, honeypot attributes, accessible inputs, telemetry, resume download link, canonical LinkedIn, WhatsApp hidden");

  // =========================================================================
  // 7. SSR Rendering Verification: <Footer />
  // =========================================================================
  const renderedFooter = ReactDOMServer.renderToString(React.createElement(Footer));

  const currentYear = new Date().getFullYear();
  if (!renderedFooter.includes(String(currentYear))) {
    throw new Error(`<Footer /> SSR output must include dynamic copyright year: ${currentYear}`);
  }
  if (!renderedFooter.includes("Built with Next.js - designed in the open")) {
    throw new Error("<Footer /> SSR output must include exact PRD tagline 'Built with Next.js - designed in the open'");
  }
  if (!renderedFooter.includes("aria-label=\"Return to top of page\"")) {
    throw new Error("<Footer /> SSR output must have accessible return-to-top button with aria-label");
  }
  if (!renderedFooter.includes("https://www.linkedin.com/in/saurabhdixit93")) {
    throw new Error("<Footer /> SSR output must use canonical LinkedIn URL from profile.socials");
  }
  if (renderedFooter.includes("saurabh-dixit-47a82b1b3")) {
    throw new Error("<Footer /> SSR output still contains stale hardcoded LinkedIn URL (saurabh-dixit-47a82b1b3)");
  }

  // Check all sitemap links
  const expectedSitemapHrefs = [
    "#about",
    "#capabilities",
    "#stack",
    "#work",
    "#experience",
    "#ai-workflow",
    "#process",
    "#contact",
  ];
  for (const href of expectedSitemapHrefs) {
    if (!renderedFooter.includes(`href="${href}"`)) {
      throw new Error(`<Footer /> SSR output is missing sitemap link to ${href}`);
    }
  }

  checksPassed++;
  details.push("7. <Footer /> SSR rendered correctly: dynamic year, exact PRD tagline, accessible return-to-top, canonical socials, 8 sitemap links");

  // =========================================================================
  // 8. Facade & Barrel Export Verification
  // =========================================================================
  const contactFacadePath = path.join(projectRoot, "components", "Contact.tsx");
  if (!fs.existsSync(contactFacadePath)) {
    throw new Error("components/Contact.tsx facade file missing");
  }
  const contactFacadeContent = fs.readFileSync(contactFacadePath, "utf-8");
  if (!contactFacadeContent.includes("sections/Contact")) {
    throw new Error("components/Contact.tsx must re-export sections/Contact");
  }

  const footerFacadePath = path.join(projectRoot, "components", "Footer.tsx");
  if (!fs.existsSync(footerFacadePath)) {
    throw new Error("components/Footer.tsx facade file missing");
  }
  const footerFacadeContent = fs.readFileSync(footerFacadePath, "utf-8");
  if (!footerFacadeContent.includes("sections/Footer")) {
    throw new Error("components/Footer.tsx must re-export sections/Footer");
  }

  if (typeof SectionsExports.Contact !== "function" || typeof SectionsExports.Footer !== "function") {
    throw new Error("components/sections/index.ts must export Contact and Footer");
  }

  checksPassed++;
  details.push("8. Facades & barrel exports verified: components/Contact.tsx, components/Footer.tsx, and components/sections/index.ts");

  return {
    success: true,
    checksPassed,
    details,
  };
}

// Standalone execution support
if (
  require.main === module ||
  (typeof process !== "undefined" && process.argv[1]?.endsWith("contact.test.ts"))
) {
  runContactValidation()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error: any) => {
      console.error("Contact validation failed:", error.message || error);
      process.exit(1);
    });
}
