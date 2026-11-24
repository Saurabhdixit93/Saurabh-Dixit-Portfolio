"use client";

import React from "react";
import { Section } from "@/components/primitives/Section";
import { projects } from "@/content/projects";
import { FeaturedProjectCard } from "./work/FeaturedProjectCard";
import { MoreBuildsGrid } from "./work/MoreBuildsGrid";

export interface SelectedWorkProps {
  id?: string;
  className?: string;
}

export function SelectedWork({
  id = "work",
  className = "",
}: SelectedWorkProps) {
  const featuredProjects = projects.filter((p) => p.featured);
  const secondaryProjects = projects.filter((p) => !p.featured);

  return (
    <Section
      id={id}
      annotation="// 04 · SELECTED WORK & CASE STUDIES"
      heading="Selected Systems & Engineering Case Studies"
      subheading="Production architectures, distributed pipelines, and AI systems built with verifiable engineering discipline."
      withGrid
      withHairline
      className={className}
    >
      {/* Featured Projects: Pure CSS Sticky Stacking Deck on Desktop */}
      <div className="relative mt-8 md:mt-12 space-y-0" aria-label="Featured architectural projects">
        {featuredProjects.map((project, index) => (
          <FeaturedProjectCard
            key={project.slug}
            project={project}
            index={index}
          />
        ))}
      </div>

      {/* Secondary Builds Grid */}
      <MoreBuildsGrid projects={secondaryProjects} />
    </Section>
  );
}

export default SelectedWork;
