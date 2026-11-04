import type { Metadata } from "next";

import { ContentPage } from "@/components/pages/content-page";
import { pageByHref, type PageDef } from "@/lib/page-content";
import { getLivePosts, extractTextFromLexical } from "@/lib/cms";
import type { Article } from "@/components/pages/blog-search";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing and video on business, leadership and self development.",
};

export default async function Page() {
  const basePage = pageByHref("/blog");

  if (!basePage) {
    throw new Error(
      "No page definition for /blog. Add it to page-content.ts before routing to it.",
    );
  }

  const livePosts = await getLivePosts();

  if (!livePosts || livePosts.length === 0) {
    return <ContentPage page={basePage} />;
  }

  const formatCategoryLabel = (cat: string) => {
    switch (cat) {
      case "business-strategy":
        return "Business Strategy";
      case "leadership":
        return "Leadership";
      case "mindset":
        return "Mindset & Motivation";
      case "case-studies":
        return "Case Studies";
      case "press":
        return "Press & Insights";
      default:
        return "Article";
    }
  };

  const dynamicArticles: Article[] = livePosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    categoryLabel: formatCategoryLabel(p.category),
    standfirst:
      p.excerpt ||
      extractTextFromLexical(p.content).slice(0, 160) ||
      "Field notes and diagnostic essays by Lokesh Rohilla.",
    readTime: `${p.readingTime || 5} min read`,
  }));

  const updatedSections = basePage.sections.map((section) => {
    if (section.id === "search") {
      return {
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.kind === "search") {
            return {
              ...block,
              articles: dynamicArticles,
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
