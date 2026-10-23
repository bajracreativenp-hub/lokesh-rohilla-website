import type { FormField } from "@/components/pages/leads/generic-form";

/**
 * FORM PRESETS
 *
 * Every lead capture form on the site, in one place, connected to /api/leads.
 */

export type FormPreset = {
  fields: FormField[];
  /** Rendered under the form as a confirmation/privacy note. */
  pending: string;
};

export const contactPage = {
  form: {
    path: {
      label: "What is this about?",
      type: "radio" as const,
      required: true,
      options: [
        { value: "business", label: "My business", hint: "Strategy, operations, systems, sales or marketing." },
        { value: "leadership", label: "My team", hint: "Leadership, communication, performance or culture." },
        { value: "personal", label: "Myself", hint: "Mindset, career, confidence or personal growth." },
      ],
    },
    name: {
      label: "Name",
      type: "text" as const,
      required: true,
      autoComplete: "name" as const,
    },
    email: {
      label: "Email",
      type: "email" as const,
      required: true,
      autoComplete: "email" as const,
    },
    organisation: {
      label: "Organization",
      type: "text" as const,
      required: false,
      autoComplete: "organization" as const,
      help: "Optional. Useful if this is about a team or a company.",
    },
    message: {
      label: "What is happening?",
      type: "textarea" as const,
      required: true,
      help: "The more concrete this is, the more useful the first reply will be.",
    },
  },

  validation: {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    message: "Please describe what is happening, even briefly.",
    path: "Please choose which of the three this is about.",
  },
} as const;

export const formPresets: Record<string, FormPreset> = {
  contact: {
    pending:
      "Every enquiry is reviewed directly by Lokesh Rohilla and his executive office within two business days.",
    fields: [],
  },

  consultation: {
    pending:
      "Once submitted, our office will reach out within 48 hours to coordinate a 30-minute diagnostic scoping call.",
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
      "Corporate training and leadership workshop enquiries receive a tailored scoping response within two business days.",
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
      "Registered attendees receive session joining details, preparation notes, and calendar invites via email ahead of the live room.",
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
      "Seat reservations are confirmed by email and WhatsApp along with venue details and pre-session reading material.",
    fields: [
      {
        kind: "select",
        id: "er-event",
        label: "Which event",
        help: "Choose the upcoming masterclass, intensive, or forum you wish to attend.",
        options: [
          "The Systems & Scale Masterclass (Live Online)",
          "Command the Room: Public Speaking Intensive (The Bookwishes Club)",
          "Executive Decision & Alignment Forum (Leadership Roundtable)",
        ],
        locked: false,
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
      "Sent occasionally when a new essay, diagnostic framework, or live cohort opens. Unsubscribe in one click anytime.",
    fields: [
      { kind: "text", id: "nl-name", label: "Name", autoComplete: "name" },
      { kind: "email", id: "nl-email", label: "Email", autoComplete: "email", required: true },
      { kind: "submit", label: "Subscribe" },
    ],
  },
};
