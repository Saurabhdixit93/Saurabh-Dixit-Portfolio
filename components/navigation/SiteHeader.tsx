"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Menu, X, Command, FileText, ArrowUpRight } from "lucide-react";
import { useCommandPalette } from "./CommandPaletteContext";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { ISTClock } from "./ISTClock";
import { profile } from "@/content";
import { trackEvent } from "@/lib/analytics";

export interface NavLinkItem {
  href: string;
  label: string;
  id: string;
  subtitle?: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { href: "#about", label: "About", id: "about", subtitle: "Background & Principles" },
  { href: "#work", label: "Work", id: "work", subtitle: "Architecture Case Studies" },
  { href: "#stack", label: "Stack", id: "stack", subtitle: "5-Tier Layered Tech Map" },
  { href: "#experience", label: "Experience", id: "experience", subtitle: "Sensegrass & Timeline" },
  { href: "#process", label: "Process", id: "process", subtitle: "4-Stage Delivery Lifecycle" },
  { href: "#contact", label: "Contact", id: "contact", subtitle: "Inquiries & Advisory" },
];

/**
 * Clean SVG SD Monogram in blueprint hairline style.
 */
export function SDMonogram({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Blueprint Grid Crosshairs */}
      <circle
        cx="18"
        cy="18"
        r="16.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        className="text-line"
      />
      <path
        d="M18 2V5M18 31V34M2 18H5M31 18H34"
        stroke="currentColor"
        strokeWidth="1"
        className="text-accent"
      />

      {/* Hairline Outer Box */}
      <rect
        x="5.5"
        y="5.5"
        width="25"
        height="25"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-line group-hover:text-accent transition-colors"
      />

      {/* Precision S Path */}
      <path
        d="M16 11.5H11.5C10.5 11.5 9.5 12.3 9.5 13.5V14.5C9.5 15.7 10.5 16.5 11.5 16.5H14C15.2 16.5 16 17.3 16 18.5V20C16 21.2 15.2 22 14 22H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text group-hover:text-accent transition-colors"
      />

      {/* Precision D Path */}
      <path
        d="M20 11.5V22.5M20 11.5H23C25.5 11.5 27 13.5 27 17C27 20.5 25.5 22.5 23 22.5H20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
      />

      {/* Corner Registration Dots */}
      <circle cx="20" cy="11.5" r="0.8" fill="currentColor" className="text-accent" />
      <circle cx="20" cy="22.5" r="0.8" fill="currentColor" className="text-accent" />
    </svg>
  );
}

export interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className = "" }: SiteHeaderProps) {
  const { open: openCommandPalette } = useCommandPalette();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [activeSection, setActiveSection] = React.useState<string>("about");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [isMac, setIsMac] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);

  const mobileNavRef = React.useRef<HTMLDivElement | null>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  // Track active section via IntersectionObserver on homepage
  React.useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = NAV_LINKS.map((link) => link.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Lock background body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isAvailable = profile.availability.status === "available";

  const overlayVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" } },
  };

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: shouldReduceMotion ? 0 : 0.03,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -6, transition: { duration: 0.1 } },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-md border-b border-hairline transition-colors duration-200 ${className}`}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Monogram & Name */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:outline-accent rounded-sm"
            aria-label="Saurabh Dixit - Systems Architecture Portfolio"
          >
            <SDMonogram className="w-7 h-7 sm:w-8 sm:h-8" />
            <div className="flex flex-col">
              <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-text group-hover:text-accent transition-colors">
                SAURABH DIXIT
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-muted tracking-widest uppercase hidden sm:inline">
                VP ENG · AI SYSTEMS
              </span>
            </div>
          </Link>

          {/* Open to Opportunities Live Status Dot (Only on ultra-wide desktop to prevent clutter) */}
          {isAvailable && (
            <Link
              href="#contact"
              onClick={() => handleNavClick("#contact")}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-hairline bg-surface/70 text-[10px] font-mono text-muted hover:border-accent hover:text-text transition-colors"
              title={profile.availability.headline || "Open to high-impact opportunities"}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="tracking-wide">{profile.availability.label}</span>
            </Link>
          )}
        </div>

        {/* Center: Desktop Navigation Links (Compact & Crisp) */}
        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 font-mono text-xs"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent("cta_click", {
                    target: link.label,
                    location: "header_nav",
                    href: link.href,
                  });
                  handleNavClick(link.href);
                }}
                className={`relative px-2 py-1 rounded-sm transition-colors duration-150 uppercase tracking-wider text-[11px] xl:text-xs ${
                  isActive
                    ? "text-accent font-medium bg-accent/10"
                    : "text-muted hover:text-text hover:bg-surface/50"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1.5 right-1.5 h-[2px] bg-accent rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions (Commands ⌘K, Theme Toggle, Resume, Mobile Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* ⌘K Command Palette Button (Compact) */}
          <button
            type="button"
            onClick={() => {
              trackEvent("palette_open", { source: "button" });
              openCommandPalette();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-hairline rounded-sm bg-surface text-muted hover:text-accent hover:border-accent transition-colors shadow-sm focus-visible:outline-accent"
            title="Open Command Palette (⌘K / Ctrl+K)"
            aria-label="Open command palette"
          >
            <Command className="w-3.5 h-3.5 text-accent" />
            <span className="font-semibold">{isMac ? "⌘K" : "Ctrl+K"}</span>
          </button>

          {/* Theme Toggle (Desktop) */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Resume Download Button */}
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            download="Saurabh_Dixit_Resume.pdf"
            onClick={() => {
              trackEvent("resume_download", { source: "header" });
            }}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider border border-hairline rounded-sm bg-surface text-text hover:border-accent hover:text-accent transition-colors shadow-sm focus-visible:outline-accent"
            title="Download Saurabh Dixit's Resume (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>RESUME</span>
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-sm border border-hairline bg-surface text-text hover:text-accent hover:border-accent transition-colors focus-visible:outline-accent cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-accent" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Overlay Menu (Solid Backdrop via React Portal to prevent CSS containing block truncation) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              ref={mobileNavRef}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 top-14 sm:top-16 z-[9999] h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] w-full bg-[#0B0D10] dark:bg-[#0B0D10] paper:bg-[#F3F0E8] text-text border-t border-hairline flex flex-col justify-between p-6 sm:p-8 overflow-y-auto lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              {/* Top Navigation Links Grid */}
              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-2.5 py-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-hairline/60">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                    // NAVIGATION NODES
                  </span>
                  <span className="font-mono text-[10px] text-accent">
                    {NAV_LINKS.length} SECTIONS
                  </span>
                </div>

                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.div key={link.id} variants={itemVariants}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-sm border transition-all ${
                          isActive
                            ? "border-accent bg-accent/15 text-accent font-semibold shadow-sm"
                            : "border-hairline bg-surface/90 text-text hover:border-accent hover:bg-surface"
                        }`}
                      >
                        <div>
                          <div className="font-mono text-sm tracking-wider uppercase font-medium">
                            {link.label}
                          </div>
                          {link.subtitle && (
                            <div className="text-xs text-muted mt-0.5">
                              {link.subtitle}
                            </div>
                          )}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-accent shrink-0" />
                      </a>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Bottom Actions inside Mobile Drawer */}
              <div className="pt-6 border-t border-hairline space-y-4">
                {/* Opportunities Status Pill */}
                {isAvailable && (
                  <div className="flex items-center gap-2.5 p-3 rounded-sm border border-hairline bg-surface/80 text-xs font-mono text-muted">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {profile.availability.label}
                    </span>
                  </div>
                )}

                {/* Action Buttons: Theme Toggle & Resume */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center p-2.5 rounded-sm border border-hairline bg-surface/80">
                    <ThemeToggle />
                  </div>

                  <a
                    href={profile.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Saurabh_Dixit_Resume.pdf"
                    onClick={() => {
                      trackEvent("resume_download", { source: "header_mobile" });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-2.5 font-mono text-xs uppercase tracking-wider border border-hairline rounded-sm bg-surface/80 text-text hover:border-accent hover:text-accent transition-colors"
                  >
                    <FileText className="w-4 h-4 text-accent" />
                    <span>RESUME PDF</span>
                  </a>
                </div>

                {/* Command Palette Mobile Action */}
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("palette_open", { source: "button" });
                    setMobileMenuOpen(false);
                    openCommandPalette();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 font-mono text-xs uppercase tracking-wider border border-hairline rounded-sm bg-surface text-text hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                  <Command className="w-4 h-4 text-accent" />
                  <span>OPEN COMMAND PALETTE (⌘K)</span>
                </button>

                {/* Footer Row: Live IST Clock */}
                <div className="flex items-center justify-between pt-2 text-xs font-mono text-muted">
                  <span>LOCAL TIME (INDIA):</span>
                  <ISTClock showSeconds showLabel />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

export default SiteHeader;
