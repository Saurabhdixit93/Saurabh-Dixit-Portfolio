import * as React from "react";
import { Container, ContainerSize } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  annotation?: React.ReactNode;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  action?: React.ReactNode;
  containerSize?: ContainerSize;
  withGrid?: boolean;
  withHairline?: boolean;
  withCornerMarks?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      id,
      annotation,
      heading,
      subheading,
      action,
      containerSize = "default",
      withGrid = false,
      withHairline = false,
      withCornerMarks = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const headingId = id ? `${id}-heading` : undefined;

    return (
      <section
        ref={ref}
        id={id}
        aria-labelledby={heading ? headingId : undefined}
        className={`relative py-16 md:py-24 ${
          withHairline ? "border-b border-hairline" : ""
        } ${withGrid ? "bg-blueprint-grid" : ""} ${className}`}
        {...props}
      >
        <Container size={containerSize}>
          <div className="relative">
            {withCornerMarks && (
              <>
                <span className="corner-mark corner-mark-tl" aria-hidden="true" />
                <span className="corner-mark corner-mark-tr" aria-hidden="true" />
                <span className="corner-mark corner-mark-bl" aria-hidden="true" />
                <span className="corner-mark corner-mark-br" aria-hidden="true" />
              </>
            )}

            {(annotation || heading || subheading || action) && (
              <header className="mb-10 md:mb-14">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-hairline">
                  <div className="space-y-2">
                    {annotation && (
                      <div className="annotation">
                        {typeof annotation === "string" ? (
                          <span>{annotation}</span>
                        ) : (
                          annotation
                        )}
                      </div>
                    )}

                    {heading && (
                      <h2
                        id={headingId}
                        className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-text"
                      >
                        {heading}
                      </h2>
                    )}

                    {subheading && (
                      <p className="text-sm md:text-base text-muted max-w-2xl leading-relaxed">
                        {subheading}
                      </p>
                    )}
                  </div>

                  {action && <div className="flex items-center gap-3">{action}</div>}
                </div>
              </header>
            )}

            {children}
          </div>
        </Container>
      </section>
    );
  }
);

Section.displayName = "Section";

export default Section;

