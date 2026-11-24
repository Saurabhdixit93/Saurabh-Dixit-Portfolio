"use client";

import * as React from "react";
import Container from "@/components/primitives/Container";
import { profile } from "@/content/profile";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Stack", href: "#stack" },
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "AI Workflow", href: "#ai-workflow" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="w-full border-t border-hairline bg-surface/40 mt-16 py-12 relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-hairline/60">
          {/* Brand & Positioning */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-accent px-1.5 py-0.5 border border-accent/40 bg-accent/10 rounded-sm">
                SD
              </span>
              <span className="font-display text-lg text-text font-semibold">
                Saurabh Dixit
              </span>
            </div>
            <p className="font-mono text-xs text-muted max-w-sm leading-relaxed">
              Full-Stack Engineer & VP of Engineering. Specializing in AI-integrated products, distributed workflows, and scalable systems architecture.
            </p>
          </div>

          {/* Quick Sitemap Links */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2">
              // ARCHITECTURAL SITEMAP
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
                // EXTERNAL NODES
              </span>
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <a
                  href="https://github.com/saurabhdixit93"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text/70 hover:text-accent transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/saurabh-dixit-47a82b1b3/"
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
              className="font-mono text-xs text-muted hover:text-text flex items-center gap-1.5 pt-2 transition-colors self-start cursor-pointer"
            >
              <span>↑</span> Return to top
            </button>
          </div>
        </div>

        {/* Bottom Credits & Telemetry */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted">
          <div>
            © 2022–{currentYear} Saurabh Dixit. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent/80" />
            <span>The Systems Blueprint · Built with Next.js 15 & TypeScript</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

