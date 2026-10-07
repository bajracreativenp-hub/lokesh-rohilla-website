import type { Metadata } from "next";

import { CheckoutView } from "@/components/commerce/checkout-view";
import { PageHero, PageSection } from "@/components/pages/shared";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and delivery details.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        headline="Checkout."
        lede="Your basket and delivery details. Payment is not yet connected, so nothing can be charged from this page."
      />
      <PageSection tone="canvas" bordered>
        <CheckoutView />
      </PageSection>
    </>
  );
}
