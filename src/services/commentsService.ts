import { serverFetch } from "@/src/core/server";

export const getComments = async (query: Record<string, string> = {}) => {
  return await serverFetch("comments", query);
};

export const getCommentsByDestinationId = async (destinationId: string) => {
  return await serverFetch("comments", { destinationId });
};

export const getCommentsByUserId = async (userId: string) => {
  return await serverFetch("comments", { userId });
};
