import { serverFetch } from "@/src/core/server";

export const getDestinations = async (query: Record<string, string> = {}) => {
  return await serverFetch("places", query);
};

export const getDestinationById = async (id: string) => {
  return await serverFetch(`places/${id}`);
};

export const getDestinationsByUserId = async (userId: string) => {
  return await serverFetch("destinations", { userId });
};

export const getDestinationsByCategory = async (category: string) => {
  return await serverFetch("destinations", { category });
};

export const getDestinationsByStatus = async (status: string) => {
  return await serverFetch("destinations", { status });
};

export const getSavedDestinations = async (userId: string) => {
  return await serverFetch("saved-destinations", { userId });
};
