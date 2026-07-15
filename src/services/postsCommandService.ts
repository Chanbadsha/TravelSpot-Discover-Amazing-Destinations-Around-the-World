import { serverDelete, serverMutation, serverPatch } from "@/src/core/server";

export const addPost = async (postData: Record<string, unknown>) => {
  return await serverMutation("places", postData);
};

export const updatePost = async (postData: Record<string, unknown> & { id: string }) => {
  const { id, ...updateData } = postData;
  return await serverPatch(`places/${id}`, updateData);
};

export const deletePost = async (postId: string) => {
  return await serverDelete(`places/${postId}`, {});
};
