"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import { engineeringNotes as defaultNotes, notesContent } from "@/content/notes";
import { isNotesEnabled } from "@/content/flags";
import { EngineeringNote } from "@/content/types";

export interface NotesProps {
  id?: string;
  className?: string;
  enabled?: boolean;
  items?: EngineeringNote[];
}

export const Notes: React.FC<NotesProps> = ({
  id = "notes",
  className = "",
  enabled,
  items = defaultNotes,
}) => {
  // Feature flag check: default is disabled unless enabled prop or env flag is true
  if (!isNotesEnabled(enabled) || !items || items.length === 0) {
    return null;
  }

  return (
    <Section
      id={id}
      annotation={notesContent.annotation}
      heading={
        <>
          {notesContent.heading} ·{" "}
          <span className="italic text-accent">Memos</span>
        </>
      }
      subheading={notesContent.subheading}
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      {/* 3-Card Engineering Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {items.map((note) => (
          <article
            key={note.id}
            tabIndex={0}
            role="article"
            aria-label={`Engineering note: ${note.title}`}
            className="group relative flex flex-col justify-between p-6 bg-surface/70 border border-hairline transition-all duration-200 hover:border-accent/50 hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            {/* Corner registration mark */}
            <div
              className="absolute top-0 right-0 p-2 font-mono text-[10px] text-muted/60 pointer-events-none select-none"
              aria-hidden="true"
            >
              +
            </div>

            <div className="space-y-3">
              {/* Category / Date & Reading Time Badge */}
              <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
                <span className="font-mono text-[11px] font-medium text-accent">
                  {note.category || (note.tags && note.tags[0]) || "Architecture"}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {note.readingTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg text-text group-hover:text-accent transition-colors leading-snug">
                {note.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-muted leading-relaxed">
                {note.summary}
              </p>
            </div>

            {/* Tags & Action Link */}
            <div className="mt-6 pt-4 border-t border-hairline/60 flex flex-col gap-3">
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5" aria-label="Tags">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] px-1.5 py-0.5 bg-bg/70 border border-hairline/60 rounded-sm text-text/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {note.link && (
                <div className="pt-1 flex items-center justify-between">
                  <a
                    href={note.link.url}
                    target={note.link.isExternal ? "_blank" : undefined}
                    rel={note.link.isExternal ? "noopener noreferrer" : undefined}
                    className="font-mono text-[11px] text-accent hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    aria-label={`${note.link.label} for ${note.title}`}
                  >
                    {note.link.label} ↗
                  </a>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default Notes;
