import type { Metadata } from "next";
import ProfilePosts from "@/src/Components/Profile/ProfilePosts";
import type { Post } from "@/src/Components/Profile/ProfilePosts";
import { getServerSession } from "@/src/lib/auth";
import { getPostsByUserId, getPosts } from "@/src/services/postsService";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Posts",
  description: "Manage your submitted posts and destinations on TravelSpot.",
};

export default async function PostsPage() {
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

  return <ProfilePosts initialPosts={posts} />;
}
