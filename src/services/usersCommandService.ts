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

export const suspendUser = async (userId: string) => {
  return await serverPatch(`users/${userId}`, { status: "suspended" });
};

export const unsuspendUser = async (userId: string) => {
  return await serverPatch(`users/${userId}`, { status: "active" });
};

export const setUserRole = async (userId: string, role: string) => {
  return await serverPatch(`users/${userId}`, { role });
};
