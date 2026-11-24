"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Search,
  Command,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Linkedin,
  Github,
  SunMoon,
  MessageSquare,
  Compass,
  FolderGit2,
  Sliders,
  Layers,
  X,
} from "lucide-react";
import { useCommandPalette } from "./CommandPaletteContext";
import { profile, projects } from "@/content";
import { trackEvent } from "@/lib/analytics";

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Projects" | "Actions";
  keywords?: string[];
  icon: React.ReactNode;
  badge?: string;
  perform: () => void | Promise<void>;
}

/**
 * Robust fuzzy/subsequence matching algorithm.
 * Evaluates match quality based on substring matching, character sequence, and token boundaries.
 * Exported for deterministic unit testing.
 */
export function fuzzyMatch(
  pattern: string,
  target: string
): { match: boolean; score: number } {
  const p = pattern.trim().toLowerCase();
  const t = target.toLowerCase();

  if (!p) return { match: true, score: 0 };
  if (t === p) return { match: true, score: 2000 };

  // Substring match gets guaranteed highest priority over loose character subsequences
  const substringIndex = t.indexOf(p);
  if (substringIndex !== -1) {
    const isWordStart =
      substringIndex === 0 || /[\s\-_/]/.test(t[substringIndex - 1]);
    // Guaranteed score floor >= 850, with word start bonus and mild position tie-breaker
    const score =
      1000 +
      (isWordStart ? 100 : 0) -
      Math.min(150, substringIndex) +
      Math.round((p.length / t.length) * 50);
    return { match: true, score };
  }

  // Subsequence match
  let pIdx = 0;
  let score = 0;
  let consecutive = 0;

  for (let tIdx = 0; tIdx < t.length && pIdx < p.length; tIdx++) {
    if (t[tIdx] === p[pIdx]) {
      pIdx++;
      consecutive++;
      // Give higher score for consecutive matches and word starts
      const isWordStart = tIdx === 0 || /[\s\-_/]/.test(t[tIdx - 1]);
      score += 10 + consecutive * 5 + (isWordStart ? 20 : 0);
    } else {
      consecutive = 0;
    }
  }

  // Subsequence scores capped at 500 so loose matches never outrank exact substrings
  return {
    match: pIdx === p.length,
    score: pIdx === p.length ? Math.min(500, score) : 0,
  };
}

/**
 * Filter and rank commands based on query string across title, subtitle, category, and keywords.
 * Exported for unit testing.
 */
export function filterCommands(
  commands: CommandItem[],
  query: string
): CommandItem[] {
  if (!query.trim()) return commands;

  const results: { item: CommandItem; maxScore: number }[] = [];

  for (const cmd of commands) {
    const titleMatch = fuzzyMatch(query, cmd.title);
    const subtitleMatch = cmd.subtitle
      ? fuzzyMatch(query, cmd.subtitle)
      : { match: false, score: 0 };
    const categoryMatch = fuzzyMatch(query, cmd.category);
    const keywordMatches = (cmd.keywords || []).map((k) =>
      fuzzyMatch(query, k)
    );

    const hasMatch =
      titleMatch.match ||
      subtitleMatch.match ||
      categoryMatch.match ||
      keywordMatches.some((km) => km.match);

    if (hasMatch) {
      const maxScore = Math.max(
        titleMatch.score * 1.5,
        subtitleMatch.score,
        categoryMatch.score * 0.8,
        ...keywordMatches.map((km) => km.score * 1.2)
      );
      results.push({ item: cmd, maxScore });
    }
  }

  // Sort descending by match score
  results.sort((a, b) => b.maxScore - a.maxScore);
  return results.map((r) => r.item);
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Show temporary toast feedback
  const showToast = React.useCallback((message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Toggle theme helper
  const handleToggleTheme = React.useCallback(() => {
    if (typeof document === "undefined") return;
    const currentTheme =
      (document.documentElement.getAttribute("data-theme") as
        | "graphite"
        | "paper") || "graphite";
    const nextTheme = currentTheme === "graphite" ? "paper" : "graphite";

    try {
      localStorage.setItem("theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      document.documentElement.classList.remove("paper");
      if (nextTheme === "graphite") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
      // Dispatch custom theme-change event for real-time synchronization
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("theme-change", { detail: nextTheme })
        );
      }
      showToast(`Switched theme to ${nextTheme.toUpperCase()}`);
    } catch {
      // ignore storage errors
    }
  }, [showToast]);

  // Navigate to anchor or URL
  const navigateTo = React.useCallback(
    (target: string) => {
      close();
      if (target.startsWith("#")) {
        const id = target.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const prefersReduced =
            shouldReduceMotion ||
            (typeof window !== "undefined" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches);
          element.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
          });
        } else {
          // If on subpage (e.g. /dev/tokens), navigate to home with hash
          router.push(`/${target}`);
        }
      } else if (target.startsWith("http://") || target.startsWith("https://")) {
        window.open(target, "_blank", "noopener,noreferrer");
      } else {
        router.push(target);
      }
    },
    [close, router, shouldReduceMotion]
  );

  // Social link helpers
  const linkedinUrl =
    profile.socials.find((s) => s.platform === "linkedin")?.url ||
    "https://www.linkedin.com/in/saurabhdixit93";
  const githubUrl =
    profile.socials.find((s) => s.platform === "github")?.url ||
    "https://github.com/saurabhdixit93";

  // Build categorized commands list
  const allCommands = React.useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      // 1. Navigation
      {
        id: "nav-about",
        title: "Overview / About",
        subtitle: "Background, leadership philosophy & systems perspective",
        category: "Navigation",
        keywords: ["about", "bio", "overview", "leadership", "principles"],
        icon: <Compass className="w-4 h-4 text-accent" />,
        badge: "#about",
        perform: () => navigateTo("#about"),
      },
      {
        id: "nav-capabilities",
        title: "Capabilities & Domains",
        subtitle: "AI platforms, full-stack, distributed backends & leadership",
        category: "Navigation",
        keywords: ["capabilities", "skills", "domains", "pillars", "competencies"],
        icon: <Layers className="w-4 h-4 text-accent" />,
        badge: "#capabilities",
        perform: () => navigateTo("#capabilities"),
      },
      {
        id: "nav-work",
        title: "Selected Work",
        subtitle: "Production AI systems and enterprise architecture",
        category: "Navigation",
        keywords: ["work", "projects", "case studies", "flagship"],
        icon: <FolderGit2 className="w-4 h-4 text-accent" />,
        badge: "#work",
        perform: () => navigateTo("#work"),
      },
      {
        id: "nav-stack",
        title: "Stack & Architecture",
        subtitle: "Interactive 5-tier technical infrastructure breakdown",
        category: "Navigation",
        keywords: ["stack", "tech", "technologies", "infra", "tools"],
        icon: <Sliders className="w-4 h-4 text-accent" />,
        badge: "#stack",
        perform: () => navigateTo("#stack"),
      },
      {
        id: "nav-experience",
        title: "Career & Experience",
        subtitle: "Sensegrass VP of Engineering & software timeline",
        category: "Navigation",
        keywords: ["experience", "career", "history", "sensegrass", "roles"],
        icon: <Compass className="w-4 h-4 text-accent" />,
        badge: "#experience",
        perform: () => navigateTo("#experience"),
      },
      {
        id: "nav-process",
        title: "Process & Methodology",
        subtitle: "Discover, Architect, Build, and Ship delivery lifecycle",
        category: "Navigation",
        keywords: ["process", "methodology", "phases", "how i work"],
        icon: <Compass className="w-4 h-4 text-accent" />,
        badge: "#process",
        perform: () => navigateTo("#process"),
      },
      {
        id: "nav-contact",
        title: "Contact & Inquiries",
        subtitle: "Direct message form and advisory bookings",
        category: "Navigation",
        keywords: ["contact", "email", "reach out", "hire", "talk"],
        icon: <Compass className="w-4 h-4 text-accent" />,
        badge: "#contact",
        perform: () => navigateTo("#contact"),
      },

      // 2. Projects (6 Seeded Projects)
      ...projects.map((proj) => {
        const hasCaseStudy = Boolean(proj.links.caseStudy);
        const targetUrl = hasCaseStudy
          ? `/work/${proj.slug}`
          : proj.links.live || proj.links.repo || "#work";
        const isLive = Boolean(proj.links.live);
        return {
          id: `proj-${proj.slug}`,
          title: proj.title,
          subtitle: proj.pitch,
          category: "Projects" as const,
          keywords: [
            proj.slug,
            proj.role,
            ...proj.stack,
            "case study",
            isLive ? "live" : "repo",
          ],
          icon: <FolderGit2 className="w-4 h-4 text-accent2" />,
          badge: hasCaseStudy ? "CASE STUDY" : isLive ? "LIVE SITE" : "VIEW REPO",
          perform: () => {
            trackEvent("project_open", {
              slug: proj.slug,
              title: proj.title,
              linkType: hasCaseStudy ? "case_study" : isLive ? "live" : "repo",
            });
            navigateTo(targetUrl);
          },
        };
      }),

      // 3. Actions
      {
        id: "act-copy-email",
        title: "Copy Email Address",
        subtitle: profile.email,
        category: "Actions",
        keywords: ["email", "copy", "contact", "address", "inbox"],
        icon: <Copy className="w-4 h-4 text-accent" />,
        badge: "CLIPBOARD",
        perform: async () => {
          try {
            if (navigator?.clipboard?.writeText) {
              await navigator.clipboard.writeText(profile.email);
            }
            showToast(`Email copied to clipboard (${profile.email})`);
          } catch {
            showToast(`Copy failed. Email: ${profile.email}`);
          }
        },
      },
      {
        id: "act-resume",
        title: "Download Resume",
        subtitle: "View Saurabh Dixit's formal CV / Resume (PDF)",
        category: "Actions",
        keywords: ["resume", "cv", "pdf", "download", "credentials"],
        icon: <FileText className="w-4 h-4 text-accent" />,
        badge: "PDF",
        perform: () => {
          trackEvent("resume_download", { source: "command_palette" });
          close();
          window.open(profile.resumePath, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "act-linkedin",
        title: "Open LinkedIn Profile",
        subtitle: linkedinUrl,
        category: "Actions",
        keywords: ["linkedin", "social", "profile", "connect"],
        icon: <Linkedin className="w-4 h-4 text-accent" />,
        badge: "EXTERNAL",
        perform: () => {
          close();
          window.open(linkedinUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "act-github",
        title: "Open GitHub Profile",
        subtitle: githubUrl,
        category: "Actions",
        keywords: ["github", "repositories", "code", "open source"],
        icon: <Github className="w-4 h-4 text-accent" />,
        badge: "EXTERNAL",
        perform: () => {
          close();
          window.open(githubUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "act-toggle-theme",
        title: "Toggle Visual Theme",
        subtitle: "Switch between Graphite (Dark) and Paper (Light) modes",
        category: "Actions",
        keywords: ["theme", "toggle", "dark", "light", "graphite", "paper"],
        icon: <SunMoon className="w-4 h-4 text-accent" />,
        badge: "THEME",
        perform: handleToggleTheme,
      },
      {
        id: "act-ask-saurabh",
        title: "Ask Saurabh (AI Assistant)",
        subtitle: "Inquire about architecture, tech stack & experience",
        category: "Actions",
        keywords: ["ask", "ai", "assistant", "chat", "bot", "rag"],
        icon: <MessageSquare className="w-4 h-4 text-accent" />,
        badge: "#assistant",
        perform: () => {
          close();
          navigateTo("#assistant");
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("open-assistant"));
          }
        },
      },
    ];

    return list;
  }, [handleToggleTheme, linkedinUrl, githubUrl, navigateTo, close, showToast]);

  // Filtered commands based on search query
  const filteredCommands = React.useMemo(() => {
    return filterCommands(allCommands, query);
  }, [allCommands, query]);

  // Reset active index when query changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Auto-focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setToastMessage(null);
      // Small timeout to allow modal animation to mount
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll active item into view
  React.useEffect(() => {
    if (isOpen && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
  }, [activeIndex, isOpen, shouldReduceMotion]);

  // Keyboard navigation inside dialog (ArrowUp, ArrowDown, Enter, Tab)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        setActiveIndex((prev) =>
          prev <= 0 ? filteredCommands.length - 1 : prev - 1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[activeIndex]) {
        filteredCommands[activeIndex].perform();
      }
    } else if (e.key === "Tab") {
      // Focus trap within the command palette
      e.preventDefault();
      if (e.shiftKey) {
        if (filteredCommands.length > 0) {
          setActiveIndex((prev) =>
            prev <= 0 ? filteredCommands.length - 1 : prev - 1
          );
        }
      } else {
        if (filteredCommands.length > 0) {
          setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
        }
      }
    }
  };

  // Group commands by category for display
  const groupedCategories = React.useMemo(() => {
    const categories: { name: string; items: { command: CommandItem; globalIndex: number }[] }[] = [];
    const categoryMap = new Map<string, { command: CommandItem; globalIndex: number }[]>();

    filteredCommands.forEach((cmd, index) => {
      if (!categoryMap.has(cmd.category)) {
        categoryMap.set(cmd.category, []);
      }
      categoryMap.get(cmd.category)!.push({ command: cmd, globalIndex: index });
    });

    ["Navigation", "Projects", "Actions"].forEach((catName) => {
      const items = categoryMap.get(catName);
      if (items && items.length > 0) {
        categories.push({ name: catName, items });
      }
    });

    return categories;
  }, [filteredCommands]);

  // Animation variants
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      y: shouldReduceMotion ? 0 : -8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.18, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      y: shouldReduceMotion ? 0 : -6,
      transition: { duration: 0.12 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          {/* Backdrop Overlay */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={close}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-surface border border-hairline shadow-2xl rounded-sm overflow-hidden z-10 flex flex-col max-h-[85vh] corner-marks"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Header / Search Input */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-hairline bg-surface/80">
              <Search className="w-4 h-4 text-muted mr-3 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, project, or section..."
                className="w-full bg-transparent text-sm sm:text-base text-text placeholder:text-muted/60 focus:outline-none font-sans"
                role="combobox"
                aria-expanded={filteredCommands.length > 0}
                aria-autocomplete="list"
                aria-controls="command-listbox"
                aria-activedescendant={
                  filteredCommands[activeIndex]
                    ? `command-item-${filteredCommands[activeIndex].id}`
                    : undefined
                }
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-muted hover:text-text rounded-sm focus-visible:outline-accent mr-2"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 font-mono text-[10px] text-muted border border-hairline rounded bg-surface2/40">
                ESC
              </kbd>
            </div>

            {/* Toast Feedback Notification Banner */}
            {toastMessage && (
              <div
                className="px-4 py-2 bg-accent/15 border-b border-accent/30 text-accent font-mono text-xs flex items-center justify-between transition-all"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-accent/70 hover:text-accent p-0.5"
                  aria-label="Dismiss message"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Results List */}
            <div
              id="command-listbox"
              ref={listRef}
              role="listbox"
              aria-label="Commands"
              className="overflow-y-auto p-2 space-y-4 max-h-[55vh] scrollbar-thin scrollbar-thumb-line"
            >
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-muted font-mono text-xs space-y-2">
                  <p>NO COMMANDS MATCHING &quot;{query}&quot;</p>
                  <p className="text-[11px] text-muted/60">
                    Try searching for &quot;work&quot;, &quot;stack&quot;, &quot;email&quot;, or &quot;theme&quot;
                  </p>
                </div>
              ) : (
                groupedCategories.map((group) => (
                  <div key={group.name} className="space-y-1">
                    <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
                      // {group.name}
                    </div>

                    <div className="space-y-0.5">
                      {group.items.map(({ command: cmd, globalIndex }) => {
                        const isSelected = globalIndex === activeIndex;
                        return (
                          <div
                            key={cmd.id}
                            id={`command-item-${cmd.id}`}
                            ref={(el) => {
                              itemRefs.current[globalIndex] = el;
                            }}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => cmd.perform()}
                            onMouseEnter={() => setActiveIndex(globalIndex)}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-sm cursor-pointer border transition-colors ${
                              isSelected
                                ? "bg-accent/10 border-accent/40 text-text shadow-sm"
                                : "bg-transparent border-transparent text-text hover:bg-surface2/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <div
                                className={`shrink-0 p-1.5 rounded-sm border ${
                                  isSelected
                                    ? "border-accent/40 bg-accent/20 text-accent"
                                    : "border-hairline bg-surface text-muted"
                                }`}
                              >
                                {cmd.icon}
                              </div>

                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-medium truncate flex items-center gap-2">
                                  <span>{cmd.title}</span>
                                  {cmd.badge && (
                                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 text-muted border border-hairline rounded bg-surface2/30 shrink-0">
                                      {cmd.badge}
                                    </span>
                                  )}
                                </div>
                                {cmd.subtitle && (
                                  <div className="text-[11px] text-muted truncate">
                                    {cmd.subtitle}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center pl-2">
                              {isSelected ? (
                                <ArrowRight
                                  className="w-3.5 h-3.5 text-accent animate-pulse"
                                  aria-hidden="true"
                                />
                              ) : (
                                <div className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Telemetry & Shortcut Hints */}
            <div className="px-4 py-2.5 border-t border-hairline bg-surface/90 flex items-center justify-between font-mono text-[10px] text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-hairline rounded bg-surface2/40">↑</kbd>
                  <kbd className="px-1.5 py-0.5 border border-hairline rounded bg-surface2/40">↓</kbd>
                  <span className="hidden sm:inline">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-hairline rounded bg-surface2/40">↵</kbd>
                  <span className="hidden sm:inline">Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-hairline rounded bg-surface2/40">esc</kbd>
                  <span className="hidden sm:inline">Close</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-muted/70">
                <Command className="w-3 h-3 text-accent" />
                <span>SYSTEM PALETTE</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
