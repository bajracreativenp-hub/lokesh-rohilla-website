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
        lede="Review your selected items and confirm your delivery details to complete your order."
      />
      <PageSection tone="canvas" bordered>
        <CheckoutView />
      </PageSection>
    </>
  );
}
