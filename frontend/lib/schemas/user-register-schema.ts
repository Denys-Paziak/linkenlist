import { z } from "zod";

export const userRegisterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email({ message: "Enter a valid email address." }),
    password: z
      .string()
      .trim()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(64, "The password must consist of no more than 64 characters."),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Confirm Password is required.")
      .min(8, "Confirm Password must be at least 8 characters.")
      .max(
        64,
        "The confirm password must consist of no more than 64 characters."
      ),

    terms: z.boolean().refine((val) => val === true, {
      message: "Terms and conditions must be accepted.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["password"],
  });
