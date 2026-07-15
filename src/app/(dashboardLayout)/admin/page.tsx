import type { Metadata } from "next";
import AdminDashboardHome from "@/src/Components/Admin/AdminDashboardHome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage users, moderators, and destinations on TravelSpot.",
};

export default function AdminPage() {
  return <AdminDashboardHome />;
}
