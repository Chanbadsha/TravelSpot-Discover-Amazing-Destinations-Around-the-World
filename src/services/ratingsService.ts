import { serverFetch } from "@/src/core/server";

export const getRatings = async (query: Record<string, string> = {}) => {
  return await serverFetch("ratings", query);
};

export const getRatingsByDestinationId = async (destinationId: string) => {
  return await serverFetch("ratings", { destinationId });
};

export const getRatingsByUserId = async (userId: string) => {
  return await serverFetch("ratings", { userId });
};
