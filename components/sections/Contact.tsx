"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import Button from "@/components/primitives/Button";
import { profile } from "@/content/profile";
import { ISTClock } from "@/components/navigation/ISTClock";

export interface ContactProps {
  id?: string;
  className?: string;
}

export const Contact: React.FC<ContactProps> = ({
  id = "contact",
  className = "",
}) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    intent: "consulting",
    message: "",
    website: "", // honeypot
  });

  const [loadedAt] = React.useState<number>(() => Date.now());
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          loadedAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit message.");
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        return;
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        intent: "consulting",
        message: "",
        website: "",
      });
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please contact via direct email.");
    }
  };

  return (
    <Section
      id={id}
      annotation="// 10 · CONTACT & INITIATION"
      heading={
        <>
          Let&apos;s build something{" "}
          <span className="italic text-accent">resilient</span> together.
        </>
      }
      subheading="Available for VP of Engineering roles, high-scale AI consulting, and technical advisory."
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-surface/80 border border-hairline p-6 md:p-8 relative">
          <div className="flex items-center justify-between border-b border-hairline/60 pb-3 mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              // DISPATCH MESSAGE
            </span>
            <span className="font-mono text-[10px] text-accent">
              TYPICAL REPLY &lt; 24H
            </span>
          </div>

          {status === "success" ? (
            <div
              role="alert"
              className="p-6 bg-accent/10 border border-accent/40 rounded-sm text-center space-y-3"
            >
              <div className="font-mono text-xs text-accent font-semibold tracking-wider">
                ✓ MESSAGE TRANSMITTED SUCCESSFULLY
              </div>
              <p className="text-sm text-text/90">
                Thank you for getting in touch. I review incoming engineering inquiries daily and will respond to your email within 24 hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatus("idle")}
                className="mt-4"
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot anti-spam field */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {status === "error" && errorMessage && (
                <div
                  role="alert"
                  className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 font-mono text-xs"
                >
                  {errorMessage}
                </div>
              )}

              {/* Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-xs text-muted mb-1"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-bg/80 border border-hairline rounded-sm font-sans text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent"
                  />
                  {fieldErrors.name && (
                    <p className="font-mono text-[10px] text-red-400 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs text-muted mb-1"
                  >
                    Your Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-bg/80 border border-hairline rounded-sm font-sans text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent"
                  />
                  {fieldErrors.email && (
                    <p className="font-mono text-[10px] text-red-400 mt-1">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Intent Selector */}
              <div>
                <label
                  htmlFor="contact-intent"
                  className="block font-mono text-xs text-muted mb-1"
                >
                  Discussion Intent *
                </label>
                <select
                  id="contact-intent"
                  value={formData.intent}
                  onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                  className="w-full px-3 py-2 bg-bg/80 border border-hairline rounded-sm font-sans text-sm text-text focus:outline-none focus:border-accent"
                >
                  <option value="full-time">Full-Time Leadership / VP Role</option>
                  <option value="consulting">AI & Distributed Systems Consulting</option>
                  <option value="advisory">Technical Advisory & Code Review</option>
                  <option value="collaboration">Open Source & Collaboration</option>
                  <option value="general">General Engineering Inquiry</option>
                </select>
              </div>

              {/* Message Area */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs text-muted mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Tell me about the system, scale requirements, or project scope..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-bg/80 border border-hairline rounded-sm font-sans text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent resize-y"
                />
                {fieldErrors.message && (
                  <p className="font-mono text-[10px] text-red-400 mt-1">{fieldErrors.message}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted">
                  * All communications treated under NDA
                </span>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Transmitting..." : "Send Message →"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Channels & Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Email Card */}
          <div className="p-6 bg-surface/70 border border-hairline relative">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2">
              // DIRECT INBOX
            </span>
            <p className="font-mono text-sm text-text select-all font-medium mb-3">
              {profile.email}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="w-full font-mono text-xs"
            >
              {copiedEmail ? "✓ Copied to clipboard" : "Copy email address"}
            </Button>
          </div>

          {/* Availability & Local Time Card */}
          <div className="p-6 bg-surface/70 border border-hairline space-y-4">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block">
              // OPERATIONAL TELEMETRY
            </span>

            <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
              <span className="text-xs text-muted">Current Status:</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs text-emerald-400 font-medium">
                  {profile.availability.label}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
              <span className="text-xs text-muted">Base Location:</span>
              <span className="font-mono text-xs text-text">{profile.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Local Time (IST):</span>
              <ISTClock className="font-mono text-xs text-accent" />
            </div>
          </div>

          {/* Social Profiles & Resume */}
          <div className="p-6 bg-surface/70 border border-hairline space-y-3">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2">
              // VERIFIED EXTERNAL PROFILES
            </span>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://github.com/saurabhdixit93"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-bg/70 border border-hairline hover:border-accent/60 transition-colors rounded-sm flex items-center justify-between font-mono text-xs text-text"
              >
                <span>GitHub</span>
                <span className="text-accent">↗</span>
              </a>

              <a
                href="https://www.linkedin.com/in/saurabh-dixit-47a82b1b3/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-bg/70 border border-hairline hover:border-accent/60 transition-colors rounded-sm flex items-center justify-between font-mono text-xs text-text"
              >
                <span>LinkedIn</span>
                <span className="text-accent">↗</span>
              </a>
            </div>

            <a
              href="/resume.pdf"
              download
              className="mt-2 block p-3 bg-bg/70 border border-hairline hover:border-accent/60 transition-colors rounded-sm text-center font-mono text-xs text-text"
            >
              Download Verified Resume (PDF) ↓
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;

