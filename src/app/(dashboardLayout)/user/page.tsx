import UserDashboard from "@/src/Components/UserDashboard/UserDashboard";
import type { Post } from "@/src/Components/UserDashboard/UserDashboard";
import { getServerSession } from "@/src/lib/auth";
import { getPostsByUserId } from "@/src/services/postsService";

export const dynamic = "force-dynamic";

export default async function UserPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  let posts: Post[] = [];
  try {
    const result = await getPostsByUserId(userId as string);
    posts = result?.data ?? [];
  } catch {
    // API error — user dashboard will show empty state gracefully
  }

  return <UserDashboard initialPosts={posts} />;
}
