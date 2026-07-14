import ProfilePosts from "@/src/Components/Profile/ProfilePosts";
import { getServerSession } from "@/src/lib/auth";
import { getPostsByUserId } from "@/src/services/postsService";

export default async function PostsPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;
  const result = await getPostsByUserId(userId as string);
  const data = result.data;

  return <ProfilePosts initialPosts={data} />;
}
