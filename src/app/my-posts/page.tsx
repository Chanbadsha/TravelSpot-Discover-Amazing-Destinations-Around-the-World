import ProfilePosts from "@/src/Components/Profile/ProfilePosts";
import { getServerSession } from "@/src/lib/auth";

export default async function PostsPage() {
  return <ProfilePosts />;
}
