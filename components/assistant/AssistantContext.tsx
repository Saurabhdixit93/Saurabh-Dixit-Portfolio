"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

export interface AssistantContextValue {
  isOpen: boolean;
  initialPrompt: string | null;
  openAssistant: (prompt?: string, trigger?: string) => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  clearInitialPrompt: () => void;
}

const AssistantContext = createContext<AssistantContextValue | undefined>(undefined);

export interface AssistantProviderProps {
  children: React.ReactNode;
}

export const AssistantProvider: React.FC<AssistantProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);

  const openAssistant = useCallback((prompt?: string, trigger?: string) => {
    if (prompt) {
      setInitialPrompt(prompt);
    }
    setIsOpen(true);
    trackEvent("assistant_open", {
      trigger: trigger || (prompt ? "prompt" : "direct"),
    });
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
    setInitialPrompt(null);
  }, []);

  const clearInitialPrompt = useCallback(() => {
    setInitialPrompt(null);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        trackEvent("assistant_open", { trigger: "toggle" });
      }
      return next;
    });
  }, []);

  // Listen to custom 'open-assistant' DOM event for decoupled triggers
  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt?: string }>;
      const prompt = customEvent.detail?.prompt;
      openAssistant(prompt);
    };

    window.addEventListener("open-assistant", handleOpenEvent as EventListener);
    return () => {
      window.removeEventListener("open-assistant", handleOpenEvent as EventListener);
    };
  }, [openAssistant]);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        initialPrompt,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        clearInitialPrompt,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = (): AssistantContextValue => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider");
  }
  return context;
};

export default AssistantContext;
