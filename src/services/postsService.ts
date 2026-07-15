import { serverFetch } from "@/src/core/server";

export const getPosts = async (query: Record<string, string> = {}) => {
  return await serverFetch("places", query);
};

export const getPostById = async (postId: string) => {
  return await serverFetch(`places/${postId}`);
};

export const getPostsByUserId = async (userId: string) => {
  return await serverFetch(`places/user/${userId}`);
};

export const getPostsByCreatorId = async (creatorId: string) => {
  return await serverFetch(`places/user/${creatorId}`);
};
