"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import { principles } from "@/content/principles";
import { BioBlock } from "./about/BioBlock";
import { LeadershipCallout } from "./about/LeadershipCallout";
import { PrincipleCard } from "./about/PrincipleCard";

export interface AboutProps {
  id?: string;
  className?: string;
}

export const About: React.FC<AboutProps> = ({ id = "about", className = "" }) => {
  return (
    <Section
      id={id}
      annotation="// 01 · ABOUT & LEADERSHIP"
      heading={
        <>
          Bridging architectural rigor with{" "}
          <span className="italic text-accent">high-velocity</span> delivery.
        </>
      }
      subheading="Background, systems philosophy, and the principles governing my engineering leadership."
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
        {/* Left Column: Bio & Leadership Callout */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <BioBlock />
          <LeadershipCallout />
        </div>

        {/* Right Column: 4 Numbered Operating Principles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-hairline/60">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              // FOUNDATIONAL OPERATING PRINCIPLES (01 - 04)
            </span>
            <span className="font-mono text-[10px] text-accent shrink-0">
              4 PRINCIPLES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map((principle, index) => (
              <PrincipleCard
                key={principle.id}
                principle={principle}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
