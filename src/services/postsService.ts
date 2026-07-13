import { serverFetch } from "@/src/core/server";

export const getPosts = async (query: Record<string, string> = {}) => {
  return await serverFetch("posts", query);
};

export const getPostById = async (postId: string) => {
  return await serverFetch(`posts/${postId}`);
};

export const getPostsByUserId = async (userId: string) => {
  return await serverFetch("posts", { userId });
};
