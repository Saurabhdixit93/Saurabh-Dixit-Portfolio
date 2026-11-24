"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, GitBranch } from "lucide-react";
import { Project } from "@/content/types";
import { Tag } from "@/components/primitives/Tag";
import { trackEvent } from "@/lib/analytics";

export interface MoreBuildsGridProps {
  projects: Project[];
  className?: string;
}

export function MoreBuildsGrid({ projects, className = "" }: MoreBuildsGridProps) {
  if (projects.length === 0) return null;

  return (
    <div className={`mt-16 pt-12 border-t border-hairline ${className}`}>
      {/* Section Sub-heading */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-accent uppercase tracking-wider">
            // SECONDARY SYSTEMS & UTILITIES
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-text font-normal">
          More Builds & Engineering Experiments
        </h3>
        <p className="font-sans text-sm text-muted mt-1 max-w-2xl">
          Focused microservices, real-time sync clients, and high-throughput streaming utilities.
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const caseStudyHref = `/work/${proj.slug}`;
          const hasLiveLink = Boolean(proj.links.live);
          const hasRepoLink = Boolean(proj.links.repo);

          return (
            <article
              key={proj.slug}
              className="relative rounded-xl border border-hairline bg-surface/90 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between hover:border-accent/60 hover:bg-surface transition-all duration-300 group shadow-sm"
              aria-labelledby={`build-${proj.slug}-title`}
            >
              {/* Corner marks */}
              <span className="corner-mark corner-mark-tl opacity-60" aria-hidden="true" />
              <span className="corner-mark corner-mark-tr opacity-60" aria-hidden="true" />
              <span className="corner-mark corner-mark-bl opacity-60" aria-hidden="true" />
              <span className="corner-mark corner-mark-br opacity-60" aria-hidden="true" />

              <div className="space-y-4">
                {/* Meta */}
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span className="text-accent uppercase tracking-wider">
                    {proj.year}
                  </span>
                  <span className="uppercase text-[11px]">{proj.role}</span>
                </div>

                {/* Title */}
                <h4
                  id={`build-${proj.slug}-title`}
                  className="font-display text-xl sm:text-2xl text-text font-normal group-hover:text-accent transition-colors"
                >
                  <Link
                    href={caseStudyHref}
                    onClick={() =>
                      trackEvent("project_open", {
                        slug: proj.slug,
                        title: proj.title,
                        linkType: "case_study",
                      })
                    }
                  >
                    {proj.title}
                  </Link>
                </h4>

                {/* Pitch */}
                <p className="font-sans text-sm text-muted leading-relaxed">
                  {proj.pitch}
                </p>

                {/* Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Tech stack">
                  {proj.stack.map((t) => (
                    <Tag key={t} variant="outline" size="sm">
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Strict Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-6 mt-4 border-t border-hairline/60">
                <Link
                  href={caseStudyHref}
                  onClick={() =>
                    trackEvent("project_open", {
                      slug: proj.slug,
                      title: proj.title,
                      linkType: "case_study",
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent hover:underline"
                >
                  <span>Case study</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>

                {hasLiveLink && (
                  <a
                    href={proj.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("project_open", {
                        slug: proj.slug,
                        title: proj.title,
                        linkType: "live",
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-muted hover:text-text"
                  >
                    <span>Live site</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}

                {hasRepoLink && !hasLiveLink && (
                  <a
                    href={proj.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("project_open", {
                        slug: proj.slug,
                        title: proj.title,
                        linkType: "repo",
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-muted hover:text-text"
                  >
                    <GitBranch className="w-3 h-3" aria-hidden="true" />
                    <span>View repo</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default MoreBuildsGrid;
