"use client";

import * as React from "react";
import { trackEvent } from "@/lib/analytics";

export interface CommandPaletteContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CommandPaletteContext = React.createContext<
  CommandPaletteContextValue | undefined
>(undefined);

export interface CommandPaletteProviderProps {
  children: React.ReactNode;
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  const open = React.useCallback(() => {
    if (typeof document !== "undefined") {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
    }
    setIsOpen(true);
    trackEvent("palette_open", { source: "hotkey" });
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    // Restore focus to previous element after animation frame
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        if (
          previousFocusRef.current &&
          typeof previousFocusRef.current.focus === "function"
        ) {
          previousFocusRef.current.focus();
        }
      });
    }
  }, []);

  const toggle = React.useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Global keyboard shortcut handler (Meta+K / Ctrl+K and Escape)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        toggle();
        return;
      }

      // Escape key to close
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggle, close]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const value = React.useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
    }),
    [isOpen, open, close, toggle]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette(): CommandPaletteContextValue {
  const context = React.useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      "useCommandPalette must be used within a CommandPaletteProvider"
    );
  }
  return context;
}
