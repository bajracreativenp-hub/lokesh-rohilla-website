import type { Metadata } from "next";

import { ContentPage } from "@/components/pages/content-page";
import { pageByHref, type PageDef } from "@/lib/page-content";
import { getLiveProducts } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shop",
  description: "Books, workbooks and recorded programs.",
};

export default async function Page() {
  const basePage = pageByHref("/shop");

  if (!basePage) {
    throw new Error(
      "No page definition for /shop. Add it to page-content.ts before routing to it.",
    );
  }

  const liveProducts = await getLiveProducts();

  if (!liveProducts || liveProducts.length === 0) {
    return <ContentPage page={basePage} />;
  }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "INR":
        return "₹";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "USD":
      default:
        return "$";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "book":
        return "Book";
      case "course":
        return "Online Course";
      case "consultation":
        return "1-on-1 Consultation";
      case "workshop":
        return "Workshop Ticket";
      default:
        return "Resource";
    }
  };

  const dynamicFrames = liveProducts.map((p) => {
    const symbol = getCurrencySymbol(p.currency);
    const typeLabel = getTypeLabel(p.type);
    const hasImage = p.image && typeof p.image === "object" && p.image.url;

    return {
      label: p.title,
      meta: `${typeLabel} • ${symbol}${p.price}`,
      spec: "1200x1800",
      ratio: "2 / 3",
      src: hasImage
        ? p.image!.url
        : "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80",
      alt: (hasImage ? p.image?.alt : undefined) || p.title,
    };
  });

  const dynamicCards = liveProducts.map((p) => {
    const symbol = getCurrencySymbol(p.currency);
    const typeLabel = getTypeLabel(p.type);

    return {
      title: p.title,
      meta: `${typeLabel} • ${symbol}${p.price}`,
      body:
        p.description ||
        "Practical field guide and operational resource by Lokesh Rohilla.",
      href: p.externalBuyUrl || "/contact#contact-form",
    };
  });

  const featuredLiveCards = liveProducts
    .filter((p) => p.featured)
    .map((p) => {
      const symbol = getCurrencySymbol(p.currency);
      const typeLabel = getTypeLabel(p.type);
      return {
        title: p.title,
        meta: `Featured ${typeLabel} • ${symbol}${p.price}`,
        body:
          p.description ||
          "Directly recommended publication and diagnostic toolkit.",
        href: p.externalBuyUrl || "/contact#contact-form",
      };
    });

  const updatedSections = basePage.sections.map((section) => {
    if (section.id === "all-products") {
      return {
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.kind === "frames") {
            return {
              ...block,
              items: [...dynamicFrames, ...block.items],
            };
          }
          if (block.kind === "cards") {
            return {
              ...block,
              items: [...dynamicCards, ...block.items],
            };
          }
          return block;
        }),
      };
    }

    if (section.id === "featured" && featuredLiveCards.length > 0) {
      return {
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.kind === "cards") {
            return {
              ...block,
              items: [...featuredLiveCards, ...block.items],
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
