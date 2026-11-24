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

  return (
    <footer
      className={`mt-12 md:mt-16 pt-6 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${className}`}
      aria-label="Academic foundation footnote"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-accent uppercase tracking-wider text-[11px]">
          // ACADEMIC FOUNDATION
        </span>
        <span className="text-muted/60" aria-hidden="true">·</span>
        <span className="font-mono text-text font-medium">
          {primaryEdu.degree}
        </span>
        <span className="text-muted/60" aria-hidden="true">·</span>
        <span className="text-muted font-sans">{primaryEdu.institution}</span>
      </div>

      <div className="font-mono text-[11px] text-muted shrink-0">
        {primaryEdu.duration}
      </div>
    </footer>
  );
};

export default EducationFootnote;
