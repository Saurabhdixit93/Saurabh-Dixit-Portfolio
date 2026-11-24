"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Menu, X, Command, FileText, ArrowUpRight, Sparkles } from "lucide-react";
import { useCommandPalette } from "./CommandPaletteContext";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { ISTClock } from "./ISTClock";
import { ScrollLifecycleBadge } from "./ScrollHUD";
import { profile } from "@/content";

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
  { href: "#process", label: "Process", id: "process", subtitle: "Discover, Architect, Ship" },
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

  const [activeSection, setActiveSection] = React.useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isMac, setIsMac] = React.useState(true);

  const menuButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const mobileNavRef = React.useRef<HTMLDivElement | null>(null);

  // Platform detection for ⌘K vs Ctrl+K shortcut label
  React.useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || "");
      setIsMac(isApple);
    }
  }, []);

  // Active section highlighting via IntersectionObserver
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionIds = NAV_LINKS.map((link) => link.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.2, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Mobile menu focus trap and ESC key handler
  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    // Programmatically transfer initial focus to the first interactive element inside drawer
    const focusTimer = setTimeout(() => {
      if (mobileNavRef.current) {
        const focusableElements = mobileNavRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && mobileNavRef.current) {
        const focusableElements = mobileNavRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Ensure focus stays trapped inside drawer even if focus somehow started outside
        const isFocusInside = mobileNavRef.current.contains(document.activeElement);
        if (!isFocusInside) {
          e.preventDefault();
          if (e.shiftKey) {
            lastElement.focus();
          } else {
            firstElement.focus();
          }
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
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

  // Framer motion variants for mobile overlay
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -14 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -8, transition: { duration: 0.1 } },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-bg/85 backdrop-blur-md border-b border-hairline transition-colors duration-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Monogram & Status */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
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
              <span className="font-mono text-[9px] sm:text-[10px] text-muted tracking-widest uppercase hidden md:inline">
                VP ENG · AI SYSTEMS
              </span>
            </div>
          </Link>

          {/* Open to Opportunities Live Status Dot */}
          {isAvailable && (
            <Link
              href="#contact"
              onClick={() => handleNavClick("#contact")}
              className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-hairline bg-surface/70 text-[10px] font-mono text-muted hover:border-accent hover:text-text transition-colors"
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

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 font-mono text-xs"
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
                  handleNavClick(link.href);
                }}
                className={`relative px-2.5 py-1.5 rounded-sm transition-colors duration-150 uppercase tracking-wider ${
                  isActive
                    ? "text-accent font-medium bg-accent/10"
                    : "text-muted hover:text-text hover:bg-surface/50"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions (Telemetry Slot, IST Clock, ⌘K Hint, Theme Toggle, Resume, Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Telemetry: Request Lifecycle Stage Badge */}
          <ScrollLifecycleBadge className="hidden xl:inline-flex" />

          {/* Live IST Clock */}
          <div className="hidden xl:block pr-1 border-r border-hairline">
            <ISTClock showSeconds={false} showLabel={false} />
          </div>

          {/* ⌘K Command Palette Button */}
          <button
            type="button"
            onClick={openCommandPalette}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-hairline rounded-sm bg-surface text-muted hover:text-accent hover:border-accent transition-colors shadow-sm focus-visible:outline-accent"
            title="Open Command Palette (⌘K / Ctrl+K)"
            aria-label="Open command palette"
          >
            <Command className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline font-semibold">{isMac ? "⌘K" : "Ctrl+K"}</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Resume Download / View Button */}
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-hairline rounded-sm bg-surface text-text hover:border-accent hover:text-accent transition-colors shadow-sm focus-visible:outline-accent"
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
            className="md:hidden inline-flex items-center justify-center p-2 rounded-sm border border-hairline bg-surface text-text hover:text-accent hover:border-accent transition-colors focus-visible:outline-accent"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-accent" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            ref={mobileNavRef}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 top-14 sm:top-16 bottom-0 z-50 bg-bg/95 backdrop-blur-xl border-t border-hairline flex flex-col justify-between p-6 overflow-y-auto md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Top Navigation Links */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-2 py-4"
            >
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">
                // NAVIGATION
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
                      className={`flex items-center justify-between p-3 rounded-sm border transition-colors ${
                        isActive
                          ? "border-accent/40 bg-accent/10 text-accent font-medium"
                          : "border-hairline bg-surface text-text hover:border-accent/60"
                      }`}
                    >
                      <div>
                        <div className="font-mono text-sm tracking-wide uppercase">
                          {link.label}
                        </div>
                        {link.subtitle && (
                          <div className="text-xs text-muted mt-0.5">
                            {link.subtitle}
                          </div>
                        )}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted shrink-0" />
                    </a>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Bottom Actions & Telemetry inside Mobile Menu */}
            <div className="pt-6 border-t border-hairline space-y-4">
              {/* Opportunities Status Pill */}
              {isAvailable && (
                <div className="flex items-center gap-2 p-2.5 rounded-sm border border-hairline bg-surface/50 text-xs font-mono text-muted">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{profile.availability.label}</span>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCommandPalette();
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 font-mono text-xs uppercase tracking-wider border border-hairline rounded-sm bg-surface text-text hover:border-accent hover:text-accent transition-colors"
                >
                  <Command className="w-3.5 h-3.5 text-accent" />
                  <span>COMMANDS (⌘K)</span>
                </button>

                <a
                  href={profile.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-2.5 font-mono text-xs uppercase tracking-wider border border-hairline rounded-sm bg-surface text-text hover:border-accent hover:text-accent transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  <span>RESUME PDF</span>
                </a>
              </div>

              {/* Footer Row: Live IST Clock & Lifecycle Telemetry */}
              <div className="flex items-center justify-between pt-2 text-xs font-mono text-muted">
                <ISTClock showSeconds showLabel />
                <ScrollLifecycleBadge />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default SiteHeader;
