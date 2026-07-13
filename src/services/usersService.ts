import { serverFetch } from "@/src/core/server";

export const getUsers = async (query: Record<string, string> = {}) => {
  return await serverFetch("users", query);
};

export const getUserById = async (userId: string) => {
  return await serverFetch(`users/${userId}`);
};
