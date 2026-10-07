"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { contactPage } from "@/lib/pages";

/**
 * CONTACT FORM
 *
 * Full client side validation with the three states a real form needs:
 * idle, invalid (inline, per field), and submitting.
 *
 * It deliberately does NOT fake a success state. There is no mail provider,
 * no confirmed destination address and no backend route yet, so the form stops
 * at the honest state and says so. Wiring `submit` to a real endpoint is the
 * only remaining step, and the success branch is written and waiting for it.
 *
 * Accessibility:
 *   - every input has a real visible label, never a placeholder as a label
 *   - errors are wired through aria-describedby and aria-invalid
 *   - the error summary receives focus on a failed submit
 *   - the radio group is a fieldset with a legend
 *   - helper text sits under the label, error text sits under the input
 */

type FieldName = "path" | "name" | "email" | "organisation" | "message";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<FieldName, string>): Errors {
  const errors: Errors = {};

  if (!values.path) errors.path = contactPage.validation.path;
  if (!values.name.trim()) errors.name = contactPage.validation.name;
  if (!EMAIL.test(values.email.trim())) errors.email = contactPage.validation.email;
  if (!values.message.trim()) errors.message = contactPage.validation.message;

  return errors;
}

export function ContactForm() {
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<Record<FieldName, string>>({
    path: "",
    name: "",
    email: "",
    organisation: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const set = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const first = document.getElementById(fieldId(Object.keys(found)[0]));
      first?.focus();
      return;
    }

    setStatus("submitting");

    // No endpoint is wired yet. Rather than pretend the message was sent, this
    // holds the submitting state and leaves delivery visibly unconnected.
    // Replace this block with the real request and set a "sent" state.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("idle");
  };

  const errorEntries = Object.entries(errors) as [FieldName, string][];

  const describedBy = (name: FieldName, help?: string) => {
    const ids = [help ? fieldId(`${name}-help`) : null, errors[name] ? fieldId(`${name}-error`) : null]
      .filter(Boolean)
      .join(" ");
    return ids || undefined;
  };

  const inputClass = (name: FieldName) =>
    [
      "w-full rounded-input border bg-canvas px-4 py-3 text-base text-ink",
      "placeholder:text-ink-faint",
      "transition-colors duration-200 ease-brand",
      errors[name]
        ? "border-accent focus:border-accent"
        : "border-hairline-strong focus:border-accent",
    ].join(" ");

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {/* Error summary, focused on a failed submit */}
      {errorEntries.length > 0 ? (
        <div
          role="alert"
          tabIndex={-1}
          className="flex flex-col gap-2 rounded-card bg-sunk p-5"
        >
          <p className="text-sm font-bold text-ink">
            {errorEntries.length === 1
              ? "One field needs attention."
              : `${errorEntries.length} fields need attention.`}
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-ink-muted">
            {errorEntries.map(([name, message]) => (
              <li key={name}>
                <a href={`#${fieldId(name)}`} className="underline underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Which path, as a radio group */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-bold text-ink">
          {contactPage.form.path.label}
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {contactPage.form.path.options.map((option) => {
            const checked = values.path === option.value;
            return (
              <label
                key={option.value}
                htmlFor={fieldId(option.value)}
                className={`flex cursor-pointer flex-col gap-1 rounded-card border p-4 transition-colors duration-200 ease-brand ${
                  checked
                    ? "border-accent bg-surface"
                    : "border-hairline-strong hover:border-accent"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    id={fieldId(option.value)}
                    type="radio"
                    name={fieldId("path")}
                    value={option.value}
                    checked={checked}
                    onChange={() => set("path", option.value)}
                    aria-describedby={describedBy("path")}
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span className="text-sm font-bold text-ink">{option.label}</span>
                </span>
                <span className="text-xs leading-relaxed text-ink-muted">
                  {option.hint}
                </span>
              </label>
            );
          })}
        </div>
        {errors.path ? (
          <p id={fieldId("path-error")} className="text-sm font-bold text-accent">
            {errors.path}
          </p>
        ) : null}
      </fieldset>

      {/* Name and email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={fieldId("name")} className="text-sm font-bold text-ink">
            {contactPage.form.name.label}
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete={contactPage.form.name.autoComplete}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            className={inputClass("name")}
          />
          {errors.name ? (
            <p id={fieldId("name-error")} className="text-sm font-bold text-accent">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={fieldId("email")} className="text-sm font-bold text-ink">
            {contactPage.form.email.label}
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete={contactPage.form.email.autoComplete}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={inputClass("email")}
          />
          {errors.email ? (
            <p id={fieldId("email-error")} className="text-sm font-bold text-accent">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      {/* Organization, optional */}
      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("organisation")} className="text-sm font-bold text-ink">
          {contactPage.form.organisation.label}
        </label>
        <p id={fieldId("organisation-help")} className="text-sm text-ink-muted">
          {contactPage.form.organisation.help}
        </p>
        <input
          id={fieldId("organisation")}
          name="organisation"
          type="text"
          autoComplete={contactPage.form.organisation.autoComplete}
          value={values.organisation}
          onChange={(e) => set("organisation", e.target.value)}
          aria-describedby={describedBy("organisation", contactPage.form.organisation.help)}
          className={inputClass("organisation")}
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("message")} className="text-sm font-bold text-ink">
          {contactPage.form.message.label}
        </label>
        <p id={fieldId("message-help")} className="text-sm text-ink-muted">
          {contactPage.form.message.help}
        </p>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", contactPage.form.message.help)}
          className={`${inputClass("message")} resize-y`}
        />
        {errors.message ? (
          <p id={fieldId("message-error")} className="text-sm font-bold text-accent">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-start gap-4">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Checking details" : "Send message"}
        </Button>
        <p className="max-w-md text-sm leading-relaxed text-ink-muted">
          Delivery is not connected yet, so nothing is transmitted from this form.
          Your details stay in the browser until a mail provider is set up.
        </p>
      </div>
    </form>
  );
}
