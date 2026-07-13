import { serverDelete, serverMutation, serverPatch } from "@/src/core/server";

export const addPost = async (postData: Record<string, unknown>) => {
  return await serverMutation("posts", postData);
};

export const updatePost = async (postData: Record<string, unknown> & { id: string }) => {
  const { id, ...updateData } = postData;
  return await serverPatch(`posts/${id}`, updateData);
};

export const deletePost = async (postId: string) => {
  return await serverDelete(`posts/${postId}`, {});
};
