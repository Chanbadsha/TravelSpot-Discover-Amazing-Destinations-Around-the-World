import type { Metadata } from "next";
import UserDashboard from "@/src/Components/UserDashboard/UserDashboard";
import type { Post } from "@/src/Components/UserDashboard/UserDashboard";
import { getServerSession } from "@/src/lib/auth";
import { getPostsByUserId, getPosts } from "@/src/services/postsService";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your TravelSpot dashboard — manage your posts and profile.",
};

export default async function UserPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  let posts: Post[] = [];
  const result = await getPostsByUserId(userId as string);
  posts = result?.data ?? [];

  if (posts.length === 0) {
    const all = await getPosts();
    const allData = all?.data ?? [];
    posts = allData.filter((p: Post) => p.creatorId === userId);
  }

  return <UserDashboard initialPosts={posts} />;
}
