"use client";

import * as React from "react";
import Container from "@/components/primitives/Container";
import { profile } from "@/content/profile";
import { contactContent } from "@/content/contact";
import { SDMonogram } from "@/components/navigation/SiteHeader";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  const navLinks = contactContent.footer.navLinks;

  const githubUrl =
    profile.socials.find((s) => s.platform === "github")?.url ||
    "https://github.com/saurabhdixit93";
  const linkedinUrl =
    profile.socials.find((s) => s.platform === "linkedin")?.url ||
    "https://www.linkedin.com/in/saurabhdixit93";

  return (
    <footer className="w-full border-t border-hairline bg-surface/50 backdrop-blur-md mt-12 py-12 relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-hairline/60">
          {/* Brand & Positioning */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <SDMonogram className="w-8 h-8 text-text" />
              <div className="flex flex-col">
                <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-text uppercase">
                  {contactContent.footer.brandTag}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] text-muted tracking-widest uppercase">
                  {contactContent.footer.brandTitle}
                </span>
              </div>
            </div>
            <p className="font-mono text-xs text-muted max-w-sm leading-relaxed">
              {contactContent.footer.summary}
            </p>
          </div>

          {/* Quick Sitemap Links */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2">
              {contactContent.footer.sitemapHeader}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs text-text/70 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* External Links & Back to Top */}
          <div className="md:col-span-3 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2">
                {contactContent.footer.externalHeader}
              </span>
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text/70 hover:text-accent transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text/70 hover:text-accent transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-text/70 hover:text-accent transition-colors"
                >
                  {profile.email} ↗
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Return to top of page"
              className="font-mono text-xs text-muted hover:text-text flex items-center gap-1.5 pt-2 transition-colors self-start cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
              <span>↑</span> {contactContent.footer.backToTopText}
            </button>
          </div>
        </div>

        {/* Bottom Credits & Telemetry */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted">
          <div suppressHydrationWarning>
            © 2022–{currentYear} {contactContent.footer.copyrightPrefix}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent/80" />
            <span className="font-mono">{contactContent.footer.tagline}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
