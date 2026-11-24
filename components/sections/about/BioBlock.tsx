"use client";

import * as React from "react";
import { profile } from "@/content/profile";
import { Tag } from "@/components/primitives/Tag";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";

export interface BioBlockProps {
  className?: string;
}

export const BioBlock: React.FC<BioBlockProps> = ({ className = "" }) => {
  const github = profile.socials.find((s) => s.platform === "github");
  const linkedin = profile.socials.find((s) => s.platform === "linkedin");
  const email = profile.socials.find((s) => s.platform === "email");

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Eyebrow & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="annotation text-accent font-semibold flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>// THE SYSTEMS ARCHITECT</span>
        </div>

        {/* Origin / Timezone Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-hairline bg-surface/60 font-mono text-xs text-muted">
          <MapPin className="w-3 h-3 text-accent" />
          <span>{profile.location} ({profile.utcOffset})</span>
        </div>
      </div>

      {/* Main Bio Narrative */}
      <div className="space-y-3">
        <p className="font-sans text-base sm:text-lg text-text leading-relaxed">
          {profile.shortBio}
        </p>
      </div>

      {/* Availability Status */}
      {profile.availability && (
        <div className="p-3.5 rounded border border-hairline bg-surface/40 flex items-start gap-3">
          <span
            className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] mt-1.5 shrink-0"
            aria-hidden="true"
          />
          <div className="space-y-0.5 text-xs">
            <span className="font-mono text-text font-semibold uppercase tracking-wider block">
              {profile.availability.label}
            </span>
            <span className="text-muted leading-relaxed block">
              {profile.availability.headline}
            </span>
          </div>
        </div>
      )}

      {/* Verified Connect Links */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {github && (
          <a
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-hairline bg-surface/70 hover:border-accent hover:text-accent font-mono text-xs text-muted transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-hairline bg-surface/70 hover:border-accent hover:text-accent font-mono text-xs text-muted transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        )}
        {email && (
          <a
            href={email.url}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-hairline bg-surface/70 hover:border-accent hover:text-accent font-mono text-xs text-muted transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};

export default BioBlock;
