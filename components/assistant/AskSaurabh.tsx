"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Copy,
  Check,
  Bot,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Mail,
} from "lucide-react";
import { useAssistant } from "./AssistantContext";
import { aiWorkflow } from "@/content/ai-workflow";
import { trackEvent } from "@/lib/analytics";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = aiWorkflow.assistantTeaser.suggestedPrompts;

export const AskSaurabh: React.FC = () => {
  const { isOpen, closeAssistant, openAssistant, initialPrompt } = useAssistant();
  const prefersReducedMotion = useReducedMotion();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom on message update
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth && !prefersReducedMotion ? "smooth" : "auto",
        block: "end",
      });
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    scrollToBottom(false);
  }, [messages, isStreaming, scrollToBottom]);

  // Focus management & body scroll lock
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Focus textarea on open
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key listener & focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAssistant();
      }

      // Basic tab focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAssistant]);

  // Handle send message
  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || input).trim();
      if (!query || isLoading || isStreaming) return;

      if (query.length > 500) {
        setErrorMessage("Message cannot exceed 500 characters.");
        return;
      }

      setErrorMessage(null);
      setInput("");

      trackEvent("assistant_message", {
        role: "user",
        queryLength: query.length,
        suggestedPrompt: Boolean(textToSend),
      });

      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `asst-${Date.now()}`;

      const userMessage: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedHistory = [...messages, userMessage];
      setMessages([...updatedHistory, assistantMessage]);
      setIsLoading(true);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // Send up to 10 history items
        const historyPayload = messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            history: historyPayload,
          }),
          signal: controller.signal,
        });

        if (response.status === 429) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Rate limit reached. Please wait 60 seconds.");
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned error (${response.status})`);
        }

        if (!response.body) {
          throw new Error("No response stream received");
        }

        setIsLoading(false);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
            )
          );
        }

        if (accumulatedText.length > 0) {
          trackEvent("assistant_message", {
            role: "assistant",
            queryLength: accumulatedText.length,
          });
        }
      } catch (err: unknown) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        const errMsg = (err as Error).message || "Unable to reach assistant. Please try again.";
        setErrorMessage(errMsg);
        // Remove empty assistant placeholder on error
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMsgId || msg.content.length > 0));
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        abortControllerRef.current = null;
        setTimeout(() => textareaRef.current?.focus(), 50);
      }
    },
    [input, isLoading, isStreaming, messages]
  );

  // Trigger initial prompt if set via context
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt, handleSend]);

  // Handle clear chat history
  const handleClearHistory = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setErrorMessage(null);
    setIsLoading(false);
    setIsStreaming(false);
    textareaRef.current?.focus();
  };

  // Handle copy text
  const handleCopy = async (id: string, text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  };

  // Render markdown-like link citations and dynamic clickable mailto links in assistant responses
  const renderFormattedContent = (content: string) => {
    // Matches [#section], Markdown link [text](url), or raw email address
    const linkRegex = /\[(.*?)\]\((.*?)\)|\[(#\w+)\]|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      if (match[2]) {
        // [text](url)
        const text = match[1];
        const url = match[2];
        const isMailto = url.startsWith("mailto:");
        const isExternal = url.startsWith("http") || isMailto;
        parts.push(
          <a
            key={match.index}
            href={url}
            target={isExternal && !isMailto ? "_blank" : undefined}
            rel={isExternal && !isMailto ? "noopener noreferrer" : undefined}
            className="text-accent underline underline-offset-2 hover:text-accent/80 font-mono text-xs inline-flex items-center gap-1 font-semibold transition-colors"
            onClick={() => {
              if (url.startsWith("#")) {
                closeAssistant();
              }
            }}
          >
            {isMailto && <Mail className="w-3.5 h-3.5 inline-block shrink-0" />}
            <span>{text}</span>
            {isExternal && !isMailto && <ExternalLink className="w-3 h-3 ml-0.5" />}
          </a>
        );
      } else if (match[3]) {
        // [#section]
        const anchor = match[3];
        parts.push(
          <a
            key={match.index}
            href={anchor}
            className="text-accent underline underline-offset-2 hover:text-accent/80 font-mono text-xs font-semibold"
            onClick={() => closeAssistant()}
          >
            {anchor}
          </a>
        );
      } else if (match[4]) {
        // Raw email address detected: auto-convert to interactive mailto link with pre-filled subject & body
        const email = match[4];
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Inquiry via Systems Blueprint Portfolio")}&body=${encodeURIComponent("Hi Saurabh,\n\nI was reviewing your Systems Blueprint portfolio and wanted to connect regarding:\n\n")}`;
        parts.push(
          <a
            key={match.index}
            href={mailtoUrl}
            className="text-accent underline underline-offset-2 hover:text-accent/80 font-mono text-xs inline-flex items-center gap-1 font-semibold transition-colors"
          >
            <Mail className="w-3.5 h-3.5 inline-block shrink-0" />
            <span>{email}</span>
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. FLOATING ACTION TRIGGER BUTTON                            */}
      {/* ============================================================ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="ask-saurabh-fab"
            onClick={() => openAssistant()}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-3.5 py-2.5 bg-surface/95 backdrop-blur-md border border-hairline hover:border-accent shadow-xl rounded-full text-text transition-colors duration-200"
            aria-label="Open Ask Saurabh AI Assistant (Press ⌘K)"
          >
            {/* Live Indicator Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping motion-reduce:hidden absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>

            <Bot className="w-4 h-4 text-accent" />

            <span className="font-mono text-xs font-semibold tracking-wider uppercase text-text group-hover:text-accent transition-colors">
              Ask Saurabh
            </span>

            <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg/80 border border-hairline text-muted">
              ⌘K
            </kbd>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 2. SLIDE-OVER DRAWER MODAL                                  */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="assistant-title">
            {/* Backdrop Blur Overlay */}
            <motion.div
              key="assistant-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
              onClick={closeAssistant}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-over Right Panel (Desktop) / Full Height Sheet (Mobile) */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
              <motion.div
                key="assistant-panel"
                ref={dialogRef}
                initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
                animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.15 }
                    : { type: "spring", damping: 28, stiffness: 280 }
                }
                className="w-screen max-w-md sm:max-w-lg h-full bg-bg border-l border-hairline flex flex-col shadow-2xl relative"
              >
                {/* ---------------------------------------------------- */}
                {/* Panel Header                                         */}
                {/* ---------------------------------------------------- */}
                <header className="px-5 py-4 border-b border-hairline bg-surface/80 backdrop-blur flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping motion-reduce:hidden absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 id="assistant-title" className="font-mono text-sm font-semibold tracking-wide text-text">
                          Ask Saurabh
                        </h2>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-hairline text-accent">
                          SYS.ONLINE
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-muted">
                        Grounded on 15 verified portfolio entries
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        disabled={isLoading || isStreaming}
                        className="p-1.5 rounded text-muted hover:text-text hover:bg-surface border border-transparent hover:border-hairline transition-colors disabled:opacity-40"
                        title="Clear conversation"
                        aria-label="Clear chat history"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={closeAssistant}
                      className="p-1.5 rounded text-muted hover:text-text hover:bg-surface border border-transparent hover:border-hairline transition-colors"
                      title="Close panel (Esc)"
                      aria-label="Close assistant panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </header>

                {/* ---------------------------------------------------- */}
                {/* Message Log / Body Container                         */}
                {/* ---------------------------------------------------- */}
                <div
                  className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-sm"
                  aria-live="polite"
                  role="log"
                >
                  {/* Empty State: Greeting & Suggested Prompts */}
                  {messages.length === 0 && (
                    <div className="space-y-5 pt-4">
                      <div className="p-4 rounded border border-hairline bg-surface/50 space-y-2">
                        <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Grounded Portfolio Assistant</span>
                        </div>
                        <p className="text-sm text-text leading-relaxed">
                          Inquire about Saurabh’s engineering leadership at Sensegrass (+35% velocity), AI platforms (Enterprise Code Review, Disha Health Coach), technical stack, or availability.
                        </p>
                        <p className="text-xs text-muted font-mono">
                          Refuses speculations or unverified data. All facts link to live sections.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-muted">
                          Suggested Inquiries
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {SUGGESTED_PROMPTS.map((promptText, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(promptText)}
                              disabled={isLoading || isStreaming}
                              className="text-left p-2.5 rounded border border-hairline bg-surface/40 hover:bg-surface hover:border-accent text-xs text-text transition-all flex items-center justify-between group disabled:opacity-50"
                            >
                              <span>{promptText}</span>
                              <Send className="w-3 h-3 text-muted group-hover:text-accent transition-colors shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message History Render */}
                  {messages.map((msg) => {
                    // Do not render empty assistant message placeholder before stream begins
                    if (msg.role === "assistant" && !msg.content) return null;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.role === "user" ? "items-end" : "items-start"
                        } space-y-1`}
                      >
                        {/* Role Header */}
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted uppercase">
                          <span>{msg.role === "user" ? "[YOU]" : "[SAURABH.AI]"}</span>
                          <span>·</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`relative max-w-[92%] rounded p-3.5 leading-relaxed text-sm ${
                            msg.role === "user"
                              ? "bg-accent/10 border border-accent/30 text-text"
                              : "bg-surface border border-hairline text-text"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {renderFormattedContent(msg.content)}
                            {/* Animated Typewriter Caret while streaming */}
                            {isStreaming && msg.role === "assistant" && msg.content && (
                              <span className="inline-block w-1.5 h-3.5 ml-1 bg-accent animate-pulse motion-reduce:animate-none align-middle" />
                            )}
                          </div>

                          {/* Copy Button for Assistant responses */}
                          {msg.role === "assistant" && msg.content && !isStreaming && (
                            <div className="mt-2.5 pt-2 border-t border-hairline/60 flex items-center justify-between">
                              <span className="font-mono text-[10px] text-muted">
                                VERIFIED FACTS
                              </span>
                              <button
                                onClick={() => handleCopy(msg.id, msg.content)}
                                className="inline-flex items-center gap-1 font-mono text-[10px] text-muted hover:text-accent transition-colors"
                                aria-label="Copy response to clipboard"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-accent" />
                                    <span className="text-accent font-semibold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* High-Tech Reasoning & Retrieval Indicator (No empty boxes) */}
                  {(isLoading || (isStreaming && messages.some((m) => m.role === "assistant" && !m.content))) && (
                    <div className="flex flex-col items-start space-y-1.5 py-1">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted uppercase">
                        <span className="text-accent font-semibold">[SAURABH.AI]</span>
                        <span>·</span>
                        <span className="text-accent flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-ping motion-reduce:hidden" />
                          REASONING
                        </span>
                      </div>
                      <div className="p-3.5 rounded bg-surface border border-hairline flex flex-col gap-2 text-muted font-mono text-xs shadow-sm max-w-[90%]">
                        <div className="flex items-center gap-2 text-text">
                          <span className="flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce motion-reduce:animate-none [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce motion-reduce:animate-none [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce motion-reduce:animate-none" />
                          </span>
                          <span className="text-xs font-mono text-accent">
                            Querying verified portfolio telemetry...
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted border-t border-hairline/60 pt-1.5">
                          <span>SYS.STATUS: INFERENCE_PIPELINE</span>
                          <span className="text-accent">ZERO HALLUCINATIONS</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Notification Banner */}
                  {errorMessage && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold">Query Interrupted</p>
                        <p>{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ---------------------------------------------------- */}
                {/* Panel Footer / Textarea Input                        */}
                {/* ---------------------------------------------------- */}
                <footer className="p-4 border-t border-hairline bg-surface/60 backdrop-blur space-y-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="relative flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setInput(e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        rows={2}
                        placeholder="Inquire about leadership, stack, or projects..."
                        className="w-full resize-none p-2.5 pr-14 rounded bg-bg border border-hairline focus:border-accent text-sm text-text placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                        disabled={isLoading || isStreaming}
                        aria-label="Message to Saurabh Dixit's AI assistant"
                      />

                      {/* Character Count Indicator */}
                      <span
                        className={`absolute bottom-2 right-2 font-mono text-[10px] pointer-events-none ${
                          input.length > 450 ? "text-accent font-semibold" : "text-muted"
                        }`}
                      >
                        {input.length}/500
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading || isStreaming}
                      className="p-3 rounded bg-accent text-[var(--accent-contrast)] hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
                      aria-label="Send query"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                    <span>Enter to send · Shift+Enter newline</span>
                    <span>Zero Hallucinations</span>
                  </div>
                </footer>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskSaurabh;
