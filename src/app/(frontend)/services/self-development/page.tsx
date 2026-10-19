import type { Metadata } from "next";

import { ContentPage } from "@/components/pages/content-page";
import { pageByHref } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Self-Development Programs",
  description:
    "A self development center founded in 2021. Learning that changes how you work.",
};

export default function Page() {
  const page = pageByHref("/services/self-development");

  /* Every page in this architecture is registered in page-content.ts. If one
     ever is not, fail the build rather than rendering an empty shell. */
  if (!page) {
    throw new Error(
      "No page definition for /services/self-development. Add it to page-content.ts before routing to it.",
    );
  }

  return <ContentPage page={page} />;
}
