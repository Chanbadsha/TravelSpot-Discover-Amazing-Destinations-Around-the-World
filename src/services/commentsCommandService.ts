import { serverDelete, serverMutation, serverPatch } from "@/src/core/server";

export const addComment = async (commentData: Record<string, unknown>) => {
  return await serverMutation("comments", commentData);
};

export const updateComment = async (commentData: Record<string, unknown> & { id: string }) => {
  return await serverPatch(`comments/${commentData.id}`, commentData);
};

export const deleteComment = async (commentId: string) => {
  return await serverDelete(`comments/${commentId}`, {});
};
