import UserDashboard from "@/src/Components/UserDashboard/UserDashboard";
import { getServerSession } from "@/src/lib/auth";
import { getPostsByUserId } from "@/src/services/postsService";

export default async function UserPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;
  const result = await getPostsByUserId(userId as string);
  const data = result.data;
  return <UserDashboard initialPosts={data} />;
}
