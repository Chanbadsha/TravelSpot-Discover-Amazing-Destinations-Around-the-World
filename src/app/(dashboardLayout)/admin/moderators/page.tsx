import type { Metadata } from "next";
import AdminModerators from "@/src/Components/Admin/AdminModerators";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Moderators",
  description: "View and manage moderators on TravelSpot.",
};

export default function ModeratorsPage() {
  return <AdminModerators />;
}
