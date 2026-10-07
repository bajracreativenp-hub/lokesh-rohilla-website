import type { FormField } from "@/components/pages/leads/generic-form";

/**
 * FORM PRESETS
 *
 * Every lead capture form on the site, in one place, so all of them behave
 * identically and there is a single place to change any of it.
 *
 * SUBMISSION IS INERT AND THAT IS DELIBERATE
 *
 * Not one of these forms has somewhere to send anything. There is no email
 * provider, no form service, and no CRM. A form that looks like it worked and
 * silently discarded an enquiry is far worse than one that says it is not
 * connected, so every preset carries a `pending` line naming the missing
 * dependency, and that line renders directly beneath the form.
 *
 * The contact preset is the exception in one respect: it is the fully validated
 * interactive form in `contact-form.tsx`, with real error states. It is
 * referenced here only so the shape stays consistent.
 */

export type FormPreset = {
  fields: FormField[];
  /** Rendered visibly under the form. Names what is missing, never fakes it. */
  pending: string;
};

export const formPresets: Record<string, FormPreset> = {
  contact: {
    pending:
      "[FORM DELIVERY NOT YET CONNECTED] The form is fully validated and reports errors accurately. Nothing is transmitted and nothing is stored.",
    fields: [],
  },

  consultation: {
    pending:
      "[CALENDAR AND FORM DELIVERY NOT YET CONNECTED] No time is booked and no invitation is sent from this page.",
    fields: [
      { kind: "text", id: "bc-name", label: "Full name", autoComplete: "name", required: true },
      { kind: "email", id: "bc-email", label: "Email", autoComplete: "email", required: true },
      {
        kind: "textarea",
        id: "bc-topic",
        label: "What would you like to cover",
        help: "One problem is a better starting point than a list. Bring it as it is, not as it has been described to you.",
        rows: 5,
      },
      { kind: "submit", label: "Request a time" },
    ],
  },

  corporate: {
    pending:
      "[FORM DELIVERY NOT YET CONNECTED] This enquiry is not transmitted and nothing is stored.",
    fields: [
      { kind: "text", id: "ct-name", label: "Your name", autoComplete: "name", required: true },
      {
        kind: "text",
        id: "ct-company",
        label: "Organization",
        autoComplete: "organization",
      },
      { kind: "email", id: "ct-email", label: "Work email", autoComplete: "email", required: true },
      {
        kind: "number",
        id: "ct-people",
        label: "How many people",
        min: 1,
        help: "Roughly. It helps to know whether this is one team or several.",
      },
      {
        kind: "radio",
        name: "ct-area",
        legend: "What is this about",
        options: [
          { value: "leadership", label: "Leadership" },
          { value: "team", label: "Team development" },
          { value: "communication", label: "Communication" },
          { value: "performance", label: "Performance" },
          { value: "culture", label: "Culture" },
        ],
      },
      {
        kind: "textarea",
        id: "ct-detail",
        label: "The specific problem",
        help: "What is actually happening, and roughly when you need it.",
        rows: 5,
      },
      { kind: "submit", label: "Send enquiry" },
    ],
  },

  masterclass: {
    pending:
      "[EMAIL PROVIDER NOT YET CONNECTED] Your registration is not transmitted and no confirmation is sent.",
    fields: [
      { kind: "text", id: "mc-name", label: "Full name", autoComplete: "name", required: true },
      { kind: "email", id: "mc-email", label: "Email", autoComplete: "email", required: true },
      {
        kind: "text",
        id: "mc-company",
        label: "Company",
        help: "Optional. Useful when the session is business specific.",
        autoComplete: "organization",
      },
      {
        kind: "textarea",
        id: "mc-problem",
        label: "What is the one problem you want addressed?",
        help: "The more specific this is, the more useful the session will be for you.",
        rows: 5,
      },
      { kind: "submit", label: "Register free" },
    ],
  },

  event: {
    pending:
      "[NO CONFIRMED DATES, PAYMENT PROVIDER OR EMAIL PROVIDER] Nothing is registered, charged or confirmed from this form.",
    fields: [
      {
        kind: "select",
        id: "er-event",
        label: "Which event",
        help: "The list stays empty until dates are confirmed. Nothing is offered for a date that might move.",
        options: ["No dates confirmed yet"],
        locked: true,
      },
      { kind: "text", id: "er-name", label: "Full name", autoComplete: "name", required: true },
      { kind: "email", id: "er-email", label: "Email", autoComplete: "email", required: true },
      {
        kind: "tel",
        id: "er-phone",
        label: "Mobile",
        help: "Used for the WhatsApp confirmation only.",
        autoComplete: "tel",
      },
      {
        kind: "text",
        id: "er-org",
        label: "Organization",
        autoComplete: "organization",
      },
      { kind: "submit", label: "Register" },
    ],
  },

  newsletter: {
    pending:
      "[EMAIL PROVIDER AND SENDING ADDRESS NOT YET CONFIRMED] Nothing is transmitted from this form and no address is stored.",
    fields: [
      { kind: "text", id: "nl-name", label: "Name", autoComplete: "name" },
      { kind: "email", id: "nl-email", label: "Email", autoComplete: "email", required: true },
      { kind: "submit", label: "Subscribe" },
    ],
  },
};