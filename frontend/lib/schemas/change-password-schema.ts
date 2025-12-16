import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(8, "Current Password must be at least 8 characters.")
      .max(
        64,
        "The current password must consist of no more than 64 characters."
      )
      .optional()
      .or(z.literal("")),
    newPassword: z
      .string()
      .trim()
      .min(1, "New Password is required.")
      .min(8, "New Password must be at least 8 characters.")
      .max(64, "The new password must consist of no more than 64 characters."),
    confirmNewPassword: z
      .string()
      .trim()
      .min(1, "Confirm New Password is required.")
      .min(8, "Confirm New Password must be at least 8 characters.")
      .max(
        64,
        "The confirm new password must consist of no more than 64 characters."
      ),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });
