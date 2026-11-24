import * as React from "react";
import { profile } from "@/content/profile";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { Tag } from "@/components/primitives/Tag";
import { SystemCoreDiagram } from "./hero/SystemCoreDiagram";
import { HeroMetrics } from "./hero/HeroMetrics";

export interface HeroProps {
  className?: string;
}

/**
 * Hero Section
 * Primary 10-second pitch of the Systems Blueprint portfolio:
 * - Eyebrow annotation with live availability status
 * - Instrument Serif headline with ONE italic accent word ("systems")
 * - Server-rendered subcopy from profile.shortBio for zero-JS LCP
 * - 3 CTAs: "Let's talk" (#contact), "View work" (#work), "Resume" (profile.resumePath)
 * - 5-node SystemCoreDiagram SVG
 * - 3 proof metrics from content/metrics.ts with zero-CLS count-up
 * - Responsive split layout on desktop (7 cols / 5 cols) and stacked on mobile
 */
export const Hero: React.FC<HeroProps> = ({ className = "" }) => {
  // Extract headline parts to safely wrap the accent word "systems" with italic styling
  const accentWord = "systems";
  const hasAccentWord = profile.headline.toLowerCase().includes(accentWord);
  const headlineParts = hasAccentWord
    ? profile.headline.split(new RegExp(`(${accentWord})`, "i"))
    : [profile.headline];

  return (
    <section
      id="hero"
      aria-label="Hero overview"
      className={`relative w-full pt-28 pb-14 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 border-b border-hairline bg-blueprint-grid overflow-hidden ${className}`}
    >
      {/* Background blueprint decorative glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <Container size="default">
        <div className="relative">
          {/* Blueprint Corner Registration Marks */}
          <span className="corner-mark corner-mark-tl" aria-hidden="true" />
          <span className="corner-mark corner-mark-tr" aria-hidden="true" />
          <span className="corner-mark corner-mark-bl" aria-hidden="true" />
          <span className="corner-mark corner-mark-br" aria-hidden="true" />

          {/* Responsive Split Layout: 7 cols text / 5 cols diagram on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Eyebrow, Headline, Subcopy, CTAs, Desktop Metrics */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-5">
                {/* Eyebrow Annotation & Availability Tag */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <div className="annotation">
                    // VP OF ENGINEERING · FULL-STACK · AI SYSTEMS
                  </div>
                  {profile.availability?.label && (
                    <Tag
                      variant="outline"
                      size="sm"
                      indicator="green"
                      className="font-mono text-[11px]"
                    >
                      {profile.availability.label}
                    </Tag>
                  )}
                </div>

                {/* Headline: Instrument Serif with ONE italic accent word ("systems") */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-text leading-[1.08]">
                  {hasAccentWord ? (
                    headlineParts.map((part, i) =>
                      part.toLowerCase() === accentWord ? (
                        <span key={i} className="italic text-accent">
                          {part}
                        </span>
                      ) : (
                        <React.Fragment key={i}>{part}</React.Fragment>
                      )
                    )
                  ) : (
                    profile.headline
                  )}
                </h1>

                {/* Subcopy: Server-rendered value proposition */}
                <p className="font-sans text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
                  {profile.shortBio}
                </p>
              </div>

              {/* 3 Call-To-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <Button variant="primary" size="lg" href="#contact">
                  Let&apos;s talk
                </Button>
                <Button variant="secondary" size="lg" href="#work">
                  View work
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  href={profile.resumePath}
                  external
                  download
                >
                  Resume
                </Button>
              </div>

              {/* Verified Proof Metrics Grid (Desktop: placed in 7-col flow) */}
              <div className="hidden lg:block pt-4">
                <HeroMetrics />
              </div>
            </div>

            {/* Right Column: 5-Node Animated SVG System Core Diagram */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <SystemCoreDiagram />
            </div>

            {/* Verified Proof Metrics Grid (Mobile: stacked below diagram) */}
            <div className="block lg:hidden w-full pt-2">
              <HeroMetrics />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
