import { serverMutation, serverPatch } from "@/src/core/server";

export const addOrUpdateRating = async (ratingData: Record<string, unknown>) => {
  return await serverMutation("ratings", ratingData);
};

export const updateRating = async (ratingData: Record<string, unknown> & { id: string }) => {
  return await serverPatch(`ratings/${ratingData.id}`, ratingData);
};
