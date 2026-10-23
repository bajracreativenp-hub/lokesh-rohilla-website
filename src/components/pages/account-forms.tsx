"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PendingNote } from "@/components/ui/layout";

type Field = {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
};

/**
 * ACCOUNT FORM
 */
export function AccountForms() {
  const [submittedForm, setSubmittedForm] = useState<string | null>(null);

  const forms: {
    id: string;
    title: string;
    submit: string;
    note: string;
    fields: Field[];
  }[] = [
    {
      id: "login",
      title: "Sign in",
      submit: "Sign in",
      note: "Access your registered masterclasses, saved workbooks, and cohort schedules.",
      fields: [
        { id: "login-email", label: "Email", type: "email", autoComplete: "email" },
        {
          id: "login-password",
          label: "Password",
          type: "password",
          autoComplete: "current-password",
        },
      ],
    },
    {
      id: "signup",
      title: "Create an account",
      submit: "Create account",
      note: "Create a member profile to track event registrations, digital workbooks, and cohort updates.",
      fields: [
        { id: "signup-name", label: "Full name", type: "text", autoComplete: "name" },
        { id: "signup-email", label: "Email", type: "email", autoComplete: "email" },
        {
          id: "signup-password",
          label: "Password",
          type: "password",
          autoComplete: "new-password",
        },
      ],
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {forms.map((form) => (
        <section
          key={form.id}
          aria-label={form.title}
          className="flex flex-col gap-6 rounded-panel bg-surface p-7 md:p-10"
        >
          <h2 className="text-display-4">{form.title}</h2>

          {submittedForm === form.id ? (
            <div role="status" className="flex flex-col gap-3 rounded-card bg-sunk p-5 border border-hairline-strong">
              <p className="text-sm font-bold text-ink">
                {form.id === "login"
                  ? "Verification link sent to your email."
                  : "Account registration received."}
              </p>
              <p className="text-xs leading-relaxed text-ink-muted">
                Please check your inbox to verify your email address and access your member dashboard. For immediate assistance with a cohort or order, contact connect@lokeshrohilla.com.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedForm(null)}
                className="self-start text-xs font-bold text-accent underline underline-offset-4"
              >
                Back to form
              </button>
            </div>
          ) : (
            <form
              noValidate
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmittedForm(form.id);
              }}
            >
              {form.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label htmlFor={field.id} className="text-sm font-bold text-ink">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    className="rounded-input border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                  />
                </div>
              ))}

              <Button type="submit" className="mt-2 self-start">
                {form.submit}
              </Button>
            </form>
          )}

          <PendingNote>{form.note}</PendingNote>
        </section>
      ))}
    </div>
  );
}
