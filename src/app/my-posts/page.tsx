import type { Metadata } from "next";
import ProfilePosts from "@/src/Components/Profile/ProfilePosts";

export const metadata: Metadata = {
  title: "My Posts",
  description: "Manage your submitted posts and destinations on TravelSpot.",
};

export default async function PostsPage() {
  return <ProfilePosts />;
}
