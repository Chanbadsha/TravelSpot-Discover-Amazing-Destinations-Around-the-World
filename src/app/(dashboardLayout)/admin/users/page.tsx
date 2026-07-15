import type { Metadata } from "next";
import AdminUsers from "@/src/Components/Admin/AdminUsers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Users",
  description: "View and manage all registered users on TravelSpot.",
};

export default function UsersPage() {
  return <AdminUsers />;
}
