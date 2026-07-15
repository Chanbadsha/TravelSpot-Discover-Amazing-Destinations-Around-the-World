import type { Metadata } from "next";
import AdminProfile from "@/src/Components/Admin/AdminProfile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Profile",
  description: "View and edit your admin profile on TravelSpot.",
};

export default function AdminProfilePage() {
  return <AdminProfile />;
}
