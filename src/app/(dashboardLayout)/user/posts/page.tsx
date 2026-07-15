import ProfilePosts from "@/src/Components/Profile/ProfilePosts";
import type { Post } from "@/src/Components/Profile/ProfilePosts";
import { getServerSession } from "@/src/lib/auth";
import { getPostsByUserId } from "@/src/services/postsService";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  let posts: Post[] = [];
  try {
    const result = await getPostsByUserId(userId as string);
    posts = result?.data ?? [];
  } catch {
    // API error — handled gracefully by ProfilePosts
  }

  return <ProfilePosts initialPosts={posts} />;
}
