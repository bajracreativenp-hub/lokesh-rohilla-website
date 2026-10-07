"use client";

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
 * Shared by the newsletter, masterclass, consultation, corporate training and
 * event registration pages so all five behave identically and none of them has
 * to be a Server Component.
 *
 * Submission is deliberately inert. Every consumer of this form needs an email
 * provider or a form service that has not been chosen yet, so it does not
 * pretend to send. Each page states its own unmet dependency beneath it.
 */
export function LeadForm({ fields }: { fields: FormField[] }) {
  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(e) => e.preventDefault()}
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
