import type { Metadata } from "next";
import Blog from "@/src/Components/Blog/Blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read travel stories, tips, and guides from explorers around the world.",
};

export default function BlogPage() {
  return <Blog />;
}
