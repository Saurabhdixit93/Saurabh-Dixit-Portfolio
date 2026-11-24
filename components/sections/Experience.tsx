"use client";

import React from "react";
import Section from "@/components/primitives/Section";
import { GitGraphTimeline } from "./experience/GitGraphTimeline";

export interface ExperienceProps {
  id?: string;
  className?: string;
  isProduction?: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({
  id = "experience",
  className = "",
  isProduction = process.env.NODE_ENV === "production",
}) => {
  return (
    <Section
      id={id}
      annotation="// 05 · CAREER TOPOLOGY & EXPERIENCE"
      heading="Career Progression as a Git Branch."
      subheading="From foundational backend engineering to leading engineering organizations and architecting scalable AI platforms."
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      <GitGraphTimeline isProduction={isProduction} />
    </Section>
  );
};

export default Experience;
