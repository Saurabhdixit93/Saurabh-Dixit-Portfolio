"use client";

import * as React from "react";

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"graphite" | "paper">("graphite");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const syncTheme = () => {
      const currentTheme =
        (document.documentElement.getAttribute("data-theme") as "graphite" | "paper") ||
        (localStorage.getItem("theme") as "graphite" | "paper") ||
        "graphite";
      setTheme(currentTheme);
    };

    syncTheme();

    // Listen for custom theme-change event from CommandPalette or other controls
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<"graphite" | "paper">;
      if (customEvent.detail === "graphite" || customEvent.detail === "paper") {
        setTheme(customEvent.detail);
      } else {
        syncTheme();
      }
    };

    // Listen for storage changes from other browser tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "graphite" || e.newValue === "paper")) {
        setTheme(e.newValue);
      }
    };

    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorage);

    // MutationObserver fallback to catch any external data-theme attribute changes
    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === "attributes" && m.attributeName === "data-theme") {
            syncTheme();
          }
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
      observer?.disconnect();
    };
  }, []);

  const toggleTheme = React.useCallback(() => {
    const nextTheme = theme === "graphite" ? "paper" : "graphite";
    setTheme(nextTheme);

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

      // Dispatch theme-change event so all theme consumers update immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("theme-change", { detail: nextTheme })
        );
      }
    } catch {
      // LocalStorage error handling for private browsing / sandboxes
    }
  }, [theme]);

  // Handle keyboard interaction: Enter or Space
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  };

  const isGraphite = theme === "graphite";
  const isPaper = theme === "paper";
  const title = isGraphite ? "Switch to Paper (Light) theme" : "Switch to Graphite (Dark) theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      aria-label="Toggle theme"
      aria-pressed={isPaper}
      title={title}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wider uppercase rounded-sm border border-hairline bg-surface text-text hover:border-accent transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${className}`}
    >
      {/* Blueprint Mode Icon */}
      <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden="true">
        <span
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            isGraphite ? "bg-accent shadow-[0_0_8px_rgba(255,106,43,0.6)]" : "bg-accent2 shadow-[0_0_8px_rgba(8,115,96,0.5)]"
          }`}
        />
      </span>

      <span className="tabular-nums">
        {mounted ? (isGraphite ? "GRAPHITE" : "PAPER") : "THEME"}
      </span>

      {showLabel && (
        <span className="text-muted hidden sm:inline">
          [{isGraphite ? "DARK" : "LIGHT"}]
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;

