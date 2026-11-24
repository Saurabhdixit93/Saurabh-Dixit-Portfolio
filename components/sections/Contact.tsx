"use client";

import * as React from "react";
import Section from "@/components/primitives/Section";
import Button from "@/components/primitives/Button";
import { ISTClock } from "@/components/navigation/ISTClock";
import { profile } from "@/content/profile";
import { contactContent } from "@/content/contact";
import { isWhatsAppEnabled } from "@/content/flags";

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
    intent: "full-time",
    message: "",
    website: "", // honeypot
  });

  const [loadedAt, setLoadedAt] = React.useState<number>(0);
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  React.useEffect(() => {
    setLoadedAt(Date.now());
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => {
        setCopiedEmail(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy email", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
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
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setErrorMessage(
          data.error || "Validation failed. Please verify the form inputs."
        );
        return;
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        intent: "full-time",
        message: "",
        website: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "Network connection error. Please try again or reach out via direct email."
      );
    }
  };

  const githubUrl =
    profile.socials.find((s) => s.platform === "github")?.url ||
    "https://github.com/saurabhdixit93";
  const linkedinUrl =
    profile.socials.find((s) => s.platform === "linkedin")?.url ||
    "https://www.linkedin.com/in/saurabhdixit93";
  const whatsappUrl = profile.socials.find((s) => s.platform === "whatsapp")?.url;
  const whatsappActive = isWhatsAppEnabled();

  return (
    <Section
      id={id}
      annotation={contactContent.annotation}
      heading={
        <>
          Initiate Contact &amp;{" "}
          <span className="italic text-accent">Transmit Inquiries</span>
        </>
      }
      subheading={contactContent.subheading}
      withGrid
      withHairline
      withCornerMarks
      className={className}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-surface/90 backdrop-blur-md border border-hairline p-6 sm:p-8 md:p-10 relative shadow-sm">
          <div className="flex items-center justify-between border-b border-hairline/60 pb-3 mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {contactContent.form.dispatchHeader}
            </span>
            <span className="font-mono text-[10px] text-accent font-semibold tracking-wider">
              {contactContent.responsePromise}
            </span>
          </div>

          {status === "success" ? (
            <div
              role="alert"
              className="p-6 bg-accent/10 border border-accent/40 rounded-sm text-center space-y-3"
            >
              <div className="font-mono text-xs text-accent font-semibold tracking-wider">
                {contactContent.form.successTitle}
              </div>
              <p className="text-sm text-text/90 leading-relaxed">
                {contactContent.form.successMessage}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatus("idle")}
                className="mt-4"
              >
                {contactContent.form.resetButtonText}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot anti-spam field */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
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
                    className="block font-mono text-xs text-muted mb-1 uppercase tracking-wider"
                  >
                    {contactContent.form.name.label}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    disabled={status === "submitting"}
                    placeholder={contactContent.form.name.placeholder}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? "contact-name-error" : undefined
                    }
                    className="w-full px-3 py-2 bg-surface border border-hairline focus:border-accent text-text placeholder:text-muted/60 rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors disabled:opacity-50"
                  />
                  {fieldErrors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="font-mono text-[10px] text-red-400 mt-1"
                    >
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs text-muted mb-1 uppercase tracking-wider"
                  >
                    {contactContent.form.email.label}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    disabled={status === "submitting"}
                    placeholder={contactContent.form.email.placeholder}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "contact-email-error" : undefined
                    }
                    className="w-full px-3 py-2 bg-surface border border-hairline focus:border-accent text-text placeholder:text-muted/60 rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors disabled:opacity-50"
                  />
                  {fieldErrors.email && (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="font-mono text-[10px] text-red-400 mt-1"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Intent Selector */}
              <div>
                <label
                  htmlFor="contact-intent"
                  className="block font-mono text-xs text-muted mb-1 uppercase tracking-wider"
                >
                  {contactContent.form.intent.label}
                </label>
                <select
                  id="contact-intent"
                  name="intent"
                  disabled={status === "submitting"}
                  value={formData.intent}
                  onChange={(e) =>
                    setFormData({ ...formData, intent: e.target.value })
                  }
                  aria-invalid={Boolean(fieldErrors.intent)}
                  aria-describedby={
                    fieldErrors.intent ? "contact-intent-error" : undefined
                  }
                  className="w-full px-3 py-2 bg-surface border border-hairline focus:border-accent text-text rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors disabled:opacity-50"
                >
                  {contactContent.intents.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.intent && (
                  <p
                    id="contact-intent-error"
                    role="alert"
                    className="font-mono text-[10px] text-red-400 mt-1"
                  >
                    {fieldErrors.intent}
                  </p>
                )}
              </div>

              {/* Message Area */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs text-muted mb-1 uppercase tracking-wider"
                >
                  {contactContent.form.message.label}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  disabled={status === "submitting"}
                  placeholder={contactContent.form.message.placeholder}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? "contact-message-error" : undefined
                  }
                  className="w-full px-3 py-2 bg-surface border border-hairline focus:border-accent text-text placeholder:text-muted/60 rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors resize-y disabled:opacity-50"
                />
                {fieldErrors.message && (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="font-mono text-[10px] text-red-400 mt-1"
                  >
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted">
                  {contactContent.form.disclaimer}
                </span>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "submitting"}
                >
                  {status === "submitting"
                    ? contactContent.form.submittingButtonText
                    : contactContent.form.submitButtonText}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Channels & Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Email Card */}
          <div className="p-6 bg-surface/90 backdrop-blur-md border border-hairline relative shadow-sm">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2">
              {contactContent.directChannels.inboxHeader}
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
              {copiedEmail
                ? contactContent.directChannels.copiedButtonText
                : contactContent.directChannels.copyButtonText}
            </Button>
          </div>

          {/* Availability & Local Time Card */}
          <div className="p-6 bg-surface/70 border border-hairline space-y-4">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block">
              {contactContent.telemetry.header}
            </span>

            <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
              <span className="text-xs text-muted">
                {contactContent.telemetry.statusLabel}
              </span>
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
              <span className="text-xs text-muted">
                {contactContent.telemetry.locationLabel}
              </span>
              <span className="font-mono text-xs text-text">
                {profile.location}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">
                {contactContent.telemetry.timeLabel}
              </span>
              <ISTClock className="font-mono text-xs text-accent" />
            </div>
          </div>

          {/* Social Profiles & Resume */}
          <div className="p-6 bg-surface/70 border border-hairline space-y-3">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2">
              {contactContent.resume.header}
            </span>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-bg/70 border border-hairline hover:border-accent/60 transition-colors rounded-sm flex items-center justify-between font-mono text-xs text-text"
              >
                <span>GitHub</span>
                <span className="text-accent">↗</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-bg/70 border border-hairline hover:border-accent/60 transition-colors rounded-sm flex items-center justify-between font-mono text-xs text-text"
              >
                <span>LinkedIn</span>
                <span className="text-accent">↗</span>
              </a>

              {whatsappActive && (
                <a
                  href={whatsappUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp_click"
                  className="col-span-2 p-3 bg-bg/70 border border-hairline hover:border-accent/60 transition-colors rounded-sm flex items-center justify-between font-mono text-xs text-text"
                >
                  <span>WhatsApp</span>
                  <span className="text-accent">↗</span>
                </a>
              )}
            </div>

            <a
              href={profile.resumePath || contactContent.resume.downloadPath}
              download={contactContent.resume.fileName}
              data-track="resume_download"
              className="mt-2 block p-3 bg-bg/70 border border-hairline hover:border-accent/60 transition-colors rounded-sm text-center font-mono text-xs text-text"
            >
              {contactContent.resume.buttonText}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
