"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, GitBranch } from "lucide-react";
import { Project } from "@/content/types";
import { Tag } from "@/components/primitives/Tag";

export interface FeaturedProjectCardProps {
  project: Project;
  index: number;
}

export function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
  const stackTop = `calc(5.5rem + ${index * 1.5}rem)`;
  const caseStudyHref = `/work/${project.slug}`;

  // Sanitize metrics to ensure no raw TODO notes leak into production UI
  const displayMetrics = (project.metrics || [])
    .map((m) => m.replace(/\s*\/\/.*$/, "").trim())
    .filter(Boolean);

  const hasLiveLink = Boolean(project.links.live);
  const hasRepoLink = Boolean(project.links.repo);

  return (
    <article
      style={{
        ["--stack-top" as string]: stackTop,
        zIndex: index + 10,
      }}
      className="relative md:sticky md:top-[var(--stack-top)] bg-surface/95 backdrop-blur-md border border-hairline rounded-xl overflow-hidden shadow-lg transition-all duration-300 mb-8 md:mb-14"
      aria-labelledby={`project-${project.slug}-title`}
    >
      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Blueprint Corner Marks */}
        <span className="corner-mark corner-mark-tl" aria-hidden="true" />
        <span className="corner-mark corner-mark-tr" aria-hidden="true" />
        <span className="corner-mark corner-mark-bl" aria-hidden="true" />
        <span className="corner-mark corner-mark-br" aria-hidden="true" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Metadata & Architecture Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Index & Role Meta */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                // 0{index + 1} · {project.year}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              <span className="font-mono text-[11px] text-muted uppercase tracking-wide">
                {project.role}
              </span>
            </div>

            {/* Title */}
            <h3
              id={`project-${project.slug}-title`}
              className="font-display text-2xl sm:text-3xl lg:text-4xl text-text font-normal leading-tight"
            >
              <Link
                href={caseStudyHref}
                className="hover:text-accent transition-colors duration-200"
              >
                {project.title}
              </Link>
            </h3>

            {/* One-Line Pitch */}
            <p className="font-sans text-sm sm:text-base text-muted leading-relaxed">
              {project.pitch}
            </p>

            {/* Verified Architectural Highlights */}
            {displayMetrics.length > 0 && (
              <div className="p-3.5 bg-bg/80 border border-hairline/80 rounded-lg space-y-1.5">
                <span className="font-mono text-[10px] text-accent font-semibold uppercase tracking-wider block">
                  // VERIFIED ARCHITECTURAL HIGHLIGHTS
                </span>
                <ul className="space-y-1" role="list">
                  {displayMetrics.slice(0, 2).map((metric, mIdx) => (
                    <li
                      key={mIdx}
                      className="font-mono text-xs text-text flex items-start gap-2"
                    >
                      <span className="text-accent shrink-0 select-none">→</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stack Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Technologies used">
              {project.stack.map((tech) => (
                <Tag key={tech} variant="outline" size="sm">
                  {tech}
                </Tag>
              ))}
            </div>

            {/* Action Buttons: Strict Labeling Matching Real Destinations */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={caseStudyHref}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium bg-accent text-white hover:bg-accent/90 active:scale-[0.98] transition-all shadow-sm"
              >
                <span>Case study</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              {hasLiveLink && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium border border-hairline bg-surface/50 text-text hover:border-accent hover:text-accent active:scale-[0.98] transition-all"
                >
                  <span>Live site</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}

              {hasRepoLink && !hasLiveLink && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium border border-hairline bg-surface/50 text-text hover:border-accent hover:text-accent active:scale-[0.98] transition-all"
                >
                  <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>View repo</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Blueprint Framed Preview (5 cols) */}
          <div className="lg:col-span-5">
            <Link
              href={caseStudyHref}
              tabIndex={-1}
              aria-hidden="true"
              className="group block relative rounded-lg border border-hairline bg-bg overflow-hidden aspect-[16/10] shadow-inner"
            >
              <Image
                src={project.coverImage}
                alt={`${project.title} architectural overview`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority={index === 0}
                className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-muted">
                <span className="text-text/70">// BLUEPRINT SPEC</span>
                <span className="text-accent font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  EXPLORE ARCHITECTURE →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FeaturedProjectCard;
