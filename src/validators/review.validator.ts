import { z } from "zod";

export const commentSchema = z
  .string()
  .trim()
  .min(1, "Comment is required")
  .max(50, "Comment should be less than 50 characters");

export const ratingSchema = z
  .number()
  .min(0, "Rating must be at least 0")
  .max(5, "Rating must be at most 5");

export const createReviewSchema = z.object({
  rating: ratingSchema,
  comment: commentSchema,
});

export const updateReviewSchema = createReviewSchema.partial();
