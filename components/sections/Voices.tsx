"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import { testimonials as defaultTestimonials } from "@/content/testimonials";
import { Testimonial } from "@/content/types";

export interface VoicesProps {
  id?: string;
  className?: string;
  items?: Testimonial[];
}

/**
 * Voices / Testimonials Section
 *
 * MANDATORY INTEGRITY CODE COMMENT (Master Rule 6 / PRD Prompt 9):
 * Fake quotes, simulated endorsements, or fabricated metrics must NEVER be added
 * to this codebase. Only genuine, verifiable recommendations (with explicit consent
 * and source links such as LinkedIn) may be rendered.
 *
 * In accordance with Master Rule 6 and PRD Section 1.2, this component strictly returns null
 * when `testimonials` is empty, guaranteeing zero DOM footprint and zero fabricated social proof.
 */
export const Voices: React.FC<VoicesProps> = ({
  id = "voices",
  className = "",
  items = defaultTestimonials,
}) => {
  // Gracefully return null when testimonials array is empty or undefined
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Section
      id={id}
      annotation="// 08 · VOICES & ENDORSEMENTS"
      heading={
        <>
          Verified peers, collaborators &{" "}
          <span className="italic text-accent">engineering leaders</span>.
        </>
      }
      subheading="Direct feedback and recommendations from colleagues and partners who have built alongside me."
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      {/* Calm 2-Column Quote Grid (strictly NOT an infinite marquee) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between p-6 md:p-8 bg-surface/70 border border-hairline hover:border-accent/40 transition-colors"
          >
            {/* Corner registration mark */}
            <div
              className="absolute top-0 right-0 p-2 font-mono text-[10px] text-muted/60 pointer-events-none select-none"
              aria-hidden="true"
            >
              +
            </div>

            {/* Quote Body */}
            <blockquote className="text-sm md:text-base text-text/90 italic leading-relaxed">
              &ldquo;{item.quote}&rdquo;
            </blockquote>

            {/* Attribution Footer & Source Link */}
            <div className="mt-6 pt-4 border-t border-hairline/60 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-semibold text-text">
                  {item.author}
                </p>
                <p className="font-mono text-[11px] text-muted">
                  {item.title} · {item.company}
                </p>
              </div>

              {item.linkedInUrl && (
                <a
                  href={item.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-accent hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  aria-label={`Verify recommendation for ${item.author} on LinkedIn`}
                >
                  Verify source ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Voices;
