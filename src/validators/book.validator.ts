import { z } from "zod";

export const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(50, "Title should be less then 50 characters");

export const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description should be less then 500 characters")
  .optional();

export const idSchema = z.string().trim().min(1, "Id is Required");

export const createBookSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  genre: titleSchema.optional(),
});

export const updateBookSchema = createBookSchema.partial();
