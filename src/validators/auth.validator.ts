import { z } from "zod";

export const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(50, { message: "Name must be under 50 characters" });

export const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .min(1, { message: "Email cannot be empty" })
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Include at least one uppercase letter (A-Z)")
  .regex(/[a-z]/, "Include at least one lowercase letter (a-z)")
  .regex(/[0-9]/, "Include at least one number (0-9)")
  .regex(/[@$!%*?&#]/, "Include at least one special character (@$!%*?&#)");

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(1, { message: "Password enter your password" }),
});
