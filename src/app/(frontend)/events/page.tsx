import type { Metadata } from "next";

import { ContentPage } from "@/components/pages/content-page";
import { pageByHref, type PageDef } from "@/lib/page-content";
import { getLiveEvents, extractTextFromLexical } from "@/lib/cms";
import { formPresets } from "@/lib/forms";
import type { FormField } from "@/components/pages/leads/generic-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Masterclasses, workshops, corporate training and live events.",
};

export default async function Page() {
  const basePage = pageByHref("/events");

  if (!basePage) {
    throw new Error(
      "No page definition for /events. Add it to page-content.ts before routing to it.",
    );
  }

  const liveEvents = await getLiveEvents();

  if (!liveEvents || liveEvents.length === 0) {
    return <ContentPage page={basePage} />;
  }

  const dynamicEventCards = liveEvents.map((e) => {
    const dateStr = e.date
      ? new Date(e.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Date TBA";

    const locLabel =
      e.locationType === "in-person"
        ? "In-Person"
        : e.locationType === "virtual"
        ? "Live Online"
        : "Hybrid";

    const meta = `${dateStr} • ${locLabel} • ${e.venue}`;
    const body =
      typeof e.description === "string" && e.description.trim()
        ? e.description.trim()
        : extractTextFromLexical(e.description) ||
          "Executive working session and live diagnostic with Lokesh Rohilla.";

    return {
      title: e.title,
      meta,
      body,
      href: e.registrationUrl || "/events#event-registration",
    };
  });

  // Build dynamic dropdown options for the event registration form
  const defaultEventOptions =
    (formPresets.event.fields.find((f) => f.kind === "select") as { options?: string[] })
      ?.options || [];
  const liveEventTitles = liveEvents.map((e) => `${e.title} (${e.venue})`);
  const combinedOptions = Array.from(new Set([...liveEventTitles, ...defaultEventOptions]));

  const customEventFields: FormField[] = formPresets.event.fields.map((field) => {
    if (field.kind === "select" && field.id === "er-event") {
      return {
        ...field,
        options: combinedOptions,
      };
    }
    return field;
  });

  const updatedSections = basePage.sections.map((section) => {
    if (section.id === "upcoming-events") {
      return {
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.kind === "cards") {
            return {
              ...block,
              items: [...dynamicEventCards, ...block.items],
            };
          }
          return block;
        }),
      };
    }

    if (section.id === "event-registration") {
      return {
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.kind === "form") {
            return {
              ...block,
              fields: customEventFields,
            };
          }
          return block;
        }),
      };
    }

    return section;
  });

  const dynamicPage: PageDef = {
    ...basePage,
    sections: updatedSections,
  };

  return <ContentPage page={dynamicPage} />;
}
