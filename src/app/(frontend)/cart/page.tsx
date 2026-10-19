import type { Metadata } from "next";

import { CartView } from "@/components/commerce/cart-view";
import { PageHero, PageSection } from "@/components/pages/shared";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your basket before checkout.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        headline="Your cart."
        lede="Items you have added. Quantities can be changed here, and the basket is kept on this device."
      />
      <PageSection tone="canvas" bordered>
        <CartView />
      </PageSection>
    </>
  );
}
