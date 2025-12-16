import { z } from "zod";

export const changeEmailSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .min(1, "Current Password is required.")
    .min(8, "Current Password must be at least 8 characters.")
    .max(
      64,
      "The current password must consist of no more than 64 characters."
    ),
  newEmail: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email({ message: "Enter a valid email address." }),
});
