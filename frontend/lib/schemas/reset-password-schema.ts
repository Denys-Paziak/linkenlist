import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, "New Password is required.")
      .min(8, "New Password must be at least 8 characters.")
      .max(64, "The new password must consist of no more than 64 characters."),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Confirm New Password is required.")
      .min(8, "Confirm New Password must be at least 8 characters.")
      .max(
        64,
        "The confirm new password must consist of no more than 64 characters."
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
