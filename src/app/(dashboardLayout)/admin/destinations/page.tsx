import type { Metadata } from "next";
import AdminDestinations from "@/src/Components/Admin/AdminDestinations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Destinations",
  description: "Review, verify, and manage tourist destinations on TravelSpot.",
};

export default function DestinationsPage() {
  return <AdminDestinations />;
}
