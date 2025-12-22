import { z } from "zod";

export const emailTemplatesSchema = z.object({
  emailVerification: z
    .string()
    .trim()
    .min(1, "Email Verification is required.")
    .max(5000, "Max 5000 characters."),

  passwordReset: z
    .string()
    .trim()
    .min(1, "Password Reset is required.")
    .max(5000, "Max 5000 characters."),
});
