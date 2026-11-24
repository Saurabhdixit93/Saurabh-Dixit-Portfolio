import React from "react";
import Tag from "@/components/primitives/Tag";
import { GitExperienceItem } from "./experienceGitData";
import { formatExperiencePeriod } from "./dateUtils";
import { HighlightMetrics } from "./highlightMetrics";

export interface GitCommitCardProps {
  item: GitExperienceItem;
  isProduction?: boolean;
  className?: string;
}

export const GitCommitCard: React.FC<GitCommitCardProps> = ({
  item,
  isProduction = process.env.NODE_ENV === "production",
  className = "",
}) => {
  const formattedDate = formatExperiencePeriod(item.period, isProduction);

  return (
    <article
      className={`relative bg-surface/80 backdrop-blur-md border border-hairline p-5 sm:p-6 transition-all duration-200 hover:border-accent/60 ${
        item.git.isLive ? "border-l-2 border-l-emerald-400" : ""
      } ${className}`}
      aria-label={`${item.role} at ${item.company}`}
    >
      {/* Blueprint Corner Accents */}
      <span className="corner-mark corner-mark-tl" aria-hidden="true" />
      <span className="corner-mark corner-mark-br" aria-hidden="true" />

      {/* Header Bar: Git Hash + Branch + Status + Period */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-hairline/70">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-muted bg-bg/80 px-2 py-0.5 border border-hairline rounded-sm">
            commit <span className="text-accent2 font-semibold">{item.git.commitHash}</span>
          </span>

          <Tag variant="default" size="sm" className="font-mono">
            {item.git.branch}
          </Tag>

          {item.git.isLive && (
            <Tag variant="secondary" size="sm" indicator="green" className="font-mono">
              LIVE
            </Tag>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-text bg-surface px-2 py-0.5 border border-hairline">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Role Title & Company Header */}
      <div className="mb-3">
        <h3 className="font-display text-xl sm:text-2xl font-normal text-text tracking-tight">
          {item.role}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-mono text-sm font-semibold text-accent">
            {item.company}
          </span>
          {item.location && (
            <>
              <span className="text-muted/60" aria-hidden="true">·</span>
              <span className="font-mono text-xs text-muted">{item.location}</span>
            </>
          )}
        </div>
      </div>

      {/* Git Commit Message Annotation */}
      <div className="mb-4 font-mono text-[11px] text-muted/80 bg-bg/60 px-3 py-1.5 border border-hairline/60 rounded-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-accent shrink-0">$ git</span>
        <span className="text-text/90 shrink-0">{item.git.commitMessage}</span>
      </div>

      {/* Impact Bullets with Highlighted Metrics */}
      {item.achievements && item.achievements.length > 0 && (
        <ul className="space-y-2 mb-4 text-xs sm:text-sm text-muted">
          {item.achievements.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span
                className="font-mono text-accent text-xs mt-0.5 select-none shrink-0"
                aria-hidden="true"
              >
                ▹
              </span>
              <span>
                <HighlightMetrics text={bullet} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Technologies Chips */}
      {item.technologies && item.technologies.length > 0 && (
        <div className="pt-3 border-t border-hairline/60 flex flex-wrap gap-1.5">
          {item.technologies.map((tech) => (
            <Tag key={tech} variant="default" size="sm" className="text-[10px]">
              {tech}
            </Tag>
          ))}
        </div>
      )}
    </article>
  );
};

export default GitCommitCard;
