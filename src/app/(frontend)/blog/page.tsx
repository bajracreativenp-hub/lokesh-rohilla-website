import type { Metadata } from "next";

import { ContentPage } from "@/components/pages/content-page";
import { pageByHref, type PageDef } from "@/lib/page-content";
import { getLivePosts, extractTextFromLexical } from "@/lib/cms";
import type { Article } from "@/components/pages/blog-search";
import { UNSPLASH } from "@/lib/content";

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

  const mapCategorySlug = (cat: string) => {
    switch (cat) {
      case "business-strategy":
        return "business-growth";
      case "leadership":
        return "leadership";
      case "mindset":
        return "mindset-motivation";
      case "case-studies":
        return "public-speaking";
      case "press":
        return "personal-development";
      default:
        return cat;
    }
  };

  const formatCategoryLabel = (cat: string) => {
    switch (cat) {
      case "business-strategy":
      case "business-growth":
        return "Business Growth";
      case "leadership":
        return "Leadership";
      case "mindset":
      case "mindset-motivation":
        return "Mindset & Motivation";
      case "case-studies":
        return "Case Studies";
      case "press":
        return "Press & Insights";
      default:
        return "Article";
    }
  };

  const dynamicArticles: Article[] = livePosts.map((p) => {
    const bodyText = extractTextFromLexical(p.content);
    const hasImage =
      p.featuredImage && typeof p.featuredImage === "object" && p.featuredImage.url;

    return {
      slug: p.slug,
      title: p.title,
      category: mapCategorySlug(p.category),
      categoryLabel: formatCategoryLabel(p.category),
      standfirst:
        p.excerpt ||
        bodyText.slice(0, 180) ||
        "Field notes and diagnostic essays by Lokesh Rohilla.",
      body: bodyText || p.excerpt || "",
      image: hasImage ? p.featuredImage!.url : undefined,
      readTime: `${p.readingTime || 5} min read`,
    };
  });

  const dynamicFrames = livePosts.slice(0, 6).map((p) => {
    const hasImage =
      p.featuredImage && typeof p.featuredImage === "object" && p.featuredImage.url;
    return {
      label: p.title,
      meta: `${formatCategoryLabel(p.category)} • ${p.readingTime || 5} min read`,
      spec: "1600x900",
      ratio: "16 / 9",
      src: hasImage
        ? p.featuredImage!.url
        : `${UNSPLASH}1501618669935-18b6ecb13d6d?auto=format&fit=crop&w=1600&q=80`,
      alt: (hasImage ? p.featuredImage?.alt : undefined) || p.title,
    };
  });

  const updatedSections = basePage.sections.map((section) => {
    if (section.id === "all-articles") {
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

    if (section.id === "categories" || section.id === "search") {
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
