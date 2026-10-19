import type { Metadata } from "next";

import { ContentPage } from "@/components/pages/content-page";
import { pageByHref } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch, book a consultation, or bring Lokesh to your organization.",
};

export default function Page() {
  const page = pageByHref("/contact");

  /* Every page in this architecture is registered in page-content.ts. If one
     ever is not, fail the build rather than rendering an empty shell. */
  if (!page) {
    throw new Error(
      "No page definition for /contact. Add it to page-content.ts before routing to it.",
    );
  }

  return <ContentPage page={page} />;
}
