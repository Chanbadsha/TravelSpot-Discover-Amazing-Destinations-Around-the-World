import type { Metadata } from "next";
import ProfilePage from "@/src/Components/Profile/ProfilePage";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your TravelSpot profile.",
};

export default function Profile() {
  return <ProfilePage />;
}
