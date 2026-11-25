import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, GitBranch, ShieldAlert } from "lucide-react";
import { getAllCaseStudies, getCaseStudy, getAdjacentCaseStudies } from "@/content/case-studies";
import { projects } from "@/content/projects";
import { Container } from "@/components/primitives/Container";
import { Tag } from "@/components/primitives/Tag";
import { OwnerTodoCallout } from "@/components/work/OwnerTodoCallout";

const ArchitectureDiagram = dynamic(() =>
  import("@/components/work/ArchitectureDiagram").then((mod) => mod.ArchitectureDiagram)
);

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static paths for all projects and known aliases.
 */
export async function generateStaticParams() {
  const studySlugs = getAllCaseStudies().map((study) => ({ slug: study.slug }));
  const projectSlugs = projects.map((proj) => ({ slug: proj.slug }));
  const aliasSlugs = [{ slug: "enterprise-ai-code-review-platform" }];

  const slugSet = new Set<string>();
  const allParams: Array<{ slug: string }> = [];

  [...studySlugs, ...projectSlugs, ...aliasSlugs].forEach((item) => {
    if (!slugSet.has(item.slug)) {
      slugSet.add(item.slug);
      allParams.push(item);
    }
  });

  return allParams;
}

/**
 * Dynamic metadata generator with canonical URL and OpenGraph integration.
 */
export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    return {
      title: "Case Study Not Found | Saurabh Dixit Portfolio",
      description: "The requested architectural case study was not found.",
    };
  }

  const title = `${study.title} | Saurabh Dixit Systems Blueprint`;
  const description = study.pitch || study.subtitle;
  const canonicalUrl = `https://www.saurabhdixit93.site/work/${study.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: `/work/${study.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${study.title} Architecture Blueprint`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/work/${study.slug}/opengraph-image`],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const { prev, next } = getAdjacentCaseStudies(caseStudy.slug);

  const hasLive = Boolean(caseStudy.links?.live);
  const hasRepo = Boolean(caseStudy.links?.repo);

  // Normalize constraints
  const constraintItems = Array.isArray(caseStudy.constraints)
    ? caseStudy.constraints
    : caseStudy.constraints?.items || [];
  const constraintTodo = Array.isArray(caseStudy.constraints)
    ? undefined
    : caseStudy.constraints?.ownerTodo;

  // Normalize stack
  const stackItems = Array.isArray(caseStudy.stack)
    ? caseStudy.stack.map((item) => (typeof item === "string" ? item : item.name))
    : [];

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <article className="min-h-screen bg-bg text-text pt-28 pb-24 sm:pt-32 sm:pb-28 relative overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />

      <Container size="default" className="relative z-10 px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← /work · Back to Selected Work</span>
          </Link>
        </nav>

        {/* Hero Section */}
        <header className="p-6 sm:p-8 lg:p-10 rounded-xl border border-hairline bg-surface/30 backdrop-blur-sm mb-12">
          {/* Eyebrow */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
              // ARCHITECTURAL CASE STUDY · {caseStudy.year}
            </span>
            {caseStudy.timeline && (
              <>
                <span className="text-hairline">|</span>
                <span className="font-mono text-xs text-muted uppercase">
                  {caseStudy.timeline}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text font-normal leading-[1.1] mb-6">
            {caseStudy.title}
          </h1>

          {/* Subtitle / Pitch */}
          <p className="font-sans text-base sm:text-lg md:text-xl text-muted leading-relaxed max-w-4xl mb-8">
            {caseStudy.subtitle}
          </p>

          {/* Meta & Destination-Strict CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-hairline/60 items-center">
            <div className="md:col-span-8 flex flex-wrap items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-muted block text-[10px] uppercase">// ROLE</span>
                <span className="text-text font-semibold">{caseStudy.role}</span>
              </div>
              {caseStudy.clientOrContext && (
                <div>
                  <span className="text-muted block text-[10px] uppercase">// CONTEXT</span>
                  <span className="text-text font-semibold">{caseStudy.clientOrContext}</span>
                </div>
              )}
              <div>
                <span className="text-muted block text-[10px] uppercase">// STATUS</span>
                <span className="text-accent2 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse motion-reduce:animate-none" />
                  PRODUCTION CASE STUDY
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-wrap items-center md:justify-end gap-3">
              {hasLive && (
                <a
                  href={caseStudy.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium bg-accent text-[var(--accent-contrast)] hover:bg-accent/90 transition-colors shadow-sm"
                >
                  <span>Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {hasRepo && (
                <a
                  href={caseStudy.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium border border-hairline bg-surface/50 text-text hover:border-accent hover:text-accent transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Verified Impact Metrics Strip */}
        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
          <section className="mb-14" aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="sr-only">
              Verified Architectural Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {caseStudy.metrics.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="relative p-6 sm:p-7 rounded-xl border border-hairline bg-surface/80 backdrop-blur-sm"
                >
                  <span className="corner-mark corner-mark-tl opacity-60" aria-hidden="true" />
                  <span className="corner-mark corner-mark-br opacity-60" aria-hidden="true" />
                  <span className="font-mono text-[10px] text-accent uppercase tracking-wider block mb-1.5">
                    // {m.label}
                  </span>
                  <div className="font-display text-2xl sm:text-3xl text-text font-normal mb-1.5">
                    {m.value}
                  </div>
                  {m.context && (
                    <p className="font-mono text-xs text-muted leading-relaxed">
                      {m.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="space-y-12 w-full">
          {/* Section 1: Problem Statement */}
          <section aria-labelledby="problem-heading" className="p-6 sm:p-8 rounded-xl border border-hairline bg-surface/40 backdrop-blur-sm space-y-5">
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
              // 01 · SYSTEM CONTEXT & PROBLEM
            </span>
            <h2 id="problem-heading" className="font-display text-2xl sm:text-3xl text-text font-normal">
              {caseStudy.problem.headline || "The Engineering Challenge"}
            </h2>
            <p className="font-sans text-base text-muted leading-relaxed">
              {caseStudy.problem.summary}
            </p>
            {caseStudy.problem.painPoints && caseStudy.problem.painPoints.length > 0 && (
              <div className="p-5 sm:p-6 rounded-lg border border-hairline bg-surface/70 space-y-3 mt-4">
                <span className="font-mono text-xs text-text font-semibold uppercase block">
                  Core Architectural Bottlenecks:
                </span>
                <ul className="list-disc pl-5 space-y-2 font-mono text-xs text-muted">
                  {caseStudy.problem.painPoints.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
            <OwnerTodoCallout todo={caseStudy.problem.ownerTodo} />
          </section>

          {/* Section 2: Architectural Constraints */}
          <section aria-labelledby="constraints-heading" className="p-6 sm:p-8 rounded-xl border border-hairline bg-surface/40 backdrop-blur-sm space-y-5">
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
              // 02 · ARCHITECTURAL CONSTRAINTS
            </span>
            <h2 id="constraints-heading" className="font-display text-2xl sm:text-3xl text-text font-normal">
              Non-Negotiable System Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {constraintItems.map((cItem, cIdx) => (
                <div
                  key={cIdx}
                  className="p-5 rounded-lg border border-hairline bg-surface/60 font-mono text-xs text-muted leading-relaxed flex items-start gap-3"
                >
                  <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{cItem}</span>
                </div>
              ))}
            </div>
            <OwnerTodoCallout todo={constraintTodo} />
          </section>

          {/* Section 3: Role & Scope */}
          {caseStudy.roleResponsibilities && (
            <section aria-labelledby="role-heading" className="p-6 sm:p-8 rounded-xl border border-hairline bg-surface/40 backdrop-blur-sm space-y-5">
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
                // 03 · ROLE & RESPONSIBILITIES
              </span>
              <h2 id="role-heading" className="font-display text-2xl sm:text-3xl text-text font-normal">
                Architectural Leadership & Implementation
              </h2>
              <p className="font-sans text-base text-muted leading-relaxed">
                {caseStudy.roleResponsibilities.summary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {caseStudy.roleResponsibilities.responsibilities.map((resp, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 sm:p-5 rounded-lg border border-hairline/80 bg-surface/50 font-mono text-xs text-text flex items-start gap-3"
                  >
                    <span className="text-accent shrink-0">→</span>
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
              <OwnerTodoCallout todo={caseStudy.roleResponsibilities.ownerTodo} />
            </section>
          )}

          {/* Section 4: Architecture Diagram */}
          <section aria-labelledby="architecture-heading" className="p-6 sm:p-8 rounded-xl border border-hairline bg-surface/40 backdrop-blur-sm space-y-5">
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
              // 04 · SYSTEM TOPOLOGY & SIGNAL FLOW
            </span>
            <h2 id="architecture-heading" className="font-display text-2xl sm:text-3xl text-text font-normal">
              Interactive Topology Architecture
            </h2>
            {caseStudy.architecture.summary && (
              <p className="font-sans text-base text-muted leading-relaxed">
                {caseStudy.architecture.summary}
              </p>
            )}
            <div className="pt-2">
              <ArchitectureDiagram
                nodes={caseStudy.architecture.nodes}
                edges={caseStudy.architecture.edges}
                title={`${caseStudy.title} System Topology`}
              />
            </div>
          </section>

          {/* Section 5: Key Decisions & Trade-offs */}
          {caseStudy.decisions && caseStudy.decisions.length > 0 && (
            <section aria-labelledby="decisions-heading" className="p-6 sm:p-8 rounded-xl border border-hairline bg-surface/40 backdrop-blur-sm space-y-6">
              <div>
                <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
                  // 05 · KEY DECISIONS & TRADE-OFFS
                </span>
                <h2 id="decisions-heading" className="font-display text-2xl sm:text-3xl text-text font-normal mt-1">
                  Architectural Decision Records (ADRs)
                </h2>
              </div>

              <div className="space-y-5">
                {caseStudy.decisions.map((decision, dIdx) => (
                  <div
                    key={dIdx}
                    className="relative p-6 sm:p-7 rounded-xl border border-hairline bg-surface/80 backdrop-blur-sm space-y-4"
                  >
                    <span className="corner-mark corner-mark-tl opacity-60" aria-hidden="true" />
                    <span className="corner-mark corner-mark-tr opacity-60" aria-hidden="true" />

                    <div className="flex items-center gap-2 font-mono text-xs text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>ADR 0{dIdx + 1} // {decision.title}</span>
                    </div>

                    {decision.context && (
                      <p className="font-sans text-sm text-muted">
                        <strong className="text-text font-mono text-xs uppercase block mb-1">
                          Context:
                        </strong>
                        {decision.context}
                      </p>
                    )}

                    <div className="p-4 sm:p-5 bg-bg/90 border border-hairline/80 rounded-lg font-mono text-xs text-text space-y-1.5">
                      <span className="text-accent text-[10px] uppercase font-semibold block">
                        // DECISION / CHOICE
                      </span>
                      <p>{decision.choice || decision.decision}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                      {decision.considered && (
                        <div className="p-4 rounded-lg border border-hairline/60 bg-surface/40">
                          <span className="text-muted text-[10px] uppercase block mb-1">
                            Alternative Considered:
                          </span>
                          <span className="text-muted">{decision.considered}</span>
                        </div>
                      )}
                      <div className="p-4 rounded-lg border border-accent/30 bg-accent/10">
                        <span className="text-accent text-[10px] uppercase block mb-1">
                          Trade-off Analysis:
                        </span>
                        <span className="text-text">{decision.tradeOff}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 6: Results & Verification */}
          <section aria-labelledby="results-heading" className="p-6 sm:p-8 rounded-xl border border-hairline bg-surface/40 backdrop-blur-sm space-y-5">
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
              // 06 · QUANTIFIABLE RESULTS & IMPACT
            </span>
            <h2 id="results-heading" className="font-display text-2xl sm:text-3xl text-text font-normal">
              Engineering Outcomes & Verification
            </h2>
            <p className="font-sans text-base text-muted leading-relaxed">
              {caseStudy.results.summary}
            </p>
            {caseStudy.results.outcomes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {caseStudy.results.outcomes.map((outcome, oIdx) => (
                  <div
                    key={oIdx}
                    className="p-5 rounded-lg border border-hairline bg-surface/60 font-mono text-xs text-text flex items-start gap-3"
                  >
                    <span className="text-accent2 font-bold shrink-0">✓</span>
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            )}
            <OwnerTodoCallout todo={caseStudy.results.ownerTodo} />
          </section>

          {/* Section 7: Technology Stack Breakdown */}
          <section aria-labelledby="stack-heading" className="p-6 sm:p-8 rounded-xl border border-hairline bg-surface/40 backdrop-blur-sm space-y-5">
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider block">
              // 07 · SYSTEM DEPENDENCIES & TECHNOLOGIES
            </span>
            <h2 id="stack-heading" className="font-display text-2xl sm:text-3xl text-text font-normal">
              Technical Stack Inventory
            </h2>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {stackItems.map((tech) => (
                <Tag key={tech} variant="default" size="md">
                  {tech}
                </Tag>
              ))}
            </div>
          </section>
        </div>

        {/* Circular Next / Prev Project Navigation Bar */}
        <nav
          aria-label="Adjacent case studies"
          className="mt-20 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <Link
            href={`/work/${prev.slug}`}
            className="group flex flex-col items-start gap-1 p-4 rounded-lg border border-hairline/60 bg-surface/40 hover:border-accent hover:bg-surface transition-all w-full sm:w-auto"
          >
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider flex items-center gap-1 group-hover:text-accent">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              PREVIOUS CASE STUDY
            </span>
            <span className="font-display text-lg text-text group-hover:text-accent transition-colors">
              {prev.title}
            </span>
          </Link>

          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col items-end gap-1 p-4 rounded-lg border border-hairline/60 bg-surface/40 hover:border-accent hover:bg-surface transition-all w-full sm:w-auto text-right"
          >
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider flex items-center gap-1 group-hover:text-accent">
              NEXT CASE STUDY
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="font-display text-lg text-text group-hover:text-accent transition-colors">
              {next.title}
            </span>
          </Link>
        </nav>
      </Container>
      </article>
    </main>
  );
}
