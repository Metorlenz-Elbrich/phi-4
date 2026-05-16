"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  "Website",
  "Web application",
  "Mobile application",
  "Branding / identity",
  "UI/UX design",
  "Cybersecurity",
  "Digital transformation",
  "Other — let's talk",
];

type FormState = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  projectType: "",
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
      >
        <span>{label}</span>
        {hint && <span className="font-mono text-[10px] normal-case tracking-normal text-muted-foreground/70">{hint}</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs text-brand-coral"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20";

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const update =
    (key: keyof FormState) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
    };

  function validate(state: FormState): Errors {
    const e: Errors = {};
    if (!state.name.trim()) e.name = "Tell us your name.";
    if (!state.email.trim() || !/^\S+@\S+\.\S+$/.test(state.email))
      e.email = "We need a valid email.";
    if (state.message.trim().length < 10)
      e.message = "A few more words, please — at least 10 characters.";
    return e;
  }

  function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const subject = `Project enquiry — ${form.name}`;
    const lines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.projectType ? `Project type: ${form.projectType}` : null,
      "",
      "Message:",
      form.message,
    ].filter((l): l is string => l !== null);
    const body = lines.join("\n");

    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus("sent");
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden
        className="ambient-glow"
        style={{
          width: "36rem",
          height: "36rem",
          left: "-10%",
          top: "10%",
          background:
            "radial-gradient(circle, hsl(var(--brand-cyan) / 0.18) 0%, transparent 60%)",
        }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left column — intro */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-glow-pulse" />
              Start a project
            </div>
            <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl sm:leading-tight lg:text-5xl">
              Let's make something{" "}
              <span className="text-gradient">memorable</span>.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tell us about your product, your team, your timeline. We'll come
              back inside one business day with a sharp scope and a clear next
              step.
            </p>

            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-cyan"
            >
              <Mail className="h-4 w-4 text-brand-cyan" />
              {site.email}
            </a>
          </div>

          {/* Right column — form */}
          <div className="lg:col-span-7">
            {status === "sent" ? (
              <div className="rounded-3xl border border-brand-cyan/30 bg-card/60 p-7 sm:p-8">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  Thanks — we've got it.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Your default mail app should have opened. If it didn't, drop
                  us a note directly at{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-foreground underline underline-offset-4 transition-colors hover:text-brand-cyan"
                  >
                    {site.email}
                  </a>
                  . We'll be in touch within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY);
                    setStatus("idle");
                  }}
                  className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="grid gap-5 rounded-3xl border border-border bg-card/40 p-6 backdrop-blur-sm sm:p-7 lg:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="contact-name" label="Name" error={errors.name}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={update("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      className={cn(inputClass, errors.name && "border-brand-coral/60")}
                    />
                  </Field>
                  <Field id="contact-email" label="Email" error={errors.email}>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={update("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      className={cn(inputClass, errors.email && "border-brand-coral/60")}
                    />
                  </Field>
                </div>

                <Field
                  id="contact-project"
                  label="Project type"
                  hint="Optional"
                >
                  <div className="relative">
                    <select
                      id="contact-project"
                      name="projectType"
                      value={form.projectType}
                      onChange={update("projectType")}
                      className={cn(inputClass, "appearance-none pr-10")}
                    >
                      <option value="">Pick one…</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                    >
                      <path
                        d="M5 7l5 6 5-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Field>

                <Field id="contact-message" label="Message" error={errors.message}>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder="What are you building, and what's the rough timeline?"
                    value={form.message}
                    onChange={update("message")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={cn(
                      inputClass,
                      "resize-y",
                      errors.message && "border-brand-coral/60"
                    )}
                  />
                </Field>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    No spam, no funnel. A real human reads each message.
                  </p>
                  <Button type="submit" size="md">
                    Send message
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
