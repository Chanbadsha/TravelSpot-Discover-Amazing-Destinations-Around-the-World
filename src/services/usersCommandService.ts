import { serverDelete, serverMutation, serverPatch } from "@/src/core/server";

export const addUser = async (userData: Record<string, unknown>) => {
  return await serverMutation("users", userData);
};

export const updateUser = async (userData: Record<string, unknown> & { id: string }) => {
  const { id, ...updateData } = userData;
  return await serverPatch(`users/${id}`, updateData);
};

export const deleteUser = async (userId: string) => {
  return await serverDelete(`users/${userId}`, {});
};

export const suspendUser = async (userId: string, reason?: string) => {
  return await serverPatch(`users/${userId}`, { banned: true, bannedReason: reason || "" });
};

export const unsuspendUser = async (userId: string) => {
  return await serverPatch(`users/${userId}`, { banned: false });
};

export const setUserRole = async (userId: string, role: string) => {
  return await serverPatch(`users/${userId}`, { role });
};
