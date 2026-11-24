import React from "react";
import { education } from "@/content/experience";

export interface EducationFootnoteProps {
  className?: string;
}

export const EducationFootnote: React.FC<EducationFootnoteProps> = ({
  className = "",
}) => {
  const primaryEdu = education[0];
  if (!primaryEdu) return null;

  const certifications = [
    { title: "Micro1 Full Stack", date: "Nov 2025" },
    { title: "Pro5.ai Software Engineer", date: "Jul 2024" },
    { title: "Coding Ninjas Full Stack", date: "Jul 2023" },
  ];

  return (
    <footer
      className={`mt-6 pt-4 border-t border-hairline/70 flex flex-col gap-3 text-xs ${className}`}
      aria-label="Academic foundation and verified certifications"
    >
      {/* Primary Degree Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-accent uppercase tracking-wider text-[11px] font-semibold">
            // ACADEMIC FOUNDATION
          </span>
          <span className="text-muted/50" aria-hidden="true">·</span>
          <span className="font-mono text-text font-medium">
            {primaryEdu.degree}
          </span>
          <span className="text-muted/50" aria-hidden="true">·</span>
          <span className="text-muted font-sans">{primaryEdu.institution}</span>
        </div>

        <div className="font-mono text-[11px] text-muted shrink-0">
          {primaryEdu.duration}
        </div>
      </div>

      {/* Certifications Row (from Verified Resume) */}
      <div className="flex items-center gap-2 flex-wrap pt-1 font-mono text-[11px] text-muted">
        <span className="text-accent2 uppercase tracking-wider font-semibold">
          // CERTIFICATIONS
        </span>
        <span className="text-muted/50" aria-hidden="true">·</span>
        {certifications.map((cert, idx) => (
          <React.Fragment key={cert.title}>
            <span className="text-text/80">
              {cert.title} <span className="text-muted/60">({cert.date})</span>
            </span>
            {idx < certifications.length - 1 && (
              <span className="text-muted/40" aria-hidden="true">·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </footer>
  );
};

export default EducationFootnote;
