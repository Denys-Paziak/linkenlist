import { z } from "zod";

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .trim()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(64, "The password must consist of no more than 64 characters."),
});
