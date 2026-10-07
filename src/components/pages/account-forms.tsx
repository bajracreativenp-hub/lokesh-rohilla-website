"use client";

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
 *
 * Client component only because it renders a <form> with an onSubmit handler.
 * Split out of the page so the page itself stays a Server Component.
 *
 * Both forms are inert. There is no auth provider, no user store and no
 * password handling anywhere in this codebase. A plausible looking sign-in form
 * that silently goes nowhere would be worse than saying so.
 */
export function AccountForms() {
  const forms: {
    id: string;
    title: string;
    submit: string;
    fields: Field[];
  }[] = [
    {
      id: "login",
      title: "Sign in",
      submit: "Sign in",
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

          <form
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
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
                  disabled
                  className="rounded-input border border-hairline-strong bg-sunk px-4 py-3 text-base text-ink-faint placeholder:text-ink-faint"
                />
              </div>
            ))}

            <Button type="submit" disabled className="mt-2 self-start">
              {form.submit}
            </Button>
          </form>

          <PendingNote>
            [AUTHENTICATION PROVIDER NOT YET CONNECTED] Fields are disabled
            deliberately. No credentials are collected, transmitted or stored.
          </PendingNote>
        </section>
      ))}
    </div>
  );
}
