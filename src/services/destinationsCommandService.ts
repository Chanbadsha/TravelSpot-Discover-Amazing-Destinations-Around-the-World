import { serverDelete, serverMutation, serverPatch } from "@/src/core/server";

export const addDestination = async (destinationData: Record<string, unknown>): Promise<unknown> => {
  return await serverMutation("destinations", destinationData);
};

export const updateDestination = async (destinationData: Record<string, unknown> & { id: string }) => {
  const { id, ...updateData } = destinationData;
  return await serverPatch(`destinations/${id}`, updateData);
};

export const deleteDestination = async (destinationId: string) => {
  return await serverDelete(`destinations/${destinationId}`, {});
};

export const verifyDestination = async (id: string) => {
  return await serverPatch(`destinations/${id}`, { status: "verified" });
};

export const rejectDestination = async (id: string, reason: string) => {
  return await serverPatch(`destinations/${id}`, { status: "cancelled", rejectionReason: reason });
};

export const saveDestination = async (userId: string, destinationId: string, status: string) => {
  return await serverMutation("saved-destinations", { userId, destinationId, status });
};

export const removeSavedDestination = async (userId: string, destinationId: string) => {
  return await serverDelete("saved-destinations", { userId, destinationId });
};
