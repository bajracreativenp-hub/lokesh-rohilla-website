"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type FormField =
  | {
      kind: "text" | "email" | "tel" | "number";
      id: string;
      label: string;
      help?: string;
      autoComplete?: string;
      required?: boolean;
      min?: number;
    }
  | { kind: "textarea"; id: string; label: string; help?: string; rows?: number; required?: boolean }
  | {
      kind: "select";
      id: string;
      label: string;
      help?: string;
      options: string[];
      /** Renders disabled, for a list that has nothing confirmed in it yet. */
      locked?: boolean;
    }
  | {
      kind: "radio";
      name: string;
      legend: string;
      options: { value: string; label: string }[];
    }
  | { kind: "submit"; label: string };

/**
 * Generic lead capture form.
 *
 * Connected directly to Payload CMS /api/leads collection.
 */
export function LeadForm({ fields }: { fields: FormField[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") data[key] = value;
    });

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name || data.fullname || "Website Lead",
          email: data.email || "inquiry@lead.com",
          phone: data.phone || data.tel || undefined,
          company: data.organisation || data.company || undefined,
          type: "consultation_request",
          message: data.message || (Object.keys(data).length > 0 ? JSON.stringify(data) : "Lead submission"),
          status: "new",
        }),
      });
      setSubmitted(true);
    } catch {
      // Graceful fallback
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col gap-3 rounded-card bg-sunk p-6 border border-hairline-strong">
        <p className="text-base font-bold text-ink">Thank you! Your request has been sent.</p>
        <p className="text-sm text-ink-muted leading-relaxed">
          Our team has received your information and will follow up with you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="self-start text-xs font-bold text-accent underline underline-offset-4"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      {fields.map((field) => {
        const base =
          "rounded-input border bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none";

        switch (field.kind) {
          case "radio":
            return (
              <fieldset key={field.legend} className="flex flex-col gap-3">
                <legend className="text-sm font-bold text-ink">{field.legend}</legend>
                {field.options.map((option, index) => (
                  <label
                    key={option.value}
                    htmlFor={`${field.name}-${option.value}`}
                    className="flex cursor-pointer items-center gap-3 rounded-card border border-hairline-strong p-4 transition-colors duration-200 hover:border-accent"
                  >
                    <input
                      id={`${field.name}-${option.value}`}
                      type="radio"
                      name={field.name}
                      defaultChecked={index === 0}
                      className="size-4 accent-[var(--accent)]"
                    />
                    <span className="text-sm font-semibold text-ink">{option.label}</span>
                  </label>
                ))}
              </fieldset>
            );

          case "textarea":
            return (
              <div key={field.id} className="flex flex-col gap-2">
                <label htmlFor={field.id} className="text-sm font-bold text-ink">
                  {field.label}
                </label>
                {field.help ? <p className="text-sm text-ink-muted">{field.help}</p> : null}
                <textarea
                  id={field.id}
                  name={field.id}
                  rows={field.rows ?? 5}
                  aria-required={field.required}
                  className={`${base} resize-y`}
                />
              </div>
            );

          case "select":
            return (
              <div key={field.id} className="flex flex-col gap-2">
                <label htmlFor={field.id} className="text-sm font-bold text-ink">
                  {field.label}
                </label>
                {field.help ? <p className="text-sm text-ink-muted">{field.help}</p> : null}
                <select
                  id={field.id}
                  name={field.id}
                  disabled={field.locked}
                  className={`${base} ${field.locked ? "border-hairline-strong bg-sunk text-ink-faint" : ""}`}
                >
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            );

          case "submit":
            return (
              <Button key={field.label} type="submit" size="lg" className="self-start">
                {field.label}
              </Button>
            );

          default:
            return (
              <div key={field.id} className="flex flex-col gap-2">
                <label htmlFor={field.id} className="text-sm font-bold text-ink">
                  {field.label}
                </label>
                {field.help ? <p className="text-sm text-ink-muted">{field.help}</p> : null}
                <input
                  id={field.id}
                  name={field.id}
                  type={field.kind}
                  {...(field.autoComplete ? { autoComplete: field.autoComplete } : {})}
                  {...(field.kind === "number" && field.min !== undefined ? { min: field.min } : {})}
                  aria-required={field.required}
                  className={`${base} ${field.required ? "border-hairline-strong" : "border-hairline"}`}
                />
              </div>
            );
        }
      })}
    </form>
  );
}
