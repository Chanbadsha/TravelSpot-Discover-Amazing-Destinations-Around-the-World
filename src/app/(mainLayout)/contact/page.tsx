import type { Metadata } from "next";
import Contact from "@/src/Components/Contact/Contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the TravelSpot team. We'd love to hear from you.",
};

export default function ContactPage() {
  return <Contact />;
}
