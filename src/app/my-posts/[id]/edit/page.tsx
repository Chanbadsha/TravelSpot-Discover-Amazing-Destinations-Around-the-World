import type { Metadata } from "next";
import ProfilePostEdit from "@/src/Components/Profile/ProfilePostEdit";

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit your travel post on TravelSpot.",
};

export default function EditPostPage() {
  return <ProfilePostEdit />;
}
