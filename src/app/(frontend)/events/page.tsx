import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Masterclasses, workshops, corporate training and live events.",
};

export default function EventsPage() {
  return <div className="min-h-[60vh] bg-canvas" />;
}
