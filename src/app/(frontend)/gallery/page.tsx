import type { Metadata } from "next";

import { ContentPage } from "@/components/pages/content-page";
import { pageByHref, type PageDef } from "@/lib/page-content";
import { getLiveGallery } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photography and video from the work, the sessions and the stage.",
};

export default async function Page() {
  const basePage = pageByHref("/gallery");

  if (!basePage) {
    throw new Error(
      "No page definition for /gallery. Add it to page-content.ts before routing to it.",
    );
  }

  const liveGallery = await getLiveGallery();

  if (!liveGallery || liveGallery.length === 0) {
    return <ContentPage page={basePage} />;
  }

  const dynamicFrames = liveGallery
    .filter((g) => g.image && typeof g.image === "object" && g.image.url)
    .map((g) => ({
      label: g.title,
      meta:
        g.caption ||
        (g.category === "speaking"
          ? "Keynotes & Speaking"
          : g.category === "workshops"
          ? "Corporate Workshops"
          : "Moments from the field"),
      spec: "1600x1200",
      ratio: "4 / 3",
      src: g.image!.url,
      alt: g.image?.alt || g.title,
    }));

  const updatedSections = basePage.sections.map((section) => {
    if (section.id === "event-photos") {
      return {
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.kind === "frames") {
            return {
              ...block,
              items: [...dynamicFrames, ...block.items],
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
