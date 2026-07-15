import type { Metadata } from "next";
import ProfilePage from "@/src/Components/Profile/ProfilePage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and edit your TravelSpot profile.",
};

export default function UserProfilePage() {
  return <ProfilePage />;
}
